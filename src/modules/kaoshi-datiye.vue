<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container kaoshi-datiye">

			<div v-if="isStartExam && isShowExamPage && !showSubmitResult" class="datiye-section">
				<div class="box-section">
					<header>
						<div class="datiye-top clearfix">
							<span class="less-time fl" v-if="isFormCenter">
								剩余时间
								<i class="time">{{(''+ hh).length < 2 ? ('0' + hh) : hh}} : 
												{{(''+ mm).length < 2 ? ('0' + mm) : mm}} : 
												{{(''+ ss).length < 2 ? ('0' + ss) : ss}}</i>
							</span>
							<span class="datika fr" @click="showDatikaNow">
								<i class="signs2 datika-signs">答题卡</i>
							</span>
						</div>
					</header>
					<section class="content-box">
						<div class="datika-list" v-if="showDatika">
							<span :class="{active: list.isSelect || list.selectContent}" 
								  v-for="(list, index) in examLists" 
								  @click="changeToItem(index)">{{index + 1}}</span>
						</div>
						<div class="datika-middle" v-if="showExam">
							<!-- 考试题目 -->
							<div class="title">
								<!-- <div class="xuanze-title" v-if="currentItem.questionType!= 4 && currentItem.questionType!= 5">
									<span class="title-index">{{currentIndex + 1}}</span>. 
									<span class="title-type">({{currentItem.questionType == 1 ? '单选题' : 
																(currentItem.questionType == 2 ? '多选题' : '判断题')}})</span>
									<span class="title-content">{{currentItem.questionTitle}}</span>
								</div>
								<div class="tiankong-title" v-if="currentItem.questionType == 4">
									<span class="title-index">{{currentIndex + 1}}</span>. 
									<span class="title-type">(填空题)</span>
									<span class="title-content"v-html="currentItem.newTitle"></span> 
								</div>
								<div class="wenda-title" v-if="currentItem.questionType == 5">
									<span class="title-index">{{currentIndex + 1}}</span>. 
									<span class="title-type">(问答题)</span>
									<span class="title-content">{{currentItem.questionTitle}}</span>
								</div> -->
								<v-exam-question-title :index="currentIndex"
														:item="currentItem"
														@playVideo="showVideo = true"></v-exam-question-title>	
							</div>
							<!-- 单选题、双选题、判断题 -->
							<div class="xuanze-content" v-if="currentItem.questionType!= 4 && currentItem.questionType!= 5">
								<!-- 单选题 -->
								<div class="danxuanti-box" v-if="currentItem.questionType == 1">
									<ul class="item-lists xuanzeti">
										<li class="item-list" v-for="danxuanItem in currentItem.answerIdList">
											<span class="index" 
												  @click="chooseItem(danxuanItem.id, danxuanItem.name, currentItem.questionType)"
												  :class="{select: currentItem.selectID == danxuanItem.id}">{{danxuanItem.index}}</span>
											<span class="choose-item">{{danxuanItem.name}}</span>
										</li>
									</ul>
									<div class="correct-answer">
										<p v-if="currentItem.answerConnect"><span>考生答案：</span>{{currentItem.answerConnect.split('^_^')[0]}}</p>
										<p v-if="currentItem.answerRightConnect"><span>正确答案：</span>{{currentItem.answerRightConnect.split('^_^')[0]}}</p>
									</div>
								</div>
								
								<!-- 双选题 -->
								<div class="shaungxuanti-box" v-if="currentItem.questionType == 2">
									<ul class="item-lists xuanzeti">
										<li class="item-list" v-for="duoxuanItem in currentItem.answerIdList">
											<span class="index duoxuan" 
												  @click="chooseItem(duoxuanItem.id, duoxuanItem.name, currentItem.questionType)"
												  :class="{select: currentItem.selectID && currentItem.selectID.indexOf(duoxuanItem.id) >= 0}">{{duoxuanItem.index}}</span>
											<span class="choose-item">{{duoxuanItem.name}}</span>
										</li>
									</ul> 
									<div class="correct-answer">
										<p v-if="currentItem.answerConnect"><span>考生答案：</span>{{currentItem.answerConnect.split('^_^').join(' ; ')}}</p>
										<p v-if="currentItem.answerRightConnect"><span>正确答案：</span>{{currentItem.answerRightConnect.split('^_^').join(' ; ')}}</p>
									</div>
								</div>
								
								<!-- 判断题 -->
								<div class="paduanti-box" v-if="currentItem.questionType == 3">
									<ul class="item-lists panduanti">
										<li class="item-list" v-for="panduanItem in currentItem.answerIdList">
											<span class="index" 
												  @click="chooseItem(panduanItem.id, panduanItem.name, currentItem.questionType)"
												  :class="{select: currentItem.selectID == panduanItem.id}">{{panduanItem.index}}</span>
											<span class="choose-item">{{panduanItem.name == '1'? '对' : '错'}}</span>
										</li>
									</ul>
									<div class="correct-answer">
										<p v-if="currentItem.answerConnect"><span>考生答案：</span>{{currentItem.answerConnect.split('^_^')[0]}}</p>
										<p v-if="currentItem.answerRightConnect"><span>正确答案：</span>{{currentItem.answerRightConnect.split('^_^')[0]}}</p>
									</div>
								</div>
								
							</div>
							<!-- 填空题 -->
							<div class="tiankongti-content" v-if="currentItem.questionType == 4">
								<ul class="item-lists">
									<li class="item-list" v-for="(tiankongItem, index) in currentItem.answerIdList[0].tiankongList">
										<div>填空{{index+1}}答案:</div>
										<textarea type="text" placeholder="请输入你的答案"  v-model="tiankongItem.name"/> </textarea>
									</li>
									
								</ul>
								<div class="correct-answer">
									<p v-if="currentItem.answerConnect"><span>考生答案：</span>{{currentItem.answerConnect}}</p>
									<p v-if="currentItem.answerRightConnect"><span>正确答案：</span>{{currentItem.answerRightConnect}}</p>
								</div>
							</div>
							<!-- 问答题 -->
							<div class="wendati-content" v-if="currentItem.questionType == 5">
								<ul class="item-lists">
									<li class="item-list">
										<textarea placeholder="请输入你的答案" v-model="currentItem.selectContent">
											
										</textarea>
										<p class="hasWritten">{{currentItem.selectContent.length}} / 1000</p>
									</li>
									
								</ul>
								<div class="correct-answer">
									<p v-if="currentItem.answerConnect"><span>考生答案：</span>{{currentItem.answerRightConnect}}</p>
									<p v-if="currentItem.answerRightConnect"><span>正确答案：</span>{{currentItem.answerConnect}}</p>
								</div>
							</div>
						</div>
						<div class="already-last-item" v-if="showSubmit && isFormCenter">
							<p>已经是最后一题</p>
							<p>请交卷或返回题目继续作答</p>
						</div>
						<div class="already-last-item" v-if="showSubmit && !isFormCenter">
							<p>已经是最后一题</p>
						</div>
						
					</section>
				</div>
				<!-- 开始考试最后一题提交试卷 -->
				<div class="submit-exam" v-if="showSubmit && isFormCenter" @click="submitExam">提交</div>

				<!-- 查看试卷最后一题返回 -->
				<div class="submit-exam" v-if="showSubmit && !isFormCenter">
					<a class="reback" @click="goBack">返回</a>
				</div>

				<footer v-if="showExam || showDatika">
					<div class="exam-choose clearfix" v-if="showExam">
						<span class="pre-exam fl" v-if="currentIndex != 0" @click="moveToPre"><img src="../../static/img/pre.png"/>上一题</span>
						<span class="next-exam fr" @click="moveToNext">下一题<img src="../../static/img/next.png"/></span>
					</div>
					<!-- 查看答题卡后返回 -->
					<div class="back-to-exam" v-if="showDatika" @click="showDatika = false, showExam = true, showSubmit = false">返回</div>
				</footer>
			</div>
			<kaoshi-center v-if="isStartExam && isShowExamInfosPage"
						   :examId="examId"
						   :examInfos="examInfos" 
						   @startExam="startExam"></kaoshi-center>

			<!-- 提交考试结果页 -->
			<show-action-box :title="submitTitle"
							 v-if="showSubmitResult"></show-action-box>
		</div>
	</div>
