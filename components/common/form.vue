<template>
	<view class="form">
		<view class="form-item" v-for="(item,index) in formList" :key="index">
			<u-cell :isLink='item.showLink' :value='item.value'
				:arrow-direction="activeIndex === index ? 'down':'right'" @click="showActionSheet(item,index,'select')">
				<view slot="title" class="u-slot-title">
					<view class="cell-head">
						<text class="u-cell-text">{{item.title}}</text>
						<u-tag :text="item.time" plain size="mini" class='picker-tag'
							@click="showActionSheet(item,index,'time')">
						</u-tag>
						<!-- <text @click="showActionSheet(item,index,'time')">{{item.time === 'hour' ? "小时":"天" }}</text> -->
					</view>
					<view class="content" v-if="item.textArea">
						<u--textarea v-model="item.textArea" placeholder="请输入内容"></u--textarea>
					</view>
				</view>
			</u-cell>
		</view>
		<view class="photo">
			<text>拍照取证</text>
			<u-upload :fileList="photoList" @afterRead="afterRead" @delete="deletePic" name="5" multiple
				:maxCount="3"></u-upload>
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
				photoList: [],
			}
		},
		methods: {
			// 展示选项面板
			showActionSheet(item, index, type) {
				// if (!item.showLink) return
				this.activeIndex = type === 'time' ? "" : index
				this.$emit('showActionSheet', {
					currentItem: item,
					currentOperateIndex: index,
					actionType: type
				})
			},

			afterRead() {
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					// sourceType: ['album'], //从相册选择
					success: function(res) {
						console.log(JSON.stringify(res.tempFilePaths));
						// 预览图片
						uni.previewImage({
							urls: res.tempFilePaths,
							longPressActions: {
								itemList: ['发送给朋友', '保存图片', '收藏'],
								success: function(data) {
									console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data
										.index + 1) + '张图片');
								},
								fail: function(err) {
									console.log(err.errMsg);
								}
							}
						});
					},
					fail: function() {
						console.log('调用失败')
					}
				});
			},
			deletePic() {

			}
		}
	}
</script>

<style lang='scss' scoped>
	.form {
		max-height: 600px;
		overflow-y: auto;
		margin: 0 16rpx;
		background-color: #fff;
		border-radius: 10rpx;

		.u-slot-title {
			.cell-head {
				display: flex;
				justify-content: space-between;

				.picker-tag {
					width: 100rpx;
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