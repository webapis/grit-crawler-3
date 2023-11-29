const colors = require('../../utils/data/colors.json')
const { searchObject } = require('../../utils/searchObject')

const extractor = async (page) => {

    await page.waitForSelector('.ProductDetailMain');
    await page.waitForSelector('.size_box.selected');
    const data = await page.evaluate(() => {

        try {

            const link = document.URL
            const price = document.querySelector('.spanFiyat').innerText.replace('₺', '')
            const imageUrl = Array.from(document.querySelectorAll('.SmallImages img')).map(m => JSON.parse(m.getAttribute('data-cloudzoom')).zoomImage)
            const title = document.querySelector('.ProductName h1 span').innerText
            const size = Array.from(document.querySelectorAll('.size_box:not(.nostok)')).map(m => m.innerText).filter(Number).map(m => parseInt(m))
            const optionColors = ''
            const description = ''
            const color = document.querySelector('.size_box.selected') && document.querySelector('.size_box.selected').innerText
            sku = title.split(' ')[0]
            return {

                title,
                optionColors,
                price,
                size,
                imageUrl,
                link,
                timestamp: Date.now(),
                description,
                marka: 'tutkumoda',
                color,
                sku
            }
        }
        catch (error) {
            return { error: error.toString(), content: document.innerHTML }
        }
    })
    debugger

    debugger
    return data
}

async function getUrls(page) {
    debugger
    const url = await page.url()
    const pageExist = await page.$('.pageNumber.pageNumberBottom a')
    let pageUrls = []
    let productCount = 0
    if (pageExist) {
        totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.pageNumber.pageNumberBottom a')).map(m => m.innerText).filter(Number).map(m => parseInt(m))))

        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?sayfa=` + i)

        }
    }
    debugger
    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}

module.exports = { extractor, getUrls, prodLinkSelector: '.detailLink.detailUrl' }




















