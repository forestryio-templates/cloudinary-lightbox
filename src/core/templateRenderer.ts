import {Config, Partial} from "./config"
import defaultTemplate from "../theme/template.mustache"
import "../theme/template.css"
import Mustache from "mustache"

/**
 * Renders the lightbox template using mustache JS
 */
export default class TemplateRenderer {
    public template: string = defaultTemplate
    public partials: Partial[] = []

    constructor(config: Config) {
        if (typeof config.template !== "undefined") {
            this.template = config.template
        }

        if (typeof config.partials !== "undefined") {
            config.partials.forEach(partial => {
                this.partials[partial.title] = partial.template
            })
        }
    }

    private createView(image): object {
        return {
            image: image
        }
    }

    /**
     * Generates a DOM tree from a mustache template
     */
    public createElementFromTemplate(template : string) : any {
        var div = document.createElement('div');
        div.innerHTML = template.trim();

        return div.childNodes;
    }

    public renderTemplate(image: string): Element[] {
        const view = this.createView(image)
        const renderedTemplateString = Mustache.render(this.template, view, this.partials)
        const renderedTemplate = this.createElementFromTemplate(renderedTemplateString)

        renderedTemplate.forEach((node, i) => {
            node.setAttribute("aria-modal", true)
            node.setAttribute("role", "dialog")
            node.setAttribute("id", `cloudinaryLightbox${i}`)
        })

        return renderedTemplate
    }
}