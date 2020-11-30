<template>
	<view>
		<view class="search-box">
			<uni-search-bar @confirm="search" @input="input" :radius="100" cancelButton="none" clearButton="auto"></uni-search-bar>
		</view>
	
		<!-- 搜索建议 -->
		<view class="sugg-list" v-if="searchReasults.length !== 0">
			<view class="sugg-item" v-for="(item, index) in searchReasults" :key="index" @click="gotoGoodsDetail(item)">
				<view class="goodsName">{{ item.goods_name }}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="16" @click="clear"></uni-icons>
			</view>
			
			<!-- 历史列表 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item, index) in historys" :key="index" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>item

<script>
	export default {
		data() {
			return {
				timer: null,
				kw: '',
				searchReasults: [], // 搜索建议
				historyList: [] // 搜索历史
			};
		},
		
		onLoad() {
			// 读取缓存中的历史记录
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		
		methods: {
			input (e) {
			// 清除延时器
			clearTimeout(this.timer)
				
			this.timer = setTimeout(() => {
					this.kw = e.value
					this.getSearchReasults()
				}, 500)
			},
			
			// 获取搜索联想
			async getSearchReasults () {
				// 判断是否输入
				if (this.kw === '') {
					this.searchReasults = []
					return
				}
				const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', {query: this.kw})
				
				if (res.meta.status !== 200) {
					return uni.$showMsg()
				}
				
				this.searchReasults = res.message
				this.saveSearchHistory()
			},
			
			// 跳转到商品详情页
			gotoGoodsDetail (item) {
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			},
			
			saveSearchHistory () {
				// this.historyList.push(this.kw)
				// 将 Array 数组转换为 set对象
				const set = new Set(this.historyList)
				// 调用set 方法的 delete方法, 移出对应的元素
				set.delete(this.kw)
				// 调用 set 方法的 add 方法, 添加对应的元素
				set.add(this.kw)
				// 将 set 对象转换为 Array 数组
				this.historyList = Array.from(set)
				
				// 将搜索历史 缓存
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			},
			
			// 清理历史记录
			clear () {
				this.historyList = []
				uni.setStorageSync('kw', '[]')
			},
			
			// 跳转到商品列表
			gotoGoodsList(kw) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' + kw
				})
			}
		},
		
		computed:{
			historys () {
				return [...this.historyList].reverse()
			}
		}
	}
</script>

<style lang="scss">
.search-box {
	position: sticky;
	top: 0;
	z-index: 999;
}


.sugg-list {
	padding: 0 5px;
	
	.sugg-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 12px;
		padding: 13px 0;
		border-bottom: 1px solid #efefef;
		.goodsName {
			// 不允许换行
			white-space: nowrap; 
			// 超出部分隐藏
			overflow: hidden;
			// 超出部分用 ... 代替
			text-overflow: ellipsis;
		}
	}
}

.history-box {
	padding: 0 5px;
	.history-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 13px;
		height: 40px;
		border-bottom: 1px solid #efefef;
	}
	.history-list {
		display: flex;
		flex-wrap: wrap;
		.uni-tag {
			margin-right: 5px;
			margin-top: 5px;
		}
	}
}
</style>
