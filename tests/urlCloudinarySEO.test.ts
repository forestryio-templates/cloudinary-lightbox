'use strict';
import cloudinaryLightbox from "../dist/cloudinaryLightbox"

test("Expect a valid cname-based cloudinary URL", () => {
    document.body.innerHTML = `
        <img src="https://res.cloudinary.com/images/example.jpg" alt="Example" data-clb-transforms="dpr_auto,w_auto">
    `

    const img = document.querySelector("img")
    const clb = new cloudinaryLightbox({
        cloudName: "example-cloud"
    })

    img.click()

    const lightboxImg = document.querySelector("cloudinaryLightbox0 img")
    const toCompare = lightboxImg.getAttribute("src")
    const expected = "https:/res.cloudinary.com/example-cloud/image/upload/dpr_auto,w_auto/example.jpg"

    expect(toCompare).toBe(expected)
})