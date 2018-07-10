'use strict';
import cloudinaryLightbox from "../dist/cloudinaryLightbox"

test("Expect a valid cname-based cloudinary URL", () => {
    document.body.innerHTML = `
        <img src="https://res.cloudinary.com/example-cloud/image/fetch/https://example.com/images/example.jpg" alt="Example" data-transforms="dpr_auto,w_auto">
    `

    const img = document.querySelector("img")
    const clb = new cloudinaryLightbox({
        cloudName: "example-cloud"
    })

    img.click()

    const lightboxImg = document.querySelector("cloudinaryLightbox0 img")
    const toCompare = lightboxImg.getAttribute("src")
    const expected = "https:/res.cloudinary.com/example-cloud/image/fetch/dpr_auto,w_auto/https://example.com/images/example.jpg"

    expect(toCompare).toBe(expected)
})