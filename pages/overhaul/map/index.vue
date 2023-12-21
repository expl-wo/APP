<template>
	<view class="map-root">
		<view class="attendence-info">
			<view class="sign-info">
				<!-- 用户信息 -->
				<user-info :isShowHello="false" fontColor="#445160" />
				<!-- 当前状态 -->
				<view class="status-wrapper">
					<view class="desc">当前状态:</view>
					<view class="status">
						<u-subsection activeColor="#3c9cff" :list="tabs" :current="activeIndex"
							@change="tabChange"></u-subsection>
					</view>
				</view>
				<u-cell-group>
					<u-cell title="所在项目" :isLink="true" :border="false" :value="placeholder" arrow-direction="down"
						@click="initPicker(true)"></u-cell>
				</u-cell-group>
				<!-- 签到信息 -->
				<view class="info-box" v-if="signList.length">
					<view class="sign-item" v-for="item in signList" :key="item.time">
						<view class="icon">{{ item.label }}</view>
						<view class="info">
							<view class="address">{{ item.address || '--' }}</view>
							<view class="sign-time">{{ item.time || '--' }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view>{{JSON.stringify(error)}}</view>
		<map id="map" class="map-container" :latitude="latitude" :longitude="longitude" :markers="markers">
			<cover-view class="btn-wrapper">
				<cover-view class="btn" @click="signIn">
					打卡
				</cover-view>
			</cover-view>
		</map>
	</view>
</template>

<script>
	import UserInfo from '@/components/common/user-info.vue';
	import { getProjectList, getSignInData, signIn } from '@/https/overhaul/clockIn';
	import { getUserInfo  } from '@/utils/auth.js';
	import moment from 'moment';
	export default {
		components: {
			UserInfo
		},
		data() {
			return {
				userInfo: null,
				latitude: '',
				longitude: '',
				markers: [],
				// tabs列表
				tabs: Object.freeze([{
						name: "在公司",
						value: 1
					},
					{
						name: "休假中",
						value: 2
					},
					{
						name: "去现场",
						value: 3
					},
					{
						name: "现场",
						value: 4
					},
					{
						name: "返程中",
						code: 5
					}
				]),
				// 当前选中tab
				activeIndex: 0,
				show: false,
				signList: [{
						label: '签入',
						time: null,
						address: null
					},
					{
						label: '签出',
						time: null,
						address: null
					},
				],
				selectProject: null,
				address: '',
				projectList: [],
				error: null
			}
		},
		computed: {
			placeholder() {
				return this.selectProject ? this.selectProject.name : '请选择';
			}
		},
		onShow() {
			this.getLocation(true);
			this.userInfo = getUserInfo();
			let params = {
				userId: this.userInfo.username,
				userName: this.userInfo.name
			}
			// 获取项目列表
			getProjectList(params)
			.then(res => {
				if (res.success && res.data) {
					this.projectList = res.data.value || [];
				}
			})
			this.getSignInfo();
		},
		onLoad() {
			this.initPicker(false);
			uni.$on('handlePicker', res => {
				if (!res.show) {
					this.initPicker(false);
					this.selectProject = res.selectItem;
				}
			});

		},
		onUnload() {
			uni.$off('handlePicker');
		},
		methods: {
			initPicker(showFlag) {
				uni.getSubNVueById('picker')[showFlag ? 'show' : 'hide']();
				if (showFlag) {
					uni.$emit('sendList', {data: this.projectList});
				}
			},
			// 获取当前位置信息
			getLocation(flag) {
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: res => {
						console.log("位置信息", res);
						let {
							longitude,
							latitude,
							address
						} = res;
						this.latitude = latitude;
						this.longitude = longitude;
						this.markers = [{
							id: 0,
							latitude: this.latitude,
							longitude: this.longitude,
							iconPath: '/static/img/map-location.png',
							label: {
								content: '当前位置',
								color: '#ff0000',
								bgColor: '#ffffff',
								borderRadius: 3, //边框圆角
								borderWidth: 1, //边框宽度
								borderColor: '#FF0202', //边框颜色
								padding: 5, //文本边缘留白
								textAlign: 'center' //文本对齐方式。有效值: left, right, center
							}
						}]
						if (address) {
							let {
								province,
								city,
								district,
								street,
								streetNum,
								poiName
							} = address;
							this.address = `${province}${city}${district}${street}${streetNum}${poiName}`;
							console.log(this.address);
						}
						flag && this.moveToCenter();
					},
					fail: err => {
						this.error = err;
						console.log("获取定位失败", err);
						uni.showToast({
							title: '获取定位失败',
							icon: 'none'
						});
					}
				})
			},
			// 设置地图中心点
			moveToCenter() {
				uni.createMapContext('map', this).moveToLocation({
					latitude: this.latitude,
					longitude: this.longitude
				});
			},
			// 获取当日签到信息
			getSignInfo() {
				let params = {
					userId: this.userInfo.username,
					userName: this.userInfo.name,
					startTime: moment().format('YYYY-MM-DD 00:00:00'),
					endTime: moment().format('YYYY-MM-DD 23:59:59'),
				}
				// 获取当日签到信息
				getSignInData(params)
				.then(res => {
					if (res.success && res.data) {
						let revData = res.data.value[0];
						let { inTime, inAddress, outTime, outAddress } = revData;
						this.$set(this.signList, 0, { time: inTime, address: inAddress, label: '签入' });
						this.$set(this.signList, 1, { time: outTime, address: outAddress, label: '签出' });
					}
				})
			},
			// 签到
			signIn() {
				if (!this.selectProject) {
					uni.showToast({
						icon: 'error',
						title: '请先选择项目'
					})
					return;
				}
				let params = {
					userId: this.userInfo.username,
					userName: this.userInfo.name,
					clockInType: this.activeIndex + 1,
					clockInLocation: `${this.longitude},${this.latitude}`,
					clockInAddress: this.address,
					clockInProjNo: this.selectProject.id,
					clockInProjName: this.selectProject.name,
					// 接口测试数据
					// clockInProjNo: 3002,
					// clockInProjName: '测试多条数据',
					// clockInLocation: '112.650253,26.840432',
					// clockInAddress: '湖南省衡阳市雁峰区白沙大道73号明星小区',
				}
				signIn(params)
				.then(res => {
					if (res.success) {
						uni.showToast({
							title: '打卡成功'
						})
						this.getSignInfo();
					}
				})
			},
			tabChange(index) {
				this.activeIndex = index;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.map-root {
		height: 100%;
		width: 100%;
		position: relative;
		color: #445160;
		font-size: 12px;

		.attendence-info {
			height: 240px;
			width: 100%;

			.status-wrapper {
				display: flex;
				align-items: center;
				justify-content: center;

				.desc {
					width: 100px;
					font-size: 16px;
				}

				.status {
					flex: 1;

					/deep/ .u-subsection--button {
						height: 40px;
					}
				}
			}

			/deep/ .u-cell-group__wrapper {
				.u-line {
					border-bottom: none !important;
				}

				.u-cell__body {
					padding: 6px 0;
				}
			}



			.sign-info {
				width: 100%;
				padding: 16px;
				box-sizing: border-box;
				margin: auto;
				background-color: #fff;
				box-shadow: 0px 0px 7px 0px rgba(12, 122, 255, 0.05);
				border-radius: 0px 8px 8px 8px;
				text-align: left;

				.info-box {
					display: flex;
					margin-top: 10rpx;

					.sign-item {
						flex: 1;
						display: flex;

						.icon {
							width: 36px;
							height: 36px;
							line-height: 36px;
							margin-right: 8px;
							background-color: rgba(27, 90, 231, 0.1);
							border-radius: 4px;
							text-align: center;
							color: #3a62d7;
						}

						.address {
							color: #657685;
							font-size: 14px;
						}

						.sign-time {
							font-size: 12px;
						}
					}
				}
			}
		}

		.map-container {
			position: relative;
			width: 100%;
			height: calc(100% - 220px);
		}

		.btn-wrapper {
			position: absolute;
			bottom: 0;
			left: 0;
			height: 100px;
			width: 100%;
			background-color: #fff;

			.btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 60px;
				color: #fff;
				border-radius: 4px;
				text-align: center;
				font-size: 18px;
				font-weight: 700;
				background-color: #375cd7;
				padding: 10px 20px 0 20px;
				box-sizing: border-box;
			}
		}

	}
</style>