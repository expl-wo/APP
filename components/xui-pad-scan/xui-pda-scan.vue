<template>
	<view class="content"></view>
</template>

<script>
	export default {
		name: 'xuiPdaScan',
		data() {
			return {
				r: Math.random(),
				main: null,
				receiver: null,
				filter: null,
				shakeIsShow: false
			};
		},
		onLoad() {
			console.log('onLoad scan')
		},
		mounted(option) {
			console.log('mounted scan')
			this.monitorScan();
		},
		// 组件销毁
		destroyed() {
			console.log('destroyed cancelScan');
			this.cancelScan();
		},
		methods: {
			// 广播监听绑定
			monitorScan() {
				// #ifdef APP-PLUS
				this.main = plus.android.runtimeMainActivity(); //获取activity
				// PDA扫描必须设置广播模式
				let IntentFilter = plus.android.importClass('android.content.IntentFilter');
				this.filter = new IntentFilter();
				this.filter.addAction('com.android.server.scannerservice.broadcast'); //广播动作
				let that = this;
				let context = plus.android.importClass('android.content.Context');
				let Intent = plus.android.importClass('android.content.Intent');
				this.receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
					onReceive: function(context, intent) {
						plus.android.importClass(intent); //引入intent类
						let data = intent.getStringExtra('scannerdata'); //广播数据标签
						that.antiShake(data);
					}
				});
				this.main.registerReceiver(this.receiver, this.filter); //注册监听
				// #endif
			},
			//取消监听扫描头
			cancelScan() {
				// #ifdef APP-PLUS
				if (this.main && this.receiver) {
					this.main.unregisterReceiver(this.receiver);
					this.main = null;
					this.receiver = null;
					this.filter = null;
				}
				// #endif
			},
			//防重复
			antiShake: function(code) {
				console.log(this.r + ':' + code);
				if (this.shakeIsShow) return false;
				this.shakeIsShow = true;
				setTimeout(()=> {
					this.shakeIsShow = false;
				}, 150);
				this.$emit("scanResult", code)
			}
		}
	};
</script>

<style>
	.page {
		background-color: #efeff4;
	}

	.content {
		text-align: center;
	}
</style>
