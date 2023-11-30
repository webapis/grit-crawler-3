const colors = require('../../utils/data/colors.json')
const { searchObject } = require('../../utils/searchObject')

const extractor = async (page) => {

    await page.waitForSelector('.productdetails');

    const data = await page.evaluate(() => {

        try {
         
            const link = document.URL

            const price = document.querySelector('.product-price-detail').childNodes.length==2? document.querySelector('.product-price-detail').childNodes[1].textContent.replace('TL','').trim():document.querySelector('.product-price-detail').textContent.replace('TL','').trim()
            const imageUrl = Array.from(document.querySelectorAll('[data-zoom-image] img')).map(m=>m.src)
            const title = document.querySelector('h1').innerText
            const size = ''
            const optionColors = ''
            const description = ''
            return {
             
                title,

                optionColors,
                price,
                size,
                imageUrl,
                link,
                timestamp: Date.now(),
                description,
                marka: 'alchera'
            
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

















