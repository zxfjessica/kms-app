<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container teacher-home" ref="teacherHome" style="overflow-y: scroll">
			<p class="is-ready-to-show" v-if="!isShowLecture">加载中...</p>
			<div class="main-box" v-if="isShowLecture">
				<header>
					<div class="my-info">
						<div class="top-wrapper">
							<div class="top">
								<img v-if="info.headPath" :src="$global().imgHost + info.headPath"/>
							</div>
						</div>
						<div class="middle">
							<span class="name">{{info.name}}</span>|
							<span class="tag">{{info.post}}</span>
							
						</div>
						<div class="bottom clearfix">
							<span class="lecturer-level fl">
								<span class="signs3" v-if="info.lecturerLevelId != 1 && info.lecturerLevelId != 8"    
									  :class="info.lecturerLevelId == 2 ? 'lecturer-level2' :
								  		  info.lecturerLevelId == 3 ? 'lecturer-level3' :
								  		  info.lecturerLevelId == 4 ? 'lecturer-level4' :
								  		  info.lecturerLevelId == 5 ? 'lecturer-level5' :
								  		  info.lecturerLevelId == 6 ? 'lecturer-level6' :
								  		  info.lecturerLevelId == 7 ? 'lecturer-level7' : ''"></span>
								  		  {{info.lecturerLevelName}}
							</span class="signs3">
							<span class="teacher-times fr">累计授课: {{info.coursesTime}}课时</span>
						</div>
					</div>
					<div class="feature-box">
						<div class="feature-line star clearfix">
							<h3 class="fl">学员评价</h3>
							<v-star class="express fr" :score="String(info.commentStar)" :totalStar="5" :showScore="true"></v-star>
							
						</div>
						<div class="feature-line good-at">
							<h3>擅长领域</h3>
							<div class="good-at-box" :class="!isUnfoldGood ? 'fold' : 'unfold'" ref="controlHeightGood">
								<div class="good-at-item" ref="itemHeightGood">
									<span v-for="(tag, index) in tagList">{{tag}}</span>
								</div>
							</div>
							<div class="fold-out" @click="isUnfoldGood = true" v-if="!isUnfoldGood && isShowControlGood">
								...<i>展开</i>
							</div>
							<div class="fold-out" @click="isUnfoldGood = false" v-if="isUnfoldGood && isShowControlGood">
								...<i>收起</i>
							</div>
							
						</div>
						<div class="feature-line teacher-feature">
							<h3>授课特点</h3>
							<div class="class-box" :class="!isUnfold ? 'fold' : 'unfold'" ref="controlHeight">
								<p ref="itemHeight">{{info.adeptAreas}}</p>
							</div>
							<div class="fold-out" @click="isUnfold = true" v-if="!isUnfold && isShowControl">
								...<i>展开</i>
							</div>
							<div class="fold-out" @click="isUnfold = false" v-if="isUnfold && isShowControl">
								...<i>收起</i>
							</div>
							
						</div>
					</div>
					<div class="teacher-info">
						<p class="teacher-files clearfix" @click="showTeacherFile = true" v-if="fromWhere == 'self'">
							<span class="fl">教学档案</span>
							<i class="icon-info fr"></i>
						</p>
						<p class="teacher-allowance clearfix" @click="showTeacherAllowance = true" v-if="fromWhere == 'self'">
							<span class="fl">津贴明细</span>
							<i class="icon-info fr"></i>
						</p>
						<p class="teacher-honor clearfix" @click="showTeacherHonor = true" v-if="fromWhere == 'self'">
							<span class="fl">讲师荣誉</span>
							<i class="icon-info fr"></i>
						</p>
						<p class="teacher-course clearfix" @click="showTeacherCourses = true" v-if="fromWhere == 'other'">
							<span class="fl">授课资格</span>
							<i class="icon-info fr"></i>
						</p>
						<p class="teacher-contact clearfix" @click="showTeacherContact = true" v-if="fromWhere == 'other'">
							<span class="fl">联系TA</span>
							<i class="icon-info fr"></i>
						</p>
					</div>
				</header>
				<section>
					<!-- 教学档案弹出框 -->
					<mt-popup class="teacher-files-popUp teacher-home-popUp" position="bottom" 
							  v-model="showTeacherFile" 
							  v-if="fromWhere == 'self'"
							  :closeOnClickModal="false">
						<p class="mint-popup-title clearfix">
							教学档案
							<i class="signs close-signs fr" @click="showTeacherFile = false"></i>
						</p>
						<mt-navbar v-model="teacherFileSelected">
						  	<mt-tab-item id="1" >认证课程</mt-tab-item>
						  	<mt-tab-item id="2" >授课记录</mt-tab-item>
						  	<mt-tab-item id="3" >教材开发</mt-tab-item>
						</mt-navbar>
						<mt-tab-container class="teacher-file"  v-model="teacherFileSelected">
							<mt-tab-container-item id="1" v-if="teacherFileSelected == '1'">
								<!-- <p class="is-ready-to-show" v-if="isShow && teacher1.length == 0">加载中...</p> teacherFileBottomAllLoaded3-->
								<div class="item-container">
									<p class="is-ready-to-show" v-if="teacher1.length == 0">没有更多数据了！</p>
									<v-loadmore  :top-method="teacherFileLoadTop" 
							  					 @top-status-change="handleTopChange" 
							  					 :bottom-method="teacherFileLoadBottom" 
							  					 :bottom-all-loaded="teacherFileBottomAllLoaded1"
							  					 ref="loadTeacherFile1" 
							  					 :auto-fill="false"
							  					 v-if="teacher1.length > 0">
										<ul>
											<li v-for="list1 in teacher1">
												<router-link :to="'/faceToFaceCourse/' + list1.coursesId">
													<div class="title">{{list1.coursesName}}</div>
													<p class="last">认证时间：{{list1.activityDate}}</p>
												</router-link>
											</li>
										</ul>
									</v-loadmore>
								</div>
							</mt-tab-container-item>
							<mt-tab-container-item id="2" v-if="teacherFileSelected == '2'">
								<!-- <p class="is-ready-to-show" v-if="isShow && teacher2.length == 0">加载中...</p> -->
								<div class="item-container">
									<p class="is-ready-to-show" v-if="teacher2.length == 0">没有更多数据了！</p>
									<v-loadmore  :top-method="teacherFileLoadTop" 
							  					 @top-status-change="handleTopChange" 
							  					 :bottom-method="teacherFileLoadBottom" 
							  					 :bottom-all-loaded="teacherFileBottomAllLoaded2"
							  					 ref="loadTeacherFile2" 
							  					 :auto-fill="false"
							  					 v-if="teacher2.length > 0">
										<ul>
											<li v-for="list2 in teacher2">
												<router-link :to="'/faceToFaceCourse/' + list2.coursesId">
													<div class="title">{{list2.className}} — {{list2.coursesName}}</div>
													<p>时长：{{list2.coursesTime}} 课时</p>
													<p>时间：{{list2.beginDateStr}}</p>
													<p class="last">满意度：{{list2.commentStar}}</p>
												</router-link>
												<div class="expressItem">
													<i @click="showExpressions(list2.coursesId, list2.classId)">评价详情</i>
												</div>
											</li>
										</ul>
									</v-loadmore>
								</div>
							</mt-tab-container-item>
							<mt-tab-container-item id="3" v-if="teacherFileSelected == '3'">
								<!-- <p class="is-ready-to-show" v-if="teacher3.length == 0">加载中...</p> -->
								<div class="item-container">
									<p class="is-ready-to-show" v-if="teacher3.length == 0">没有更多数据了！</p>
									<v-loadmore  :top-method="teacherFileLoadTop" 
							  					 @top-status-change="handleTopChange" 
							  					 :bottom-method="teacherFileLoadBottom" 
							  					 :bottom-all-loaded="teacherFileBottomAllLoaded3"
							  					 ref="loadTeacherFile3" 
							  					 :auto-fill="false"
							  					 v-if="teacher3.length > 0">
										<ul>
											<li v-for="list3 in teacher3">
												<div class="title">{{list3.bookName}}</div>
												<p>时长：{{list3.booktime}} {{list3.booktimeUnit}}</p>
												<p>时间：{{list3.createDateStr}}</p>
												<p class="last">等级：{{list3.reviewLevel}}</p>
											</li>
										</ul>
									</v-loadmore>
								</div>
							</mt-tab-container-item>
						</mt-tab-container>
					</mt-popup>
					<!-- 评论弹出框 -->
					<mt-popup class="expression-popUp teacher-home-popUp" v-model="showExpress" position="bottom" :closeOnClickModal="false">
						<expression-box :expressions="expressions" 
										:courseType="courseType" 
										:coursesId="coursesId"
										:classId="classId"
										:lectureId="empNumber"
										@closeExpress="showExpress = false"
										v-if="showExpress"></expression-box>
					</mt-popup>
					<!-- 津贴明细弹出框 -->
					<mt-popup class="teacher-allowance-popUp teacher-home-popUp" position="bottom" 
							  v-model="showTeacherAllowance" 
							  v-if="fromWhere == 'self'"
							  :closeOnClickModal="false">
						<p class="mint-popup-title clearfix">
							津贴明细
							<i class="signs close-signs fr" @click="showTeacherAllowance = false"></i>
						</p>
						<mt-tab-container class="allowance-file">
							<mt-tab-container-item>
								<p class="is-ready-to-show" v-if="myAllowance.length == 0">没有更多数据了！</p>
								<v-loadmore  :top-method="teacherAllowanceLoadTop" 
						  					 @top-status-change="handleTopChange" 
						  					 :bottom-method="teacherAllowanceLoadBottom" 
						  					 :bottom-all-loaded="teacherAllowanceBottomAllLoaded"
						  					 ref="loadTeacherAllowance" 
						  					 :auto-fill="false"
						  					 v-if="myAllowance.length > 0">
									<ul>
										<li v-for="allow in myAllowance">
											<div class="list-container signs3" :class="allow.salaryType == 1 ? 'course-signs' : 'book-signs'">
												<div class="title">{{allow.objectName}}</div>
												<p>种类：{{allow.salaryType == 1 ? '授课' : '教材开发'}}</p>
												<p>完成：{{allow.jobTimeStr}}</p>
												<p>课时：{{allow.coursesTime}}</p>
												<p>质量：{{allow.commentStar}}</p>
												<p>津贴：{{allow.trueSalary}}</p>
												<p class="last">归档：{{allow.ecpTimeStr}}</p>
											</div>
										</li>
									</ul>
								</v-loadmore>
							</mt-tab-container-item>
						</mt-tab-container>
					</mt-popup>
					<!-- 讲师荣誉弹出框 -->
					<mt-popup class="teacher-allowance-popUp teacher-home-popUp" position="bottom" 
							  v-model="showTeacherHonor" 
							  v-if="fromWhere == 'self'"
							  :closeOnClickModal="false">
						<p class="mint-popup-title clearfix">
							讲师荣誉
							<i class="signs close-signs fr" @click="showTeacherHonor = false"></i>
						</p>
						<mt-tab-container class="allowance-file">
							<mt-tab-container-item>
								<p class="is-ready-to-show" v-if="myHonor.length == 0">没有更多数据了！</p>
								<v-loadmore  :top-method="teacherHonorLoadTop" 
						  					 @top-status-change="handleTopChange"
						  					 :bottom-method="teacherHonorLoadBottom" 
						  					 :bottom-all-loaded="teacherHonorBottomAllLoaded" 
						  					 ref="loadTeacherHonor" 
						  					 :auto-fill="false"
						  					 v-if="myHonor.length > 0">
									<ul>
										<li v-for="honor in myHonor">
											<div class="list-container signs3 honor-signs">
												<div class="title">{{honor.honorName}}</div>
												<p>颁发时间：{{honor.createDateStr}}</p>
												<p class="last">颁发组织：{{honor.deptName}}</p>
											</div>
										</li>
									</ul>
								</v-loadmore>
							</mt-tab-container-item>
						</mt-tab-container>
					</mt-popup>
					<!--授课资格弹出框-->
					<mt-popup class="teacher-course-popUp teacher-home-popUp" position="bottom" 
							  v-model="showTeacherCourses" 
							  v-if="fromWhere == 'other'"
							   :closeOnClickModal="false">
						<p class="mint-popup-title clearfix">
							授课资格
							<i class="signs close-signs fr" @click="showTeacherCourses = false"></i>
						</p>
						<mt-tab-container class="course-file">
							<mt-tab-container-item class="course-file">
								<p class="is-ready-to-show" v-if="myCourses.length == 0">没有更多数据了！</p>
								<v-loadmore  :top-method="teacherCoursesLoadTop" 
						  					 @top-status-change="handleTopChange"
						  					 :bottom-method="teacherCoursesLoadBottom" 
						  					 :bottom-all-loaded="teacherCoursesBottomAllLoaded"  
						  					 ref="loadTeacherCourses" 
						  					 :auto-fill="false"
						  					 v-if="myCourses.length > 0">
									<ul class="project-lists clearfix">
										<li class="project-item" v-for="course in myCourses" :pro-id="course.coursesId">
											<a :href="'#/faceToFaceCourse/'+course.coursesId">
												<img :src="$global().imgHost+course.coursesImage"/></a>
											<div class="pro-info">
												<div class="title">{{course.coursesName}}</div>
											</div>
											<span class="mark" :class="course.isOfficial?'office':'origin'" v-if="course.isOfficial||course.isOriginal"></span>
										</li>
									</ul>
								</v-loadmore>
							</mt-tab-container-item>
						</mt-tab-container>
					</mt-popup>
					<!--联系方式弹出框-->
					<mt-popup class="teacher-course-popUp teacher-home-popUp" position="bottom" 
							  v-model="showTeacherContact" 
							  v-if="fromWhere == 'other'"
							  :closeOnClickModal="false">
						<p class="mint-popup-title clearfix">
							联系TA
							<i class="signs close-signs fr" @click="showTeacherContact = false"></i>
						</p>
						<mt-tab-container class="contact-file">
							<mt-tab-container-item>
								<ul>
									<li>
										<div class="list-container signs contact-signs">
											<p>岗位：{{info.post}}</p>
											<p>部门：{{info.deptName}}</p>
											<p>Email：{{info.email}}</p>
										</div>
									</li>
								</ul>
								<div class="contact" @click="contact">丰声联系</div>
							</mt-tab-container-item>
						</mt-tab-container>
					</mt-popup>
				</section>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import expressionBox from '../components/expressionBox.vue';
	import Star from "../components/list/Star.vue";
	import loadMore from "../components/loadMore.vue";
	import { Toast } from 'mint-ui';
	import commonHeader from '../components/commonHeader.vue';
	export default{
		components: {
			'expression-box': expressionBox,
			'v-star': Star,
			'v-loadmore': loadMore,
			"v-common-header": commonHeader
		},
		data(){
			return {
				isUnfold: false,//展开 | 收起
				isShowControl: false,//是否显示展开按钮
				isUnfoldGood: false,
				isShowControlGood: false,
				isShowLecture: false,
				info: {},
				fromWhere: 'self',
				tagList: [],
				teacherFileSelected: '1',
				teacher1: [],
				teacher2: [],
				teacher3: [],
				myAllowance:[],
				myHonor: [],
				myCourses: [],
				showTeacherFile: false,
				showTeacherAllowance: false,
				showTeacherHonor: false,
				showTeacherCourses: false,
				showTeacherContact: false,
				empNumber: '',
				isShow: false,
				expressions: {},
				courseType: 'courses',
				coursesId: '',
				classId: '',
				showExpress: false,
				NewCommentStar: 0,
				topStatus: '',
				teacherFileLoading1: false,
				teacherFilePageno1: -1,
				teacherFileBottomAllLoaded1: false,
				teacherFileLoading2: false,
				teacherFilePageno2: -1,
				teacherFileBottomAllLoaded2: false,
				teacherFileLoading3: false,
				teacherFilePageno3: -1,
				teacherFileBottomAllLoaded3: false,
				teacherAllowanceLoading: false,
				teacherAllowancePageno: -1,
				teacherAllowanceBottomAllLoaded: false,
				teacherHonorLoading: false,
				teacherHonorPageno: -1,
				teacherHonorBottomAllLoaded: false,
				teacherCoursesLoading: false,
				teacherCoursesPageno: -1,
				teacherCoursesBottomAllLoaded: false
				
			}
		},
		mounted(){
			var that = this;
			that.empNumber = that.$route.params.ID
			try{
				function getSuccess(workId){
				    if(workId == that.empNumber){
				    	that.fromWhere = 'self';
				    }else{
				    	that.fromWhere = 'other';
				    }
				}
				function getFailed(error){
				    alert(error);
				}
				ExpressPlugin.getUserWorkId(getSuccess,getFailed);
			}catch(e){
				//alert(e);
			}
			//讲师信息
			that.getData('/KMS-MSERVER/learning/person/lecturer?empNumber=' + that.empNumber,'info','GET',{},function(vm){
				vm.isShowLecture = true;
			});
			
		},
		methods: {
			contact(){
				try{
					ExpressPlugin.openContactDetail(this.empNumber);
				}catch(e){
					alert(e);
				}
				
			},
			showExpressions(courId, classId){
				this.coursesId = courId;
				this.classId = classId;
				this.showExpress = true;
			},
			handleTopChange(){
				this.topStatus = status;
			},
			loadTop(url, dataList, pageNo, elem, loading, bottomAllLoaded){
				var that = this;
				var page = 0;
				that[loading] = false;	
				url += '&startPage=' + page;
				that.$http.get(that.$global().host + url).then(
					response => {
						//
						if(response.body.data.length > 0){
							that[dataList] = response.body.data;
							Toast({message: '刷新成功！', duration: 500});
						}else{
							Toast({message: '没有更多数据了', duration: 500});
							that[loading] = true;
						}
						that.$refs[elem].onTopLoaded();
						that[bottomAllLoaded] = false;
					}
				);
			},
			loadBottom(url, dataList, pageNo, elem, bottomAllLoaded){
				var that = this;
				var page = 0;	
				page = that[pageNo];
				page++;
				url += '&startPage=' + page;
				that.$http.get(that.$global().host + url).then(
					response => {
						//
						that.$refs[elem].onBottomLoaded();
						if(response.body.data.length > 0){
							that[dataList] = that[dataList].concat(response.body.data);
							that[pageNo]++;
						}else{
							Toast({message: '没有更多数据了', duration: 500});
							that[bottomAllLoaded] = true;
						}
					}
				);
			},
			teacherFileLoadTop(){
				var that = this;
				var url;
				if(that.teacherFileSelected == 1){
					url = '/KMS-MSERVER/learning/person/lecturer/myActivity?empNumber=' + that.empNumber;

					that.loadTop(url, 'teacher1', 'teacherFilePageno1', 'loadTeacherFile1', 'teacherFileLoading1', 'teacherFileBottomAllLoaded1');

				}else if(that.teacherFileSelected == 2){
					url = '/KMS-MSERVER/learning/person/lecturer/myTechCourses?empNumber=' + that.empNumber;

					that.loadTop(url, 'teacher2', 'teacherFilePageno2', 'loadTeacherFile2', 'teacherFileLoading2', 'teacherFileBottomAllLoaded2');

				}else if(that.teacherFileSelected == 3){
					url = '/KMS-MSERVER/learning/person/lecturer/myTextbook?empNumber=' + that.empNumber;

					that.loadTop(url, 'teacher3', 'teacherFilePageno3', 'loadTeacherFile3', 'teacherFileLoading3', 'teacherFileBottomAllLoaded3');
				}
			},
			teacherFileLoadBottom(){
				var that = this;
				var url;
				if(that.teacherFileSelected == 1){
					url = '/KMS-MSERVER/learning/person/lecturer/myActivity?empNumber=' + that.empNumber;

					that.loadBottom(url, 'teacher1', 'teacherFilePageno1', 'loadTeacherFile1', 'teacherFileBottomAllLoaded1');

				}else if(that.teacherFileSelected == 2){
					url = '/KMS-MSERVER/learning/person/lecturer/myTechCourses?empNumber=' + that.empNumber;

					that.loadBottom(url, 'teacher2', 'teacherFilePageno2', 'loadTeacherFile2', 'teacherFileBottomAllLoaded2');

				}else if(that.teacherFileSelected == 3){
					url = '/KMS-MSERVER/learning/person/lecturer/myTextbook?empNumber=' + that.empNumber;

					that.loadBottom(url, 'teacher3', 'teacherFilePageno3', 'loadTeacherFile3', 'teacherFileBottomAllLoaded3');
				}
			},
			teacherAllowanceLoadTop(){
				var that = this;
				var url;
				url = '/KMS-MSERVER/learning/person/lecturer/myAllowance?empNumber=' + that.empNumber;
				that.loadTop(url, 'myAllowance', 'teacherAllowancePageno', 'loadTeacherAllowance', 'teacherAllowanceLoading');
			},
			teacherAllowanceLoadBottom(){
				var that = this;
				var url;
				url = '/KMS-MSERVER/learning/person/lecturer/myAllowance?empNumber=' + that.empNumber;
				that.loadBottom(url, 'myAllowance', 'teacherAllowancePageno', 'loadTeacherAllowance', 'teacherAllowanceBottomAllLoaded');
			},
			teacherHonorLoadTop(){//
				var that = this;
				var url;
				url = '/KMS-MSERVER/learning/person/lecturer/myHonor?empNumber=' + that.empNumber;
				that.loadTop(url, 'myHonor', 'teacherHonorPageno', 'loadTeacherHonor', 'teacherHonorLoading', 'teacherHonorBottomAllLoaded');
			},
			teacherHonorLoadBottom(){//
				var that = this;
				var url;
				url = '/KMS-MSERVER/learning/person/lecturer/myHonor?empNumber=' + that.empNumber;
				that.loadBottom(url, 'myHonor', 'teacherHonorPageno', 'loadTeacherHonor', 'teacherHonorBottomAllLoaded');
			},
			teacherCoursesLoadTop(){
				var that = this;
				var url;
				url = '/KMS-MSERVER/learning/person/lecturer/myActivity?empNumber=' + that.empNumber;
				that.loadTop(url, 'myCourses', 'teacherCoursesPageno', 'loadTeacherCourses', 'teacherCoursesLoading', 'teacherCoursesBottomAllLoaded');
			},
			teacherCoursesLoadBottom(){
				var that = this;
				var url;
				url = '/KMS-MSERVER/learning/person/lecturer/myActivity?empNumber=' + that.empNumber;
				that.loadBottom(url, 'myCourses', 'teacherCoursesPageno', 'loadTeacherCourses', 'teacherCoursesBottomAllLoaded');
			},
			isHideScroll(val){
				if(val){
					this.$refs.teacherHome.style.overflowY = 'hidden';
				}else{
					this.$refs.teacherHome.style.overflowY = 'auto';
				}
			}
		},
		watch: {
			info(val){
				var that = this;
				if(val){
					that.tagList = that.info.lecturerTag.split(',');
					//评分
					var zeroNum = Number(String(that.info.commentStar).split('.')[0]);
					var floatNum = Number(String(that.info.commentStar).split('.')[1]);
					if(floatNum < 5){
						that.NewCommentStar = zeroNum + 0.5;
					}else if(floatNum > 5){
						that.NewCommentStar = zeroNum + 1;
					}else{
						that.NewCommentStar = that.info.commentStar;
					}

					setTimeout(function(){
						//擅长领域展开收起
						if(that.$refs.itemHeightGood.clientHeight > that.$refs.controlHeightGood.clientHeight){
							that.isShowControlGood = true;
						}else{
							that.isShowControlGood = false;
						}
						//授课特点展开收起
						if(that.$refs.itemHeight.clientHeight > that.$refs.controlHeight.clientHeight){
							that.isShowControl = true;
						}else{
							that.isShowControl = false;
						}
					},50);
				}
			},
			showTeacherFile(val){//初始化显示教学档案
				var teacherFileUrl;
				this.isHideScroll(val);
				if(val){
					if(this.teacher1.length == 0){
						this.isShow = true
						//认证课程
						this.teacherFilePageno1 = 0;
						teacherFileUrl = '/KMS-MSERVER/learning/person/lecturer/myActivity?empNumber=' + this.empNumber;
						this.getData(teacherFileUrl + '&startPage=' + this.teacherFilePageno1,'teacher1','GET',{},function(parm){
							parm.isShow = false
						});
					}		
					
					if(this.teacher2.length == 0){
						this.isShow = true;
						//授课记录
						this.teacherFilePageno2 = 0;
						teacherFileUrl = '/KMS-MSERVER/learning/person/lecturer/myTechCourses?empNumber=' + this.empNumber;
						this.getData(teacherFileUrl + '&startPage=' + this.teacherFilePageno2,'teacher2','GET',{},function(parm){
							parm.isShow = false
						});
					}
					if(this.teacher3.length == 0){
						this.isShow = true;	
						//教材开发
						this.teacherFilePageno3 = 0;
						teacherFileUrl = '/KMS-MSERVER/learning/person/lecturer/myTextbook?empNumber=' + this.empNumber;
						this.getData(teacherFileUrl + '&startPage=' + this.teacherFilePageno3,'teacher3','GET',{},function(parm){
							parm.isShow = false
						});
					}
				}
			},
			showTeacherAllowance(val){
				this.isHideScroll(val);
				if(val && this.myAllowance.length == 0){
					this.teacherAllowancePageno = 0;
					let teacherAllowanceUrl = '/KMS-MSERVER/learning/person/lecturer/myAllowance?empNumber=' + this.empNumber;					
					this.getData(teacherAllowanceUrl + '&startPage=' + this.teacherAllowancePageno,'myAllowance','GET');
				}
			},
			showTeacherHonor(val){
				this.isHideScroll(val);
				if(val && this.myHonor.length == 0){
					this.teacherHonorPageno = 0;
					let teacherHonorUrl = '/KMS-MSERVER/learning/person/lecturer/myHonor?empNumber=' + this.empNumber;	
					this.getData(teacherHonorUrl + '&startPage=' + this.teacherHonorPageno,'myHonor','GET');
				}
			},
			showTeacherCourses(val){
				this.isHideScroll(val);
				if(val && this.myCourses.length == 0){
					this.teacherCoursesPageno = 0;
					let teacherCoursesUrl = '/KMS-MSERVER/learning/person/lecturer/myActivity?empNumber=' + this.empNumber;
					this.getData(teacherCoursesUrl + '&startPage=' + this.teacherCoursesPageno,'myCourses','GET');	
				}
				
			},
			showTeacherContact(val){
				this.isHideScroll(val);
			},
			showExpress(val){
				this.isHideScroll(val);
			}
		}
	}
