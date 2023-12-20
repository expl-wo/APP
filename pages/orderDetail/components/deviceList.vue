<!-- 设备清单 -->
<template>
	<view class="full-content">
		<scroll-view :scroll-top="scrollTop" :show-scrollbar="true" scroll-y="true" class="list-wrapper"
			:style="{'height': activeTab === 2 ? 'calc(100% - 50px)' : '100%'}"
			:refresher-enabled="true" :refresher-threshold="80" :upper-threshold="50" :lower-threshold="30"
			:refresher-triggered="refreshing" @refresherrefresh="getData('scrolltoupper')"
			@scrolltolower="getData('scrolltolower')">
			<template v-if="activeTab === 2">
				<return-item v-for="item in listData" :key="item.bomId" :dataInfo="item" @checkBom="checkBom" />
			</template>
			<template v-if="activeTab === 3">
				<device-item v-for="(item, index) in listData" :dataInfo="item" :key="item.equipmentNumber" />
			</template>
			<template v-if="activeTab === 4">
				<material-item v-for="item in listData" :key="item.materialId" :dataInfo="item" @editNum="editNum" />
			</template>
			<template v-if="activeTab === 5">
				<tool-item v-for="item in listData" :key="item.bomId" :dataInfo="item" @editNum="editNum" />
			</template>
			<u-loadmore v-if="showLoading" :status="status" :nomoreText="nomoreText" />
		</scroll-view>
		<edit-num-modal :show="showModal" :num="num" @closeModal="closeModal" @modalConfirm="modalConfirm" />
		<view v-if="activeTab === 2 && listData.length" class="btn-wrapper">
			<u-button class="btn" type="primary" text="扫码复核" color="#243d8f" :loading="btnLoading" loadingText="操作中"
				@click="checkBom" />
		</view>
	</view>
</template>

<script>
	
	const apiMap = {
		2: 'getReturnList',
		3: 'getDeviceList',
		4: 'getMaterialList',
		5: 'getToolList'
	}
	
	import {
		getReturnList,
		getDeviceList,
		getMaterialList,
		getToolList,
		toolNumChange,
		materialNumChange,
		checkBom
	} from '@/https/overhaul/bom';
	
	import DeviceItem from './deviceItem.vue';
	import ReturnItem from './returnItem.vue';
	import MaterialItem from './materialItem.vue';
	import ToolItem from './toolItem.vue';
	import EditNumModal from './editNumModal.vue'
	import {
		mapState
	} from "vuex";
	export default {
		name: 'deviceList',
		components: {
			DeviceItem,
			ReturnItem,
			MaterialItem,
			ToolItem,
			EditNumModal
		},
		data() {
			return {
				scrollTop: 0,
				listData: [],
				refreshing: false,
				showLoading: false,
				pageNum: 1,
				pageSize: 20,
				status: 'nomore',
				hasNextPage: false,
				showModal: false,
				// 编辑前的数量
				num: null,
				// 类型
				type: '',
				info: null,
				btnLoading: false
			}
		},
		computed: {
			nomoreText() {
				return this.listData.length ? '没有更多了' : '暂无数据';
			},
			...mapState("workOrder", ["activeTab"]),
		},
		watch: {
			activeTab(newVal, oldVal) {
				this.reGetData();
			}
		},
		mounted() {
			this.reGetData();
		},
		methods: {
			getReturnList,
			getDeviceList,
			getMaterialList,
			getToolList,
			toolNumChange,
			materialNumChange,
			// 获取数据
			getData(type) {
				if (type === 'scrolltoupper') {
					this.refreshing = true;
					this.pageNum = 1;
					this.listData = [];
					this.showLoading = false;
				} else if (type === 'scrolltolower') {
					if (!this.hasNextPage) return;
					this.pageNum++;
				}
				let {
					pageNum,
					pageSize
				} = this;
				let { id, retFactory } = uni.getStorageSync('ims_workOrder');
				let params = {
					pageNum,
					pageSize,
					workCode: id
				};
				if (this.activeTab >= 2) {
					params.workOrderSceneType = retFactory ? 'OVER_HAUL_BACK_CHAI_JIE_SCENE' : 'OVER_HAUL_ON_THE_SPOT_SCENE'
				}
				if (type !== 'scrolltoupper') {
					this.status = 'loading';
					this.showLoading = true;
				}
				this[apiMap[this.activeTab]](params)
				.then(res => {
					if (res.success && res.data) {
							let {
								pageList,
								hasNextPage
							} = res.data;
							let revData = pageList || [];
						this.listData = [...this.listData, ...revData];
						this.hasNextPage = hasNextPage;
					} else {
						uni.showToast({
							icon: 'error',
							title: res.errMsg || '数据获取失败',
							duration: 2000
						})
					}
				})
				.finally(() => {
					this.refreshing = false;
					this.showLoading = true;
					this.status = this.hasNextPage ? 'loadmore' : 'nomore';
				})
			},
			// 重置获取数据
			reGetData() {
				this.pageNum = 1;
				this.listData = [];
				this.getData();
			},
			// 编辑数量
			editNum(type, info) {
				this.num = +info[`${type}Num`];
				this.info = info;
				this.type = type;
				this.showModal = true;
			},
			closeModal(flag) {
				this.showModal = false;
				flag && this.reGetData();
			},
			modalConfirm(value) {
				let params = {
					changeId: this.info[`${this.type}Id`],
					changeNum: value
				}
				this[`${this.type}NumChange`](params)
				.then(res => {
					if (res.success) {
						this.closeModal(true);
					} else {
						uni.showToast({
							icon: 'error',
							title: res.errMsg,
							duration: 2000
						})
					}
				})
			},
			// 复核
			checkBom(info) {
				// this.bomInfo = info;
				uni.scanCode({
					onlyFromCamera: true,
					scanType: ['qrCode'],
					success: resScanCode => {
						if (resScanCode.scanType !== 'QR_CODE') {
							uni.showToast({
								icon: 'error',
								title: '内容识别有误',
								duration: 2000
							})
							return;	
						}
						this.handleScanResult(resScanCode.result)
					},
					fail: err => {
						uni.showToast({
							icon: 'error',
							title: '扫码失败',
							duration: 2000
						})
					}
				})
			},
			// 复核
			handleScanResult(result) {
				this.btnLoading = true;
				let params = {
					serialCode: JSON.parse(result).serialCode,
					examineStatus: 1
				}
				checkBom(params)
				.then(res => {
					if (res.success) {
						this.pageNum = 1;
						this.listData = [];
						this.getData();
					} else {
						uni.showToast({
							icon: 'error',
							title: res.errMsg || '操作失败',
							duration: 2000
						})
					}
				})
				.finally(() => {
					this.btnLoading = false;
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.full-content {
		width: 100%;
		height: 100%;

		.list-wrapper {
			width: calc(100% - 40rpx);
			height: 100%;
			margin: 0 20rpx;
			background-color: #fff;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
		}
		.btn-wrapper {
			position: absolute;
			left: 0;
			bottom: 0;
			height: 50px;
			padding: 0 40rpx;
			width: 100%;

			.btn {
				width: 100%;
			}
		}
	}
</style>