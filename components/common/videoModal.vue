<template>
	<div class="video-modal-root">
		<view class="modal-content" v-if='isShow' :style="{width:width}">
			<view class="modal-head">
				<text class="title" @click='isShow = false'>视频弹窗</text>
			</view>
			<u--form
				labelPosition="left"
				ref="uForm"
					>
					<u-form-item
							label="性别"
							prop="userInfo.sex"
							borderBottom
							ref="item1"
					>
						<web-view :webview-styles="webviewStyles" src="https://www.baidu.com" :fullscreen='false'></web-view>
					</u-form-item>
			</u--form>
			<u-button type="primary" text="确定" @click='confirm' class="btn"></u-button>
		</view>
		<view class="mask" v-if='isShow' @click="handleClickMask">
		</view>
	</div>
</template>
<script>
	export default {
		props:{
			showModal:{
				type:Boolean,
				default:false
			},
			// 是否允许点击遮罩关闭Modal
			closeOnClickOverlay:{
				type:Boolean,
				default:false
			},
			width:{
				type:String,
				default:"100%"
			}
		},
		computed:{
			isShow:{
				get(){
					return this.showModal
				},
				set(val){
				}
			}
		},
		data() {
			return {
				webviewStyles:{
					// top:50,
					width:500,
					height:200
				},
			}
		},
		methods:{
			confirm(){
				this.$emit('confirm')
			},
			handleClickMask(){
				if(this.closeOnClickOverlay){
					this.$emit('close')
				}else{
					return 
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	.video-modal-root{
		.modal-content{
			position: absolute;
			left:0;
			right: 0;
			top:100px;
			margin:auto;
			z-index:2;
			width: 90%;
			background-color: #fff;
			border-radius: 10px;
			text-align: center;
			.modal-head{
				padding: 10px;
				.title{
					font-size: 20px;
					color: #000;
				}
			}
			.btn{
				width: 80%;
				margin: 10px auto;
			}
		}
		.mask{
			position: absolute;
			top:0;
			left:0;
			width: 100%;
			height:100%;
			background-color:rgba(0,0,0,0.5);
			z-index:1
		}
	}
</style>