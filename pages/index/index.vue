<template>
	<view class="index-container">
		<u-modal v-model="tipShow" :content="content" title="提示" @confirm="tip"></u-modal>
		<u-select v-model="locationShow" mode="mutil-column-auto" :list="location" @confirm="selLocation"></u-select>
		<u-select v-model="statusShow" mode="single-column" :list="statusList" @confirm="selStatus"></u-select>
		<view class="content">
			<view class="head-bg">
				<image src="../../static/images/navHome.jpg" mode="scaleToFill" class="head-bg" />
			</view>
			<view class="blank">
				<view @click="filter_location">
					<text class="filter_text">{{filter_title[0]}}</text>
					<u-icon name="arrow-down"></u-icon>
					<u-picker mode="selector" v-model="filter_location_flag" :default-selector="[0]" :range="province" @confirm="set_location"></u-picker>
				</view>
				<view @click="filter_sex">
					<text class="filter_text">{{filter_title[1]}}</text>
					<u-icon name="arrow-down"></u-icon>
					<u-picker mode="selector" v-model="filter_sex_flag" :default-selector="[0]" :range="sex" @confirm="set_sex"></u-picker>
				</view>
				<view @click="filter_price">
					<text class="filter_text">{{filter_title[2]}}</text>
					<u-icon name="arrow-down"></u-icon>
					<u-picker mode="selector" v-model="filter_price_flag" :default-selector="[0]" :range="price" @confirm="set_price"></u-picker>
				</view>
			</view>
			<view class="main" v-for="(item,index) in masterInfo" :key="index">
				<view class="main-container" @click="toMaster(index)">
					<view class="avatar" v-if="item.avatar">
						<image :src="item.avatar" class="avatar-img" />
					</view>
					<view class="avatar" v-else-if="!item.avatar && item.gender == '男'">
						<image :src="mTX" class="avatar-img" />
					</view>
					<view class="avatar" v-else>
						<image :src="fTX" class="avatar-img" />
					</view>
					<view class="name">{{item.name}}老师</view>
					<view class="location">{{item.location}}</view>
					<view class="introduce">{{item.introduce}}...</view>
					<view class="price">{{item.price}}元</view>
					<view class="rate">
						<u-rate count="count" :current="item.rate" active-color="#FEBA52" inactive-color="#b2b2b2" size="34" :disabled="true"></u-rate>
						<text class="rate-number">{{item.rate}}</text>
					</view>
					<view class="tag" v-for="(i, cindex) in masterInfo[index].tag" :key="cindex">
						<u-tag :text="i" color="#666666" bg-color="#F6F6F6" border-color="#F6F6F6" />
					</view>
				</view>
				<view class="space"></view>
			</view>
		</view>
		<view class="bottom-block"></view>
		<u-loadmore :status="status" icon-type="iconType" :load-text="loadText" bg-color="#EEEEEE" class="load" />
		<view class="bottom-block"></view>
	</view>
</template>

