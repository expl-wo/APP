<template>
	<view class="user-info-root" :style="{width: width ? width + 'px' : '100%', color: fontColor}">
		<view class="img">
			<u-image shape="circle" width="60px" height="60px" src="/static/img/user.png">
				<template v-slot:loading>
					<u-loading-icon color="red"></u-loading-icon>
				</template>
				<view slot="error" style="font-size: 6rpx;">加载失败</view>
			</u-image>
		</view>
		<view class="info">
			<view class="user-name">
				<text v-if="isShowHello">HELLO,</text>
				<text>{{ userInfo.name || "--" }}</text>
			</view>
			<view class="department">
				<text> {{ currentRole.roleDeptName || "--" }} </text>
			</view>
			<slot />
		</view>
	</view>
</template>

<script>
	import {
		getCurrRole,
		getUserInfo
	} from '@/utils/auth.js'
	export default {
		name: 'UserInfo',
		props: {
			width: {
				type: Number,
			},
			// 是否展示欢迎语
			isShowHello: {
				type: Boolean,
				default: true,
			},
			// 字体颜色，默认白色
			fontColor: {
				type: String,
				default: '#fff',
			}
		},
		data() {
			return {
				userInfo: getUserInfo(),
				currentRole: getCurrRole()
			}
		},
	}
</script>

<style lang="less" scoped>
	.user-info-root {
		display: flex;
		width: 100%;
		box-sizing: border-box;

		.img {
			width: 60px;
			height: 60px;
			margin-right: 10px;
		}

		.info {
			flex: 1;
			text-align: left;

			.user-name {
				margin-bottom: 4px;
				font-size: 20px;
			}
		}
	}
</style>