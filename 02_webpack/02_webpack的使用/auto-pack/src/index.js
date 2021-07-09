
import $ from 'jquery'
import './css/index.css'
import './css/1.less'
import './css/2.scss'
import Vue from 'vue'
import App from './components/App.vue'
const vm = new Vue({
    el: '#app',
    render: h => h(App)
})


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