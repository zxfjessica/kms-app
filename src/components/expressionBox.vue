<template>
	<div class="expression-box">
		<div class="express-head" v-if="!lecture">
			<div class="express-info" v-if="!isLecture">
				<p class="mint-popup-title clearfix">
					好评度: {{expresses.commentStar}}
					<i class="signs close-signs fr" @click="closeExpress"></i>
				</p>
				<mt-navbar v-model="activeIndex">
				  	<mt-tab-item id="1" >
				  		<h3><span>全部</span></h3>
						<p>{{expresses.commentCount}}</p>
				  	</mt-tab-item>
				  	<mt-tab-item id="2" >
				  		<i></i>
						<h3><span class="signs signs_good">好评</span></h3>
						<p>{{expresses.goodComCount}}</p>
				  	</mt-tab-item>
				  	<mt-tab-item id="3" >
				  		<i></i>
						<h3><span class="signs signs_middle">中评</span></h3>
						<p>{{expresses.midComCount}}</p>
				  	</mt-tab-item>
				  	<mt-tab-item id="4" >
				  		<i></i>
						<h3><span class="signs signs_worse">差评</span></h3>
						<p>{{expresses.lowComCount}}</p>
				  	</mt-tab-item>
				</mt-navbar>
			</div>
			<div class="express-info" v-if="isLecture">
				<p class="mint-popup-title clearfix" style="color: #333;">
					评价详情
					<i class="signs close-signs fr" @click="closeExpress"></i>
				</p>
			</div>
		</div>
		<div class="mint-popup-content express-main">
			<mt-tab-container  v-model="activeIndex">
				<mt-tab-container-item id="1">
					<div class="item-container">
						<p class="is-ready-to-show" v-if="commentList1.length == 0 && !isLoadFinish">加载中...</p>
						<p class="is-ready-to-show" v-if="commentList1.length == 0 && isLoadFinish">没有更多数据了！</p>
						<ul class="express-lists">
							<li class="express-list" v-for="list1 in commentList1" :id="list1.commenterId">
								<div class="head-pic clearfix">
									
									<div class="fl">
										<img :src="$global().imgHost + list1.headPath">
										<span class="name">{{list1.commenterName}}</span>
									</div>
									
									<span class="expresses fr">
										<v-star :score="String(list1.commentStar)" :totalStar="5"></v-star>
									</span>
								</div>
								<div class="main-express clearfix">
									<div class="express-bottom">{{list1.commentContent}}</div>
									<p class="clearfix">
										<span class="date fl" v-if="courseType == 'project' && isLecture == false">来自{{list1.className}}</span>
										<span class="date fr">{{list1.commentDateStr}}</span>
									</p>
								</div>
							</li>
						</ul>
					</div>
				</mt-tab-container-item>
				<mt-tab-container-item id="2">
					<div class="item-container">
						<p class="is-ready-to-show" v-if="commentList2.length == 0 && !isLoadFinish">加载中...</p>
						<p class="is-ready-to-show" v-if="commentList2.length == 0 && isLoadFinish">没有更多数据了！</p>
						<ul class="express-lists">
							<li class="express-list" v-for="list2 in commentList2" :id="list2.commenterId">
								<div class="head-pic clearfix">
									
									<div class="fl">
										<img :src="$global().imgHost + list2.headPath">
										<span class="name">{{list2.commenterName}}</span>
									</div>
									
									<span class="expresses fr">
										<v-star :score="String(list2.commentStar)" :totalStar="5"></v-star>
									</span>
								</div>
								<div class="main-express clearfix">
									<div class="express-bottom">{{list2.commentContent}}</div>
									<p class="clearfix">
										<span class="date fl" v-if="courseType == 'project' && isLecture == false">来自{{list2.className}}</span>
										<span class="date fr">{{list2.commentDateStr}}</span>
									</p>
								</div>
							</li>
						</ul>
					</div>
				</mt-tab-container-item>
				<mt-tab-container-item id="3">
					<div class="item-container">
						<p class="is-ready-to-show" v-if="commentList3.length == 0 && !isLoadFinish">加载中...</p>
						<p class="is-ready-to-show" v-if="commentList3.length == 0 && isLoadFinish">没有更多数据了！</p>
						<ul class="express-lists">
							<li class="express-list" v-for="list3 in commentList3" :id="list3.commenterId">
								<div class="head-pic clearfix">
									
									<div class="fl">
										<img :src="$global().imgHost + list3.headPath">
										<span class="name">{{list3.commenterName}}</span>
									</div>
									
									<span class="expresses fr">
										<v-star :score="String(list3.commentStar)" :totalStar="5"></v-star>
									</span>
								</div>
								<div class="main-express clearfix">
									<div class="express-bottom">{{list3.commentContent}}</div>
									<p class="clearfix">
										<span class="date fl" v-if="courseType == 'project' && isLecture == false">来自{{list3.className}}</span>
										<span class="date fr">{{list3.commentDateStr}}</span>
									</p>
								</div>
							</li>
						</ul>
					</div>
				</mt-tab-container-item>

				<mt-tab-container-item id="4">
					<div class="item-container">
						<p class="is-ready-to-show" v-if="commentList4.length == 0 && !isLoadFinish">加载中...</p>
						<p class="is-ready-to-show" v-if="commentList4.length == 0 && isLoadFinish">没有更多数据了！</p>
						<ul class="express-lists">
							<li class="express-list" v-for="list4 in commentList4" :id="list4.commenterId">
								<div class="head-pic clearfix">
									
									<div class="fl">
										<img :src="$global().imgHost + list4.headPath">
										<span class="name">{{list4.commenterName}}</span>
									</div>
									
									<span class="expresses fr">
										<v-star :score="String(list4.commentStar)" :totalStar="5"></v-star>
									</span>
								</div>
								<div class="main-express clearfix">
									<div class="express-bottom">{{list4.commentContent}}</div>
									<p class="clearfix">
										<span class="date fl" v-if="courseType == 'project' && isLecture == false">来自{{list4.className}}</span>
										<span class="date fr">{{list4.commentDateStr}}</span>
									</p>
								</div>
							</li>
							</ul>
					</div>
				</mt-tab-container-item>
			</mt-tab-container>
		</div>
	</div>
