const colors = require('../../utils/data/colors.json')
const { searchObject } = require('../../utils/searchObject')

const extractor = async (page) => {

    await page.waitForSelector('#product-detail-container');

    const data = await page.evaluate(() => {

        try {

            const link = document.URL

            const price = document.querySelector('.product-price-new').innerText.replace('TL','').trim()
            const imageUrl = Array.from(document.querySelectorAll('#product-image img')).map(m=>m.src)
            const title = document.querySelector('.product-title h1').innerText
            const size = Array.from(document.querySelectorAll('.variant-list span')).map(m=>m.innerText.replace(/[^\d]/gi,'')).map(m=> parseInt(m))
            const optionColors = ''
            const description = ''
            const sku = document.querySelectorAll('.product-list-content')[1].innerText
            const color = ''
            return {

                title,
                optionColors,
                price,
                size,
                imageUrl,
                link,
                timestamp: Date.now(),
                description,
                marka: 'buyukbedenstil',
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
    const pageExist = await page.$('.paginate-content a')
    let pageUrls = []
    let productCount = 0
    if (pageExist) {

        const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.paginate-content a')).map(m => m.innerText).filter(Number)) )

        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?tp=` + i)
            --pagesLeft

        }
    }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}

module.exports = { extractor, getUrls, prodLinkSelector: '.showcase-label-container' }




















