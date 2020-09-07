import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);


let userInfo = {}

try {
	userInfo = uni.getStorageSync('userInfo');
} catch (e) {
	console.log(e)
}

const store = new Vuex.Store({
	state: {
		userInfo: {
			nickName: "",
			gender: "",
			avatarUrl: '',
			phone: '',
			status: '',
			location: '',
			openId: userInfo.openId,
			sessionKey: ''
		}
	},
	getters: {},
	mutations: {
		updateUserInfo(state, value) {
			uni.setStorage({
				data: value.userInfo,
				key: 'userInfo',
				success() {
					state.userinfo = value.userinfo
				}
			})
		}
	},
	actions: {
		saveUpdateUserInfo(store, value) {
			store.commit('updateUserInfo', value)
		}
	}
})

export default store
