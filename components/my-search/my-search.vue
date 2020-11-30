<template>
	<view class="search-container" :style="{'background-color': bgColor}" @click="btnClick">
		<view class="search-box" :style="{'border-radius': radius + 'px'}">
			<!-- 使用 uni-ui 提供的图标组件 -->
			 <uni-icons type="search" size="17"></uni-icons>
			 <text class="placeholder">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			bgColor: {
				type: String,
				default: '#C00000'
			},
			radius: {
				type: Number,
				default: 18
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			btnClick () {
				this.$emit('myClick')
			}
		}
	}
</script>

<style lang="scss">
.search-container {
	height: 50px;
	background-color: #C00000;
	display: flex;
	align-items: center;
	padding: 0 10px;
	.search-box {
		height: 36px;
		width: 100%;
		background-color: #FFFFFF;
		border-radius: 18px;
		display: flex;
		justify-content: center;
		align-items: center;
		.placeholder {
			font-size: 15px;
			margin-left: 5px;
		}
	}
}
</style>
