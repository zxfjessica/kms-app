<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container my-classes">
			<section>
				<mt-navbar v-model="selected" v-if="!justShowUnfinish">
				  	<mt-tab-item id="1" >未完成</mt-tab-item>
				  	<mt-tab-item id="2" >已完成</mt-tab-item>
				</mt-navbar>
				<h1 class="header" v-if="justShowUnfinish">你有以下班级活动待参与：</h1>

				<mt-tab-container v-model="selected">
					<mt-tab-container-item id="1" v-if="selected==1">
						<div class="ctn-wrapper" ref="ctnWrapper1" @scroll="scroll1">
							<p style="text-align:center" v-if="!classLists.length && !isLoadFinish">加载中...</p>
					  		<v-loadmore  :top-method="loadTop" 
					  					 @top-status-change="handleTopChange" 
					  					 :bottom-method="loadBottom" 
					  					 :bottom-all-loaded="bottomAllLoaded" 
					  					 ref="loadmore1" 
					  					 :auto-fill="false"
					  					 :max-distance="100">
								<ul class="class-lists" >
									<li class="class-list" v-for="list1 in classLists">
										<my-class-item  :list="list1"
														:justShowUnfinish="!justShowUnfinish"
														:type="selected - 1"></my-class-item>
									</li>
								</ul>
							</v-loadmore>
						</div>
					</mt-tab-container-item>
					<mt-tab-container-item id="2" v-if="selected==2 && !justShowUnfinish">
						<div class="ctn-wrapper" ref="ctnWrapper2" @scroll="scroll2">
							<p style="text-align:center" v-if="!comClassLists.length && !isLoadFinish">加载中...</p>
							<v-loadmore  :top-method="loadTop" 
					  					 @top-status-change="handleTopChange" 
					  					 :bottom-method="loadBottom" 
										 :bottom-all-loaded="comBottomAllLoaded" 
										 ref="loadmore2" 
										 :auto-fill="false"
					  					 :max-distance="100">
								<ul class="class-lists" >
									<li class="class-list" v-for="list2 in comClassLists">
										<my-class-item  :list="list2"
														:justShowUnfinish="!justShowUnfinish"
														:type="selected - 1"></my-class-item>
									</li>
								</ul>
							</v-loadmore>
						</div>
					</mt-tab-container-item>
				</mt-tab-container>
				<!-- <p class="loadtips" v-show="isLoading">正在加载中...</p>  -->
			</section>
		</div>
	</div>
