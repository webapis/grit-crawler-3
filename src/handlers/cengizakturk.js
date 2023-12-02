const colors = require('../../utils/data/colors.json')
const { searchObject } = require('../../utils/searchObject')

const extractor = async (page) => {

    await page.waitForSelector('.product__page');
    await page.waitForSelector('[name^="options[Renk]-"]:checked')
    const data = await page.evaluate(() => {

        try {

            const link = document.URL
            const price = document.querySelector('[data-currency-try]').getAttribute('data-currency-try').replace('TL', '').trim()
            const imageUrl = Array.from(document.querySelectorAll('.product__thumbs img')).map(m => m.getAttribute('srcset').split(' ').filter(f => f.includes('cengizakturk.com')).map(m => 'https:' + m).reverse()[0]).filter((f, i) => i < 5)
            const title = document.querySelector('h1').innerText
            const size = Array.from(document.querySelectorAll('[name^="options[Beden]"]')).map(m => parseInt(m.getAttribute('value')))
            const sku = document.querySelector('.rte__table-wrapper').textContent.replaceAll('\n', ' ').split(' ').filter(f => f)[2]
            const description = document.querySelector('.rte__table-wrapper').textContent.replaceAll('\n', ' ')
            const color = document.querySelector('[name^="options[Renk]-"]:checked').value
            return {

                title,
                price,
                size,
                imageUrl,
                link,
                timestamp: Date.now(),
                marka: 'cengizakturk',
                sku,
                description,
                color
            }
        }
        catch (error) {
            return { error: error.toString(), content: document.innerHTML }
        }
    })
    debugger
    return data
}

async function getUrls(page) {
    const url = await page.url()
    const pageExist = await page.$('.pagination-custom a')
    let pageUrls = []

    if (pageExist) {

        const totalPages = Math.max(...Array.from(document.querySelectorAll('.pagination-custom a')).map(m => m.innerText).filter(Number).map(m => parseInt(m)))

        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?page=` + i)
            --pagesLeft

        }
    }

    return { pageUrls }
}

module.exports = { extractor, getUrls, prodLinkSelector: '.product-link' }










//document.querySelector('.product__thumbs img').getAttribute('srcset').split(' ').filter(f=>f.includes('cengizakturk.com')).map(m=>'https:'+ m ).reverse()[0]







