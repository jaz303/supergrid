var config = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8'));
var spacingMode = config.spacingMode || 'padding';
var breakpoints = config.breakpoints;
var useMq = false;
var defineClearfix = config.defineClearfix;

var css = "";

function write(line) {
	css += line + "\n";
}

if (defineClearfix !== false) {
	write("@mixin clearfix {");
	write("    &:after {");
	write("        content: ' ';");
	write("        visibility: hidden;");
	write("        display: block;");
	write("        height: 0;");
	write("        clear: both;");
	write("    }");
	write("}");
}

if (useMq) {
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
}

function _mediaQuery(bp) {
	if (useMq) {
		// generate mq
	} else {
		if (breakpoints.length === 1) {
			return "@media all";
		} else if (bp === 0) {
			return "@media all and (max-width: " + (breakpoints[bp+1].startWidth - 1) + "px)";
		} else if (bp === breakpoints.length - 1) {
			return "@media all and (min-width: " + breakpoints[bp].startWidth + "px)";
		} else {

		}
	}
}

write("");

// write("@import 'mixins/reset';");
// write("@import 'mixins/helpers';")
// write("@import 'mixins/mq';");
// write("");

//
// Generate mixins for helping with breakpoint media queries

breakpoints.forEach(function(bp, ix) {
	write("@mixin " + bp.name + "-only() {");
	if (useMq) {

	} else {
		write("    " + _mediaQuery(ix) + " { @content }");
	}
	write("}");
	write("");


	// var query;
	// if (ix === 0) {
	// 	query = "$until: " + breakpoints[1].name;
	// } else if (ix === breakpoints.length - 1) {
	// 	query = "$from: " + bp.name;
	// } else {
	// 	query = "$from: " + bp.name + ", $until: " + breakpoints[ix+1].name;
	// }

	// write("@mixin " + bp.name + "-only() {");
	// write("    @include mq(" + query + ") { @content }");
	// write("}");
	// write("");

});

//
// Generate on/off classes: .phone-only, .no-phone

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

//
// Generate grid for each breakpoint

breakpoints.forEach(function(bp) {

	var cn = bp.className;
	var spacing = bp.spacing;
	var halfSpacing = spacing / 2;
	var gutter = ('gutter' in bp) ? (bp.gutter) : (spacing / 2);

	//
	// generate mixins

	write("//");
	write("// " + bp.name);
	write("");

	//
	// outer wrapper

	write("@mixin " + cn + "-wrapper--x {");
	write("    padding-left: " + gutter + "px;");
	write("    padding-right: " + gutter + "px;");
	write("    margin: 0 auto;");
	if (bp.minWidth) {
		write("    min-width: " + (bp.minWidth + (gutter * 2)) + "px;");
	}
	if (bp.maxWidth) {
		write("    max-width: " + (bp.maxWidth + (gutter * 2)) + "px;");
	}
	write("}");
	write("");

	//
	// section

	write("@mixin " + cn + "-section--x {");
	write("    @include clearfix;");
	write("    box-sizing: border-box;");
	write("    margin-left: -" + halfSpacing + "px;");
	write("    margin-right: -" + halfSpacing + "px;");
	write("}");
	write("");
	
	// 2. column, e.g. mb-c--x
	write("@mixin " + cn + "-c--x {");
	write("    float: left;");
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
	write("}");
	write("");

	// 3. column widths
	for (var i = 1; i <= bp.columns; ++i) {
		var width;
		width = (100 / bp.columns) * i;
		
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
	write("    .wrapper { @include " + cn + "-wrapper--x; }");
	write("    .section { @include " + cn + "-section--x; }");
	write("    .c { @include " + cn + "-c--x; }");
	for (var i = 1; i <= bp.columns; ++i) {
		write("    ." + cn + "-p" + i + " { @include " + cn + "-p" + i + "--x; }");
	}
	for (var i = 1; i <= bp.columns; ++i) {
		write("    ." + cn + "-s" + i + " { @include " + cn + "-s" + i + "--x; }");
	}
	write("}");
	write("");

	// And now for the semantic stuff!

	if (bp.semantic !== false) {

		write("@mixin " + cn + "-section { @include " + cn + "-section--x; }");
		write("");

		for (var i = 1; i <= bp.columns; ++i) {
			write("@mixin " + cn + "-s" + i + " {");
			write("    @include " + bp.name + "-only {");
			write("        @include " + cn + "-c--x;");
			write("        @include " + cn + "-s" + i + "--x;");
			write("    }");
			write("}");
			write("");
		}

		for (var i = 1; i <= bp.columns; ++i) {
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