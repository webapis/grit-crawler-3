

const extractor = async (page) => {

    await page.waitForSelector('.productdetails');
    await page.waitForSelector('.hasImage.active')
    await page.waitForSelector('[data-val-lang]')
    const data = await page.evaluate(() => {

        try {

            const link = document.URL

            const price = document.querySelector('.product-price-detail').childNodes.length == 2 ? document.querySelector('.product-price-detail').childNodes[1].textContent.replace('TL', '').trim() : document.querySelector('.product-price-detail').textContent.replace('TL', '').trim()
            const imageUrl = Array.from(document.querySelectorAll('[data-zoom-image] img')).map(m => m.src)
            const title = document.querySelector('h1').innerText
            const size = Array.from(document.querySelectorAll('[data-attr=BEDEN]')).map(m => m.innerText).filter(Number).map(m => parseInt(m))
            const color = document.querySelector('.hasImage.active').getAttribute('data-val-lang')
            const sku = document.querySelector('h1').innerText.split(' ').reverse()[0]
            if (price.includes('USD')) {
                return null
            }
            return {

                title,
                price,
                size,
                imageUrl,
                link,
                timestamp: Date.now(),
                color,
                sku,
                marka: 'alchera'

            }
        }
        catch (error) {
            return { error: error.toString(), content: document.innerHTML, url: document.URL }
        }
    })

    return data
}

async function getUrls(page) {
    const url = await page.url()
    const pageExist = await page.$('.paging a')
    let pageUrls = []

    if (pageExist) {

        const totalPages = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('.paging a')).map(m => m.innerText).filter(Number)))

        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?page=` + i)
            --pagesLeft

        }
    }

    return { pageUrls }
}

module.exports = { extractor, getUrls, prodLinkSelector: '.product-link' }

















