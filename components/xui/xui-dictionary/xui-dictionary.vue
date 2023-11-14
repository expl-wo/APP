<template>
	<span>{{value}}</span>
</template>
<script>
	import {
		transformDictDetail
	} from './index'
	export default {
		name: 'xuiDictionary',
		props: {
			dictCode: [String, Number],
			code: [String, Number],
			nullToDefault: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				value: ''
			}
		},
		watch: {
			code(val){
				this.tranformContent();
			}
		},
		mounted() {
			this.tranformContent();
		},
		methods: {
			async tranformContent() {
				let value = await transformDictDetail(this.dictCode, this.code);
				if (this.nullToDefault && value === '') {
					this.value = this.code;
				} else {
					this.value = value;
				}
			}
		}
	}
</script>
