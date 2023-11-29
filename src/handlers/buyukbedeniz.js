const colors = require('../../utils/data/colors.json')
const { searchObject } = require('../../utils/searchObject')

const extractor = async (page) => {

    await page.waitForSelector('#productDetail');
    await page.$('#otherColors div.Title');
    const data = await page.evaluate(() => {

        try {

            const link = document.URL

            const price = document.querySelector('.discountPrice span.product-price') ? document.querySelector('.discountPrice span.product-price').innerText : 0
            const imageUrl = Array.from(document.querySelectorAll('#productImage img')).map(m => m.src)
            const title = document.querySelector('#productName').innerText
            const size = Array.from(document.querySelectorAll('.variantList a p')).map(m => m.innerText).filter(Number).map(m => parseInt(m))
            const optionColors = ''
            const description = ''
            const sku = document.querySelector('.supplier_product_code').innerText
            const color = document.querySelector('#otherColors div.Title') && document.querySelector('#otherColors div.Title').innerText
            return {

                title,
                optionColors,
                price,
                size,
                imageUrl,
                link,
                timestamp: Date.now(),
                description,
                marka: 'buyukbedeniz',
                sku,
                color
            }
        }
        catch (error) {
            return { error: error.toString(), content: document.innerHTML, url: document.URL }
        }
    })
    debugger
    if (data.color) {
        return data
    }
    const color = colors.find((f) => searchObject({ link: data.link, title: data.title }, f.searchterm))
    const withColor = { ...data, color: color ? color.category : 'unknown' }
    debugger
    return withColor

}

async function getUrls(page) {
    const url = await page.url()
    const pageExist = await page.$('.productPager a')
    let pageUrls = []
    let productCount = 0
    if (pageExist) {

        const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.productPager a')).map(m => m.innerText).filter(Number)))

        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?pg=` + i)
            --pagesLeft

        }
    }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}

module.exports = { extractor, getUrls, prodLinkSelector: '.detailLink' }




















