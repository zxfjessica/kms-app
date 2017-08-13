<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container my-survey-list">
			<section>
				<mt-navbar v-model="selected" v-if="justShowfinish">
				  	<mt-tab-item id="1" >未完成</mt-tab-item>
				  	<mt-tab-item id="2" >已完成</mt-tab-item>
				</mt-navbar>

				<h1 class="header" v-if="!justShowfinish">你有以下调研活动待参与：</h1>

				<mt-tab-container v-model="selected">
					<mt-tab-container-item id="1" v-if="selected==1">
						<div class="ctn-wrapper ctn-wrapper1" ref="ctnWrapper1" @scroll="scroll1"><!--  -->
							<p style="text-align:center" v-if="!surveyLists.length && !isLoadFinish">加载中...</p>
					  		<v-loadmore  :top-method="loadTop" 
					  					 @top-status-change="handleTopChange" 
					  					 :bottom-method="loadBottom" 
					  					 :bottom-all-loaded="bottomAllLoaded" 
					  					 ref="loadmore1" 
					  					 :auto-fill="false"
					  					 :max-distance="100">
								<ul class="survey-lists lists">
									<li class="survey-list list" v-for="survey in surveyLists">
										<my-survey-item :survey="survey"
													    :type="selected-1"></my-survey-item>
									</li>
								</ul>
							</v-loadmore>
						</div>
					</mt-tab-container-item>
					<mt-tab-container-item id="2" v-if="selected==2 && justShowfinish">
						<div class="ctn-wrapper ctn-wrapper2" ref="ctnWrapper2" @scroll="scroll2"><!--  -->
							<p style="text-align:center" v-if="!comSurveyLists.length && !isLoadFinish">加载中...</p>
							<v-loadmore  :top-method="loadTop" 
					  					 @top-status-change="handleTopChange" 
					  					 :bottom-method="loadBottom" 
										 :bottom-all-loaded="comBottomAllLoaded" 
										 ref="loadmore2" 
										 :auto-fill="false"
					  					 :max-distance="100">
								<ul class="survey-lists lists">
									<li class="survey-list list" v-for="survey in comSurveyLists">
										<my-survey-item :survey="survey"
													    :type="selected-1"></my-survey-item>
									</li>
								</ul>
							</v-loadmore>
						</div>
					</mt-tab-container-item>
				</mt-tab-container>

			</section>
		</div>
	</div>
