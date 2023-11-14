<template>
	<view class="cv-transfer-panel">
		<view class="cv-transfer-panel-header">
			{{title}}
		</view>
		<u-search placeholder="关键字搜索" height="36px" 
		searchIconSize="30px"
		:input-style="{'height': '30px','font-size':'14px'}" v-model="keyWord" :show-action="false"></u-search>
		<scroll-view scroll-y="true" class="cv-transfer-panel-body">
			<view class="uni-list" style="font-size: 14px;">
				<u-checkbox-group ref="checkGroup" :wrap="true" :key=checkKey  @change="checkboxChange" v-if="data.length" style="text-align: center;">
					<u-checkbox 
						v-model="item.checked" 
						v-for="(item, index) in unSelectData" :key="item.key" 
						:name="item.key"
						size="10rpx"
						label-size="10rpx"
						:label="item.label"
					></u-checkbox>
				</u-checkbox-group>
				<view class="empty-data" v-else>
					无数据
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'transfer-panel',
		data(){
			return {
				keyWord: null,
				unSelectData: [],
				checkKey: 1
			}
		},
		props: {
			data: {
				type: Array,
				default: () => ([])
			},
			title: {
				type: String,
				default: '列表1'
			},
		},
		mounted() {
			this.dataInit();
		},
		watch:{
			keyWord(newValue,oldValue){
				this.unSelectData = this.data.filter(item=>item.label.indexOf(newValue)>=0);
			},
			data(newVal,oldVal){
				this.dataInit(newVal);
				this.checkKey+=1;
			}
		},
		methods: {
			checkboxChange(event) {
				this.$emit('onSelect', event);
				this.dataInit();
			},
			dataInit(){
				if(this.keyWord) this.unSelectData = this.data.filter(item=>item.label.indexOf(this.keyWord)>=0);
				else this.unSelectData = this.data;
				this.unSelectData = this.unSelectData.filter(item=>item != undefined)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-checkbox-group{
		
		display: flex;
		flex-direction: column
	}
	.cv-transfer-panel {
		flex: 25%;
		border: 1px solid #ebeef5;
		border-radius: 4px;
		overflow: hidden;
		background: #fff;
		display: inline-block;
		vertical-align: middle;
		max-height: 100%;
		box-sizing: border-box;
		position: relative;

		&-header {
			height: 30px;
			line-height: 30px;
			background: #f5f7fa;
			margin: 0;
			padding-left: 15px;
			border-bottom: 1px solid #ebeef5;
			box-sizing: border-box;
			color: #000;
			text-align: center;
			font-size: 16px;
		}

		&-body {
			padding: 6px 0;
			//min-height: 250rpx;
			height: 100%;
			overflow: auto;
			text-align: center;
			.empty-data {
				margin: 0;
				height: 30px;
				line-height: 30px;
				padding: 6px 15px 0;
				color: #909399;
				text-align: center;
				font-size: 15px;
			}

			.cv-list-cell {
				display: inline-flex;
				align-items: center;
			}

			.item-label {
				font-size: 15px;
			}
		}
	}
</style>
