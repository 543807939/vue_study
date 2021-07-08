
import $ from 'jquery'
import './css/index.css'
import './css/1.less'
import './css/2.scss'
$(function () {
    console.log(1);
    $('li:odd').css({
        backgroundColor: '#f08'
    })
    $('li:even').css({
        backgroundColor: '#7ed6df'
    })
})
class Person {
    static info = 'aaa'
}
console.log(Person.info);