</template>
<script type="text/javascript">
	import Star from "../components/list/Star.vue";
	import { Toast } from 'mint-ui';
	import loadMore from "../components/loadMore.vue";
	export default{
		name: 'expressionBox',
		props: [
			"expressions",
			"courseType",
			"coursesId",
			"classId",//讲师评价
			"lectureId"//讲师评价
		],
		components: {
			'v-star': Star,
			'v-loadmore': loadMore
		},
		data(){
			return {
				expresses: {},
				activeIndex: '1',
				isLoadFinish: true,
				isLecture: false,
				commentList1: [],
				commentList2: [],
				commentList3: [],
				commentList4: []
			}
		},
		mounted(){
			this.expresses = this.expressions;
			if(this.classId){
				this.isLecture = true;
			}else{
				this.isLecture = false;
			}
			if(this.isLecture){
				this.isLoadFinish = false;
				this.getCommont(0, 'commentList1');
			}else{
				this.commentList1 = this.expresses.commentList;
				
			}
			
			
			
		},
		methods: {
			getCommont: function(type, dataList){			
				var that = this;
				if(!that.isLecture){
					var type = type || 0;
					var url = that.$global().host + '/KMS-MSERVER/learning/viewComment/'+ that.courseType +'/'+ that.coursesId +'?commentType=' + type;

					//that.activeIndex = type;
				}else{					
					var url = that.$global().host + '/KMS-MSERVER/learning/viewLecturerComment/list?coursesId='+ that.coursesId +'&&classId='+ that.classId +'&&empNumber=' + that.lectureId;
				}
				
				that[dataList] = [];
				that.$http.get(url).then(function(data) {
					that.isLoadFinish = true;
					if(!that.isLecture){
						that.expresses = data.data.data;
						that[dataList]= data.data.data.commentList;
					}else{
						that[dataList] = data.data.data
					}
				});
			},
			closeExpress: function(){
				this.$emit('closeExpress');
			}
		},
		watch: {
			activeIndex(val){
				if(val){
					if(Number(val) == 1 && this.commentList1.length == 0){
						this.isLoadFinish = false;
						this.getCommont(0, 'commentList1');
					}else if(Number(val) == 2 && this.commentList2.length == 0){
						this.isLoadFinish = false;
						this.getCommont(1, 'commentList2');
					}else if(Number(val) == 3 && this.commentList3.length == 0){
						this.isLoadFinish = false;
						this.getCommont(2, 'commentList3');
					}else if(Number(val) == 4 && this.commentList4.length == 0){
						this.isLoadFinish = false;
						this.getCommont(3, 'commentList4');
					}
				}
			}
		}
	}