</template>
<script type="text/javascript">
	import showActionBox from '../components/showActionBox.vue';
	import kaoshiCenter from '../components/kaoshiCenter.vue';
	import { MessageBox, Toast, Indicator } from 'mint-ui';
	import commonHeader from '../components/commonHeader.vue';
	import examQuestionTitle from '../components/common/examQuestionTitle.vue';
	export default{
		components: {
			showActionBox,
			kaoshiCenter,
			"v-common-header": commonHeader,
			'v-exam-question-title': examQuestionTitle
		},
		data(){
			return {
				isStartExam: false,
				isFormCenter: true,//
				showDatika: false,//显示答题卡
				showExam: true, //显示答题界面
				showSubmit: false, //显示提交页面
				examLists: [],//考题信息
				currentItem: {},//当前考题
				currentIndex: 0,//当前考题下标
				shengyutimu: 0,
				isFinish: !1,
				permitTime: 60,
				hh: 0,
				mm: 0,
				ss: 0,
				showSubmitResult: false,
				submitTitle: '',
				submitTypt: 1,
				curWendaAnswer: '',
				empTryCount: 0,
				examInfos: [],//考试信息
				isShowExam: '0' ,//0 考试 || 1 查看考试
				isShowExamPage: false, //显示考题页面
				isShowExamInfosPage: false, //显示考题简介页面
				showVideo: false//是否播放了视频
			}
		},/*
		beforeRouteEnter(to, from, next){
			var isFormCenter;
			if(from.fullPath.indexOf('myExamList') >= 0){
				isFormCenter = false;
			}else{
				isFormCenter = true;
			};
			next(function(vm){
				vm.isFormCenter = isFormCenter;
			});
		},*/
		beforeDestroy(){
			if(this.$route.query.type == 0){
				document.getElementById('beBackBtn').style.display = 'block';
				clearInterval(this.timeSet);
			}
			if(this.showVideo){
				try {
					ExpressPlugin.showStatusBar();
				}catch(e){}
				//this.player.dispose();
			}
		},
		mounted(){
			var that = this;
			that.examId = that.$route.params.ID;
			that.isShowExam = that.$route.query.type;
			localStorage && localStorage.setItem('isFromScan', that.$route.query.scan || false);

			if(that.isShowExam == 0){//考试
				that.isFormCenter = true;
			}else{
				that.isFormCenter = false;//查看试卷
			}

			if(that.isFormCenter){
				var classUrl = that.$global().host+'/KMS-MSERVER/learning/stuExam/viewStuExam?examId='+ that.examId;
	            that.$http.get(classUrl).then(function(data) {
	            	//console.log(data.data.data.result);
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
	            	}
	            	if(data.data && data.data.data && data.data.data.result){
	            		return MessageBox({
						  	title: '',
						  	message: data.data.data.result,
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
	            	if(data.data && data.data.data && data.data.data.tryCount == data.data.data.empTryCount){
	            		return MessageBox({
						  	title: '',
						  	message: '尝试次数已经用完，不能参加考试',
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
	                that.examInfos = data.data.data;
					that.isStartExam = true;
					that.isShowExamPage = false;
					that.isShowExamInfosPage = true;
	                that.empTryCount = that.examInfos.empTryCount;
	            });
			}else{
				that.startExam();
			}
			
		},
		methods: {
			startExam: function(){
				var that = this;
				if(that.$route.query.type == 0){
					document.getElementById('beBackBtn').style.display = 'none';//屏蔽返回按钮
				}
				

				that.isStartExam = true;
				that.isShowExamPage = true;
				that.isShowExamInfosPage = false;

				var classUrl = that.$global().host + '/KMS-MSERVER/learning/stuExam/enterExam?type=' + that.isShowExam + '&&examId='+ that.examId;
	            var originData;
	            that.$http.get(classUrl).then(function(data) {
	                originData = data.data.data;
	                this.initKaoshi(originData);
	            });
			},
			initKaoshi: function(originData){
				var that = this;
				//修改样式
                for(var index = 0; index < originData.length; index++){
					var answerList = [];
					var answer = originData[index].answerIdList.split('^_^');
					var indexList = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
					for(var i = 0; i< answer.length; i++){
						var itemList = {};
						var item = answer[i].split('-.-');
						itemList.id = item[0];
						itemList.name = item[1];
						if(originData[index].questionType == 1 || originData[index].questionType == 2 || originData[index].questionType == 3){
							itemList.index = indexList[i];
						}
						if(originData[index].questionType == 4){
							var splitTitle;
							if(originData[index].questionTitle.indexOf('()') >= 0){
								splitTitle = originData[index].questionTitle.split('()');
							}else{
								splitTitle = originData[index].questionTitle.split('（）');
							}
							var newTitle = '';
							itemList.tiankongList = [];
							if(splitTitle.length > 1){
								for(var tianIndex = 0; tianIndex < splitTitle.length; tianIndex++){
									if(tianIndex != (splitTitle.length - 1) && splitTitle[tianIndex]){
										newTitle += splitTitle[tianIndex] + '<span class="tiankong">填空' + (tianIndex + 1) + '</span>';
										itemList.tiankongList.push({
											name: ''
										});
									}else{
										newTitle += splitTitle[tianIndex]
									}
									
								}
							}else{
								newTitle = '<span>' + splitTitle[0] + '</span>';
								itemList.tiankongList.push({
									name: ''
								});
							}
							
							originData[index].newTitle = newTitle;
						}
						
						answerList.push(itemList);
					}
					originData[index].answerIdList = answerList;

					if(originData[index].questionType == 5){
						originData[index].selectContent = '';
						originData[index].selectID = originData[index].questionId;
					}
				}
				that.examLists = originData;
				that.currentItem = that.examLists[that.currentIndex];

				//开启倒计时
				if(that.$route.query.type == 0){
					that.permitTime = that.currentItem.longTime;
					that.startDaojishi();
				}
			},
			postData: function(){
				var that = this;
				var answer = that.joinAnswer();
				var arr = encodeURIComponent(JSON.stringify(answer));
				var str = "examId="+ that.examId+"&empTryCount=" + that.empTryCount + "&examAnswerList=" + arr;
				//'http://10.118.13.26:8080/KMS-MSERVER/learning/stuExam/saveExam'
				clearInterval(that.timeSet);
				Indicator.open({
					text: '正在提交',
					spinnerType: 'triple-bounce'
				});
				//that.$global().host+'/KMS-MSERVER/learning/stuExam/saveExam''http://10.118.13.9:8080/KMS-MSERVER/learning/stuExam/saveExam'
				that.$http.post(that.$global().host+'/KMS-MSERVER/learning/stuExam/saveExam',str).then(function(response) {
					Indicator.close();
					if(response.data.errorMessage){
						return Toast({message: response.data.errorMessage, duration: 1000});
					}
					if(response.data.data.result == '提交成功'){
						that.submitTypt = response.data.status;
						that.showSubmit = false;
						that.showDatika = false;
						that.showExam = false;
						that.showSubmitResult = true;
						return true;
					}
					return false;

				});
				
			},
			submitExam: function(){
				var that = this;

				if(!that.isFinish && that.shengyutimu){
					MessageBox({
					  	title: '',
					  	message: '你还有 '+ that.shengyutimu +' 道题没作答，是否确认交卷?',
					  	confirmButtonText: '任性交卷',
					  	cancelButtonText: '继续作答',
					  	showCancelButton: true,
						closeOnClickModal: false
					}).then(function(action){
						if(action == 'confirm'){
							that.postData();
						}else{
							that.showSubmit = false;
							that.showExam = false;
							that.showDatika = true;
						}
					});
				}else{
					MessageBox({
					  	title: '',
					  	message: '是否确认交卷?',
					  	confirmButtonText: '确定交卷',
					  	cancelButtonText: '取消交卷',
					  	showCancelButton: true,
						closeOnClickModal: false
					}).then(function(action){
						if(action == 'confirm'){
							that.postData();
						}
					});
				}
				
			},
			joinAnswer: function(){
				this.shengyutimu = 0;
				var answerList = [];
				for(var i = 0; i< this.examLists.length; i++){
					var itemAnswerList = {};
					itemAnswerList.questionId = this.examLists[i].questionId;
					itemAnswerList.answerConnect = this.examLists[i].selectContent || '';
					itemAnswerList.answerIds = this.examLists[i].selectID || '';
					itemAnswerList.questionType = this.examLists[i].questionType;
					answerList.push(itemAnswerList);
					if(!this.examLists[i].isSelect){
						this.shengyutimu += 1
					}
				}
				if(this.shengyutimu == 0){
					this.isFinish = !0;
				}else{
					this.isFinish = !1;
				}
				return answerList;
			},
			moveToPre: function(){
				this.currentIndex -= 1;
				this.currentItem = this.examLists[this.currentIndex];
			},
			moveToNext: function(){
				this.checkTianKong();

				var isOverWenda = this.checkWenda();
				if(!isOverWenda){
					return Toast({message: '问答题答案不可超过1000字', duration: 1000});
				}
				this.joinAnswer();//获取检查多少题没做

				this.curWendaAnswer = '';

				if(this.currentIndex != (this.examLists.length-1)){//切换题目
					this.currentIndex += 1;
					this.currentItem = this.examLists[this.currentIndex];
				}else{
					this.currentIndex = this.examLists.length-1;
					this.currentItem = this.examLists[this.examLists.length-1];
					return (this.showDatika = false, this.showExam = false, this.showSubmit = true);
				}
				if(this.currentItem.questionType == 5){
					this.curWendaAnswer = this.currentItem.selectContent || '';
				}
			},
			changeToItem: function(index){//点击答题卡跳到相应页面
				this.currentIndex = index;
				this.currentItem = this.examLists[this.currentIndex];
				this.showDatika = false;
				this.showSubmit = false;
				this.showExam = true;
			},
			chooseItem: function(itemID, itemName, type){//单选题、多选题、判断题答案选择
				if(type == 1 || type == 3){
					this.$set(this.currentItem, 'selectContent', itemName);
					this.$set(this.currentItem, 'selectID', itemID);
				}else if(type == 2){
					var idList = this.currentItem.selectID || '';
					var contentList = this.currentItem.selectContent || '';
					if(idList.indexOf(itemID) >= 0){
						var newIdList = idList.split(',');
						newIdList.splice(newIdList.indexOf(itemID), 1);
						this.$set(this.currentItem, 'selectID', newIdList.join(','));

						var newContentList = contentList.split('^_^');
						newContentList.splice(newContentList.indexOf(itemID), 1);
						this.$set(this.currentItem, 'selectContent', newContentList.join('^_^'));
					}else{
						if(idList){
							this.$set(this.currentItem, 'selectContent', contentList + '^_^' +itemName);
							this.$set(this.currentItem, 'selectID', idList + ',' + itemID);
						}else{
							this.$set(this.currentItem, 'selectContent', itemName);
							this.$set(this.currentItem, 'selectID', itemID);
						}
					}
				}

				if(this.currentItem.selectID){
					this.$set(this.currentItem, 'isSelect', true);
				}else{
					this.$set(this.currentItem, 'isSelect', false);
				}
			},
			showDatikaNow: function(){
				//this.joinAnswer();
				this.checkTianKong();
				this.checkWenda();

				this.showExam = false;
				this.showSubmit = false
				this.showDatika = true;
			},
			checkTianKong: function(){//检查填空题是否已做及拼接答案
				if(this.currentItem.questionType == 4){//监听填空题答案
					var index;
					for(var j = 0; j< this.examLists.length; j++){
						if(this.currentItem.questionId == this.examLists[j].questionId){
							index = j;
							break;
						}
					}

					var item = this.examLists[index];
					var tiankongList = this.currentItem.answerIdList[0].tiankongList;
					var selectContent = '';
					for(var i = 0; i< tiankongList.length; i++){
						if(tiankongList[i].name){
							if(i != (tiankongList.length - 1)){
								selectContent += tiankongList[i].name + '^_^';
							}else{
								selectContent += tiankongList[i].name;
							}
							
						}
					}
					this.$set(this.examLists[index], 'selectContent', selectContent);
					this.$set(this.examLists[index], 'selectID', item.questionId);
					if(selectContent){
						this.$set(this.examLists[index], 'isSelect', true);
					}else{
						this.$set(this.examLists[index], 'isSelect', false);
					}
					return true;
				}
			},
			checkWenda: function(){//检查问答题是否已做
				if(this.currentItem.selectContent && this.currentItem.selectContent.length > 1000){
					return false;
				}
				for(var i = 0; i< this.examLists.length; i++){
					if(this.examLists[i].questionType == 5 && this.examLists[i].selectContent){
						this.examLists[i].isSelect = !0;
					}
				}
				return true;
			},
			startDaojishi: function(){//倒计时开启
				var that = this;
				var miaoTime = that.permitTime * 60;
				that.hh = parseInt(that.permitTime / 60);
				that.mm = that.permitTime % 60;
				that.ss = miaoTime - that.hh * 60 * 60 - that.mm * 60
				if(that.mm == 0){
					that.hh -= 1;
					that.mm = 59;
				}
				if(that.ss == 0){
					that.mm -= 1;
					that.ss = 59;
				}
				that.timeSet = setInterval(function(){
					//console.log(111);
					that.ss -= 1;
					if(that.ss == 0 && that.mm != 0){
						that.mm -= 1;
						that.ss = 59;
						//clearInterval(timeSet);
					}else if(that.ss == 0 && that.mm == 0 && that.hh !=0 ){
						that.hh -= 1;
						that.mm = 59;
						that.ss = 59;
					}else if(that.ss == 0 && that.mm == 0 && that.hh ==0 ){
						clearInterval(that.timeSet);
						/*Toast({message: '时间到了自动交卷', duration: 1000});*/
						that.submitTitle = '时间到，系统已自动为您交卷！';
						that.postData();
					}
				}, 1000);
			},
			goBack: function(){
				this.$router.go(-1);
			}
		},
		beforeRouteLeave (to, from, next){
			var that = this;
			if((!that.isStartExam || that.isStartExam && !that.isShowExamPage) && that.$route.query.type == 0){
				localStorage.setItem('kaoshi-datiye-isFinish', false);
			}
			if(!that.showSubmitResult && that.isStartExam && that.isShowExamPage && that.$route.query.type == 0){
				
				MessageBox({
				  	title: '',
				  	message: '考试还未提交，退出将自动提交',
				  	confirmButtonText: '确定退出',
				  	cancelButtonText: '继续考试',
				  	showCancelButton: true,
					closeOnClickModal: false
				}).then(function(action){
					if(action == 'confirm'){
						var promise = that.postData();
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
	.kaoshi-datiye, .survey-container-one{
		font-size: 12px;
		header{
			line-height: 1.33rem;
			border-bottom: 1px solid #e6e6e6;
			background-color: #fff;
			/*min-height: 7%;*/
			/*height: 43px;*/
			height: 1.31rem;
			span.less-time{
				margin-left: 3.6%;
			    font-size: 0.4rem;
			    color: #999;
			    i{
			    	color: #ff4141;
			    }
			}
			span.datika{
				width: 30%;
			    text-align: center;
			    background-color: #ff4141;
			    color: #fff;
			    font-size: 0.43rem;
			    .datika-signs:before{
			    	background-position: 0 -93px;
			    	top: -4px;
			    }
			}
		}
		section.content-box{
			background-color: #fff;
			padding: 0.7rem 3.6%;
			/*min-height: 40%;
		    max-height: 73%;*/
		    height: calc(~"100vh - 96px - 2.71rem");
		    width: 92.8%;
			.datika-list{
				span{
				    display: inline-block;
				    width: 0.83rem;
				    height: 0.83rem;
				    line-height: 0.83rem;
				    text-align: center;
				    border: 1px solid #9c9c9c;
				    border-radius: 50%;
				    margin-right: 0.35rem;
				    margin-bottom: 0.3rem;
				    font-size: 0.43rem;
				}
				.active{
					color: #fff;
					border-color: #ff4141;
					background-color: #ff4141;
				}
			}
			.datika-middle{
				height: 100%;
				/*.xuanze-content, .tiankongti-content, .wendati-content{
					max-height: calc(~"100% - 1.2rem");
					overflow-y: auto;

				}*/
				.title{
					font-size: 0;
					margin-bottom: 7%;
					
				}
				.item-lists{
					font-size: 0.43rem;
					.item-list{
						margin-bottom: 7%;
						.index{
							display: inline-block;
						    height: 0.6rem;
						    width: 0.6rem;
						    border: 1px solid #a1a1a1;
						    line-height: 0.6rem;
						    text-align: center;
						    border-radius: 50%;
						    margin-right: 8px;
						}
						/*.duoxuan{
							border-radius: 0;
						}*/
						.select{
							border-color: #ff4141;
							background-color: #ff4141;
							color: #fff;
						}
					}
				}
				.wendati-content, .tiankongti-content{
					textarea{
						width: 93%;
					    resize: none;
					    height: 2.67rem;
					    border-color: #dedede;
					    padding: 3%;
					    font-size: 0.35rem;
					    color: #666;
					    line-height: 0.5rem;
					    appearance:none;
					    -webkit-appearance: none; 
					    -moz-appearance: none; 
					    appearance: none;
					}
				}
				.tiankongti-content{
					textarea{
					    height: 1.67rem;
					    margin-top: 0.2rem;
					}
				}
				.hasWritten{
					text-align: right;
					color: #999999;
					font-size: 0.3rem;
				}
				.correct-answer{
					font-size: 0.4rem;
    				color: #ff4141;
				}
			}
			.already-last-item{
				text-align: center;
			    font-size: 0.4rem;
			    margin: 3.67rem 0;
			    line-height: 0.6rem;
			    color: #999;
			}

		}
		footer{
			line-height: 50px;
			height: 50px;
			overflow: hidden;
			font-size: 0.43rem;
			border: none;
			background-color: #f2f2f2;
			div.exam-choose{
    			padding: 0 3.6%;
    			
    			img{
    				width: 0.55rem;
				    position: relative;
				    top: 4px;
    			}
    			.pre-exam{
    				img{
    					margin-right: 5px;
    				}
    			}
    			.next-exam{
    				img{
				    	margin-left: 5px;
    				}
    			}
			}
			.back-to-exam{
				background-color: #ff4141;
				color: #fff;
				text-align: center;
				width: 100%;
			}
		}
		.submit-exam{
			position: absolute;
		    bottom: 0;
		    width: 100%;
		    text-align: center;
		    height: 50px;
		    line-height: 50px;
			font-size: 0.43rem;
			background-color: #ff4141;
			color: #fff;
			z-index: 10;
			a.reback{
				display: block;
			    width: 100%;
			    height: 100%;
			    color: #fff;
			}
		}
	}
	.datiye-section{
		height: 100%;
	}
	.kaoshi-datiye section.content-box{
		overflow-y: auto;
	}
</style>