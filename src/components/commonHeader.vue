<template>
	<div class="header-wrapper">
		<mt-header :title="title" class="is-fixed">
			<div slot="left">
			    <mt-button icon="back" @click="back" id="beBackBtn"></mt-button>

			</div>
			
			<div class="right-wrapper" slot="right">
				<slot name="rightContent">
					<div class="message-box">
						<mt-button :style="'position: relative; top: 3px;'" v-if="showMessage">
							<router-link to="/messageLists" name="消息">
								<img class="message" src="../../static/img/message.png">
								<span class="message-num" v-if="messageNum > 0">{{messageNum}}</span>
							</router-link>
						</mt-button>
					</div>
					
				</slot>
			</div>	
		</mt-header>	
	</div>
</template>
<script>
	import title from '../routerMap.js'
	export default {
		data() {
			return {
				title: '学习',
				footerVisable: true,
				formScan: false,
				ifCollege: false
			}
		},
		props: {
			reTitle: {
				type: String
			},
			showMessage: {
				type: Boolean
			},
			messageNum: {}
		},
		mounted() {
			this.path();
		},
		beforeDestroyed(){
			this.formScan = false;
		},
		methods: {
			back(){
				//console.log(this.$route);
				// 当在一级目录下时点回退直接退出微服务
				// 扫码进入评价页面、签到页面
				if(this.$route.path=='/' || this.$route.path=='/main' || 
				   this.$route.path.indexOf('scanToExpressClass') >= 0 && this.$route.query.scan ||
				   this.$route.path.indexOf('scanToExpressCourse') >= 0 && this.$route.query.scan ||
				   this.$route.path.indexOf('registerAttendance') >= 0 && this.$route.query.scan){
					try {
				 		ExpressPlugin.backToWidget();
					} catch (e) {
					}
				// 扫码进入项目/课程详情页
				}else if(this.$route.path.indexOf('onLineCourse') >= 0 && this.$route.query.scan || 
						 this.$route.path.indexOf('faceToFaceCourse') >= 0 && this.$route.query.scan || 
						 this.$route.path.indexOf('trainCourse') >= 0 && this.$route.query.scan){

					window.location.replace('#/main');
					this.formScan = false;

				/*// 焦点图点击进入，并返回列表页
				}else if(this.$route.path.indexOf('onLineCourse') >= 0 && this.$route.query.from == 'main' || 
						 this.$route.path.indexOf('faceToFaceCourse') >= 0 && this.$route.query.from == 'main' || 
						 this.$route.path.indexOf('trainCourse') >= 0 && this.$route.query.from == 'main'){
					if(this.$route.path.indexOf('trainCourse') >= 0){
						window.location.replace('#/ProjectList/-1');
					}else{
						window.location.replace('#/CourseList/-1');
					}*/

				// 扫码进去考试/调研页面
				}else if(this.$route.path.indexOf('kaoshi-datiye') >= 0 && this.$route.query.scan || 
						 this.$route.path.indexOf('diaoyan') >= 0 && this.$route.query.scan){

					window.location.replace('#/main');
					this.formScan = false;

				// 扫码进去考试/调研页面，提交成功后返回列表页，控制返回首页
				}else if(this.$route.path.indexOf('myExamList') >= 0 && this.formScan || 
						this.$route.path.indexOf('mySurvey') >= 0 && this.formScan){
					window.location.replace('#/MyCenter');

				}else if(this.$route.path.indexOf('myExamList') >= 0 && this.$route.query.finish || 
						this.$route.path.indexOf('mySurvey') >= 0 && this.$route.query.finish){
					this.$router.go(-2);

				}else if((this.$route.path == '/MyCenter') && this.formScan){
					window.location.replace('#/main');
					this.formScan = false;

				}else if(this.$route.path == '/knowledge/index'){
					window.location.replace('#/main');
				}else{

					this.$router.go(-1);
				}

				//console.log(this.formScan);
			},
			close(){
				try {
			 		ExpressPlugin.backToWidget();
				} catch (e) {
				}
			},
			path(){
				var that = this;
				var length = title.length;
				var path = that.$route.path;
				var originPath;
				if(that.$route.matched.length > 0){
					originPath = that.$route.matched[0].path;
				}
				if(that.$route.path =='/'){
					that.footerVisable = true;
				}else{
					that.footerVisable = false;
				}
				if(!that.reTitle){
					for(var i=0;i<length; i++){
						if(path==title[i].path || originPath == title[i].path){
							that.title=title[i].meta.title
						}
						if(path.indexOf('myClasses') >= 0 && this.$route.query.type == '0'){
							that.title = '学习任务';
						}
						if(path.indexOf('myExamList') >= 0 && this.$route.query.type == '0'){
							that.title = '考试';
						}
						if(path.indexOf('mySurvey') >= 0 && this.$route.query.type == '0'){
							that.title = '调研';
						}
					}
				}else{
					that.title = that.reTitle;
				}
				
				if(that.$route.query.scan){
					that.formScan = true;
				}
				if (path.indexOf('MyProjectCollege') >= 0) {
					that.ifCollege = true;
				}else {
					that.ifCollege = false;
				}
				//console.log(this.formScan);
			}
		},
		watch:{
			$route:'path'
		}
	}
</script>
<style lang="less">
	.right-wrapper{
		.message-box{
			position: relative;
			.message-num{
				position: absolute;
				top: 0;
				right: 0;
				color: #ff4141;
				z-index: 1000;
				font-size: .32rem;
				line-height: .5rem;
				font-weight: 600;
			}
		}
	}
</style>