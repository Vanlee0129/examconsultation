<template>
  <view class="index-container">
    <u-empty text="没有任何订单哦" mode="order" v-if="flag" class="empty"></u-empty>
    <view class="order-container" v-for="(item, index) in orderInfo" :key="index" v-else>
      <view class="order">
        <view class="master-name">{{item.teacherInfo[0].name}}</view>
        <view class="master-phone">电话 {{item.teacherInfo[0].phone}}</view>
        <view class="master-wx">微信 {{item.teacherInfo[0].wechat}}</view>
        <view class="status">已支付</view>
        <view class="price">{{item.amount}}元</view>
        <view class="footer">
          <view class="date">{{item.date}}</view>
          <view class="orderNo">No.{{item.orderNo}}</view>
        </view>
      </view>
    </view>
    <view class="block"></view>
  </view>
</template>

<script>
import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex'
import api from '@/common/api.js'
import order from "../../common/order.js";
export default {
  data() {
    return {
      flag: false,
      orderInfo: []
    };
  },
  computed: {
  	...mapState(['userInfo'])
  },
  async onLoad() {
	await this.getOrderList()
  },
  methods: {
	  async getOrderList() {
		api.getOrderList({
			studentId: this.userInfo.openId
		}).then(res => {
			let [, info] = res
			let {
				data
			} = info
			console.log(data.data.length)
			this.orderInfo = data.data
			if (data.data.length == 0) {
			  this.flag = true;
			} else {
			  this.flag = false;
			}
		})  
	  }
  }
};
</script>

<style>
page {
  background-color: #eeeeee;
}
.index-container {
  width: 750rpx;
  overflow-x: hidden;
}
.empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.order-container {
  margin-top: 74rpx;
  margin-left: 32rpx;
  width: 686rpx;
  height: 344rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  border-radius: 10px 10px 10px 10px;
  margin-bottom: 50rpx;
}
.master-name {
  font-size: 36rpx;
  font-family: PingFang SC;
  font-weight: 600;
  line-height: 50rpx;
  color: rgba(51, 51, 51, 1);
  opacity: 1;
  position: relative;
  top: 44rpx;
  left: 64rpx;
}
.master-phone {
  font-size: 32rpx;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 44rpx;
  color: rgba(51, 51, 51, 1);
  opacity: 1;
  position: relative;
  top: 72rpx;
  left: 64rpx;
}
.master-wx {
  font-size: 32rpx;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 44rpx;
  color: rgba(51, 51, 51, 1);
  opacity: 1;
  position: relative;
  top: 82rpx;
  left: 64rpx;
}
.status {
  font-size: 28rpx;
  font-family: PingFang SC;
  font-weight: 600;
  line-height: 40rpx;
  color: rgba(153, 153, 153, 1);
  opacity: 1;
  position: relative;
  text-align: right;
  top: -10rpx;
  right: 64rpx;
}
.price {
  font-size: 32rpx;
  font-family: PingFang SC;
  font-weight: 600;
  line-height: 44rpx;
  color: rgba(253, 160, 148, 1);
  opacity: 1;
  text-align: right;
  position: relative;
  top: 0rpx;
  right: 64rpx;
}
.footer {
  width: 686rpx;
  height: 88rpx;
  background: #feba52;
  opacity: 1;
  border-radius: 0px 0px 10px 10px;
  position: relative;
  top: 40rpx;
}
.date {
  font-size: 24rpx;
  font-family: PingFang SC;
  font-weight: 600;
  line-height: 34rpx;
  color: rgba(255, 255, 255, 1);
  opacity: 1;
  position: relative;
  top: 30rpx;
  left: 64rpx;
}
.orderNo {
  font-size: 24rpx;
  font-family: PingFang SC;
  font-weight: 600;
  line-height: 34rpx;
  color: rgba(255, 255, 255, 1);
  opacity: 1;
  text-align: right;
  position: relative;
  top: -4rpx;
  right: 64rpx;
}
.block {
  width: 750rpx;
  height: 50rpx;
}
</style>
