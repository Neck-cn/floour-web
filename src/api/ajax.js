/*ajax请求库：axios
ajax请求函数封装;axios+promise
* ajax请求函数模块*/
import axios from 'axios'
import global from "../global/global";

const qs = require('qs');
export default function ajax(url, data = {}, type = 'GET', content = "application/json") {//发请求/异步请求
  //用axios发请求，返回值是promise对象(异步返回的数据是response.data)

  return new Promise(function (resolve, reject) {//resolve和reject是两个函数，function参数是函数，被称为高阶函数
    let promise;
    if (type === 'GET') {
      //get请求，将数据DATA对象中的数据拼接到url中去
      let dataStr = '';
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      });
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'));
        url = url + '?' + dataStr
      }
      //发送get请求
      promise = axios.get(url, {headers: {"Content-Type": content, "token": global.token}})
    } else {
      if (content === 'application/x-www-form-urlencoded') {
        data = qs.stringify(data);
      }
      //发送post请求
      promise = axios.post(url, data, {headers: {"Content-Type": content, "token": global.token}})
    }
    //return promise

    promise.then(function (response) {
      //成功调用resolve
      resolve(response.data)
    }).catch(function (error) {
      //失败调用reject
      // reject(error)
      resolve(error.response.data)
    })
  })
}
