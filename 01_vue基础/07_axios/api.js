const express = require('express')
const app = express()
// 解析post body
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const cors = require('cors')
app.use(cors())
// 解决跨域
app.use('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //这个表示任意域名都可以访问，这样写不能携带cookie了。
    //res.header('Access-Control-Allow-Origin', 'http://www.baidu.com'); //这样写，只有www.baidu.com 可以访问。
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS'); //设置方法
    next();
});

app.get('/user', (req, res) => {

    return res.json({
        status: 0,
        params: req.query
    })

})
app.get('/user/:id', (req, res) => {
    res.send({
        status: 1,
        id: req.params.id
    })
})

app.post('/user', (req, res) => {
    res.send(req.body)
})

app.post('/test', (req, res) => {
    res.send('hello')
})
app.post('/test-new', (req, res) => {
    if (req.body.id == 'hello') {
        res.send('成功')
    } else {
        res.send('失败')
    }
})
app.listen(3000, function () {
    console.log(`express service running at http://127.0.0.1:3000`);
})