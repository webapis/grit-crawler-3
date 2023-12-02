


import { createPuppeteerRouter, RequestQueue } from 'crawlee';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
require('dotenv').config()
const marka = process.env.marka
const { autoScroll } = require('../utils/autoscroll')
export const router = createPuppeteerRouter();
const requestQueue = await RequestQueue.open();
router.addDefaultHandler(async ({ enqueueLinks, log, page, request: { userData: { start } } }) => {
    debugger
    const prodLinkSelector = require(`./handlers/${marka}`).prodLinkSelector;
    const isAutoScroll = require(`./handlers/${marka}`).isAutoScroll;
    const clickAndScroll = require(`./handlers/${marka}`).clickAndScroll;

    log.info(`enqueueing new URLs`, 'userData', start);
    if (isAutoScroll) {

        await autoScroll(page)
    }

    if (clickAndScroll) {
        await clickAndScroll(page)
    }

    await enqueueLinks({
        selector: prodLinkSelector,
        transformRequestFunction: (req) => {
            return req
        },
        label: 'detail',
    });
    debugger
    if (start) {
        const getUrls = require(`./handlers/${marka}`).getUrls;
        if (getUrls) {
            const { pageUrls } = await getUrls(page)

            debugger
            for (let url of pageUrls) {
                console.log('addurl', url)
                requestQueue.addRequest({ url, userData: {} })


            }

        }

    }


});

router.addHandler('detail', async ({ request, page, log, pushData }) => {
    debugger
    const title = await page.title();

    const extractor = require(`./handlers/${marka}`).extractor;
    const data = await extractor(page)

    log.info(`${title}`, { url: request.loadedUrl });
    if (data !== null) {
        await pushData(data);
    }

});
