<template>
	<div class="subscribe-tip-wrapper">
		<mt-popup
		  v-model="subscribeTipVisible"
		  popup-transition="popup-fade"
		  :closeOnClickModal="false">
		  <div class="tip-wrapper">
		  	<div class="tip-header">
		  		<h6>提示</h6>
		  		<span class="icon-close" @click.stop="subscribeTipSureHandler(false)"></span>
		  	</div>
		  	<div class="tip-content">
		  		<p>
		  			<span class="icon-ques"></span>
		  			<span class="content-text" v-if="integral >= 0">该频道订阅需要花费<i>{{integral}}</i>积分，是否订阅</span>
		  			<span class="content-text" v-if="integral < 0">确定取消订阅该频道吗？</span>
		  		</p>
		  		<div class="btn-wrapper">
		  			<span class="btn cancel" @click.stop="subscribeTipCancelHandler()">取消</span>
		  			<span class="btn sure" @click.stop="subscribeTipSureHandler()">确定</span>
		  		</div>
		  	</div>
		  </div>
		</mt-popup>
	</div>
</template>
<script>
	import { Toast } from 'mint-ui';
	export default {
		props: {
			subscribeTipVisibleByP: {
				type: Boolean,
				default: false
			},
			integral: {//积分
				type: Number,
				default: 0
			},
			channelId: {
				type: Number
			}
		},
		computed: {
			subscribeTipVisible() {
				return this.subscribeTipVisibleByP;
			}
		},
		methods: {
			subscribeTipSureHandler() {
				var that = this;
				var info = 'channelId=' + this.channelId;
				if (this.integral > -1) { //订阅
					info += '&type=1';
				} else { //取消订阅
					info += '&type=2';
				}
				this.$http.post(this.$global().host + '/KMS-MSERVER/mobileChannel/saveUserChannel', info).then(
					response => {
						if(response.status==200&&response.body.status){
							Toast({message: response.body.data.result, duration: 1000});
							setTimeout(() => {
								that.$emit('subscribeTipSureControl', this.channelId);
							}, 50);			
						}	
					},
					response =>{
						// error callback
					}
				)
				this.$emit('visibleControl', false);
			},
			subscribeTipCancelHandler() {//取消
				this.$emit('visibleControl', false);
			}
		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	.subscribe-tip-wrapper{
		.mint-popup {
			width: 80%;
			height: 4.4rem;
			border-radius: 5px;
			.tip-header {
				position: relative;
				height: 1rem;
				line-height: 1rem;
				border-top-left-radius: 5px;
				border-top-right-radius: 5px;
				background-color: #eee;
				padding: 0 0.4rem;
				font-size: 0.44rem;
				color: #333;
				.icon-close {
					display: block;
					width: 0.42rem;
					height: 0.42rem;
					position: absolute;
					right: 0.4rem;
					top: 50%;
					transform: translateY(-50%);
					background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
					background-size: 311%;
					.bgPosition(@signs4Width, @signs4Height, 23, 23, 0, 311);
				}
			}
			.tip-content {
				padding: 0 0.4rem;
				font-size: 0;
				p {
					color: #666;
					margin-top: 0.32rem;
					.content-text {
						font-size: 0.42rem;
						line-height: 0.63rem;
					}
				}
				.btn-wrapper {
					font-size: 0;
					width: 60%;
					margin: 0 auto;
					margin-top: 0.54rem;
					.btn {
						font-size: 0.42rem;
						color: #fff;
						text-align: center;
						display: inline-block;
						width: 46%;
						padding: 0.16rem 0;
						background-color: #ccc;
						&.sure {
							background-color: #fc4245;
						}
					}
					span:first-child {
						margin-right: 8%;
					}
				}
				.icon-ques{
					display: inline-block;
					width: 0.63rem;
					height: 0.63rem;
					margin-right: 0.12rem;
					vertical-align: top;
					background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
					background-size: 134%;
					.bgPosition(@signs4Width, @signs4Height, 49, 49, 0, 344);
				}
			}
		}
	}
</style>
