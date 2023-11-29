const colors = require('../../utils/data/colors.json')
const { searchObject } = require('../../utils/searchObject')

const extractor = async (page) => {

    await page.waitForSelector('#product-detail-container');
    await page.waitForSelector('.variant-selected img[alt]');
    const data = await page.evaluate(() => {

        try {

            const link = document.URL

            const price = document.querySelector('.showcase-price-new').innerText.replace('TL', '').trim()
            const imageUrl = Array.from(document.querySelectorAll('#product-thumb-image img')).map(m => m.src)
            const title = document.querySelector('.product-title h1').innerText
            const size = Array.from(document.querySelectorAll('.variant-list span')).map(m => m.innerText).filter(Number).map(m => parseInt(m))
            const optionColors = ''
            const description = ''
            const sku = document.querySelector('.product-sku').innerText.replace('Stok Kodu: ', '')
            const color = document.querySelector('.variant-selected img[alt]').alt.toLowerCase()
            return {

                title,
                optionColors,
                price,
                size,
                imageUrl,
                link,
                timestamp: Date.now(),
                description,
                marka: 'alfa-beta',
                sku,
                color
            }
        }
        catch (error) {
            return { error: error.toString(), content: document.innerHTML, url: document.URL }
        }
    })
    debugger

    return data
}

async function getUrls(page) {
    const url = await page.url()
    const pageExist = await page.$('.paginate-content a')
    let pageUrls = []
    let productCount = 0
    if (pageExist) {

        const totalPages = await page.evaluate(() => Math.max(... Array.from(document.querySelectorAll('.paginate-content a')).map(m => m.innerText).filter(Number).map(m => parseInt(m))) )

        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?tp=` + i)
            --pagesLeft

        }
    }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}

module.exports = { extractor, getUrls, prodLinkSelector: '.showcase-image a[title]' }




















