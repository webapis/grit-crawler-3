const colors = require('../../utils/data/colors.json')
const { searchObject } = require('../../utils/searchObject')

const extractor = async (page) => {

    await page.waitForSelector('.price.price--compare');

    const data = await page.evaluate(() => {

        try {

            const link = document.URL
            const price = document.querySelector('.price.price--compare').childNodes[2].textContent.replace('TL', '')
            const imageUrl = Array.from(document.querySelectorAll('[data-media-type="image"] img')).map(m => 'https:' + m.srcset.split(' ')[0])
            const title = document.querySelector('h1').textContent
            const size = Array.from(document.querySelectorAll('.block-swatch:not(.is-disabled) label')).map(m => m.innerText).filter(Number)
            const sku = document.querySelector('.product-meta__sku-number').innerText
            const color = Array.from(document.querySelectorAll('.block-swatch:not(.is-disabled) label')).map(m => m.innerText).filter(isNaN)[0]
            return {
                title,
                price,
                size,
                imageUrl,
                link,
                timestamp: Date.now(),
                marka: 'esergiyim',
                sku,
                color
            }
        }
        catch (error) {
            return { error: error.toString(), content: document.innerHTML, url:document.URL }
        }
    })
    return data
}

async function getUrls(page) {
    const url = await page.url()
    const pageExist = await page.$('.pagination__nav a')
    let pageUrls = []
    let productCount = 0
    if (pageExist) {

        const totalPages = Math.max(...Array.from(document.querySelectorAll('.pagination__nav a')).map(m => m.innerText).filter(Number))

        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?page=` + i)
         

        }
    }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}

module.exports = { extractor, getUrls, prodLinkSelector: '.product-item__image-wrapper a' }




















