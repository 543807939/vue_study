const path = require('path')
module.exports = {
    mode:'development', // 指定模式 - 编译模式 production
    entry:path.join(__dirname,'./src/index.js'),
    output:{
        path:path.join(__dirname,'./dist'), // 输出文件的存放路径
        filename:'bundle.js' // 输出文件的名称 
    }
}