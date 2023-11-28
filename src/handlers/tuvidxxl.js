const colors = require('../../utils/data/colors.json')
const { searchObject } = require('../../utils/searchObject')

const extractor = async (page) => {
    debugger
    await page.waitForSelector('.contentProductDetail');
    debugger
    const data = await page.evaluate(() => {

        try {

            const link = document.URL

            const price = document.querySelector('.spanFiyat').innerText.replace('₺', '')
            const imageUrl = Array.from(document.querySelectorAll('.SmallImages img')).map(m => m.src)
            const title = document.querySelector('.ProductName h1 span').innerText
            const size = Array.from(document.querySelectorAll('.eksecenekLine span')).map(m => m.innerText).filter(Number).map(m => parseInt(m))
            const optionColors = ''
            const description = document.querySelector('.urunTabAlt ul li') && document.querySelector('.urunTabAlt ul li').innerText
            return {

                title,

                optionColors,
                price,
                size,
                imageUrl,
                link,
                timestamp: Date.now(),
                description,
                marka: 'tuvidxxl'
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



















