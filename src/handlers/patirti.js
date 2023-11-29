const colors = require('../../utils/data/colors.json')
const { searchObject } = require('../../utils/searchObject')

const extractor = async (page) => {

    await page.waitForSelector('.maincontent');
    await page.waitForSelector('.size.sizemarginall');

    const data = await page.evaluate(() => {

        try {
            const link = document.URL
            const price = document.querySelector('.pricenewbig').innerText.replace('₺', '')
            const imageUrl = Array.from(document.querySelectorAll('.carousel-start img')).map(m => m.getAttribute('data-src')).filter(f => f).map(m => 'https://www.patirti.com/' + m)
            const title = document.querySelector('h1.producttoptitle').innerText
            const size = Array.from(document.querySelectorAll('.size.sizemarginall')).map(m => m.innerText).filter(Number).map(m => parseInt(m))
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
                marka: 'patirti'
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



module.exports = { extractor, prodLinkSelector: '.categoryitem a.categoryitemlink', isAutoScroll: true }




















