<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container face-to-face-course">
			<p class="is-ready-to-show" v-if="!isShow">加载中...</p>
			<div v-if="isShow">
				<div class="scroll-box">
					<header>
						<div class="course-img">
							<div class="tips" v-if="classInfo.isOfficial || classInfo.isOriginal">
								<span class="signs" :class="classInfo.isOfficial ? 'official' : 'original'"></span>
							</div>
							<img class="head" v-if="classInfo.coursesImage" :src="$global().imgHost + classInfo.coursesImage">
						</div>
						
					</header>
					<section class="face-to-face">
						<!-- 课程简介 -->
						<course-short-info  :classInfo="classInfo"
											@showInfomation="showInfo = true"></course-short-info>
						<!-- 评论 -->
						<express-short-info :expressions="expressions"
											@showExpressions="showExpress = true"></express-short-info>
						<p class="show-lecturer">
							<router-link class="clearfix" :to="'/TeacherList/' + this.coursesId">
								<h3 class="fl">认证讲师 ({{lectureNum}}人)</h3>
								<span class="fr">更多<i class="icon-info"></i></span>
							</router-link>
						</p>
						<ul class="lecture-box clearfix" v-if="lectureList.length > 0">
							<li class="lecture-list fl" v-for="(list, index) in lectureList">
								<div class="lecturer-wrapper clearfix">
							  		<router-link :to="'/teacherHome/' + list.lecturerCode">
							  			<div class="portrait-wrapper">
							  				<img :src="$global().imgHost + list.headPath" alt="">
							  			</div>
							  			<h4 class="tea-name">{{list.lecturerName}}</h4>
							  			<p class="level">{{list.lecturerLevelName}}</p>
							  			<div class="star-bg" :class="bgColor[0]">
							  				<div class="star-container">
							  					<star :score="list.commentStar.toFixed(1)" :totalStar="5"></star>
							  				</div>
							  			</div>
							  		</router-link>
							  	</div>
							</li>
						</ul>
						<!-- 课程简介弹出框 -->
						<mt-popup v-model="showInfo" position="bottom">
							<infomation-box :introdution="classInfo.coursesIntroduction"
											:coursesId="coursesId"
											:catolog="classInfo.directory" 
											@closeInfo="showInfo = false"
											:courseType="courseType"
											v-if="showInfo"></infomation-box>
						</mt-popup>
						<!-- 评论弹出框 -->
						<mt-popup v-model="showExpress" position="bottom">
							<expression-box :expressions="expressions" 
											:courseType="courseType" 
											:coursesId="coursesId"
											@closeExpress="showExpress = false"
											v-if="showExpress"></expression-box>
						</mt-popup>
						
					</section>		
				

				</div>
				<footer class="face-to-face-course-footer clearfix" v-if="!isHideFooter">
					<div class="search-projects fr"><a :href="'#/ProjectList/'+classInfo.id">搜索相关培训项目</a></div>
					<div class="fr"><span class="share signs">({{classInfo.shareCount}})</span></div>
					<div class="fr">
						<collect-item :isCollectCount="isCollectCount"
									  :courseCollectCount="courseCollectCount"
									  :courseType="courseType"
									  :coursesId="coursesId"
									  v-if="classInfo.collectCount != undefined"></collect-item>
					</div>
				</footer>
			</div>
		</div>
	</div>
</template>
<script>
	import expressionBox from '../components/expressionBox.vue';
	import infomationBox from '../components/infomationBox.vue';
	import collectItem from '../components/collectItem.vue';
	import courseShortInfo from '../components/courseShortInfo.vue';
	import expressShortInfo from '../components/expressShortInfo.vue';
	import Star from '../components/list/Star.vue';
	import { Toast, MessageBox } from 'mint-ui';
	import commonHeader from '../components/commonHeader.vue';
	export default{
		components: {
			expressionBox,
			infomationBox,
			collectItem,
			expressShortInfo,
			courseShortInfo,
			Star,
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
				myExpressionContent: '',
				haswritten: 0,
				bgColorWidth: 0,
				isHideFooter: false, //弹出框出现时隐藏footer
				setStar: 0,
				courseCollectCount: 0,
				isCollectCount: 1,
				bgColor: ['green', 'red', 'blue'],
				lectureList: [],
				lectureNum: 0
			}
		},
		mounted(){
			var that = this;
			that.coursesId = this.$route.params.ID;
			var classUrl = that.$global().host+'/KMS-MSERVER/learning/courses/viewCourses?coursesId=' + that.coursesId;
			
			that.$http.get(classUrl).then(function(data) {
				that.isShow = true;
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
				}
			});

			var expressUrl = that.$global().host + '/KMS-MSERVER/learning/viewComment/courses/' + that.coursesId + '?commentType=0';
			that.$http.get(expressUrl).then(function(data) {
				that.expressions = data.data.data;
			});
			
			//lectureList
			var lectureUrl = that.$global().host + '/KMS-MSERVER/learning/lecturerSearch/list?type=1&orderType=0&coursesId=' + that.coursesId;
			that.$http.get(lectureUrl).then(function(data) {
				this.lectureNum = data.data.totalSize || 0;
				if(data.data.data.length <= 3){
					that.lectureList = data.data.data;
				}else{
					let arr = [];
					arr = arr.concat(data.data.data[0]).concat(data.data.data[1]).concat(data.data.data[2]);
					that.lectureList = arr;
				}
				
			});
		},
		methods: {
			
		},
		watch: {
			showInfo(val, oldVal){
				if(val == true){
					this.isHideFooter = true;
				}else{
					this.isHideFooter = false;
				}
			},
			showExpress(val, oldVal){
				if(val == true){
					this.isHideFooter = true;
				}else{
					this.isHideFooter = false;
				}
			}
		}
	}
</script>
<style lang="less">
	.face-to-face-course{
		section.face-to-face{
			background: none;
			padding: 0;
			.express-info{
				padding-bottom: 3.6%;
				background-color: #fff;
			}
			.show-lecturer{
				padding: 3.6%;
			    font-size: 0.38rem;
			    margin-top: 3.6%;
			    background-color: #fff;
			    a{
			    	display: block;
			    	height: 100%;
			    	span{
			    		color: #999;
			    		font-size: 12px;
			    	}
			    	i{
			    		margin-top: -0.05rem;
			    	}
			    }
			}
			.lecture-box{
				background-color: #fff;
				padding-bottom: 3.6%;
				.lecture-list{
					width: calc(~"(85.6%) / 3");
					margin-left: 3.6%;
					background-color: #f2f2f2;
					font-size: 0.38rem;
					p,h4{
						text-align: center;
						margin-bottom: 0.1rem;
					}
					.tea-name {
						font-size: 0.4rem;
						line-height: 0.7rem;
					}
					.level {
						color: #999;
						font-size: 0.32rem;
						line-height: 0.32rem;
						margin-bottom: 0.2rem;
					}
					img{
						width: 2rem;
					    height: 2rem;
					    display: block;
					    margin: 4.6% auto 0;
					    border-radius: 50%;
					}
					.star-bg{
						width: 100%;
						text-align: center;
						
						.star-wrapper{
							height: 20px;
							line-height: 20px;
						}
					}
				}
			}
		}
		footer.face-to-face-course-footer{		}
		.mint-popup{
			height: calc(~"100vh - 5.7rem - 46px");
		}
		.search-projects{
			a{
				color:#fff;
			}
		}
	}
</style>