<template>
	<div>
		<div class="list-main" v-show="!superDetailVisiable && !channelDetailVisiable">
			<mt-header :title="title" class="is-fixed">
				<div slot="left">
				    <mt-button icon="back" @click="channelCloseHandler"></mt-button>
				</div>
				<div slot="right" class="header-right-btn">
				    <mt-button class="collect-btn" :class="{'collected': isCollect}" @click="collectHandler"></mt-button>
				</div>
			</mt-header>
			<div class="container ma-staff-super-container">
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
											:placeholder="searchKind==0?'搜索专家达人':'搜索频道'" 
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
					<div class="tab-bar">
						<div class="kind-option" 
							:class="{'active': searchKind==0}"
							@click="changeKind(0)">
								专家达人
							<span class="kind-active"></span>
						</div>
						<div class="kind-option" 
							:class="{'active': searchKind==1}"
							@click="changeKind(1)">
								知识频道
							<span class="kind-active"></span>
						</div>
					</div>
				</div>
				<div id="result_ctn" class="result-ctn">
					<div class="tab" v-show="searchKind==0">
						<div class="tab-bottom">			
							<a href="javascript:void(0)" :class="{active:!orderActive}" @click="getList(0)"><span class="order-icon new"></span>按最新</a>
							<a href="javascript:void(0)" :class="{active:orderActive}" @click="getList(1)"><span class="order-icon hot"></span>按最热</a>
						</div>
					</div>
					<section class="super-result" v-show="searchKind==0">
						<div class="ctn-wrapper" ref="ctnWrapperSuper" @scroll="wrapperScrollHandler">
							<ul class="super-list"
								v-infinite-scroll="loadBottom"
						 		infinite-scroll-disabled="superbottomAllLoaded"
						 		infinite-scroll-distance="10"
						 		infinite-scroll-immediate-check="false">
								<li v-for="item in superList">
									<router-link :to="{ path: '/knowledge/channelDetailSuper',  'query': { empNumber: item.empNumber } }">
										<v-super-item :itemByP="item"></v-super-item>
									</router-link>
								</li>
							</ul>
							<p class="loadtips"
								v-show="!superbottomAllLoaded">加载中……</p>
							<p class="loadtips"
								v-show="superbottomAllLoaded">没有更多数据了！</p>
						</div>
					</section>
					<section class="channel-result" v-show="searchKind==1">
						<div class="ctn-wrapper" ref="ctnWrapperChannnel" @scroll="wrapperScrollHandler">
							<ul class="channel-list"
								v-infinite-scroll="loadBottom"
						 		infinite-scroll-disabled="channelbottomAllLoaded"
						 		infinite-scroll-distance="10"
						 		infinite-scroll-immediate-check="false">
								<li v-for="channelItem in channelList" :class="{'is-list-focus': channelItem.isFocus}">
									<router-link :to="{ 'path': '/knowledge/channelDetailChannel', 'query': { id: channelItem.id } }">
										<v-channel-item @subscribeTip="subscribeTipHandler"
											:itemByP="channelItem">
										</v-channel-item>
									</router-link>
								</li>
							</ul>
							<p class="loadtips"
								v-show="!channelbottomAllLoaded">加载中……</p>
							<p class="loadtips"
								v-show="channelbottomAllLoaded">没有更多数据了！</p>
						</div>
						<v-subscribe-tip :subscribeTipVisibleByP="subscribeTipVisible" 
							@subscribeTipSureControl="subscribeTipSureHandler"
							@visibleControl="tipVisibleHandler"
							:integral="integral"
							:channelId = "popUpChannelId">
						</v-subscribe-tip>
					</section>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import commonHeader from '../../components/commonHeader.vue';
	import superItem from '../../components/channelList/superItem.vue';
	import channelItem from '../../components/channelList/channelItem.vue';
	import subscribeTip from '../../components/channelList/subscribeTip.vue';
	import { Toast } from 'mint-ui';
	import { getEmpNumber } from '../../js/commonFunction.js';
	export default {
		data() {
			return {
				title: '频道',
				searchKind: 0,//0:达人，1:频道
				orderActive: 0,//0:最新，1:最热
				value: '',
				superDetailVisiable: false,//专家达人详情页显示开关
				channelDetailVisiable: false,//频道详情显示开关
				isCollect: false,//该类别频道是否已经收藏
				superList: [],
				superTotalPage: 0,
				superPageNo: 0,
				superbottomAllLoaded: false,
				superScrollTop: 0,
				channelList: [],
				channelTotalPage: 0,
				channelPageNo: 0,
				channelbottomAllLoaded: false,
				channelScrollTop: 0,
				subscribeTipVisible: false,//订阅提示
				integral: -1,//订阅、未订阅弹出框的积分显示
				popUpChannelId: -1, //订阅、未订阅弹出框的id显示
				channelIsFocus: false, //该分类是否感兴趣
				myScore: 0,//剩余积分
				empNumber: ''
			}
		},
		components: {
			'v-common-header': commonHeader,
			'v-super-item': superItem,
			'v-channel-item': channelItem,
			'v-subscribe-tip': subscribeTip
		},
		beforeRouteEnter(to, from, next) {
			next(
				(vm) => {
					if (from.path.match('/channelDetailChannel') || from.path.match('/channelDetailSuper')
						|| from.path.match('/meetOnlineConsult') || from.path.match('channelDetailBlog') 
						|| from.path.match('consultationDetail')) {
						vm.backFromFn();
					} else {
						vm.backFromOtherFn();
					}
				}
			);
		},
		beforeDestroy() {
			let data = {};
			data['searchKind'] = this.searchKind;
			data['orderActive'] = this.orderActive;
			data['channelPageNo'] = this.channelPageNo;
			data['channelTotalPage'] = this.channelTotalPage;
			data['channelbottomAllLoaded'] = this.channelbottomAllLoaded;
			data['channelScrollTop'] = this.channelScrollTop;
			data['superPageNo'] = this.superPageNo;
			data['superTotalPage'] = this.superTotalPage;
			data['superbottomAllLoaded'] = this.superbottomAllLoaded;
			data['superScrollTop'] = this.superScrollTop;
			if (this.value != '') {
				data['value'] = this.value;
			}
			try{
				localStorage.setItem('channelList', JSON.stringify(data));
			}catch(e){}
		},	
		mounted() {
			// 收藏请求
			this.getData('/KMS-MSERVER/mobileChannel/mobileChannel/cate?cateId=' + this.$route.query.id,
			'channelIsFocus','GET',{},
			function(parm){
				parm.isCollect = parm.channelIsFocus.isFocus;
			});

			//获取工号和剩余积分
			getEmpNumber(this);	
			this.$nextTick(
				() => {
					this.getData('/KMS-MSERVER/learning/person/main?empNumber=' + this.empNumber, 'myScore', 'GET', {}, parm => {
						parm.$nextTick(
							() => {
								parm.myScore = parm.myScore.score;
							}
						);
					});
				}
			);
		},			
		methods: {
			wrapperScrollHandler() {
				if (this.searchKind == 0) {
					this.superScrollTop = this.$refs.ctnWrapperSuper.scrollTop;
				} else {
					this.channelScrollTop = this.$refs.ctnWrapperChannnel.scrollTop;
				}
			},
			getList(order) {//专家达人排序
				this.orderActive = order;
				this.$refs.ctnWrapperSuper.scrollTop = 0;
				setTimeout(() => {
					this.searchFn();
					this.superbottomAllLoaded = true;
				});
			},
			backFromOtherFn() {
				if (this.$route.query.coursename) {
					this.title = this.$route.query.coursename;
				}
				if (this.$route.query.id) {
					// 频道列表
					var url = '/KMS-MSERVER/mobileChannel/search/channelList?type=2';
					url += '&cateId=' + this.$route.query.id;
					this.getData(url,'channelList','GET',{},function(parm){
						parm.channelTotalPage = parm.totalPage;
						if (parm.channelPageNo >= parm.channelTotalPage) {
							parm.channelbottomAllLoaded = true;
						} else {
							parm.channelbottomAllLoaded = false;
						}
					});
					// 达人列表
					var url1 = '/KMS-MSERVER/mobileChannel/expertAndMaster/list?type=2';
					url1 += '&cateId=' + this.$route.query.id;
					url1 += '&orderType=' + this.orderActive;
					this.getData(url1,'superList','GET',{},function(parm){
						parm.superTotalPage = parm.totalPage;
						if (parm.superPageNo >= parm.superTotalPage) {
							parm.superbottomAllLoaded = true;
						} else {
							parm.superbottomAllLoaded = false;
						}
					});
				}
			},
			backFromFn() {
				var lastInfo = {};
				try{
					lastInfo = JSON.parse(localStorage.getItem('channelList'));
				} catch(e) {}
				for (var attr in lastInfo) {
					this[attr] = lastInfo[attr];
				}
				if (this.$route.query.coursename) {
					this.title = this.$route.query.coursename;
				}
				if (this.$route.query.id) {
					// 频道列表
					this.backSearchFn();
				}
			},
			backSearchFn() {
				var that = this;
				//频道
				this.channelbottomAllLoaded = false;
				var url = '/KMS-MSERVER/mobileChannel/search/channelList?type=2';
				url += '&cateId=' + this.$route.query.id;
				if (this.value != '') {
					url += '&title=' + this.value;
				}
				let url1 = url;
				this.temp = {};
				/*限制条件*/
				for(let i = 0;i <= this.channelPageNo; i++){
					url = url1+'&startPage='+i;
					this.$http({
						method:'GET',
						url:this.$global().host+url
					}).then(
						response => {
							if(response.status==200&&response.body.status){
								if(response.body.data){
									this.temp[i] = response.body.data;
									if(Object.getOwnPropertyNames(this.temp).length == (this.channelPageNo+1)){
										for(let attr in this.temp){
											this['channelList'] = this['channelList'].concat(this.temp[attr]);
										}
										setTimeout(function(){
											that.$refs.ctnWrapperChannnel.scrollTop = that.channelScrollTop;
										},10);
									}
									if (this.channelPageNo == this.channelTotalPage) {
										this.channelbottomAllLoaded = true;
									}
								}else{
									this['channelList'] = 0;
								}
								
							}	
						}
					)
				}
				//达人
				this.superbottomAllLoaded = false;
				var url2 = '/KMS-MSERVER/mobileChannel/expertAndMaster/list?type=2';
				url2 += '&cateId=' + this.$route.query.id;
				url2 += '&orderType=' + this.orderActive;
				if (this.value != '') {
					url2 += '&title=' + this.value;
				}
				let url3 = url2;
				this.temp = {};
				/*限制条件*/
				for(let i = 0;i <= this.superPageNo; i++){
					url2 = url3+'&startPage='+i;
					this.$http({
						method:'GET',
						url:this.$global().host+url2
					}).then(
						response => {
							if(response.status==200&&response.body.status){
								if(response.body.data){
									this.temp[i] = response.body.data;
									if(Object.getOwnPropertyNames(this.temp).length == (this.superPageNo+1)){
										for(let attr in this.temp){
											this['superList'] = this['superList'].concat(this.temp[attr]);
										}
										setTimeout(function(){
											that.$refs.ctnWrapperSuper.scrollTop = that.superScrollTop;
										},10);
									}
									if (this.superPageNo == this.superTotalPage) {
										this.superbottomAllLoaded = true;
									}
								}else{
									this['superList'] = 0;
								}
								
							}	
						}
					)
				}
			},
			collectHandler() {//收藏事件
				var info = 'cateId=' + this.$route.query.id;
				if (this.isCollect) {//取消收藏
					info += '&type=2';
				} else { //添加收藏
					info += '&type=1';
				}
				this.$http.post(this.$global().host + '/KMS-MSERVER/mobileChannel/saveUserCate', info).then(
					response => {
						if(response.status==200&&response.body.status){
							Toast({message: response.body.data.result, duration: 1000});
						}	
					}
				)
				this.isCollect = !this.isCollect;
			},
			channelCloseHandler() {//返回列表
				this.$router.go(-1);
			},
			changeKind(parm) {
				this.searchKind = parm;
				if (parm == 0) {
					this.orderActive = 0;
				}
				this.searchFn();
			},
			searchBegin() {
				if(event.keyCode == 13){
					this.selHandler();
				}
			},
			selHandler() {
				if (this.value != '') {
					this.searchFn();
				} else {
					Toast({message: '请输入关键字！', duration: 1000});
				}
			},
			cancelHandler() {
				this.value = '';
				this.$refs.search.blur();
			},
			loadBottom() {
				var url = '';
				if (this.searchKind == 0) { //达人
					url = '/KMS-MSERVER/mobileChannel/expertAndMaster/list?type=2';
					this.superPageNo++;
					url += '&cateId=' + this.$route.query.id;
					url += '&orderType=' + this.orderActive;
					url += '&startPage=' + this.superPageNo;
					this.getMoreData(url, 'superList', 'superTotalPage', 'superPageNo', 'superbottomAllLoaded');
				} else { //频道
					url = '/KMS-MSERVER/mobileChannel/search/channelList?type=3';
					this.channelPageNo++;
					url += '&cateId=' + this.$route.query.id;
					url += '&startPage=' + this.channelPageNo;
					this.getMoreData(url, 'channelList', 'channelTotalPage', 'channelPageNo', 'channelbottomAllLoaded');
				}
			},
			getMoreData(url,content,totalPage,pageno,bottomAllLoaded) {
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
									this[bottomAllLoaded] = true;
								}
							}else{
								this[content] = '找不着数据！';
							}
						}	
					}
				)
			},
			searchFn(isFocus) {
				var url = '';
				if (this.searchKind == 0) {//达人
					url = '/KMS-MSERVER/mobileChannel/expertAndMaster/list?type=2';
					this.superPageNo = 0;
					this.superbottomAllLoaded = false;
					setTimeout(() => {this.$refs.ctnWrapperSuper.scrollTop = 0;}, 50);
					this.superList = [];
					url += '&cateId=' + this.$route.query.id;
					url += '&orderType=' + this.orderActive;
					url += '&startPage=' + this.superPageNo;
					if (this.value != '') {
						url += '&title=' + this.value;
					}
					this.getData(url,'superList','GET',{},function(parm){
						parm.superTotalPage = parm.totalPage;
						if (parm.superPageNo >= parm.superTotalPage) {
							parm.superbottomAllLoaded = true;
						} else {
							parm.superbottomAllLoaded = false;
						}
					});
				} else { //频道
					url = '/KMS-MSERVER/mobileChannel/search/channelList?type=2';
					this.channelPageNo = 0;
					this.channelbottomAllLoaded = false;
					setTimeout(() => {this.$refs.ctnWrapperChannnel.scrollTop = 0;}, 50);
					this.channelList = [];
					url += '&cateId=' + this.$route.query.id;
					url += '&startPage=' + this.channelPageNo;
					if (this.value != '') {
						url += '&title=' + this.value;
					}
					this.channelList = [];
					this.getData(url,'channelList','GET',{},function(parm){
						parm.channelTotalPage = parm.totalPage;
						if (parm.channelPageNo >= parm.channelTotalPage) {
							parm.channelbottomAllLoaded = true;
						} else {
							parm.channelbottomAllLoaded = false;
						}
					});
				}
				if (! isFocus) {
					this.$refs.search.blur();
				}
			},
			subscribeTipHandler(parm) {
				if (typeof parm != 'number') {//订阅
					if (parm.score == 0) {
						this.subscribeHandler(parm.channelId);
						return;
					}
					if (this.myScore < parm.score) {
						Toast({message: '您的积分余额不足！', duration: 1000});
						return;
					}
					this.integral = parm.score;
					this.popUpChannelId = parm.channelId;
				} else {
					this.integral = -1;
					this.popUpChannelId = parm;
				}
				this.subscribeTipVisible = true;
			},
			tipVisibleHandler(onOff) {
				this.subscribeTipVisible = onOff;
			},
			subscribeTipSureHandler(isSubscribe, isFocus, channelId) {//频道列表确定使用积分订阅
				this.searchFn();
			},
			subscribeHandler(channelId) {
				var that = this;
				var info = 'channelId=' + channelId;
				info += '&type=1';//订阅
				this.$http.post(this.$global().host + '/KMS-MSERVER/mobileChannel/saveUserChannel', info).then(
					response => {
						if(response.status==200&&response.body.status){
							Toast({message: response.body.data.result, duration: 1000});
							setTimeout(() => {
								that.searchFn();
							}, 50);			
						}	
					}
				)
			}
		},
		watch: {
			value() {
				if(document.activeElement.id == 'search'){
					if(document.getElementById('search').value == ''){
						this.searchFn(true);
					}
				}
			}
		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	// 专家频道列表、频道管理、达人频道搜索页共同样式
	.ma-staff-super-container,.ma-channel-container, .expert-list-container, .channel-search-container{
		.tab-bar {
			font-size: 0;
			background-color: #fff;
			.kind-option {
				width: 50%;
				height: 0.82rem;
				font-size: 0.42rem;
				display: inline-block;
				text-align: center;
				position: relative;
				padding-top: 0.32rem;
				border-bottom: 1px solid #eee;
				&.active {
					color: #ff0000;
					.kind-active {
						background-color: #ff0000;
					}
				}
				.kind-active {
					position: absolute;
					bottom: -1px;
					left: 45%;
					width: 10%;
					height: 2px;
					background-color: transparent;
				}
			}
		}
	}
	//专家频道列表样式、专家达人列表页、达人频道搜索页
	.ma-staff-super-container, .expert-list-container, .channel-search-container {
		input[type="search"]{-webkit-appearance:none;} background-color: #fff;
		input::-webkit-search-cancel-button {display: none;}
		.mint-search {
			height: 1.2rem;
		}
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
						    background: url('../../../static/img/shunfeng_signs.png') no-repeat 0 -59px;
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
		.tab {
			background-color: #fff;
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
						
						background:url('../../../static/img/new.png') no-repeat 50% 50%;	
						background-size: 100%;
						
					}
					&.hot{
						
						background:url('../../../static/img/hot.png') no-repeat 50% 50%;	
						background-size: 100%;
					}
				}
				.sel-icon{
					
					&.all{	
						
						background:url('../../../static/img/all.png') no-repeat 50% 50%;
						background-size: 100%;

					}
					&.not-all{
						
						width: 0.45rem;
						background:url('../../../static/img/not_all.png') no-repeat 50% 50%;
						background-size: 100%;
						
					}
				}
				&.active{
					color:#ff2626;
					.order-icon{
						
						&.new{
							
							background:url('../../../static/img/new_a.png') no-repeat 50% 50%;
							background-size: 100%;
						}
						&.hot{
							
							background:url('../../../static/img/hot_a.png') no-repeat 50% 50%;
							background-size: 100%;
						}
					}
					.sel-icon{
						&.all{
							
							background:url('../../../static/img/all_a.png') no-repeat 50% 50%;
							background-size: 100%;
						}
						&.not-all{
							
							background:url('../../../static/img/not_all_a.png') no-repeat 50% 50%;
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
		.super-result {
			.ctn-wrapper {
				height: calc(~"100vh - 3.4rem - 48px");
				overflow-y: scroll;
				background-color: #fff;
				ul {
					margin-bottom: 1rem;
				}
				.loadtips {
					margin-top: -0.8rem;
					line-height: 0.48rem;
				}
				li {
					width: 92%;
					margin: 0 auto;
					padding: 0.4rem 0;
					border-bottom: 1px solid #eee;
				}
			}
		}
		.channel-result {
			.ctn-wrapper {
				height: calc(~"100vh - 2.34rem - 48px");
				overflow-y: scroll;
				background-color: #fff;
				position: relative;
				top: 1px;
				ul {
					margin-bottom: 1rem;
				}
				.loadtips {
					margin-top: -0.8rem;
					line-height: 0.48rem;
				}
				li {
					// padding: 0.6rem 4%;
					// border-bottom: 1px solid #eee;
					padding: 0.3rem 0;
				    padding-right: 4%;
				    margin-left: 4%;
				    border-bottom: 1px solid #eee;
				    padding-bottom: 0.9rem;
				    &.is-list-focus {
				    	padding: .2rem 0;
				    	padding-right: 4%;
				    }
				}
			}
		}
	}
	.list-main {
		.header-right-btn {
			position: relative;
			.collect-btn {
				width: 27px;
				height: 26px;
				display: block;
				float: right;
				background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
				background-size: 178%;
				.bgPosition(@signs4Width, @signs4Height, 39, 37, 0, 202);
				&.collected {
					.bgPosition(@signs4Width, @signs4Height, 39, 36, 0, 157);
				}
			}
		}
	}
</style>