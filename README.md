# supergrid

The last SCSS grid generator you'll ever need! `supergrid` is a command line tool for generating configurable responsive grids.

## Usage

### Global Options

  * `--json`: generate `supergrid` JSON configuration file suitable for further customisation
  * `--scss`: generate SCSS.
  * `--mq`: generate [sass-mq](https://github.com/sass-mq/sass-mq)-compatible breakpoint definitions and mixins
  * `--no-mq`: do not use sass-mq; instead generate standard media queries
  * `--clearfix`: generate a `clearfix` mixin
  * `--no-clearfix`: do not generate a `clearfix` mixin (you must provide your own)
  * `--border`: use borders to create inter-column spacing
  * `--padding`: use padding to create inter-column spacing

The default options are `--scss --no-mq --padding --clearfix`.

### Size declarations

Size declarations define the required page sizes and are used to generate the necessary breakpoints and grid classes. They are specified as a space-separated list, in order of increasing width

The first size declaration has the format `name:cssClassPrefix:columnCount`. Successive size declarations have the format `startWidth:name:cssClassPrefix:columnCount`.

### Per-size options

Per-size options are specified immediately after the corresponding size declaration and have the form `key:value` (e.g. `minWidth:1024`). Valid options are:

  * `minWidth`: minimum width of content area, excluding gutter
  * `maxWidth`: maximum width of content area, excluding gutter
  * `gutter`: gutter width, defaults to same value as spacing
  * `spacing`: inter-column spacing

### Example

Generate three sizes with breakpoints at 480px and 760px. Small and medium sizes have 12 columns, large has 24. All sizes have 20px spacing between columns. Maximum width of large content area is 1100px.

	supergrid \
		small:sm:12 spacing:20 \
		480:medium:md:12 spacing:20 \
		760:large:lg:24 spacing:20 maxWidth:1100

## Using the generated CSS

The basic HTML structure is like this:

```html
<div class='wrapper'>
  <div class='section'>
  	<div class='c sm-s12 tb-s6 lg-s4'></div>
  	<div class='c sm-s12 tb-s6 lg-s4'></div>
    <div class='c sm-s12 tb-s6 lg-s4'></div>
  </div>
</div>
```

It is possible to nest sections:

```html
<div class='wrapper'>
  <div class='section'>
  	<div class='c lg-s6'></div>
  	<div class='c lg-s6'>
  	  <div class='section'>
  	  	<div class='c lg-s4'></div>
  	  	<div class='c lg-s4'></div>
  	  	<div class='c lg-s4'></div>
  	  </div>
  	</div>
  </div>
</div>
```

## Helper classes

For each declared size, `.${size}-only` and `.no-${size}` classes are generated to exclusively show and explicitly hide elements at the specified size.

## TODO

  * Allow customisable classnames for `.wrapper`, `.section`, `.c`.