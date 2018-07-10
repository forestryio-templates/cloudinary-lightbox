export interface Attributes {
    src: string,
    transforms: string,
}

export interface Partial {
    title: string,
    template: string
}

export interface ConfigObject {
    disableFetch?: boolean,
    attributes?: Attributes,
    cloudName: string,
    cname?: string,
    partials?: Partial[],
    privateCdn?: boolean,
    secure?: boolean,
    selectors: string,
    template?: string,
    wrapperSelectors?: string
}

/**
 * Initializes the config for the plugin
 */
export class Config {
    public disableFetch: boolean = false
    public attributes: Attributes = {
        src: "src",
        transforms: "data-transforms"
    }
    public cloudinary: any
    public cloudinaryUrl: string
    public cloudName: string
    public cname: string = "res.cloudinary.com"
    public partials: Partial[]
    public privateCdn: boolean = false
    public secure: boolean = true
    public selectors: string = "img"
    public template: string
    public wrapperSelectors

    constructor(config: ConfigObject) {
        this.cloudName = config.cloudName

        if (typeof config.disableFetch !== "undefined") {
            this.disableFetch = config.disableFetch
        }

        if (typeof config.attributes !== "undefined") {
            this.attributes = Object.assign(this.attributes, config.attributes)
        }

        if (typeof config.cname !== "undefined") {
            this.cname = config.cname
        }

        if (typeof config.partials !== "undefined") {
            this.cname = config.cname
        }

        if (typeof config.privateCdn !== "undefined") {
            this.privateCdn = config.privateCdn
        }

        if (typeof config.secure !== "undefined") {
            this.secure = config.secure
        }

        if (typeof config.selectors !== "undefined") {
            this.selectors = config.selectors
        }

        if (typeof config.template !== "undefined") {
            this.template = config.template
        }

        if (typeof config.wrapperSelectors !== "undefined") {
            this.wrapperSelectors = config.wrapperSelectors
        }

        //this.loadCloudinary()
        this.cloudinaryUrl = this.createCloudinaryURL()
    }

    async loadCloudinary() {
        if (typeof window.cloudinary === "undefined") {
            this.cloudinary = await import("cloudinary-core")
        } else {
            this.cloudinary = window.cloudinary
        }
    }

    createCloudinaryURL() {
        const protocol = this.secure ? "https://" : "http://"
        const host = this.cname.replace("/", "")
        const baseURL = `${protocol}${host}/${this.cloudName}/image/`

        return baseURL
    }
}

export default Config