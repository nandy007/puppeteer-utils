
# chrome下载地址

## win64

https://storage.googleapis.com/chromium-browser-snapshots/Win_x64/756035/chrome-win.zip

## mac

https://storage.googleapis.com/chromium-browser-snapshots/Mac/756035/chrome-mac.zip


## linux

https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/756035/chrome-linux.zip


# 使用

## 第一步：修改页面样式

页面默认是按照A4尺寸打印，并且默认会调用页面的<code>print</code>媒体选择器进行渲染，当页面浏览器展示和打印时效果有差异时需要给print媒体选择器添加样式。

特别需要注意的是，页面中不可使用自己的滚动条，必须一律使用window的滚动条，所以需要确保原有页面的滚动条全部失效，即垂直展开所有内容。

修改样式示例：

```css

@media print{
    html, body, #app{
        height: auto !important;
    }    
    .content-item{
        display: block !important;
    }
    *{
        position: static !important;
    }
}

@page{     
    margin: 30px;
}

```

## 第二步：代码调用

```javascript

const path = require('path');

const htmlToPdf = require('puppeteer-utils/htmlToPdf');

const utils = require('puppeteer-utils/utils');

utils.basePath = ''; // 设置为具体的chrome所在目录，该目录下存放解压后的目录（包含解压目录，即chrome-xxx）

const url = 'https://www.baidu.com';

const pdfFilePath = path.join(__dirname, 'index.pdf');

(async () => {
    const rs = await htmlToPdf({
        url, // 设置要生成pdf的html页面地址
        savePath: pdfFilePath, // pdf文件的完整路径
        // waitTime: 3000 // 页面请求后等待时间
        // pdfOpts: {} // pdf生成选项
    });
    console.log(rs ? '成功' : '失败');
})();


```



