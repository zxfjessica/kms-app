<template>
	<div>
		<v-common-header></v-common-header>
		<div class="my-collect-container container">
			<mt-navbar v-model="selected">
			  <mt-tab-item id="1">课程</mt-tab-item>
			  <mt-tab-item id="2">项目</mt-tab-item>
			  <mt-tab-item id="3">频道</mt-tab-item>
			</mt-navbar>

			<!-- tab-container -->
			<mt-tab-container v-model="selected">
				<mt-tab-container-item id="1" >
				  <div class="ctn-wrapper" v-show="!dataloading" ref="ctnWrapper" @scroll="scroll1">
				  	<ul class="course-list course" 
				  		v-infinite-scroll="loadMore" 
				  		infinite-scroll-disabled="loading"  
				  		infinite-scroll-distance="10"
				  		infinite-scroll-immediate-check="false">
					  		<li class="co-li" v-for="item in courses">
					  			<v-item :item="item" :kindByP="tabKind[0]" :courseKindByP="tabKind[0]"></v-item>
					  			
					  		</li>
				  	</ul>
				  </div>
				  <mt-spinner type="fading-circle" 
				  				v-show="dataloading" 
				  				class="dataload">
				  </mt-spinner>
				</mt-tab-container-item>
				<mt-tab-container-item id="2" >
				  <div class="ctn-wrapper" v-show="!dataloading" ref="ctnWrapper1" @scroll="scroll2">
				  	<ul class="course-list project" 
				  		v-infinite-scroll="loadMore1" 
				  		infinite-scroll-disabled="loading1"  
				  		infinite-scroll-distance="10"
				  		infinite-scroll-immediate-check="false">
					  		<li class="co-li" v-for="item in projects">
					  			<v-item :item="item" :kindByP="tabKind[1]" :courseKindByP="tabKind[1]"></v-item>
					  			
					  		</li>
				  	</ul>
				  </div>
				  <mt-spinner type="fading-circle" 
				  				v-show="dataloading" 
				  				class="dataload">
					  </mt-spinner>
				</mt-tab-container-item>
				<mt-tab-container-item id="3" >
					<div class="ctn-wrapper"  v-show="!dataloading" ref="ctnWrapper2" @scroll="scroll3">
						<div v-infinite-scroll="loadMore2" infinite-scroll-disabled="disabledScroll2" infinite-scroll-immediate-check="false" infinite-scroll-distance="1">
							<ul class="channel-list">
								<li v-for="item in channelList">
								<router-link :to="{'path':item.contentType=='blog'?'/knowledge/channelDetailBlog':item.contentType=='consult'?'/knowledge/consultationDetail/'+item.contentId:item.contentType=='theme'?'/knowledge/channelDetailBlog':item.contentType=='knowledge'?'/knowledge/channelDetailBlog':item.contentType=='information'?'/knowledge/channelDetailBlog':'','query':{id:item.contentId,type:item.contentType}}">
									<div class="channel-item-wrapper">
										<a class="info-wrapper" href="javascript:void(0)" @click="showBlogDetailHandler">
											<h5 class="title">
												<span class="inner-title">{{item.title}}</span>
												<!-- <span class="kind-icon"></span> -->
											</h5>
										</a>
										<div :class="{'info-kind':true,'color1':(item.contentType=='blog' || item.contentType=='consult'),'color2':item.contentType=='consult','color3':item.contentType=='theme'}">{{item.contentType=='theme'?'主题':item.contentType=='knowledge'?'知识':item.contentType=='blog'?'博客':item.contentType=='information'?'资讯':item.contentType=='consult'?'请教':''}}</div>
										<div class="item-footer">
											<span class="editor">
												<router-link :to="{ path: '/knowledge/channelDetailSuper',  'query': { empNumber: item.createId } }">
													{{item.createName || '未知'}}
												</router-link>
											</span>
											<span class="date">{{item.createDateStr || '未知' | time}}</span>
										</div>
									</div>
									</router-link>
								</li>
								<mt-spinner type="fading-circle" 
					  				v-show="dataloading" 
					  				class="dataload">
						  		</mt-spinner>
							</ul>
							<p v-if="loading2" class="page-infinite-loading">
								<span class="loading">加载中...</span>
							</p>
						</div>
					</div>
				</mt-tab-container-item>
			</mt-tab-container>
			

			<!-- tab-container -->
		</div>
	</div>
