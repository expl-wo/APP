<template>
	<view class="full-content">
		<view class="form-wrapper">
			<u-form labelPosition="left" labelWidth="auto" :model="issueForm" :rules="rules" ref="issueForm">
				<u-form-item label="问题类别" prop="type" borderBottom ref="type" @click="showSelect(true, 'type')">
					<u--input v-model="issueForm.type" disabled disabledColor="#ffffff" placeholder="请选择"
						border="none" />
					<u-icon slot="right" name="arrow-down" />
				</u-form-item>
				<u-form-item label="异常项" prop="abnormalItem" borderBottom ref="abnormalItem"
					@click="showSelect(true, 'abnormalItem')">
					<u--input v-model="issueForm.abnormalItem" disabled disabledColor="#ffffff" placeholder="请选择"
						border="none" />
					<u-icon slot="right" name="arrow-down" />
				</u-form-item>
				<u-form-item label="问题通知人" prop="notifier" borderBottom ref="notifier"
					@click="showSelect(true, 'notifier')">
					<u--input v-model="issueForm.notifier" disabled disabledColor="#ffffff" placeholder="请选择"
						border="none" />
					<u-icon slot="right" name="arrow-down" />
				</u-form-item>
				<u-form-item label="问题描述" borderBottom ref="desc">
					<u--textarea v-model="issueForm.desc" placeholder="请输入内容" count />
				</u-form-item>
				<u-form-item label="图片附件" borderBottom ref="imgUpload">
					<u-upload name="imgUpload" multiple accept="image" :useBeforeRead="true" :fileList="imageList"
						:maxCount="3" @beforeRead="beforeRead($event, 'image')" @afterRead="afterRead($event, 'image')"
						@delete="deleteFile($event, 'image')" />
				</u-form-item>
				<u-form-item label="视频附件" borderBottom ref="videoUpload">
					<u-upload name="videoUpload" multiple accept="video" :useBeforeRead="true" :fileList="videoList"
						:maxCount="1" :previewFullImage="true" @beforeRead="beforeRead($event, 'video')" @afterRead="afterRead($event, 'video')"
						@delete="deleteFile($event, 'video')" />
				</u-form-item>
				<view class="tip">
					注：最多可上传3张图片、1个视频,单张图片20M以内，视频200M以内
				</view>
			</u-form>
		</view>

		<view class="btn-wrapper">
			<u-button class="btn" text="返回" @click="back"></u-button>
			<u-button class="btn" type="primary" text="提交" @click="submit"></u-button>
		</view>
		<u-action-sheet :show="showFlag" :actions="actions" title="请选择" @close="showSelect(false)" @select="selectItem">
		</u-action-sheet>
	</view>
</template>

<script>
	const MAX_SIZE = {
		image: {
			label: '图片',
			maxSize: 20 * 1024 * 1024
		},
		video: {
			label: '视频',
			maxSize: 200 * 1024 * 1024
		}
	};
	export default {
		data() {
			return {
				issueForm: {
					type: '',
					typeId: '',
					abnormalItem: '',
					abnormalItemId: '',
					notifier: '',
					notifierId: '',
					desc: ''
				},
				rules: {
					type: [
						{
							required: true, 
							message: '请选择问题类别',
							trigger: ['change','blur'],
						}
					],
					abnormalItem: [
						{
							required: true, 
							message: '请选择异常项',
							trigger: ['change','blur'],
						}
					],
					notifier: [
						{
							required: true, 
							message: '请选择通知人',
							trigger: ['change','blur'],
						}
					]
				},
				imageList: [],
				videoList: [],
				currentField: '',
				showFlag: false,
				actions: [{
						name: '选项一',
						id: 1
					},
					{
						name: '选项二',
						id: 2
					},
					{
						name: '选项三',
						id: 2
					}
				]
			}
		},
		methods: {
			showSelect(flag, type) {
				this.currentField = type;
				this.showFlag = flag;
			},
			selectItem(item) {
				this.issueForm[this.currentField] = item.name;
				this.issueForm[`${this.currentField}Id`] = item.id;
			},
			beforeRead(event, type) {
				let {
					file
				} = event;
				return new Promise((resolve, reject) => {
					let eligibleFile = file.filter(item => {
						return !this.isOverSize(item.size, type)
					})
					if (!eligibleFile.length) {
						uni.showToast({
							title: `所选${MAX_SIZE[type].label}大小不符合要求`,
							duration: 2000
						});
						reject();
					}
					if (eligibleFile.length && eligibleFile.length < file.length) {
						uni.showToast({
							title: `已自动过滤不符合条件的${MAX_SIZE[type].label}`,
							duration: 2000
						});
						resolve(eligibleFile, type);
					}
					resolve(file, type);
				})
			},
			afterRead(file, type) {
				this[`${type}List`].push(...file.file);
			},
			deleteFile(event, type) {
				let index = event.index;
				this[`${type}List`].splice(index, 1);
			},
			// 判断是否图片是否超出限制
			isOverSize(size, type) {
				return size > MAX_SIZE[type].maxSize;
			},
			back() {
				uni.navigateBack({
				    delta: 1
				});
			},
			submit() {
				// TODO
				this.$refs.issueForm.validate()
				.then(res => {
					this.back();
				})
				.catch(err => {
					debugger;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.full-content {
		width: 100%;
		height: 100%;
		padding: 20rpx;
		font-size: 18px;

		.form-wrapper {
			height: calc(100% - 50px);
			overflow-y: auto;

			/deep/ .uni-input-placeholder {
				text-align: right;
			}

			/deep/ .uni-input-input {
				text-align: right;
			}
			.tip {
				line-height: 30px;
				font-size: 16px;
				color: #ccc;
			}
		}

		.btn-wrapper {
			display: flex;
			justify-content: space-around;
			align-items: center;
			height: 70px;

			.btn {
				width: 40%;
				height: 50px;
				line-height: 50px;
				font-size: 20px;
				border-radius: 8rpx;

			}
		}
	}
</style>