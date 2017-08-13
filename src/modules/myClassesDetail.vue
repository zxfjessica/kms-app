<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container myclass-detail">
			<p class="is-ready-to-show" v-if="!isShow">加载中...</p>
			<section v-if="isShow">
				<div class="class-info">
					<h3>{{classInfo.className}}</h3>
					<p>来自：{{classInfo.projectName}}</p>
					<p>班主任：{{classInfo.classManagerName}}</p>
				</div>
				<ul class="course-lists">
					<li class="course-list" v-for="course in classInfo.lstLearningPath">
						<div class="process">第{{course.phasesSort}}阶段&nbsp;&nbsp;&nbsp;{{course.phasesName}}</div>
						<div class="detail-list signs" 
							 :class="list.learningType == 0 ? 'online-class-signs': list.learningType == 1 ? 'mianshou-class-signs' : 'kaoshi-class-signs'" 
							 v-for="list in course.learningPath">
							<h4>
								<a  v-if="list.learningType == 0 || list.learningType == 1" 
									:href="list.learningType == 0 ? '#/onLineCourse/' + list.objectId : '#/faceToFaceCourse/' + list.objectId">
									<span>{{list.coursesName}}</span>
								</a>
								<span v-if="list.learningType == 2">{{list.coursesName}}</span>
							</h4>
							<p>时间：{{list.beginDateStr.split(' ')[0]}} - {{list.endDateStr.split(' ')[0]}}</p>
							<p v-if="list.addresses">地点：{{list.addresses}}</p>
							<p v-if="list.lecturerName">讲师：
								<router-link v-if="list.lecturerId" :to="'/teacherHome/' + list.lecturerId" class="teacher">{{list.lecturerName}}</router-link>
								<i v-else>{{list.lecturerName}}</i>
							</p> 
							<div class="comment-box clearfix" v-if="list.isCouldComment == 1 && list.learningType == 1"><!--  -->
								<a  class="fr" 
									:href="'#/scanToExpressCourse?objectId=' + list.objectId + '&&classId='+classInfo.id + '&&type=course'">
									{{list.isComment == 1 ? '追评' : '评价'}}课程</a><!-- 
								 	v-if="list.learningType == 1" -->
							</div>
						</div>
						
					</li>
				</ul>
			</section>
		</div>
	</div>
</template>
<script type="text/javascript">
	import commonHeader from '../components/commonHeader.vue';
	export default{
		data(){
			return{
				isShow: false,
				classInfo: {},
				classId: ''
			}
		},
		components: {
			"v-common-header": commonHeader
		},
		mounted(){						
			this.classId = this.$route.params.ID;
			var classUrl = this.$global().host+'/KMS-MSERVER/learning/project/viewClass?classId='+ this.classId;
			this.$http.get(classUrl).then(function(data) {
				this.isShow = true;
				//Toast({message: data.data.data.result, duration: 1000});
				this.classInfo = data.data.data;
			});
		}
	}
</script>
<style lang="less">
@import '../css/customFn.less';
	.myclass-detail{
		section{
			padding: 3% 3% 0 3%;
			background-color: #fff;
			.class-info{
				padding-bottom: 3.6%;
    			border-bottom: 1px solid #dedede;
				h3{
					font-size: 0.45rem;
					margin-bottom: 5px;
				}
				p{
					color: #999;
					margin-top: 3px;
				}
			}
			.course-lists{
				.course-list{
					padding: 0;
					/*padding-bottom: 10%;*/
					padding: 3.6% 0;
					.process{
						font-size: 0.4rem;
					}
					.detail-list{
						margin-top: 3.6%;
						padding-left: 1rem;
						line-height: 1.7em;
						font-size: 0.32rem;
						h4{
							color: #666666;
							font-size: 0.35rem;
						}
						p{
							color: #aaa;
							.teacher{
								color: #0190C5;
							}
						}
						.comment-box{
							a{
								border: 1px solid #ff4141;
							    color: #ff4141;
							    width: 24%;
							    text-align: center;
							    line-height: 0.74rem;
							    border-radius: 3px;
							}
						}
					}
					.mianshou-class-signs:before, .online-class-signs:before{
					    width: 1rem;
					    height: 0.8rem;
					    background-size: 90%;
					}
					.online-class-signs:before{				    
					    .bgPosition(@signsWidth, @signsHeight, 53, 49, 0, 1443);
					}
					.mianshou-class-signs:before{		
						.bgPosition(@signsWidth, @signsHeight, 45, 51, 0, 1502);		    
					}
					.kaoshi-class-signs:before{	
						background: url('../../static/img/kaoshi_icon.png') no-repeat;	
						background-size: 0.85rem;
					    width: 1rem;
					    height: 0.8rem;
					}
				}
				.course-list:not(:last-child){
    				border-bottom: 1px solid #dedede;
				}
			}
			
		}
	}
</style>