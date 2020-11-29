import Vue from 'vue'
import App from './App'

// 导入网络请求
import { $http } from '@escook/request-miniprogram'

// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http

// 请求根路径
$http.baseUrl = 'https://www.uinav.com'

// 请求拦截器
$http.beforeRequest = function (options) {
  // 显示loading效果
	uni.showLoading({
		title:"数据加载中..."
	})
}

// 响应拦截器
$http.afterRequest = function () {
  // 关闭loading效果
	uni.hideLoading()
}

// 自定义方法
uni.$showMsg=function (title = '数据请求失败!', duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon: 'none'
	})
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
