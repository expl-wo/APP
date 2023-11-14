<template>
	<view class="cv-transfer">
		<transfer-panel-left :data="unSelectData" :title="titles[0]" @onSelect="onSelect"></transfer-panel-left>
		<view class="cv-transfer-btns">
			<button type="default" size="mini" :disabled="undoBtnDisabled" @click="doUnSelect">{{buttonTexts[0]}}</button>
			<button type="default" size="mini" :disabled="doSelectBtnDisabled" @click="doSelect">{{buttonTexts[1]}}</button>
		</view>
		<transfer-panel-right :data="selectedData" :title="titles[1]" @onUnSelect="onUnSelect"></transfer-panel-right>
	</view>
</template>
<script>
	export default {
		name: 'cv-transfer',
		model: {
			prop: 'value',
			event: 'change'
		},
		props: {
			// 选中的数据
			value: {
				type: Array,
				default: () => ([])
			},
			// 源数据
			data: {
				type: Array,
				default: () => ([])
			},
			// 自定义列表标题
			titles: {
				type: Array,
				default: () => (['列表1', '列表2'])
			},
			// 自定义按钮文案
			buttonTexts: {
				type: Array,
				default: () => (['<', '>'])
			}
		},
		data() {
			return {
				undoBtnDisabled: true,
				doSelectBtnDisabled: true,
				doSelectValues: [],
				undoSelectValues: []
			}
		},
		computed: {
			unSelectData() {
				if(this.value.length>0) {
					const value = this.data.filter((item) => item !=undefined && !this.value.includes(item.key))
					return value
				} else return this.data
			},
			selectedData() {
				if(this.value.length>0) {
					const value = this.data.filter((item) => item !=undefined && this.value.includes(item.key))
					return value;
				} else return this.value;
			}
		},
		mounted(){
			// console.log(this.value)
			// console.log(this.selectedData)
		},
		methods: {
			// 左侧选中
			onSelect(value) {
				this.doSelectBtnDisabled = false;
				this.doSelectValues = value;
			},
			// 右侧取消选中
			onUnSelect(value) {
				this.undoBtnDisabled = false;
				this.undoSelectValues = value;
			},
			doSelect() {
				this.$emit('change', [...new Set([...this.value, ...this.doSelectValues])]);
				this.selectInit(this.data);
				this.doSelectBtnDisabled = true;
				this.doSelectValues = [];
			},
			doUnSelect() {
				this.$emit('change', this.value.filter((item) => !this.undoSelectValues.includes(item)));
				this.selectInit(this.data);
				this.undoBtnDisabled = true;
				this.undoSelectValues = [];
			},
			selectInit(data){
				data = data.filter(item=> item !=undefined )
				data.forEach(item=>{
					item.checked = false;
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.cv-transfer {
		display: flex;
		//justify-content: space-between;
		//align-items: center;
		width: 100%;
		height: 500px;

		.cv-transfer-btns {
			text-align: center;
			margin-top: 200px;
			width: 50px;
		}
	}
</style>
