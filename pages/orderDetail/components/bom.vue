<template>
	<view class="full-wrapper">
		<van-pull-refresh v-model="isLoading" class="pull-wrapper" @refresh="onRefresh">
			<bom-item v-for="item in dataList" :key="item.id" :dataInfo="item" @takePhoto="takePhoto" />
		</van-pull-refresh>
		<u-upload :visible="dialogVisible" :title="dialogTitle" @closeDialog="closeDialog" />
	</view>
</template>
<script>
	import BomItem from './bomItem.vue';
	import UploadImg from './uploadImg.vue';

	export default {
		name: 'Bom',
		components: {
			BomItem,
			UploadImg
		},
		data() {
			return {
				dataList: [{
						id: 1,
						name: '大部件1',
						category: 'BOM类别',
						productNo: 'DZ111',
						srialCode: '366565'
					},
					{
						id: 2,
						name: '大部件2',
						category: 'BOM类别',
						productNo: 'DZ222',
						srialCode: '2334343'
					},
					{
						id: 3,
						name: '大部件23',
						category: 'BOM类别',
						productNo: 'DZ222',
						srialCode: '2334343'
					},
					{
						id: 4,
						name: '大部件4',
						category: 'BOM类别',
						productNo: 'DZ222',
						srialCode: '2334343'
					}
				],
				isLoading: false,
				dialogVisible: false,
				dialogTitle: '',

			}
		},
		methods: {
			onRefresh() {
				this.isLoading = false;
			},
			takePhoto(info, type) {
				this.dialogTitle = type === 1 ? '拆解照片' : '厂内生产照片';
				this.dialogVisible = true;
			},
			closeDialog() {
				this.dialogVisible = false;
			}
		},
	}
</script>
<style lang="scss" scoped>
	.full-wrapper {
		width: 100%;
		height: 100%;
		border: 2rpx solid #fff;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.1);

		.pull-wrapper {
			height: 100%;
			overflow-y: auto;
		}
	}
</style>