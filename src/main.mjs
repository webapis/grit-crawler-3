// For more information, see https://crawlee.dev/
import { PuppeteerCrawler, RequestList, RequestQueue} from 'crawlee';
import { router } from './routes.mjs';
import { createRequire } from "module";
import preNavigationHooks from './crawler-helper/preNavigationHooks.mjs';
const requestQueue = await RequestQueue.open();
const require = createRequire(import.meta.url);
require('dotenv').config()
const marka = process.env.marka


const { urls } = require(`${process.cwd()}/urls/bba/${marka}`)


const crawler = new PuppeteerCrawler({
    requestList: await RequestList.open(null,urls.map(m => { return { url: m.url, userData: { start: true } } })),
    headless: true,
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: router,
    // Comment this option to scrape the full website.
    //  maxRequestsPerCrawl: 20,
    preNavigationHooks,
    requestHandlerTimeoutSecs: 3600,
});
/* for (let u of urls) {
    console.log('addurl', u)
    debugger
    requestQueue.addRequest({ url: u.url, userData: {} })


} */
await crawler.run();
//await crawler.run(urls.map(m=>m.url));