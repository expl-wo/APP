<template>
	<view class="form">
		<view class="form-item" v-for="(item,index) in formList" :key="index">
			<u-cell :isLink='item.showLink' :arrow-direction="activeIndex === index ? 'down':'right'">
				<view slot="title" class="u-slot-title">
					<view class="cell-head">
						<text class="u-cell-text">{{item.title}}</text>
						<view class='picker-tag'>
							<view class="copy-box">
								<u-icon name="plus" color="#3a62d7" size="28" class="icon"
									@click="handleCopyRecord(item,index)"></u-icon>
								<u-icon name="trash-fill" color="#3a62d7" size="28" class="icon"
									@click="handleDeleteRecord(item,index)"></u-icon>
							</view>
							<text class="time-type" v-if="item.type"
								@click="showActionSheet(item,index,'time')">{{item.time}}</text>
							<text class="tip" v-if="item.type">{{item.type === 'hour'?'该记录按小时执行':'该记录按天执行'}}</text>
						</view>
					</view>
					<view class="content" v-if="item.textArea">
						<u--textarea v-model="item.textAreaValue" placeholder="请输入内容"></u--textarea>
					</view>
				</view>
				<text slot="value" class="u-slot-value"
					@click="showActionSheet(item,index,'select')">{{item.value}}</text>
			</u-cell>
		</view>
		<view class="photo">
			<u-cell>
				<view slot="title" class="u-slot-title">
					<view><text>拍照取证</text></view>
					<view>
						<u-upload :fileList="fileList" :maxCount="10" :previewFullImage="true" @afterRead="afterRead"
							@delete="deletePic" name="1" multiple></u-upload>
					</view>
				</view>
			</u-cell>
		</view>
	</view>
</template>

<script>
	export default {
		name: "From",
		props: {
			// 表单列表数据
			formList: {
				type: Array,
				default: () => []
			},
			haveActionSheet: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			haveActionSheet(newV, oldV) {
				if (!newV) {
					this.activeIndex = ''
				}
			}
		},
		data() {
			return {
				activeIndex: "",
				fileList: [],
			}
		},
		methods: {
			handleCopyRecord(item, index) {
				this.$emit('copyRecord', item, index)
			},
			// 展示选项面板
			showActionSheet(item, index, type) {
				if (!item.value) return
				this.activeIndex = type === 'time' ? "" : index
				this.$emit('showActionSheet', {
					currentItem: item,
					currentOperateIndex: index,
					actionType: type
				})
			},

			afterRead({
				file,
				lists,
				name
			}) {
				debugger
			},
			// 删除图片
			deletePic(event) {
				this.fileList.splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				debugger
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this.fileList.length
				lists.map((item) => {
					this.fileList.push({
						...item,
						// status: 'uploading',
						// message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this.fileList[fileListLen]
					this.fileList.splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'http://192.168.2.21:7001/upload', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						formData: {
							user: 'test'
						},
						success: (res) => {
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					});
				})
			},
			handleDeleteRecord(item, index) {
				this.$emit('deleteRecord', item, index)
			}
		}
	}
</script>

<style lang='scss' scoped>
	.form {
		height: calc(100% - 300px);
		overflow-y: auto;
		margin: 0 16rpx;
		background-color: #fff;
		border-radius: 10rpx;

		.u-slot-title {
			.cell-head {
				display: flex;
				justify-content: space-between;

				.u-cell-text {
					width: 60rpx;
				}

				.picker-tag {
					flex: 1;
					margin-left: 20rpx;

					.copy-box {
						display: inline-block;
						margin: 0 30rpx;

						.icon {
							display: inline-block;
							margin: 0 10rpx;
						}
					}

					.tip {
						font-size: 12px;
					}

					.time-type {
						padding: 0 20rpx;
						color: #3a62d7;
					}
				}
			}
		}

		.form-item {
			&:last-child {
				margin-bottom: 20rpx;
			}
		}
	}
</style>