<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container online-detail">
			<p class="is-ready-to-show" v-if="!isShow">加载中...</p>
			<div v-if="isShow">
				<div class="scroll-box">
					<header>
						<div class="course-img" :class="{showVideo : showVideo}">
							<div class="img-box">
								<div class="tips" v-if="classInfo.isOfficial || classInfo.isOriginal">
									<span class="signs" :class="classInfo.isOfficial ? 'official' : 'original'"></span>
								</div>
								<img class="head" v-if="classInfo.coursesImage" :src="$global().imgHost + classInfo.coursesImage">
								<!-- 视频 -->
								<img v-if="classInfo.fileType == 0" class="play" @click="playVideo" src="../../static/img/play.png">
								<!-- 文档 -->
								<a  v-else-if="classInfo.fileType == 1" @click="saveUserCourses(officeUrl)">
									<img class="play" src="../../static/img/play.png">
								</a>
								<!-- 图片 -->
								<a v-else-if="classInfo.fileType == 2" 
											 @click="saveUserCourses('/onlineCourseOffice/' + coursesId + '?type=' + classInfo.fileType)">
									<img class="play" src="../../static/img/play.png">
								</a>
								<!-- scorm -->
								<a v-else-if="classInfo.fileType == 3" 
											 @click="saveUserCourses('/onlineCourseOffice/' + coursesId + '?type=' + classInfo.fileType)">
									<img class="play" src="../../static/img/play.png">
								</a>
							</div>
							

							<video v-if="showVideo" :src="$global().imgHost + classInfo.fileAdd" preload autoplay ref="courseVideo" controls="controls" webkit-playsinline>
								不支持该视频格式播放
							</video>
						</div>
					</header>
					<section class="online-course">

						<!-- 课程简介 -->
						<course-short-info  :classInfo="classInfo"
											@showInfomation="showInfo = true"></course-short-info>
						<!-- 评论 -->
						<express-short-info :expressions="expressions"
											@showExpressions="showExpress = true"></express-short-info>

						<!-- 课程简介弹出框 -->
						<mt-popup class="infomation-popUp" v-model="showInfo" position="bottom">
							<infomation-box :introdution="classInfo.coursesIntroduction"
											:coursesId="coursesId"
											:catolog="classInfo.directory" 
											@closeInfo="showInfo = false"
											:courseType="courseType"
											v-if="showInfo"></infomation-box>
						</mt-popup>

						<!-- 评论弹出框 -->
						<mt-popup class="infomation-popUp" v-model="showExpress" position="bottom">
							<expression-box :expressions="expressions" 
											:courseType="courseType" 
											:coursesId="coursesId"
											@closeExpress="showExpress = false"
											v-if="showExpress"></expression-box>
						</mt-popup>

						<!-- 写评论弹出框 -->
						<mt-popup v-model="showWriteBox" position="bottom" :class="!startToInput ? 'mint-popup-init' : 'mint-popup-input'">
							<write-expression-box v-if="showWriteBox"
												  :coursesId="coursesId"
												  @watch="changeInput"
												  @closeExpress="showWriteBox = false"></write-expression-box>
						</mt-popup>
						<div class="onloading" v-show="showOnloading">
							<p>加载中</p>
							<mt-spinner type="triple-bounce" color="#f7f7f7"></mt-spinner>
						</div>
					</section>
				</div>
				
			
				<footer class="online-course-footer clearfix" v-if="!showWriteBox && !showInfo && !showExpress">
					<div class="fr"><span class="write-express signs" @click="showWriteBox = true">写评论</span></div>
					<div class="fr"><span class="share signs">({{classInfo.shareCount}})</span></div>
					<div class="fr">
						<collect-item :isCollectCount="isCollectCount"
									  :courseCollectCount="courseCollectCount"
									  :courseType="courseType"
									  :coursesId="coursesId"
									  v-if="classInfo.collectCount != undefined"></collect-item>
					</div>
					<!-- <div><span class="newsigns" :class="isCollectCount == 1 ? 'isCollect': 'notCollect'" @click="collect">({{courseCollectCount}})</span></div> -->
				</footer>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import expressionBox from '../components/expressionBox.vue';
	import infomationBox from '../components/infomationBox.vue';
	import writeExpressionBox from '../components/writeExpressionBox.vue';
	import collectItem from '../components/collectItem.vue';
	import courseShortInfo from '../components/courseShortInfo.vue';
	import expressShortInfo from '../components/expressShortInfo.vue';
	import { MessageBox, Toast } from 'mint-ui';
	import commonHeader from '../components/commonHeader.vue';
	export default{
		components: {
			expressionBox,
			infomationBox,
			writeExpressionBox,
			collectItem,
			expressShortInfo,
			courseShortInfo,
			"v-common-header": commonHeader
		},
		data(){
			return {
				isShow: false,
				classInfo: {},
				showInfo: false,
				showExpress: false,
				expressions: {},
				coursesId: '',
				courseType: 'courses',
				showWriteBox: false,
				showVideo: false,
				courseCollectCount: 0,
				isCollectCount: 1,
				startToInput: false,
				videoCurrentTime:0,//视屏播放时间
				videoInitTime: 20,//上次记录时间
				player: null,
				officeUrl: '#',
				showOnloading: false,
				isToUseHref: false
			}
		},
		beforeRouteEnter(to, from, next){
			next(vm => {
				try{
					function success(releaseVersion){
						console.log(releaseVersion);
						var version = releaseVersion;
						if(Number(version.split('.').join('')) > 340){
							vm.isToUseHref = true;
						}else{
							vm.isToUseHref = false;
						};
					}
					function fail(error){
					    console.log(error);
					}
					ExpressPlugin.getAppReleaseVersion(success,fail);
				}catch(err){
					console.log(err);
				}
			});
			
		},
		beforeDestroy(){
			document.getElementsByClassName('mint-header')[0].style.height = '46px';
			if(this.showVideo){
				try {
					ExpressPlugin.showStatusBar();
				}catch(e){}
				//this.player.dispose();
			}
			this.showOnloading = false;
		},
		mounted(){
			var that = this;

			document.getElementsByClassName('mint-header')[0].style.height = '47px';

			that.coursesId = this.$route.params.ID;
			var classUrl = that.$global().host+'/KMS-MSERVER/learning/courses/viewCourses?coursesId=' + that.coursesId;
			
			that.$http.get(classUrl).then(function(data) {
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
					that.classInfo = data.data.data;
					that.courseCollectCount = that.classInfo.collectCount;
					that.isCollectCount = that.classInfo.isCollectCount;
					if (this.classInfo.fileType == 1) {
						this.getOffice();
					}
				}
				this.isShow = true;
			});

			that.getExpressions(that.coursesId);
		},
		methods:{
			changeInput(val){
				var ua   = navigator.userAgent.toLowerCase();  
				var Android = String(ua.match(/android/i)) == "android";
				if(Android){
					this.startToInput = val;
				}
			},
			/*showLoading(){
				if(this.ifIOS){
					this.showOnloading = true;
				}
			},*/
			getOffice(){
				let that = this;

				var nav = navigator.userAgent;
				if(nav.indexOf('iPhone') >=0){
					this.ifIOS = true;
				}else{
					this.ifIOS = false;
				}
				that.$http.get(that.$global().host + '/KMS-MSERVER/learning/courses/viewCoursesFile?coursesId=' + this.coursesId).then(
					response=>{
						if(!response.body.data || (response.body.data.length == 0)){
							return that.showOnloading = false, Toast({message: '没有数据！', duration: 1000});
						}
						var end = response.body.data[0].addresses.toLowerCase().slice(-3);
						if(!that.isToUseHref){
							that.officeUrl = '/onlineCourseOffice/' + that.coursesId + '?type=' + that.classInfo.fileType;
						}else{
							that.officeUrl = that.$global().officeHost + '?url=' + that.$global().idvHost + response.body.data[0].addresses + '&token=cyberwisdomsupport';
						}
							
					}
				)
			},
			getExpressions: function(){
				var that = this;
				var expressUrl = that.$global().host + '/KMS-MSERVER/learning/viewComment/courses/' + that.coursesId + '?commentType=0';
				that.$http.get(expressUrl).then(function(data) {
					that.expressions = data.data.data;
				});
			},
			playVideo: function(){	
				let that = this;	
				that.saveUserCourses();
				that.showVideo = true;
				var houzhui = this.classInfo.fileAdd.slice(-3).toLocaleLowerCase();
				if(houzhui.indexOf('mp4') < 0){
					Toast({
						message: '不支持该视频格式播放',
						className: 'changeIndex',
						duration: 2000
					});
				}else{
					setTimeout(function(){
						that.$refs.courseVideo.play();
						that.autoFullScrenn(that.$refs.courseVideo,that);
					},10);
				}
			},
			saveUserCourses(url){
				console.log(url);
				//debugger;
				let that = this;
				that.$http.get(that.$global().host + '/KMS-MSERVER/learning/courses/saveUserCourses/' + that.coursesId).then(response => {
					//开启学习记录
					if(response.body.status == 1){
						if(url){
							this.$router.push({ path: url})
						}
						
					}
				});
			},
			setPage(direct){
				if(direct=='Horizontal'){
					try{
						ExpressPlugin.deviceChangeToHorizontal(()=>{
							console.log('change to horizontal:success');
						},()=>{
							console.log('change to horizontal:fail');
						});
					}catch(e){}
				}else{
					try{
						ExpressPlugin.deviceChangeToVertital(()=>{
							console.log('change to vertical:success');
						},()=>{
							console.log('change to vertical:fail');
						});
					}catch(e){}
				}
			},
			fullscreen(elem) {
				var prefix = 'webkit';
				  if ( elem[prefix + 'EnterFullScreen'] ) {
					return prefix + 'EnterFullScreen';
				  } else if( elem[prefix + 'RequestFullScreen'] ) {
					return prefix + 'RequestFullScreen';
				  };
				return false;
			},
			autoFullScrenn(v,that) {
				var ua   = navigator.userAgent.toLowerCase();  
				var Android = String(ua.match(/android/i)) == "android";
				if(!Android) return;//非android系统不使用;
				var video  = v,doc = document;
				var fullscreenvideo = that.fullscreen(doc.createElement("video"));
				if(!that.fullscreen) {
					alert("不支持全屏模式");
					return;
				}
				video.addEventListener("webkitfullscreenchange",function(e){
					if(!Android){
						if(!doc.webkitIsFullScreen){//退出全屏暂停视频
							ExpressPlugin.showStatusBar();
						}
					}else{
						if(!doc.webkitIsFullScreen){//退出全屏暂停视频
							that.setPage('Vertical');
						}else{
							that.setPage('Horizontal')
						}
					}
				}, false);
				video.addEventListener("fullscreenchange",function(e){
					if(!Android){
						if(!doc.fullScreen){//退出全屏暂停视频
							ExpressPlugin.showStatusBar();
						}
					}else{
						if(!doc.fullScreen){//退出全屏暂停视频
							that.setPage('Vertical');
						}else{
							that.setPage('Horizontal')
						}
					}
				}, false);
				video.addEventListener("mozfullscreenchange",function(e){
					if(!Android){
						if(!doc.mozFullScreen){//退出全屏暂停视频
							ExpressPlugin.showStatusBar();
						}
					}else{
						if(!doc.mozFullScreen){//退出全屏暂停视频
							that.setPage('Vertical');
						}else{
							that.setPage('Horizontal')
						}
					}
				}, false);
				video.addEventListener("msfullscreenChange",function(e){
					if(!Android){
						if(!doc.msIsFullScreen){//退出全屏暂停视频
							ExpressPlugin.showStatusBar();
						}
					}else{
						if(!doc.msIsFullScreen){//退出全屏暂停视频
							that.setPage('Vertical');
						}else{
							that.setPage('Horizontal')
						}
					}
				}, false);
				// video.addEventListener("click", function(){
				// 	v.play();
				// 	video[fullscreenvideo]();
				// }, false);
				video.addEventListener('ended',function(){
					doc.webkitCancelFullScreen(); //播放完毕自动退出全屏
				},false);
			}
		},
		watch: {
			showWriteBox(val){//关闭写评论框之后更新评论信息
				if(!val){
					this.getExpressions();
				}
			}
		}
	}
