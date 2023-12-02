const colors = require('../../utils/data/colors.json')
const { searchObject } = require('../../utils/searchObject')

const extractor = async (page) => {

    await page.waitForSelector('.productDetailContainer');

    const availableInStock = await page.$('.size_box:not(.nostok)');
    if (availableInStock) {
        const data = await page.evaluate(() => {
        
            try {
                const link = document.URL
                const price = document.querySelector('.spanFiyat').innerText.replace('₺', '')
                const imageUrl = Array.from(document.querySelectorAll('.SmallImages img')).map(m => m.getAttribute('data-original-last'))
                const title = document.querySelector('h1').innerText
                const size = Array.from(document.querySelectorAll('.size_box:not(.nostok)')).map(m => m.innerText)//Array.from(document.querySelectorAll('.size_box')).map(m => m.innerText).find(m => m.includes('XL')) ? Array.from(document.querySelectorAll('.size_box')).map(m => m.innerText).filter(f => f) : Array.from(document.querySelectorAll('.size_box')).map(m => m.innerText.includes('-') ? m.innerText.split('-').filter(Number) : m.innerText.split('/').filter(Number) ).flat().filter(Number).map(m => parseInt(m))
                const sku = document.querySelector('.productcode').childNodes[1].textContent
                const description =document.querySelector('.urunTabAlt ul')? document.querySelector('.urunTabAlt ul').textContent.replaceAll('\n',' '):''

                return {
                    title,
                    price,
                    size,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'egzbutik',
                    sku,
                    description
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
    else {
        return null
    }

}



module.exports = { extractor, prodLinkSelector: '.detailLink.detailUrl', isAutoScroll: true }


















