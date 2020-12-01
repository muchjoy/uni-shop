<template>
	<view v-if="goods_info.goods_name" class="goods-deatil">
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item, index) in goods_info.pics" :key="index">
				<image :src="item.pics_big" @click="preview(index)"></image>
			</swiper-item>
		</swiper>
		
		<!-- 商品信息 -->
		<view class="goods-info-box">
			<!-- 商品价格 -->
			<view class="price">¥ {{goods_info.goods_price}}</view>
			<!-- 商品信息主体和收藏 -->
			<view class="goods-boby-info">
				<view class="goods-name">{{ goods_info.goods_name }}</view>
				<view class="favi">
					<uni-icons type="star" size="18"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 快递 -->
			<view class="express">快递: 免运费</view>
		</view>
		
		<!-- 商品详情 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		
		<!-- 商品导航 -->
		<view class="goods-nav">
			<uni-goods-nav :fill="true"  :options="options" :buttonGroup="buttonGroup"  @click="onClick" @buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goods_info: {},
				goods_id: null,
				options: [{
							icon: 'shop',
							text: '店铺',
							infoBackgroundColor:'#007aff',
							infoColor:"red"
					}, {
							icon: 'cart',
							text: '购物车',
							info: 2
					}],
					buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
					]
			};
		},
		
		onLoad(options) {
			this.goods_id = options.goods_id
			this.getGoodsInfo(this.goods_id)
		},
		
		methods:{
			// 获取商品详情
			async getGoodsInfo (goods_id) {
				const { data: res } = await uni.$http.get('/api/public/v1/goods/detail', { goods_id })
				
				if (res.meta.status !== 200) return
				
				// 给富文本中的图片添加样式 去除底部空白间隙
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img/g, '<img style="display:block"').replace(/webp/g, 'jpg')
				
				this.goods_info = res.message
			},
			
			// 预览图片
			preview (index) {
				uni.previewImage({
					current: index,
					urls: this.goods_info.pics.map(x => x.pics_big)
				})
			},
			
			// 点击购物车
			onClick (e) {
				console.log(e)
				if (e.content.text === '购物车') {
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
swiper {
	height: 750rpx;
	
	image {
		width: 100%;
		height: 100%;
	}
}

.goods-info-box {
	padding: 10px;
	padding-right: 0;
	.price {
		font-size: 18px;
		color: #C00000;
		margin: 10px 0;
	}
	
	.goods-boby-info {
		display: flex;
		justify-content: space-between;
		.goods-name {
			font-size: 13px;
			margin-right: 10px;
		}
		.favi {
			width: 120px;
			font-size: 12px;
			color: gray;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border-left: 1px solid #efefef;
		}
	}
	
	.express {
		font-size: 12px;
		color: gray;
		margin: 10px 0;
	}
}

.goods-nav {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
}
.goods-deatil {
	padding-bottom: 50px;
}
</style>
