<template>
	<div class="option-wrapper">
		<!-- <span class="icon-oper oper-share" @click="shareHandler">
		</span> -->
		<!-- 已分享 -->
		<!-- <span class="icon-oper oper-shareed" @click="shareHandler">
		</span> -->
		<span ref="collect"  class="icon-oper" @click="collectHandler" 
			  :class="{'oper-collect':!isCollect,'oper-collected':isCollect, 'show-three': type !='theme', 'show-two': type =='theme'}">
		</span>
		<span class="icon-oper" @click="praiseHandler" 
			  :class="{'oper-praise':!isPraise,'oper-praiseed':isPraise, 'show-three': type !='theme', 'show-two': type =='theme'}" 
			  v-if="type !='theme'">
		</span>
		<span class="icon-oper oper-comment"
				@click="commentHandler"
				:class="type !='theme' ? 'show-three' : 'show-two'">
		</span>
		<!-- 已评论 -->
		<!-- <span class="icon-oper oper-commented"
				@click="commentHandler">
		</span> -->
	</div>
</template>
<script>
	import{Toast} from 'mint-ui'
	export default {
		name: 'detailBottomOption',
		props: {
			isCollection: {
			},
			hasPraise: {
			},
			type: {
				type: String
			},
			id: {
				type: String
			}
		},
		data() {
			return {
				isPraise: false,
				isCollect: false
			}
		},
		mounted(){
			this.isPraise = this.hasPraise;
			this.isCollect = this.isCollection;
		},
		methods: {
			getUrl(type) {
				// 判断是什么主题给什么接口
				var url;
				if(type == 'praise'){
					url = '/KMS-MSERVER/praise/toPraise?contentId=' + this.id +'&contentType=' + this.type;
				}else if('collect'){	
					if(this.type == 'information'){
						url = '/KMS-MSERVER/favorite/collect?contentId=' + this.id +'&contentType=blog';
					}else{
						url = '/KMS-MSERVER/favorite/collect?contentId=' + this.id +'&contentType=' + this.type;
					}
				}
				
				return url;
			},
			shareHandler() {//分享事件
				

			},
			collectHandler() {//收藏事件
				var url = this.getUrl('collect');
				// 判断收藏状态
				if(this.isCollect){
					url += '&saveType=false';
				}else{
					url += '&saveType=true';
				}
				this.$http({
					method: 'POST',
					url:this.$global().host + url
				}).then(
				response => {
					if(response.body.status == '1'){
						this.isCollect = !this.isCollect;
						if(this.isCollect){
							Toast({message: '收藏成功！', duration: 1000});
						}else{
							Toast({message: '取消收藏成功！', duration: 1000});
						}
					}else if(response.body.status == '0'){
						Toast({message: response.body.errorMessage,duration: 1000});
					}
					
				})
			},
			praiseHandler() {//点赞事件
				// 判断isCanceled状态
				var url = this.getUrl('praise');
				if(this.isPraise){
					url += '&isCanceled=true';
				}else{
					url += '&isCanceled=false';
				}
				this.$http({
					method: 'POST',
					url:this.$global().host + url
				}).then(
				response => {
					if(response.body.status == '1'){
						if(this.isPraise){
							Toast({message: '取消点赞成功！', duration: 1000});
						}else{
							Toast({message: '点赞成功！', duration: 1000});
						}
						this.isPraise = !this.isPraise;
						this.$emit('watchTotalPrise', response.body.data.praiseCount);

					}else if(response.body.status == '0'){
						Toast({message: response.body.errorMessage,duration: 1000});
					}
				})
				
			},
			commentHandler() {//评论事件
				this.$emit('commentControl');
			}
		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	.option-wrapper {
		/*width: 56%;*/
		width: 100%;
		margin: 0 auto;
		height: 1.5rem;
		font-size: 0;
		background-color: #eee;
		.icon-oper {
			display: inline-block;
			width: 0.56rem;
			height: 0.56rem;
			background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
			background-size: 178%;
			position: relative;
			z-index: 100;
			top: 0.75rem;
			margin-top: -0.28rem;
			
			.bgPosition(@signs4Width, @signs4Height, 15, 25, 0, 28);
			&.oper-share {
				.bgPosition(@signs4Width, @signs4Height, 36, 40, 0, 1453);
			}
			&.oper-shareed {
				.bgPosition(@signs4Width, @signs4Height, 36, 40, 0, 1824);
			}
			&.oper-collect {
				.bgPosition(@signs4Width, @signs4Height, 40, 38, 0, 1552);
			}
			&.oper-collected {
				.bgPosition(@signs4Width, @signs4Height, 40, 38, 0, 1923);
			}
			&.oper-praise {
				.bgPosition(@signs4Width, @signs4Height, 44, 40, 0, 1503);
			}
			&.oper-praiseed {
				.bgPosition(@signs4Width, @signs4Height, 44, 40, 0, 1875);
			}
			&.oper-comment {
				.bgPosition(@signs4Width, @signs4Height, 45, 42, 0, 1600);
			}
			&.oper-commented {
				.bgPosition(@signs4Width, @signs4Height, 45, 42, 0, 1970);
			}
			/*&:last-child {
				margin-right: 0%;
			}*/
			&.show-three{
				margin-left: calc(~"(100% - 1.68rem) / 4");
			}
			&.show-two{
				margin-left: calc(~"(100% - 1.12rem) / 3");
			}
		}
	}
</style>