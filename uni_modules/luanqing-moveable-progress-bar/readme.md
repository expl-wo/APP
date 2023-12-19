# luanqing-moveable-progress-bar
# 可拖动的进度条

用法：
	<luanqing-moveable-progress-bar 
		ref="progressBar" 
		@change="(e)=>onProgressChange(e,'progress')">
	</luanqing-moveable-progress-bar>

prop参数：
	max: 最大值
	slideBarWidth: 可拖动进度条的宽度（单位rpx）

设置默认值方法：
	this.$refs.progressBar.setDefaultProgress(50);
	
	
	
