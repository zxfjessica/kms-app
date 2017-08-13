<template>
	<div class="blog-detail-wrapper">
		<v-common-header :reTitle="$route.query.type == 'blog' ? '博客详情' : $route.query.type == 'theme' ? '主题详情': '知识详情'"></v-common-header>
		<div class="blog-detail-content container">
			<p class="is-ready-to-show" v-if="showOnloading">加载中...</p>
			<div class="inner-wrapper" @click.stop.prevent="hideCommmentHandler" v-if="!showOnloading">
				<div class="content-top">
					<h4>{{detailData.title}}</h4>
					<div class="blogger">
						<div class="portrait-wrapper">
							<img :src="this.$global().imgHost + detailData.headPath" alt="">
						</div>
						<div class="blog-info">
							<p class="blogger-name"><i class="icon-person"></i><span>{{detailData.createrName}}</span></p>
							<p class="blog-time"><i class="icon-time"></i><span>{{detailData.createDate | time}}</span></p>
						</div>
						<div class="blog-feedback">
							<span class="praise"><i class="icon praise-icon"></i>{{totalPraise}}</span>
							<span class="read"><i class="icon read-icon"></i>{{detailData.readCount == null ? 0 : detailData.readCount}}</span>
						</div>
					</div>
					<div class="blog-ctn">
						<div v-for="content in detailData.contentSequence">
							<!-- 博客文本 -->
							<p v-if="content.type == 'text'" class="text-shower">{{content.text}}</p>
							<!-- 博客图片 -->
							<div class="img-shower" v-if="content.type == 'image'">
								<img :src="$global().imgHost + content.src">
								<!-- <img src="http://10.202.32.116:8080/KMS/images/knowledge/Head_pic.gif"> -->
							</div>
							<!-- 博客语音 -->
							<div class="audio-shower" v-if="content.type == 'voice' && detailType == 'knowledge'">
								<span class="icon-audio"></span>
								<span class="audio-duration">00:08</span>
							</div>
							<!-- 博客视频 -->
							<div class="video-shower" v-if="content.type == 'video' && detailType == 'knowledge'">
								<img v-show="!showVideo"
									class="play-btn"
									src="../../../static/img/play.png" 
									@click="playVideo"
									alt="">
								<video src="http://10.202.32.116:8080/KMS/courses/001/495/174/767/557//c094dc88-1023-4e97-af6f-18e3078ecf85.mp4.mp4"
										class="blog-video"
										preload
										autoplay="autoplay"
										controls="controls"
										webkit-playsinline
										v-if="showVideo">
									不支持该视频格式播放
								</video>
							</div>
						</div>
						
					</div>
				</div>
				<!-- 评论列表 -->
				<div class="content-comment">
					<div class="comment-list-wrapper">
						<v-detail-comment-lists @replyControl="replyParent"
												:id="detailID"
												:isToGetData="isToGetData"
												:type="detailType"
												@watchIsToGetData="initIsToGetData"></v-detail-comment-lists>
					</div>
				</div>
			</div>
			<div class="operation-panel" v-if="!showOnloading">
				<div class="oper-icon-wrapper" v-if="!commentBlockVisiable">
					<v-bottom-option :type="detailType"
									 :id="detailID"
									 :isCollection="isCollect" 
									 :hasPraise="hasPraise" 
									 @watchTotalPrise="watchTotalPrise"
									 @commentControl="commentHandler">
					</v-bottom-option>
				</div>
				<div class="comment-block" v-if="commentBlockVisiable">
					<v-comment-box @sendControl="sendHandler"
									:replyName="replyName"></v-comment-box>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import commonHeader from '../../components/commonHeader.vue';
	import detailCommentLists from '../../components/knowledgeDetail/detailCommentLists.vue';
	import bottomOption from '../../components/knowledgeDetail/detailBottomOption.vue';
	import commentBox from '../../components/knowledgeDetail/detailCommentBox.vue';
	import { Toast } from 'mint-ui';
	export default {
		/*
		blog: 5,
		theme: 6,

		*/
		data() {
			return {
				showOnloading: true,
				showVideo: false,
				commentBlockVisiable: false,
				detailData: {},
				detailID: '',
				detailType: '',//knowledge | blog | theme
				isReplyParent: false,//是否是回复评论true || 评价请教false
				replyName: '',//评论回复的对象
				replyId: '',//评论回复的ID
				isToGetData: '',//发送评论之后的请求对象
				totalPraise: 0,//总点赞数
				hasPraise: false,
				isCollect: false
			}
		},
		components: {
			'v-common-header': commonHeader,
			"v-detail-comment-lists": detailCommentLists,
			"v-bottom-option": bottomOption,
			"v-comment-box": commentBox
		},
		filters: {
			time(value) {
				function add0(m){return m<10?'0'+m:m }
				var time = new Date(value);
				var y = time.getFullYear();
				var m = time.getMonth()+1;
				var d = time.getDate();
				var h = time.getHours();
				var mm = time.getMinutes();
				var s = time.getSeconds();
				return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
			}
		},
		mounted() {
			this.detailID = this.$route.query.id;
			this.detailType = this.$route.query.type;
			this.getData(this.detailID, this.detailType);
		},
		methods: {
			getData(id, type){
				this.$http({
					method: 'GET',
					url: this.$global().host +'/KMS-MSERVER/hot/view/' + type + '/' + id
				}).then(response => {
					this.showOnloading = false;
					if(response.body.status == 1){
						this.detailData = response.body.data;
						this.totalPraise = this.detailData.praiseCount;
						this.hasPraise = this.detailData.hasPraise;
						this.isCollect = this.detailData.isCollection;
					}
					
				})
			},
			playVideo() {
				this.showVideo = true;
			},
			watchTotalPrise(val){
				this.totalPraise = val;
			},
			initIsToGetData(){
				//console.log('initIsToGetData');
				this.isToGetData = '';
			},
			replyParent(id, commenterName){//点击评论回复初始化输入框
				//console.log(id);
				//console.log(commenterName);
				this.replyId = id;
				this.replyName = commenterName;
				this.isReplyParent = true;
				this.$nextTick(()=>{
					this.commentBlockVisiable = true;
				});
				
			},
			commentHandler() {//点击显示评论输入框
				this.isReplyParent = false;
				this.commentBlockVisiable = true;
			},
			hideCommmentHandler(eve){//点击页面隐藏评论输入框
				this.replyId = '';
				this.replyName = '';
				this.isReplyParent = false;
				this.commentBlockVisiable = false;
			},
			sendHandler(content) {//发送 请教评论 || 回复评论	
				//console.log(content);
				//评论请教
				if(!this.isReplyParent){
					//console.log('评论请教');
					this.$http({
						method: 'GET',
						url: this.$global().host + '/KMS-MSERVER/comment/' + this.detailType + '/save?contentId=' + this.detailID + '&&commentContent=' + content
					}).then(
						response =>{
							if(response.body.status == 1){
								Toast({message: '评论成功！', duration: 1000});
								this.isToGetData = 'parent';
							}else if(response.body.errorMessage){
								Toast({message: response.body.errorMessage, duration: 1000});
							}
						}
					);
				}else{
					//http://10.202.4.75:8180/KMS-MSERVER/comment/{contentType}/saveReply						
					//回复评论
					//console.log('回复评论');
					this.$http({
						method: 'GET',
						url: this.$global().host + '/KMS-MSERVER/comment/' + this.detailType + '/saveReply?parentId=' + this.replyId + '&&commentContent=' + content
					}).then(
						response =>{
							if(response.body.status == 1){
								Toast({message: '回复成功！', duration: 1000});
								this.isToGetData = 'child';
							}else if(response.body.errorMessage){
								Toast({message: response.body.errorMessage, duration: 1000});
							}
						}
					);
				}	
			}
		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	.blog-detail-wrapper {
		.blog-detail-content {
			.inner-wrapper {
				height: calc(~"100vh - 1.5rem - 46px");
				overflow-y: scroll;
				background-color: #fff; 
			}
			.content-top {
				padding: 0.32rem;
			}
			.operation-panel {
				height: 1.5rem;
				font-size: 0;
				background-color: #eee;
			}
			h4 {
				font-size: 0.42rem;
				margin-bottom: 0.2rem;
			}
			.blogger {
				font-size: 0;
				position: relative;
				.portrait-wrapper, .blog-info {
					display: inline-block;
				}
				.portrait-wrapper {
					vertical-align: top;
					img {
						width: 1.2rem;
						height: 1.12rem;
						border-radius: 50%;
					}
				}
				.blog-info {
					margin: 0.1rem 0 0 0.26rem;	
					p {
						font-size: 0;
					}				
					span {
						display: inline-block;
						font-size: 0.32rem;
						line-height: 0.48rem;
						color: #666;
					}
					i {
						display: inline-block;
						vertical-align: sub;
						width: 0.5rem;
						height: 0.32rem;
						background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
						background-size: 256%;
						&.icon-person {
							.bgPosition(@signs4Width, @signs4Height, 19, 20, 0, 1423);		
						}
						&.icon-time {
							.bgPosition(@signs4Width, @signs4Height, 20, 20, 0, 1337);
						}
					}
				}
				.blog-feedback {
					position: absolute;
					right: 0;
					top: 0.1rem;
					span {
						font-size: 0.32rem;
						color: #666;
						line-height: 0.48rem;
					}
					.praise {
						margin-right: 0.6rem;
					}
					.icon {
						display: inline-block;
						width: 0.5rem;
						height: 0.48rem;
						vertical-align: baseline;
						background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
						background-size: 296%;
						&.praise-icon {
							.bgPosition(@signs4Width, @signs4Height, 22, 20, 0, 1393);
						}
						&.read-icon {
							vertical-align: sub;
							.bgPosition(@signs4Width, @signs4Height, 20, 16, 0, 1367);
						}
					}
				}
			}
			.blog-ctn {
				.text-shower {
					margin-top: 0.3rem;
					font-size: 0.37rem;
					margin-top: 0.37rem;
					color: #666;
					text-align: justify;
					word-break: break-word;
				}
				.img-shower{
					margin-top: 0.3rem;
					img{
						width: 100%;
					}
				}
				.audio-shower {
					margin-top: 0.3rem;
					background-color: #eee;
					border-radius: 10px;
					padding: 0.32rem;
					position: relative;
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
				}
				.video-shower {
					margin-top: 0.3rem;
					background-color: #eee;
					height: 5rem;
					position: relative;
					.play-btn {
						display: block;
						width: 1.8rem;
						height: 1.8rem;
						position: absolute;
						left: 50%;
						top: 50%;
						margin-top: -0.9rem;
						margin-left: -0.9rem;
					}
					.blog-video {
						width: 100%;
						height: 100%;
					}
				}
			}
			.content-comment {
				margin-top: 0.64rem;
				position: relative;
				padding-top: 0;
				.comment-title {
					position: absolute;
					top: 0;
					left: 0;
					padding: 0.22rem 0.32rem;
					background-color: #ff4143;
					font-size: 0.42rem;
					line-height: 0.42rem;
					//float: left;
					border-top-right-radius: 2rem;
					border-bottom-right-radius: 2rem;
					color: #fff;
					.comment-num {
						margin-left: 0.1rem;
					}
				}
				.comment-list {
					background-color: #f7f7f7;
					margin-top: 0.2rem;
					li {
						font-size: 0;
						padding: 0.2rem 0.32rem;
					}
				}
			}
		}
	}
</style>