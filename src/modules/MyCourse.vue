<template>
	<div>
		<v-common-header></v-common-header>
		<div class="my-course-container container">
			<mt-navbar v-model="selected">
			  <mt-tab-item id="1" @click="selected=1">未学</mt-tab-item>
			  <mt-tab-item id="2" @click="selected=2">已学</mt-tab-item>
			</mt-navbar>

			<!-- tab-container -->
			<mt-tab-container v-model="selected">
				<mt-tab-container-item id="1" v-show="selected==1">
					<div class="ctn-wrapper" ref="ctnWrapper1" @scroll="scroll1">
					  <p style="text-align:center" v-if="!course.length" ref="loadTips1">加载中...</p>
					  <v-loadmore  :top-method="loadTop" @top-status-change="handleTopChange" :bottom-method="loadBottom" :bottom-all-loaded="bottomAllLoaded" ref="loadmore1" :auto-fill="false">
					  <ul class="course-list" :class="tabCourseKind[selected-1]" >
					  	<li class="co-li" v-for="item in course" :class="{bottomdis:(selected==1),topdis:(selected==2)}">
					  		<v-item :item="item" :kindByP="'course'" :courseKindByP="tabCourseKind[selected-1]"></v-item>
					  	</li>
					  </ul>
					  </v-loadmore>
					</div>
				</mt-tab-container-item>
				<mt-tab-container-item id="2" v-show="selected==2">
					<div class="ctn-wrapper" ref="ctnWrapper2" @scroll="scroll2">
					  <p style="text-align:center" v-if="!comCourse.length" ref="loadTips2">加载中...</p>
					  <v-loadmore  :top-method="loadTop" @top-status-change="handleTopChange" :bottom-method="loadBottom" :bottom-all-loaded="comBottomAllLoaded" ref="loadmore2" :auto-fill="false">
					  <ul class="course-list" :class="tabCourseKind[selected-1]" >
					  	<li class="co-li" v-for="item in comCourse" :class="{bottomdis:(selected==1),topdis:(selected==2)}">
					  		<v-item :item="item" :kindByP="'course'" :courseKindByP="tabCourseKind[selected-1]"></v-item>
					  	</li>
					  </ul>
					  </v-loadmore>
					</div>
				</mt-tab-container-item>
			</mt-tab-container>
		</div>
	</div>
