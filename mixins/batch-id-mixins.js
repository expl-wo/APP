import publicHttp from '@/https/_public/_public.js'
import {
	getUserLoginInfo
} from '@/utils/storage.js'

export default {
	methods: {
		async initBatchId(){
			return new Promise((resolve, reject)=>{
				if (this.$utilFunction.getBatchId() === '') {
					publicHttp.insertBatch({
						bizType: this.$utilFunction.getBizType(),
					}).then(response => {
						if (response.status === this.$constants.status.success) {
							this.$utilFunction.saveBatchId(response.data.id);
						}
						resolve();
					})
				}
				resolve();
			})
			
		},
		async initBatchIdAlways(){
			return new Promise((resolve, reject)=>{
					publicHttp.insertBatch({
						bizType: this.$utilFunction.getBizType(),
					}).then(response => {
						if (response.status === this.$constants.status.success) {
							this.$utilFunction.saveBatchId(response.data.id);
						}
						resolve();
					})
			})
		}
	}
}
