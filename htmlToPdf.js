const puppeteer = require('puppeteer-core');
const utils = require('./utils');


const single = async function (opts) {

    const { url, savePath, waitTime, pdfOpts = {}, styleContent } = opts || {};

    let browser;

    try {
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: utils.chrome(),
            ignoreHTTPSErrors: true
        });

        const page = await browser.newPage();

        // await page.setDefaultNavigationTimeout(120*1000);
        
        opts.init && await opts.init(page);

        await page.goto(url, { waitUntil: 'networkidle0', timeout: 0 });

        if (waitTime) {
            await page.waitFor(waitTime);
        }

        if (styleContent) {
            await page.addStyleTag({
                content: styleContent
            });
        }

        await page.emulateMedia('print');

        await page.pdf(Object.assign({
            path: savePath,
            format: 'A4',
            scale: 1,
            printBackground: true,
            landscape: false,
            displayHeaderFooter: false,
        }, pdfOpts));

        await browser.close();
    } catch (e) {
        console.error(e);
        if(browser) await browser.close();
        return false;
    }

    return true;
};


module.exports = single;