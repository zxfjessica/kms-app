<template>
	<div>
		<v-common-header></v-common-header>
		<div class="survey-container-one container">
			<div class="box-section" >
				<!-- 调研答题页 -->
				<div class="survey-container-content-box" v-if="!showSubmitResult && isStartToSurvey">
				    <section class="subject content-box">
					    <div class="datika-middle">
					    	<div class="title">
								<div class="xuanze-title" v-if="currentItem.type != 'ANS'">
									<span class="title-index">
										<i class="isNecessary" v-if="isSkipSurvay || currentItem.requireFlag == 1">*</i>
										{{currentIndex + 1}}
									</span>. 
									<span class="title-type">({{currentItem.type == 'SGC' ? '单选题' : 
																(currentItem.type == 'RPC' ? '多选题' : '')}})</span>
									<span class="title-content">{{currentItem.content}}</span>
								</div>
								<div class="wenda-title" v-if="currentItem.type == 'ANS'">
									<span class="title-index">
										<i class="isNecessary" v-if="isSkipSurvay || currentItem.requireFlag == 1">*</i>
										{{currentIndex + 1}}
									</span>. 
									<span class="title-type">(问答题)</span>
									<span class="title-content">{{currentItem.content}}</span>
								</div>
							</div>
							<!-- 单选题、双选题、判断题 -->
							<div class="xuanze-content" v-if="currentItem.type != 'ANS'">
								<!-- 单选题 -->
								<div class="danxuanti-box" v-if="currentItem.type == 'SGC'">
									<ul class="item-lists xuanzeti">
										<li class="item-list" v-for="danxuanItem in currentItem.answerList">
											<span class="index" 
												  @click="chooseItem(danxuanItem.id, currentItem.type, danxuanItem.skipSortNo, currentItem.skipSortNo)"
												  :class="{select: currentItem.selectID == danxuanItem.id}">{{danxuanItem.index}}</span>
											<span class="choose-item">{{danxuanItem.content}}</span>
										</li>
									</ul>
								</div>
								
								<!-- 双选题 -->
								<div class="shaungxuanti-box" v-if="currentItem.type == 'RPC'">
									<ul class="item-lists xuanzeti">
										<li class="item-list" v-for="duoxuanItem in currentItem.answerList">
											<span class="index duoxuan" 
												  @click="chooseItem(duoxuanItem.id, currentItem.type, duoxuanItem.skipSortNo, currentItem.skipSortNo)"
												  :class="{select: currentItem.selectID && currentItem.selectID.indexOf(duoxuanItem.id) >= 0}">{{duoxuanItem.index}}</span>
											<span class="choose-item">{{duoxuanItem.content}}</span><!--  -->
										</li>
									</ul> 
								</div>
							</div>
							<!-- 问答题 -->
							<div class="wendati-content" v-if="currentItem.type == 'ANS'">
								<ul class="item-lists">
									<li class="item-list">
										<textarea placeholder="请输入你的答案" v-model="currentItem.selectContent">
											
										</textarea>
										<p class="hasWritten">{{currentItem.selectContent.length}} / 1000</p>
									</li>
									
								</ul>
							</div>
						</div>
						<!-- 等待提交遮罩层 -->
						<!-- <mt-spinner v-if="hasPostData" type="triple-bounce" class="triple-bounce" color="#fff" :size="40"></mt-spinner> -->
				    </section>
					<footer>
						<div class="exam-choose clearfix">
							<span class="pre-exam fl" v-if="currentIndex != 0" @click="moveToPre">
								<img src="../../static/img/pre.png"/>上一题</span>
							<span class="next-exam fr" v-if="currentIndex != assessmentLists.length - 1" @click="moveToNext">
								下一题<img src="../../static/img/next.png"/></span>
							<div class="submit-btn fr" v-if="currentIndex == assessmentLists.length - 1" @click="submitData">提交</div>
						</div>
					</footer>
				</div>

			    <!-- 提交成功提示框 -->
			    <show-action-box :title="submitTitle"
			    				 v-if="showSubmitResult"></show-action-box>
			    <!-- 调研说明页 -->
				<survey-home :itemsNumber="questionCount"
			    			 :surveyID="assessmentId"
			    			 :describeContent="describeContent"
			    			 :title="title"
			    			 @closeSurveyHome="closeSurveyHome"
			    			 v-if="!isStartToSurvey"></survey-home>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
