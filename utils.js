const os = require('os'), path = require('path');

const utils = module.exports = {
    basePath: path.join(__dirname),
    os(){
        const oss = {
            darwin: 'mac',
            linux: 'linux',
            win32: 'win'
        }, platform = oss[os.platform()];
        return platform;
    },
    chrome(){
        // 这里注意路径指向可执行的浏览器。
        // 各平台路径可以在 node_modules/puppeteer-core/lib/BrowserFetcher.js 中找到
        // Mac 为 '下载文件解压路径/Chromium.app/Contents/MacOS/Chromium'
        // Linux 为 '下载文件解压路径/chrome'
        // Windows 为 '下载文件解压路径/chrome.exe'
        const platform = utils.os();
        const m = {
            mac: 'Chromium.app/Contents/MacOS/Chromium',
            linux: 'chrome',
            win: 'chrome.exe'
        };
        return path.join(utils.basePath, 'chrome-' + platform, m[platform]);
    }
};