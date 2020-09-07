<template>
	<view class="index-container">
		<view class="header">
			<view class="avatar">
				<image :src="avatar" mode="aspectFit" class="avatar-image"></image>
			</view>
			<view class="master-name">{{masterName}}老师</view>
			<view class="master-title">{{masterTitle}}</view>
			<view class="location">{{masterLocation}}</view>
			<view class="line"></view>
		</view>
		<view class="contact">
			<view class="phone">
				<text class="font-style">电话</text>
				<text class="info-style">{{masterPhone}}</text>
			</view>
			<view class="sline"></view>
			<view class="wechat">
				<text class="font-style">微信</text>
				<text class="info-style">{{masterWx}}</text>
			</view>
		</view>
		<view class="block"></view>
		<view class="masterInfo">
			<view class="flag"></view>
			<view class="introduce">专家介绍</view>
			<view class="introduce-text">{{introduceText}}</view>
			<view class="line"></view>
			<view class="flag"></view>
			<view class="introduce">资历</view>
			<view class="introduce-text">{{seniority}}</view>
			<view class="pay-button" @click="prePay" v-if="showPay">
				<text class="font">{{price}}元咨询该专家</text>
			</view>
			<view class="block" v-else></view>
		</view>
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
				mTX: '../../static/images/defaultAvatarM.jpg',
				fTX: '../../static/images/defaultAvatarF.jpg',
				price: 1500,
				masterName: "李子君",
				masterTitle: "资深志愿填报专家",
				masterPhone: "付款后为您展示",
				masterWx: "付款后为您展示",
				masterLocation: '',
				introduceText: '',
				seniority: '',
				teacherId: '',
				package: '',
				paySign: '',
				timeStamp: '',
				nonceStr: '',
				buttonText: '',
				showPay: true,
				block: '',
				out_trade_no: '',
				wx: '',
				phone: '',
				gender: '',
				tx: '',
				avatar: ""
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			getTime() {
				let time = Date.parse(new Date()) / 1000
				return time
			},
			async prePay() {
				let that = this
				if (!this.userInfo.openId) {
					uni.navigateTo({
						url: '../start/start'
					})
					return;
				}
				api.prePay({
					openid: this.userInfo.openId,
					total_fee: that.price
				}).then(res => {
					let [, info] = res
					let {
						data
					} = info
					console.log(data.data)
					that.timeStamp = data.timeStamp
					that.package = data.data.package
					that.paySign = data.data.paySign
					that.nonceStr = data.nonceStr
					that.out_trade_no = data.out_trade_no
				}).then(() => {
					that.pay()
				})
			},
			pay() {
				let that = this
				console.log("112233");
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: `${that.timeStamp}`,
					nonceStr: that.nonceStr, //随机字符串
					package: that.package,
					signType: 'MD5',
					paySign: that.paySign, //签名内容
					success: function(res) {
						console.log('success:' + JSON.stringify(res));
						api.addOrder({
							studentId: that.userInfo.openId,
							teacherId: that.teacherId,
							orderNo: that.out_trade_no,
							amount: that.price
						}).then(res => {
							let [, info] = res
							let {
								data
							} = info
							if (data.state == 'success') {
								api.addTeacherIncome({
									studentId: that.userInfo.openId,
									teacherId: that.teacherId,
									income: that.price,
									orderNo: that.out_trade_no
								}).then(() => {
									let wx = that.wx
									let phone = that.phone
									that.masterPhone = phone
									that.masterWx = wx
									that.showPay = false
								})
							}
						})
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
					}
				})
			},
			async isPay() {
				let that = this
				if (!that.userInfo.openId) {
					that.masterPhone = "付款后为您展示"
					that.masterWx = "付款后为您展示"
				}else{
					api.isPay({
						studentId: that.userInfo.openId,
						teacherId: that.teacherId
					}).then(res => {
						let [, info] = res
						let {
							data
						} = info
						console.log(data.data)
						if (data.data.length == 0) {
							that.masterPhone = "付款后为您展示"
							that.masterWx = "付款后为您展示"
							that.buttonText = `${that.price}元咨询该专家`
							that.showPay = true
						} else {
							that.showPay = false
						}
					})
				}
			}
		},
		onLoad(options) {
			console.log(options)
			this.masterName = options.name
			this.masterTitle = options.qualification
			this.masterPhone = options.phone
			this.masterWx = options.wechat
			this.wx = options.wechat
			this.phone = options.phone
			this.introduceText = options.introduce
			this.seniority = options.certificate
			this.teacherId = options.teacherId
			this.price = options.price
			this.gender = options.gender
			this.avatar = options.avatar
			this.masterLocation = options.location
			console.log(options.avatar)
			if (this.avatar == 'null') {
				console.log(1)
				this.avatar = this.gender == '男' ? this.mTX : this.fTX;
				console.log(this.avatar)
			} else {
				this.tx = options.avatar
			}
		},
		async onShow() {
			await this.isPay()
		}
	};
