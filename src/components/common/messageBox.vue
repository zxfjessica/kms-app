<template>
	<div class="v-message-box">
		<div class="mint-msgbox-wrapper" style="position: absolute; z-index: 2001;">
			<div class="mint-msgbox" :style="'width:' + width + '%'">
				<div class="mint-msgbox-header">
					<div class="mint-msgbox-title">
						<slot name="title"></slot>
					</div>
				</div>
				<div class="mint-msgbox-content">
					<div class="mint-msgbox-message">
						<slot name="content"></slot>
					</div> 
				</div> 
				<div class="mint-msgbox-btns">
					<button class="mint-msgbox-btn mint-msgbox-confirm">
						<slot name="confirm"></slot>
					</button>
					<button class="mint-msgbox-btn mint-msgbox-cancel ">
						<slot name="cancel"></slot>
					</button>
				</div>
			</div>
		</div>
		<div class="v-shadow-bg" v-if="isShowShadowBg"></div>
	</div>
</template>
<script>
	export default{
		props:{
			width: {
				type: Number,
				default: 70
			},
			isShowShadowBg: {
				type: Boolean,
				default: true
			}
		},
		data(){
			return{}
		}
	}
</script>
<style lang="less">
	.v-message-box{
		.mint-msgbox-wrapper{
			.mint-msgbox{
				padding: 0 5%;
				.mint-msgbox-header{
					.mint-msgbox-title{
						font-size: .4rem;
						font-weight: 500;
					}
				}
				.mint-msgbox-content{
					padding: 3.6% 0;
					border-color: #eee;
					input, textarea{
						font-family: Microsoft YaHei;
						border: 1px solid #eee;
						appearance: none;
						-webkit-appearance: none;
					}
					textarea{
						resize: none;
						font-size: .35rem;
						color: #999;
						box-shadow:0px 0px 0px rgba(0,0,0,0);
					}
					.mint-msgbox-message{
						line-height: .7rem;
					}
				}
				.mint-msgbox-btns{
					height: 30px;
					line-height: 30px;
					padding: 5px 0;
					.mint-msgbox-btn{
						border: none;
						font-size: .4rem;
						&.mint-msgbox-cancel{
							border-left: 1px solid #eee;
						}
						
					}
				}
			}
		}
		.v-shadow-bg{
			position: absolute;
			/*width: 100%;
			height: 100%;*/
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(0,0,0,.3);
		}
	}
</style>