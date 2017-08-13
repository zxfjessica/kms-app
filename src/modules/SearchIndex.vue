<template>
	<div>
		<v-common-header></v-common-header>
		<div class="search-index-container container">
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
									ref="search">
							</form>
							
							<i class="icon-search" @click="selHandler" v-show="value!=''||!textCenter"></i>
						</div>
						<span class="mint-searchbar-cancel" v-if="value" @click="cancelHandler">取消</span>
					</div>
				</div>
				
			</div>
			
			<div class="search-tab">
				<div class="search-tab-wrapper">
					<div class="search-tab-item" :class="searchKind?'active':''" @click="kindSel(1)">课程</div>
					<div class="search-tab-item" :class="!searchKind?'active':''" @click="kindSel(0)">项目</div>
				</div>
			</div>
			<div class="relation" v-if="!resultSwitch">
				<div class="search-history">
					<h4>历史搜索</h4>
					<ul>
						<li v-for="item in historyItems"><a @click="historyClickHandler()">{{item.item}}</a></li>
					</ul>
				</div>
			</div>
			<div id="result_ctn" class="result-ctn" v-show="resultSwitch" >
				<div class="tab">
					<div class="tab-bottom">
						
						<a href="javascript:void(0)" :class="{active:!orderActive}" @click="getList(0)" v-if="searchKind"><span class="order-icon new"></span>按最新</a>
						<a href="javascript:void(0)" :class="{active:orderActive}" @click="getList(1)" v-if="searchKind"><span class="order-icon hot"></span>按最热</a>
						<a href="javascript:void(0)" :class="{active:orderActive}" @click="getList(1)" v-if="!searchKind"><span class="sel-icon all"></span>全部</a>
						<a href="javascript:void(0)" :class="{active:!orderActive}" @click="getList(0)" v-if="!searchKind"><span class="sel-icon not-all"></span>可参与</a>
						<div class="sel-wrapper" @click="selOpenHander">筛选</div>
					</div>
				</div>
				
				<div id="list_wrapper" class="list-wrapper" @scroll="wrapperScrollHandler" ref="listWrapper">
					<div class="course-list-wrapper">
						<p v-if="!contentLoad" class="loadtips">加载中...</p>
						<ul class="course-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="allLoaded"  infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
							<li class="co-li" v-for="item in itemdata">
								<v-item :item="item" :kindByP="searchKind?'course':'project'"></v-item>
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
							<v-filter :showFlag="!searchKind" 
									:title="'组织'" 
									:itemdata="organization" 
									activeCondition="id"
									contentName="tagName"
									:actived="tempSelOption.organizationId"
									activeConditionAttr="organizationId"
									@selClickHandler="selClickHandler">
							</v-filter>
							<v-filter :showFlag="!!searchKind"
									:title="'课程形式'" 
									:itemdata="coursesTypeId" 
									activeCondition="id"
									contentName="coursesTypeName"
									:actived="tempSelOption.coursesType"
									activeConditionAttr="coursesType"
									@selClickHandler="selClickHandler">
							</v-filter>
							<v-filter :showFlag="!!searchKind" 
									:title="'课程体系'" 
									:itemdata="typeof cateId != 'number'?cateId:[]" 
									activeCondition="id"
									contentName="categoryName"
									:actived="tempSelOption.cateId"
									activeConditionAttr="cateId"
									@selClickHandler="selClickHandler">
							</v-filter>
							<v-filter :showFlag="!!searchKind" 
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
<script>
import ContentList from "../components/list/ContentList.vue";
import ListItem from "../components/list/ListItem.vue";
import SelFilter from '../components/filterPanel.vue';
import commonHeader from '../components/commonHeader.vue';
export default{
	data() {
		return {
			searchKind:1,
			value:"",
			tabSelBlock:false,//筛选模块开关
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
			organization:[],//组织类别
			resultSwitch:false,
			itemdata:[],
			selOption:{//记录请求筛选选中选项
				'organizationId':'',
				'coursesType':'',
				'cateId':'',
				'hierarchyId':''
			},
			tempSelOption:{//记录请求筛选选中选项(已经确认)
				'organizationId':'',
				'coursesType':'',
				'cateId':'',
				'hierarchyId':''
			},
			pageNo:-1,//请求的当前页数
			allLoaded:true,//当前列表页是否全部加载完毕
			historyItems:[],
			searchback:false,
			contentLoad:false,//请求的列表内容是否已经加载完毕
			
			scrollTop:0,
			textCenter:true//搜索字体居中
		}
	},
	beforeRouteEnter (to, from, next) {
	   next(vm => {
	        // 通过 `vm` 访问组件实例
	        try{
	        	if(from.path.match('/faceToFaceCourse/')||from.path.match('/onLineCourse/')||from.path.match('/trainCourse/')){
	        		vm.backFromFn();                    
	        	}
	        }catch(e){}
	    })
	 },
	beforeDestroy() {
        var data = {};    		
		data['searchKind'] = this.searchKind;
		data['orderActive'] = this.orderActive;
		for(let attr in this.selOption){
			if(this.selOption[attr] != ''){
				data[attr] = this.selOption[attr];
			}
		}
		if(this.value != ''){
			data['value'] = this.value;
		}
		data['pageNo'] = this.pageNo;
		data['scrollTop'] = this.scrollTop;
		localStorage.setItem('searchinfo',JSON.stringify(data));
		this.$refs.search.blur();
	},
	mounted() {
		//筛选板块请求--课程体系
		this.getData('/KMS-MSERVER/learning/learningSearch/coursesCate','cateId','GET');
		//筛选板块请求--体系类别
		this.getData('/KMS-MSERVER/learning/learningSearch/coursesHierarchy','hierarchyId','GET');
		//筛选板块请求--组织类别
		this.getData('/KMS-MSERVER/learning/learningSearch/projectOrgan','organization','GET');	
		//读取历史搜索
		this.getHistoryItems();
		this.stopScrollInit();
		this.$refs.search.focus();
	},
	methods:{
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
		wrapperScrollHandler(event) {
			this.scrollTop = event.currentTarget.scrollTop;
		},
		searchBegin() {
			if(event.keyCode == 13){
				this.selHandler();
			}
		},
		backFromFn() {
			this.$refs.search.blur();

			let lastInfo = JSON.parse(localStorage.getItem('searchinfo'));
			for(let attr in lastInfo){
				if(attr == 'organizationId'||attr == 'coursesType'||attr == 'cateId'||attr == 'hierarchyId'){
					this.selOption[attr] = lastInfo[attr];
					continue;
				}
				this[attr] = lastInfo[attr];
			}
			this.backSearchFn();
		},
		backFromOther() {
			this.searchFn();
			this.$refs.search.focus();
			document.ontouchstart = function(event){
				event.stopPropagation();
				event.preventDefault();
				return false;
			};
		},
		loadMore(){
			var that = this;
			var url = '/KMS-MSERVER/learning/learningSearch/list?';
			url += 'type='+this.searchKind;
			if (this.searchKind) {
				url+='&orderType='+this.orderActive;
			} else {
				url+='&isAll='+this.orderActive;
			}	
			if(this.selOption.cateId != ''){
				url += '&cateId='+this.selOption.cateId;
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
			that.pageNo++;
			url+='&startPage='+this.pageNo;
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
	        				}else{
	        					this.$refs.loadtips.innerHTML = '正在加载中...';
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
		selOpenHander(){
			this.tabSelBlock=true;
			this.$refs.listWrapper.style['overflow-y'] = 'hidden';
			for(let attr in this.selOption){
				this.tempSelOption[attr] = this.selOption[attr];
			}
			this.$refs.listWrapper.style['overflow-y'] = 'hidden';
		},
		getList(orderActive) {
			this.orderActive = orderActive;
			this.searchFn();
		},
		searchFn(){
			var url = '';
			let that = this;	
			url = '/KMS-MSERVER/learning/learningSearch/list?type='+this.searchKind;
			/*限制条件*/
			if(this.searchKind){
				url+='&orderType='+this.orderActive;
			}else{
				url+='&isAll='+this.orderActive;
			}
			if(this.selOption.cateId != ''){
				url += '&cateId='+this.selOption.cateId;
			}
			if(this.selOption.hierarchyId != ''){
				url+='&hierarchyId='+this.selOption.hierarchyId;
			}
			if(this.selOption.coursesType != '' && this.selOption.coursesType != '3'){
				url+='&coursesType='+this.selOption.coursesType;
			}
			if(!this.searchKind&&this.selOption.organizationId!=''){
				url+='&organization='+this.selOption.organizationId;
			}
			if(this.value){
				url+='&title='+this.value;
			}
			this.pageNo=0;
			this.allLoaded = false;
			url+='&startPage='+this.pageNo;
			/*限制条件*/
			this.getData(url,'itemdata','GET',{},function(parm){
				if(parm.pageNo>=parm.totalPage){
					parm.allLoaded = true;
					parm.$refs.loadtips.innerHTML = '没有更多数据了!';
				}else{
					parm.$refs.loadtips.innerHTML = '正在加载中...';
				}
				setTimeout(function(){that.$refs.listWrapper.scrollTop = 0;},10);
				if(!parm.contentLoad){
					parm.contentLoad = true;
				}
			});
			this.$refs.search.blur();

		},
		backSearchFn() {
			this.resultSwitch = true;
			this.allLoaded = false;
			var url = '';
			let that = this;	
			url = '/KMS-MSERVER/learning/learningSearch/list?type='+this.searchKind;
			/*限制条件*/
			if(this.searchKind){
				url+='&orderType='+this.orderActive;
			}else{
				url+='&isAll='+this.orderActive;
			}
			if(this.selOption.cateId != ''){
				url += '&cateId='+this.selOption.cateId;
			}
			if(this.selOption.hierarchyId != ''){
				url+='&hierarchyId='+this.selOption.hierarchyId;
			}
			if(this.selOption.coursesType != '' && this.selOption.coursesType != '3'){
				url+='&coursesType='+this.selOption.coursesType;
			}
			if(!this.searchKind&&this.selOption.organizationId!=''){
				url+='&organization='+this.selOption.organizationId;
			}
			if(this.value){
				url+='&title='+this.value;
			}
			/*限制条件*/
			let url1 = url;
			this.temp = {};
			for(let i=0;i<=this.pageNo;i++){
				url = url1 + '&startPage=' + i;
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
										that.$refs.listWrapper.scrollTop = that.scrollTop;
									},10);
									if(this.pageNo>=this.totalPage){
										this.allLoaded = true;
										this.$refs.loadtips.innerHTML = '没有更多数据了！';
									}else{
										this.$refs.loadtips.innerHTML = '正在加载中...';
									}
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
		selClickHandler(parm) {
			if(this.tempSelOption[parm.activeConditionAttr] == parm.dataId){
				this.tempSelOption[parm.activeConditionAttr] = '';
			}else{
				this.tempSelOption[parm.activeConditionAttr] = parm.dataId;
			}
		},
		selClickSureHandler(){
			for(let attr in this.tempSelOption){
				this.selOption[attr] = this.tempSelOption[attr];
			}
			this.pageNo=0;
			this.allLoaded = false;
			this.tabSelBlock=false;
			this.$refs.listWrapper.style['overflow-y'] = 'scroll';
			this.searchFn();
			this.$refs.loadtips.innerHTML = '没有更多数据了！';
		},
		selClickCancelHandler() {
			this.tabSelBlock=false;
			this.$refs.listWrapper.style['overflow-y'] = 'scroll';
			this.$refs.loadtips.innerHTML = '没有更多数据了！';
		},
		//搜索种类选择
		kindSel(kindtip) {
			this.searchKind = kindtip;
			if(!this.searchKind){
				this.orderActive = 1;
				for(let attr in this.selOption){//清空筛选选项
					if(attr == 'organizationId'){
						this.selOption[attr] = '';
					}
				}
			}else{
				this.orderActive = 0;
				for(let attr in this.selOption){//清空筛选选项
					if(attr != 'organizationId'){
						this.selOption[attr] = '';
					}
				}
			}
			if(this.value){
				this.searchFn();
			}

			//清空筛选选项
			for(let attr in this.selOption){
				this.selOption[attr] = '';
			}
			if(kindtip == 1){
				this.$refs.search.placeholder = '搜索课程'
			}else if(kindtip == 0){
				this.$refs.search.placeholder = '搜索项目'
			}
			
		},
		cancelHandler() {
			this.value='';
			for(let attr in this.selOption){//清空筛选选项
				this.selOption[attr] = '';
			}
			this.$refs.loadtips.innerHTML = '没有更多数据了！';
			this.$refs.search.focus();
		},
		clearSelectActiveFn(identity){
			if(document.getElementById(identity)){
				for(let i=0;i<document.getElementById(identity).children.length;i++){
					if(document.getElementById(identity).children[i].className.replace('active','')){
						document.getElementById(identity).children[i].className = '';
					}
					
				}
			}
		},
		selHandler() {
			let that = this;
			if(this.value){
				this.resultSwitch = true;
				var url = '';
				url = '/KMS-MSERVER/learning/learningSearch/list?type='+this.searchKind;
				if(this.searchKind){
					url+='&orderType='+this.orderActive;
				}else{
					url+='&isAll='+this.orderActive;
				}
				if(this.selOption.cateId != ''){
					url += '&cateId='+this.selOption.cateId;
				}
				if(this.selOption.hierarchyId != ''){
					url+='&hierarchyId='+this.selOption.hierarchyId;
				}
				if(this.selOption.coursesType != '' && this.selOption.coursesType != '3'){
					url+='&coursesType='+this.selOption.coursesType;
				}
				if(!this.searchKind&&this.selOption.organizationId!=''){
					url+='&organization='+this.selOption.organizationId;
				}
				if(this.value){
					url+='&title='+this.value;
				}
				this.pageNo = 0;
				url+='&startPage='+this.pageNo;
				this.allLoaded = false;
				document.getElementById('list_wrapper').scrollTop = 0;
				this.getData(url,'itemdata','GET',{},function(parm){
					if(parm.pageNo>=parm.totalPage){
						parm.allLoaded = true;
						parm.$refs.loadtips.innerHTML = '没有更多数据了！';
					}else{
						parm.$refs.loadtips.innerHTML = '正在加载中...';
					}
				});
				//设置缓存
				this.setHistoryItems(this.value);
				//读取历史搜索
				this.getHistoryItems();
				this.$refs.search.blur();
	
			}
		},
		historyClickHandler(){
			this.resultSwitch = true;
			this.value = event.target.innerHTML;
			this.searchFn();
		},
		setHistoryItems(keyword){
			
			keyword = keyword.trim();
			let historyItems = localStorage.getItem('historyItems') || [];
			if(!historyItems.length){
				historyItems.push(keyword);
				localStorage.setItem('historyItems',historyItems);
			}else{
				const onlyItem = localStorage.getItem('historyItems').split('|').filter(e=>e != keyword);
				if(onlyItem.length>0){
					historyItems = keyword + '|' + onlyItem.join('|');
					localStorage.setItem('historyItems',historyItems);
				}
			}
 		},
 		//读取历史搜索
 		getHistoryItems(){
 			if(!window.localStorage.getItem('historyItems')){
 				return;
 			}
 			this.historyItems = window.localStorage.getItem('historyItems').split('|');
 			let historyItemsCopy = [];
 			for(var i=0;i<this.historyItems.length;i++){
 				let obj = {"item":""};
 				obj.item = this.historyItems[i];
 				historyItemsCopy.push(obj);
 			}
 			this.historyItems = historyItemsCopy;
 			if(this.historyItems.length>10){
				this.historyItems.length = 10;
 			}
 				
 		}
	},
	watch: {
		value() {
			if(!this.value){
				//发起请求，读取历史搜索数据
				this.resultSwitch = false;
				for(let attr in this.selOption){//清空筛选选项
					this.selOption[attr] = '';
				}
			}
		}
	},
	components: {
		"v-item":ListItem,
		"v-filter":SelFilter,
		"v-common-header": commonHeader
	}
}
</script>
<style lang="less">
.search-index-container{
	background-color: #fff;
	input[type="search"]{-webkit-appearance:none;} 
	input::-webkit-search-cancel-button {display: none;}
	overflow: hidden;
	.search-wrapper{
		background:#f2f2f2;
		.mint-search{
			width:100%;
		
			height:1.2rem;
			.mint-searchbar{
				width:93%;
				height: 100%;
				background-color:transparent;
				border:none;
				margin:0 auto;
				padding: 8px 0;
				.mint-searchbar-inner {
					height: 82%;
					position:relative;
					left:0%;
					border: 1px solid  rgba(202, 202, 202, 0.49);
					
					border-radius: 5px;
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
		width: 93%;
		height: 1.06rem;
		line-height: 1.06rem;
		margin: 0 auto;
		font-size: 0.32rem;
		background-color: #fff;
		border-bottom: 1px solid #eee;
		
		a{
			color:#888;
			display: inline-block;
			
			font-size:0.33rem;
			margin-right: 0.2rem;
			.order-icon,.sel-icon{
				display: inline-block;
				background: #000;
				
				vertical-align: bottom;
				margin-right:0.1rem;
				height: 1.06rem;
				width:0.4rem;
			}
			.order-icon{
				
				&.new{
					
					background:url('../../static/img/new.png') no-repeat 50% 50%;	
					background-size: 100%;
					
				}
				&.hot{
					
					background:url('../..//static/img/hot.png') no-repeat 50% 50%;	
					background-size: 100%;
				}
			}
			.sel-icon{
				
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
				color:#ff2626;
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
		
		.sel-wrapper{
			float:right;
			width:10%;
			text-align: right;
			height: 0.46rem;
			line-height: 0.46rem;
			border-left:1px solid #eee;
			color: #888;
			font-size: 0.33rem;
			margin: 0.3rem 0;
		}
	}
	.result-ctn{
		
		height: 85%;
		overflow: hidden;
		.list-wrapper{
			height: 100%;
			overflow-y:scroll;
			background:#fff;
			.course-list-wrapper{
				position:relative;
				padding-bottom: 2rem;
			}
			.course-list{
				padding: 0 12px;
				background: #fff;
				padding-bottom: 2.5rem;
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
			.loadtips{
				width: 100%;
				position:absolute;
				bottom:3.6rem;
				left:0;
				text-align: center;
				font-size: 0.32rem;
				color: #999;
			}
		}
	}
	
}
.search-tab{
	background-color:#fff;
	border-bottom:1px solid #dedede;
	.search-tab-wrapper{
		width:100%;
		margin:0 auto;
		font-size:0;
		.search-tab-item{
			display:inline-block;
			font-size:0.43rem;
			line-height:1.3rem;
			width:50%;
			text-align:center;
			margin-bottom: -1px;
			&.active{
				border-bottom:1px solid #fc4245;
			}
		}
	}
	
}
.relation{
	
	width:91%;
	margin:0 auto;
	.search-history,.search-hot{
		font-family:"微软雅黑","黑体";
		margin-top:0.43rem;
		h4{
			
			font-size:0.43rem;
			color:#999;
		}
		li{
			font-family: inherit;
			display: inline-block;
			width: 3.65rem;
			font-size:0.4rem;
			background:#ECECEC;
			padding:0.4em 0.8em;
			margin:0.3em;
			border-radius:3em;
			text-align:center;
			white-space: nowrap;
			text-overflow:ellipsis;
			overflow:hidden;
		}
	}
}


</style>