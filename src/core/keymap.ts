import Config from './config';
import ImageGenerator from "./imageGenerator"
import TemplateRenderer from './templateRenderer';

/**
 * Binds key events to the lightbox meeting a11y accessibility guidelines
 */
export default class KeyMap {
    config : Config
    focusableElements : string = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not" +
            "([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[cont" +
            "enteditable]"
    images : Element[]
    lightbox : Element[] = []
    templateRenderer : TemplateRenderer

    constructor(config : Config, images : Element[], templateRenderer : TemplateRenderer) {
        this.config = config
        this.images = images
        this.templateRenderer = templateRenderer

        this
            .images
            .forEach(image => {
                image.addEventListener("click", this.bindClick.bind(this, image))
            })
        document.addEventListener("keydown", this.trapEscKey.bind(this))
    }

    /**
     * Adds the lightbox element to the page
     */
    private addLightbox(image) {
        this.removeLightbox()

        const template = this
            .templateRenderer
            .renderTemplate(image.outerHTML)

        template.forEach(node => {
            node.addEventListener("click", this.removeLightbox.bind(this))
            document
                .body
                .appendChild(node)
            this.focusFirst(node)
            this
                .lightbox
                .push(node)
        })
    }

    /**
     * Removes all lightbox elements from the page
     */
    private removeLightbox() {
        if (typeof this.lightbox !== "undefined") {
            this
                .lightbox
                .forEach(node => {
                    node.remove()
                })
            this.lightbox = []
        }
    }

    /**
     * Generates the lightbox on click events
     */
    private bindClick(image, e) {
        e.preventDefault()

        const imageHtml = image.outerHTML
        const clone = this.templateRenderer.createElementFromTemplate(imageHtml)[0]
              clone.wrapper = image.wrapper
        const generatedImage = new ImageGenerator(clone, this.config)
        const lightboxImage = generatedImage.createImage()

        this.addLightbox(lightboxImage)
    }

    /**
     * Traps the esc key to only close the modal
     */
    private trapEscKey(e) {
        if (e.which == 27) {
            this.removeLightbox()
        }
    }

    /**
     * Focuses the first focusable element, if any, in an element
     */
    private focusFirst(element : Element) {
        const focusableElement : HTMLElement = element.querySelector(this.focusableElements)

        if (focusableElement !== null) {
            focusableElement.focus()
        }
    }
}