const colors = require('../../utils/data/colors.json')
const { searchObject } = require('../../utils/searchObject')

const extractor = async (page) => {

    await page.waitForSelector('.container');

    const data = await page.evaluate(() => {

        try {

            const link = document.URL
            const price = document.querySelector('.text-discount') ? document.querySelector('.text-discount').textContent.replace('₺', '').trim() : document.querySelector('.whitespace-nowrap.tracking-wider.font-semibold.text-black').textContent.replace('₺', '').trim()
            const imageUrl = Array.from(document.querySelectorAll('.swiper-slide figure img')).map(m => m.src)
            const title = document.querySelector('h1').innerText
            const size = Array.from(new Set(Array.from(document.querySelectorAll('.w-7.h-7')).map(m => { return { classLength: m.classList.length, m } }).filter((f, i) => f.classLength === 17).map(m => m.m.querySelector('span').innerText)))
            const sku = document.querySelectorAll('p.mb-2 span')[1].innerText
            const description = document.querySelector('div p ~ul').parentNode.parentNode.innerText.replaceAll('\n', ' ')
            return {

                title,
                price,
                size,
                imageUrl,
                link,
                timestamp: Date.now(),
                marka: 'ilmio',
                sku,
                description
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

async function clickAndScroll(page) {
    while (true) {
      const isLoadMoreDisabled = await page.$('.btn.btn-disabled.snap.snap-start');
      const loadMoreBtn = await page.$(".btn.snap.snap-start");
  
      if (loadMoreBtn && !isLoadMoreDisabled) {
        await loadMoreBtn.click();
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
      } else {
        break;
      }
    }
  }

module.exports = { extractor, clickAndScroll, prodLinkSelector: 'a[href^="/p/"]' }




















