<template>
	<u-action-sheet :title="title" :round='true' :show="show" :closeOnClickOverlay='true' @close='close'>
		<view class="multi-select">
			<view :class="['select-item', item.isCheck?'active-item':undefined]" v-for="(item,index) in selects"
				:key="item.value" @click="handleCheck(item,index)">
				<text>{{item.label}}</text>
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
				selecedList: this.selects
			}
		},
		methods: {
			close() {
				this.$emit('close', this.selects.filter(item => item.isCheck))
			},
			handleCheck(item, index) {
				if(this.isHourSelect){
					this.selecedList = []
				}
				this.selecedList[index].isCheck = !item.isCheck
			},
			reset() {
				this.$emit('reset')
			},
			handleConfirm() {
				const selectedList = this.selects.filter(item => item.isCheck)
				if (this.isHourSelect) {
					this.$emit('selectHourConfirm', selectedList)
				}else{
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
		justify-content: space-around;
		flex-wrap: wrap;

		.select-item {
			width: 25%;
			height: 30px;
			line-height: 30px;
			margin: 10rpx;
			border: 1px solid #3a62d7;
			border-radius: 10rpx;
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