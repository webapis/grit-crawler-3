const colors = require('../../utils/data/colors.json')
const { searchObject } = require('../../utils/searchObject')

const extractor = async (page) => {

    await page.waitForSelector('.ProductDetailMain');

    const data = await page.evaluate(() => {

        try {
         
            const link = document.URL
            const price = document.querySelector('.sPric').childNodes[1].textContent.replace('₺','')
            const imageUrl =Array.from(document.querySelectorAll('.SmallImages img')).map(m => m.getAttribute('data-original-last'))
            const title =  document.querySelector('.ProductName h1 span').innerText
            const size =  Array.from(document.querySelectorAll('.eksecenekLine span')).map(m => m.innerText).filter(Number).map(m => parseInt(m))
            const optionColors ='' 
            const description =document.querySelector('.urunTabAlt') && document.querySelector('.urunTabAlt').innerText.replaceAll('\n','')
            return {
             
                title,
                optionColors,
                price,
                size,
                imageUrl,
                link,
                timestamp: Date.now(),
                description,
                marka: 'lilasxxl'
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

module.exports = { extractor, getUrls, prodLinkSelector: '.detailLink.detailUrl'}




















