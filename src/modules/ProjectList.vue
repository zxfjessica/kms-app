<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container project-list-container" ref="outter" >
			<div class="search-wrapper">
				<div class="mint-search">
					<div class="mint-searchbar">
						<div class="mint-searchbar-inner">
							<form action="javascript:return true" style="width:100%">
								<i class="icon-search" 
									@click="selHandler"
									:class="{'text-center':textCenter}"
									v-if="value==''&&textCenter"></i>
								<input type="search" 
									v-model="value" 
									placeholder="搜索项目" 
									class="mint-searchbar-core" 
									:class="{'text-center':value==''&&textCenter}" 
									@keypress="searchBegin"
									ref="search" id="search">
							</form>
							<i class="icon-search" @click="selHandler" v-show="value!=''||!textCenter"></i>
						</div>
						<span class="mint-searchbar-cancel" v-if="value" @click="cancelHandler">取消</span>
					</div>
				</div>
				
			</div>
			<div style="height: 93%;overflow: hidden;background-color:#eee;">
				<div class="tab-bottom">
					<div class="tab-bottom-size-wrapper">
						<a href="javascript:void(0)" :class="orderActive?'active':''" @click="getList(1)"><span class="sel-icon all"></span>全部</a>
						<a href="javascript:void(0)" :class="!orderActive?'active':''" @click="getList(0)"><span class="sel-icon not-all"></span>可参与</a>
						
						<div class="sel-wrapper" @click="selOpenHander">筛选</div>
					</div>
				</div>
				<div id="list_wrapper" class="list-wrapper" @scroll="wrapperScrollHandler" ref="listWrapper">
					<div class="course-list-wrapper">
						<p v-if="!contentLoad" class="loadtips">加载中...</p>
						<ul class="course-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="allLoaded"  infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
							<li class="co-li" v-for="item in itemdata">
								<v-item :item="item" kindByP="project"></v-item>
							</li>
						</ul>
						<p class="loadtips" ref="loadtips" v-show="contentLoad"></p>
					</div>
				</div>
			</div>
			
			<!-- 筛选板块 -->
			<mt-popup
			  v-model="tabSelBlock"
			  position="right"
			  :closeOnClickModal="false">
			  <div class="tab-sel-block" v-show="tabSelBlock">
			  		<div class="content">
			  			<div class="content-inside" @touchmove.stop="" @scroll.stop="">
			  				<v-filter :showFlag="true" 
			  						:title="'组织'" 
			  						:itemdata="organization" 
			  						activeCondition="id"
			  						contentName="tagName"
			  						:actived="tempSelOption.organization"
			  						activeConditionAttr="organization"
			  						@selClickHandler="selClickHandler">
			  				</v-filter>
			  			</div>
			  			<div class="block-bottom">
			  				<span @click="selClickCancelHandler">取消</span>
			  				<span @click="selClickSureHandler" class="sel-sure-btn">确定</span>
			  			</div>
			  		</div>
			  </div>
			</mt-popup>
			
			<!-- 筛选板块 -->
		</div>
	</div>	
