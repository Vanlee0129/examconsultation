<template>
	<view class="container">
		<view class="img">
			<image src="../../static/images/start.jpg" mode="aspectFit" class="start"></image>
		</view>
		<button class="button" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">
			<text class="font">绑定手机</text>
		</button>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	import api from '@/common/api.js'
	export default {
		data() {
			return {

			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {
			
		},
		methods: {
			...mapMutations(['updateUserInfo']),
			//获取手机号
			onGetPhoneNumber(e) {
				let that = this;
				console.log(e)
				if (e.detail.errMsg == "getPhoneNumber:ok") {
					api.getPhone({
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv,
						sessionKey: that.userInfo.sessionKey,
						appId: 'wx02c236cbbdcd1a94',
					}).then(res => {
						let [ , info] = res
						let {data} = info
						console.log(data.data)
						that.userInfo.phone = data.data.phoneNumber
						that.$store.dispatch('saveUpdateUserInfo', {'userInfo': that.userInfo})
					}).then(() => {
						that.updateUserInfo()
					})
				}
			},
			updateUserInfo() {
				let that = this;
				api.saveUserPhone({
					phone: that.userInfo.phone,
					studentId: that.userInfo.openId
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

	.font {
		font-size: 44rpx;
		font-family: PingFang SC;
		font-weight: 600;
		line-height: 60rpx;
		color: rgba(255, 255, 255, 1);
		opacity: 1;
	}
</style>
