const puppeteer = require('puppeteer-core');
const initPuppeteerPool = require('./puppeteer-pool');
const utils = require('./utils');

const pool = initPuppeteerPool({ // 全局只应该被初始化一次
    // puppeteerArgs: {
    //   ignoreHTTPSErrors: true,
    //   headless: false, // 是否启用无头模式页面
    //   timeout: 0,
    //   pipe: true, // 不使用 websocket 
    // }
    puppeteerArgs: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: utils.chrome(),
        ignoreHTTPSErrors: true
    }
});

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

        await page.goto(url, { waitUntil: 'networkidle0' });

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


const muti = async function(opts) {

    const { url, savePath, waitTime, pdfOpts = {}, styleContent } = opts || {};
    
    try{
        const page = await pool.use(async function (instance){
            const page = await instance.newPage();
            return page;
        });
    
        await page.goto(url, { waitUntil: 'networkidle0' });

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
    }catch(e){
        console.log(e);
        return false;
    }
    
    return true;
};



module.exports = muti;