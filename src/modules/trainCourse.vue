<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container train-course" @click="closeNewPop">
			<p class="is-ready-to-show" v-if="!isShow">加载中...</p>
			<div v-if="isShow">
				<div class="scroll-box" ref="scrollBox">
					<header>
						<div class="course-img">
							<img class="head" v-if="classInfo.projectImage" v-bind:src="$global().imgHost + classInfo.projectImage">
							<!-- <img src="../../static/img/banner/peixun.png"> -->
						</div>
					</header>
					<section>
						<div class="course-shortInfo">
							<h1>
								<span class="course-name">{{classInfo.projectName}}</span>
								<span class="course-info" @click="showInfo = true"><i>简介</i><b class="icon icon-info"></b></span>
							</h1>
							<p class="course-detail">
								<span class="course-finish">{{classInfo.learningCount}}人参与</span> |
								<!-- <span class="course-goodFeedback">好评度{{classInfo.commentStar}}</span> -->
								<span class="course-to"><i>对象：</i>{{classInfo.projectObject}}</span>
								
							</p>
							<div class="course-people">
								<P class="course-master"><i>管理员：</i>{{classInfo.projectAdmin}}</P>
							</div>
						</div>
						<div class="express-info">
							<p class="express-top">
								<span class="good-express signs signs_good">好评度{{expressions.commentStar}}</span>
								<i class="check-express fr" @click="showExpress = true;">查看全部{{expressions.commentCount}}条评价<b class="icon icon-comment"></b></i>
							</p>
						</div>
						<div class="classes">
							<h3>班级</h3>
							<ul class="class-lists clearfix" :class="{showLeast: !showMore}">
								<li class="class-list fl" 
									:class="{active: activeClass == index}" 
									@click.stop="changeClass($event,cla.classStatus,index, cla.id)" 
									v-for="(cla, index) in classInfo.classList"
									style="margin-left:3.6%"><!--  && cla.classStatus == 1 -->
									<div class="title">{{cla.className}}</div>
									<p class="tag" v-if="cla.classStatus == 0" :style="'color: #ff4141'">未开始</p>
									
									<p class="tag" v-else-if="cla.classStatus == 2" :style="'color: #999999;'">已结束</p>
									<p class="tag" v-else-if="cla.classStatus == 3" :style="'color: #f5cb37;'">指定学员</p>
									
									<p class="tag" v-else-if="cla.classStatus == 1" :style="'color: #33cc33;'">报名中</p>
									<div class="m-popup newpop overshow" 
										v-show="(activeClass == index)&&showClass" 
										ref="pop"
										style="padding:5%;top:-4.4rem"
										>
									  	<div class="class-detail-box" v-if="showClass">
									  		<div class="detail-course-short">
												<p>{{chooseClass.maxApplyPerson}}人(已报： {{chooseClass.applyUserCount}}人)</p>
												<p>班主任： {{chooseClass.classManagerName}} ({{chooseClass.classManagerId}})</p>
											</div>
											<div class="detail-course-info">
												<p>学习安排：</p>
												<ul class="each-detail-course-info">
													<li v-for="list in chooseClass.lstLearningPath">
														<ul class="each-detail-course-cato">
															<li v-for="cato in list.learningPath">
																<p><i class="circle"></i>
																	{{cato.coursesName}} | 
																	{{cato.beginDateStr.split(' ')[0]}} | 
																	
																	{{cato.learningType == 0 ? '在线' : (cato.learningType == 1 ? '面授': '考试')}}<span v-if="cato.lecturerName"> | {{cato.lecturerName}}</span><span v-if="cato.addresses"> | {{cato.addresses}}</span></p>
															</li>
														</ul>
													</li>
												</ul>
											</div>

											
											
										</div>
										<div class="close-show-class" @click="closeNewPop">
											<span class="icon icon-close"></span>
										</div>
										<span class="cart"></span>
										
									</div>
								</li>
							</ul>
						</div>
						<div class="train-course-info">
							<!-- 简介弹出框 -->
							<mt-popup class="infomation-popUp" v-model="showInfo" position="bottom"
								:closeOnClickModal="false">
								<infomation-box :introdution="classInfo.projectIntroduction"
												:catolog="''" 
												:coursesId="projectId"
												:courseType="courseType"
												@closeInfo="showInfo = false"
												v-if="showInfo"></infomation-box>
							</mt-popup>
							<!-- 评论弹出框 -->
							<mt-popup class="infomation-popUp" v-model="showExpress" position="bottom"
								:closeOnClickModal="false">
								<expression-box :expressions="expressions" 
												:courseType="courseType" 
												:coursesId="projectId" 
												@closeExpress="showExpress = false"
												v-if="showExpress"></expression-box> 
							</mt-popup>
						</div>
					</section>
				</div>
			
			
				<footer class="tain-course-footer clearfix" v-if="!isHideFooter">
					<div class="fr" :class="isAuthority == 1 ? 'register' : 'noRegister'"><span @click="registerNow">{{currentUserApplyStatus == 1 ? '取消报名' : '我要报名'}}</span></div>
					<div class="fr"><span class="share signs">({{classInfo.shareCount}})</span></div>
					<div class="fr">
						<collect-item :isCollectCount="isCollectCount"
									  :courseCollectCount="courseCollectCount"
									  :courseType="courseType"
									  :coursesId="projectId"
									  v-if="classInfo.collectCount != undefined"></collect-item>
					</div>
				</footer>
			</div>
			
		</div>
	</div>
