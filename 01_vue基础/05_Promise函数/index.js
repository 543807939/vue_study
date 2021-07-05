// 引入express
const express = require('express')
// 创建服务器实例
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

// 路由
app.get('/async1', (req, res) => {
    res.json({
        name: '张三',
        age: 14,
        gender: '男'
    })
})
app.get('/async2', (req, res) => {
    res.json({
        name: '李四',
        age: 15,
        gender: '男'
    })
})
app.get('/axios-json', (req, res) => {
    res.json({
        name: '张三',
        age: 14,
        gender: '男'
    })
})
app.post('/people', (req, res) => {
    res.send(req.body)
})
app.delete('/axios', (req, res) => {
    res.send(req.query)
})
app.get('/axios/:id', (req, res) => {
    res.send(req.params.id)
})
app.get('/axios', (req, res) => {
    res.send(req.query)
})
app.get('/adata', (req, res) => {
    res.send('hello axios')
})
app.get('/dataFetch', (req, res) => {
    res.send('hello Fetch')
})
app.get('/data1', (req, res) => {
    res.send('hello promise')
})
app.get('/data2', (req, res) => {
    res.send('hello express')
})
app.get('/data3', (req, res) => {
    res.send('hello vue')
})
app.get('/books', (req, res) => {
    res.send(req.query)
})
app.get('/books/:id', (req, res) => {
    res.send(req.params)
})
app.delete('/books/:id', (req, res) => {
    res.send(req.params.id + 'delete请求')
})
app.post('/books', (req, res) => {
    res.send(req.body)
})

app.post('/book', (req, res) => {
    // res.send(req.body)
    res.json({
        uname: '张萨满',
        age: 15,
        gender: '男'
    })
})

app.listen(3000, () => {
    console.log('express service running at http://127.0.0.1:3000');
})