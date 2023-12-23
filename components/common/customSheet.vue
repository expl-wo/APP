<template>
	<u-action-sheet :title="title" :round='true' :show="show" :closeOnClickOverlay='true' @close='close'>
		<view class="multi-select">
			<view :class="['select-item', item.isCheck?'active-item':undefined]" v-for="(item,index) in showList"
				:key="item.value" @click="handleCheck(item,index)">
				<text>{{item.label}}</text>
				<view :class=" [item.isDot ? 'dot-item':undefined]" v-if="item.isDot"></view>
			</view>
		</view>
		<view class="btn-box">
			<u-button type="default" text="重置" class="btn" @click="reset"></u-button>
			<u-button type="primary" text="确定" class="btn" color="#3a62d7" @click="handleConfirm"></u-button>
		</view>
	</u-action-sheet>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			selects: {
				type: Array,
				default: () => []
			},
			title: {
				type: String,
			},
			isHourSelect: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				showList: []
			}
		},
		watch: {
			selects(val) {
				if (val.length) {
					this.showList = val;
				}
			}
		},
		methods: {
			close() {
				this.$emit('close', this.selects.filter(item => item.isCheck))
			},
			handleCheck(item, index) {
				// 选择小时时为单选，先把其他选择置空
				if (this.isHourSelect) {
					this.showList.forEach(item => {
						item.isCheck = false
					})
				}
				this.showList[index].isCheck = !item.isCheck
			},
			reset() {
				this.showList.forEach(item => {
					item.isCheck = false
				})
			},
			handleConfirm() {
				const selectedList = this.showList.filter(item => item.isCheck)
				if (!selectedList.length) {
					uni.$u.toast('请至少选择一项！')
				}
				if (this.isHourSelect) {
					this.$emit('selectHourConfirm', selectedList)
				} else {
					selectedList.length && this.$emit('customSheetConfirm', selectedList)
				}
			}
		}
	}
</script>

<style lang='less' scoped>
	.multi-select {
		max-height: 400px;
		overflow-y: auto;
		display: flex;
		flex-wrap: wrap;

		.select-item {
			position: relative;
			margin: 10rpx;
			padding: 10rpx;
			border: 1px solid #3a62d7;
			border-radius: 10rpx;

			.dot-item {
				width: 8px;
				height: 8px;
				border-radius: 50%;
				background-color: #19be6b;
				position: absolute;
				top: 5px;
				right: 5px;
			}
		}

		.active-item {
			background-color: #3a62d7;
			color: #fff;
		}


	}

	.btn-box {
		display: flex;
		justify-content: space-around;

		.btn {
			width: 40%;
			margin: 10px;
		}
	}
</style>