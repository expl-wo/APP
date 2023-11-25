<template>
	<view class="application-home-root">
		<user-info style="padding: 16px" :userInfo="userInfo" />
		<!-- 签到信息 -->
		<view class="sign-in">
			<view class="date-box">
				<view class="date-item" v-for="(item, index) in dateList" :key="index">
					<view class="week">{{ item.week }}</view>
					<view :class="['date', activeIndex === index ? 'current-time' : undefined]"
						@click="handleSignIn(item, index)">
						{{ item.date }}
					</view>
					<text class="status-icon" v-if="activeIndex > index"></text>
				</view>
			</view>
			<view class="sign-info" v-if="signList.length">
				<view class="sign-item" v-for="(sign, index) in signList" :key="index">
					<template v-if="activeIndex === index">
						<view v-for="signObj in sign"
							:class="['sign-time', 'flex-center', activeIndex === index ? 'active-time' : undefined]"
							:key="signObj.time">
							<!-- 							<cover-view src="@/assets/imgs/overhaulhome-location-icon.png" alt="" /> -->
							<text class="sign-status">{{ signObj.label }}</text>
							<text class="time" v-if="signObj.time">{{ signObj.time }}</text>
						</view>
					</template>
				</view>
			</view>
		</view>
		<!-- 消息通知展示 -->
		<view class="message-content">
			<view class="message-head">
				<view class="head-title">消息通知</view>
				<view class="more" @click="showMoreMessage">
					<text>更多</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
			<u-search v-model="searchKey" class="search-wrapper" placeholder="请输入搜索内容" shape="square" bgColor="#eee"
				@search="getMessageList"></u-search>
			<scroll-view :scroll-top="scrollTop" :show-scrollbar="true" scroll-y="true" class="message-list"
				@scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll">
				<view class="message-item" v-for="(item, index) in messageList" :key="index">
					<view class="message-type">
						<text class="type">{{ item.messageType }}</text>
					</view>
					<view class="memo">
						<text class="memo-text ellipse">{{ item.memo }}</text>
						<text>{{ item.time }}</text>
					</view>
				</view>
				<u-loadmore :status="status" />
			</scroll-view>
		</view>
		<u-toast ref="uToast"></u-toast>
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
				messageList: [{
						messageType: '测试',
						memo: '测试备注',
						time: '2023-11-20 12:00:00'
					},
					{
						messageType: '测试',
						memo: '测试备注',
						time: '2023-11-20 12:00:00'
					},
					{
						messageType: '测试',
						memo: '测试备注',
						time: '2023-11-20 12:00:00'
					},
					{
						messageType: '测试',
						memo: '测试备注',
						time: '2023-11-20 12:00:00'
					},
					{
						messageType: '测试',
						memo: '测试备注',
						time: '2023-11-20 12:00:00'
					},
					{
						messageType: '测试',
						memo: '测试备注',
						time: '2023-11-20 12:00:00'
					},
					{
						messageType: '测试',
						memo: '测试备注',
						time: '2023-11-20 12:00:00'
					},
					{
						messageType: '测试',
						memo: '测试备注',
						time: '2023-11-20 12:00:00'
					},
					{
						messageType: '测试',
						memo: '测试备注',
						time: '2023-11-20 12:00:00'
					},
					{
						messageType: '测试',
						memo: '测试备注',
						time: '2023-11-20 12:00:00'
					},
					{
						messageType: '测试',
						memo: '测试备注',
						time: '2023-11-20 12:00:00'
					},
					{
						messageType: '测试',
						memo: '测试备注',
						time: '2023-11-20 12:00:00'
					},
					{
						messageType: '测试',
						memo: '测试备注',
						time: '2023-11-20 12:00:00'
					},
					{
						messageType: '测试',
						memo: '测试备注',
						time: '2023-11-20 12:00:00'
					}
				],
				// 签到信息列表
				dateList: [{
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
				// 签到信息列表
				signList: [{
						signIn: {
							time: "08:30",
							label: "签入"
						},
						signOut: {
							label: "签出",
							time: "18:30"
						},
					},
					{
						signIn: {
							time: "08:30",
							label: "签入"
						},
						signOut: {
							label: "签出",
							time: "18:30"
						},
					},
					{
						signIn: {
							time: "08:30",
							label: "签入"
						},
						signOut: {
							label: "签出",
							time: "18:30"
						},
					},
					{
						signIn: {
							time: "08:30",
							label: "签入"
						},
						signOut: {
							label: "签出",
							time: "18:30"
						},
					},
					{
						signIn: {
							time: "08:30",
							label: "签入"
						},
						signOut: {
							label: "签出",
							time: "18:30"
						},
					},
					{
						signIn: {
							time: "08:30",
							label: "签入"
						},
						signOut: {
							label: "签出",
							time: "18:30"
						},
					},
					{
						signIn: {
							time: "08:30",
							label: "签入"
						},
						signOut: {
							label: "签出",
							time: "18:30"
						},
					},
				],
				scrollTop: 0,
				searchKey: '',
				status: 'loadmore',
			}
		},
		onReady() {},
		methods: {
			/**
			 * @method handleSignIn 处理签到事件
			 **/
			handleSignIn() {
				uni.navigateTo({
					url: '/pages/overhaul/map/index'
				});
			},
			showMoreMessage() {},
			getMessageList() {},
			upper() {
				this.status = 'loading';
				setTimeout(() => {
					this.status = 'loadmore';
				}, 2000)
			},
			lower() {
				debugger
				setTimeout(() => {
					this.status = 'nomore';
				}, 2000)
			},
			scroll() {},

		}
	}
</script>

<style lang="scss" scoped>
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

				.flex-center {
					// flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
				}

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

		.message-content {
			margin: 0 16px;
			width: calc(100% - 32px);
			border-radius: 8px;
			background-color: #fff;
			color: #657685;

			.message-head {
				display: flex;
				height: 47px;
				line-height: 47px;
				margin: 0 16px;

				.head-title {
					font-size: 18px;
					color: #445160;
				}

				.more {
					display: flex;
					margin-left: auto;
				}
			}

			.search-wrapper {
				padding: 0 16px;
			}

			.message-list {
				margin: 0 16px;
				max-height: 400px;
				overflow-y: auto;

				.message-item {
					width: calc(100% - 32px);
					height: 66px;

					&:not(:last-child) {
						border-bottom: 1px solid #cecece;
					}

					.message-type {
						margin: 10px 0 12px;

						.type {
							max-width: 90%;
							display: inline-block;
							position: relative;
							margin-right: 30px;
							font-size: 16px;
							color: #445160;

							&:after {
								content: "";
								display: inline-block;
								position: absolute;
								right: -12px;
								top: 0;
								width: 8px;
								height: 8px;
								background-color: #f34b45;
								border-radius: 50%;
							}
						}
					}

					.memo {
						display: flex;
						justify-content: space-between;
						font-size: 14px;

						.memo-text {
							width: 180px;
						}
					}
				}
			}
		}
	}
</style>