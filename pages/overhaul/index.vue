<template>
	<view class="application-home-root">
		<user-info style="padding: 16px" :userInfo="userInfo" />
		<!-- 签到信息 -->
		<view class="sign-in">
			<view class="date-box">
				<view class="date-item" v-for="(item, index) in dateList" :key="index">
					<view class="week">{{ item.week }}</view>
					<view
						:class="['date', activeIndex === index ? 'current-time' : undefined]"
						@click="handleSignIn(item, index)"
					>
						{{ item.date }}
					</view>
					<text class="status-icon" v-if="activeIndex > index"></text>
				</view>
			</view>
	<!--      <view class="date-box">
			<view class="date-item" v-for="(item, index) in dateList" :key="index">
			  <view class="week">{{ item.week }}</view>
			  <view
				:class="[
				  'date',
				  activeIndex === index ? 'current-time' : undefined,
				]"
				@click="handleSignIn(item, index)"
			  >
				{{ item.date }}
			  </view>
			  <view class="status-icon" v-if="activeIndex > index"></view>
			</view>
		  </view>
		  <view class="sign-info" v-if="signList.length">
			<view class="sign-item" v-for="(sign, index) in signList" :key="index">
			  <template v-if="activeIndex === index">
				<view
				  v-for="signObj in sign"
				  :class="[
					'sign-time',
					activeIndex === index ? 'active-time' : undefined,
				  ]"
				  :key="signObj.time"
				>
				  <img src="@/assets/img/home-location-icon.png" alt="" />
				  <span class="sign-status">{{ signObj.label }}</span>
				  <span class="time" v-if="signObj.time">{{ signObj.time }}</span>
				</view>
			  </template>
			</view>
		  </view> -->
		</view>
	</view>
</template>

<script>
	import UserInfo from '../../components/user-info.vue';
	export default {
		components: {
			UserInfo
		},
		data() {
			return {
			  // 用户信息
				userInfo: {
					name: '张晓丽',
					department: '流程与信息化管理部',
					imgUrl: 'XXX',
				},
				messageList: [],
				// 签到信息列表
				dateList: [
					{
						week: "一",
						date: 30,
						status: 1,
					},
					{
						week: "二",
						date: 30,
						status: 1,
					},
					{
						week: "三",
						date: 30,
						status: 1,
					},
					{
						week: "四",
						date: 30,
						status: 1,
					},
					{
						week: "五",
						date: 30,
						status: 1,
					},
					{
						status: 1,
						week: "六",
						date: 30,
					},
					{
						status: 1,
						week: "日",
						date: 30,
					},
				],
				// 当前日期对应下标
				activeIndex: 2,
			}
		},
		onReady() {
		},
		methods: {

		}
	}
</script>

<style lang="less" scoped>
	.application-home-root {
		width: 100%;
		// height: 100%;
		// overflow: hidden;
		background: url("@/assets/imgs/overhaul/home-bg.png") no-repeat center;
		background-size: 100% 100%;
	  .sign-in {
		color: #fff;
		.date-box {
		  display: flex;
		  justify-content: space-between;
		  margin: 0 16px;
		  .date-item {
			flex: 1;
			text-align: center;
			.week {
			  margin-bottom: 10px;
			}
			.date {
			  display: inline-block;
			  line-height: 28px;
			  margin-bottom: 5px;
			}
			.current-time {
			  width: 52px;
			  height: 28px;
			  position: relative;
			  border-radius: 8px;
			  // background-color: #fff;
			  background: url("@/assets/imgs/overhaul/home-sign-bg.png") no-repeat center;
			  color: #3a62d7;
			  &:after {
				content: "";
				display: block;
				position: absolute;
				right: 1px;
				top: 1px;
				width: 21px;
				height: 12px;
				background: url("@/assets/imgs/overhaul/home-sign-text.png") no-repeat center;
			  }
			}
			.status-icon {
			  margin: auto;
			  width: 4px;
			  height: 4px;
			  border-radius: 50%;
			  background-color: #03ffa9;
			}
		  }
		}
		.sign-info {
		  display: flex;
		  margin-bottom: 10px;
		  .sign-item {
			flex: 1;
			text-align: center;
			.sign-time {
			  font-size: 12px;
			  .sign-status {
				margin: 0 2px;
				text-align: center;
			  }
			  img {
				vertical-align: -10px;
			  }
			}
			.active-time {
			  width: 100px;
			}
		  }
		}
	  }
	}
</style>