<!-- 通用扫码组件
参数: title: 文字描述，例杂项绑盘
 	  iconClass: 图标样式
 	  descClass: 文字描述样式
使用示例:<commonScan @scanResult="handleScanResult" title="杂项绑盘" iconClass="wms-scan-icon-larger"></commonScan> -->
<template>
	<view>
		<xui-pda-scan v-if="pdaScan" @scanResult="handleScanResult"></xui-pda-scan>
		<view @click="showScan = true">
			<view v-if="showIcon" :class="iconClass"></view>
			<view :class="descClass">{{title}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"commonScan",
		data() {
			return {
				pdaScan: false,
				showScan: false,
				showIcon: false,
			};
		},
		// props: ['iconClass','title'],
		props: {
			iconClass: {
				type: String,
				default: null,
			},
			descClass: {
				type: String,
				default: null,
			},
			title: {
				type: String,
				default: "点击扫码"
			}
		},
		mounted() {
			if(this.iconClass) {
				this.showIcon = true;
			}
			uni.getSystemInfo({
				success: (res) => {
					if(res.brand === 'SEUIC') this.pdaScan = true;
				}
			});
		},
		watch:{
			showScan(newValue , oldValue){
				this.wxScan();
			},
		},
		methods: {
			handleScanResult(res) {
				this.$emit("scanResult",res);
			},
			wxScan(){
				console.log(this.showScan);
				if(!this.pdaScan && this.showScan) {
					this.showScan = false;
					let that = this;
					uni.scanCode({
						onlyFromCamera: true,
						success: (res) => {
							that.$emit("scanResult",res.result);
						}
					});
				}
			},
		}
	}
</script>

<style>
</style>