</template>
<script type="text/javascript">
	import expressionBox from '../components/expressionBox.vue';
	import infomationBox from '../components/infomationBox.vue';
	import collectItem from '../components/collectItem.vue';
	import { Toast } from 'mint-ui';
	import commonHeader from '../components/commonHeader.vue';
	export default{
		components: {
			expressionBox,
			infomationBox,
			collectItem,
			"v-common-header": commonHeader
		},
		data(){
			return{
				isShow: false,
				classInfo: {},
				chooseClass: {},
				showInfo: false,
				showExpress: false,
				showClass: false,
				activeClass: -1,
				projectId: '',
				courseType: 'project',
				expressions:{},
				isAuthority: 0,//是否能报名 0否 1是
				chooseClassId: '',
				isHideFooter: false, //弹出框出现时隐藏footer
				showMore: 1,
				currentClassStatus: 0,//0未开始 1报名中 2已结束 3指定学员
				currentUserApplyStatus: 0,//当前用户是否已报名 0否 1是
				popTop: 0,
				popLeft: 0,
				cartLeft: 0,
				courseCollectCount: 0,
				isCollectCount: 1

			}
		},
		mounted(){
			this.projectId = this.$route.params.ID;
			//项目基本信息
			var classUrl = this.$global().host+'/KMS-MSERVER/learning/project/viewProject?projectId='+ this.projectId;	
			this.$http.get(classUrl).then(function(data) {
				this.isShow = true;
				if(data.data.data.result){
					MessageBox({
					  	title: '',
					  	message: data.data.data.result,
					  	confirmButtonText: '返回',
					  	showCancelButton: false,
						closeOnClickModal: false
					}).then(function(action){
						if(that.$route.query.scan){
							try {
						
						 		ExpressPlugin.backToWidget();
							} catch (e) {
							}
						}else{
							that.$router.go(-1);
						}
					});
				}else{
					this.classInfo = data.data.data;
					this.courseCollectCount = this.classInfo.collectCount;
					this.isCollectCount = this.classInfo.isCollectCount;
					this.isAuthority = data.data.data.authority;
				}
			});	

			//评论信息
			var expressUrl = this.$global().host + '/KMS-MSERVER/learning/viewComment/project/' + this.projectId + '?commentType=0';
			this.$http.get(expressUrl).then(function(data) {
				this.expressions = data.data.data;
			});				

		},
		methods: {
			changeClass: function(event,classStatus, index, classId){//点击显示班级详情
				let _target = event.currentTarget;
				let _popEle = _target.children[2];
				if(event.target.className.indexOf('icon')>-1){
					return;
				}
				var that = this;
				this.currentClassStatus = classStatus;
				this.activeClass = index;
				this.showClass = true;	
				this.chooseClassId = classId;
				var classUrl = this.$global().host+'/KMS-MSERVER/learning/project/viewClass?classId='+ classId;
				this.$http.get(classUrl).then(function(data) {
					this.chooseClass = data.data.data;
					this.currentUserApplyStatus = data.data.data.userApplyStatus
				});
				
			},
			closeNewPop() {
				this.activeClass = -1;
				this.popPaddingBottom = 164;
			},
			registerNow: function(){//我要报名
				if(this.isAuthority != 1){
					return Toast({message: '该项目不能报名', duration: 1000});
				}
				if(this.activeClass == -1){
					return Toast({message: '请选择班级！', duration: 1000});
				}
				if(this.currentClassStatus != 1){
					return Toast({message: '该班级不能报名', duration: 1000});
				}

				if(this.currentUserApplyStatus == 1){
					var doType = 1;
				}else{
					var doType = 0;
				}

				var classUrl = this.$global().host+'/KMS-MSERVER/learning/project/applyClass/'+ this.chooseClassId + "?doType=" + doType;
				this.$http.get(classUrl).then(function(data) {
					Toast({message: data.data.data.result, duration: 1000});
					this.currentUserApplyStatus = 0;
				});
				
								
				
			}
		},
		watch: {
			showInfo(val, oldVal){
				if(val == true){
					this.isHideFooter = true;
					//this.$refs.scrollBox.style['overflow-y'] = 'hidden';
				}else{
					this.isHideFooter = false;
					//this.$refs.scrollBox.style['overflow-y'] = 'auto';
				}
			},
			showExpress(val, oldVal){
				if(val == true){
					this.isHideFooter = true;
					//this.$refs.scrollBox.style['overflow-y'] = 'hidden';
				}else{
					this.isHideFooter = false;
					//this.$refs.scrollBox.style['overflow-y'] = 'auto';
				}
			}
		}
	}
