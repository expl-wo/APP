<template>
	<view class="content">
		<view class="main">
			<view class="item">
				<view class="item-header">
					<view class="header-text" style="background-color: rgb(22,155,213)">
						<view class="header-text-item">鉴定内容：{{task.name}} </view>
					</view>
					<view style="margin-top: 10px;">
						<u-row>
							<u-col span="1.5">
								<view class="content_center">鉴定单号</view>
							</u-col>
							<u-col span="2.5">
								<view class="content_center">{{task.billNum}}</view>
							</u-col>
							<u-col span="1.5">
								<view class="content_center">设备编号</view>
							</u-col>
							<u-col span="2.5">
								<view class="content_center">{{task.eNumber}}</view>
							</u-col>
							<u-col span="1.5">
								<view class="content_center">设备名称</view>
							</u-col>
							<u-col span="2.5">
								<view class="content_center">{{task.eName}}</view>
							</u-col>
						</u-row>
						<uni-table border stripe>
<!-- 							<uni-tr>
								<uni-th>鉴定单号</uni-th>
								<uni-th>{{task.billNum}}</uni-th>
								<uni-th>设备编号</uni-th>
								<uni-th>{{task.eNumber}}</uni-th>
								<uni-th>设备名称</uni-th>
								<uni-th>{{task.eName}}</uni-th>
							</uni-tr> -->
							<uni-tr>
								<uni-th align="center">步骤</uni-th>
								<uni-th align="center">项目</uni-th>
								<uni-th align="center">检测方法</uni-th>
								<uni-th align="center">标准值</uni-th>
								<uni-th align="center">鉴定值</uni-th>
								<uni-th align="center">是否合格</uni-th>
								<uni-th align="center">异常信息</uni-th>
							</uni-tr>
							<uni-tr v-for="(item, index) in taskDetails" :key="item.id" ref="trItem">
								<uni-th style="height: auto" align="center">{{item.step}}</uni-th>
								<uni-th style="height: auto" align="center">{{item.project}}</uni-th>
								<uni-th style="height: auto" align="center">{{item.method}}</uni-th>
								<uni-th style="height: auto" align="center">{{item.standardValue}}</uni-th>
								<uni-th style="height: auto;" align="center">
									<textarea v-model="item.actualValue" :clearable="false" placeholder="请输入实际值"
										auto-height="true" style="width: 100%;text-align: center;" />
								</uni-th>
								<uni-th style="height: auto;width: 150px;" align="center">
									<radio-group @change="handleChange($event, item)" v-model="item.isError">
										<radio :value="'1'" :checked="item.isError == null || item.isError == 1" />
										<text>是</text>
										<radio :value="'2'" :checked="item.isError == 2" /><text>否</text>
									</radio-group>
								</uni-th>
								<uni-th style="height: auto" align="center">
									<textarea v-model="item.errorMsg" v-if="item.isError == 2" :clearable="false"
										placeholder="请输入异常信息" auto-height="true"
										style="width: 100%;text-align: center;" />
								</uni-th>
							</uni-tr>
						</uni-table>
					</view>

					<view>
						<view style="margin-top: 20px;">
							<view class="main-form">
								<view class="de-form" style="margin-right: 30px;">
									<view style="align-self: center;">鉴定责任人</view>
									<u-input v-model="checkData.personLiable" style="margin-left: 10px;min-width: 80px;"
										:disabled="true" placeholder="" height="40px" />
									<button size="mini" class="btn" type="primary" style="margin-left: 10px;"
										@click="scan('personLiable')">扫码</button>
								</view>
								<view class="de-form">
									<view style="align-self: center;">使用部门验收</view>
									<u-input v-model="checkData.userDepartment"
										style="margin-left: 10px;min-width: 80px;" :disabled="true" placeholder=""
										height="40px" />
									<button size="mini" type="primary" class="btn" style="margin-left: 10px;"
										@click="scan('userDepartment')">扫码</button>
								</view>
								<view class="de-form" style="margin-right: 30px;">
									<view style="align-self: center;">工艺部验收</view>
									<u-input v-model="checkData.technologyPerson"
										style="margin-left: 10px;min-width: 80px;" :disabled="true" placeholder=""
										height="40px" />
									<button size="mini" class="btn" style="margin-left: 10px;" type="primary"
										@click="scan('technologyPerson')">扫码</button>
								</view>
								<view class="de-form">
									<view style="align-self: center;">设备部验收</view>
									<u-input v-model="checkData.equipmentPerson"
										style="margin-left: 10px;min-width: 80px;" :disabled="true" placeholder=""
										height="40px" />
									<button size="mini" class="btn" style="margin-left: 10px;" type="primary"
										@click="scan('equipmentPerson')">扫码</button>
								</view>
							</view>
							<view class="main-form"
								style="padding-top: 25px; justify-content: center; flex-wrap: nowrap;">
								<view><button size="mini" class="btn" type="primary"
										@click="saveOrFinish(1)">保存</button></view>
								<view style="margin-left: 100px;"><button size="mini" @click="cancel()" class="btn"
										type="primary">取消</button></view>
								<view v-if="task.status == 2" style="margin-left: 100px;"><button size="mini"
										class="btn" type="primary" @click="saveOrFinish(3)">验收完成</button></view>
								<view v-else style="margin-left: 100px;"><button size="mini" class="btn" type="primary"
										@click="saveOrFinish(2)">鉴定完成</button></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		saveOrFinishTask,
		getTaskDetails
	} from '@/https/equip/equipIntegrityAppriase.js'
	import {
		getUserData
	} from '@/https/_public/qr_scan.js'
	export default {
		data() {
			return {
				task: null,
				taskDetails:[],
				checkData: {
					equipmentPerson: null, //设备部验收
					userDepartment: null, //使用部门验收
					technologyPerson: null, //工艺部验收
					personLiable: null //责任人
				},
			}
		},
		onLoad(e) {
			this.task = JSON.parse(e.deviceItem)
			console.log(this.task);
			getTaskDetails({
				taskId: this.task.id
			}).then(res => {
				console.log(2);
				if (res.err_code === 10000) {
					this.taskDetails = res.data
				} else {
					uni.showToast({
						title: res.err_msg,
						duration: 1000
					});
				}
			})
			this.initData()
			// this.task.details.forEach(item => {
			// 	if (item.pictures) {
			// 		item.pictures = item.pictures.split(",");
			// 	}
			// })
		},
		methods: {
			handleChange(param, index) {
				index.isError = param.value
			},
			preview(data) {
				uni.previewImage({
					current: 0,
					urls: data.pictures,
					indicator: 'number',
					loop: true
				});
			},
			scan(type) {
				let that = this;
				uni.scanCode({
					onlyFromCamera: true,
					success: function(res) {
						let sp = res.result.split("&");
						getUserData({
							code: sp[1]
						}).then(rp => {
							var data = rp.data
							that.task[type] = data.id
							if (type == 'personLiable') {
								that.task.personTime = new Date()
							}
							if (type == 'technologyPerson') {
								that.task.technologyTime = new Date()
							}
							if (type == 'userDepartment') {
								that.task.userDepartmentTime = new Date()
							}
							if (type == 'equipmentPerson') {
								that.task.equipmentTime = new Date()
							}
							that.checkData[type] = data.name
						})
					},
					fail: function(e) {
						console.log(e)
						console.log("falut")
					}
				})
			},
			saveOrFinish(status) {
				let flag = true;
				if (status == 2) {
					this.task.details.forEach(item => {
						if (item.isError == 2 && (item.errorMsg == null || item.errorMsg == '')) {
							uni.showToast({
								title: '请输入异常信息',
								duration: 1000
							});
							flag = false
							return;
						}
						if (item.actualValue == null || item.actualValue == '') {
							uni.showToast({
								title: '有项目未鉴定',
								duration: 1000
							});
							flag = false
							return;
						}
					})
				} else if (status == 3) {
					if (this.task.equipmentPerson == null || this.task.equipmentPerson == '') {
						uni.showToast({
							title: '设备部未验收',
							duration: 1000
						});
						return;
					} else if (this.task.userDepartment == null || this.task.userDepartment == '') {
						uni.showToast({
							title: '使用部门未验收',
							duration: 1000
						});
						return;
					} else if (this.task.technologyPerson == null || this.task.technologyPerson == '') {
						uni.showToast({
							title: '工艺部未验收',
							duration: 1000
						});
						return;
					} else if (this.task.personLiable == null || this.task.personLiable == '') {
						uni.showToast({
							title: '鉴定责任人未验收',
							duration: 1000
						});
						return;
					}
				}

				if (flag) {
					this.task.status = status
					this.task.details.forEach(item => {
						if (item.pictures != null) {
							item.pictures = item.pictures.toString();
						}
					})
					saveOrFinishTask({
						'task': this.task,
						'taskDeList': this.taskDetails
					}).then(res => {
						let title = null
						if (status == 1) title = '保存';
						else if (status == 2) title = '鉴定';
						else if (status == 3) title = '验收';
						if (res.err_code == 10000) {
							uni.showToast({
								icon: 'success',
								title: title + '成功',
								duration: 1000
							});
							uni.navigateBack()
						} else {
							uni.showToast({
								title: title + '失败',
								duration: 1000
							});
							this.task.details.forEach(item => {
								item.pictures = item.pictures.split(",");
							})
						}
					})
				}
			},
			cancel() {
				uni.navigateBack()
			},
			initData() {

				if (this.task.equipmentPerson != null) {
					this.checkData.equipmentPerson = this.task.equipmentPersonName
				}
				if (this.task.userDepartment != null) {
					this.checkData.userDepartment = this.task.userDepartmentName
				}
				if (this.task.technologyPerson != null) {
					this.checkData.technologyPerson = this.task.technologyPersonName
				}
				if (this.task.personLiable != null) {
					this.checkData.personLiable = this.task.personLiableName
				}
			}
		}
	}
