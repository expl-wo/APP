<template>
	<view class="full-wrapper">
		<!-- 第一层 -->
		<scroll-view v-if="isFirstLevel" :scroll-top="scrollTop" :show-scrollbar="true" scroll-y="true"
			class="list-wrapper" :refresher-enabled="true" :refresher-threshold="80" :upper-threshold="50"
			:lower-threshold="30" :refresher-triggered="refreshing" @refresherrefresh="getData()">
			<bom-item v-for="item in listData" :key="item.id" :dataInfo="item" @check="check" @goToNext="nextLevel"
				@selectChange="selectChange" @takePhoto="takePhoto" />
		</scroll-view>
		<!-- 其他层级 -->
		<view v-else>
			<view class="parent-info">
				<view class="top">
					<u-icon name="arrow-left" size="36rpx" @click="goBack" />
					<text class="name">{{ curParentNode.name || '--' }}</text>
				</view>
				<view class="bottom parent-left">生产号：{{ curParentNode.productNo || '--' }}</view>
				<view class="bottom parent-left">流水码：{{ curParentNode.srialCode || '--' }}</view>
			</view>
			<scroll-view :scroll-top="scrollTop" :show-scrollbar="true" scroll-y="true" class="list-wrapper2"
				:refresher-enabled="true" :refresher-threshold="80" :upper-threshold="50" :lower-threshold="30"
				:refresher-triggered="refreshing" @refresherrefresh="getData">
				<bom-item class="pd" v-for="item in listData" :key="item.id" :dataInfo="item" @check="check"
					@goToNext="nextLevel" @selectChange="selectChange" @takePhoto="takePhoto" />
			</scroll-view>
		</view>
		<view v-if="selectList.length" class="btn-wrapper">
			<u-button class="btn" type="primary" text="批量扫码绑定" color="#243d8f" :loading="btnLoading" loadingText="操作中"
				@click="batchBind" />
		</view>
		<upload-img :visible="popupVisible" :title="popupTitle" @closePopup="closePopup" />
	</view>
</template>
<script>
	import BomItem from './bomItem.vue';
	import UploadImg from './uploadImg.vue';

	// import { getBomDataList } from '@/https/overhaul/bom';

	export default {
		name: 'Bom',
		components: {
			BomItem,
			UploadImg
		},
		data() {
			return {
				listData: [],
				popupVisible: false,
				popupTitle: '',
				scrollTop: 0,
				refreshing: false,
				nodeStack: [],
				curParentNode: null,
				selectList: [],
				btnLoading: false
			}
		},
		computed: {
			nomoreText() {
				return this.listData.length ? '没有更多了' : '暂无数据';
			},
			isFirstLevel() {
				return !this.nodeStack.length;
			}
		},
		mounted() {
			this.getData();
		},
		methods: {
			// 进入下一层级
			nextLevel(item) {
				this.curParentNode = item;
				this.nodeStack.push(item);
				this.getData();
			},
			// 返回上一级
			goBack() {
				this.curParentNode = this.nodeStack.pop();
				this.getData();
			},
			takePhoto(info, type) {
				this.popupTitle = type === 1 ? '拆解照片' : '厂内生产照片';
				this.popupVisible = true;
			},
			closePopup(flag) {
				this.popupVisible = false;
			},
			// 获取数据
			getData() {
				this.listData = [];
				this.refreshing = true;
				let params = {};
				setTimeout(() => {
					this.listData = [{
							id: 11,
							name: '大部件11',
							productNo: 'DZ12',
							srialCode: '366565'
						},
						{
							id: 12,
							name: '大部件12',
							productNo: 'DZ12',
							srialCode: '2334343'
						}
					]
					this.refreshing = false;
				}, 1000)
				// getBomList(params)
				// 	.then(res => {
				// 		if (res.success && res.data) {
				// 			this.listData = res.data.pageList || [];
				// 		}
				// 	})
				// 	.finally(() => {
				// 		this.refreshing = false;
				// 	})
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
			// 批量绑定
			batchBind() {
				console.log('-----------', this.selectList);
				this.btnLoading = true;
				setTimeout(() => {
					this.btnLoading = false;
				}, 2000)
			}
		},
	}
</script>
<style lang="scss" scoped>
	.full-wrapper {
		position: relative;
		width: 100%;
		height: 530px;
		// box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.1);

		.list-wrapper {
			width: calc(100% - 40rpx);
			height: 100%;
			margin: 0 20rpx;
			background-color: #fff;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
		}

		.parent-info {
			height: 180rpx;
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
				height: 80rpx;

				.name {
					font-size: 40rpx;
					font-weight: bold;
					margin-left: 8rpx;
				}

				.icon {
					margin-left: auto;
				}
			}

			.bottom {
				height: 40rpx;
				line-height: 40rpx;
				font-size: 24rpx;
				color: #657685;
			}
		}

		.list-wrapper2 {
			width: calc(100% - 40rpx);
			height: 100%;
			margin: 0 20rpx;
			background-color: rgba(248, 248, 248, 1);
			box-sizing: border-box;

			.list-item {
				width: 100%;
				border: 1px solid red;
				border-bottom: 1px solid #eee;
				padding: 0 16px;

				.name {
					height: 36px;
					line-height: 36px;
				}

				.other {
					height: 24px;
					line-height: 24px;
					font-size: 12px;
					color: #777;
				}
			}

			.list-item:last-child {
				border-bottom: none;
			}
		}

		.btn-wrapper {
			position: absolute;
			display: flex;
			align-items: center;
			justify-content: center;
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
</style>