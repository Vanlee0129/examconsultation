<template>
  <view class="content">
		<view class="head-bg">
		  <image src="../../static/images/navMy.jpg" mode="scaleToFill" class="head-bg" />
		</view>
		<view class="loginButton" v-if="isLogin">
			<button type="default" @click="login">登录</button>
		</view>
		<view class="infoPan" v-else>
		<view class="avatar">
		  <image :src="userInfo.avatarUrl" class="avatar-img" />
		</view>
		<view class="name">{{userInfo.nickName}}</view>
		<view class="sex" :style="{left: sexFlag}">{{sex}}</view>
		<view class="location">{{userInfo.location}}</view>
		<view class="phone">
			{{userInfo.phone}}
		</view>
		<view class="status">
			{{userInfo.status}}
		</view>
	</view>
	<view class="menu" v-show="!isLogin">
    <view class="order">
      <view class="order-icon">
        <image src="../../static/images/order-icon.jpg" mode class="icon" />
      </view>
      <view class="title" @click="myOrder">我的订单</view>
      <view class="arrow-icon">
        <image src="../../static/images/order-arrow.jpg" mode class="arrow" />
      </view>
    </view>
	<view class="service">
	  <view class="order-icon">
	    <image src="../../static/images/order-icon.jpg" mode class="icon" />
	  </view>
	  <view class="title" @click="toService">服务协议</view>
	  <view class="arrow-icon">
	    <image src="../../static/images/order-arrow.jpg" mode class="arrow" />
	  </view>
	</view>
	<view class="privacy">
	  <view class="order-icon">
	    <image src="../../static/images/order-icon.jpg" mode class="icon" />
	  </view>
	  <view class="title" @click="toPrivacy">隐私政策</view>
	  <view class="arrow-icon">
	    <image src="../../static/images/order-arrow.jpg" mode class="arrow" />
	  </view>
	</view>
		</view>
  </view>
</template>

<script>
import {mapState,mapMutations,mapActions} from 'vuex'
import api from '@/common/api.js'
export default {
  data() {
    return {
      name: "",
      sex: "",
      location: "",
	  phone: '',
	  status: '',
	  sexFar: '',
	  statusFar: '',
	  isLogin: ''
    };
  },
  computed: {
  	...mapState(['userInfo']),
	statusFlag() {
		return uni.upx2px(this.statusFar) + 'px';
	},
	sexFlag() {
		return uni.upx2px(this.sexFar) + 'px';
	}
  },
  onShow() {
	this.islogin()
	let x = this.userInfo.nickName.length
	let y = this.userInfo.location.length
	this.sexFar = 392 + 28*(y-4)
	this.statusFar = 384 + 36*(x-3)
  	if(this.userInfo.gender == 1) {
		this.sex = '男'
	}else {
		this.sex = '女'
	}
  },
  methods: {
	islogin() {
		if(!this.userInfo.openId) {
			this.isLogin = true
		}else {
			this.isLogin = false
		}
	},
	login() {
		uni.navigateTo({
			url: '../start/start'
		})
	},
    myOrder() {
      uni.navigateTo({
        url: "../order/order"
      });
    },
	toService() {
		uni.navigateTo({
			url: '../serviceRules/serviceRules'
		})
	},
	toPrivacy() {
		uni.navigateTo({
			url: '../privacyPolicy/privacyPolicy'
		})
	}
  }
};
</script>

<style>
page {
  background-color: #f3f7fa;
}
.head-bg {
  width: 750rpx;
  height: 262rpx;
}
/* .content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
} */
.avatar {
  width: 148rpx;
  height: 148rpx;
  border-radius: 50%;
  position: relative;
  top: -234rpx;
  left: 32rpx;
  overflow: hidden;
}
.avatar-img {
  width: 148rpx;
  height: 148rpx;
}
.name {
  font-size: 36rpx;
  font-family: PingFang HK;
  font-weight: 600;
  line-height: 50rpx;
  color: rgba(255, 255, 255, 1);
  opacity: 1;
  position: absolute;
  top: 16rpx;
  left: 244rpx;
}
.sex {
  font-size: 28rpx;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 40rpx;
  color: rgba(255, 255, 255, 1);
  opacity: 1;
  position: absolute;
  top: 138rpx;
  left: 392rpx;
}
.location {
  font-size: 28rpx;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 40rpx;
  color: rgba(255, 255, 255, 1);
  opacity: 1;
  position: absolute;
  top: 138rpx;
  left: 244rpx;
}
.phone {
	font-size:27rpx;
	font-family:PingFang SC;
	font-weight:400;
	line-height:38rpx;
	color:rgba(255,255,255,1);
	opacity:1;
	position: absolute;
	top: 82rpx;
	left: 244rpx;
}
.status {
	width:80rpx;
	height:48rpx;
	background:rgba(247,165,40,1);
	opacity:1;
	position: absolute;
	top: 195rpx;
	left: 61rpx;
	border-radius:5rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size:28rpx;
	font-family:PingFang SC;
	font-weight:400;
	line-height:40rpx;
	color:rgba(255,255,255,1);
	opacity:1;
}
.order {
  width: 750rpx;
  height: 122rpx;
  background: rgba(255, 255, 255, 1);
  opacity: 1;
  position: absolute;
  top: 302rpx;
}

.service {
	width: 750rpx;
	height: 122rpx;
	background: rgba(255, 255, 255, 1);
	opacity: 1;
	position: absolute;
	top: 500rpx;
}
.privacy {
	width: 750rpx;
	height: 122rpx;
	background: rgba(255, 255, 255, 1);
	opacity: 1;
	position: absolute;
	top: 624rpx;
}
.title {
  font-size: 28rpx;
  font-family: PingFang SC;
  font-weight: 500;
  line-height: 40rpx;
  color: rgba(51, 51, 51, 1);
  opacity: 1;
  margin-top: 12rpx;
  margin-left: 114rpx;
}
.order-icon {
  width: 26rpx;
  height: 30rpx;
}
.icon {
  width: 26rpx;
  height: 30rpx;
  margin-top: 46rpx;
  margin-left: 32rpx;
}
.arrow-icon {
  width: 16rpx;
  height: 32rpx;
}
.arrow {
  width: 12rpx;
  height: 24rpx;
  position: relative;
  top: -38rpx;
  left: 704rpx;
}
.loginButton {
	position: absolute;
	width: 300rpx;
	height: 100rpx;
	top: 80rpx;
	left: 50%;
	transform: translateX(-50%);
}
</style>
