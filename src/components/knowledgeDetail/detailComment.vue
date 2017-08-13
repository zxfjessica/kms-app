<template>
	<div class="comment-wrapper">
		<div class="item-portrait-wrapper">
			<img :src="$global().imgHost + express.headPath" alt="">
		</div>
		<div class="item-right">
			<p class="reviewer">
				<span class="name">评论人</span>
				<span class="job-num">{{express.commenterId}}</span>
			</p>
			<p class="comment-time">
				<span class="comment-time-title">评论时间：</span>
				<span class="comment-time-detail">{{express.commentDate}}</span>
			</p>
			<div class="comment-ctn" v-html="express.commentContent"></div>
			<div class="comment-feedback-wrapper" v-if="express.commentReply && express.commentReply.length > 0">
				<div :ref="'express-' + express.id">
					<ul class="comment-feedback-list">
						<li v-for="reply in express.commentReply" 
							v-show="reply.isShow">
							<p class="fe-reviewer">
								<span class="fe-name">评论人</span>
								<span class="fe-job-num">{{reply.commenterName}}</span>
							</p>
							<p class="fe-reviewer-re">
								<span v-if="express.commenterId != reply.receiverId">回复<span class="fe-reviewer-re-name">{{reply.receiverName}}</span>：</span>
								<span class="fe-reviewer-re-ctn" ref="commentText" v-html="reply.commentContent"></span>
							</p>
						</li>
					</ul>
				</div>
				<span class="loadMore" v-if="express.commentReply.length > expressShowNum">...
					  	<i v-if="express.commentReply[express.commentReply.length-1].isShow"
					  		@click.stop.prevent="loadMore('fold')">收起</i>
					  	<i v-else @click.stop.prevent="loadMore(express.id)" >显示更多</i>
				</span>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'detailComment',
		props: {
			expressItem: {
				type: Object
			},
			expressShowNum: {
				type: Number
			}
		},
		data(){
			return {
				express: {},
				item: 1
			}
		},
		mounted() {
			this.express = this.expressItem;
			//this.express.commentDate = this.formatTime(this.express.commentDate);
			
			this.controlToShow(this.expressShowNum);
		},
		methods: {
			controlToShow(index, id){
				//console.log(index);
				//console.log(id);
				var arr = this.express;
				this.express = [];
				if(arr.commentReply){
					for(var j = 0; j < arr.commentReply.length; j++){
						if(id){
							//console.log(111);
							if(id == arr.id){
								if(j < index){
									arr.commentReply[j].isShow = true;
								}else{
									arr.commentReply[j].isShow = false;
								}
							}
							
						}else{
							//console.log(222);
							if(j < index){
								arr.commentReply[j].isShow = true;
							}else{
								arr.commentReply[j].isShow = false;
							}

							
						}
					}
				}
				this.express = arr;
			},
			loadMore(id){
				if(id == 'fold'){
					this.item = 1;
					this.controlToShow(this.expressShowNum);
				}else{
					this.item += 1;
					var index = this.expressShowNum * this.item
					this.controlToShow(index, id);
				}
				
			}
		}
	}
</script>
<style lang="less">
	.comment-wrapper {
		.item-portrait-wrapper, .item-right {
			display: inline-block;
		}
		.item-portrait-wrapper {
			vertical-align: top;
			img {
				width: 1rem;
				height: 1rem;
			}
		}
		.comment-ctn {
			margin-bottom: 0.13rem;
			word-break: break-word;
		}
		.item-right {
			font-size: 0.32rem;
			line-height: 0.48rem;
			margin-left: 0.2rem;
			width: calc(~"100vw - 1.9rem");
			.reviewer, .comment-time {
				margin-bottom: 0.1rem;
			}
			.job-num {
				color: #666;
			}
			.comment-time {
				.comment-time-title {
					color: #666;
				}
			}
			.comment-feedback-wrapper {
				background-color: #f0f0f0;
				padding: 2%;
				.comment-feedback-list {
					width: 100%;
					li {
						padding: 0;
						margin-bottom: 0.1rem;
						font-size: 0.32rem;	
						line-height: .5rem;
						.fe-reviewer, .fe-reviewer-re-name {
							color: #6ea2cb;
						}
						/*.fe-reviewer {
							margin-bottom: 0.1rem;
						}*/
						.fe-reviewer-re-name {
							margin-left: 0.08rem;
						}
						.fe-reviewer-re-ctn {
							img {
								margin: 0;
								padding: 0 1px;
								vertical-align: middle;
							}
						}
					}
					
				}
				.loadMore{
					display: block;
					font-size: .35rem;
					color: #999;
					i{
						color: #ff4141;
					}
					
				}
			}
		}
	}
</style>