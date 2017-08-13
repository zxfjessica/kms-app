<template>
	<div class="channel-item-wrapper" ref="outter">
		<a href="javascript:void(0);">
			<div class="img-wrapper">
				<img :src="headImage" alt=""><!-- '../../../static/img/banner/peixun.png' -->
			</div>
			<div class="item-info">
				<div class="item-head-wrapper">
					<h3 class="info-title">{{itemByP.name || '未知'}}</h3>
					<!-- 达人频道列表 -->
					<span class="free" v-if="(itemByP.score == 0 || !itemByP.score)">免费</span>
					<!-- <span class="free" v-if="kind=='channel-list' && (itemByP.score == 0 || !itemByP.score)">免费</span> -->
					<span class="free no-free" v-if="kind=='channel-list' && itemByP.score > 0"><i>{{itemByP.score}}</i>积分</span>
					<!-- 频道管理列表 -->
					<span class="free no-free" 
						v-if="kind=='channel' && itemByP.score > 0"
						:class="{'channel': kind=='channel'}">
						<b class="icon"></b>
						<i>{{itemByP.score}}</i>
					</span>
				</div>
				<div ><p class="intro">{{itemByP.description || '未知'}}</p></div>
				<p class="num-info">
					<span>订阅人数：<i>{{itemByP.focusCount || 0}}</i></span>
					<span class="content-num">内容数量：<i>{{itemByP.contentCount || 0}}</i></span>
				</p>
				<div class="channel-btn-wrapper">
					<!-- 达人频道列表、频道管理（无channel-list） -->
					<span class="btn subscribe-btn" 
						:class="{'list-btn': kind=='channel-list'}"
						v-if="(kind=='channel-list' && !itemByP.isFocus) || (kind=='channel' && !itemByP.isManager)" 
						@click.stop="subscribeTipHandler(itemByP.id, !itemByP.isFocus, itemByP.score)">
						{{itemByP.isFocus?'取消订阅':'订阅'}}
					</span>
					<!-- 频道管理(已订阅) -->
					<span class="btn top-btn" 
						v-if="kind=='channel' && itemByP.isFocus"
						@click.stop="firstOperHandler(itemByP.id, itemByP.isFirst)">
						{{itemByP.isFirst==2?'置顶':'取消置顶'}}
					</span>
				</div>
			</div>
		</a>
	</div>
</template>
<script>
	import { Toast } from 'mint-ui';
	export default {
		props: {
			kind: {
				type: String,
				default: 'channel-list'
			},
			subscribed: {
				type: Boolean,
				default: false
			},
			itemByP: {
				type: Object
			}
		},
		computed: {
			headImage() {
				return !this.itemByP.headImage? 'static/img/user-default.png' : this.$global().imgHost + this.itemByP.headImage;
			}
		},
		methods: {
			subscribeTipHandler(channelId, isFocus, score) {
				if (isFocus) { //订阅
					this.$emit('subscribeTip', { channelId: channelId, score: score || 0 });
				} else { //取消订阅
					this.$emit('subscribeTip', channelId);
				}
				
			},
			firstOperHandler(channelId, isFirst) {
				var info = 'type=1';
				info += '&channelId=' + channelId;
				if (isFirst == 2) { //取消置顶
					info += '&status=1';
				} else { //置顶
					info += '&status=2';
				}
				this.$http.post(this.$global().host + '/KMS-MSERVER/mobileChannel/updateUserChannel', info).then(
					response => {
						if(response.status==200&&response.body.status){
							Toast({message: response.body.data.result, duration: 1000});
							this.$emit('operItemCallbackController', 'first');
						}	
					},
					response =>{
						// error callback
					}
				)
			}
		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	.channel-item-wrapper {
		position: relative;
		.img-wrapper {
			img {
				width: 1.92rem;
				height: 1.92rem;
				border-radius: 50%;
			}
		}
		.item-info {
			position: absolute;
			left: 2.2rem;
			top: 50%;
			width: calc(~"100% - 2.2rem");
			.transform-translateY (-50%); 
			.item-head-wrapper {
				position: relative;
				margin-bottom: 0.2rem;
				.info-title {
					width: 6rem;
					white-space: nowrap;
					overflow:hidden;
					text-overflow: ellipsis;
					color: #333;
					font-size: 0.42rem;
				}
				.free {
					position: absolute;
					right: 0;
					top: 0;
					font-size: 0.32rem;
				}
				.free {
					color: #999;
					&.no-free {
						color: #ff4341;
						&.channel {
							color: #ff9a35;
							.icon {
								display: inline-block;
								vertical-align: center;
								width: 0.45rem;
								height: 0.32rem;
								position: relative;
								top: 0.08rem;
								background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
								background-size: 223%;
								.bgPosition(@signs4Width, @signs4Height, 31, 24, 0, 403);
							}
							i {
								font-size: 0.32rem;
								line-height: 0.48rem;
							}
						}
					}
				}
			}
			.intro {
				color: #999;
				overflow: hidden;
				margin-bottom: 0.2rem;
				font-size: 0.37rem;
				line-height: 0.48rem;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				width: 98%;
			}
			.num-info {
				color: #999;
				font-size: 0.32rem;
				position: relative;
				margin-bottom: 0.08rem;
				.content-num {
					margin-left: 0.36rem;
				}
				.subscribe-btn {					
					position: absolute;
					right: 0;
					top: -0.07rem;
					color: #ff3838;
					border: 1px solid #ff3838;
					margin-left: 0.2rem;
				}
			}
			.channel-btn-wrapper {
				position: absolute;
				bottom: 0;
				right: 0;
				margin-bottom: calc(~"-0.5rem - 6px");
				width: 100%;
				height: 0.6rem;
				overflow: hidden;
				font-size: 0;
				text-align: right;
				.top-btn {
					margin-left: 0.2rem;
				}
			}
			.btn {
				display: inline-block;
				font-size: 0.34rem;	
				line-height: 0.5rem;
				color: #ff4141;	
				border: 1px solid #ff4141;
				border-radius: 3px;
				padding: 0rem 0.24rem;
				background-color: #fff;
				&.list-btn {
					color: #ff4341;
					border: 1px solid #ff4341;
				}
				&.subscribed {
					margin-right: 0.2rem;
				}
			}
		}
	}
</style>