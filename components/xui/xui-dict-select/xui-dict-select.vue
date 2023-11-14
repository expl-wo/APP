<template>
	<view>
		<view @click="show=true">
			<u--input border="surround" v-model="currentValue" disabled disabledColor="#ffffff"
			 placeholder="" fontSize="16px"  suffixIcon="arrow-right"
			suffixIconStyle="color: #909399;fontSize: 16px;line-height:24px;"></u--input>
		</view>
		<u-picker :show="show" :columns="columns" keyName="name" itemHeight="30" @confirm="confirm" @close="show=false"></u-picker>
	</view>
</template>

<script>
	import {getDictListByKey} from '@/components/xui/xui-dictionary/index'
	export default {
		props: {
			itemCode: String,
			value: [String, Number, Array],
		},
		data(){
			return {
				currentValue: '',
				show: false,
				columns: [],
				dictList: [],
			}
		},
		watch: {
			value(){
				this.tranformValue();
			}
		},
		mounted(){
			this.init();
		},
		methods: {
			confirm({columnIndex, value, values}){
				this.$emit('input', value[0].code);
				this.show = false
				this.$nextTick(()=>{
					this.$emit("change", value[0].code);
				})
			},
			async init(){
				let dataList = await getDictListByKey(this.itemCode);
				let newDataList = dataList.map(item=>{
					return {
						code: item.code,
						name: item.name
					}
				})
				this.dictList = newDataList;
				this.columns = [newDataList];
				this.tranformValue();
			},
			tranformValue(){
				if(this.dictList.length > 0 && this.value){
					let selectedItem = this.dictList.find(item=>{
						return this.value == item.code
					})
					if(selectedItem){
						this.currentValue = selectedItem.name;
						return;
					}
				}
				this.currentValue = '';
			}
		},
	}
</script>

<style>
</style>