<script>
	import data from "../../common/data";
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	import api from '@/common/api.js'
	import location from '@/common/location.js'
	export default {
		data() {
			return {
				mTX: '../../static/images/defaultAvatarM.jpg',
				fTX: '../../static/images/defaultAvatarF.jpg',
				defaultTx: '',
				tipShow: '',
				locationShow: '',
				userLocation: '',
				userStatus: '',
				statusShow: '',
				content: '请先将补充信息填写完整哦~',
				statusList: [{
						value: '1',
						label: '学生'
					},
					{
						value: '2',
						label: '家长'
					}
				],
				status: "loadmore",
				iconType: "flower",
				loadText: {
					loadmore: "",
					loading: "努力加载中",
					nomore: "更多专家还在路上"
				},
				page: 0,
				count: 5,
				keyword: "",
				filterData: [],
				searchStyle: {
					width: 686
				},
				rawInfo: [],
				location: [],
				masterInfo: [],
				temp_masters: [],
				filter_title: ['地区', '性别', '价格'],
				filter_location_flag: false,
				filter_sex_flag: false,
				filter_price_flag: false,
				province: ["北京市", "广东省", "山东省", "江苏省", "河南省", "上海市", "河北省", "浙江省", "香港特别行政区", "陕西省", "湖南省", "重庆市", "福建省", "天津市",
					"云南省", "四川省", "广西壮族自治区", "安徽省", "海南省", "江西省", "湖北省", "山西省", "辽宁省", "台湾省", "黑龙江", "内蒙古自治区", "澳门特别行政区", "贵州省",
					"甘肃省", "青海省", "新疆维吾尔自治区", "西藏区", "吉林省", "宁夏回族自治区"
				],
				sex: ['男', '女'],
				price: ['从高到低', '从低到高']
			};
		},
		components: {},
		async onShow() {
			await this.getUserInfo()
			await this.addInfo()
			await this.havePhone()
		},
		async created() {
			await this.getTeacherList()
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			...mapMutations(['updateUserInfo']),
			filter_location() {
				this.filter_location_flag = true
			},
			filter_sex() {
				this.filter_sex_flag = true
			},
			filter_price() {
				this.filter_price_flag = true
			},
			set_location(e) {
				console.log(e)
				this.filter_title[0] = this.province[e]
				this.getTeacherList()
			},
			set_sex(e) {
				console.log(e)
				this.filter_title[1] = this.sex[e]
				this.getTeacherList()
			},
			set_price(e) {
				console.log(e)
				this.filter_title[2] = this.price[e]
				this.getTeacherList()
			},
			async addInfo() {
				let that = this
				console.log(that.userInfo.openId)
				if (that.userInfo.openId) {
					api.getUserInfo({
						studentId: this.userInfo.openId
					}).then(res => {
						let [, info] = res
						let {
							data
						} = info
						console.log(data.data)
						that.userInfo.status = data.data[0].status
						that.userInfo.location = data.data[0].location
						that.userInfo.phone = data.data[0].phone
						that.$store.dispatch('saveUpdateUserInfo', {
							'userInfo': that.userInfo
						})
						if (data.data[0].location == null || data.data[0].status == null) {
							that.location = location
							that.tipShow = true
						}
					})
				}
			},
			async getTeacherList() {
				let that = this
				api.getTeacherList().then(res => {
					let [, info] = res
					let {
						data
					} = info
					let tmp = JSON.parse(JSON.stringify(data.data))
					this.rawInfo = tmp
					for (var i = 0; i < data.data.length; i++) {
						let element = data.data[i]
						let tag = element.tag
						let introduce = element.introduce
						let name = element.name
						element.name = name.slice(0, 1)
						element.tag = tag.split('，')
						element.introduce = introduce.slice(0, 35)
					}
					if (this.filter_title[0] != '地区') {
						let temp_arr = [];
						data.data.forEach(master => {
							if (master.location.search(this.filter_title[0].slice(0, 2)) != -1) {
								temp_arr.push(master)
							}
						})
						this.masterInfo = temp_arr;
					}
					if (this.filter_title[1] != '性别') {
						this.masterInfo = data.data.filter(master => {
							return master.gender == this.filter_title[1]
						})
					}
					if (this.filter_title[2] != '价格') {
						this.masterInfo = data.data.sort((a, b) => {
							if (this.filter_title[2] == '从高到低') {
								return b.price - a.price
							} else {
								return a.price - b.price
							}
						})
					}
					if (this.filter_title[0] != '地区' && this.filter_title[1] != '性别') {
						let temp_arr = [];
						let temp_arr1 = [];
						temp_arr = data.data.filter(master => {
							return master.gender == this.filter_title[1]
						})
						temp_arr.forEach(master => {
							if (master.location.search(this.filter_title[0].slice(0, 2)) != -1) {
								temp_arr1.push(master)
							}
						})
						this.masterInfo = temp_arr1;
					}
					if (this.filter_title[0] != '地区' && this.filter_title[2] != '价格') {
						let temp_arr = [];
						let temp_arr1 = [];
						temp_arr = data.data.sort((a, b) => {
							if (this.filter_title[2] == '从高到低') {
								return b.price - a.price
							} else {
								return a.price - b.price
							}
						})
						temp_arr.forEach(master => {
							if (master.location.search(this.filter_title[0].slice(0, 2)) != -1) {
								temp_arr1.push(master)
							}
						})
						this.masterInfo = temp_arr1;
					}
					if (this.filter_title[1] != '性别' && this.filter_title[2] != '价格') {
						let temp_arr = [];
						let temp_arr1 = [];
						temp_arr = this.masterInfo.filter(master => {
							return master.gender == this.filter_title[1]
						})
						temp_arr1 = temp_arr.sort((a, b) => {
							if (this.filter_title[2] == '从高到低') {
								return b.price - a.price
							} else {
								return a.price - b.price
							}
						})
						this.masterInfo = temp_arr1;
					}
					if (this.filter_title[0] != '地区' && this.filter_title[1] != '性别' && this.filter_title[2] != '价格') {
						let temp_arr = [];
						let temp_arr1 = [];
						let temp_arr2 = [];
						temp_arr = this.masterInfo.filter(master => {
							return master.gender == this.filter_title[1]
						})
						temp_arr1 = temp_arr.sort((a, b) => {
							if (this.filter_title[2] == '从高到低') {
								return b.price - a.price
							} else {
								return a.price - b.price
							}
						})
						temp_arr1.forEach(master => {
							if (master.location.search(this.filter_title[0].slice(0, 2)) != -1) {
								temp_arr2.push(master)
							}
						})
						this.masterInfo = temp_arr2;
					}
					if (this.filter_title[0] == '地区' && this.filter_title[1] == '性别' && this.filter_title[2] == '价格') {
						this.masterInfo = data.data
					}
					// this.masterInfo = data.data
					this.temp_masters = data.data;
					console.log(this.masterInfo, '----------')
				})
			},
			tip() {
				this.locationShow = true
			},
			selLocation(e) {
				let that = this
				let l = JSON.parse(JSON.stringify(e))
				console.log(l)
				that.userLocation = l[1].label + l[2].label
				that.userInfo.location = that.userLocation
				console.log(that.userLocation)
				that.$store.dispatch('saveUpdateUserInfo', {
					'userInfo': that.userInfo
				})
				this.statusShow = true
			},
			selStatus(e) {
				let that = this
				let s = JSON.parse(JSON.stringify(e))
				console.log(s)
				that.userStatus = s[0].label
				console.log(that.userStatus)
				that.userInfo.status = that.userStatus
				that.$store.dispatch('saveUpdateUserInfo', {
					'userInfo': that.userInfo
				})
				api.addLocationAndStatus({
					studentId: that.userInfo.openId,
					location: that.userLocation,
					status: that.userStatus
				}).then(res => {
					console.log(res)
				})
			},
			toMaster(index) {
				let info = this.masterInfo[index]
				uni.navigateTo({
					url: `../master/master?name=${info.name}&phone=${info.phone}&wechat=${info.wechat}&introduce=${this.rawInfo[index].introduce}&qualification=${info.qualification}&certificate=${info.certificate}&teacherId=${info.teacherId}&price=${info.price}&gender=${info.gender}&avatar=${info.avatar}&location=${info.location}`
				});
			},
			async havePhone() {
				if (this.userInfo.openId) {
					api.getUserInfo({
						studentId: this.userInfo.openId
					}).then(res => {
						let [, info] = res
						let {
							data
						} = info
						console.log(data.data[0])
						if (data.data[0].phone == null) {
							uni.navigateTo({
								url: '../bindPhone/bindPhone'
							})
						}
					})
				}
			},
			onReachBottom() {
				if (this.page >= 1) return;
				this.status = "loading";
				this.page = ++this.page;
				setTimeout(() => {
					this.status = "nomore"
					// this.masterInfo = data;
					// if (this.page >= 2) this.status = "nomore";
					// else this.status = "loading";
				}, 1000);
			},
			async onPullDownRefresh() {
				await this.getTeacherList()
				uni.stopPullDownRefresh()
			},
			async getUserInfo() {
				console.log(this.userInfo.openId)
				let that = this
				if (this.userInfo.openId) {
					uni.getUserInfo({
						provider: 'weixin',
						success: infoRes => {
							console.log(infoRes, '-----------------')
							//获取用户信息后向调用信息更新方法
							that.userInfo.nickName = infoRes.userInfo.nickName;
							//昵称
							that.userInfo.avatarUrl = infoRes.userInfo.avatarUrl;
							that.userInfo.gender = infoRes.userInfo.gender
							//更新用户信息
							that.$store.dispatch('saveUpdateUserInfo', {
								'userInfo': that.userInfo
							})
							try {
								console.log(that.userInfo)
							} catch (e) {
								console.log(e)
							}
						}
					})
				}
			}
		}
	};
