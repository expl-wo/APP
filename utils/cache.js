export default {
	//清空缓存
	clearCache() {
		try{
		let that = this;
		let os = plus.os.name;
		if (os == 'Android') {
			let main = plus.android.runtimeMainActivity();
			let sdRoot = main.getCacheDir();
			let files = plus.android.invoke(sdRoot, "listFiles");
			let len = files.length;
			for (let i = 0; i < len; i++) {
				let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径  
				plus.io.resolveLocalFileSystemURL(filePath, function(entry) {
					if (entry.isDirectory) {
						entry.removeRecursively(function(entry) { //递归删除其下的所有文件及子目录  
							uni.showToast({
								icon: 'none',
								title: '缓存清理完成',
								duration: 2000
							});
							that.formatSize(); // 重新计算缓存  
						}, function(e) {
							console.log(e.message)
						});
					} else {
						entry.remove();
					}
				}, function(e) {
					console.log('文件路径读取失败')
				});
			}
		} else { // ios  
			plus.cache.clear(function() {
				uni.showToast({
					title: '缓存清理完成',
					duration: 2000
				});
				that.formatSize();
			});
		}	
		}catch(e){
			uni.showToast({
				title: '该手持端不支持清空缓存'
			})
		}
	}

}
