import Config from "./config"

export interface ImageElement extends Element {
    wrapper: Element
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
        this.src = image.getAttribute("src")
        this.alt = image.getAttribute("alt")
        this.sourceHtml = image.innerHTML
        this.transforms = this.getTransforms()
        this.srcset = this.getSrcset()
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
        const imagePathStart = pathname.indexOf("http")
        const stripRegex = new RegExp("/[/|./../]*?")

        if (imagePathStart > -1) {
            imagePath = pathname.slice(imagePathStart, pathname.length)
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

        if (typeof this.image.wrapper !== "undefined") {
            wrapperTransforms = this.image.wrapper.getAttribute(key)
        }

        if (typeof localTransforms !== "undefined" && localTransforms !== null) {
            transforms = transforms.concat(localTransforms.split(","))
        }

        if (typeof wrapperTransforms !== "undefined"&& wrapperTransforms !== null) {
            transforms = transforms.concat(wrapperTransforms.split(","))
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

    private getSrcset() {
        let sets = []
        let wrapperSets
        const key = this.config.attributes.srcset
        const localSets = this.image.getAttribute("srcset")

        if (typeof this.image.wrapper !== "undefined") {
            wrapperSets = this.image.wrapper.getAttribute(key)
        }

        if (typeof localSets !== "undefined" && localSets !== null) {
            sets = sets.concat(localSets.split(","))
        }

        if (typeof wrapperSets !== "undefined" && wrapperSets !== null) {
            sets = sets.concat(wrapperSets.split(","))
        }

        return sets.map(set => {
            const arr = set.split(" ")
            const src = arr.length > 1 ? arr[0] : null
            const width = arr.length > 1 ? arr[1] : arr[0]

            return {
                src: src,
                width: width.replace("w", "")
            }
        })
    }

    private createCloudinaryUrl(imagePath: string, width?: number|string) {
        const mode = this.shouldBeUpload(imagePath) ? "upload" : "fetch"
        const transforms = this.transforms.map(transform => {
            if (transform.type === "w" && width !== "undefined") {
                return
            }

            return `${transform.type}_${transform.value}`
        }).concat([`w_${width}`])
        const path = `${mode}/${transforms.join(",")}/${imagePath}`
        const url = `${this.config.cloudinaryUrl}${path}`

        return url
    }

    private shouldBeUpload(path: string) {
        if (this.config.allowFetch !== true) {
            return true
        } else if (path.indexOf("http://") > -1) {
            return false
        } else if (path.indexOf("https://") > -1) {
            return false
        }

        return false
    }

    public createImage() {
        const image = this.image

        if (this.config.allowFetch) {
            const srcURL = this.createURL(this.src)
            const srcPath = this.getImagePath(srcURL.pathname)
            const cloudinarySrc = this.createCloudinaryUrl(srcPath)

            image.setAttribute("src", cloudinarySrc)

            if (this.srcset.length > 0) {
                const cloudinarySrcset = this.srcset.map(set => {
                    const src = set.src !== null ? set.src : this.src
                    const setURL = this.createURL(src)
                    const setPath = this.getImagePath(setURL.pathname)
                    const cloudinarySrc = this.createCloudinaryUrl(setPath, set.width)

                    return `${cloudinarySrc} ${set.width}w`
                }).join(", ")

                image.setAttribute("srcset", cloudinarySrcset)
            }
        }

        return image
    }
}