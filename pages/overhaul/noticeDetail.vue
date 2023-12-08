<template>
	<view class="full-content">
		<view>
			<u--text class="h24" color="#8f9ca2" text="通知类型:" />
			<u--text class="h24" :text="messageTypeMap[noticeInfo.noticeType] || '--'" />
		</view>
		<view>
			<u--text class="h24" color="#8f9ca2" text="通知接收时间:" />
			<u--text class="h24" :text="noticeInfo.createTime || '--'" />
		</view>
		<view>
			<u--text class="h24" color="#8f9ca2" text="通知内容:" />
			<u--text class="h24" :text="noticeInfo.noticeContent || '--'" />
		</view>
	</view>
</template>

<script>
	import {
		setStatus
	} from '@/https/overhaul/clockIn';
	import { MESSAGE_TYPE } from '@/utils/constants-custom';
	export default {
		data() {
			return {
				noticeInfo: null,
				messageTypeMap: Object.freeze(MESSAGE_TYPE),
			}
		},
		mounted() {
			this.noticeInfo = uni.getStorageSync('ims_notice');
			if (!this.noticeInfo.noticeStatus) {
				let params = {
					idList: [this.noticeInfo.id],
					noticeStatus: 1
				}
				setStatus(params)
					.then(res => {
						if (res.success) {
						console.log('----通知置为已读');
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.full-content {
		width: 100%;
		height: 100%;
		padding: 0 20px;
		overflow-y: auto;
		.h24 {
			height: 24px;
			line-height: 24px;
		}
	}
</style>