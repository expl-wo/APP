export default {
	data(){
		return {
			//页面传参
			params: {},
			dataList: [],
			//通用列表页面配置
			pageNum: 1,
			pageSize: 10,
			//总数
			total: 0,
			//是否还有更多数据
			hasMoreData: false,
			//是否现在加载中组件
			showLoadMore: false,
			//加载更多组件状态（加载中 没有更多  没有更多了 loadmore  loading  nomore）
			loadMoreStatus: this.$constants.loadmore,
			//是否显示无数据组件
			showNoData: false,
		
		}
	},
	
	//触发loadMore，要注意如果没有数据了，就要显示为没有更多了
	onReachBottom() {
		//还有更多数据时
		if (this.hasMoreData) {
			this.getMoreDataList()
		}
	},
	//触发下拉刷新功能
	onPullDownRefresh() {
		this.pageNum = 1;
		this.getDataList();
	},
	methods: {
		getMoreDataList(){
			console.error('混入pageListMixins需要实现getMoreDataList方法')
		},
		getDataList(){
			console.error('混入pageListMixins需要实现getDataList方法')
		},
		setStatus(total, endRow) {
			/* 	//是否还有更多数据
				hasMoreData: false,
				//是否现在加载中组件
				showLoadMore: false,
				//加载更多组件状态（加载中 没有更多  没有更多了 loadmore  loading  nomore）
				loadMoreStatus: 'loadmore',
				//是否显示无数据组件
				showNoData: false */
			if (total === 0) {
				this.hasMoreData = false;
				this.showLoadMore = false;
				this.showNoData = true;
				this.loadMoreStatus = this.$constants.nomore;
			}else if(total <= endRow){
				this.hasMoreData = false;
				this.showLoadMore = true;
				this.showNoData = false;
				this.loadMoreStatus = this.$constants.nomore;
			} else {
				this.hasMoreData = true;
				this.showLoadMore = true;
				this.showNoData = false;
				this.loadMoreStatus = this.$constants.loadmore;
			}
		},
	}
}