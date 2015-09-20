# supergrid

The last SCSS grid generator you'll ever need! `supergrid` is a command line tool for generating configurable responsive grids.

## Usage

### Global Options

  * `--json`: generate `supergrid` JSON configuration file suitable for further customisation
  * `--scss`: generate SCSS.
  * `--mq`: generate `mq` breakpoint definitions and mixins
  * `--no-mq`: do not use `mq`; instead generate standard media queries
  * `--clearfix`: generate a `clearfix` mixin
  * `--no-clearfix`: do not generate a `clearfix` mixin (you must provide your own)
  * `--border`: use borders to create inter-column spacing
  * `--padding`: use padding to create inter-column spacing

The default options are `--scss --no-mq --padding --clearfix`.

### Example

Generate three sizes with breakpoints at 480px and 760px. Small and medium sizes have 12 columns, large has 24. All sizes have 20px spacing between columns. Maximum of large content area is 1100px.

	supergrid \
		small:sm:12 spacing:20 \
		480:medium:md:12 spacing:20 \
		760:large:lg:24 spacing:20 maxWidth:1100