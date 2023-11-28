


import { createPuppeteerRouter, RequestQueue } from 'crawlee';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
require('dotenv').config()
const marka = process.env.marka
export const router = createPuppeteerRouter();
const requestQueue = await RequestQueue.open();
router.addDefaultHandler(async ({ enqueueLinks, log, page, request: { userData: { start } } }) => {
    debugger
    const prodLinkSelector = require(`./handlers/${marka}`).prodLinkSelector;
    log.info(`enqueueing new URLs`, 'userData', start);

    debugger
    const pages = await page.$$(prodLinkSelector)
    debugger
  const result=  await enqueueLinks({
        selector: prodLinkSelector,
        transformRequestFunction: (req) => {
            return req
        },
        label: 'detail',
    });
    debugger
    if (start) {
        const getUrls = require(`./handlers/${marka}`).getUrls;
        const { pageUrls } = await getUrls(page)
        debugger
        for (let url of pageUrls) {
            console.log('addurl', url)
            requestQueue.addRequest({ url, userData: {} })


        }
    }


});

router.addHandler('detail', async ({ request, page, log, pushData }) => {
    debugger
    const title = await page.title();

    const extractor = require(`./handlers/${marka}`).extractor;
    const data = await extractor(page)

    log.info(`${title}`, { url: request.loadedUrl });

    await pushData(data);
});
