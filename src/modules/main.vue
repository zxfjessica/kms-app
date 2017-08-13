<template>
	<!-- <transition name="rightToleft"> -->
	<div>
		<v-common-header>
			<!-- <mt-button slot="rightContent" :style="'position: relative; top: 3px;'">
			 	<router-link to="/messageLists" name="消息"><img class="message" src="../../static/img/message.png"></router-link>
			</mt-button> -->
		</v-common-header>
		<div class="container homePage">
			<p class="is-ready-to-show" v-if="showOnloading">加载中...</p>
			<div v-if="!showOnloading" style="height:100%">
				<div class="ctn-wrapper" ref="ctnWrapper" @scroll="wrapperScrollHandler">
					
					<div @click="searchHandler" class="search">
						<div class="search-box">
							<i class="icon-search"></i>
							搜索学习内容
						</div>
					</div>
					<mt-swipe :auto="4000">
						<mt-swipe-item v-for="swiper in swipers">
							<a  v-if="swiper.moduleId == 'project'" 
								:href="'#/trainCourse/' + swiper.targetId + '?from=main'">
									<img :src="$global().imgHost+swiper.imagePath">
							</a>
							<a  v-else-if="swiper.moduleId == 'course' && swiper.coursesType == 0" 
								:href="'#/onLineCourse/' + swiper.targetId + '?from=main'">
									<img :src="$global().imgHost+swiper.imagePath">
							</a>
							<a  v-else-if="swiper.moduleId == 'course' && swiper.coursesType == 1" 
								:href="'#/faceToFaceCourse/' + swiper.targetId + '?from=main'">
									<img :src="$global().imgHost+swiper.imagePath">
							</a>
							<a  v-else-if="swiper.moduleId == 'studyNews'" 
								:href="'#/consultDetail/' + swiper.targetId">
									<img :src="$global().imgHost+swiper.imagePath">
							</a>
						</mt-swipe-item>
					</mt-swipe>
					<div class="navbar">
						<ul class="navbar-list">
							<li class="navbar-item">
								<a href="#/courseTypes"><img src="../../static/img/kechengfenlei.png"></a>
								<p>课程分类</p>
							</li>
							<li class="navbar-item">
								<a :href="'#/myClasses?type=0'"><img src="../../static/img/wodexuexi.png"></a>
								<p>学习任务</p>
							</li>
							<li class="navbar-item">
								<a :href="'#/myExamList?type=0'"><img src="../../static/img/wodekaoshi.png"></a>
								<p>考试</p>
							</li>
							<li class="navbar-item">
								<a href="#/mySurvey?type=0"><img src="../../static/img/wodediaoyan.png"></a><!--  敬请期待-->
								<p>调研</p>
							</li>
							<li class="navbar-item">
								<a href="#/knowledge/expertList"><img src="../../static/img/expert.png"></a><!--  敬请期待-->
								<p>专家达人</p>
							</li>
							<div class="clearfix"></div>
						</ul>
					</div>
					<div class="learning-news">
						<img src="../../static/img/tu_03.png">
						<div class="neirong">
							<div class="first" ref="learningNews">
								<p v-for="(item, index) in dynamic" :id="'item' + index" class="neirong-item">
									<a v-if="item.type == 'project'"  :href="'#/trainCourse/'+item.id">
										<span class="box">{{item.type&&dynamicType[item.type]}}</span>
										<span class="text">{{item.title}}</span>
									</a>
									<a v-if="item.type == 'course'"  :href="item.coursesType ? 
											  		'#/faceToFaceCourse/' + item.id : 
											  		'#/onLineCourse/' + item.id">
										<span class="box">{{item.type&&dynamicType[item.type]}}</span>
										<span class="text">{{item.title}}</span>
									</a>
									<a v-if="item.type == 'information'" :href="'#/consultDetail/' + item.id">
										<span class="box">{{item.type&&dynamicType[item.type]}}</span>
										<span class="text">{{item.title}}</span>
									</a>
								</p>
							</div>
						</div>
						
					</div>
					<div class="main-container">
						<div class="project-recommon recommond">
							<h1 class="title clearfix">
								<b :style="'background-color: #' + color[0]"></b>
								<span>推荐</span>
								<!-- <i class="fr"></i> -->
							</h1>
							<recommond-list :recommend="recommend" 
											:number="6"
											v-if="recommend.length > 0"></recommond-list>
						</div>

						<div class="project-recommon">
							<router-link to="/CourseList/-1?courseType=1">
								<h4 class="title clearfix">
									<!-- <i class="color-block"></i> -->
									<b :style="'background-color: #' + color[1]"></b>
									<span>在线课程</span>
									
										<i class="fr"></i>
									
								</h4>
								
							</router-link>
							<ul class="project-lists  clearfix">
								<li class="project-item" v-for="cla in classes" :pro-id="cla.id">
									<a v-if="cla.coursesType == 0" :href="'#/onLineCourse/'+cla.id">
										<img :src="$global().imgHost+cla.coursesImage"/>
										<span class="file-type" :class="cla.fileType == 0 ? 'video' : 
																		cla.fileType == 1 ? 'file' :
																		cla.fileType == 2 ? 'picture': 'scorm'"></span>
									</a>
									<a v-else :href="'#/faceToFaceCourse/'+cla.id"><img :src="$global().imgHost+cla.coursesImage"/></a>
									<div class="pro-info">
										<p class="pro-title">{{cla.coursesName}}</p>
										<p class="pro-view clearfix">
											<span>{{cla.coursesType == 1?'面授':'在线'}}</span>
											<span class="fr">{{cla.userCount}}人学习</span>
										</p>
									</div>
									<span class="mark" :class="cla.isOfficial?'office':'origin'" v-if="cla.isOfficial||cla.isOriginal"></span>
								</li>
							</ul>
						</div>

						<div class="project-recommon">
							<router-link to="/CourseList/-1?courseType=2">
								<h4 class="title clearfix">
									<!-- <i class="color-block"></i> -->
									<b :style="'background-color: #' + color[2]"></b>
									<span>面授课程</span>
									
										<i class="fr"></i>
									
								</h4>
								
							</router-link>
							<ul class="project-lists  clearfix">
								<li class="project-item" v-for="cla in classesFace" :pro-id="cla.id">
									<a v-if="cla.coursesType == 0" :href="'#/onLineCourse/'+cla.id"><img :src="$global().imgHost+cla.coursesImage"/></a>
									<a v-else :href="'#/faceToFaceCourse/'+cla.id"><img :src="$global().imgHost+cla.coursesImage"/></a>
									<div class="pro-info">
										<p class="pro-title">{{cla.coursesName}}</p>
										<p class="pro-view clearfix">
											<span>{{cla.coursesType == 1?'面授':'在线'}}</span>
											<span class="fr">{{cla.userCount}}人学习</span>
										</p>
									</div>
									<span class="mark" :class="cla.isOfficial?'office':'origin'" v-if="cla.isOfficial||cla.isOriginal"></span>
								</li>
							</ul>
						</div>
						
						<div class="project-recommon">
							<router-link to="/ProjectList/-1">
								<h4 class="title clearfix">
									<b :style="'background-color: #' + color[3]"></b>
									<span>项目</span>
									
									<i class="fr"></i>
								</h4>
								
							</router-link>
							<ul class="project-lists clearfix">
								<li class="project-item" v-for="pro in projects" :pro-id="pro.id">
									<a v-bind:href="'#/trainCourse/'+pro.id"><img :src="$global().imgHost+pro.projectImage"/></a>
									<div class="pro-info">
										<p class="pro-title">{{pro.projectName}}</p>
										<p class="pro-view clearfix">
											<span class="subject">{{pro.organizationName}}</span>
											<span class="fr">{{pro.applyCount}}人参与</span>
										</p>
									</div>
								</li>
								</ul>
						</div>

						<div class="project-recommon lecturer-Mien-wrapper">
							<router-link to="/TeacherList/-1">
								<h4 class="title clearfix">
									<!-- <i class="color-block"></i> -->
									<b :style="'background-color: #' + color[4]"></b>
									<span>讲师</span>
									<i class="fr"></i>
								</h4>	
							</router-link>
							<v-lecturer-mien
								:content="[lecturers1,lecturers2,lecturers3]">
								</v-lecturer-mien>
						</div>
					</div>
				</div>
			</div>
			<v-common-footer :active="1"></v-common-footer>
		</div>	
	</div>
	<!-- </transition> -->
	
