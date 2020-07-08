const puppeteer = require('puppeteer-core');
const utils = require('./utils');

module.exports = async function (opts) {

    const { url, savePath, waitTime, pdfOpts = {}, styleContent } = opts || {};

    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: utils.chrome(),
            ignoreHTTPSErrors: true
        });

        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });

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
        return false;
    }

    return true;
};
