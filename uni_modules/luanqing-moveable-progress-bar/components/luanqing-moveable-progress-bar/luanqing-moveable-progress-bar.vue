<template>
	<view>
		<view class="slider-container" :style="'width:'+(slideBarWidth)+'px'">
			<movable-area class="sliderBar" :style="'width:'+slideBarWidth+'px;'">
				<!-- 蓝色背景条 -->
				<view class="gone" :style="{width: x +'px'}"></view>

				<movable-view class="slider" direction="horizontal" :x="x" @change="onChange">
					<text>{{ score }}</text>
				</movable-view>
			</movable-area>

			<!-- 灰色背景条 -->
			<view :style="{width: (minScore / maxScore) * 100 +'%'}"></view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			max: {
				type: Number,
				default: 100
			},
			min: {
				type: Number,
				default: 0
			},
			slideBarWidth: {
				type: Number,
				default: 360,
			}
		},
		data() {
			return {
				minScore: this.min ? this.min : 0,
				maxScore: this.max ? this.max : 100,
				score: 0,
				x: 0,
				y: 0,
			};
		},
		methods: {
			setDefaultProgress(progress) {
				let barWidth = this.$props.slideBarWidth || 0;
				this.x = barWidth * (progress / 100.0);
				this.score = progress;
			},
			onChange: function(e) {
				// 手动拖动才生效 
				if (e.detail.source === 'touch') {
					this.x = e.detail.x;
					let barWidth = this.$props.slideBarWidth || 0;
					let num = parseInt(this.x / barWidth * this.maxScore);

					num = num > this.maxScore ? this.maxScore : num;
					num = num < this.minScore ? this.minScore : num;
					this.score = num;

					// 100 368.2 347 100
					// 57 200.2 347 100
					console.error("拖拽条：", num, this.x, barWidth, this.maxScore)
					this.$emit('change', num);
				}
			}
		}
	}
</script>

<style lang="scss">
	// 取用开发者项目的中主色调  uni.scss
	// $uni-color-primary: #E00300;

	.slider-container {
		display: flex;
		height: 32rpx;
		position: relative;
		margin: 0 auto;

		&::before {
			content: '';
			position: absolute;
			height: 8rpx;
			border-radius: 8rpx;
			background-color: #EEEEEE;
			top: 50%;
			left: 0;
			transform: translateY(-50%);
			width: 100%;
		}

		.flex {
			flex: 1;
			height: 8rpx;
			border-radius: 8rpx 0 0 8rpx;
			background-color: $uni-color-primary;
			margin-top: 12rpx;
			position: relative;
			z-index: 1;
		}

		.sliderBar {
			height: 100%;
			border-radius: 8rpx;

			.gone {
				background-color: $uni-color-primary;
				height: 100%;
				position: absolute;
				left: 0;
				height: 8rpx;
				top: 12rpx;
				max-width: 100%;
				z-index: 1;
				border-radius: 0 8rpx 8rpx 0;
			}

			.slider {
				width: 0;
				height: 100%;
				position: relative;
				z-index: 2;

				&::after {
					content: '';
					position: absolute;
					border-radius: 16rpx;
					background-color: $uni-color-primary;
					width: 32rpx;
					height: 100%;
					transform: translatex(-50%);
				}

				text {
					position: absolute;
					width: 60rpx;
					color: white;
					border-radius: 14rpx;
					top: -120%;
					left: 50%;
					text-align: center;
					transform: translateX(-50%);
					background-color: $uni-color-primary;

					&::after {
						content: '';
						position: absolute;
						border: 6rpx solid transparent;
						border-top-color: $uni-color-primary;
						top: 99%;
						left: 50%;
						transform: translateX(-50%);
					}
				}
			}
		}
	}
</style>