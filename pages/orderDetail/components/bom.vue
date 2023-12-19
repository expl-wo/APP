<template>
	<view class="full-wrapper full-contet">
		<!-- 第一层 -->
		<scroll-view v-if="isFirstLevel" :scroll-top="scrollTop" :show-scrollbar="true" scroll-y="true"
			class="list-wrapper" :refresher-enabled="true" :refresher-threshold="80" :upper-threshold="50"
			:lower-threshold="30" :refresher-triggered="refreshing" @refresherrefresh="getData('scrolltoupper')">
			<bom-item v-for="item in listData" :key="item.id" :dataInfo="item"  :productNo="productNo" @goToNext="nextLevel"
				@selectChange="selectChange" @showPopover="showPopover" @scanQrCode="scanCode" />
			<u-loadmore v-if="showLoading" :status="status" :nomoreText="nomoreText" />
		</scroll-view>
		<!-- 其他层级 -->
		<view v-else class="full-contet">
			<view class="parent-info">
				<view class="top">
					<u-icon name="arrow-left" size="24rpx" @click="goBack" />
					<text class="name">{{ curParentNode && curParentNode.bomName || '--' }}</text>
				</view>
				<view class="bottom parent-left">
					<view class="bottom-item">生产号：{{ productNo|| '--' }}</view>
					<view class="bottom-item">流水码：{{ curParentNode.serialCode || '--' }}</view>
				</view>
				<view class="bottom parent-left">
					<view class="bottom-item">库位码：{{ curParentNode.stationCode || '--' }}</view>
					<view class="bottom-item">待入库状态：{{ curParentNode.bomStatus === null ? '--' : BOM_STATUS[curParentNode.bomStatus] }}</view>
				</view>
			</view>
			<scroll-view :scroll-top="scrollTop" :show-scrollbar="true" scroll-y="true" class="list-wrapper2"
				:refresher-enabled="true" :refresher-threshold="80" :upper-threshold="50" :lower-threshold="30"
				:refresher-triggered="refreshing" @refresherrefresh="getData('scrolltoupper')">
				<bom-item class="pd" v-for="item in listData" :key="item.id" :dataInfo="item" :productNo="productNo"
					 @showPopover="showPopover" @goToNext="nextLevel" @selectChange="selectChange" @scanQrCode="scanCode" />
					<u-loadmore v-if="showLoading" :status="status" :nomoreText="nomoreText" />
			</scroll-view>
		</view>
		<view v-if="selectList.length" class="btn-wrapper">
			<u-button class="btn" type="primary" text="批量绑定库位码" color="#243d8f" :loading="btnLoading" loadingText="操作中"
				@click="batchBind" />
<!-- 			<u-button class="btn mt12" type="primary" text="批量绑定流水码" color="#182b62" :loading="btnLoading" loadingText="操作中"
				@click="batchBind('serialCode')" /> -->
		</view>
		<upload-img :visible="popupVisible" :imgType="imgType" :bomInfo="bomInfo" @closePopup="closePopup" />
		<u-action-sheet title="场景类型" :actions="actions" :round="20" :show="popoverFlag" :closeOnClickOverlay="true"
			:closeOnClickAction="true" @close="closePopover" @select="onSelect"></u-action-sheet>
	</view>
