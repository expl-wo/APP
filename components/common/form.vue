<template>
	<view class="form">
		<view class="form-item">
			<u--form labelPosition="left" :model="formData" :rules="rules" ref="uForm">
				<u-form-item v-for="(item,index) in formList" :key="index" :label="item.operationName"
					prop="userInfo.sex" borderBottom @click="showSex = true" ref="item1" :ref="`item${index}`">
					<view class="execute">
						<view class='picker-tag' v-if="item.executionFrequency !== '3'">
							<text class="tip">执行频率:</text>
							<view class="time-select-box" v-if="item.executionFrequency === '0'">
								<text class="btn-link" @click="showActionSheet(item,index,'time')">请选择天</text>
								<text class="time-type">{{item.time}}</text>
								<text class="btn-link" @click="showActionSheet(item,index,'time')">请选择小时</text>
								<text class="time-type">{{item.time}}</text>
							</view>
							<view class="time-select-box" v-else-if="item.executionFrequency === '1'">
								<text class="btn-link" @click="showActionSheet(item,index,'time')">请选择小时</text>
								<text class="time-type">{{item.time}}</text>
							</view>
						</view>
					</view>
					<u--input v-model="formData.userInfo.sex" disabled disabledColor="#ffffff" placeholder="请选择性别"
						border="none"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
			</u--form>
			<u-button @click="submit">提交</u-button>
			<u-action-sheet :show="showSex" :actions="actions" title="请选择性别" description="如果选择保密会报错"
				@close="showSex = false" @select="sexSelect">
			</u-action-sheet>
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
				showSex: false,
				formData: {
					userInfo: {
						name: 'uView UI',
						sex: '',
					},
				},
				actions: [{
						name: '男',
					},
					{
						name: '女',
					},
					{
						name: '保密',
					},
				],
				rules: {
					'userInfo.name': {
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					},
					'userInfo.sex': {
						type: 'string',
						max: 1,
						required: true,
						message: '请选择男或女',
						trigger: ['blur', 'change']
					},
				},
				radio: '',
				switchVal: false
			}
		},


		methods: {
			sexSelect(e) {
				this.formData.userInfo.sex = e.name
				this.$refs.uForm.validateField('userInfo.sex')
			},
			submit() {
				this.$refs.uForm.validate().then(res => {
					uni.$u.toast('校验通过')
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			}
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.uForm.setRules(this.rules)
		},
	}
</script>

<style lang='scss' scoped>
	.form {
		height: calc(100% - 340px);
		overflow-y: auto;
		margin: 0 16rpx;
		background-color: #fff;
		border-radius: 10rpx;

		.form-item {
			.picker-tag {
				flex: 1;
				margin-left: 20rpx;

				.tip {
					margin-right: 10rpx;
					font-size: 12px;
				}

				.time-type {
					padding: 0 20rpx;
					color: #3a62d7;
				}

				.time-select-box {
					display: inline-block;

					.btn-link {
						color: #3a62d7;
					}
				}
			}

		}

		/deep/.u-form {
			.u-form-item__body__left {
				width: 120rpx !important;
			}
		}
	}
</style>