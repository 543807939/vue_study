let name = '张三'
let age = 14
let gender = 'male'
let nickname = '法外狂徒'

function showMsg() {
    console.log(`${name} - ${age} - ${gender} - ${nickname}`);
}
showMsg()
// 每个模块中只可以有一次 export default {} 否则会报错  如果没有暴露成员,则默认导入的时候接收到一个空对象
export default {
    name,age,gender,showMsg
}