</template>
<script>
	import BomItem from './bomItem.vue';
	import UploadImg from './uploadImg.vue';
	import { BOM_STATUS } from '@/utils/constants-custom';
	import {
		getBomDataList,
		bindStationCode,
		bindSerialCode
	} from '@/https/overhaul/bom';

	const actions = [{
			name: '拆解照片',
			id: 1
		},
		{
			name: '厂内生产照片',
			id: 2
		}
	]

	export default {
		name: 'Bom',
		components: {
			BomItem,
			UploadImg
		},
		data() {
			return {
				actions: Object.freeze(actions),
				BOM_STATUS: Object.freeze(BOM_STATUS),
				listData: [],
				popupVisible: false,
				scrollTop: 0,
				refreshing: false,
				nodeStack: [null],
				curParentNode: null,
				selectList: [],
				btnLoading: false,
				status: 'nomore',
				workOrderId: '',
				parentTreeId: '',
				showLoading: false,
				bomInfo: null,
				popoverFlag: false,
				imgType: 1
			}
		},
		computed: {
			nomoreText() {
				return this.listData.length ? '没有更多了' : '暂无数据';
			},
			isFirstLevel() {
				return this.curParentNode === null;
			}
		},
		mounted() {
			let workOrder = uni.getStorageSync('ims_workOrder');
			this.workOrderId = workOrder.id;
			this.productNo = workOrder.prodNumber;
			this.getData();
		},
		methods: {
			bindStationCode,
			bindSerialCode,
			// 进入下一层级
			nextLevel(item) {
				this.curParentNode = item;
				this.nodeStack.push(item);
				this.getData();
				this.selectList = [];
			},
			// 返回上一级
			goBack() {
				this.nodeStack.pop();
				this.curParentNode = this.nodeStack[this.nodeStack.length - 1];
				this.getData();
				this.selectList = [];
			},
			showPopover(info) {
				this.bomInfo = info;
				this.popoverFlag = true;
			},
			closePopover() {
				this.popoverFlag = false;
			},
			onSelect(action) {
				this.imgType = action.id;
				this.popupVisible = true;
			},
			closePopup(flag) {
				this.popupVisible = false;
				flag && this.getData();
			},
			// 获取数据
			getData(type) {
				if (type === 'scrolltoupper') {
					this.refreshing = true;
				}
				this.listData = [];
				this.showLoading = false;
				let params = {
					workId: this.workOrderId,
					parentTreeId: this.curParentNode && this.curParentNode.treeId
				};
				getBomDataList(params)
					.then(res => {
						if (res.success && res.data) {
							this.listData = res.data.value || [];
						}
					})
					.finally(() => {
						this.refreshing = false;
						this.showLoading = true;
					})
			},
			// 批量选择
			selectChange(id, type) {
				if (type === 'deselect') {
					let index = this.selectList.findIndex(item => item === id);
					this.selectList.splice(index, 1);
				} else {
					this.selectList.push(id);
				}
			},
			// 批量扫码绑定库位码
			batchBind() {
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
						this.btnLoading = true;
						let params = {
							workId: uni.getStorageSync('ims_workOrder').id,
							bomIds: this.selectList,
							stationCode: resScanCode.result
						}
						this.bindStationCodeFunc(params);
					}
				})

			},
			// 扫码
			scanCode(info, type) {
				this.bomInfo = info;
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
						this.handleScanResult(resScanCode.result, type);
					}
				})
			},
			// 绑定库位码
			bindStationCodeFunc(params) {
				bindStationCode(params)
				.then(res => {
					if (res.success) {
						this.pageNum = 1;
						this.listData = [];
						this.getData();
						uni.showToast({
							icon: 'success',
							title: '操作成功',
							duration: 2000
						})
					} else {
						uni.showToast({
							icon: 'error',
							title: res.errMsg || '操作失败',
							duration: 2000
						})
					}
				})
				.finally(() => {
					this.selectList = [];
					this.btnLoading = false;
				})
			},
			// 获取到二维码内容做处理
			handleScanResult(code, type) {
				let params = {};
				if (type === 'serialCode') {
					params = {
						...this.bomInfo,
						serialCode: JSON.parse(code).serialCode,
						prodNumber:JSON.parse(code).prodNumber
					}
				} else {
					params = {
						workId: uni.getStorageSync('ims_workOrder').id,
						bomIds: [this.bomInfo.id],
						stationCode: code,
					}
				}
				this[type === 'serialCode' ? 'bindSerialCode' : 'bindStationCode'](params)
				.then(res => {
					if (res.success) {
						this.pageNum = 1;
						this.listData = [];
						this.getData();
						uni.showToast({
							icon: 'success',
							title: '操作成功',
							duration: 2000
						})
					} else {
						uni.showToast({
							icon: 'error',
							title: res.errMsg || '操作失败',
							duration: 2000
						})
					}
				})
			},
		},
	}
</script>
<style lang="scss" scoped>
	.full-wrapper {
		position: relative;

		.list-wrapper {
			width: calc(100% - 40rpx);
			height: 100%;
			margin: 0 20rpx;
			background-color: #fff;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
		}

		.parent-info {
			height: 130px;
			width: calc(100% - 40rpx);
			margin: 0 20rpx;
			padding: 0 16rpx;
			box-sizing: border-box;
			box-shadow: 0 5px 10px -5px #eee;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
			background-color: #fff;


			.top {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				height: 50px;

				.name {
					font-size: 24px;
					font-weight: 500;
					margin-left: 8rpx;
				}

				.icon {
					margin-left: auto;
				}
			}

			.bottom {
				display: flex;
				height: 30px;
				line-height: 30px;
				font-size: 18px;
				color: #657685;
				.bottom-item {
					width: 50%;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}

		.list-wrapper2 {
			width: calc(100% - 40rpx);
			height: calc(100% - 130px);
			margin: 0 20rpx;
			background-color: rgba(248, 248, 248, 1);
			box-sizing: border-box;

			.list-item {
				width: 100%;
				border-bottom: 1px solid #eee;
				padding: 0 16px;
			}

			.list-item:last-child {
				border-bottom: none;
			}
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

	.parent-left {
		padding-left: 44rpx;
	}

	.pd {
		padding-left: 24rpx;
	}

	.full-contet {
		width: 100%;
		height: 100%;
	}
	.mt12 {
		margin-top: 12px;
	}
</style>