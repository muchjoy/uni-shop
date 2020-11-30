<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods, index) in goodsList" :key="index" @click="gotoGoodsDetail(goods)">
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				queryObj: {
					query: '', 
					cid: '', // 商品 id
					pagenum: 1,
					pagesize: 10
				},
				
				goodsList: [], // 商品列表数据
				
				total: 0, // 总数量
				isLoading: false
			};
		},
		
		onLoad(options) {
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			
			this.getGoodsList()
		},
		
		methods:{
			// 获取商品列表数据
			async getGoodsList (cb) {
				
				this.isLoading = true
				
				const {data: res} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				// 请求完成后 关闭节流阀
				this.isLoading = false
				
				cb && cb()
				
				if (res.meta.status !== 200) return uni.$showMsg()
				
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
			},
			
			// 跳转到商品详情页面
			gotoGoodsDetail (item) {
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			}
		},
		
		// 上拉触底
		onReachBottom () {
			// 判断是否还有下一页数据
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕!')
			if (this.isLoading) return
			
			this.queryObj.pagenum += 1
			
			this.getGoodsList()
		},
		
		// 下拉刷新事件
		onPullDownRefresh () {
			// 初始化数据
			this.queryObj.pagenum = 1
			this.goodsList = []
			this.total = 0
			
			this.getGoodsList(() => { uni.stopPullDownRefresh() })
		}
	}
</script>

<style lang="scss">

</style>
