<template>
	<div class="new-blog-wrapper">
		<mt-header title="发博客" class="is-fixed">
			<div slot="left">
			    <mt-button @click="cancelHandler">取消</mt-button>
			</div>
			<div slot="right" class="header-right-btn">
			    <mt-button class="publish-btn" @click="publishHandler">发表</mt-button>
			</div>
		</mt-header>
		<div class="new-blog-content container">
			<section class="input-section">
				<input class="blog-title" placeholder="添加标题" type="text">
				<textarea class="blog-content" placeholder="写点什么吧"></textarea>
				<!-- 博客语音 -->
				<div class="audio-shower">
					<span class="icon-audio"></span>
					<span class="audio-duration">00:08</span>
					<span class="audio-delete-btn"></span>
				</div>
				<div class="blog-sel-menu-wrapper">
					<span class="remind"></span>
					<span class="pic"></span>
					<span class="camera"></span>
					<span class="unknow"></span>
				</div>
			</section>
			<section class="original-section">
				<span class="original-text">原创</span>
				<mt-switch class="origin-switch" v-model="isOriginal"></mt-switch>
			</section>
			<section class="syn-section">
				<h3 class="syn-title">同步到我的频道<span></span></h3>
				<div class="syn-list">
					<div class="syn-radio-wrapper" v-for="item in synOptions">
						<label class="syn-label">
							<span>
								<input class="syn-radio" name="synRadio" type="radio" :value="item.value" @click="synRadioHandler"/>
							</span>
							<span class="syn-radio-label">{{item.label}}</span>
						</label>
						<span class="self"></span>
					</div>
				</div>
			</section>
		</div>
		<mt-popup
		  v-model="createAudioVisible"
		  popup-transition="popup-fade"
		  :closeOnClickModal="false">
		  <div class="create-audio-wrapper">
		  	<h6 class="create-audio-title">点击图标语音</h6>
		  	<div class="audio-btn"></div>
		  	<div class="create-audio-bottom">
		  		<span class="again-audio">重录</span>
		  		<span class="audio-next" @click="nextStep">下一步</span>
		  	</div>
		  </div>
		</mt-popup>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				isOriginal: true,
				synValue: '值F',
				synOptions: [
				  {
				    label: '被禁用',
				    value: '值F',
				    // disabled: true
				  },
				  {
				    label: '选项A',
				    value: '值A'
				  },
				  {
				    label: '选项B',
				    value: '值B'
				  }
				],
				createAudioVisible: true //录制语音面板开关
			}
		},
		methods: {
			synRadioHandler(event) {
				this.synValue = event.currentTarget.value;
			},
			cancelHandler() { //取消发表博客
				this.$emit('newAudioCancelControl');
			},
			publishHandler() { //发表博客

			},
			nextStep() {
				this.createAudioVisible = false;
			}
		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	/*.new-blog-wrapper {
		.header-right-btn {
			.mint-button {
				text-align: right;
			}
		}
		.new-blog-content {
			.input-section {
				background-color: #fff;
				padding-left: 0.37rem;
				padding-bottom: 0.32rem;
				.blog-title, .blog-content {
					font-size: 0.37rem;
					color: #999;
				}
				.blog-title {
					.appearance-clear;
					border: none;
					border-bottom: 1px solid #eee;
					width: 100%;
					height: 1.17rem;	
				}
				.blog-content {
					.appearance-clear;
					border: none;
					width: 97.5%;
					height: 4rem;
					padding: 0.4rem 2.5% 0.4rem 0;
				}
				.audio-shower {
					margin-top: 0.66rem;
					background-color: #eee;
					border-radius: 10px;
					padding: 0.32rem;
					position: relative;
					margin-right: 0.32rem;
					margin-top: 0.32rem;
					.icon-audio {
						position: absolute;
						left: 0.32rem;
						top: 50%;
						width: 0.32rem;
						height: 0.53rem;
						margin-top: -0.265rem;
						background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
						background-size: 496%;
						.bgPosition(@signs4Width, @signs4Height, 15, 25, 0, 28);
					}
					.audio-duration {
						color: #666;
						font-size: 0.37rem;
						margin-left: 0.42rem;
					}
					.audio-delete-btn {
						display: block;
						width: 0.42rem;
						height: 0.42rem;
						position: absolute;
						right: 0.32rem;
						top: 50%;
						margin-top: -0.21rem;
						background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
						background-size: 330%;
						.bgPosition(@signs4Width, @signs4Height, 23, 23, 0, 311);
					}
				}
				.blog-sel-menu-wrapper {
					font-size: 0;
					margin-top: 0.32rem;
					border-top: 1px solid #eee;
					padding-top: 0.32rem;
					span {
						display: inline-block;
						width: 0.58rem;
						height: 0.58rem;
						background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
						background-size: 310%;
						margin-right: 0.8rem;
						&.remind {
							.bgPosition(@signs4Width, @signs4Height, 15, 25, 0, 28);
						}
						&.pic {
							.bgPosition(@signs4Width, @signs4Height, 15, 25, 0, 28);
						}
						&.camera {
							.bgPosition(@signs4Width, @signs4Height, 15, 25, 0, 28);
						}
						&.unknow {
							.bgPosition(@signs4Width, @signs4Height, 15, 25, 0, 28);
						}
					}
				}
			}
			.original-section {
				margin-top: 0.32rem;
				background-color: #fff;
				height: 1.173rem;
				.origin-switch {
					float: right;
					margin-top: 0.22rem;
					margin-right: 0.32rem;
				}
				.original-text {
					float: left;
					display: block;
					margin-top: 0.27rem;
					margin-left: 0.32rem;
					font-size: 0.42rem;
					line-height: 0.63rem;
				}
				.mint-switch-core {
					width: 1.12rem;
					height: 0.68rem;
					&:after {
						width: 0.56rem;
						height: 0.56rem;
						top: 0.5px;
					}
					&:before {
						width: 1.05rem;
						height: 0.62rem;
					}
				}
				.mint-switch-input:checked + .mint-switch-core {
					background-color: #ff4143;
					border-color: #ff4143;
					&:after {
						.transform-translateX(82%);
					}
				}
				.mint-switch-label {
					font-size: 0.42rem;
					line-height: 0.63rem;
				}
			}
			.syn-section {
				background-color: #fff;
				margin-top: 0.32rem;
				.syn-title {
					font-size: 0.42rem;
					line-height: 0.63rem;
					color: #333;
					padding: 0.27rem 0.32rem;
					border-bottom: 1px solid #eee;
				}
				.syn-list {
					.syn-radio-wrapper {
						height: 1.173rem;
						border-bottom: 1px solid #eee;
						position: relative;
						.syn-label {
							margin: 0 0.32rem;
						}
						.syn-radio {
							.appearance-clear;
							width: 0.53rem;
							height: 0.53rem;
							background-color: #fff;
							border: 1px solid #ccc;
							border-radius: 50%;
							position: relative;
							top: 50%;
							vertical-align: top;
							.transform-translateY(-50%);
							&:checked {
								background-color: #ff4341;
								border: 1px solid #ff4341;
							}
						}
						.syn-radio-label {
							font-size: 0.37rem;
							line-height: 0.55rem;
							position: relative;
							top: 0.3115rem;
							margin-left: 0.2rem;
						}
						.self {
							display: block;
							width: 0.4rem;
							height: 0.4rem;
							position: absolute;
							right: 0.32rem;
							top: 0.3865rem;
							background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
							background-size: 350%;
							.bgPosition(@signs4Width, @signs4Height, 19, 20, 0, 89);
						}
					}
				}
			}
		}
		.mint-popup {
			width: 90%;
			bottom: -10%;
			top: auto;
			margin-right: 10%;
		}
		.create-audio-wrapper {
			background-color: #fff;
			padding: 0.32rem 0.64rem 0.64rem;
			.create-audio-title {
				font-size: 0.42rem;
				line-height: 0.63rem;
				color: #333;
				text-align: center;
			}
			.audio-btn {
				width: 1.6rem;
				height: 1.6rem;
				border-radius: 50%;
				border: 1px solid #eee;
				background-color: #fff;
				position: relative;
				margin: 0 auto;
				margin-top: 0.32rem;
				&:after {
					content: '';
					width: 1.2rem;
					height: 1.2rem;
					border-radius: 50%;
					position: absolute;
					left: 50%;
					top: 50%;
					margin-top: -0.6rem;
					margin-left: -0.6rem;
					background-color: #ff4143;
				}
			}
			.create-audio-bottom {
				margin-top: 0.64rem;
				position: relative;
				span {
					border: 1px solid #eee;
					border-radius: 4px;
					padding: 0.32rem 0.64rem;
					font-size: 0.4rem;
					line-height: 0.6rem;
					&.audio-next {
						position: absolute;
						right: 0;
						top: -0.32rem;
					}
				}
			}
		}
	}*/
</style>