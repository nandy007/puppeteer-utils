
# html转pdf使用

## 第一步：将puppeteer-utils作为项目依赖并安装

```json

"dependencies": {
    "puppeteer-utils": "git+https://github.com/nandy007/puppeteer-utils.git"
}

```

## 第二步：下载浏览器内核并解压

### win64

https://storage.googleapis.com/chromium-browser-snapshots/Win_x64/756035/chrome-win.zip

### mac

https://storage.googleapis.com/chromium-browser-snapshots/Mac/756035/chrome-mac.zip


### linux

https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/756035/chrome-linux.zip


注：下载后解压到某个目录，后面会用到这个目录


## 第三步：修改页面样式

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

## 第四步：代码调用

```javascript

const path = require('path');

const htmlToPdf = require('puppeteer-utils/htmlToPdf');

const utils = require('puppeteer-utils/utils');

utils.basePath = ''; // 设置为具体的chrome所在目录，该目录下存放解压后的目录（不包含解压目录，即chrome-xxx）

const url = 'https://www.baidu.com';

const pdfFilePath = path.join(__dirname, 'index.pdf');

(async () => {
    const rs = await htmlToPdf({
        url, // 设置要生成pdf的html页面地址
        savePath: pdfFilePath, // pdf文件的完整路径
        // waitTime: 3000 // 页面请求后等待时间
        // styleContent: `` // 注入页面样式
        pdfOpts: {
            displayHeaderFooter: true, // 显示页眉页脚
            headerTemplate: `<div
            style="width:80%;margin:0 auto;font-size:8px;border-bottom:1px solid #ddd;padding:10px 0;display: flex; justify-content: space-between;">
            <span>我是页眉</span>
            <span>我也是页眉</span>
            </div>`, // 页眉模板
            footerTemplate: `<div
            style="width:80%;margin:0 auto;font-size:8px;border-bottom:1px solid #ddd;padding:10px 0;display: flex;">
            <span style="flex:1;">我是页脚</span><span class="pageNumber"></span><span>/</span><span class="totalPages"></span>
            <span style="flex:1;text-align:right;">我也是页脚</span>
            </div>`, // 页脚模板，pageNumber，totalPages样式可直接被数据注入
            margin : {top: 80,bottom: 80 },
        } // pdf生成选项
    });
    console.log(rs ? '成功' : '失败');
})();


```


# 合并pdf使用

## 示例


```javascript

const path = require('path');

const mergePdf = require('puppeteer-utils/mergePdf');

mergePdf(
    path.join(__dirname, 'merge.pdf'), // 第一个参数是最终合并后的文件路径
    path.join(__dirname, 'mmi.pdf'), // 往后的每一个参数按顺序合并到上述文件
    path.join(__dirname, 'index.pdf')
);

```


# F & Q

## linux下报错libxxx.so.x找不到

原因是依赖库不存在，可通过如下命令安装相关依赖：

```bash

yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 -y

```

## linux下转换的pdf有乱码

原因是字体库不全导致，可通过如下步骤解决：

### 安装基础字体

```bash

yum install ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y

```

### 安装中文字体

可以先通过命令查看是否有需要的中文字体：

```bash

fc-list :lang=zh

```

通常是没有任何内容，这时候可以把windows系统字体文件夹中需要的字体发送到 /usr/share/fonts/ 文件夹内，一般只需要宋体和微软雅黑就行了。

然后需要执行如下命令刷新字体：

```bash

sudo mkfontscale
sudo mkfontdir

```

再次执行字体查看，可以看到有字体：

```bash

[root@agile ~]# fc-list :lang=zh
/usr/share/fonts/msyh.ttc: Microsoft YaHei:style=Normal
/usr/share/fonts/msyh.ttc: Microsoft YaHei UI:style=Normal
/usr/share/fonts/simsun.ttc: 宋体,SimSun:style=常规,Regular
/usr/share/fonts/msyhbd.ttc: Microsoft YaHei:style=Έντονα
/usr/share/fonts/msyhbd.ttc: Microsoft YaHei UI:style=Έντονα
/usr/share/fonts/msyhl.ttc: Microsoft YaHei,Microsoft YaHei Light:style=Light,Regular
/usr/share/fonts/msyhl.ttc: Microsoft YaHei UI,Microsoft YaHei UI Light:style=Light,Regular
/usr/share/fonts/simsun.ttc: 新宋体,NSimSun:style=常规,Regular

```