</script>
<style lang="less">
	@import '../css/customFn.less';
	.changeIndex{
		z-index: 3000 !important;
	}

	.online-detail,.face-to-face-course, .train-course{
		.scroll-box{
			height: calc(~"100vh - 46px");
			overflow-y: auto;
			background-color: #f2f2f2;
			header{
				//height: 40%;
				height: 5.7rem;
				.course-img{
					position: relative;
					overflow: hidden;
					height: 100%;
					.img-box{
						height: 100%;
					}
					img.head,video{
						width: 100%;
					    display: block;
					    height: 100%;
					}
					img.play,video{
						position: absolute;
					}
					img.play{
						height: 20%;
					    left: 50%;
					    margin-left: -2.5em;
					    top: 40%;
					}
					.tips{
						position: absolute;
						top: 0;
						//transform: rotate(-45deg) translate(-26px, -14px);
						span{
						    color: #eee;
						    padding: 2px 30px 4px;
						    font-size: 0.38rem;
						    background-size: 100%;
						    &:before {
						    	width: 1.44rem;
						    	height: 1.17rem;
						    }
						}
						.official:before{
							.bgPosition(@signsWidth, @signsHeight, 60, 64, 0, 168);
							background-size: 77%;
						}
						.original:before{
							.bgPosition(@signsWidth, @signsHeight, 60, 64, 0, 241);
							background-size: 77%;
						}
					}
				}
				.showVideo{
					.img-box{
						opacity:0;
					}
					video{
						top: -1px;
						z-index: 10;
					}
				}
				
			}
			section{
				padding-bottom: 3.6%;
				margin-bottom: 65px;
				.course-shortInfo{
					width: 92.8%;
	    			padding: 3.6% 3.6% 0;
	    			padding-bottom: 7.2%;
	    			border-bottom: 1px solid #eee;
	    			background: #fff;
	    			h1{
	    				.course-name{
							font-size: 0.45rem;
							white-space: nowrap;
						    width: 83%;
						    overflow: hidden;
						    display: inline-block;
						    text-overflow: ellipsis;
						}
						.course-info{
							float: right;
						    /* line-height: 2em; */
						    color: #999999;
						    margin-top: 3px;
						}
	    			}
					
					.course-detail{
					    margin-top: 2%;
					    font-size: 0.32rem;
					    color: #666666;
					    width: 100%;
					    text-overflow: ellipsis;
					    overflow: hidden;
					    white-space: nowrap;
					}
					.course-people{
	    				color: #999999;
	    				margin-top: 3.6%;
	    				p{
							margin-top: 1%;
	    				}
					}
				}
				.express-info{
					font-size: 0.38rem;
					background-color: #fff;
					padding-bottom: 3.6%;
				    .express-top{
					    padding: 4% 3.6%;
					    .good-express{
					    	color: #ff4141;
				    		padding-left: 30px;
					    }
				    }
				    .check-express{
				    	color: #999999;
				    	font-size: 12px;
				    }
				    ul{
				    	li{
				    		width: 25%;
				    		text-align: center;
				    		h3{
				    			margin-bottom: 0.3em;
				    		}
				    	}
				    }
				    .icon-comment{
				    	display: inline-block;
				    	width: 16px;
				    	height: 16px;
				    	vertical-align: middle;
				    	margin-left: 8px;
				    	background:url('../../static/img/shunfeng_signs.png') #fff no-repeat;
				    	background-position: 0 -504px;
				    	background-size: 32px;
				    }
				}
			}
		}
		footer{
			background-color: #f5f7fa;
			line-height: 52px;
			border: none;
			font-size: 0.45rem;
			text-align: center;
			position: absolute;
		    bottom: 0px;
		    width: 100%;
		    height: 53px;
		    z-index: 300;
		    font-family: Microsoft YaHei;
		    /*max-height: 50px;*/
			div{
				width: calc(~"28% - 2px");
				display: inline-block;
			}
			div:not(:first-child){
				border-top: 1px solid #e6e6e6;
			}
			div:nth-child(2){
				border-left: 1px solid #e6e6e6;
			}
			div:first-child{
				background-color: #ff4141;
    			color: #fff;
    			width: calc(~"100% - (56% - 2px)");
    			border-right: 1px solid #ff4141;
    			border-bottom: 1px solid #ff4141;
			}
		}
		.signs_good:before, .signs_middle:before, .signs_worse:before{
			top: -1px;
		}
		.signs_good:before{
			background-position:  0 -570px;
		}
		.signs_middle:before{
			background-position:  0 -593px;
		}
		.signs_worse:before{
			background-position:  0 -616px;
		}
		.isCollect{
			color: #ff4141;
		}
		.share{
			padding-left: 30px;
		}
		.notCollect:before, .isCollect:before{
			background-size: 21px;
		    top: 0px;
		}
		.notCollect:before{
			background-position: 0px -24px;
		}
		.isCollect:before{
			background-position: 0px 0px;
		}
		.share:before{
		    background-position: 0 -566px;
		    background-size: 30px;
		    top: 0px;
		    
		}
	}
	.online-detail{
		section.online-course{

		.onloading{
			position: absolute;
		    height: 1rem;
		    width: 3rem;
		    top: 50%;
		    left: 50%;
		    text-align: center;
		    line-height: 0.6rem;
		    padding: 0.5rem 0;
		    margin-left: -1.5rem;
		    margin-top: calc(~"-1rem - 23px");
		    background-color: rgba(0,0,0,.2);
		    color: #fff;
		    font-size: 0.4rem;
		    border-radius: 5px;
		    z-index: 2000;
		}
			.infomation-popUp{
				height: calc(~"100vh - 5.7rem - 46px");
			}
			.mint-popup-init{
				height: calc(~"100vh - 5.7rem - 46px");
			}
			.mint-popup-input{
				height: calc(~"100vh - 46px");
			}
		}
		footer{
			.write-express:before{
				background-position: 0 -775px;
    			left: -5px;
			}
			
		}
	}
</style>