</template>
<script type="text/javascript">
	import myClassItem from '../components/myClassItem.vue';
	import loadMore from "../components/loadMore.vue";
	import { Toast } from 'mint-ui';
	import commonHeader from '../components/commonHeader.vue';
	export default{
		components: {
			'my-class-item': myClassItem,
			'v-loadmore': loadMore,
			"v-common-header": commonHeader
		},
		data(){
			return{
				selected: '1',
				comClassLists: [],
				classLists: [],
				justShowUnfinish: !0, //true 学习任务 || false 我的班级
				init: 0,
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
		mounted(){
			this.init = this.$route.query.type;
			if(this.init == '0'){
				this.justShowUnfinish = !0;
			}else{
				this.justShowUnfinish = !1;
			}
		},
		beforeRouteEnter (to, from, next) {
			next(vm => {
		        // 通过 `vm` 访问组件实例
		        if(from.path.match('/myClassesDetail/')||from.path.match('/scanToExpressClass/')){
		        	vm.backFromFn();
		        }else{
		        	vm.backFromOther();
		        }
		        
		    });
		},
		beforeDestroy() {
			var data = {};
			data['type'] = String(this.selected-1);
			if(this.selected=='1'){
				data['startPage'] = this.pageno;
				data['totalPage'] = this.totalPage;
				data['scrollTop'] = this.scrollTop;
				data['loading'] = this.loading;
			}else{
				data['startPage'] = this.comPageno;
				data['totalPage'] = this.comTotalPage;
				data['scrollTop'] = this.comScrollTop;
				data['loading'] = this.comLoading;
			}
			data = JSON.stringify(data);
			try{
				window.localStorage.setItem('myClasses',data);
			}catch(e){
				alert(e);
			}
			
		},
		methods:{
			scroll1(){//未学滚轮跟踪
				this.scrollTop = event.currentTarget.scrollTop;
			},
			scroll2(){//已学滚轮跟踪
				this.comScrollTop = event.currentTarget.scrollTop;
			},
			loadTop(){
				var url = '/KMS-MSERVER/learning/project/myStuClass?type=' + (Number(this.selected)-1);
				if(this.selected == 1){
					this.loading = false;	
					this.pageno = 0;
					url += '&startPage=' + this.pageno;
					this.getData(url,'classLists','GET',{},function(parm){
						parm.bottomAllLoaded = false;
						Toast({message: '刷新成功！', duration: 500});
						parm.$refs.loadmore1.onTopLoaded();
					});
				}else{
					this.comLoading = false;	
					this.comPageno = 0;
					url += '&startPage='+this.comPageno;
					this.getData(url,'comClassLists','GET',{},function(parm){
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
				var url = '/KMS-MSERVER/learning/project/myStuClass?type=' + (Number(this.selected)-1);
				if(this.selected==1){
					this.pageno++;
					url+='&startPage='+this.pageno;
					this.getMoreData(url,'classLists','totalPage','pageno','bottomAllLoaded','loadmore1');
				}else{
					this.comPageno++;
					url+='&startPage='+this.comPageno;
					this.getMoreData(url,'comClassLists','comTotalPage','comPageno','comBottomAllLoaded','loadmore2');
				}

			},
			getMoreData(url,content,totalPage,pageno,bottomAllLoaded,loadMore) {
				this.$http({
					method:'GET',
					url:this.$global().host+url
				}).then(
					response => {
						if(response.status==200&&response.body.status){
							if(response.body.data){
								this[content] = this[content].concat(response.body.data);
								this[totalPage] = response.body.totalPage-1;
								if(this[pageno]>=response.body.totalPage){
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
				var url = '/KMS-MSERVER/learning/project/myStuClass?type=' + type;
				this[loading] = false;	
				this[pageNo] = 0;
				url += '&startPage=' + this[pageNo];

				this.getData(url, dataLists, 'GET', {}, function(parm){
					parm.isLoadFinish = true;
				});

			},
			backFromOther() {
				let that = this;
				
				this.commonLoadData('0', 'loading', 'pageno', 'classLists');

				if(this.init == '1'){
					this.commonLoadData('1', 'comLoading', 'comPageno', 'comClassLists');
				}
				
			},
			backFromFn(){
				var  that = this;
				var lastInfo = JSON.parse(localStorage.getItem('myClasses'));
				that.selected = String(Number(lastInfo.type)+1);
				if(String(Number(lastInfo.type) + 1) == '1'){//未完成
					that.concatData(that.loading, that.pageno, that.totalPage, 'classLists', lastInfo, 'comClassLists');
				}else{//已完成
					that.concatData(that.comLoading, that.comPageno, that.comTotalPage, 'comClassLists', lastInfo, 'classLists');
				}
				
			},
			concatData(loading, pageNo, totalPageNo, dataLists, lastInfo, initDataLists){
				var url1 = '';
				var url = '/KMS-MSERVER/learning/project/myStuClass?type=' + lastInfo.type;
				var that = this;

				loading = lastInfo.loading;	
				pageNo = lastInfo.startPage;
				totalPageNo = lastInfo.totalPage;
				url1 = url;
				var data = [];
				var initType;
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
									totalPageNo = response.body.totalPage - 1;
									if(Object.getOwnPropertyNames(that.temp).length == (pageNo + 1)){
										for(let attr in that.temp){
											data = data.concat(that.temp[attr]);
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
									data = '找不着数据！';
								}

								if(dataLists == 'comClassLists'){
									that.comClassLists = data;
									that.comPageno = pageNo;
									that.comTotalPage = totalPageNo;
								}else{
									that.classLists = data;
									that.pageno = pageNo;
									that.totalPage = totalPageNo;
								}
								
							}	
						},
						response =>{
							// error callback
							console.log('error');
						}
					)
				}

				if(String(Number(lastInfo.type) + 1) == '1'){
					initType = '1';
					that.comPageno = 0;
				}else{
					initType = '0';
					that.pageno = 0;
				}
				that.getData('/KMS-MSERVER/learning/project/myStuClass?type=' + initType + '&startPage=0', initDataLists, 'GET');
			}
		},
		watch:{
			selected(val, oldVal){
				var that = this;
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
.sf-reset{
	.my-classes, .my-exam-list, .my-survey-list{
		background:#f2f2f2;	
		overflow: hidden;
		section{
			h1.header{
			    width: 97%;
				font-size: 0.4rem;
			    line-height: 1.2rem;
			    height: 1.2rem;
				background-color: #fff;
			    border-bottom: 1px solid #eee;
			    padding-left: 3%;
			}
			.mint-navbar{
				.mint-tab-item{
					height:1.2rem;
					.mint-tab-item-label{
						display: inline-block;
						width:100%;
						height: 100%;
						line-height:1.2rem;
						border-bottom:1px solid #ddd;
						font-size: 0.4rem;
					}
					&.is-selected{
						.mint-tab-item-label{
							display: inline-block;
							height:100%;
							line-height:1.2rem;
							font-size: 0.4rem;
							border-bottom:2px solid #ff4141;
							margin-bottom:0;
						}
					}
				}
			}
			.mint-tab-container{
				top:1px;
				height: 100%;
				.mint-tab-container-wrap{
					height: 100%;
					
					.mint-tab-container-item{
						height: inherit;
						.ctn-wrapper{
							height: calc(~"100vh - 48px - 1.2rem");
							overflow-y: scroll;
						}
					}
				}
			}

			
		}
	}
}
</style>