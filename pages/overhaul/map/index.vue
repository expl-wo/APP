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
					<u-cell title="所在项目" :isLink="true" :border="false" :value="projectName" arrow-direction="down"
						@click="initPicker(true)"></u-cell>
				</u-cell-group>
				<!-- 签到信息 -->
				<view class="info-box" v-if="signList.length">
					<view class="sign-item" v-for="item in signList" :key="item.time">
						<view class="icon">{{ item.label }}</view>
						<view class="info">
							<view class="address">{{ item.address }}</view>
							<view class="sign-time">{{ item.time }}</view>
						</view>
					</view>
				</view>
				<view>位置:{{ address }}</view>
			</view>
		</view>
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
	export default {
		components: {
			UserInfo
		},
		data() {
			return {
				id: 0, // 使用 marker点击事件 需要填写id
				title: 'map',
				latitude: '',
				longitude: '',
				markers: [],
				// tabs列表
				tabs: [{
						name: "公司",
						code: "12",
					},
					{
						name: "返程",
						code: "123",
					},
					{
						name: "请假",
						code: "1234",
					},
					{
						name: "去现场",
						code: "123456",
					},
					{
						name: "现场",
						code: "1234567",
					},
				],
				// 当前选中tab
				activeIndex: 0,
				title: '标题',
				list: [{
						name: '选项一',
						subname: "选项一描述",
						color: '#ffaa7f',
						fontSize: '20'
					},
					{
						name: '选项二禁用',
						disabled: true
					},
					{
						name: '开启load加载', //开启后文字不显示
						loading: true
					}
				],
				show: false,
				signList: [{
						time: '2023-11-21 12:00:00',
						label: '签入',
						address: '测试地址'
					},
					{
						time: '2023-11-21 13:00:00',
						label: '签出',
						address: '测试地址'
					},
				],
				projectName: 'xxx项目',
				address: ''
			}
		},
		onShow() {
			this.getLocation(true);
		},
		onLoad() {
			this.initPicker(false);
			uni.$on('handlePicker', res => {
				if (!res.show) {
					this.initPicker(false);
				}
			});

		},
		methods: {
			initPicker(showFlag) {
				uni.getSubNVueById('picker')[showFlag ? 'show' : 'hide']();
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
			// 签到
			signIn() {

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