</script>
<style lang="less">
	section{
		.expression-box{
			.border-radius (@radius) {
			  	border-radius: @radius;
			    -moz-border-radius: @radius;
			    -webkit-border-radius: @radius;
			}
			background-color: #fff;
			padding-bottom: 1.5em;
			height: 100%;
			.express-head{
				.express-info{
					padding: 0;
					.mint-navbar{
						border-bottom: 1px solid #eee;
	    				font-size: 0.34rem;
						.mint-tab-item{
	    					position: relative;
							height:1.2rem;
	    					margin: 0;
	    					text-align: center;
							.mint-tab-item-label{
								display: inline-block;
								width:100%;
								height: 100%;
								font-size: 0.35rem;
		    					h3{
		    						line-height: 0.7rem;
		    						margin-bottom: 0;
		    					}
		    					p{
		    						line-height: 0.5rem;
		    					}
							}
							&.is-selected{
								.mint-tab-item-label{
									border-bottom:1px solid #ff4141;
									margin-bottom:0;
									background-color: #ff4141;
									color: #fff;
								}
								.signs:before{
									background: url(../../static/img/shunfeng_signs2.png) no-repeat;
									background-position: 0 -22px;
		    						background-size: 29px;
			    				}
							}
						}
						.mint-tab-item:not(:first-child):before{
							content: '';
							display: inline-block;
							height: 60%;
							border-left: 1px solid #eee;
						}
					}
					.mint-popup-title{
						color: #ff4141;
					}
	    			ul{
	    				border-bottom: 1px solid #eee;
	    				font-size: 0.34rem;
	    				li{
	    					position: relative;
	    					width: 25%;
	    					margin: 0;
	    					text-align: center;
	    					i{
	    						position: absolute;
							    left: 0;
							    height: 50%;
							    border-left: 1px solid #eee;
							    top: 25%;
	    					}
	    					h3{
	    						line-height: 0.7rem;
	    						margin-bottom: 0;
	    					}
	    					p{
	    						line-height: 0.5rem;
	    					}
	    				}
	    				li.active{
	    					color: #fff;
	    					background-color: #ff4141;
	    					i{
	    						border: none;
	    					}
	    				}
	    				li.active .signs:before{
							background: url(../../static/img/shunfeng_signs2.png) no-repeat;
							background-position: 0 -22px;
    						background-size: 29px;
	    				}
	    			}
				}
    			
			}
			.express-main{
				height: calc(~"100vh - 5.7rem - 46px - 2.4rem");
				overflow-y: auto;
				.no-express{
					text-align: center;
				    line-height: 1rem;
				    color: #999;
				}
				.express-list{
					padding: 3.6% 3.6% 2%;
    				border-bottom: 1px solid #eee;
					.head-pic{
						div{
							position: relative;
							img{
		    					height: 3em;
		    					width: 3em;
		    					.border-radius (50%);
		    				}
		    				span.name{
		    					position: absolute;
							    width: 12em;
							    top: 1em;
							    left: 4em;
		    				}
						}
						.expresses{
							position: relative;
    						top: 0.27rem;
						}
	    				
					}
					.main-express{
	    				.express-bottom{
	    					margin: 1.6% 0;
	    					letter-spacing: 1px;
	    					line-height: 0.55rem;
	    				}
	    				p{
	    					color: #999999;
	    					margin-top: 0.2rem;
	    					.date{
	    						font-size: 0.34rem;
	    					}
	    				}
					}
				}
					
			}
		}
	}
</style>