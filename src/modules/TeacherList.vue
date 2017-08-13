<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container teacher-list-container">
			<div class="tab">
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
										placeholder="搜索讲师" 
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
			</div>
			<div style="height: 93%;overflow: hidden;background-color:#eee;">
				<div class="tab-bottom">
					<div class="tab-bottom-size-wrapper">
						<a href="javascript:void(0)" :class="{active:!orderActive}" @click="getList(0)"><span class="order-icon time"></span>课时</a>
						<a href="javascript:void(0)" :class="{active:orderActive}" @click="getList(1)"><span class="order-icon satisfy"></span>满意度</a>
						<div class="sel-wrapper" @click="selOpenHander">筛选</div>
					</div>
				</div>
				<div id="list_wrapper" class="list-wrapper" @scroll="wrapperScrollHandler" ref="listWrapper">
					<div class="course-list-wrapper">
						<p v-if="!contentLoad && !itemdata.length" class="loadtips">加载中...</p>
						<ul class="course-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="allLoaded"  infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
							<li class="co-li" v-for="item in itemdata">
								<v-item :content="item"></v-item>
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
							<div>
								<h4>讲师等级</h4>
								<ul id="cateId_list">
									<li v-for="item in level" 
										@click="selClickHandler('lecturerLevelId')" 
										:dataId="item.levle"
										:class="{active:tempSelOption.lecturerLevelId==String(item.levle)}">
										<div class="li-content">{{item.levleName}}</div>
										<span class="tick"></span>
									</li>
								</ul>
							</div>
						</div>
						<div class="block-bottom show-enter">
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
<script type="text/javascript">
import TeacherListItem from "../components/list/TeacherListItem.vue";
import commonHeader from '../components/commonHeader.vue';
	export default {
		data() {
			return {
				value:'',
				searchSwitch:false,
				tabSelBlock:false,//筛选板块显示隐藏开关
				itemdata:[],
				orderActive:0,//排序选项:0-按照最新；1-按照最热
				level:[],//讲师等级数组
				selOption:{//记录请求筛选选中选项
					'lecturerLevelId':''
				},
				tempSelOption:{//记录临时请求筛选选中选项
					'lecturerLevelId':''
				},
				pageNo:0,//请求的当前页面
				allLoaded:false,//是否全部加载完毕
				coursesId:'',//是否从课程页面搜索更多讲师进来的
				contentLoad:false,//首次内容是否加载完毕
				scrollTop:0,
				textCenter:true//搜索字体居中
			}
		},
		beforeRouteEnter(to, from, next) {
			next(
				vm => {
					if(from.path.match('/teacherHome/')){
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
			data['allLoaded'] = this.allLoaded;
			localStorage.setItem('teacherList',JSON.stringify(data));
			
		},
		mounted() {
			//筛选板块请求--体系类别
			this.getData('/KMS-MSERVER/learning/lecturerSearch/levelList','level','GET');
			this.stopScrollInit();
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
				let lastInfo = JSON.parse(localStorage.getItem('teacherList'));
				for(let attr in lastInfo){
					if(attr == 'lecturerLevelId'){
						this.selOption[attr] = lastInfo[attr];
						continue;
					}
					this[attr] = lastInfo[attr];
				}
				if(this.$route.params.ID !== '-1'){
					this.coursesId = this.$route.params.ID;
				}
				this.backSearchFn();
			},
			backFromOther() {
				if(this.$route.params.ID !== '-1'){
					this.coursesId = this.$route.params.ID;
				}
				//this.contentLoad = true;
				this.searchFn();
			},
			loadMore(){
				var that = this;
				var url = '';
				url = '/KMS-MSERVER/learning/lecturerSearch/list?type=1';
				url = this.urlLimit(url);
				that.pageNo++;
				url+='&startPage='+this.pageNo;
				this.$refs.loadtips.innerHTML = '正在加载中...';
		        that.$http({
		        	method:"POST",
		        	url:that.$global().host+url,
		        }).then(
		        	response => {
		        		if(response.status===200&&response.body.status){
		        			if(response.body.data){
		        				this['itemdata'] = this['itemdata'].concat(response.body.data) ;
		        				if(that.pageNo>=response.body.totalPage-1){
		        					this.allLoaded = true;
		        					this.$refs.loadtips.innerHTML = '没有更多数据了！';
		        				}
		        			}else{
		        				that.itemdata = 0;
		        			}	
		        		}
		        		
		        	},
		        	response =>{
		        		// error callback
		        		console.log('error');
		        	}
		        )
				        
			},
			selHandler() {
				this.pageNo = 0;
				this.allLoaded = false;
				this.searchFn();
				this.$refs.loadtips.innerHTML = '没有更多数据了！';
			},
			cancelHandler(){
				this.value = '';
				for(let attr in this.selOption){//清空筛选选项
					this.selOption[attr] = '';
				}
				this.$refs.search.blur();
			},
			getList(orderActive) {//按最热/最新获取数据
				this.pageNo=0;
				this.orderActive = orderActive;
				this.allLoaded = false;
				this.searchFn();
			},
			searchFn(isFocus){//根据各种条件获取数据
				var url = '';
				var that = this;
				that.$refs.listWrapper.scrollTop = 0;
				url = '/KMS-MSERVER/learning/lecturerSearch/list?type=1';
				url = this.urlLimit(url);
				url+='&startPage='+this.pageNo;
				this.getData(url,'itemdata','GET',{},function(parm){
					parm.contentLoad = true;
					if(parm.totalPage === -1 || parm.pageNo >= parm.totalPage){
						parm.allLoaded = true;
						parm.$refs.loadtips.innerHTML = '没有更多数据了！';
					}else{
						parm.$refs.loadtips.innerHTML = '正在加载中...';
					}
					setTimeout(function(){that.$refs.listWrapper.scrollTop = 0;},10);
				});
				if(!isFocus){
					this.$refs.search.blur();
				}
				
			},
			backSearchFn() {
				this.itemdata = [];
				var that = this;
				var url = '/KMS-MSERVER/learning/lecturerSearch/list?type=1';
				that.$refs.listWrapper.scrollTop = 0;
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
										if (this.allLoaded) {
											this.$refs.loadtips.innerHTML = '没有更多数据了！';
										}
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
				url+='&orderType='+this.orderActive;
				if(this.selOption.lecturerLevelId != ''){
					url += '&lecturerLevelId=' + this.selOption.lecturerLevelId;
				}
				if(this.coursesId != ''){
					url += '&coursesId=' + this.coursesId;
				}
				if(this.value){
					url+='&title='+this.value;
				}
				return url;
			},
			clearSelectActiveFn(identity){//清空选中状态
				if(document.getElementById(identity)){
					for(let i=0;i<document.getElementById(identity).children.length;i++){
						if(document.getElementById(identity).children[i].className.replace('active','')){
							document.getElementById(identity).children[i].className = '';
						}
						
					}
				}
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
				if(this.tempSelOption[parm] == event.currentTarget.getAttribute('dataId')){
					this.tempSelOption[parm] = '';
				}else{
					this.tempSelOption[parm] = event.currentTarget.getAttribute('dataId');
				}
				if(this.tempSelOption['level'] == '' && this.$route.params.ID != ''){
					this.tempSelOption.level = this.$route.params.ID;
				}
			},
			selClickSureHandler() {
				for(let attr in this.selOption){
					this.selOption[attr] = this.tempSelOption[attr];
				}
				this.pageNo=0;
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
			"v-item":TeacherListItem,
			"v-common-header": commonHeader
		}
	}
</script>
<style lang="less">
.teacher-list-container{
	.list-wrapper .course-list li.co-li {
		padding: 0;
		height: 2.7rem;
	}
	.tab-bottom a{
		.order-icon{
			&.time{
				background:url('../../static/img/active.png') no-repeat 50% 50%;	
				background-size: 100%;
			}
			&.satisfy{
				background:url('../../static/img/satisfy.png') no-repeat 50% 50%;	
				background-size: 100%;
			}
		}
		&.active{
			.order-icon{
				&.time{
					background:url('../../static/img/active_a.png') no-repeat 50% 50%;	
					background-size: 100%;
				}
				&.satisfy{
					background:url('../../static/img/satisfy_a.png') no-repeat 50% 50%;	
					background-size: 100%;
				}
			}
		}
	}	
}
</style>