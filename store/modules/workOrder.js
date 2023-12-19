import Vue from 'vue'
import {
	getWorkOrderDetailById
} from "@/https/staging/index.js";
let workOrder = {
	namespaced: true,
	state: {
		// 工单详情信息
		workOrderDetailInfo: {},
		activeTab: ''
	},
	mutations: {
		updateWorkOrderDetail(state, workOrderDetailInfo) {
			state.workOrderDetailInfo = workOrderDetailInfo
			console.log(state, 'updateWorkOrderDetail````````````')
		},
		updateActiveTab(state, activeTab) {
			state.activeTab = activeTab;
		}
	},
	actions: {
		/**
		 * @method getDetailInfoById 根据id获取详情
		 **/
		getWorkOrderDetailInfo({
			commit
		}, {
			id
		}) {
			getWorkOrderDetailById(id).then(res => {
				if (res.data) {
					const projectInfo = res.data
					const fileList = []
					// 文件列表
					const attachmentNames = res.data.attachmentName && res.data.attachmentName
						.split('|');
					const attachmentUrls = res.data.attachmentUrl && res.data.attachmentUrl.split(
						"|")
					attachmentUrls && attachmentNames && attachmentNames.length && attachmentUrls.length &&
						attachmentNames.forEach((
							item, index) => {
							fileList.push({
								name: item,
								url: attachmentUrls[index]
							})
						})
					projectInfo.fileList = fileList
					commit("updateWorkOrderDetail", projectInfo)
					uni.setStorageSync('ims_workOrder', projectInfo);
				}
			})
		}
	}
}
export default workOrder