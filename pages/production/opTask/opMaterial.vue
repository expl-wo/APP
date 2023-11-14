<template>
	<view class="content">
		<view></view>
		<view>
			<view class="headerp">
				<!-- <view>
					
				</view>
				扫码添加： -->
				<view class="item">
					<u-input class="u-input" placeholder="请扫码" 
						:focus="isFocus" border="surround" v-model="scanCode"
						@confirm="getInfoByScanCode()"></u-input>
				</view>
				<view class="item">
					<u-button @click="getInfoByScanCode()" type="success">确定</u-button>
				</view>
				<view class="item">
					<u-button @click="showAdd()" type="primary">关键部件添加</u-button>
				</view>
			</view>
			<view class="uni-container">
				<uni-table border stripe>
					<uni-tr>
						<uni-th align="center">序号</uni-th>
						<uni-th align="center">序列号</uni-th>
						<uni-th align="center">物料名称</uni-th>
						<uni-th align="center">类型</uni-th>
						<uni-th align="center">编号</uni-th>
						<uni-th align="center">单位</uni-th>
						<uni-th align="center">数量</uni-th>
						<uni-th align="center">操作人</uni-th>
						<uni-th align="center">添加时间</uni-th>
						<uni-th align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item,index) in dataList" :key="index">
						<uni-td align="center">{{index+1}}</uni-td>
						<uni-td align="center">{{item.serialNum}}</uni-td>
						<uni-td align="center">{{item.materialName}}</uni-td>
						<uni-td align="center">{{item.materialTypeName}}</uni-td>
						<uni-td align="center">{{item.materialCode}}</uni-td>
						<uni-td align="center">{{item.unit}}</uni-td>
						<uni-td align="center">{{item.useCount}}</uni-td>
						<uni-td align="center">{{item.operatorName}}</uni-td>
						<uni-td align="center">{{item.operationDate}}</uni-td>
						<uni-td align="center">
							<u-button @click="onDelete(item)" type="error">删除</u-button>
						</uni-td>
					</uni-tr>
				</uni-table>
			</view>

		</view>
		<u-popup :round="10" :show="showForm" @close="close()" mode="center" width="50%" height="50%">
			<view class="popup">
				<u--form :model="model" ref="uForm">
					<u-form-item label="物料名称">
						<u--input :disabled="isEdit" v-model="model.materialName"></u--input>
					</u-form-item>
					<u-form-item label="相别" v-if="model.materialType == 1">
						<u--input :disabled="isEdit" v-model="model.phaseName"></u--input>
					</u-form-item>
					<u-form-item label="物料编码">
						<u--input :disabled="isEdit" v-model="model.materialCode"></u--input>
					</u-form-item>
					<u-form-item label="物料单位">
						<u--input :disabled="isEdit" v-model="model.unit"></u--input>
					</u-form-item>
					<u-form-item label="使用数量">
						<u--input type="number" v-model="model.useCount"></u--input>
					</u-form-item>
					<u-form-item>
						<u-button shape="circle" style="margin-top: 10px;margin-left: 10px;margin-right: 10px;"
							type="primary" @click="close()">关闭</u-button>
						<u-button shape="circle" style="margin-top: 10px;margin-left: 10px;margin-right: 10px;"
							type="success" @click="addOpMaterial()">确定</u-button>
					</u-form-item>
				</u--form>
			</view>
		</u-popup>
		<u-modal :show="showModal" :showCancelButton="true" width="300" :content="content" @cancel="showModal = false"
			@confirm="onOther()">
		</u-modal>
	</view>
</template>

<script>
	import {
		getOpKeyMaterial,
		addOrEditOpKeyMaterial,
		delOpKeyMaterial,
		addMaterial
	} from "@/https/production/proudction.js"
	export default {
		data() {
			return {
				dataList: [],
				scanCode: '',
				model: {
					materialName: '',
					materialCode: '',
					unit: '',
					useCount: 1,
				},
				content: '',
				showModal: false,
				showForm: false,
				isEdit: false,
				isFocus:false,
				data: {},
			}
		},
		methods: {
			onQuery() {
				getOpKeyMaterial({
					opPlanId: this.data.opPlanId
				}).then(res => {
					if (res.err_code != 10000) {
						uni.showToast({
							icon: 'error',
							title: res.err_msg,
							duration: 1000
						});
					} else {
						this.dataList = res.data;
					}
				})
				this.isFocus = true;
			},
			showAdd() {
				this.model = {
					materialName: '',
					materialCode: '',
					opPlanId: this.data.opPlanId,
					unit: '',
					useCount: 1,
				}
				this.showForm = true
			},
			showEdit(param) {
				this.showForm = true
				this.model = {
					materialName: param.materialName,
					materialCode: param.materialCode,
					materialTypeName: param.materialTypeName,
					materialType: param.materialType,
					phaseName: param.phaseName,
					opPlanId: this.data.opPlanId,
					unit: param.unit,
					useCount: 1,
				}
				this.isEdit = true
			},
			close() {
				this.showForm = false
			},
			getInfoByScanCode() {
				if (this.scanCode == null || this.scanCode == '' || this.scanCode == undefined) {
					uni.showToast({
						icon: 'error',
						title: "扫码内容为空",
						duration: 1000
					});
				} else {
					const opPlanId = this.data.opPlanId
					addMaterial({
						opPlanId: opPlanId,
						contentStr: this.scanCode
					}).then(res => {
						console.log("res:", res)
						if (res.err_code == 10000 && res.data != "非正常物料" && res.data) {
							this.showEdit(res.data)
						} else if (res.err_code == 10000) {
							this.content = '非设计用料，是否继续保存?'
							this.showModal = true
						} else {
							uni.showToast({
								icon: 'error',
								title: res.err_msg,
								duration: 1000
							});
						}
					})
				}
			},
			addOpMaterial() {
				addOrEditOpKeyMaterial(this.model).then(res => {
					if (res.err_code == 10000) {
						uni.showToast({
							icon: 'succes',
							title: "添加成功",
							duration: 1000
						});
						this.showForm = false;
						this.isEdit = false
						this.onQuery();
					} else {
						uni.showToast({
							icon: 'error',
							title: res.err_msg,
							duration: 1000
						});
					}
				})
			},
			onDelete(row) {
				delOpKeyMaterial({
					id: row.id
				}).then(res => {
					if (res.err_code == 10000) {
						uni.showToast({
							icon: 'succes',
							title: "删除成功",
							duration: 1000
						});
						this.onQuery();
					} else {
						uni.showToast({
							icon: 'error',
							title: res.err_msg,
							duration: 1000
						});
					}
				})
			},
			onOther() {
				this.showModal = false
				this.model = {
					materialCode: this.scanCode,
					materialTypeName: '其他',
					materialType: 0,
					opPlanId: this.data.opPlanId,
					useCount: 1,
				}
				this.showForm = true;
			}

		},
		onLoad(e) {
			this.data = JSON.parse(decodeURIComponent(e.item))
			this.onQuery()
		}
	}
</script>

<style lang="scss" scoped>
	.headerp {
		border-bottom: 5px solid #aaa;
		position: relative;
		display: inline-flex;
		margin-bottom: 0px;
		align-items: center;
		justify-content: flex-start;
		width: 100%;
	}

	.u-input {
		width: 100rpx;
		float: right;
		margin-right: 0;
	}

	.item {
		margin: 5px;
	}

	.popup {
		width: 500px;
		padding: 10%;
	}
</style>