</script>

<style lang="scss">
	.main {
		width: 90%;
		margin: 0 auto;
	}
	.content_center{
		padding: 5px;
		border: 1rpx solid #ebeef5;
		text-align: center;
	}

	.item {
		margin-top: 10rpx;
		background-color: white;
		border-radius: 5rpx;
		padding: 20rpx 10rpx 15rpx;
		width: 100%;
		position: relative;
	}

	.item-header {
		//display: flex;
		align-items: center;
	}

	.header-text {
		padding: 5rpx 8rpx;
		margin-left: 0;
		background-color: #0081ff;
		border-radius: 5rpx;
		border: 1rpx solid #a0cfff;
		font-size: 13rpx;
		display: flex;
		width: 100%;

		.header-text-item {
			margin-left: 8rpx;
			color: white;
		}
	}

	.main-form {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		padding: 20px;

		.de-form {
			margin-left: 30px;
			display: flex;
			min-width: 320px;
			width: 45%;
			height: 45px;
			margin-top: 10px;
		}
	}

	.btn {
		font-size: 13px;
		height: 40px;
	}

	/deep/.uni-th {
		height: auto;
	}

	/deep/ .uni-input-input,
	.uni-input-placeholder {
		font-size: 14px;
		min-height: 0;
	}
</style>