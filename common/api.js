const root = 'https://xszx.yofea.com/'
// const root = 'http://192.168.10.110:3001/'

export default {
	//获取openid
	getOpenId: params => {
		return uni.request({
			url: root + 'getOpenId',
			data: params,
			method: 'POST' 
		})
	},
	//查询用户是否存在
	isUser: params => {
		return uni.request({
			url: root + 'getStudent',
			data: params,
			method: 'POST'
		})
	},
	//第一次登陆创建用户信息
	creatUserInfo: params => {
		return uni.request({
			url: root + 'addStudent',
			data: params,
			method: 'POST'
		})
	},
	//获取手机号
	getPhone: params => {
		return uni.request({
			url: root + 'getPhone',
			data: params,
			method: 'POST'
		})
	},
	//在数据库中存储用户手机号
	saveUserPhone: params => {
		return uni.request({
			url: root + 'addPhone',
			data: params,
			method: 'POST'
		})
	},
	//获取用户信息
	getUserInfo: params => {
		return uni.request({
			url: root + 'getUserInfo',
			data: params,
			method: 'POST'
		})
	},
	//填写地址和身份
	addLocationAndStatus: params => {
		return uni.request({
			url: root + 'addUserInfo',
			data: params,
			method: 'POST'
		})
	},
	//获取专家列表
	getTeacherList: params => {
		return uni.request({
			url: root + 'getTeacher',
			data: params,
			method: 'POST'
		})
	},
	//获取订单列表
	getOrderList: params => {
		return uni.request({
			url: root + 'getOrderList',
			data: params,
			method: 'POST'
		})
	},
	//判断是否付款
	isPay: params => {
		return uni.request({
			url: root + 'isPay',
			data: params,
			method: 'POST'
		})
	},
	//微信支付接口
	prePay: params => {
		return uni.request({
			url: root + 'wxPay',
			data: params,
			method: 'POST'
		})
	},
	//增加订单
	addOrder: params => {
		return uni.request({
			url: root + 'addOrder',
			data: params,
			method: 'POST'
		})
	},
	//增加专家收入记录
	addTeacherIncome: params => {
		return uni.request({
			url: root + 'addTeacherIncome',
			data: params,
			method: 'POST'
		})
	}
}