</script>

<style>
	page {
		background-color: white;
	}

	.index-container {
		width: 750rpx;
		overflow-x: hidden;
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 750rpx;
		/* height: 324rpx; */
		background-color: white;
	}

	.avatar {
		width: 158rpx;
		height: 158rpx;
		margin-top: 30rpx;
		border-radius: 50%;
		overflow: hidden;
	}

	.avatar-image {
		width: 158rpx;
		height: 158rpx;
	}

	.master-name {
		font-size: 36rpx;
		font-family: PingFang SC;
		font-weight: 600;
		line-height: 50rpx;
		color: rgba(51, 51, 51, 1);
		opacity: 1;
		margin-top: 22rpx;
	}

	.master-title {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 34rpx;
		color: rgba(153, 153, 153, 1);
		opacity: 1;
		margin-top: 8rpx;
	}

	.location {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 34rpx;
		color: rgba(153, 153, 153, 1);
		opacity: 1;
		margin-top: 8rpx;
	}

	.line {
		width: 686rpx;
		height: 0px;
		border: 1px solid rgba(238, 238, 238, 1);
		opacity: 1;
		margin-top: 22rpx;
		margin-left: 0rpx;
	}

	.contact {
		width: 750rpx;
		height: 134rpx;
		background-color: white;
	}

	.phone {
		display: inline-block;
		position: relative;
		top: 48rpx;
		left: 32rpx;
	}

	.font-style {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 40rpx;
		color: rgba(51, 51, 51, 1);
		opacity: 1;
		margin: 24rpx;
	}

	.info-style {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 34rpx;
		color: rgba(153, 153, 153, 1);
		opacity: 1;
	}

	.sline {
		width: 2px;
		height: 28px;
		background-color: #eeeeee;
		opacity: 1;
		position: relative;
		top: -3rpx;
		left: 373rpx;
	}

	.wechat {
		display: inline-block;
		position: relative;
		top: -58rpx;
		left: 435rpx;
	}

	.block {
		width: 750rpx;
		height: 16rpx;
		background: rgba(238, 238, 238, 1);
		opacity: 1;
	}

	.masterInfo {
		text-align: left;
		display: inline-block;
	}

	.flag {
		width: 10rpx;
		height: 32rpx;
		background: #feba52;
		opacity: 1;
		border-radius: 6rpx;
		margin-top: 36rpx;
		margin-left: 32rpx;
	}

	.introduce {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 600;
		line-height: 40rpx;
		color: rgba(51, 51, 51, 1);
		opacity: 1;
		position: relative;
		top: -33rpx;
		left: 74rpx;
	}

	.introduce-text {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 40rpx;
		color: rgba(102, 102, 102, 1);
		opacity: 1;
		width: 686rpx;
		margin-left: 32rpx;
	}

	.line {
		width: 686rpx;
		height: 0px;
		border: 1px solid rgba(238, 238, 238, 1);
		opacity: 1;
		margin-top: 50rpx;
	}

	.pay-button {
		width: 686rpx;
		height: 92rpx;
		background: #feba52;
		opacity: 1;
		margin-left: 32rpx;
		margin-top: 20rpx;
		margin-bottom: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.target {
		width: 32rpx;
		height: 32rpx;
		border: 2rpx solid rgba(255, 255, 255, 1);
		border-radius: 50%;
		opacity: 1;
	}

	.font {
		font-size: 36rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 50rpx;
		color: rgba(255, 255, 255, 1);
		opacity: 1;
	}

	.block {
		width: 750rpx;
		height: 50rpx;
		background-color: white;
	}
</style>