</script>
<style lang="less">
@import "../css/customFn.less";
/*.chooseClassMess{
	padding: 8px 19px!important;
    background-color: rgba(0,0,0,.5);
    border-radius: 25px;
}*/
	.train-course{
		background-color: #eee;
		&.contianer{
			overflow: hidden;
		}
		header{
			background-color: #fff;
			.course-shortInfo{
				border-bottom: none;
			}
			
		}
		section{
			padding-bottom: 0!important;
			.express-info{
				margin-bottom: 3.6% !important;
				padding-bottom: 0 !important;
				.express-top{
					background-color: #fff;
				}
			}
			.infomation-popUp{
				height: calc(~"100vh - 5.7rem - 46px");
			}
			.classes{
				background-color: #fff;
				padding: 3.6% 0;
				padding-top: 0;
				h3{
				    line-height: 1rem;
				    padding-left: 3.6%;
				    font-size: 0.45rem;
				}
				.class-lists{
					.class-list{
						position: relative;
					    width: 44.6%;
					    margin-left: 3.6%;
					    padding: 2% 0;
					    text-align: center;
					    //overflow: hidden;
					    font-size: 0.4rem;
					    background-color: #f2f2f2;
					    margin-bottom: 3.6%;
					    background: url("../../static/img/sel.png") no-repeat;
					    background-size: 100% 100%;
						div{
							&.title{
								overflow: hidden;
							    text-overflow: ellipsis;
							    margin-bottom: 5px;
							    white-space: nowrap;
							    padding: 0 5px;	
							    line-height: 0.6rem;
							}
							
						}
						.tag{
							font-size: 0.3rem;
						}
						&:nth-child(odd){
							.newpop{
								left: 0%;
								.cart{
									left: 24%;
								}
							}
						}
						&:nth-child(even){
							.newpop{
								left: -108%;
								.cart{
									left: 76%;
								}
							}
						}
					}
					li.active{
					    //color: #fff;
					    box-sizing: border-box;
					    position: relative;
					    div, p{
					    	//color: #fff !important;
					    }
					    p{
					    	white-space: normal;
					    }
					    background: url("../../static/img/sel_a1.png") no-repeat;
					    background-size: 100% 100%;
					}/*
					li.active:before{
						content: "";
					    position: absolute;
					    border: 11px solid red;
					    border-top-color: transparent;
					    border-left-color: transparent;
					    bottom: 0;
					    right: 0;
					}
					li.active:after{
						content: "";
					    position: absolute;
					    border-left: 30px solid transparent;
					    border-right: 30px solid transparent;
					    border-bottom: 20px solid #F5BA8A;
					    top: 25px;
					    left: 24px;
					}*/
					.class-list:not(:nth-child(2n-1)){
						margin-left: 3.6%;
					}
				}
				.showLeast{
					max-height: 4em;
    				overflow: hidden;
				}
			}
			.train-course-info{
				margin-top: 12px;
    			background-color: #fff;
			}
			.class-list{
				.detail-course-info{
					color: #fff;
					line-height: 2em;
					font-size: 0.9em;
					//height: 3.8rem;
					//overflow: auto;
					.each-detail-course-info{
						height: 1.8rem;
						overflow: auto;
						li{
							line-height: 0.6rem;
						}
					}
					.circle{
						display: inline-block;
					    width: 2px;
					    height: 2px;
					    background-color: #666;
					    border-radius: 50%;
					    position: relative;
					    top: -3px;
					    margin-right: 7px;
					}
				}
				.m-popup{
					background-color: rgba(0, 0, 0, 0.65);
					border-radius: 0px;
					//height: 0px;
					&.newpop{
						position: absolute;
						z-index: 200;
						height: auto;
						height: 3.6rem;
						text-align: left;
						font-size: 0.32rem;
						width: 198%;
						&.overshow{
							overflow:visible;
						}
						.detail-course-short{
							p{
								color: #fff;
							}
						}
					}
					//.transform-translateXY (-50%,0%,0%);
					.cart{
						position: absolute;
						bottom: -16px;
						border-top:8px solid rgba(0, 0, 0, 0.65);
						border-bottom:8px solid transparent;
						border-left:8px solid transparent;
						border-right:8px solid transparent;
						.transform-translateX (-50%);
						//background-color: rgba(0, 0, 255, 0.8);
					}
					.close-show-class{
						position: absolute;
					    top: -9px;
					    right: -2.5%;
					    width: 20px;
					    height: 20px;
						text-align: center;
						line-height: 3em;
						// border-top: 1px solid #d7d7db;
						font-size: 1.1em;	
						.icon-close{
							display: block;
							width: 100%;
							height: 100%;
							background:url("../../static/img/close.png") no-repeat;
							background-size: 100%;
							opacity: 0.8;
						}				
					}
				}
				.v-modal{
					background-color: transparent;
				}
			}
			
			.showClass{
				width: 86.8%;
				height: 125px;
				padding: 0 5%;
				// overflow:hidden;
				border-radius: 2px;
				.class-detail-box{
					height: 100%;
    				position: relative;
					.detail-course-name{
						line-height: 2.5em;
						text-align: center;
					    font-size: 1.2em;
					    border-bottom: 1px solid #d7d7db;
					}
					.detail-course-short{
						// text-align: center;
					    padding: 3.6% 0;
					    font-size: 12px;
					    color: #fff;
					}
					
				}
			}
		}
		.scroll-box{
			section{
				background: #f2f2f2;
			}
		}
		footer.tain-course-footer{
			.noRegister{
				background-color: #999;
				color: #fff;
				border-color: #999;
			}
		}
	}
</style>