</template>
<script>
	import ContentList from "../components/list/ContentList.vue";
	import ListItem from "../components/list/ListItem.vue";
	import SelFilter from '../components/filterPanel.vue';
	import commonHeader from '../components/commonHeader.vue';
	export default {
		data() {
			return {
				value:'',
				tabSelBlock:false,
				orderActive:1,//是否全部
				organization:[],//组织
				selOption:{//记录请求筛选选中选项
					"organization":""
				},
				tempSelOption:{//记录临时请求筛选选中选项
					"organization":""
				},
				itemdata:[],
				pageNo:0,//请求的当前页面
				allLoaded:false,//是否全部加载完毕
				contentLoad:false,//请求的列表内容是否已经加载完毕
				scrollTop:0,
				textCenter:true//搜索字体居中
			}
		},
		beforeRouteEnter(to, from, next) {
			next(
				vm => {
					if(from.path.match('/trainCourse/')){
						vm.backFromFn();
					}else{
						vm.backFromOther();
					}
				}
			)
		},
		beforeDestroy() {
			let data = {};
			data['orderActive'] = this.orderActive;
			for(let attr in this.selOption){
				if(this.selOption[attr]!=''){
					data[attr] = this.selOption[attr];
				}
			}
			if(this.value!=''){
				data['value'] = this.value;
			}
			data['pageNo'] = this.pageNo;
			data['scrollTop'] = this.scrollTop;
			localStorage.setItem('projectList',JSON.stringify(data));
		},
		mounted() {
			if(this.$route.params.ID!=-1){
				this.coursesId = this.$route.params.ID;
			}
			this.stopScrollInit();
			///筛选板块请求--组织类别
			this.getData('/KMS-MSERVER/learning/learningSearch/projectOrgan','organization','GET');	
		},
		methods: {
			stopScrollInit() {
				let that = this;
				document.body.onscroll = function(){
					event.stopPropagation();
					event.preventDefault();
					return false;
				};
				window.onscroll = function(){
					event.stopPropagation();
					event.preventDefault();
					return false;
				};
				this.$refs.search.onfocus = function(){
					that.textCenter = false;
				};
				this.$refs.search.onblur = function(){
					that.textCenter = true;
				};
			},
			searchBegin() {
				if(event.keyCode == 13){
					this.selHandler();
				}
			},
			wrapperScrollHandler() {
				this.scrollTop = event.currentTarget.scrollTop;
			},
			backFromFn() {
				let lastInfo = JSON.parse(localStorage.getItem('projectList'));
				for(let attr in lastInfo){
					if(attr == 'organization'){
						this.selOption[attr]  = lastInfo[attr];
						continue;
					}
					this[attr] = lastInfo[attr];
				}
				this.backSearchFn();
			},
			backFromOther() {
				this.contentLoad = true;
				this.searchFn();
			},
			loadMore() {
				var that = this;
				var url = '';
				url = '/KMS-MSERVER/learning/learningSearch/list?type=0';
				url = this.urlLimit(url);
				that.pageNo+=1;
				this.$refs.loadtips.innerHTML = '正在加载中...';
		        that.$http({
		        	method:"POST",
		        	url:that.$global().host+url+"&&startPage="+that.pageNo,
		        	
		        }).then(
		        	response => {
		        		if(response.status===200&&response.body.status){
		        			if(response.body.data){
		        				that.itemdata = that.itemdata.concat(response.body.data) ;
		        				//that.itemdata = response.body.data;
		        				that.pageNo = response.body.currentPage;
		        				if(that.pageNo>=response.body.totalPage){
		        					this.allLoaded = true;
		        					this.$refs.loadtips.innerHTML = '没有更多数据了！';
		        				}
		        				
		        			}else{
		        				that.itemdata = 0;
		        			}
		        			
		        		}else {
		        			that.itemdata = 0;
		        		}
		        		
		        	},
		        	response =>{
		        		// error callback
		        		console.log('error');
		        	}
		        )
				        
			},
			getList(num) {//按最近获取数据
				this.orderActive = num;
				this.pageNo = 0;
				this.allLoaded = false;
				this.searchFn();
				this.$refs.loadtips.innerHTML = '没有更多数据了！';
				document.getElementById('list_wrapper').scrollTop = 0;
			},
			searchFn(isFocus) {
				var url='';
				url = '/KMS-MSERVER/learning/learningSearch/list?type=0';
				url = this.urlLimit(url);
				url+='&startPage='+this.pageNo;
				this.getData(url,'itemdata','GET',{},function(parm){
					if(parm.pageNo>=parm.totalPage){
						parm.allLoaded = true;
						parm.$refs.loadtips.innerHTML = '没有更多数据了！';
					}else{
						parm.$refs.loadtips.innerHTML = '正在加载中...';
					}
				});
				if(!isFocus){
					this.$refs.search.blur();
				}
			},
			backSearchFn() {
				var that = this;
				var url='/KMS-MSERVER/learning/learningSearch/list?type=0';
				url = this.urlLimit(url);
				let url1 = url;
				this.temp = {};
				for(let i=0;i<=this.pageNo;i++){
					url = url1+'&startPage='+i;
					this.$http({
						method:'POST',
						url:this.$global().host+url
					}).then(
						response => {
							if(response.status==200&&response.body.status){
								if(response.body.data){
									this.temp[i] = response.body.data;
									this.totalPage = response.body.totalPage-1;
									if(Object.getOwnPropertyNames(this.temp).length == (this.pageNo+1)){
										for(let attr in this.temp){
											this['itemdata'] = this['itemdata'].concat(this.temp[attr]);
										}
										this.contentLoad = true;//内容已经加载完
										setTimeout(function(){
											document.getElementById('list_wrapper').scrollTop = that.scrollTop;
										},10);
									}
								}else{
									this['itemdata'] = 0;
								}
								
							}	
						},
						response =>{
							// error callback
							console.log('error');
						}
					)
				}
				this.$refs.search.blur();
				
			},
			urlLimit(url) {
				/*限制条件*/
				url+='&isAll='+this.orderActive;
				if(this.selOption.organization != ''){
					url+='&organization='+this.selOption.organization;
				}
				if(this.value){
					url+='&title='+this.value;
				}
				if(this.coursesId){
					url+='&coursesId='+this.coursesId;
				}
				return url;
			},
			cancelHandler() {
				this.value = '';
				for(let attr in this.selOption){//清空筛选选项
					this.selOption[attr] = '';
				}
				this.$refs.search.blur();
			},
			selOpenHander() {
				this.tabSelBlock=true;
				this.$refs.listWrapper.style['overflow-y'] = 'hidden';
				for(let attr in this.tempSelOption){
					this.tempSelOption[attr] = this.selOption[attr];
				}
			},
			//筛选点击事件
			selClickHandler(parm) {
				if(this.tempSelOption[parm.activeConditionAttr] == parm.dataId){
					this.tempSelOption[parm.activeConditionAttr] = '';
				}else{
					this.tempSelOption[parm.activeConditionAttr] = parm.dataId;
				}
			},
			selClickSureHandler() {
				for(let attr in this.selOption){
					this.selOption[attr] = this.tempSelOption[attr];
				}
				this.pageNo = 0;
				this.orderActive = 1;//默认显示全部
				this.allLoaded = false;
				this.tabSelBlock=false;
				this.$refs.listWrapper.style['overflow-y'] = 'scroll';
				this.searchFn();
				this.$refs.loadtips.innerHTML = '没有更多数据了！';
				document.getElementById('list_wrapper').scrollTop = 0;
			},
			selClickCancelHandler() {
				this.tabSelBlock=false;
				this.$refs.listWrapper.style['overflow-y'] = 'scroll';
				this.$refs.loadtips.innerHTML = '没有更多数据了！';
			},
			selHandler() {
				this.pageNo = 0;
				this.allLoaded = false;
				this.searchFn();
				this.$refs.loadtips.innerHTML = '没有更多数据了！';
				document.getElementById('list_wrapper').scrollTop = 0;
			}
		},
		watch:{
			value() {
				if(document.activeElement.id == 'search'){
					if(document.getElementById('search').value == ''){
						this.pageNo = 0;
						this.allLoaded = false;
						this.searchFn(true);
						this.$refs.loadtips.innerHTML = '没有更多数据了！';
					}
				}
			}
		},
		components:{
			"v-list": ContentList,
			"v-item":ListItem,
			"v-filter":SelFilter,
			"v-common-header": commonHeader
		}
	}
</script>
<style lang="less">

	.project-list-container{

		.tab-bottom{
			
			a{
				color:#888;
				display: inline-block;
				font-size:0.33rem;
				margin-right: 0.2rem;
				.sel-icon{
					display: inline-block;
					background: #000;
					vertical-align: bottom;
					margin-right:0.1rem;
					height: 1.06rem;
					width:0.4rem;
					&.all{	
						background:url('../../static/img/all.png') no-repeat 50% 50%;
						background-size: 100%;

					}
					&.not-all{
						width: 0.45rem;
						background:url('../../static/img/not_all.png') no-repeat 50% 50%;
						background-size: 100%;
						
					}
					
					
				}
				&.active{
					.sel-icon{
						&.all{
							background:url('../../static/img/all_a.png') no-repeat 50% 50%;
							background-size: 100%;
						}
						&.not-all{
							background:url('../../static/img/not_all_a.png') no-repeat 50% 50%;
							background-size: 100%;

						}
					}
					
				}
				
			}
		}
		
	}
</style>
