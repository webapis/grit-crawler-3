const colors = require('../../utils/data/colors.json')
const { searchObject } = require('../../utils/searchObject')

const extractor = async (page) => {
    debugger
    await page.waitForSelector('.contentProductDetail');
    debugger
    const data = await page.evaluate(() => {

        try {

            const link = document.URL

            const price = document.querySelector('.kampanyaFiyat').childNodes[1].textContent.replace('₺', '').trim()
            const imageUrl = Array.from(document.querySelectorAll('.SmallImages img[data-cloudzoom]')).map(m => JSON.parse(m.getAttribute('data-cloudzoom')).zoomImage)
            const title = document.querySelector('.ProductName h1 span').innerText
            const size = Array.from(document.querySelectorAll('.eksecenekLine span')).map(m => m.innerText).filter(Number).map(m => parseInt(m))
            const optionColors = ''
            const description = document.querySelector('.teknikDetay') ? document.querySelector('.teknikDetay').innerText.replaceAll('\n', ' ') : ''
            const sku = document.querySelector('.productcode').childNodes[1].textContent
            return {

                title,

                optionColors,
                price,
                size,
                imageUrl,
                link,
                timestamp: Date.now(),
                description,
                marka: 'abiyesarayi',
                sku
            }
        }
        catch (error) {

            return { error: error.toString(), content: document.innerHTML, url: document.URL }
        }
    })
    debugger
    const color = colors.find((f) => searchObject({ link: data.link, title: data.title }, f.searchterm))
    const withColor = { ...data, color: color ? color.category : 'unknown' }
    debugger
    return withColor
}



module.exports = { extractor, prodLinkSelector: '.detailUrl', isAutoScroll: true }



















