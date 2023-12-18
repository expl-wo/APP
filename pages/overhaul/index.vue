<template>
	<view class="application-home-root">
		<user-info style="padding: 16px" />
		<!-- 签到信息 -->
		<view class="sign-in">
			<view class="date-box">
				<view class="date-item" v-for="(item, index) in dateList" :key="index">
					<view class="week">{{ item.weekDay }}</view>
					<view class="h28"
						:class="['date', activeIndex === index ? activeIndex === activeIndex_c ? 'current-time' : 'current-time1' : undefined]"
						@click="handleSignIn(item, index)">
						{{ item.date }}
					</view>
					<text class="status-icon" v-if="activeIndex >= index"></text>
				</view>
			</view>
			<view class="sign-info" v-if="signList.length">
				<view class="sign-item" v-for="(sign, index) in signList" :key="index">
					<template v-if="activeIndex === index">
						<view v-for="signObj in sign"
							:class="['sign-time', 'flex-center', activeIndex === index ? 'active-time' : undefined]"
							:key="signObj.time">
							<cover-view src="@/assets/imgs/overhaulhome-location-icon.png" alt="" />
							<text class="sign-status">{{ signObj.label }}:</text>
							<text class="time">{{ signObj.time || '--' }}</text>
						</view>
					</template>
					<view class="non-active" v-if="activeIndex_c >= index && activeIndex !== index">
						<view class="dot" :class="[sign[0].time && sign[1].time ? 'bg-normal' : 'bg-abnormal']"></view>
					</view>
				</view>
			</view>
		</view>
		<!-- 消息通知展示 -->
		<view class="message-content">
			<view class="message-head">
				<view class="head-title">消息通知</view>
			</view>
			<u-search v-model="searchKey" class="search-wrapper" placeholder="请输入搜索内容" shape="square" bgColor="#eee"
				@search="onSearch" @custom="onSearch" />
			<scroll-view :scroll-top="scrollTop" :show-scrollbar="true" scroll-y="true" class="message-list"
				:refresher-enabled="true" :refresher-threshold="80" :upper-threshold="50" :lower-threshold="30"
				:refresher-triggered="refreshing" @refresherrefresh="getMessageList('scrolltoupper')"
				@scrolltolower="getMessageList('scrolltolower')">
				<view class="message-item" v-for="(item, index) in messageList" :key="index" @click="showDetail(item)">
					<!-- 					<u-swipe-action :autoClose="true">
						<u-swipe-action-item :options="getOptions(item.noticeStatus)" :autoClose="true"
							@click="changeStatus(item)">
							<view class="message-type">
								<text class="type"
									:class="[item.noticeStatus ? '' : 'unread']">{{ messageTypeMap[item.noticeType] }}</text>
							</view>
							<view class="memo">
								<view class="memo-text ellipsis">{{ item.noticeContent }}</view>
								<view class="time">{{ item.createTime }}</view>
							</view>
						</u-swipe-action-item>
					</u-swipe-action> -->
					<view class="message-type">
						<text class="type"
							:class="[item.noticeStatus ? '' : 'unread']">{{ messageTypeMap[item.noticeType] }}</text>
					</view>
					<view class="memo">
						<view class="memo-text ellipsis">{{ item.noticeContent }}</view>
						<view class="time">{{ item.createTime }}</view>
					</view>
				</view>
				<u-loadmore v-if="showLoading" :status="status" :nomoreText="nomoreText" />
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
		getMessageList,
		setStatus
	} from '@/https/overhaul/clockIn';
	import {
		getUserInfo
	} from '@/utils/auth.js';
	import { MESSAGE_TYPE } from '@/utils/constants-custom';
	import moment from 'moment';
	export default {
		components: {
			UserInfo
		},
		data() {
			return {
				messageTypeMap: Object.freeze(MESSAGE_TYPE),
				// 用户信息
				userInfo: {},
				messageList: [],
				// 当前日期对应下标
				activeIndex: 0,
				activeIndex_c: 0,
				// 签到信息列表
				signList: new Array(7).fill([{time: '', label: '签入'}, {time: '', label: '签出'}]),
				scrollTop: 0,
				searchKey: '',
				status: 'nomore',
				pageNum: 1,
				pageSize: 20,
				hasNextPage: false,
				refreshing: false,
				showLoading: false,
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
						this.activeIndex_c = index;
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
			},
			// getOptions() {
			// 	return function(isRead) {
			// 		return isRead ? [{
			// 			'text': '标为未读',
			// 			style: {
			// 				backgroundColor: '#3c9cff'
			// 			}
			// 		}] : [{
			// 			'text': '标为已读',
			// 			style: {
			// 				backgroundColor: '#f9ae3d'
			// 			}
			// 		}]
			// 	}
			// }
		},
		onShow() {
			const userInfo = getUserInfo();
			this.onSearch();
			let thisSunday = moment().endOf('isoWeek');
			let params = {
				userId: userInfo.username,
				userName: userInfo.name,
				startTime: moment(thisSunday).subtract(6, 'days').format('YYYY-MM-DD 00:00:00'),
				endTime: moment(thisSunday).format('YYYY-MM-DD 23:59:59'),
			}
			getSignInData(params)
				.then(res => {
					if (res.success && res.data) {
						let signInData = (res.data.value || []).sort((a, b) => new Date(a.clockInDate) - new Date(b
							.clockInDate));
						signInData.forEach((item, index) => {
							this.$set(this.signList, index, [{
									label: '签入',
									time: item.inTime && moment(item.inTime).format('HH:mm')
								},
								{
									label: '签出',
									time: item.outTime && moment(item.outTime).format('HH:mm')
								}
							])
						})
					}
				})
		},
		methods: {
			// 签到
			handleSignIn(item, index) {
				if (index > this.activeIndex_c) return;
				this.activeIndex = index;
				if (this.activeIndex === this.activeIndex_c) {
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
					this.showLoading = false;
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
						this.showLoading = true;
					})
			},
			// changeStatus(item) {
			// 	let params = {
			// 		idList: [item.id],
			// 		noticeStatus: +(!item.noticeStatus)
			// 	}
			// 	setStatus(params)
			// 		.then(res => {
			// 			if (res.success) {
			// 				uni.showToast({
			// 					icon: 'success',
			// 					title: res.errMsg || '操作成功',
			// 					duration: 2000
			// 				})

			// 				this.onSearch();
			// 			} else {
			// 				uni.showToast({
			// 					icon: 'error',
			// 					title: res.errMsg || '操作失败',
			// 					duration: 2000
			// 				})
			// 			}
			// 		})
			// },
			showDetail(item) {
				uni.setStorageSync('ims_notice', item);
				uni.navigateTo({
					url: `/pages/overhaul/noticeDetail`
				});
				// 	this.changeStatus(item);
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

					.current-time1 {
						width: 52px;
						height: 28px;
						position: relative;
						border-radius: 8px;
						// background-color: #fff;
						background: url("@/assets/imgs/overhaul/home-sign-bg.png") no-repeat center;
						color: #3a62d7;
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
				margin: 0 16px;
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
						// 	width: 100px;
					}

					.non-active {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 100%;
						height: 100%;

						.dot {
							height: 4px;
							width: 4px;
							border-radius: 50%;
						}

						.bg-normal {
							background-color: #13bd21;
						}

						.bg-abnormal {
							background-color: #ac3430;
						}
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
				width: calc(100% - 32px);
				overflow-y: auto;

				.message-item {
					padding: 4px 0;
					height: 74px;

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

						}

						.unread:after {
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

					.memo {
						display: flex;
						font-size: 14px;

						.memo-text {
							flex: 1;
						}

						.time {
							margin-left: auto;
						}
					}
				}

				.ellipsis {
					text-overflow: ellipsis;
					/* 溢出显示省略号 */
					overflow: hidden;
					/* 溢出隐藏 */
					white-space: nowrap;
					/* 强制不换行 */
				}
			}
		}
	}
</style>