</template>
<script type="text/javascript">
	import ListItem from "../components/list/ListItem.vue";
	import loadmore from "../components/loadMore.vue";
	import { Toast } from 'mint-ui';
	import commonHeader from '../components/commonHeader.vue';
	export default{
		data() {
			return{
				selected:'1',
				course:[],
				comCourse:[],
				tabCourseKind:['learning','completed'],
				loading:false,//是否全部加载完毕
				pageno:-1,//请求的当前页面
				comPageno:-1,//请求的当前页面
				totalPage:1,
				comTotalPage:1,
				scrollTop:0,
				comScrollTop:0,
				topStatus:'',
				bottomAllLoaded: false,
				comBottomAllLoaded: false
			}
		},
		watch:{
			selected() {
				var that = this;
				this.$nextTick(function(){
					// if(that.selected==1){
					// 	that.$refs.ctnWrapper1.scrollTop = that.scrollTop;
					// }else{
					// 	that.$refs.ctnWrapper2.scrollTop = that.comScrollTop;
					// }
					
				});				
			}
		},
		beforeRouteEnter (to, from, next) {
		   next(vm => {
		        // 通过 `vm` 访问组件实例
		        if(from.path.match('/faceToFaceCourse/')||from.path.match('/onLineCourse/')||from.path.match('/scanToExpressCourse/')){
		        	vm.backFromFn();
		        }else{
		        	vm.backFromOther();
		        }
		    })
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
				window.localStorage.setItem('myCourses',data);
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
				var url = '/KMS-MSERVER/learning/courses/myCourses?type='+(Number(this.selected)-1);
				if(this.selected==1){
					this.loading = false;	
					this.pageno = 0;
					url += '&startPage='+this.pageno;
					this.getData(url,'course','GET',{},function(parm){
						parm.bottomAllLoaded = false;
						Toast({message: '刷新成功！', duration: 500});
						parm.$refs.loadmore1.onTopLoaded();
					});
				}else{
					this.comLoading = false;	
					this.comPageno = 0;
					url += '&startPage='+this.comPageno;
					this.getData(url,'comCourse','GET',{},function(parm){
						parm.comBottomAllLoaded = false;
						Toast({message: '刷新成功！', duration: 500});
						parm.$refs.loadmore2.onTopLoaded();
					});
				}
				
			},
			handleTopChange(status){
				this.topStatus = status;
			},
			loadBottom() {
				var url = '/KMS-MSERVER/learning/courses/myCourses?type='+(Number(this.selected)-1);
				if(this.selected==1){
					this.pageno++;
					url+='&startPage='+this.pageno;
					this.getMoreData(url,'course','totalPage','pageno','bottomAllLoaded','loadmore1');
				}else{
					this.comPageno++;
					url+='&startPage='+this.comPageno;
					this.getMoreData(url,'comCourse','comTotalPage','comPageno','comBottomAllLoaded','loadmore2');
				}

			},
			getMoreData(url,content,totalPage,pageno,bottomAllLoaded,loadMore) {
				this.$http({
					method:'POST',
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
			backFromFn(){
				let that = this;
				var lastInfo = JSON.parse(localStorage.getItem('myCourses'));
				var url1 = '';
				var url = '/KMS-MSERVER/learning/courses/myCourses?type='+lastInfo.type;
				this.selected = String(Number(lastInfo.type)+1);
				if(String(Number(lastInfo.type)+1)=='1'){
					this.loading = lastInfo.loading;	
					this.pageno = lastInfo.startPage;
					this.totalPage = lastInfo.totalPage;
					url1 = url;
					this['course'] = [];
					this.temp = {};
					for(let i=0;i<=lastInfo.startPage;i++){
						url = url1;
						url += '&startPage='+i;
						this.$http({
							method:'POST',
							url:this.$global().host+url
						}).then(
							response => {
								if(response.status==200&&response.body.status){
									if(response.body.data){
										this.temp[i] = response.body.data;
										this.totalPage = response.body.totalPage-1;
										if(Object.getOwnPropertyNames(this.temp).length == (this.pageno+1)){
											for(let attr in this.temp){
												this['course'] = this['course'].concat(this.temp[attr]);
											}
											setTimeout(function(){
												that.$refs.ctnWrapper1.scrollTop = lastInfo.scrollTop;
											},10);
											
										}
									}else{
										this['course'] = '找不着数据！';
									}
									
								}	
							},
							response =>{
								// error callback
								console.log('error');
							}
						)
					}
					this.comPageno = 0;
					this.getData('/KMS-MSERVER/learning/courses/myCourses?type=1&startPage=0','comCourse','GET');
				}else{
					this.comLoading = lastInfo.loading;	
					this.comPageno = lastInfo.startPage;
					this.comTotalPage = lastInfo.totalPage;
					url1 = url;
					this['comCourse'] = [];
					this.temp = {};
					for(let i=0;i<=lastInfo.startPage;i++){
						url = url1;
						url += '&startPage='+i;
						this.$http({
							method:'POST',
							url:this.$global().host+url
						}).then(
							response => {
								if(response.status==200&&response.body.status){
									if(response.body.data){
										this.temp[i] = response.body.data;
										this.comTotalPage = response.body.totalPage-1;
										if(Object.getOwnPropertyNames(this.temp).length == (this.comPageno+1)){
											for(let attr in this.temp){
												this['comCourse'] = this['comCourse'].concat(this.temp[attr]);
											}
											setTimeout(function(){
												that.$refs.ctnWrapper2.scrollTop = lastInfo.scrollTop;
											},10);
											
										}
									}else{
										this['comCourse'] = '找不着数据！';
									}
									
								}	
							},
							response =>{
								// error callback
								console.log('error');
							}
						)
					}
					this.pageno = 0;
					this.getData('/KMS-MSERVER/learning/courses/myCourses?type=0&startPage=0','course','GET');
				}
				
			},
			backFromOther() {
				let that = this;
				var url = '/KMS-MSERVER/learning/courses/myCourses?type='+0;
				this.loading = false;	
				this.pageno = 0;
				url += '&startPage='+this.pageno;
				this.getData(url,'course','GET',{},function(parm){
					if(!parm['course'].length){
						parm.$refs['loadTips1'].innerHTML = '没有更多数据了';
					}
				});
				url = '/KMS-MSERVER/learning/courses/myCourses?type='+1;
				this.comLoading = false;	
				this.comPageno = 0;
				url += '&startPage='+this.comPageno;
				this.getData(url,'comCourse','GET',{},function(parm){
					if(!parm['comCourse'].length){
						parm.$refs['loadTips2'].innerHTML = '没有更多数据了';
					}
				});
			}
		},
		components:{
			"v-item":ListItem,
			"v-loadmore": loadmore,
			"v-common-header": commonHeader
		}
	
	}
</script>
<style lang="less">
	.sf-reset{
		/*我的收藏页，我的课程共同样式,我的项目*/
		.my-course-container,.my-collect-container,.my-project-container{
			background:#f2f2f2;	
			overflow: hidden;
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
							.course-list{
								//padding-bottom:1.5rem;
							}
						}
					}
				}
			}
			
				
			/*已完成样式*/
			.course-list {
				padding:0;
				.co-li{
					background: #fff;
					margin-top: 0;
					margin-bottom:0.26rem;
					padding:0;
					.list-item-container{
						background-color: #fff;
					}
					.item-wrapper{
						padding:0.6rem 12px 1% 12px;
						
						
						.item-ctn{
							font-size: 0;
							padding-bottom:0.26rem;
						}
					}
					.list-item-container{
						.co-other {
							position: static;
							margin-top:2%;
							width:100%;
						}

					} 
				}
				&.completed{
			
					.co-li{
						/*padding-bottom:0.8rem;
						&.bottomdis{
							padding-bottom:1.2rem
						}*/
						/*.item-wrapper{
							padding:0.6rem 12px 0.5rem 12px;
							.item-ctn{
								
								border-bottom:1px solid #eee;
							}
						}
						.list-item-container{
							.comment-btn{
								bottom: 0.3rem;
							}
						}*/
					}
				}
			}
			
		}
	}
	.sf-reset{
		
		.my-collect-container{
			.course-list{
				.co-li{
					.item-wrapper{
						.item-ctn{
							position: relative;

						}
					}
					.list-item-container{
						.co-other{
							position: absolute;
							bottom:0.26rem;
							line-height: 1em;
							width:60%;
							margin-top:0;
						}
					}
				}
			}
		}
	}
	
</style>