<template>
	<view class="container">
		<view class="img">
			<image src="../../static/images/start.jpg" mode="aspectFit" class="start"></image>
		</view>
		<button class="button" open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">
			<text class="font">立即登录</text>
		</button>
		<button class="refuse" @click="back">
			<text class="font">暂不登录</text>
		</button>
	</view>
</template>

<script>
	import {mapState,mapMutations,mapActions} from 'vuex'
	import api from '@/common/api.js'
	export default {
		data() {
			return {
				sessionKey: '',
				openId: '',
				nickName: null,
				avatarUrl: null,
				code: ''
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		async onLoad() {
			// await this.login()
		},
		methods: {
			...mapMutations(['updateUserInfo']),
			back() {
				uni.switchTab({
					url: '../index/index'
				})
			},
			wxGetUserInfo() {
				let that = this;
				uni.showLoading({
					title: '登录中...'
				});
				// 1.wx获取登录用户code
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(loginRes)
						let code = loginRes.code;
						that.code = code
						//2.将用户登录code传递到后台置换用户SessionKey、OpenId等信息
						api.getOpenId({code: that.code}).then(res => {
							//openId、或SessionKdy存储//隐藏loading
							console.log(res)
							let [ , info] = res
							let {data} = info
							console.log(data.data)
							that.userInfo.openId = data.data.openid
							that.userInfo.sessionKey = data.data.session_key
							that.$store.dispatch('saveUpdateUserInfo', {'userInfo': that.userInfo})
							console.log(that.userInfo, '------------')
						}).then(() => {
							//获取用户信息
							uni.getUserInfo({
								provider: 'weixin',
								success: function(infoRes) {
									console.log(infoRes, '-----------------')
									//获取用户信息后向调用信息更新方法
									that.userInfo.nickName = infoRes.userInfo.nickName;
									//昵称
									that.userInfo.avatarUrl = infoRes.userInfo.avatarUrl;
									that.userInfo.gender = infoRes.userInfo.gender
									//更新用户信息
									that.$store.dispatch('saveUpdateUserInfo', {'userInfo': that.userInfo})
									//更新数据库用户信息
									console.log(that.userInfo.openId)
									api.isUser({
										studentId: that.userInfo.openId
									}).then(res => {
										let [, info] = res
										let {
											data
										} = info
										console.log(data.data)
										if(data.data.length == 0){
											that.updateUserInfo();
											uni.hideLoading();
											uni.switchTab({
												url: '../index/index'
											})
										}else {
											uni.hideLoading();
											uni.switchTab({
												url: '../index/index'
											})
										}
									})
								},
								fail: res => {
									console.log(res)
								}
							});
						})
					},
					fail: (res) => {
						console.log(res)
					}
				});
			},
			updateUserInfo() {
				let that = this;
				api.creatUserInfo({
					studentId: that.userInfo.openId,
					name: that.userInfo.nickName,
					gender: that.userInfo.gender
				}).then(res => {
					let [ , info] = res
					let {data} = info
					if (data.state == "success") {
						uni.switchTab({ //信息更新成功后跳转到小程序首页
							url: '/pages/index/index'
						});
					}
				})
			}
		}
	}
</script>

<style>
	.img {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.start {
		margin-top: 40%;
	}

	.button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 352rpx;
		height: 88rpx;
		background: rgba(254, 189, 89, 1);
		opacity: 1;
		border-radius: 23px;
		margin-left: 200rpx;
	}
	
	.refuse {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 352rpx;
		height: 88rpx;
		margin-top: 30rpx;
		background: rgba(254, 189, 89, 1);
		opacity: 1;
		border-radius: 23px;
		margin-left: 200rpx;
	}

	.font {
		font-size: 44rpx;
		font-family: PingFang SC;
		font-weight: 600;
		line-height: 60rpx;
		color: rgba(255, 255, 255, 1);
		opacity: 1;
	}
</style>
