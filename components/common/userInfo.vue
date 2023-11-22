<template>
	<!-- 用户信息 -->
	<view class="user-info-root" :style="{
      width: width ? width + 'px' : '100%',
      color: fontColor,
    }">
		<view class="img">
			<van-image round width="60px" height="60px" :src="userInfo.imgUrl">
				<template v-slot:loading>
					<van-loading type="spinner" size="20" />
				</template>
				<template v-slot:error>加载失败</template>
			</van-image>
		</view>
		<view class="info">
			<view class="user-name">
				<text v-if="isShowHello">HELLO,</text>
				<text>{{ userInfo.name || "--" }}</text>
			</view>
			<view class="department">
				<text> {{ userInfo.department || "--" }} </text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 用户信息
			userInfo: {
				type: Object,
				default: () => ({
					name: "张晓丽",
					department: "流程与信息化管理部",
					imgUrl: "XXX",
				}),
			},
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
				default: "#fff",
			},
		},
	};
</script>

<style scoped lang="less">
	.user-info-root {
		display: flex;
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