const hummus = require('hummus'), fs = require('fs');

module.exports = function(targetPath, ...sources){
    if(!targetPath || sources.length===0){
        console.log('请提供正确的文件');
        return;
    }
    if(fs.existsSync(targetPath)){
        fs.unlinkSync(targetPath);
    }
    const pdfWriter = hummus.createWriter(targetPath);
    sources.forEach((source)=>{
        pdfWriter.appendPDFPagesFromPDF(source);
    });
    pdfWriter.end();
};