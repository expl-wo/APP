<template>
	<view class="xui-scan" v-if="scanType === 'normal'" @click="handleClick">
		<view class="xui-scan__icon"></view>
		<view class="xui-scan__label">{{ labelContent }}</view>
		<xui-pda-scan ref="pdaScanRef"  @scanResult="handleScanResult"></xui-pda-scan>
		<xui-camera-scan :qrCodeType="qrCodeType" ref="cameraScanRef" v-if="!isPdaDevice || alwayUseCameraScan" @scanResult="handleScanResult"></xui-camera-scan>
	</view>
	<view v-else>
		<view class="pda-scan-label"  @click="handleClick">
			<u--text style="padding: 8px 0 5px;"  type="primary" :text="labelContent"></u--text>
			<xui-pda-scan ref="pdaScanRef"  v-if="isPdaDevice" @scanResult="handleScanResult"></xui-pda-scan>
			<xui-camera-scan :qrCodeType="qrCodeType" ref="cameraScanRef"  v-if="!isPdaDevice || alwayUseCameraScan" @scanResult="handleScanResult"></xui-camera-scan>
		</view>
	</view>
</template>

<script>
import Vue from 'vue';
export default {
	props: {
		label: {
			type: String,
			default: ''
		},
		qrCodeType: {
			type: String,
			default: 'qrCode'
		},
		scanType: {
			type: String,
			default: 'normal'
		},
		scanClass: String,
		qrCode: [String, Number]
	},
	data() {
		let isPdaDevice = getApp().globalData.isPdaDevice;
		let labelContent = this.label;
		if(!isPdaDevice){
			labelContent = this.addClickScanlabel(this.label);
		}
		return {
			isPdaDevice,
			labelContent,
			//是否在pda上也支持使用相机扫描
			alwayUseCameraScan: true
		};
	},
	methods: {
		handleClick() {
			// #ifdef H5
				this.handleScanResult(this.qrCode);
				return;
			// #endif
			//如果是pda 并且不是总是支持相机扫描
			if (this.isPdaDevice && !this.alwayUseCameraScan) {
				return;
			}
			this.$refs.cameraScanRef && this.$refs.cameraScanRef.scan();
		},
		handleScanResult(qrCode) {
			if(!this.$constants.isEmpty(qrCode)){
				this.$emit('scanResult', qrCode);
			}else{
				console.error('扫到的二维码为空');
			}
		},
		addClickScanlabel(label, isPdaDevice) {
			if (isPdaDevice) {
				return label;
			} else {
				if (label.indexOf('请') === 0) {
					return '请点击' + label.substr(label.indexOf('请') + 1);
				} else {
					return '点击' + label;
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
	.pda-scan-label{
		padding-top: 4px;
		color: #3c9cff;
	}
</style>
