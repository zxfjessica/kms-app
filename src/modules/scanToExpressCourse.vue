<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container scan-to-express-course">
			<p class="is-ready-to-show" v-if="!isShow">加载中...</p>
			<div class="scroll-box" v-if="isShow">
				<header>
					<div class="express-info">
						<h1>{{expressionList.courseName}}</h1>
						<div class="clearfix">
							<span class="project">{{expressionList.className}}</span>
							<span class="fr">讲师： <i>{{expressionList.lecturerName}}</i></span>
						</div>
					</div>
				</header>
				<section>
					<div class="express-box course-express">
						<div class="mint-popup-title clearfix">
							<span>课程内容评价</span>
							<set-star :model="setCourseStar"
									  :totalStar="5.0"
									  @watch="watchCourseStar"
									  :action="'touchMove'"
									  v-if="isFirst"
									  class="set-star-box fr"></set-star>
						</div>
						<div class="express-bottom">
							<textarea-box :model="courseExpress"
										  :placeholder="'请您从案例、课件、实用启发等方面对本课程进行评价'"
										  :totalLetter="200"
										  @watch="watchCourse"></textarea-box>
						</div>
					</div>
					<div class="express-box master-express">
						<div class="mint-popup-title">
							<span>课程讲师评价</span>
							<set-star :model="setMasterStar"
									  :totalStar="5.0"
									  @watch="watchMasterStar"
									  :action="'touchMove'"
									  v-if="isFirst"
									  class="set-star-box fr"></set-star>
						</div>
						<div class="express-bottom">
							<textarea-box :model="masterExpress"
										  :placeholder="'请您从仪容、表达、互动、总结等方面谈谈您对讲师的意见'"
										  :totalLetter="200"
										  @watch="watchMaster"></textarea-box>
						</div>
					</div>
					<div class="express-box master-express" v-if="isFromScan && type == 'class'">
						<div class="mint-popup-title">
							<span>组织满意度评价</span>
							<set-star :model="setClassStar"
									  :totalStar="5.0"
									  @watch="watchClassStar"
									  :action="'touchMove'"
									  v-if="isFirst"
									  class="set-star-box fr"></set-star>
						</div>
						<div class="express-bottom">
							<textarea-box :model="classExpress"
										  :placeholder="'请您从组织安排、时间、环境等方面对本期培训进行整体评价'"
										  :totalLetter="200"
										  @watch="watchClass"></textarea-box>
						</div>
					</div>
				</section>
			</div>
			
			<footer>
				<div v-if="!canGoBack" @click="sendExpresses">发送评论</div>
				<div v-if="canGoBack" @click="goBack">返回</div>
			</footer>
		</div>
	</div>
	