</template>
<script>

import recommondList from '../components/recommondList.vue';
import lecturerMien from '../components/lecturerMien.vue';
import commonHeader from '../components/commonHeader.vue';
import commonFooter from '../components/commonFooter.vue';
export default{
	components: {
		recommondList,
		"v-lecturer-mien":lecturerMien,
		"v-common-header": commonHeader,
		"v-common-footer": commonFooter
	},
	data(){
		return {
			swipers: [],
			projects: [],//推荐项目
			classes:[],//在线课程
			classesFace: [],//面授课程
			recommend:[],//推荐数据
			index: 0,
			color: ['33cc33', 'f15e4c', 'b273c2', 'f5cb37', '00aeef'],
			dynamicType:{//动态类型显示
				information:'资讯',
				course: '课程',
				project: '项目'
			},
			scrollTop: 0,
			loadArr: [],
			lecturers: [],
			showOnloading: true,
			loadCount: 0
		}
	},
	computed: {
		lecturers1() {
			return this.lecturers.slice(0,3);
		},
		lecturers2() {
			return this.lecturers.slice(3,6);
		},
		lecturers3() {
			return this.lecturers.slice(6,9);
		},
	},
	beforeRouteEnter(to,from,next) {
		next(
			vm => {
				if(from.path != '/'){
					
					vm.scrollTop = JSON.parse(localStorage.getItem('index'))['scrollTop']; 
				}else{
					vm.scrollTop = 0;
				}
			}
		);
	},
	beforeDestroy() {
		let data = {};
		data['scrollTop'] = this.scrollTop;
		localStorage.setItem('index',JSON.stringify(data));
		clearInterval(this.timer);
	},
	mounted() {
		let that = this;
		//this.getData('/KMS-MSERVER/learnhome/advert/list','swipers','GET',{},this.endFn);//焦点图数据获取
		//this.getData('/KMS-MSERVER/learnhome/dynamic/list','dynamic','GET',{},this.endFn);//动态数据获取
		//this.getData('/KMS-MSERVER/learnhome/recommend/list','recommend','GET',{},this.endFn);//推荐数据获取	
		//this.getData('/KMS-MSERVER/learnhome/project/list','projects','GET',{},this.endFn);//推荐项目
		//this.getData('/KMS-MSERVER/learnhome/course/list?type=0','classes','GET',{},this.endFn);//推荐课程	
		//this.getData('/KMS-MSERVER/learnhome/course/list?type=1','classesFace','GET',{},this.endFn);//推荐课程	
		//this.getData('/KMS-MSERVER/learning/lecturerSearch/list?type=0','lecturers','GET',{},this.endFn);//推荐课程	
		

		var index = 0;
		this.timer = setInterval(function(){
			if(index > 2){
				index = 0;
			}
			if(index ==0){
				that.setDocumentDisplay('item0', 'block');
				that.setDocumentDisplay('item1', 'block');
				that.setDocumentDisplay('item2', 'none');
				that.setDocumentDisplay('item3', 'none');
				that.setDocumentDisplay('item4', 'none');
				that.setDocumentDisplay('item5', 'none');
			}else if(index == 1){
				that.setDocumentDisplay('item2', 'block');
				that.setDocumentDisplay('item3', 'block');
				that.setDocumentDisplay('item0', 'none');
				that.setDocumentDisplay('item1', 'none');
				that.setDocumentDisplay('item4', 'none');
				that.setDocumentDisplay('item5', 'none');
			}else if(index == 2){
				that.setDocumentDisplay('item4', 'block');
				that.setDocumentDisplay('item5', 'block');
				that.setDocumentDisplay('item2', 'none');
				that.setDocumentDisplay('item3', 'none');
				that.setDocumentDisplay('item0', 'none');
				that.setDocumentDisplay('item1', 'none');
			}
			index ++;
		}, 2000);
	},
	methods: {
		endFn(parm) {
			parm.loadArr.push(1);
			if(parm.loadArr.length>=5){
				if(parm.scrollTop>0){
					setTimeout(function(){
						parm.$refs.ctnWrapper && (parm.$refs.ctnWrapper.scrollTop = parm.scrollTop);
					},10);
				}
			}
			parm.loadCount++;
			if (parm.loadCount > 3) {
				parm.showOnloading = false;
			}
		},
		wrapperScrollHandler() {
			this.scrollTop = event.currentTarget.scrollTop;
		},
		searchHandler() {
			window.location.href = '#/SearchIndex';
		},
		setDocumentDisplay(id, style){
			var obj = document.getElementById(id);
			if(obj) {
				obj.style.display = style;
			}
		}
	}
	
}
</script>
<style lang="less">
@import "../css/customFn.less";
.homePage,.mycenter-container{
	background-color: #f2f2f2;
	.ctn-wrapper{
		width:100%;
		height: 100%;
		overflow-y: scroll;
	}
	.search{
		position: relative;
	    padding: 2% 0;
    	.icon-search{
    		position: absolute;
		    color: #aaa;
		    top: 50%;
		    left: 50%;
		    width: 16px;
		    height: 16px;
		    background: url('../../static/img/shunfeng_signs.png') no-repeat 0 -59px;
		    background-size: 30px;
		    background-position: 0 -43px;
		    margin-left: -8%;
		    transform: translateY(-50%);
		    
    	}
    	@media (max-width: 767px){
    		.icon-search{
    			margin-left: -14%;
    		}
    	}
    	@media (max-width: 600px){
    		.icon-search{
    			margin-left: -10%;
    		}
    	}
    	@media (max-width: 414px){
    		.icon-search{
    			margin-left: -14%;
    		}
    	}
    	@media (max-width: 360px){
    		.icon-search{
    			margin-left: -17%;
    		}
    	}
    	
    	div.search-box{
    		width: 93%;
		    margin: 0 auto;
		    
		    line-height: 0.8rem;
		    border-radius: 5px;
		    border: 1px solid rgba(202, 202, 202, 0.5);
		    text-align: center;
	    	
		    background-color: #fff;
		    color: #999;
    	}
	}
	.mint-search{
		height: auto;
	}
	.mint-swipe{
		height: 5.34rem;
		img{
			width: 100%;
			height: 100%;
		}
		.mint-swipe-indicators{
			right: calc(~"8.2% /2");
			left: auto;
			transform:translateX(1px);
			-webkit-transform:translateX(1px);
			-moz-transform:translateX(1px);
			-ms-transform:translateX(1px);
			-o-transform:translateX(1px);
		}
		.mint-swipe-indicator{
			background: #adadad;
			opacity: 1;
		}
		.is-active{
			background: #141414;
		}
	}

	.navbar{
	    background-color: #fff;
	    padding: 0.5rem;
	    .navbar-item{
			float: left;		
			width: 20%;
			img{
				display: block;
			    width: 61%;
			    margin: 0 auto;
			}
			p{
			    text-align: center;
			    margin-top: 0.6em;
			    font-size: 0.36rem;
			}
		}
	}
	.learning-news{
		padding: 2.6% 3.6%;
	    background-color: #fff;
	    margin-top: 3.6%;
	    position: relative;
	    height: 1.6rem;
	    img{
		    height: calc(~"1.216rem + 1px");
		    position: absolute;
		    top: 50%;
		    transform: translateY(-50%);
		    -webkit-transform: translateY(-50%);
		    -moz-transform: translateY(-50%);
		   -ms-transform: translateY(-50%);
		   -o-transform: translateY(-50%);
	    }
	    .neirong{
	    	display: inline-block;
		    margin-left: 1.6rem;
		    height: 58%;
		    overflow: hidden;
		    width: 75%;
		    //position: relative;
		    font-size: 1.1em;
		    //top: 0;
		     position: absolute;
		     top: 50%;
		     transform: translateY(-50%);
		     -webkit-transform: translateY(-50%);
		     -moz-transform: translateY(-50%);
		    -ms-transform: translateY(-50%);
		    -o-transform: translateY(-50%);
		    div{
		    	position: absolute;
			    top: 50%;
			    left: 0;
			    width: 100%;
				.transform-translateXY (0,-50%,0);	
			    p{
			    	&.neirong-item{
			    		display: none;
			    		height: 0.52rem;
			    		&#item0,&#item1{
			    			display: block;
			    		}
			    	}
		   			//line-height: 0.26rem;
		   			//margin-bottom: 0.1em;
		   			&:nth-child(even) {
		   				margin-top: 0.176rem;
		   			}
			    	a{
			    		display: inline-block;
					    height: 100%;
					    width: 100%;
					    white-space: nowrap;
					    text-overflow: ellipsis;
					    overflow: hidden;
					    //margin-top: 0.01rem;
					    font-size: 0;
					    span{
					    	line-height: 0.52rem;
    						display: inline-block;
    						//margin-bottom: 0.1em;
    						font-size: 0.32rem;
					    }
		   				span.box{
		   					padding: 0 2px;
						    display: inline-block;
						    border: 1px solid #ff6464;
						    line-height: 0.46rem;
						    border-radius: 5px;
						    color: #ff6464;
						    vertical-align: top;
		   				}
		   				span.text{
		   					width: 80%;
		   					white-space: nowrap;
		   					overflow: hidden;
		   					text-overflow:ellipsis;
		   				}

		   				span:last-child{
		   					margin-left: 0.2rem;
		   				}
			    	}
	   				
	   			}
	   			
		    }
   			
	    }
	}
	.main-container{
		margin-bottom: 51px;
		.project-recommon{
			margin-top: 3.6%;
			background-color: #fff;
			.title{
			    height: 1.2rem;
			    line-height: 1.2rem;
			    margin: 0 3.6% 3.6%;
			    border-bottom: 1px solid #dedede;
			    position: relative;
			    font-size: 0.42rem;
			    i{
			    	width: 8px;
				    height: 1.2em;
				    background: url('../../static/img/shunfeng_signs.png') no-repeat 0 -59px;
				    background-size: 30px;
				    margin-top: 0.9em;
			    }
			}
			b{
			    display: inline-block;
			    height: 0.4rem;
			    width: 0.15rem;
			    position: absolute;
			    left: -3.6%;
			    top: 0.4rem;
			}
		}
		.project-lists{
			background-color: #fff;
			.project-item{
			    width: 44.6%;
			    float: left;
			    background-color: #fff;
			    /*height: 135px;*/
			    margin: 0 0 5.6% 3.6%;
			    position:relative;
			    overflow: hidden;
			    a{
			    	display: block;
			    	position: relative;
			    	.file-type{
			    		width:0.797rem;
			    		height:0.44rem;
			    		position:absolute;
			    		right:0;
			    		bottom:0;
			    		background:url('../../static/img/shunfeng_signs.png') no-repeat;
			    		background-size: 100%;
			    		&.video{
			    			background-position: 11% 20.64%;
			    		}
			    		&.file{
			    			background:url('../../static/img/shunfeng_signs3.png') no-repeat;
			    			background-size: 267%;
			    			.bgPosition(@signs3Width, @signs3Height, 60, 35, 0, 938);
			    		}
						&.picture{
							background:url('../../static/img/shunfeng_signs3.png') no-repeat;
							background-size: 262%;
							.bgPosition(@signs3Width, @signs3Height, 60, 35, 0, 1041);
						}
						&.scorm{
							background:url('../../static/img/shunfeng_signs3.png') no-repeat;
							background-size: 262%;
							.bgPosition(@signs3Width, @signs3Height, 60, 35, 0, 1088);
						}
			    	}
			    }
			    img{
				   
				    height: 2.7rem;
				    display: block;
				    margin: 0 auto;
				    width: 100%;
				}
				.pro-info{
				    margin-top: 7%;
					.pro-title{
						margin-bottom: 1.6%;
						font-size: 0.37rem;
						line-height: 0.5rem;
						white-space: nowrap;
						text-overflow :ellipsis;
						overflow: hidden;
					}
					.pro-view{
						color: #999;
						
						margin-top: 3.6%;
						.subject{
							display: inline-block;
						    width: 60%;
						    white-space: nowrap;
						    overflow: hidden;
						    text-overflow: ellipsis;
						}
					}
				}
				.mark{
					display: block;
					
				    position: absolute;
				    top: 0;
				    left: 0;
				    width: 34px;
				    height: 34px;
				    line-height: 0.45rem;
				    font-size: 0.29rem;
				    color: #fff;
				    text-align: center;
					&.office{
						background: url('../../static/img/shunfeng_signs.png') no-repeat;
						background-size: 32px;
						background-position: 0 -89px;
					}
					&.origin{
						background: url('../../static/img/shunfeng_signs.png') no-repeat;
						background-size: 32px;
						background-position: 0 -127px;

					}
				}
				
			}
			.project-item:nth-child(2n){
				margin-left: 3.6%;
			}
		}
		.lecturer-Mien-wrapper{
			.mint-swipe-indicators{
				right: 50%;
				bottom: 0.22rem;
				.transform-translateX (50%);
				.is-active{
					background-color: #ff4141;
				}
			}
			.star-wrapper{
				/*.star{
					background: url('../../static/img/shunfeng_signs3.png') no-repeat;
					background-size: 80px;
					background-position: -30px -399px;
					&.active{
						background-position: 0 -399px;
					}
					&.half{
						background-position: -15px -399px;
					}
				}*/
			}
		}
		.recommond{
			overflow: hidden;
			.recommond-lists{
				
				max-height: 4.4rem;
				.mint-swipe-item{
					background-color: #fff;
				}
				.mint-swipe-indicators{
					right: 50%;
					.transform-translateX (50%);
					.is-active{
						background-color: #ff4141;
					}
				}
				.recommond-list{
					width: 44.6%;
					padding-left: 3.6%;
					float: left;
					img{
						width: 100%;
						;
						height: 2.7rem;
						display: block;
					}
					p{
						font-size: 0.37rem;

						text-align: center;
						margin-top: 1em;
						white-space: nowrap;
						overflow: hidden;
						text-overflow :ellipsis;
					}
				}
			}
			.recommond-index-lists{
				text-align: center;
				padding-bottom: 3.6%;
				.recommond-index-list{
					margin-right:5px;
					display: inline-block;
				    height: 7px;
				    width: 7px;
					background-color: #aaa;
				    border-radius: 50%;
					
				}
				.recommond-index-list.active{
				    background-color: red;
				}
			}
		}

		
	}
	
}
</style>