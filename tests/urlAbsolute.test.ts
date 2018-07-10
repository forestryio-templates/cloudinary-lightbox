'use strict';
import cloudinaryLightbox from "../dist/cloudinaryLightbox"

test("Expect a valid absolute URL", () => {
    document.body.innerHTML = `
        <img src="https://example.com/images/example.jpg" alt="Example" data-clb-transforms="dpr_auto,w_auto">
    `

    const img = document.querySelector("img")
    const clb = window.CloudinaryLightbox({
        cloudName: "example-cloud"
    })

    img.click()

    console.log(document.body)

    const lightboxImg = document.querySelector("cloudinaryLightbox0 img")
    const toCompare = lightboxImg.getAttribute("src")
    const expected = "https:/res.cloudinary.com/example-cloud/image/fetch/dpr_auto,w_auto/https://example.com/images/example.jpg"

    expect(toCompare).toBe(expected)
})