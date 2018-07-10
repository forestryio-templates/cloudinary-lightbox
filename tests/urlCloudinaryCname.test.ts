'use strict';
import cloudinaryLightbox from "../dist/cloudinaryLightbox"

test("Expect a valid cname-based cloudinary URL", () => {
    document.body.innerHTML = `
        <img src="https://media.example.com/images/example.jpg" alt="Example" data-clb-transforms="dpr_auto,w_auto">
    `

    const img = document.querySelector("img")
    const clb = new cloudinaryLightbox({
        cname: "media.example.com"
    })

    img.click()

    const lightboxImg = document.querySelector("cloudinaryLightbox0 img")
    const toCompare = lightboxImg.getAttribute("src")
    const expected = "https://media.example.com/image/upload/dpr_auto,w_auto/example.jpg"

    expect(toCompare).toBe(expected)
})