</template>
<script type="text/javascript">
	import { Toast, MessageBox, Indicator } from 'mint-ui';
	import textareaBox from '../components/textareaBox.vue';
	import setStar from '../components/setStar.vue';
	import commonHeader from '../components/commonHeader.vue';
	export default{
		components: {
			textareaBox,
			setStar,
			"v-common-header": commonHeader
		},
		data(){
			return{
				isShow: false,
				masterBgColorWidth: 0,
				courseBgColorWidth: 0,
				classBgColorWidth: 0,
				setMasterStar: 0,
				setCourseStar: 0,
				setClassStar: 0,
				courseExpress: '',
				masterExpress: '',
				classExpress: '',
				canGoBack: false,
				expressionList: {},
				isFromScan: false,
				isFirst: 0,
				type: 'course'
			}
		},
		mounted(){
			if(this.$route.query.scan){
				this.isFromScan = this.$route.query.scan;
			}
			if(this.$route.query.type){
				this.type = this.$route.query.type;
			}
			var postUrl = this.$global().host+'/KMS-MSERVER/learning/sign/viewCourse/' + this.$route.query.classId + '/' + this.$route.query.objectId;

			postUrl += '?type=' + this.type;

			this.$http({					
				type: 'GET',
				url: postUrl
			}).then(function(data) {
				this.isShow = true;
				if(data.data.errorMessage){
					return MessageBox({
						title: '',
						message: data.data.errorMessage,
						confirmButtonText: '返回',
						showCancelButton: false,
						closeOnClickModal: false
					}).then((response)=>{
						try {
						
					 		ExpressPlugin.backToWidget();
						} catch (e) {
						}
					});
				}

				this.expressionList = data.data.data;
				this.isFirst = this.expressionList.isFirst;

				if(this.isFromScan && this.isFirst == 0){
					MessageBox({
						title: '',
						message: '您已评价过该课程',
						confirmButtonText: '知道了',
						showCancelButton: false,
						closeOnClickModal: false
					}).then((response)=>{
						try {
						
					 		ExpressPlugin.backToWidget();
						} catch (e) {
						}
					});
				}
			});	
		},
		methods: {
			watchCourseStar(val){
				this.setCourseStar = val;
			},
			watchMasterStar(val){
				this.setMasterStar = val;
			},
			watchClassStar(val){
				this.setClassStar = val;
			},
			watchCourse(val, oldVal){
				this.courseExpress = val;
			},
			watchMaster(val, oldVal){
				this.masterExpress = val;
			},
			watchClass(val, oldVal){
				this.classExpress = val;
			},
			sendExpresses: function(){
				if(!parseFloat(this.setCourseStar) && this.isFirst == 1){//parseFloat(this.setOrganizeStar)
					return Toast({
							message: '课程评分不可为空',
							duration: 1000
						});
				}
				if(!this.courseExpress){
					return Toast({
							message: '课程评论不可为空',
							duration: 1000
						});
				}
				if(!parseFloat(this.setMasterStar) && this.isFirst == 1){
					return Toast({
							message: '讲师评分不可为空',
							duration: 1000
						});
				}
				if(!this.masterExpress){
					return Toast({
							message: '讲师评论不可为空',
							duration: 1000
						});
				}
				if(this.isFromScan && this.type == 'class'){
					if(!parseFloat(this.setClassStar) && this.isFirst == 1){
						return Toast({
								message: '组织评分不可为空',
								duration: 1000
							});
					}
					if(!this.classExpress){
						return Toast({
								message: '组织评论不可为空',
								duration: 1000
							});
					}
				}
				
	
				var url = this.$global().host+'/KMS-MSERVER/learning/sign/comment/courses/' + this.expressionList.courseId;	
				url += '?classId=' + this.expressionList.classId;
				url += '&&lecturerId=' + this.expressionList.lecturerId;
				url += '&&isFirst=' + this.isFirst;
				url += '&&coursesStar=' + parseFloat(this.setCourseStar);
				url += '&&lecturerStar=' + parseFloat(this.setMasterStar);
				url += '&&coursesComment=' + this.courseExpress;
				url += '&&lecturerComment=' + this.masterExpress;

				//扫码评价班级
				if(this.isFromScan){
					url += '&&classStar=' + parseFloat(this.setClassStar);
					url += '&&classComment=' + this.classExpress;
				}

				Indicator.open({
					text: '正在提交',
					spinnerType: 'triple-bounce'
				});
				this.$http.get(url).then(function(data) {
					Indicator.close();
					if(data.data.status == 1){
						Toast({
							message: '评论成功！',
							className: 'changeIndex',
							duration: 1000
						});
					}else{
						Toast({
							message: data.data.errorMessage,
							className: 'changeIndex',
							duration: 1000
						});
					}
					this.canGoBack = true;
				});	
			
			},
			goBack: function(){
				if(this.isFromScan){
					try {
						
				 		ExpressPlugin.backToWidget();
					} catch (e) {
					}
				}else{
					this.$router.go(-1)
				}
			}
		}
	}
</script>
<style lang="less">
	.scan-to-express-course, .scan-to-express-class{
		font-size: 12px;
		.scroll-box{
			height: calc(~"100vh - 46px");
			overflow-y: auto;

			header{
				padding: 5% 3.6%;
	    		background-color: #fff;
	    		margin-bottom: 3.6%;
	    		.express-info{
		    		h1{
		    			font-size: 0.5rem;
		    			margin-bottom: 3.6%;
					    overflow: hidden;
					    text-overflow: ellipsis;
					    white-space: nowrap;
		    		}
		    		div{
		    			color: #999999;
		    			font-size: 1.2em;
		    			span{
		    				i{
		    					color: #333;
		    				}
		    			}
		    			span.project{
		    				display: inline-block;
    						width: 60%;
		    			}
		    		}
	    		}
			}
			section{
				margin-bottom: 50px;
				.express-box{
					padding-bottom: 3.6%;
					background-color: #fff;
					.mint-popup-title{
	    				.set-star-box{
	    					width: 68%;
	    				}
					}
					.express-bottom{
						margin: 3.6% 3.6% 0;
					}
				}
				.master-express{
					margin-top: 3.6%;
					background-color: #fff;
				}
			}
		}
		footer{
			border: none;
			text-align: center;
			position: absolute;
		    bottom: 0;
		    width: 100%;
		    z-index: 100;
			div{
				width: 100%;
			    line-height: 50px;
			    background-color: #ff4141;
			    color: #fff;
			    font-size: 1.3em;
			}
		}
	}
	/*.scan-to-express-course{
		section{
			margin-bottom: 64px;
		}
	}*/
</style>