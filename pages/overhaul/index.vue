<template>
	<view class="application-home-root">
		<user-info style="padding: 16px" />
		<!-- 签到信息 -->
		<view class="sign-in">
			<view class="date-box">
				<view class="date-item" v-for="(item, index) in dateList" :key="index">
					<view class="week">{{ item.weekDay }}</view>
					<view class="h28" :class="['date', activeIndex === index ? 'current-time' : undefined]"
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
							<cover-view src="@/assets/imgs/overhaulhome-location-icon.png" alt="" />
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
				<!-- 				<view class="more" @click="showMoreMessage">
					<text>更多</text>
					<u-icon name="arrow-right"></u-icon>
				</view> -->
			</view>
			<u-search v-model="searchKey" class="search-wrapper" placeholder="请输入搜索内容" shape="square" bgColor="#eee"
				@search="onSearch"></u-search>
			<scroll-view :scroll-top="scrollTop" :show-scrollbar="true" scroll-y="true" class="message-list"
				:refresher-enabled="true" :refresher-threshold="80" :upper-threshold="50" :lower-threshold="30"
				:refresher-triggered="refreshing" @refresherrefresh="getMessageList('scrolltoupper')"
				@scrolltolower="getMessageList('scrolltolower')">
				<view class="message-item" v-for="(item, index) in messageList" :key="index">
					<view class="message-type">
						<text class="type">{{ messageTypeMap[item.noticeType] }}</text>
					</view>
					<view class="memo">
						<text class="memo-text ellipse">{{ item.noticeContent }}</text>
						<text>{{ item.createTime }}</text>
					</view>
				</view>
				<u-loadmore :status="status" :nomoreText="nomoreText" />
			</scroll-view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	const weekMap = {
		1: '一',
		2: '二',
		3: '三',
		4: '四',
		5: '五',
		6: '六',
		7: '日'
	}
	const messageTypeMap = {
		1: '任务通知',
		2: '超时通知'
	}

	import UserInfo from '@/components/common/user-info.vue';
	import {
		getSignInData,
		getMessageList
	} from '@/https/overhaul/clockIn';
	import {
		getUserInfo
	} from '@/utils/auth.js';
	import moment from 'moment';
	export default {
		components: {
			UserInfo
		},
		data() {
			return {
				messageTypeMap: Object.freeze(messageTypeMap),
				// 用户信息
				userInfo: {},
				messageList: [],
				// 当前日期对应下标
				activeIndex: 0,
				// 签到信息列表
				signList: new Array(7).fill({ time: '', label: '' }),
				scrollTop: 0,
				searchKey: '',
				status: 'nomore',
				pageNum: 1,
				pageSize: 20,
				hasNextPage: false,
				refreshing: false
			}
		},
		computed: {
			// 本周考勤数据
			dateList() {
				let arr = new Array(7).fill('');
				let thisSunday = moment().endOf('isoWeek');
				return arr.map((item, index) => {
					let date = moment(thisSunday).subtract(6 - index, 'days');
					if (moment().isSame(date, 'day')) {
						this.activeIndex = index;
					}
					return {
						weekDay: weekMap[date.isoWeekday()],
						date: date.format('MM/DD'),
						status: 0
					}
				})
			},
			nomoreText() {
				return this.messageList.length ? '没有更多了' : '暂无数据';
			}
		},
		onReady() {
			const userInfo = getUserInfo();
			this.getMessageList();
			// let params = {
			// 	userId: userInfo.username,
			// 	userName: userInfo.name
			// }
			// getSignInData(params)
			// .then(res => {
			// 	if (res.success) {
			// 		debugger;
			// 		let { start, end } = res.data;

			// 	}
			// })
		},
		methods: {
			// 签到
			handleSignIn(item, index) {
				if (index === this.activeIndex) {
					uni.navigateTo({
						url: '/pages/overhaul/map/index'
					});
				}
			},
			// 搜索
			onSearch() {
				this.pageNum = 1;
				this.messageList = [];
				this.getMessageList();
			},
			// 获取列表数据
			getMessageList(type) {
				if (type === 'scrolltoupper') {
					this.refreshing = true;
					this.pageNum = 1;
					this.messageList = [];
				} else if (type === 'scrolltolower') {
					if (!this.hasNextPage) return;
					this.pageNum++;
				}
				let {
					pageNum,
					pageSize,
					searchKey
				} = this;
				let params = {
					pageNum,
					pageSize,
					searchKey
				};
				this.status = 'loading';
				getMessageList(params)
					.then(res => {
						if (res.success && res.data) {
							let {
								pageList,
								hasNextPage
							} = res.data;
							this.messageList = [...this.messageList, ...pageList];
							this.hasNextPage = hasNextPage;
						}
					})
					.finally(() => {
						this.status = this.hasNextPage ? 'loadmore' : 'nomore';
						this.refreshing = false;
					})
			}
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
						height: 22px;
						margin-bottom: 10px;
					}

					.date {
						display: inline-block;
						height: 28px;
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
				height: 32px;
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
			height: calc(100% - 209px);
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
				height: calc(100% - 79px);
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
				/deep/ .uni-scroll-view-refresher {
					width: calc(100% - 32px);
				}
			}
		}
	}
</style>