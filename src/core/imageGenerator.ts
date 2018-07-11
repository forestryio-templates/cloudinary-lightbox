import Config from "./config"

export interface ImageElement extends Element {
    cloudinaryWrapper: Element
}

export interface Transform {
    type: string,
    value: string
}

export interface SrcSet {
    src: string,
    width: number
}

/**
 * Used to fetch & generate valid images
 */
export default class ImageGenerator {
    alt: string
    config: Config
    image: ImageElement
    imagePath: string
    src: string
    srcset: SrcSet[]    
    sourceHtml: string
    title: string
    transforms: Transform[]

    constructor(image: ImageElement, config: Config) {
        this.image = image
        this.config = config
        this.src = image.getAttribute(this.config.attributes.src)
        this.alt = image.getAttribute("alt")
        this.sourceHtml = image.innerHTML
        this.transforms = this.getTransforms()
    }

    private createURL(src: string): URL {
        const tmpElem = document.createElement("a")
              tmpElem.href = src
        const URL  = {
            hash: tmpElem.hash,
            host: tmpElem.host,
            hostname: tmpElem.hostname,
            href: tmpElem.href,
            origin: tmpElem.origin,
            password: undefined,
            pathname: tmpElem.pathname,
            port: tmpElem.port,
            protocol: tmpElem.protocol,
            search: tmpElem.search,
            searchParams: undefined,
            username: undefined
        }

        return URL
    }

    private getImagePath(pathname: string): string {
        let imagePath = pathname
        const httpIndex =  pathname.indexOf("http")
        const imagePathIsAbsolute = httpIndex > -1
        const stripRegex = new RegExp("/[/|./../]*?")

        if (imagePathIsAbsolute) {
            imagePath = pathname.slice(httpIndex, pathname.length)
        } else {
            let pathParts = pathname.split("/")
            const uploadIndex = pathParts.indexOf("upload")
            const fetchIndex = pathParts.indexOf("fetch")
            const trueIndex = uploadIndex > -1 ? uploadIndex : fetchIndex
            
            if (trueIndex > -1) {
                const versionIsPlusOne = pathParts[trueIndex + 1].startsWith("v")
                const versionIsPlusTwo = pathParts[trueIndex + 2].startsWith("v")
                const transformIsPlusOne = pathParts[trueIndex + 1].indexOf(',') > -1

                if (versionIsPlusOne) {
                    pathParts = pathParts.slice(trueIndex + 2, pathParts.length)
                } else if (versionIsPlusTwo) {
                    pathParts = pathParts.slice(trueIndex + 3, pathParts.length)
                } else if (transformIsPlusOne) {
                    pathParts = pathParts.slice(trueIndex + 2, pathParts.length)
                }
            }

            imagePath = pathParts.join("/").replace(stripRegex, "")
        }

        return imagePath
    }

    private getTransforms() {
        let transforms = []
        let wrapperTransforms
        const key = this.config.attributes.transforms
        const localTransforms = this.image.getAttribute(key)

        if (typeof this.image.cloudinaryWrapper !== "undefined") {
            wrapperTransforms = this.image.cloudinaryWrapper.getAttribute(key)
        }

        if (typeof localTransforms !== "undefined" && localTransforms !== null) {
            transforms = transforms.concat(localTransforms.split(","))
        }

        if (typeof wrapperTransforms !== "undefined" && wrapperTransforms !== null) {
            transforms = transforms.concat(wrapperTransforms.split(","))
        }

        if (transforms.length === 0) {
            transforms = transforms.concat(this.config.transforms.split(","))
        }

        return transforms.map(transform => {
            const arr = transform.split("_")
            const type = arr[0]
            const value = arr[1]

            return {
                type: type,
                value: value
            }
        })
    }

    private createCloudinaryUrl(imagePath: string) {
        const mode = this.shouldBeUpload(imagePath) ? "upload" : "fetch"
        const transforms = this.transforms.map(transform => `${transform.type}_${transform.value}`)
        const path = `${mode}/${transforms.join(",")}/${imagePath}`
        const url = `${this.config.cloudinaryUrl}${path}`

        return url
    }

    private shouldBeUpload(path: string) {
        if (this.config.disableFetch === true) {
            return true
        } else if (path.indexOf(this.config.cname) > -1) {
            return true
        } else if (path.indexOf("http://") > -1) {
            return false
        } else if (path.indexOf("https://") > -1) {
            return false
        }

        return true
    }

    public createImage() {
        let cloudinarySrc
        const image = this.image

        if (this.shouldBeUpload(this.src)) {
            const srcURL = this.createURL(this.src)
            const srcPath = this.getImagePath(srcURL.pathname)
            cloudinarySrc = this.createCloudinaryUrl(srcPath)
        } else {
            const srcPath = this.getImagePath(this.src)
            cloudinarySrc = this.createCloudinaryUrl(srcPath)
        }

        image.setAttribute("src", cloudinarySrc)
        image.setAttribute("sizes", this.config.sizes)

        return image
    }
}