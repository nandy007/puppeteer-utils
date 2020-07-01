const puppeteer = require('puppeteer-core');
const utils = require('./utils');

module.exports = async function(opts){

    const { url, savePath, waitTime, pdfOpts = {}} = opts || {};

    try{
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: utils.chrome(),
            ignoreHTTPSErrors: true
        });
    
        const page = await browser.newPage();
    
        await page.goto(url, { waitUntil: 'networkidle2' });

        if(waitTime){
            await page.waitFor(waitTime);
        }

        // await page.addStyleTag({
        //     content: `
        //     @media print{
        //         html, body, #app,
        //         .report .main .module .box .box-item .content .content-item .detail{
        //             height: auto !important;
        //         }    
        //         .report{
        //             width: 100%;
        //         }
        //         .content-item{
        //             display: block !important;
        //         }
        //         *{
        //             position: static !important;
        //         }
        //         .box-item {page-break-inside: avoid;}
        //     }

        //     @page{     
        //         margin: 30px;
        //     }
        //     `
        // });
        
        await page.emulateMedia('print');
        await page.pdf(Object.assign(pdfOpts, {
            path: savePath,
            format: 'A4',
            scale: 1,
            printBackground: true,
            landscape: false,
            displayHeaderFooter: false,
        }));
    
        await browser.close();
    }catch(e){
        console.error(e);
        return false;
    }

    return true;
};