</template>
<script type="text/javascript">
import ListItem from "../components/list/ListItem.vue";
import { Toast, Indicator } from 'mint-ui';
	import commonHeader from '../components/commonHeader.vue';
	export default{
		data() {
			return {
				selected:'1',
				tabKind:['course','project'],
				courses:[],
				projects:[],
				loading:false,//课程是否全部加载完毕
				loading1:false,//项目是否全部加载完毕
				loading2:false,
				pageno:0,//请求的当前课程页面
				pageno1:0,//请求的当前项目页面
				pageno2:0,//请求的当前频道页面
				dataloading: true,
				totalPage: 0,
				totalPageCourse: 0,
				totalPageProject: 0,
				scrollTop: 0,
				scrollTop1: 0,
				scrollTop2: 0,
				channelList:[],
				empNumber:'',
				disabledScroll2:false,
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				if(from.path.match('/faceToFaceCourse/') || from.path.match('/onLineCourse/') || from.path.match('/trainCourse/') || from.path.match('/knowledge/')){
					vm.backFromFn();
				}else {
					vm.backFromOtherFn();
				}
			});
		},
		beforeDestroy() {
			var data = {};
			data.selected = this.selected;
			if (data.selected === '1') {//课程
				data.scrollTop = this.scrollTop;
				data.loading = this.loading;
			}else if(data.selected === '2'){
				data.scrollTop1 = this.scrollTop1;
				data.loading1 = this.loading1;
			}else{
				data.scrollTop2 = this.scrollTop2;
				data.disabledScroll2 = this.disabledScroll2;
			}
			data.pageno = this.pageno;
			data.pageno1 = this.pageno1;
			data.pageno2 = this.pageno2;
			try {
				window.localStorage.setItem('myCollect',JSON.stringify(data));
			}catch (e) {return;}
		},
		methods:{
			showBlogDetailHandler(){},
			scroll1(event) {
				this.scrollTop = event.currentTarget.scrollTop;
			},
			scroll2(event) {
				this.scrollTop1 = event.currentTarget.scrollTop;
			},
			scroll3(event) {
				this.scrollTop2 = event.currentTarget.scrollTop;
			},
			backFromFn() {
				var lastInfo = {};
				try {
					lastInfo = JSON.parse(window.localStorage.getItem('myCollect'));
				}catch (e) {
					return;
				}
				for (let attr in lastInfo) {
					this[attr] = lastInfo[attr];
				}
				this.$nextTick(() => {
					var that = this;
					var url1 = '', url = '';
					if(this.selected === '1'){//课程
						url = '/KMS-MSERVER/learning/person/myCollect?type=1';
						url1 = url;
						this['courses'] = [];
						this.temp = {};
						for(let i=0;i<=lastInfo.pageno;i++){
							url = url1;
							url += '&startPage='+i;
							this.$http({
								method:'GET',
								url:this.$global().host+url
							}).then(
								response => {
									if(response.status==200&&response.body.status){
										if(response.body.data){
											this.temp[i] = response.body.data;
											if(Object.getOwnPropertyNames(this.temp).length == (this.pageno+1)){
												for(let attr in this.temp){
													this['courses'] = this['courses'].concat(this.temp[attr]);
												}
												setTimeout(function(){
													that.$refs.ctnWrapper.scrollTop = lastInfo.scrollTop;
												},10);
												
											}
										}else{
											this['courses'] = '找不着数据！';
										}
										
									}	
								}
							)
						}
						var url2 = '/KMS-MSERVER/learning/person/myCollect?type=0';
						this.pageno1 = 0;
						url2 += '&startPage=0';
						this.getData(url2, 'projects', 'GET', {}, function(parm) {
							parm.dataloading = false;
							parm.totalPageProject = parm.totalPage;	
						});
						var url = '/KMS-MSERVER/mobileChannel/search/myFavourite?startPage=0';
						this.getData(url, 'channelList', 'GET', {},function(parm) {
							parm.dataloading = false;
							parm.totalPageProject = parm.totalPage;	
						});
					} else if(this.selected === '2'){
						url = '/KMS-MSERVER/learning/person/myCollect?type=0';
						url1 = url;
						this['projects'] = [];
						this.temp = {};
						for(let i=0;i<=lastInfo.pageno1;i++){
							url = url1;
							url += '&startPage='+i;
							this.$http({
								method:'GET',
								url:this.$global().host+url
							}).then(
								response => {
									if(response.status==200&&response.body.status){
										if(response.body.data){
											this.temp[i] = response.body.data;
											if(Object.getOwnPropertyNames(this.temp).length == (this.pageno1+1)){
												for(let attr in this.temp){
													this['projects'] = this['projects'].concat(this.temp[attr]);
												}
												setTimeout(function(){
													that.$refs.ctnWrapper1.scrollTop = lastInfo.scrollTop1;
												},10);
												
											}
										}else{
											this['projects'] = '找不着数据！';
										}
										
									}	
								}
							)
						}
						var url2 = '/KMS-MSERVER/learning/person/myCollect?type=1';
						this.pageno = 0;
						url2 += '&startPage=0';
						this.getData(url2, 'courses', 'GET', {}, function(parm) {
							parm.dataloading = false;	
							parm.totalPageCourse = parm.totalPage;
						});
						var url = '/KMS-MSERVER/mobileChannel/search/myFavourite?startPage=0';
						this.getData(url, 'channelList', 'GET', {},function(parm) {
							parm.dataloading = false;
							parm.totalPageProject = parm.totalPage;	
						});
					}else if(this.selected === '3'){
						this.temp = {};
						for(let i=0;i<=lastInfo.pageno2;i++){
							this.$http({
								method:'GET',
								url:this.$global().host+'/KMS-MSERVER/mobileChannel/search/myFavourite?startPage='+i
							}).then(response => {
								if(response.status==200&&response.body.status){
									if(response.body.data){
										this.temp[i] = response.body.data;
										if(Object.getOwnPropertyNames(this.temp).length == (lastInfo.pageno2+1)){
											for(let attr in this.temp){
												this.channelList = this.channelList.concat(this.temp[attr])
											}
											setTimeout(function(){
												that.$refs.ctnWrapper2.scrollTop = lastInfo.scrollTop2;
											},10);
										}
									}
								}
							});
						}
						var url = '/KMS-MSERVER/learning/person/myCollect?type=1';
						url+='&startPage='+this.pageno;
						this.getData(url, 'courses', 'GET', {}, function(parm) {
							parm.dataloading = false;	
							parm.totalPageCourse = parm.totalPage;
						});
						var url = '/KMS-MSERVER/learning/person/myCollect?type=0';
						url+='&startPage='+this.pageno1;
						this.getData(url, 'projects', 'GET', {}, function(parm) {
							parm.dataloading = false;
							parm.totalPageProject = parm.totalPage;	
						});
					}
				})

			},
			backFromOtherFn() {
				var url = '/KMS-MSERVER/learning/person/myCollect?type=1';
				url+='&startPage='+this.pageno;
				this.getData(url, 'courses', 'GET', {}, function(parm) {
					parm.dataloading = false;	
					parm.totalPageCourse = parm.totalPage;
				});
				var url = '/KMS-MSERVER/learning/person/myCollect?type=0';
				url+='&startPage='+this.pageno1;
				this.getData(url, 'projects', 'GET', {}, function(parm) {
					parm.dataloading = false;
					parm.totalPageProject = parm.totalPage;	
				});
				var url = '/KMS-MSERVER/mobileChannel/search/myFavourite?startPage=0';
				this.getData(url, 'channelList', 'GET', {});
			},
			loadMore() {
				var url = '/KMS-MSERVER/learning/person/myCollect?type=1';
				this.pageno++;
				url+='&startPage='+this.pageno;
				this.$http({
					method:'GET',
					url:this.$global().host+url
				}).then(
					response => {
						if(response.status==200&&response.body.status){
							if(response.body.data){
								if(this.pageno > 0 && this.pageno > this.totalPageCourse){	
									this.loading = true;
									Toast({message: '没有更多数据了', duration: 1000});
								}else{
									this['courses'] = this['courses'].concat(response.body.data);
								}
							}else{
								this['courses'] = '找不着数据！';
								this.loading = true;
							}
							
						}						
					}
				)

			},
			loadMore1() {
				var url = '/KMS-MSERVER/learning/person/myCollect?type=0';
				this.pageno1++;
				url+='&startPage='+this.pageno1;
				this.$http({
					method:'GET',
					url:this.$global().host+url
				}).then(
					response => {
						if(response.status==200&&response.body.status){
							if(response.body.data){
								if(this.pageno1 > 0 && this.pageno1 > this.totalPageProject){	
									this.loading1 = true;
									Toast({message: '没有更多数据了', duration: 1000});
								}else{
									this['projects'] = this['projects'].concat(response.body.data);
								}
							}else{
								this['projects'] = '找不着数据！';
								this.loading1 = true;
							}
							
						}						
					}
				)

			},
			loadMore2(){
				this.loading2 = true;
				this.pageno2 = Number(this.pageno2)+Number(1);
				this.$http({
					method:'GET',
					url:this.$global().host+'/KMS-MSERVER/mobileChannel/search/myFavourite?startPage='+this.pageno2
				}).then(response => {
					if(response.status==200&&response.body.status){
						if(response.body.data){
							if(response.body.data.length != 0){
								this.channelList = this.channelList.concat(response.body.data)
							}else{
								this.loading2 = false;
								Toast({message: '没有更多数据了', duration: 1000});
								this.disabledScroll2 = true;
								this.pageno2 = Number(this.pageno2)-Number(1);

							}
						}
					}
				})
			}
		},
		filters: {
			time(value) {
				function add0(m){return m<10?''+m:m };
				var nowTime = new Date();
				var ny = nowTime.getFullYear();
				var nm = nowTime.getMonth()+1;
				var nd = nowTime.getDate();
				var y = value.slice(0,4);
				var m = value.slice(5,7);
				var d = value.slice(8,10);
				var h = value.slice(11,13);
				var mm = value.slice(14,16);
				var s = value.slice(17,19);
				if(y == ny){
					if(m == nm){
						if(d == nd){
							return add0(h)+':'+add0(mm)+':'+add0(s);
						}else{
							return y+'-'+add0(m)+'-'+add0(d)
						}
					}else{
						return y+'-'+add0(m)+'-'+add0(d)
					}
				}else{
					return y+'-'+add0(m)+'-'+add0(d)
				}
			}
		},
		components:{
			"v-item":ListItem,
			"v-common-header": commonHeader
		}
	}
