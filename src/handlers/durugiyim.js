

const extractor = async (page) => {
    debugger
    await page.waitForSelector('.contentProductDetail');
    await page.waitForSelector('.size_box.selected[title]');
    debugger
    const data = await page.evaluate(() => {

        try {

            const link = document.URL
            const price = document.querySelector('.spanFiyat').innerText.replace('₺', '')
            const imageUrl = Array.from(document.querySelectorAll('.SmallImages img')).map(m => m.src)
            const title = document.querySelector('.ProductName h1 span').innerText
            const size = Array.from(document.querySelectorAll('.kutuluvaryasyon .right_line span')).map(m => m.innerText)
            const sku = document.querySelector('.productcode').childNodes[0].textContent.replaceAll('\n', '')
            const color = document.querySelector('.size_box.selected[title]').getAttribute('title')
            return {
                title,
                price,
                size,
                imageUrl,
                link,
                timestamp: Date.now(),
                marka: 'durugiyim',
                sku,
                color
            }
        }
        catch (error) {

            return { error: error.toString(), content: document.innerHTML, url: document.URL }
        }
    })
    return data
}



module.exports = { extractor, prodLinkSelector: '.detailLink.detailUrl', isAutoScroll: true }



















