<template>
	<view class="full-content">
		<view class="form-wrapper">
			<u-form labelPosition="left" labelWidth="auto" :model="issueForm" :rules="rules" ref="issueForm">
				<u-form-item label="问题类别" prop="cateName" borderBottom ref="cateName" @click="showSelect(true, 'cate')">
					<u--input v-model="issueForm.cateName" disabled disabledColor="#ffffff" placeholder="请选择"
						border="none" />
					<u-icon slot="right" name="arrow-down" />
				</u-form-item>
				<u-form-item label="异常项" prop="abnormalName" borderBottom ref="abnormalName"
					@click="showSelect(true, 'abnormal')">
					<u--input v-model="issueForm.abnormalName" disabled disabledColor="#ffffff" placeholder="请选择"
						border="none" />
					<u-icon slot="right" name="arrow-down" />
				</u-form-item>
				<u-form-item label="问题通知人" prop="notifierName" borderBottom ref="notifierName"
					@click="showSelect(true, 'notifier')">
					<u--input v-model="issueForm.notifierName" disabled disabledColor="#ffffff" placeholder="请选择"
						border="none" />
					<u-icon slot="right" name="arrow-down" />
				</u-form-item>
				<u-form-item label="问题描述" borderBottom ref="desc">
					<u--textarea v-model="issueForm.desc" placeholder="请输入内容" count />
				</u-form-item>
				<u-form-item label="图片附件" borderBottom ref="imgUpload">
					<u-upload name="imgUpload" multiple accept="image" :useBeforeRead="true" :fileList="pictureList"
						:maxCount="3" @beforeRead="beforeRead($event, 'picture')"
						@afterRead="afterRead($event, 'picture')" @delete="deleteFile($event, 'picture')" />
				</u-form-item>
				<u-form-item label="视频附件" borderBottom ref="videoUpload">
					<u-upload name="videoUpload" multiple accept="video" :useBeforeRead="true" :fileList="videoList"
						:maxCount="1" :previewFullImage="true" @beforeRead="beforeRead($event, 'video')"
						@afterRead="afterRead($event, 'video')" @delete="deleteFile($event, 'video')" />
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
		picture: {
			label: '图片',
			maxSize: 20 * 1024 * 1024
		},
		video: {
			label: '视频',
			maxSize: 200 * 1024 * 1024
		}
	};
	import {
		queryCategory,
		queryAbnormal,
		addProcedureProblem
	} from "@/https/staging/index.js";
	import uploadHttp from '@/https/_public/upload';
	import {
		getToken
	} from '@/utils/auth.js';
	export default {
		data() {
			return {
				issueForm: {
					cateName: '',
					cateId: '',
					abnormalName: '',
					abnormalId: '',
					notifierName: '',
					notifierId: '',
					desc: ''
				},
				rules: {
					cateName: [{
						required: true,
						message: '请选择问题类别',
						trigger: ['change', 'blur'],
					}],
					abnormalName: [{
						required: true,
						message: '请选择异常项',
						trigger: ['change', 'blur'],
					}],
					notifierName: [{
						required: true,
						message: '请选择通知人',
						trigger: ['change', 'blur'],
					}]
				},
				pictureList: [],
				videoList: [],
				currentField: '',
				showFlag: false,
				actions: [],
				// 问题类别列表
				typeList: [],
				// 当前选择的问题类别id
				cateId: '',
				// 异常项列表
				abnormalList: [],
				// 通知人列表
				notifierList: [],
				param: {
					workCode: '', // 工单编码
					workScene: '', // 工单场景
					workProcedureCode: '', // 上报问题的工序id
					workProcedureType: '', //上报问题的工序类型 1:标准工序 2:中工序 3:工步
				}
			}
		},
		onLoad(options) {
			debugger
			const {
				workProcedureCode,
				workScene,
				workProcedureType
			} = options;
			// 提交问题需要的工单、工序（工序类型）、场景参数
			this.param.workProcedureCode = workProcedureCode;
			this.param.workScene = workScene;
			this.param.workProcedureType = workProcedureType;
			this.param.workCode = uni.getStorageSync("ims_workOrder").id;
		},
		mounted() {
			this.initSelectData()
		},
		methods: {
			initSelectData() {
				queryCategory().then(res => {
					if (res.success && res.data && Array.isArray(res.data.value)) {
						this.typeList = res.data.value.map(item => ({
							id: item.id,
							name: item.cateName
						}))
						const id = this.cateId || this.typeList[0].id
						queryAbnormal({
							cateId: id
						}).then(res => {
							if (res.success && res.data && Array.isArray(res.data.value)) {
								res.data.value.forEach(item => {
									item.id = item.cateId;
									item.name = item.abnormalName;
								});
								this.abnormalList = res.data.value || []
							} else {
								uni.$u.toast(res.errMsg || '暂无数据')
							}
						})
					} else {
						uni.$u.toast(res.errMsg || '暂无数据')
					}
				})
			},
			showSelect(flag, type) {
				this.currentField = type;
				if (type === 'cate') {
					this.actions = [...this.typeList]
				} else if (type === 'abnormal') {
					this.actions = [...this.abnormalList]
				} else if (type === 'notifier') {
					this.actions = [...this.notifierList]
				}
				this.showFlag = flag;
			},
			selectItem(item) {
				if (this.currentField === 'cate') {
					if (this.cateId === item.id) return;
					this.cateId = item.id;
					this.issueForm.abnormalName = '';
					this.issueForm.abnormalId = '';
					this.issueForm.notifierName = '';
					this.issueForm.notifierId = '';
					this.initSelectData()
				} else if (this.currentField === 'abnormal') {
					this.issueForm.notifierName = '';
					this.issueForm.notifierId = '';
					this.notifierList = this.abnormalList.filter(item => item.id === item.id)[0].responders
				}
				this.issueForm[`${this.currentField}Name`] = item.name;
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
				let uploadList = file.file;
				let uploadTask = [];
				for (let i = 0; i < uploadList.length; i++) {
					uploadTask.push(this.uploadFilePromise(uploadList[i].url));
				}
				Promise.all(uploadTask)
					.then(res => {
						let successList = res.filter(item => item.status === 0);
						if (successList.length < this.pictureList) {
							uni.showToast({
								title: '存在上传失败的图片',
								duration: 2000
							});
						}
						let uploadedList = successList.map(item => {
							return {
								url: `http://10.16.9.128:9000/${item.filePath}`,
								filePath: item.filePath,
								fileName: item.fileName
							}
						})
						this[`${type}List`].push(...uploadedList);
					}).catch((error) => {
						uni.$u.toast(error.errMsg)
					})
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
				this.$refs.issueForm.validate().then((res) => {
					const hb_dq_mes_user_info = uni.getStorageSync('hb_dq_mes_user_info');
					const pictureUrls = this.pictureList.map(item => item.url)
					const videoUrls = this.videoList.map(item => item.url)
					const param = {
						...this.param,
						...this.issueForm,
						reporterId: hb_dq_mes_user_info.username,
						pictureUrl: pictureUrls.join('|'),
						videoUrl: videoUrls.join('|')
					}
					addProcedureProblem(param).then(res => {
						if (res.success) {
							uni.$u.toast('上报问题成功')
							this.cancel()
						} else {
							uni.$u.toast(res.errMsg || '暂无数据')
						}
					})
					// this.back();
				})
			},
			deleteFile(event, type) {
				let index = event.index;
				this[`${type}List`].splice(index, 1);
			},
			// 判断是否图片是否超出限制
			isOverSize(size, type) {
				return size > MAX_SIZE[type].maxSize;
			},
			cancel() {
				this.pictureList = [];
				this.videoList = [];
				this.issueForm = {
					cateName: '',
					cateId: '',
					abnormalName: '',
					abnormalId: '',
					notifierName: '',
					notifierId: '',
					desc: ''
				}
				this.$emit('closePopup', false);
			},
			// 添加图片
			confirm() {
				if (!this.pictureList.length) {
					this.$emit('closePopup', false);
					return;
				}
				let {
					id,
					workId
				} = this.bomInfo;
				let params = {
					bomId: id,
					workId,
					pictureList: this.pictureList.map(item => {
						return {
							imgPath: item.filePath,
							imgName: item.fileName,
							imgType: this.imgType
						}
					})
				}
				bindPic(params)
					.then(res => {
						if (res.success) {
							uni.showToast({
								title: '操作成功',
								duration: 2000
							});
							this.$emit('closePopup', true);
						} else {
							uni.showToast({
								title: res.errMsg,
								duration: 2000
							});
						}
					}).catch((error) => {
						uni.$u.toast(error.errMsg)
					})
			},
			// 上传图片到服务器
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					uploadHttp.upload({
						token: getToken(),
						filePath: url
					}).then(response => {
						if (response.code === 200) {
							setTimeout(() => {
								return resolve({
									status: 0,
									...response.data
								})
							}, 150)
						} else {
							return resolve({
								status: 500,
								msg: '上传失败'
							});
						}
					}).catch((error) => {
						uni.$u.toast(error.errMsg)
					})
				})
			},
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

	/deep/.u-action-sheet__item-wrap {
		max-height: 200px;
		overflow-y: auto;
	}
</style>