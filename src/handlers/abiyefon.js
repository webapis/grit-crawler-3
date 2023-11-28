const colors = require('../../utils/data/colors.json')
const { searchObject } = require('../../utils/searchObject')

const extractor = async (page) => {

    await page.waitForSelector('.product-section');
    await page.waitForSelector('.product-option-list [data-attr]')
    const data = await page.evaluate(() => {

        try {
         
            const link = document.URL

            const price = document.querySelector('[data-price]').getAttribute('data-price')
            const imageUrl = Array.from(document.querySelectorAll('.product-image li img')).map(m => m.src).filter((f, i) => f.includes('https://www.abiyefon.com/'))
            const title = document.querySelector('.productdetails h1').innerText
            const size = Array.from(document.querySelectorAll('.product-option-list [data-attr]')).map(m => m.getAttribute('data-val')).filter(Number).map(m=> parseInt(m))
            const optionColors = Array.from(document.querySelectorAll('.product-option-list [data-attr]')).map(m => m.getAttribute('data-val')).filter(isNaN)
            const description = document.querySelectorAll('.product-content p')[1].innerText
            return {
             
                title,

                optionColors,
                price,
                size,
                imageUrl,
                link,
                timestamp: Date.now(),
                description,
                marka: 'abiyefon'
            }
        }
        catch (error) {
            return { error: error.toString(), content: document.innerHTML }
        }
    })
    debugger
    const color = colors.find((f) => searchObject({ link: data.link, title: data.title }, f.searchterm))
    const withColor = { ...data, color: color ? color.category : 'unknown' }
    debugger
    return withColor
}

async function getUrls(page) {
    const url = await page.url()
    const pageExist = await page.$('.count-info-text strong')
    let pageUrls = []
    let productCount = 0
    if (pageExist) {
        productCount = await page.$eval('.count-info-text strong', element => parseInt(element.textContent))
        const totalPages = Math.ceil(productCount / 100)

        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?page=` + i)
            --pagesLeft

        }
    }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}

module.exports = { extractor, getUrls, prodLinkSelector: '.product-link' }




















// const data = await page.$$eval('.products li', (productCards, _subcategory, _category, _opts) => {
//     return productCards.map(productCard => {
//         const priceNew = productCard.querySelector("span[data-price]") ? productCard.querySelector("span[data-price]").getAttribute('data-price').replace(/\n/g, '').trim().replace('₺', '').replace('TL', '').trim() : productCard.outerHTML
//         const longlink = productCard.querySelector('.product-link') ? productCard.querySelector('.product-link').getAttribute('data-purehref') : productCard.outerHTML
//         const link = longlink.substring(longlink.indexOf("/") + 1)
//         const longImgUrl = productCard.querySelector('.product-list-image') ? productCard.querySelector('.product-list-image').src : productCard.outerHTML
//         const imageUrlshort = longImgUrl && longImgUrl.substring(longImgUrl.indexOf('https://www.abiyefon.com/') + 25)
//         const title = productCard.querySelector(".img-options img") ? productCard.querySelector(".img-options img").alt : productCard.outerHTML
//         return {
//             title: 'abiyefon ' + title + (_opts.keyword ? (title.toLowerCase().includes(_opts.keyword) ? '' : ' ' + _opts.keyword) : ''),
//             priceNew,
//             imageUrl: imageUrlshort,
//             link,
//             timestamp: Date.now(),
//             marka: 'abiyefon',
//             subcategory: _subcategory,
//             category: _category
//         }
//     }).filter(f => f.imageUrl !== null)
// }, subcategory, category, opts)