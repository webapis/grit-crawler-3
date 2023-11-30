const colors = require('../../utils/data/colors.json')
const { searchObject } = require('../../utils/searchObject')

const extractor = async (page) => {

    await page.waitForSelector('#pageContent');
 
    const data = await page.evaluate(() => {

        try {
         
            const link = document.URL

            const price = document.querySelector('[data-old]').innerText.replace('TL','').trim()
            const imageUrl = Array.from(document.querySelectorAll('#productThumbs img')).map(m=>m.src)
            const title = document.querySelector('#productName').innerText
            const size = Array.from(document.querySelectorAll('.variantList a')).map(m=>m.innerText).filter(Number).map(m=> parseInt(m))
            const optionColors = ''
            const description = ''
            const sku =document.querySelector('#productName').innerText.split(' ').reverse()[0]
            return {
             
                title,

                optionColors,
                price,
                size,
                imageUrl,
                link,
                timestamp: Date.now(),
                description,
                marka: 'iconas',
                sku
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



module.exports = { extractor,  prodLinkSelector: '.detailLink', isAutoScroll: true }



