import surveyHome from '../components/surveyHome.vue';
	import showActionBox from '../components/showActionBox.vue';
	import { MessageBox, Toast, Indicator } from 'mint-ui';
	import commonHeader from '../components/commonHeader.vue';
	export default {
		components: {
			showActionBox,
			surveyHome,
			"v-common-header": commonHeader
		},
		data() {
			return {
				title: '',
				describeContent: '',
				questionCount: 0,
				oldsel:null,
				popupVisible:false,//模态层开关
				assessmentId: '',
				assessmentLists: [],
				currentIndex: 0,
				currentItem: {},
				submitTitle: '',
				showSubmitResult: false,
				isStartToSurvey: false,
				answerPath: [],//储存路径
				answerResult: [], //储存答案
				answerPathIndex: 0, //当前路径指标
				isSkipSurvay: false
				
			};
		},
		mounted: function(){		

			var that = this;				
			that.assessmentId = this.$route.params.ID;
			var classUrl = that.$global().host + '/KMS-MSERVER/learning/assessment/viewAssessment?assessmentId=' + that.assessmentId;
			
            var originData;
            that.$http.get(classUrl).then(function(data) {
            	//console.log(data.data.data);
            	if(data.data.errorMessage){
            		return MessageBox({
					  	title: '',
					  	message: data.data.errorMessage,
					  	confirmButtonText: '知道了',
						closeOnClickModal: false
					}).then(function(){
						if(that.$route.query.scan){
							try {
					
						 		ExpressPlugin.backToWidget();
							} catch (e) {
							}
						}else{
							that.$router.go(-1)
						}
					});
            	};
            	that.title = data.data.data.title;
            	that.describeContent = data.data.data.describeContent;
            	that.questionCount = data.data.data.questionCount;

                //that.initAssessment(data.data.data.options);
            });

            Array.prototype.remove = function (dx) {
		        if (isNaN(dx) || dx > this.length) {
		            return false;
		        }
		        for (var i = 0, n = 0; i < this.length; i++) {
		            if (this[i] != this[dx]) {
		                this[n++] = this[i]
		            }
		        }
		        this.length -= 1
		    }
		},
		beforeDestroy(){
			document.getElementById('beBackBtn').style.display = 'block';
		},
		methods: {
			closeSurveyHome: function(){
				var that = this;

				var classUrl = that.$global().host + '/KMS-MSERVER/learning/assessment/enterAssessment?assessmentId=' + that.assessmentId;

	            that.$http.get(classUrl).then(function(data) {
	            	if(data.data && data.data.data && data.data.data.options){
	            		that.initAssessment(data.data.data.options);
						that.isStartToSurvey = true;
						document.getElementById('beBackBtn').style.display = 'none';//屏蔽返回按钮
	            	}
	                
	            });
			},
			initAssessment: function(data){
				var that = this;
				//修改样式
				var indexList = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
				for(var index = 0; index < data.length; index++){
					if(data[index].type != 'ANS'){
						for(var i = 0; i < data[index].answerList.length; i++){
							data[index].answerList[i].index = indexList[i];
						}
					}
					if(data[index].advancedMode == 1){
						that.isSkipSurvay = true;//是否高级模式
					}
					data[index].selectContent = '';
					data[index].selectID = '';
					data[index].selectFinalyAnswer = '';
				}
				that.assessmentLists = data;
				that.currentItem = that.assessmentLists[that.currentIndex];
				that.answerPath.push(0);
			},
			chooseItem: function(itemID, type, itemSkipSortNo, skipSortNo){//单选题、多选题答案选择
				itemID = '' + itemID;
				if(type == 'SGC'){
					this.$set(this.currentItem, 'selectID', itemID);

					var skipNo = skipSortNo ? skipSortNo : itemSkipSortNo;

					if(skipNo){
						this.$set(this.currentItem, 'skipNo', skipNo);
					}else{
						this.$set(this.currentItem, 'skipNo', '');
					}

				}else if(type == 'RPC'){
					var idList = this.currentItem.selectID || '';
					if(idList.indexOf(itemID) >= 0){
						var newIdList = idList.split(',');
						newIdList.splice(newIdList.indexOf(itemID), 1);
						this.$set(this.currentItem, 'selectID', newIdList.join(','));

					}else{
						if(idList){
							this.$set(this.currentItem, 'selectID', idList + ',' + itemID);
						}else{
							this.$set(this.currentItem, 'selectID', itemID);
						}
					}
				}
				
				//如果已选的话，拼接答案，记录已选
				if(this.currentItem.selectID){
					this.$set(this.currentItem, 'isSelect', true);
					this.$set(this.currentItem, 'selectFinalyAnswer', this.currentItem.id + '%@%' + this.currentItem.selectID);
				}else{
					this.$set(this.currentItem, 'isSelect', false);
					this.$set(this.currentItem, 'selectFinalyAnswer', '');
				}
			},
			ifChangSkipPath: function(skipNo){
				//比较是否更改选项
				var isChange = false;
				var originSkipNo = this.answerPath[this.answerPathIndex + 1];
				var originAnswer = this.answerResult[originSkipNo];
				if(originSkipNo){
					if(originSkipNo != (skipNo-1)){//现在的跳题是否与之前的跳题冲突，是的话执行删除操作
						for(var index = 0; index < this.answerPath.length; index++){
							if(originSkipNo == this.answerPath[index]){
								isChange = true;
								while(this.answerPath.length > index){
									this.answerResult[this.answerPath[index]] = '';
									this.assessmentLists[this.answerPath[index]].selectID = '';
									this.assessmentLists[this.answerPath[index]].selectContent = '';
			                    	this.answerPath.remove(index);
								}
							}else{
								continue;
								isChange = false;
							}
						}
					}
				}
				return isChange;
			},
			saveANS: function(){//检查并保存问答题答案
				if(this.currentItem.type == 'ANS'){//检查问答题是否已做
					if(this.currentItem.selectContent){
						this.currentItem.isSelect = true;
						this.currentItem.selectFinalyAnswer = this.currentItem.id + '%@%' + this.currentItem.selectContent;
						if(this.currentItem.selectContent.length > 1000){
							return false;
						}
					}else{
						this.currentItem.isSelect = false;
					}
				}
				return true;
			},
			checkIsNecessary: function(){//检查并提示是否必答
				if((this.currentItem.requireFlag == 1 && !this.currentItem.isSelect) || (this.isSkipSurvay && !this.currentItem.isSelect)){//检查是否必答题
					return Toast({message: '此题为必答题，请答题！', duration: 1000}), false;
				}else{
					return true;
				}
			},
			saveAnswer: function(type){
				this.saveANS();

				if(type == 'submit'){//若为提交，需检查是否为必答，若为上一题则无需检查必答
					this.checkIsNecessary();
				}
				
				
				var skipNo;
				var isChange;
				if(this.currentItem.type == 'SGC'){
					if(this.currentItem.skipNo){//选项跳题   需判断如果是单选题，而且改变了原有的跳题路径时
						skipNo = this.currentItem.skipNo;
						//this.currentItem.skipNo = '';

						isChange = this.ifChangSkipPath(skipNo);
					}
				}

				if(this.currentItem.skipSortNo){//设置跳题的序号
					skipNo = this.currentItem.skipSortNo;
				}

				//保存上一题答案
				if(this.currentItem.selectFinalyAnswer){
					if(this.answerPath[this.answerPathIndex] != undefined){
						this.answerResult[this.answerPath[this.answerPathIndex]] = this.currentItem.selectFinalyAnswer;
					}
					
				}

				return true;

				/*if(skipNo){//有跳题
					this.answerPath.push(skipNo - 1);
				}else{//没有跳题
					this.answerPath.push(this.currentIndex);
				}*/
			},
			getPreIndex: function(){
				this.answerPathIndex--;
				return this.answerPath[this.answerPathIndex];
			},
			moveToPre: function(){
				if(this.isSkipSurvay){
					this.saveAnswer('pre');//先保存答案

					//console.log(this.answerPath);

					this.currentIndex = this.getPreIndex(this.currentIndex);
					this.currentItem = this.assessmentLists[this.currentIndex];
				}else{
					this.currentIndex--;
					this.currentItem = this.assessmentLists[this.currentIndex];
				}
				
			},
			moveToNext: function(){
				if(this.currentItem.type == 'ANS'){//检查问答题是否已做
					if(this.currentItem.selectContent){
						if(this.currentItem.selectContent.length > 1000){
							return Toast({message: '问答题不能超过1000字', duration: 1000});
						}
						this.currentItem.isSelect = true;
						this.currentItem.selectFinalyAnswer = this.currentItem.id + '%@%' + this.currentItem.selectContent;
					}else{
						this.currentItem.isSelect = false;
					}
				}
				if((this.currentItem.requireFlag == 1 && !this.currentItem.isSelect) || (this.isSkipSurvay && !this.currentItem.isSelect)){//检查是否必答题
					return Toast({message: '此题为必答题，请答题！', duration: 1000});
				}


				var isChange;

				if(this.isSkipSurvay){//高级模式
					var skipNo;
					if(this.currentItem.type == 'SGC'){
						if(this.currentItem.skipNo){//选项跳题   需判断如果是单选题，而且改变了原有的跳题路径时
							skipNo = this.currentItem.skipNo;
							//this.currentItem.skipNo = '';

							isChange = this.ifChangSkipPath(skipNo);
						}
					}

					if(this.currentItem.skipSortNo){//设置跳题的序号
						skipNo = this.currentItem.skipSortNo;
					}

					var isHasAnswer = false;

					if(this.answerResult[this.answerPath[this.answerPathIndex]]){
						isHasAnswer = true;
					};

					//保存上一题答案
					if(this.currentItem.selectFinalyAnswer){
						if(this.answerPath[this.answerPathIndex] != undefined){
							this.answerResult[this.answerPath[this.answerPathIndex]] = this.currentItem.selectFinalyAnswer;
						}
						
					}
					console.log(this.answerResult);
					//if(this.currentIndex != this.assessmentLists.length - 1 || this.currentIndex == this.assessmentLists.length - 1 && skipNo){
					if(skipNo > this.assessmentLists.length){
						return Toast({message: '跳题不存在！请更换选项', duration: 1000});
					}

						if(skipNo){//有跳题
							this.currentIndex = skipNo - 1;
						}else{//没有跳题
							this.currentIndex++;
						}

						(!isHasAnswer || isChange) && this.answerPath.push(this.currentIndex);
						this.answerPathIndex++;

						console.log(this.answerPath);
						//console.log(this.answerPathIndex);

						this.currentItem = this.assessmentLists[this.currentIndex];
					/*}else{
						this.currentIndex = this.assessmentLists.length - 1;
						this.currentItem = this.assessmentLists[this.currentIndex];
						this.submitData();
					}*/

				}else{//简单模式
					//if(this.currentIndex != this.assessmentLists.length - 1){
						this.currentIndex++;
						this.currentItem = this.assessmentLists[this.currentIndex]
					/*}else{
						this.currentIndex = this.assessmentLists.length - 1;
						this.currentItem = this.assessmentLists[this.currentIndex]
						this.submitData();
					}*/
					
				}
			},
			joinData: function(data){//0->2->5->6->9->10    ["0", "2", "5", "6", "9", "10"]
				var answerList = [];
				if(this.isSkipSurvay){
					/*for(var i = 0; i < this.answerPath.length; i++){
						var item = this.assessmentLists[parseInt(this.answerPath[i])];

						if(item.isSelect && item.selectFinalyAnswer){
							answerList.push(item.selectFinalyAnswer);
						}else{
							continue;
						}
					}*/
					for(var i = 0; i < this.answerResult.length; i++){
						if(this.answerResult[i]){
							answerList.push(this.answerResult[i]);
						}
					}
				}else{
					for(var i = 0; i < this.assessmentLists.length; i++){
						var item = this.assessmentLists[i];

						if(item.isSelect && item.selectFinalyAnswer){
							answerList.push(item.selectFinalyAnswer);
						}else{
							continue;
						}
					}
				}
				
				//return answerList;
				return answerList.join('%~%') || '';
			},
			submitData: function(){
				var that = this;

				//如果最后一题是问答题
				var isOver1 = that.saveANS();
				if(!isOver1){
					return Toast({message: '问答题不能超过1000字', duration: 1000});
				}

				var result = that.checkIsNecessary();
				if(!result){
					return result;
				}

				if(that.isSkipSurvay){
					that.saveAnswer('submit');
				}

				var answer = that.joinData(that.assessmentLists);
				console.log(answer);
				var newAnswer = encodeURIComponent(answer);	
				if(that.currentIndex == that.assessmentLists.length - 1){
					MessageBox({
					  	title: '',
					  	message: '已是最后一题',
					  	confirmButtonText: '确定提交',
					  	cancelButtonText: '继续调研',
					  	showCancelButton: true,
						closeOnClickModal: false
					}).then(function(action){
						if(action == 'confirm'){
							var url = that.$global().host+'/KMS-MSERVER/learning/assessment/submitAssessment';
							url += '?assessmentId=' + that.assessmentId;
							url += '&&userAnswers=' + newAnswer;

							Indicator.open({
								text: '正在提交',
								spinnerType: 'triple-bounce'
							});
							that.$http.get(url).then(function(response) {
								//console.log(response.data.errorMessage);
								Indicator.close();
								if(response.data && response.data.data && response.data.data.result == '提交成功'){
									that.submitTitle = response.data.data.result;
									that.showSubmitResult = true;
									return true;
								}
								return false;

							});
						}
					});	
				}else{
					var url = that.$global().host+'/KMS-MSERVER/learning/assessment/submitAssessment';
					url += '?assessmentId=' + that.assessmentId;
					url += '&&userAnswers=' + newAnswer;

					Indicator.open({
						text: '正在提交',
						spinnerType: 'triple-bounce'
					});
					that.$http.get(url).then(function(response) {
						//console.log(response.data.errorMessage);
						Indicator.close();
						if(response.data && response.data.data && response.data.data.result == '提交成功'){
							that.submitTitle = response.data.data.result;
							that.showSubmitResult = true;
							return true;
						}
						return false;

					});
				}		

			}
		},
		beforeRouteLeave (to, from, next){
			//debugger;
			var that = this;
			
			if(!that.isStartToSurvey){
				localStorage.setItem('diaoyan-isFinish', false);
			}
			
			if(!that.showSubmitResult && that.isStartToSurvey){

				MessageBox({
				  	title: '',
				  	message: '调研还未提交，退出将自动提交',
				  	confirmButtonText: '确定退出',
				  	cancelButtonText: '继续调研',
				  	showCancelButton: true,
					closeOnClickModal: false
				}).then(function(action){
					if(action == 'confirm'){
						var promise = that.submitData();
						if(promise){
							next();
						}else{
							next(false);
						}
					}else{
						return next(false);

					}
				});
			}else{
				next();
			}
		}
	}
</script>
<style lang="less">
	.survey-container-one{
		section.content-box.subject{
			/*height: calc(~"100vh - 96px - 1.4rem");*/
			height: calc(~"100vh - 96px - 1.4rem");
    		margin-bottom: 50px;
    		overflow-y: auto;
		}

		section.content-box .datika-middle .title{
			width: 100%;
			word-break: break-word;
			font-size: 0.5rem !important;
		}
		.submit-btn{
			width: 30%;
		    background-color: #ff4141;
		    color: #fff;
		    margin-right: -3.6%;
		}
		.isNecessary{
			color: #ff4141;
		}
		.triple-bounce {
		    width: 103.6%;
		    left: -3.6%;
		}
		
	}
</style>
