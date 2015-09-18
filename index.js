//
// Configure all of this

var spacingMode = 'padding';

var breakpoints = [
	{	name: 'legacyphone',
		grid: {
			className: 'lp',
			columns: 1,
			spacing: 21,
			gutter: 40
		}
	},
	{ 	name: 'phone',
		minWidth: 480,
		grid: {
			//maxWidth: 480,
			className: 'ph',
			columns: 12,
			spacing: 21,
			gutter: 40
		}
	},
	{	name: 'tablet',
		minWidth: 641,
		grid: {
			className: 'tb',
			columns: 12,
			spacing: 21,
			gutter: 50
		}
	},
	{	name: 'desktop',
		minWidth: 769,
		static: true,
		grid: {
			className: 'dk',
			//maxWidth: 940,
			columns: 12,
			spacing: 21,
			gutter: 50
		}
	}
];

//
// Don't touch

var css = "";

function write(line) {
	css += line + "\n";
}

write("//");
write("// This file is auto-generated");
write("// To update, edit `generator.js` then run `make`");
write("");

write("$mq-responsive: true !default;");

var breakpointPositions = [];
for (var i = 1; i < breakpoints.length; ++i) {
	var bp = breakpoints[i];
	breakpointPositions.push(bp.name + ": " + bp.minWidth + "px");
}

write("$mq-breakpoints: ( " + breakpointPositions.join(", ") + " );");

var staticBreakpoint = breakpoints.filter(function(bp) { return bp.static; });
if (staticBreakpoint[0]) {
	write("$mq-static-breakpoint: " + staticBreakpoint[0].name + ";");
}

write("");

write("@import 'mixins/reset';");
write("@import 'mixins/helpers';")
write("@import 'mixins/mq';");
write("");

breakpoints.forEach(function(bp, ix) {

	var query;
	if (ix === 0) {
		query = "$until: " + breakpoints[1].name;
	} else if (ix === breakpoints.length - 1) {
		query = "$from: " + bp.name;
	} else {
		query = "$from: " + bp.name + ", $until: " + breakpoints[ix+1].name;
	}

	write("@mixin " + bp.name + "-only() {");
	write("    @include mq(" + query + ") { @content }");
	write("}");
	write("");

});

breakpoints.forEach(function(bp, ix) {

	write("@include " + bp.name + "-only() {");
	breakpoints.forEach(function(hiddenBp) {
		if (hiddenBp.name !== bp.name) {
			write("    ." + hiddenBp.name + "-only { display: none !important; }");
		}
	});
	write("    .no-" + bp.name + " { display: none !important; }");
	write("}");
	write("");

});

breakpoints.forEach(function(bp) {

	if (!bp.grid) {
		return;
	}

	var cn = bp.grid.className;
	var spacing = bp.grid.spacing;
	var absoluteSpacing = true;

	var gutter = ('gutter' in bp.grid)
					? (bp.grid.gutter)
					: (spacing / 2);

	var sectionPadding = 0;
	if (gutter > spacing / 2) {
		sectionPadding = gutter - (spacing / 2);
	}

	//
	// Generate mixins

	write("//");
	write("// " + bp.name);
	write("");

	// 1. section, e.g. mb-section--x
	write("@mixin " + cn + "-section--x {");
	write("    @include clearfix;");
	write("    width: 100%;");
	if (bp.grid.maxWidth) {
		write("    max-width: " + (bp.grid.maxWidth + (gutter * 2)) + "px;");	
	}
	write("    margin-left: auto;");
	write("    margin-right: auto;");
	write("    padding-left: " + sectionPadding + "px;");
	write("    padding-right: " + sectionPadding + "px;");
	write("}");
	write("");

	// 2. column, e.g. mb-c--x
	write("@mixin " + cn + "-c--x {");
	if (absoluteSpacing) {
		var halfSpacing = spacing / 2;
		write("    float: left;");
		write("    -webkit-box-sizing: border-box;");
		write("    -moz-box-sizing: border-box;");
		write("    box-sizing: border-box;");
		write("    -moz-background-clip: padding-box !important;");
		write("    -webkit-background-clip: padding-box !important;");
		if (spacingMode === 'border') {
			write("    background-clip: padding-box !important;");
			write("    border: 0px solid rgba(0,0,0,0);");
			write("    border-left-width: " + halfSpacing + "px;");
			write("    border-right-width: " + halfSpacing + "px;");	
		} else {
			write("    background-clip: content-box !important;");
			write("    padding-left: " + halfSpacing + "px;");
			write("    padding-right: " + halfSpacing + "px;");	
		}
	} else {
		write("    margin-left: " + spacing + "%");
	}
	if (!absoluteSpacing) {
		write("    &:first-child {");
		write("        margin-left: 0;");
		write("    }");
	}
	write("}");
	write("");

	// 3. column widths
	for (var i = 1; i <= bp.grid.columns; ++i) {
		var width;
		if (absoluteSpacing) {
			width = (100 / bp.grid.columns) * i;
		} else {
			var one = (100 - (spacing * (bp.grid.columns - 1))) / columns;
			width = (one * i) + (spacing * (i - 1));
		}
		
		write("@mixin " + cn + "-p" + i + "--x {");
		write("    margin-left: " + width + "%;");
		write("}");
		write("");
		
		write("@mixin " + cn + "-s" + i + "--x {");
		write("    width: " + width + "%;");
		write("}");
		write("");

	}

	// That's all of the helper mixins generated;
	// now lets's to do the non-semantic stuff.

	write("@include " + bp.name + "-only {");
	write("    .section { @include " + cn + "-section--x; }");
	write("    .c { @include " + cn + "-c--x; }");
	for (var i = 1; i <= bp.grid.columns; ++i) {
		write("    ." + cn + "-p" + i + " { @include " + cn + "-p" + i + "--x; }");
	}
	for (var i = 1; i <= bp.grid.columns; ++i) {
		write("    ." + cn + "-s" + i + " { @include " + cn + "-s" + i + "--x; }");
	}
	write("}");
	write("");

	// And now for the semantic stuff!

	if (bp.grid.semantic !== false) {

		write("@mixin " + cn + "-section { @include " + cn + "-section--x; }");
		write("");

		for (var i = 1; i <= bp.grid.columns; ++i) {
			write("@mixin " + cn + "-s" + i + " {");
			write("    @include " + bp.name + "-only {");
			write("        @include " + cn + "-c--x;");
			write("        @include " + cn + "-s" + i + "--x;");
			write("    }");
			write("}");
			write("");
		}

		for (var i = 1; i <= bp.grid.columns; ++i) {
			write("@mixin " + cn + "-p" + i + " {");
			write("    @include " + bp.name + "-only {");
			write("        @include " + cn + "-p" + i + "--x;");
			write("    }");
			write("}");
			write("");
		}

	}
	
});


process.stdout.write(css);