</script>
<style lang="less">
/*样式放于我的课程*/
	@import "../css/customFn.less";
	.my-collect-container {
		.dataload {
			position: fixed;
			top: 50%;
			left: 50%;
			.transform-translateXY (-50%, 0, 0);
		}
		.channel-list {
			background-color: #fff;
			li {
				padding: 0.53rem 0.32rem 0.53rem 0;
				margin-left: 0.32rem;
				border-bottom: 1px solid #eee;
			}
		}
		.channel-item-wrapper {
			position: relative;
			.info-wrapper {
				display: block;
				.title {
					width: 87%;
					margin-bottom: 0.42rem;
					max-height: 1.12rem;
					overflow: hidden;
					.inner-title {
						display: inline-block;
						max-width: calc(~'100% - 0.84rem');
						font-size: 0.4rem;
						line-height: 0.56rem;
						position: relative;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.kind-icon {
						display: inline-block;
						width: 0.42rem;
						height: 0.56rem;
						background: url('../../static/img/shunfeng_signs4.png') no-repeat;
						background-size: 334%;
						background-color: #fff;
						vertical-align: top;
						position: relative;
						top: 0.02rem;
						// margin-top: -0.24rem;
						.bgPosition(@signs4Width, @signs4Height, 15, 25, 0, 26);
					}
				}
			}
			.info-kind {
				width: 1.12rem;
				padding: 0.08rem 0;
				font-size: 0.32rem;
				text-align: center;
				border: 1px solid #ccc;
				border-radius: 2px;
				position: absolute;
				right: 0;
				top: 0;
			}
			.color1{
				border: 1px solid #4eb5e2;
    			color: #4eb5e2;
			}
			.color2{
				border: 1px solid #9e78ff;
    			color: #9e78ff;
			}
			.color3{
				border: 1px solid #44af45;
    			color: #44af45;
			}
			.item-footer {
				// width: 80%;
				overflow: hidden;
				position: relative;
				> span {
					position: relative;
					padding-left: 0.53rem;
					margin-right: 13%;
					b {
						color: #666;
						font-weight: normal;
						font-size: 0.32rem;
						line-height: 0.48rem;
					}
					&:before {
						content: "";
						position: absolute;
						left: 0;
						top: 50%;
						display: block;
						width:0.53rem;
						height: 0.36rem;
						margin-top: -0.16rem;
						background: url('../../static/img/shunfeng_signs4.png') no-repeat;
						background-size: 315%;
						.bgPosition(@signs4Width, @signs4Height, 22, 16, 0, 63);
					}
					&:last-child {
						// margin-right: 0;
						// float: right;
					}
				}
				.editor {
					&:before {
						background-size: 260%;
						.bgPosition(@signs4Width, @signs4Height, 19, 20, 0, 1423);
					}
				}
				.date {
					// position: absolute;
					// left: 50%;
					height: 0.37rem;
					// .transform-translateX (-50%);
					&:before {
						background-size: 250%;
						.bgPosition(@signs4Width, @signs4Height, 20, 20, 0, 1337);
					}
				}
			}
		}
	}
	.loading{
		display: block;
		text-align: center;
		color: #999;
	}
</style>