</template>
<script type="text/javascript">
import mySurveyItem from '../components/mySurveyItem.vue';
import loadMore from "../components/loadMore.vue";
import { Toast } from 'mint-ui';
import commonHeader from '../components/commonHeader.vue';
	export default{
		components: {
			'my-survey-item': mySurveyItem,
			'v-loadmore': loadMore,
			"v-common-header": commonHeader
		},
		data(){
			return{
				selected: '1',
				surveyType: 'noParticipation',
				surveyLists: [],
				comSurveyLists: [],
				justShowfinish: !1,
				resultStatus: 1,
				isFinish: false,//是否提交了考试
				loading:false,//是否全部加载完毕
				pageno:-1,//请求的当前页面
				comPageno:-1,//请求的当前页面
				totalPage:1,
				comTotalPage:1,
				topStatus:'',
				bottomAllLoaded: false,
				comBottomAllLoaded: false,
				isLoadFinish: false //请求是否完成， 用于控制加载提示文字
			}
		},
		beforeRouteEnter(to, from, next){
			next(vm => {
		        // 通过 `vm` 访问组件实例
		        vm.$nextTick(()=>{
		        	if(from.path.match('/diaoyan/')){
			        	vm.backFromFn();
			        }else{
			        	//alert(111);
			        	vm.backFromOther();
			        }
		        });
		        
		        
		    });
		},
		mounted(){

			var isFinish = localStorage && localStorage.getItem('diaoyan-isFinish');

			if(isFinish == 'true'){
				this.isFinish = true;
			}else{
				this.isFinish = false;
			};

			var type = this.$route.query.type;
			if(type == 1){//1 个人中心 --> 全部
				this.resultStatus = 1;
				this.justShowfinish = !0;

			}else if(type == 0){//0: 首页 -->未参考
				this.resultStatus = 2;
				this.justShowfinish = !1;
			}
		},
		methods: {
			scroll1(){//未学滚轮跟踪
				this.scrollTop = event.currentTarget.scrollTop;
			},
			scroll2(){//已学滚轮跟踪
				this.comScrollTop = event.currentTarget.scrollTop;
			},
			loadTop(){

				var url = '/KMS-MSERVER/learning/assessment/list?type=' + this.surveyType + '&&resultStatus=' + this.resultStatus;
				if(this.selected == 1){
					this.loading = false;	
					this.pageno = 0;
					url += '&startPage=' + this.pageno;
					this.getData(url,'surveyLists','GET',{},function(parm){
						parm.bottomAllLoaded = false;
						Toast({message: '刷新成功！', duration: 500});
						parm.$refs.loadmore1.onTopLoaded();
					});
				}else{
					this.comLoading = false;	
					this.comPageno = 0;
					url += '&startPage='+this.comPageno;
					this.getData(url,'comSurveyLists','GET',{},function(parm){
						parm.comBottomAllLoaded = false;
						Toast({message: '刷新成功！', duration: 500});
						parm.$refs.loadmore2.onTopLoaded();
					});
				}
				
			},
			handleTopChange(){
				this.topStatus = status;
			},
			loadBottom() {
				var url = '/KMS-MSERVER/learning/assessment/list?type=' + this.surveyType + '&&resultStatus=' + this.resultStatus;
				if(this.selected==1){
					this.pageno++;
					url += '&startPage=' + this.pageno;
					this.getMoreData(url,'surveyLists','totalPage','pageno','bottomAllLoaded','loadmore1');
				}else{
					this.comPageno++;
					url += '&startPage=' + this.comPageno;
					this.getMoreData(url,'comSurveyLists','comTotalPage','comPageno','comBottomAllLoaded','loadmore2');
				}

			},
			getMoreData(url, content, totalPage, pageno, bottomAllLoaded, loadMore) {
				this.$http({
					method:'GET',
					url:this.$global().host + url
				}).then(
					response => {
						if(response.status == 200 && response.body.status){
							if(response.body.data){
								this[content] = this[content].concat(response.body.data);
								this[totalPage] = response.body.totalPage-1;
								if(this[pageno] >= response.body.totalPage){
									this.$refs[loadMore].onBottomLoaded();
									this[bottomAllLoaded] = true;

									Toast({message: '没有更多数据了', duration: 1000});
								}else{
									this.$refs[loadMore].onBottomLoaded();
								}	
							}else{
								this[content] = '找不着数据！';
							}
							
						}	
					},
					response =>{
						// error callback
						console.log('error');
					}
				)
			},
			commonLoadData(type, loading, pageNo, dataLists){

				var url = '/KMS-MSERVER/learning/assessment/list?type=' + type + '&&resultStatus=' + this.resultStatus;
				this[loading] = false;	
				this[pageNo] = 0;
				url += '&startPage=' + this[pageNo];

				this.getData(url, dataLists, 'GET', {}, function(parm){
					parm.isLoadFinish = true;
				});

			},
			backFromOther() {
				let that = this;
				//加载未完成试卷

				that.commonLoadData('noParticipation', 'loading', 'pageno', 'surveyLists');

				if(that.justShowfinish){
					//加载已完成试卷

					that.commonLoadData('participation', 'comLoading', 'comPageno', 'comSurveyLists');
				}
				
			},
			backFromFn(){
				var  that = this;
				var lastInfo = JSON.parse(localStorage.getItem('mySurvey'));
				that.selected = String(Number(lastInfo.type) + 1);
				//考试提交后回退时，初始化显示已完成标签
				if(that.isFinish){
					that.justShowfinish = !0;
					that.resultStatus = 1;
					that.selected = '2';
					that.backFromOther();
					
				}else{
					
					if(String(Number(lastInfo.type) + 1) == '1'){
						//未完成
						that.concatData('loading', 'pageno', 'totalPage', 'surveyLists', lastInfo, 'comSurveyLists');
					}/*else{
						//已完成
						that.concatData('comLoading', 'comPageno', 'comTotalPage', 'comSurveyLists', lastInfo, 'surveyLists');
					}*/
				}
				
				
			},
			concatData(loading, pageNo, totalPageNo, dataLists, lastInfo, initDataLists){
				var url1 = '';
				var url = '/KMS-MSERVER/learning/assessment/list?type=' + lastInfo.surveyType + '&&resultStatus=' + this.resultStatus;
				var that = this;

				that[loading] = lastInfo.loading;	
				that[pageNo] = lastInfo.startPage;
				that[totalPageNo] = lastInfo.totalPage;
				url1 = url;
				that[dataLists] = [];

				that.temp = {};
				for(let i = 0; i <= lastInfo.startPage; i++){
					url = url1;
					url += '&startPage=' + i;
					that.$http({
						method: 'POST',
						url: that.$global().host + url
					}).then(
						response => {
							if(response.status == 200 && response.body.status){
								if(response.body.data){
									that.temp[i] = response.body.data;
									that[totalPageNo] = response.body.totalPage - 1;
									if(Object.getOwnPropertyNames(that.temp).length == (that[pageNo] + 1)){
										for(let attr in that.temp){
											that[dataLists] = that[dataLists].concat(that.temp[attr]);
										}
										setTimeout(function(){
											if(lastInfo.type == 0){
												that.$refs.ctnWrapper1.scrollTop = lastInfo.scrollTop;
											}else{
												that.$refs.ctnWrapper2.scrollTop = lastInfo.scrollTop;
											}
											
										},10);
										
									}
								}else{
									that[dataLists] = '找不着数据！';
								}
								
							}	
						},
						response =>{
							// error callback
							console.log('error');
						}
					)
				}
				
				var initType;
				if(String(Number(lastInfo.type) + 1) == '1'){
					initType = 'participation';
					that.comPageno = 0;
				}else{
					initType = 'noParticipation';
					that.pageno = 0;
				}
				var initUrl = '/KMS-MSERVER/learning/assessment/list?type=' + initType + '&&resultStatus=' + this.resultStatus + '&startPage=0';
				that.getData( initUrl , initDataLists, 'GET');
			}
		},
		beforeDestroy() {
			var data = {};
			data['type'] = String(this.selected-1);
			if(this.selected=='1'){
				data['startPage'] = this.pageno;
				data['totalPage'] = this.totalPage;
				data['scrollTop'] = this.scrollTop;
				data['loading'] = this.loading;
				data['surveyType'] = 'noParticipation';
			}else{
				data['startPage'] = this.comPageno;
				data['totalPage'] = this.comTotalPage;
				data['scrollTop'] = this.comScrollTop;
				data['loading'] = this.comLoading;
				data['surveyType'] = 'participation';
			}
			data = JSON.stringify(data);
			try{
				window.localStorage.setItem('mySurvey',data);
			}catch(e){
				//alert(e);
			}
			
		},
		watch:{
			selected(val, oldVal){
				var that = this;
				this.isLoadFinish = false;
				if(this.selected == 1){
					this.surveyType = 'noParticipation';
				}else{
					this.surveyType = 'participation';
				}

				this.$nextTick(function(){
					if(that.selected==1){
						that.$refs.ctnWrapper1.scrollTop = that.scrollTop;
					}else{
						that.$refs.ctnWrapper2.scrollTop = that.comScrollTop;
					}
					
				});

			}
		}
	}

</script>
<style lang="less">
</style>