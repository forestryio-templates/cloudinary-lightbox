import "babel-polyfill";
import Config from "./core/config"
import { ImageElement } from "./core/imageGenerator"
import KeyMap from './core/keymap';
import TemplateRenderer from "./core/templateRenderer"

export default class CloudinaryLightbox {
    config: Config
    images: HTMLElement[]
    keymap: KeyMap
    templateRenderer: TemplateRenderer

    constructor(config) {
        this.config = new Config(config)
        this.templateRenderer = new TemplateRenderer(this.config)
        this.images = this.getImages(this.config.selectors, this.config.wrapperSelectors)
        this.keymap = new KeyMap(this.config, this.images, this.templateRenderer)
    }

    getImages(selectors: string, wrapperSelectors: string) {
        const images = []

        if (typeof wrapperSelectors !== "undefined") {
            const parents = document.querySelectorAll(wrapperSelectors)

            parents.forEach(parent => {
                const children = parent.querySelectorAll(selectors)
    
                children.forEach((child: ImageElement) => {
                    child.wrapper = parent
                    images.push(child)
                })
            })
        } else {
            const nodes = document.querySelectorAll(selectors)
        
            nodes.forEach(node => {
                images.push(node)
            })
        }

        images.forEach(image => {
            image.setAttribute("data-cloudinary-lightbox", "")
        })
        
        return images
    }
}

const config = new Config({
    wrapperSelectors: "#parent",
    selectors: "img",
    cloudName: "forestry-demo",
    template: `
    <div class="cloudinary-lightbox-wrapper" data-custom-template>
        {{{ image }}}
    </div>
    `,
    
})

window.CloudinaryLightbox = (config) => {
    return new CloudinaryLightbox(config)
}