</script>

<style>
	page {
		background-color: #eeeeee;
	}

	.filter_text {
		font-size:32rpx;
		font-family:PingFang SC;
		font-weight:400;
		line-height:28px;
		color:rgba(102,102,102,1);
		opacity:1;
	}

	.nav-title {
		width: 136rpx;
		height: 48rpx;
		font-size: 34rpx;
		font-family: PingFang SC;
		font-weight: 600;
		line-height: 48rpx;
		color: white;
		opacity: 0.9;
		position: absolute;
		top: 80rpx;
		left: 308rpx;
	}

	.index-container {
		width: 750rpx;
		overflow-x: hidden;
	}

	.head-bg {
		width: 750rpx;
		height: 262rpx;
	}

	.blank {
		width: 750rpx;
		height: 94rpx;
		margin-top: 0rpx;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin-bottom: 16rpx;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.header {
		width: 686rpx;
		height: 92rpx;
		position: absolute;
		top: 220rpx;
		box-shadow: 0px 2px 4px rgba(254, 189, 89, 0.15);
	}

	.line {
		width: 686rpx;
		height: 0rpx;
		border: 1px solid rgba(238, 238, 238, 1);
		opacity: 1;
		position: absolute;
		z-index: 1000;
		top: 460rpx;
	}

	.space {
		width: 750rpx;
		height: 0rpx;
		background: rgba(238, 238, 238, 1);
		opacity: 1;
	}

	.main-container {
		clear: both;
		width: 750rpx;
		height: 300rpx;
		background-color: white;
		margin-top: 0rpx;
		margin-bottom: 16rpx;
	}

	.avatar {
		width: 114rpx;
		height: 114rpx;
		border-radius: 50%;
		/*  background-color: #000000; */
		position: relative;
		top: 56rpx;
		left: 32rpx;
		overflow: hidden;
	}

	.avatar-img {
		width: 114rpx;
		height: 114rpx;
	}

	.name {
		font-size: 36rpx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 36rpx;
		color: rgba(51, 51, 51, 1);
		opacity: 1;
		position: relative;
		top: -72rpx;
		left: 176rpx;
	}
	
	.location {
		font-size:24rpx;
		font-family:PingFang SC;
		font-weight:400;
		line-height:33px;
		color:rgba(153,153,153,1);
		opacity:1;
		position: relative;
		top: -130rpx;
		left: 314rpx;
	}

	.introduce {
		width: 542rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 40rpx;
		color: rgba(102, 102, 102, 1);
		opacity: 1;
		position: relative;
		top: -109rpx;
		left: 176rpx;
	}

	.price {
		font-size: 36rpx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 50rpx;
		color: rgba(252, 103, 84, 1);
		opacity: 1;
		position: relative;
		top: -71rpx;
		left: 34rpx;
	}

	.rate {
		position: relative;
		top: -325rpx;
		left: 466rpx;
	}

	.rate-number {
		font-size: 36rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 50rpx;
		color: #feba52;
		opacity: 1;
		margin-left: 12rpx;
	}

	.tag {
		height: 50rpx;
		position: relative;
		top: -168rpx;
		left: 176rpx;
		display: inline-block;
		margin-right: 16rpx;
	}

	.bottom-block {
		width: 750rpx;
		height: 25rpx;
	}
</style>
