import "babel-polyfill";
import "./utils/closest.polyfill"
import Config from "./core/config"
import { ImageElement } from "./core/imageGenerator"
import KeyMap from './core/keymap';
import TemplateRenderer from "./core/templateRenderer"

export default class CloudinaryLightbox {
    config: Config
    images: ImageElement[]
    keymap: KeyMap
    templateRenderer: TemplateRenderer

    constructor(config) {
        this.config = new Config(config)
        this.templateRenderer = new TemplateRenderer(this.config)
        this.images = this.getImages(this.config.selectors, this.config.wrapperSelectors)
        this.keymap = new KeyMap(this.config, this.images, this.templateRenderer)
    }

    getImages(selectors: string, wrapperSelectors: string) {
        let images: ImageElement[] = []

        const nodes = document.querySelectorAll(selectors)
    
        nodes.forEach((node: ImageElement) => {
            if (typeof wrapperSelectors !== "undefined") {
                const wrapper = node.closest(wrapperSelectors)
                node.cloudinaryWrapper = wrapper
            }

            images.push(node)
        })

        images.forEach((image: ImageElement) => {
            image.setAttribute("data-cloudinary-lightbox", "")
        })
        
        return images
    }
}

window.CloudinaryLightbox = (config) => {
    return new CloudinaryLightbox(config)
}
