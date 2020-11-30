<template>
	<view>
		<!-- 使用搜索组件 -->
		<view class="search-box">
			<my-search @myClick="gotoSearch"></my-search>
		</view>
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<!-- 循环渲染 -->
			<swiper-item v-for="(item, i) in swiperList" :key="i">
				<navigator class="swiperItem" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		
		<!-- 分类 -->
		<view class="nav-list">
			<view v-for="(item,index) in navList" :key="index" class="nav-item" @click="navClickHander(item)">
				<image :src="item.image_src"></image>
			</view>
		</view>
		
		<!-- 楼层 -->
		<view class="floor-list">
			<!-- 标题 -->
			<view class="floor-item" v-for="(item, i) in floorList" :key="i">
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层图片 -->
				<view class="floor-img-box">
					<!-- 左侧盒子 -->
					<navigator class="left-img" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
					</navigator>
					<!-- 右侧盒子 -->
					<view class="right-img">
						<navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" :url="item2.url">
							<block v-if="i2 !== 0">
								<image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
							</block>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 存放轮播图的数据
				swiperList: [],
				// 分类导航数据
				navList: [],
				// 楼层数据
				floorList: []
			};
		},
		// 生命周期函数
		onLoad() {
			this.getSwiper()
			this.getNavList()
			this.getFloorList()
		},
		
		methods:{
			// 获取轮播图数据列表
			async getSwiper () {
				const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata')
				// 当数据请求失败的时候
				if (res.meta.status !== 200) {
					return uni.$showMsg()
				}
				
				// 请求成功的时候
				this.swiperList = res.message
			},
			
			// 获取分类数据列表
		async	getNavList () {
			const { data: res } = await uni.$http.get('/api/public/v1/home/catitems')
			// 判断是否请求成功
			if (res.meta.status !== 200) {
					return uni.$showMsg()
				}
				// 请求成功
				this.navList = res.message
			},
			
		// 点击分类导航跳转
		navClickHander (item) {
			if (item.name === '分类') {
				uni.switchTab({
					url:'/pages/cate/cate'
				})
			}
		},
		
		// 获取楼层数据
		async getFloorList () {
			const { data: res } = await uni.$http.get('/api/public/v1/home/floordata')
			if (res.meta.status !== 200) {
				return uni.$showMsg()
			}
			
			// 修改数据
			res.message.forEach(floor => {
				floor.product_list.forEach(item => {
					item.url = '/subpkg/goods_list/goods_list?' + item.navigator_url.split('?')[1]
				})
			})
			
			// 请求成功
			this.floorList = res.message
		},
		
		// 跳转到搜索页面
		gotoSearch (){
			uni.navigateTo({
				url:'/subpkg/search/search'
			})
		}
	}
}
</script>

<style lang="scss">
swiper {
	height: 330rpx;
	.swiperItem, image {
		width: 100%;
		height: 100%;
	}
}
.nav-list {
	display: flex;
	justify-content: space-around;
	margin: 15px 0;
	image {
		width: 128rpx;
		height: 140rpx;
	}
}
.floor-title {
	display: flex;
	height: 60rpx;
	width: 100%;
}
.floor-img-box {
	display: flex;
	padding-left: 10rpx;
	.right-img {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
}

.search-box {
	position: sticky;
	top: 0;
	z-index: 999;
}
</style>
