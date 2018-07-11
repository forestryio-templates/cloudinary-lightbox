# Cloudinary Lightbox

A JavaScript widget for auto-generating responsive, accessible lightboxes using Cloudinary.

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)

## Installing

### Using a CDN
The quickest way to get started is to add the minified production bundles from the Unpkg CDN:

Place the following default theme CSS before the closing `</head>` tag:

```html
<link href="https://unpkg.com/cloudinary-lightbox@latest/dist/cloudinaryLightbox.css" rel="stylesheet" type="text/css">
```

Place the following script before the closing `</body>` tag:

```html
<script src="https://unpkg.com/cloudinary-lightbox@latest/dist/cloudinaryLightbox.js"></script>
<script>
    var CloudinaryLightbox = CloudinaryLightbox({
        cloudName: "YOUR_CLOUD_NAME"
    })
</script>
```

### Using NPM
If you're looking to include the plugin as a part of your build process, install using NPM:

```
npm install cloudinary-lightbox
```

Then include the files as necessary in your app entrypoint, e.g in Parceljs:

```
import CloudinaryLightbox from "cloudinary-lightbox"
import "cloudinary-lightbox/dist/cloudinaryLightbox.css"

const cloudinaryLightbox = new CloudinaryLightbox({
    cloudName: "YOUR_CLOUD_NAME"
})
```

## Usage
Cloudinary Lightbox is plug-and-play out of the box. The default stylesheet will give you fullscreen image lightboxes for every image you select when instantiating the plugin.

### Configuration
When instantiating the plugin, the following options are available:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `selectors` | `string` | A comma delimited list of valid CSS selectors to target specific images | `img` |
| `attributes.src` | `string` | The HTML attribute to search for the image `src` value from. | `src` |
| `attributes.transforms` | `string` | The HTML attribute to search for Cloudinary transform values on. Must be a comma delimited list of valid Cloudinary transforms. | `data-clb-transforms` |
| `cname` | `string` | The domain name that Cloudinary URLs should be constructed with. | `res.cloudinary.com` |
| `privateCdn` | `boolean` | Whether a private CDN is being used. _For advanced tier Cloudinary users only_ | `false` |
| `secure` | `boolean` | Whether to use `https` protocol, even if the viewed webpage is `http` | `true` |
| `wrapperSelectors` | `string` | A comma delimited list of valid CSS selectors to source transforms from. Useful for markdown content. | `undefined` |
| `template` | `string` | A valid mustachejs template for rendering the lightbox. Use the `{{{ image }}}` variable to place the generated image. | [Default template](./src/theme/template.mustache) |
| `transforms` | `string` | The default transforms to apply if none are set using `attributes.transforms` | `w_auto,c_scale,dpr_auto` |

### Custom Styling (CSS)

If you want to customize the CSS for the lightbox, feel free to exclude or extend the [very basic default theme](./src/theme/template.css) with your own CSS.

### Client Hints
By default, this plugin is setup to deliver the best image possible via [client hints](https://cloudinary.com/documentation/responsive_images#automating_responsive_images_with_client_hints). To enable this functionality, add the following to the `<head>` of your page:

```
<meta http-equiv="Accept-CH" content="DPR, Viewport-Width, Width">
```

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/6855186?v=4" width="100px;"/><br /><sub><b>chrisdmacrae</b></sub>](https://github.com/chrisdmacrae)<br />[💻](https://github.com/forestryio/Cloudinary Lightbox/commits?author=chrisdmacrae "Code") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!