<template>
	<view>
		<!-- 使用自定义的搜索组件 -->
		<my-search @myClick='clickHander'></my-search>
		<!-- 滑动 -->
		<view class="scroll-view-container">
			<!-- 左侧 -->
			<scroll-view scroll-y="true" :style="{height: wh + 'px'}" class="left-view">
				<block v-for="(item, index) in cateList" :key="index" >
					<view :class="['left-view-item', {'active': active === index}]" @click="activeChange(index)">{{ item.cat_name }}</view>
				</block>
			</scroll-view>
			<!-- 右侧 -->
			<scroll-view scroll-y="true" :scroll-top="scrollTop" :style="{height: wh + 'px'}" class="right-view">
				<!-- 二级分类 -->
				<view v-for="(item2, i2) in cateLevel2" :key="i2" class="cate-lv2">
					<view class="cate-lv2-item">/ {{ item2.cat_name }} /</view>
					<!-- 三级分类 -->
					<view class="cate-lv3-list">
						<view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="goToGoodsList(item3)">
							<!-- 图片 -->
							<image :src="item3.cat_icon"></image>
							<!-- 文字 -->
							<text>{{ item3.cat_name }}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 屏幕的可用高度
				wh: 0,
				// 分类列表
				cateList: [],
				active: 0,
				cateLevel2: [],
				scrollTop: 0
			};
		},
		onLoad() {
			// 获取系统信息
			const sysInfo = uni.getSystemInfoSync()
			this.wh = sysInfo.windowHeight - 50
			
			// 获取分类列表数据
			this.getCateList()
		},
		methods:{
			// 获取分类列表数据
			async getCateList () {
			const { data: res } = await uni.$http.get('/api/public/v1/categories')
			if(res.meta.status !== 200) {
				return uni.$showMsg()
			}
			// 获取 2级分类数据
			this.cateLevel2 = res.message[0].children
			this.cateList = res.message
			},
			
			// 修改 active
			activeChange (index) {
				this.active = index
				// 重新获取二级分类数据
				this.cateLevel2 = this.cateList[index].children
				
				this.scrollTop = this.scrollTop === 0 ? 1 : 0
			},
			
			// 点击三级分类进行跳转
			goToGoodsList (item3) {
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?cid=' + item3.cat_id 
				})
			},
			
			clickHander () {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
.scroll-view-container {
	display: flex;
	.left-view {
		width: 120px;
		
		.left-view-item {
			background-color: #F7F7F7;
			font-size: 12px;
			line-height: 60px;
			text-align: center;
			
			&.active {
				background-color: #FFFFFF;
				position: relative;
				
				&::before {
					content: ' ';
					display: block;
					width: 3px;
					height: 30px;
					background-color: #C00000;
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
	}
}

.cate-lv2 {
	.cate-lv2-item {
		font-size: 12px;
		font-weight: 700;
		text-align: center;
		padding: 15px 0;
	}
	
	.cate-lv3-list {
		display: flex;
		flex-wrap: wrap;
		.cate-lv3-item {
			width: 33.33%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-bottom: 10px;
			
			image {
				width: 60px;
				height: 60px;
			}
			
			text {
				font-size: 12px;
			}
		}
	}
}

</style>
