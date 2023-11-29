const colors = require('../../utils/data/colors.json')
const { searchObject } = require('../../utils/searchObject')

const extractor = async (page) => {

    await page.waitForSelector('#pageContent');

    const data = await page.evaluate(() => {

        try {

            const link = document.URL

            const price = document.querySelector('.mainPrices .LastFiyat.liste-LastFiyat') ? document.querySelector('.mainPrices .LastFiyat.liste-LastFiyat').innerText : document.querySelector('.product-price').innerText
            const imageUrl = Array.from(document.querySelectorAll('#productImage img')).map(m=>m.src)
            const title = document.querySelector('#productName').innerText
            const size = Array.from(document.querySelectorAll('.variantList a')).map(m=>m.innerText.split('-')).flat().filter(Number).map(m=>parseInt(m))
            const optionColors = ''
            const description = ''
            const sku = document.querySelector('.supplier_product_code').innerText
            const color = document.querySelector('.selected p img').alt
            return {

                title,
                optionColors,
                price,
                size,
                imageUrl,
                link,
                timestamp: Date.now(),
                description,
                marka: 'buyukmoda',
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



module.exports = { extractor, prodLinkSelector: '.detailLink', isAutoScroll: true }




















