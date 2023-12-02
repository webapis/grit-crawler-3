
const colors = require('../../utils/data/colors.json')
const { searchObject } = require('../../utils/searchObject')

const extractor = async (page) => {
    debugger
    await page.waitForSelector('.container');

    debugger
    const data = await page.evaluate(() => {

        try {

            const link = document.URL
            const price = document.querySelector('[style="color: rgb(73, 163, 102);"]').innerText.replace('₺','').trim()
            const imageUrl = Array.from(document.querySelectorAll('.slick-slide img[srcset]')).map(m=>m.src).filter((f,i)=> i<5)
            const title = document.querySelector('.product-name').innerText
            const size = Array.from(document.querySelectorAll('.variant-name')).map(m=>m.parentNode).filter(f=>f.childNodes.length===1).map(m=> parseInt(m.children[0].innerText))
            const sku = document.querySelector('.categories-detail').childNodes[1].innerText
       
            return {
                title,
                price,
                size,
                imageUrl,
                link,
                timestamp: Date.now(),
                marka: 'ebsumu',
                sku,
              
            }
        }
        catch (error) {

            return { error: error.toString(), content: document.innerHTML, url: document.URL }
        }
    })
    const color = colors.find((f) => searchObject({ link: data.link, title: data.title }, f.searchterm))
    const withColor = { ...data, color: color ? color.category : 'unknown' }
    debugger
    return withColor
}



module.exports = { extractor, prodLinkSelector: '[data-id] a', isAutoScroll: true }



