</script>
<style lang="less">

	.teacher-home{
		.border-radius (@radius) {
		  	border-radius: @radius;
		    -moz-border-radius: @radius;
		    -webkit-border-radius: @radius;
		}
		header{
			.my-info{
				background:url("../../static/img/center_bg2.png") no-repeat left top;
				background-size: 100% 100%;
				font-size: 0;
				width:100%;
				height: 4.7rem;
				padding:0.5rem 0 0 0;
				position: relative;
				
				.top-wrapper{
					.top{
						margin-bottom :0.2rem;
						margin-top :0.1rem;
						img{
							display: block;
						    width: 2.4rem;
						    height: 2.4rem;
						    margin: 0 auto;
							.border-radius (50%);
							position: relative;
    						left: -0.05rem;
						}
					}
				}
				.middle{
					line-height: 2em;
					color:#fff;
					font-size:0.34rem;
					text-align:center;
					span{
						display: inline-block;
						margin:0 0.3rem;
					}
				}
				.bottom{
					font-size: 0.34rem;
				    color: #fff;
				    padding: 0 3.6%;
				    position: absolute;
				    bottom: 0.3rem;
				    width: 92.8%;
				    .signs3:before{
				    	top: 50%;
    					margin-top: -11px;
				    }
				}
			}
			.feature-box{
				padding: 0 0 0 3.6%;
				background-color: #fff;
				.feature-line{
					padding: 4% 3.6% 3% 0;
					font-size: 0.35rem;
					h3{
						font-size: 0.4rem;
						margin-bottom: 0.15rem;
					}
					p{
						line-height: 0.65rem;
					    color: #999;
					    word-wrap: break-word;
					   /* padding-right: 3.6%;*/
					}
					.good-at-box{
						span{
							color: #999999;
							border-radius: 2px;
							border: 1px solid #999999;
						    padding: 0 0.1rem;
						    display: inline-block;
						}
						span{
							margin-right: 4px;
							margin-bottom: 0.15rem;
							line-height: 0.55rem;
						}
					}
					.express{
						.star {
						    width: 20px;
						    height: 21px;
						    background-size: 32px;
						    background-position: 0px -670px;
						}
						.star.active {
						    background-position: 0px -650px;
						}
						.star.half {
						    background-position: 0px -690px;
						}
						.score-num {
						    font-size: 13px;
						    line-height: 1.54;
						    color: #ffa703;
						}
					}
					.expressesNumber{
						color: #ffa703;
						margin-left: 5px;
						margin-top: 1px;
					}
				}
				.feature-line:not(:last-child){
					border-bottom: 1px solid #eee;
				}
				.star{
					h3{
						margin: 0;
					}
				}
				.teacher-feature, .good-at{
					.class-box{
						max-height: 1.95rem;
						&.fold{
							max-height: 1.95rem;
							overflow: hidden;
						}
					}
					.good-at-box{
						max-height: 2.1rem;
						&.fold{
							max-height: 2.1rem;
							overflow: hidden;
						}
					}
					.unfold{
						overflow: visible;
						max-height: none;
					}
					.fold-out{
						line-height: 0.65rem;
						color: #999;
						i{
							margin-left: 3px;
							color: #ff4141;
						}
					}
				}
			}
			.teacher-info{
				margin-top: 3.6%;
				background-color: #fff;
			    font-size: 0.4rem;
			    p{
					padding: 4% 3.6%;
			    	span:last-child{
			    		color: #999;
			    		font-size: 0.4rem;
			    	}
					.icon-info{
						position: relative;
						top: 0.12rem;
					}
			    }
			    p:not(:last-child){
			    	border-bottom: 1px solid #eee;
			    }
			}
		}
		section{
			.teacher-home-popUp{
				height: calc(~"100vh - 46px - 5.2rem");
			}
			.mint-navbar{
				.mint-tab-item{
					height:1.2rem;
					.mint-tab-item-label{
						display: inline-block;
						width:100%;
						height: 100%;
						line-height:1.2rem;
						font-size: 0.38rem;
					}
					&.is-selected{
						.mint-tab-item-label{
							border-bottom:1px solid #ff4141;
							margin-bottom:0;
							background-color: #ff4141;
							color: #fff;
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
			.mint-tab-container{
    			margin-top: 1px;
				height: calc(~"100% - 2.4rem");
				.mint-tab-container-wrap{
					height: 100%;
					.mint-tab-container-item{
						height: 100%;
						overflow-y: auto;
						ul{
							li{
								padding: 0.35rem 3.6% 0;
								background-color: #fff;
								margin-bottom: 0.35rem;
								/*line-height: 0.6rem;*/
								div.title, p{
									width: 100%;
									white-space: nowrap;
									text-overflow: ellipsis;
									overflow: hidden;
								}
								div.title{
									font-size: 0.4rem;
									margin-bottom: 0.1rem;
									color: #333;
								}
								p{
									font-size: 0.36rem;
									color: #999;
									line-height: 0.65rem;
								}
								p.last{
									padding-bottom: 0.35rem;
								}
								.expressItem{
								    line-height: 1.2rem;
								    text-align: right;
								    border-top: 1px solid #eee;
								    i{
								    	display: inline-block;
									    width: 22%;
									    text-align: center;
									    line-height: .7rem;
									    border: 1px solid #ff4141;
									    color: #ff4141;
									    border-radius: 3px;
								    }
								}
							}
							.express-list{
								margin: 0;
							}
						}
					}
					
				}
			}
			.allowance-file, .contact-file{
				height: calc(~"100% - 1.2rem");
				margin: 0;
				.mint-tab-container-wrap{
					.mint-tab-container-item{
						ul{
							li{
								line-height: 0.6rem;
								.list-container{
									padding-left: 15%;
									position: relative;
								}
								.course-signs:before{
									height: 33px;
								    width: 40px;
								    background-position: 0 -281px;
								    top: 0.07rem; 
								}
								.book-signs:before{
									height: 33px;
								    width: 40px;
								    background-position: 0 -246px;
								    top: 0.07rem; 
								}
								.contact-signs:before{
									height: 30px;
								    width: 30px;
								    background-position: 0 -861px;
								    top: 0.07rem; 
								}
								.honor-signs:before{
									height: 33px;
								    width: 40px;
								    background-position: 0 -548px;
								    top: 0.07rem; 
								}
							}
						}
					}
				}
			}
			.course-file{
				height: calc(~"100% - 1.2rem");
				margin: 0;
				.mint-tab-container-wrap{
					.mint-tab-container-item{
						.project-lists{
							padding-top: 4.6%;
							background-color: #fff;
							.project-item{
							    width: 44.6%;
							    float: left;
							    margin: 0 0 5.6% 3.6%;
							    position:relative;
							    overflow: hidden;
							    border: none;
							    padding: 0;
							    line-height: inherit;
							    img{
								   
								    height: 2.7rem;
								    display: block;
								    margin: 0 auto;
								    width: 100%;
								}
								.pro-info{
								    margin-top: 6%;
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
					}
				}
			}
			.contact-file{
				background-color: #fff;
				.mint-tab-container-wrap{
					.mint-tab-container-item{
						position: relative;
						ul{
							li{
								p{
									color: #333;
									font-size: 0.4rem;
									margin-bottom: 0.2rem;
								}
							}
						}
						.contact{
							position: absolute;
							bottom: 0;
							width: 100%;
							height: 1.2rem;
							line-height: 1.2rem;
							font-size: 0.4rem;
							background-color: #ff4141;
							color: #fff;
							text-align: center;
						}
					}
				}
			}
			.mint-popup-content{
				height: calc(~"100% - 1.2rem");
				.mint-tab-container{
					height: 100%;
				}
			}
		}
	}
</style>