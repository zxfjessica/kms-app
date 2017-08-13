<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container course-list-container">
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
										placeholder="搜索课程" 
										class="mint-searchbar-core" 
										:class="{'text-center':value==''&&textCenter}" 
										@keypress="searchBegin"
										@focus="searchFocus"
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
						<a href="javascript:void(0)" :class="{active:!orderActive}" @click="getList(0)"><span class="order-icon new"></span>按最新</a>
						<a href="javascript:void(0)" :class="{active:orderActive}" @click="getList(1)"><span class="order-icon hot"></span>按最热</a>
						<div class="sel-wrapper" @click="selOpenHander">筛选</div>
					</div>
				</div>
				<div id="list_wrapper" class="list-wrapper" @scroll="wrapperScrollHandler" ref="listWrapper">
					<div class="course-list-wrapper">
						<p v-if="!contentLoad" class="loadtips">加载中...</p>
						<ul class="course-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="allLoaded"  infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
							<li class="co-li" v-for="item in itemdata">
								<v-item :item="item" :kindByP="'course'"></v-item>
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
									:title="'课程形式'" 
									:itemdata="coursesTypeId" 
									activeCondition="id"
									contentName="coursesTypeName"
									:actived="tempSelOption.coursesType"
									activeConditionAttr="coursesType"
									@selClickHandler="selClickHandler">
							</v-filter>
							<v-filter :showFlag="typeof cateId != 'number'" 
									:title="'课程体系'" 
									:itemdata="typeof cateId != 'number'?cateId:[]" 
									activeCondition="id"
									contentName="categoryName"
									:actived="tempSelOption.cateId"
									activeConditionAttr="cateId"
									@selClickHandler="selClickHandler">
							</v-filter>
							<v-filter :showFlag="true" 
									:title="'体系类别'" 
									:itemdata="hierarchyId" 
									activeCondition="id"
									contentName="hierarchyName"
									:actived="tempSelOption.hierarchyId"
									activeConditionAttr="hierarchyId"
									@selClickHandler="selClickHandler">
							</v-filter>
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
import ListItem from "../components/list/ListItem.vue";
import SelFilter from '../components/filterPanel.vue';
	import commonHeader from '../components/commonHeader.vue';
	export default {
		data() {
			return {
				value:'',
				searchSwitch:false,
				tabSelBlock:false,//筛选板块显示隐藏开关
				itemdata:[],
				orderActive:0,//排序选项:0-按照最新；1-按照最热
				coursesTypeId: [//课程形式
					{
						'id': '3',
						'coursesTypeName': '全部'
					},
					{
						'id': '0',
						'coursesTypeName': '在线'
					},
					{
						'id': '1',
						'coursesTypeName': '面授'
					}
				],
				cateId:[],//课程体系
				hierarchyId:[],//体系类别
				selOption:{//记录请求筛选选中选项
					'coursesType':'',
					'cateId':'',
					'hierarchyId':''
				},
				tempSelOption:{//记录临时请求筛选选中选项
					'coursesType':'',
					'cateId':'',
					'hierarchyId':''
				},
				pageNo:0,//请求的当前页面
				allLoaded:false,//是否全部加载完毕
				cateLevel:0,//当前筛选目录课程体系显示级别--0：一级;1:二三级无显示
				contentLoad:false,//首次内容是否加载完毕
				
				scrollTop:0,
				textCenter:true//搜索字体居中
			}
		},
		beforeRouteEnter(to, from, next) {
			next(
				vm => {
					if(from.path.match('/onLineCourse/')||from.path.match('/faceToFaceCourse/')){
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
			localStorage.setItem('courseList',JSON.stringify(data));
			
		},
		mounted() {
			if(this.$route.params.ID==-1){//从首页进入
				this.cateLevel = 0;
				if (this.$route.query.courseType === '1') { //在线课程
					this.selOption.coursesType = '0';
				}else if (this.$route.query.courseType === '2') { //面授课程
					this.selOption.coursesType = '1';
				}
			}else{//从二级或者三级目录进入
				this.cateLevel = 1;
				this.selOption.cateId = this.$route.params.ID;
			}
			//筛选板块请求--课程体系
			var url1 = '/KMS-MSERVER/learning/learningSearch/coursesCate?';
			if(this.cateLevel){
				url1+='&cateId2='+this.$route.params.ID;//显示二三级
			
			}//如果从首页进入，显示一级目录
			this.getData(url1,'cateId','GET');
			//筛选板块请求--体系类别
			this.getData('/KMS-MSERVER/learning/learningSearch/coursesHierarchy','hierarchyId','GET');
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
			searchFocus() {
				
			},
			wrapperScrollHandler() {
				this.scrollTop = event.currentTarget.scrollTop;
			},
			backFromFn() {
				let lastInfo = JSON.parse(localStorage.getItem('courseList'));
				for(let attr in lastInfo){
					if(attr == 'coursesType'||attr == 'cateId'||attr == 'hierarchyId'){
						this.selOption[attr] = lastInfo[attr];
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
			loadMore(){
				var that = this;
				var url = '';
				url = '/KMS-MSERVER/learning/learningSearch/list?type=1';
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
					if (attr === 'coursesType') {
						continue;
					}
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
				url = '/KMS-MSERVER/learning/learningSearch/list?type=1';
				url = this.urlLimit(url);
				url+='&startPage='+this.pageNo;
				/*限制条件*/
				this.getData(url,'itemdata','GET',{},function(parm){
					parm.contentLoad = true;
					if(parm.pageNo >= parm.totalPage){
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
				var that = this;
				var url = '/KMS-MSERVER/learning/learningSearch/list?type=1';
				url = this.urlLimit(url);
				let url1 = url;
				this.temp = {};
				/*限制条件*/
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
									if (this.pageNo === response.body.totalPage - 1) {
										this.$refs.loadtips.innerHTML = '没有更多数据了！';
										this.allLoaded = true;
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
				if(this.selOption.cateId != ''){
					if(this.cateLevel){
						url += '&cateId2=' +this.selOption.cateId;
					}else{
						url += '&cateId='+this.selOption.cateId;
					}
				}
				if(this.selOption.coursesType != '' && this.selOption.coursesType != '3'){
					url+='&coursesType='+this.selOption.coursesType;
				}
				if(this.selOption.hierarchyId != ''){
					url+='&hierarchyId='+this.selOption.hierarchyId;
				}
				if(this.value){
					url+='&title='+this.value;
				}
				return url;
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
				if(this.tempSelOption['cateId'] == '' && this.$route.params.ID != ''){
					this.tempSelOption.cateId = this.$route.params.ID;
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
			"v-item":ListItem,
			"v-filter":SelFilter,
			"v-common-header": commonHeader
		}
	}
</script>
<style lang="less">
@J-RED:#ff2626;
@J-GRAY:#888;
@J-LISTTITLE:#333;
@J-FONT:"黑体";
	.course-list-container,.project-list-container,.search-index-container,.teacher-list-container{
		input[type="search"]{-webkit-appearance:none;} background-color: #fff;
		input::-webkit-search-cancel-button {display: none;}
		/*::-webkit-scrollbar {//隐藏滚轮
			display: none;
		}*/
		&.container{
			overflow: hidden;
			overflow-y: hidden;
		}
		.tab-sel-block{
			position:absolute;
			width:100%;
			top:0;
			right:0;
			height:100%;
			z-index:300;		
			.content{
				position:absolute;
				background: #fff;
				width:100%;
				height: 100%;
				h4{
					font-size:0.43rem;
					line-height:1.3rem;
					margin-left: 1%;
					color:#5A5A5A;
				}
				li{
					display: inline-block;
					width:30.5%;
					height: 1rem;
					line-height: 1rem;
					white-space: nowrap;
					overflow: hidden;
					text-overflow:ellipsis;
					padding:1%;
					margin:0.4%;
					text-align:center;
					color:#777;
					font-size:0.33rem;
					.li-content{

						background:#EFEFEF;
						border:1px solid #EFEFEF;
						border-radius:0.2rem;
						padding: 0 3%;
						white-space: nowrap;
						overflow: hidden;
						text-overflow:ellipsis;
					}
					&.active{
						position: relative;
						.li-content{
							border: 1px solid #ff4141;
							background: #fff;
						}
						.tick{
							display: block;
							position: absolute;
							top:-5px;
							right:-5px;
							width: 0.53rem;
							height: 0.53rem;
							background:url('../../static/img/shunfeng_signs.png') #fff no-repeat 0 49.78%;
							background-size: 157.9% 4014%;
						}
					}

				}
				.content-inside{
					width: 100%;
					height: calc(94%-6%-1rem);
					overflow-y: scroll;
					padding-top:6%;
					ul{
						font-size: 0;
					}
					div{
						width:92%;
						margin:0 auto;
					}
					
				}
				.block-bottom{
					position: absolute;
					bottom:0%;
					right: 0;
					width:100%;
					height:1rem;
					line-height: 1em;
					font-size:0;
					span{
						display: inline-block;
						width:50%;
						height: 100%;
						line-height: 1rem;
						text-align:center;
						background-color: #fff;
						font-size: 0.38rem;
						margin-bottom: 0;
						padding:0;
						border-top:1px solid #eee;
						&.sel-sure-btn{
							border-top:1px solid #ff4141;
							background:#ff4141;
							color:#fff;
						}
					}
				}
				
			}
			
			
		}
		.mint-popup{
			width:80%;
			height:100%;
			max-height:100%;
			overflow: visible;
		}
	}
	.course-list-container,.project-list-container,.teacher-list-container{
		overflow: hidden;
		a{
			color:#ccc;
		}
		/*头部搜索*/
		.search-wrapper{
			background:#f2f2f2;
			.mint-search{
				width:100%;
				height:1.1rem;
				.mint-searchbar{
					width:93%;
					height: 100%;
					background-color:transparent;
					border:none;
					margin:0 auto;
					padding: 8px 0;
					.mint-searchbar-inner {
						position:relative;
						left:0%;
						height: 82%;
						border: 1px solid rgba(202, 202, 202, 0.49);
						
						border-radius: 0.1rem;
						.mint-searchbar-core{
							width:100%;
							font-size: 0.33rem;
							&.text-center{
								text-align: center;
								text-indent: 1em;
							}
						}
				    	.icon-search{
	    		    		position: absolute;
	    				    color: #aaa;
	    				    top: 50%;
	    				    right: 2%;
	    				    left: auto;
	    				    width: 16px;
	    				    height: 16px;
	    				    background: url('../../static/img/shunfeng_signs.png') no-repeat 0 -59px;
	    				    background-size: 30px;
	    				    background-position: 0 -43px;
	    				    margin-left: -8%;
	    				    transform: translateY(-50%);
		    			    &.text-center{
		        			    top: 50%;
		        			    left: 50%;
		    			    }
						    
				    	}
				    	@media (max-width: 767px){
				    		.icon-search{
				    			&.text-center{
				    				margin-left: -9%;
				    			}
				    		}
				    	}
				    	@media (max-width: 435px){
				    		.icon-search{
				    			&.text-center{
				    				margin-left: -10%;
				    			}
				    		}
				    	}
				    	@media (max-width: 360px){
				    		.icon-search{
				    			&.text-center{
				    				margin-left: -12%;
				    			}
				    		}
				    	}
						.mintui-search{
							margin-right: 0.2rem;
							transform:scale(1.5);
							-ms-transform:scale(1.5); 	
							-moz-transform:scale(1.5); 	
							-webkit-transform:scale(1.5); 
							-o-transform:scale(1.5); 
							&.text-center{
								position: absolute;
								left: 39%;
								top: 33%;
							}
						}
					}
					.mint-searchbar-cancel{
						color:#333;
						width:10%;
						margin-left: 0;
						text-align: right;
					}
				}
				
			}
		}
		.tab-bottom{
			height: 1.06rem;
			line-height:1.06rem;
			padding:0;	
			font-size:0.4rem;
			background:#fff;
			border-bottom:1px solid #eee;
			.tab-bottom-size-wrapper{
				width: 92%;
				margin: 0 auto;
			}
			a{
				color:@J-GRAY;
				display: inline-block;
				
				font-size:0.33rem;
				margin-right:0.2rem;
				.order-icon{
					display: inline-block;
					
					background: #000;
					vertical-align: bottom;
					margin-right:0.1rem;
					height: 1.06rem;
					width:0.4rem;
					
					&.new{
						
						background:url('../../static/img/new.png') no-repeat 50% 50%;	
						background-size: 100%;
						
					}
					&.hot{
						
						background:url('../..//static/img/hot.png') no-repeat 50% 50%;	
						background-size: 100%;
					}
				}
				&.active{
					color:@J-RED;
					.order-icon{
						&.new{
							
							background:url('../../static/img/new_a.png') no-repeat 50% 50%;
							background-size: 100%;
						}
						&.hot{
							
							background:url('../../static/img/hot_a.png') no-repeat 50% 50%;
							background-size: 100%;
						}
					}
				}
			}
			.sel-wrapper{
				float:right;
				width:10%;
				text-align: right;
				height: 0.46rem;
				line-height: 0.46rem;
				border-left:1px solid #eee;
				color: @J-GRAY;
				font-size: 0.33rem;
				margin: 0.3rem 0;
			}

		}
		.list-wrapper{
			height: calc(~"100% - 1.06rem - 1px");
			overflow-y:scroll;
			background:#fff;
			.course-list-wrapper{
				position:relative;
				padding-bottom: 1rem;
				background-color: #fff;
			}
			.course-list{
				padding: 0 12px;
				background: #fff;	
				.co-li{
					padding:0.5rem 0;
					border-bottom:1px solid #eee;
					font-size: 0;
					position:relative;
					.item-ctn{
						position:relative;
						.co-other{
							bottom:0;
						}
					}
				}
			}
		}
		
	}	
</style>