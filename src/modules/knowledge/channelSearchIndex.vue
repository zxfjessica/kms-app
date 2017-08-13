<template>
	<div>
		<div class="ma-staff-super-main" v-show="!superDetailVisiable && !channelDetailVisiable">
			<v-common-header></v-common-header>
			<div class="container channel-search-container">
				<div class="tab">
					<div class="search-wrapper">
						<div class="mint-search">
							<div class="mint-searchbar">
								<div class="mint-searchbar-inner">
									<form action="javascript:void(0)" style="width:100%">
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
				<div class="relation" v-if="!resultSwitch">
					<div class="search-history">
						<h4>历史搜索</h4>
						<ul>
							<li v-for="item in historyItems"><a @click="historyClickHandler()">{{item.item}}</a></li>
						</ul>
					</div>
				</div>
				<div id="result_ctn" class="result-ctn" v-if="resultSwitch">
					<div class="tab" v-if="searchKind==0">
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
				searchKind: 0,//0:达人，1:频道
				orderActive: 0,
				superData: [],
				channelData: [],
				value: '',
				resultSwitch: false,//搜索结果展示开关
				subscribeTipVisible: false,//订阅提示
				channelDetailVisiable: false, //频道详情显示开关
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
				historyItems: [],
				integral: -1,//订阅、未订阅弹出框的积分显示
				popUpChannelId: -1, //订阅、未订阅弹出框的id显示
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
		mounted() {
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
			//读取历史搜索
			this.getHistoryItems();
		},
		beforeRouteEnter(to, from, next) {
			next(
				(vm) => {
					if (from.path.match('/channelDetailChannel') || from.path.match('/channelDetailSuper')
						|| from.path.match('/meetOnlineConsult') || from.path.match('channelDetailBlog') 
						|| from.path.match('consultationDetail') || from.path.match('channelDetailSuper')) {
						vm.backFromFn();
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
				localStorage.setItem('channelSearchIndex', JSON.stringify(data));
			}catch(e){}
		},
		methods: {
			wrapperScrollHandler() {
				if (this.searchKind == 0) {
					this.superScrollTop = this.$refs.ctnWrapperSuper.scrollTop;
				} else {
					this.channelScrollTop = this.$refs.ctnWrapperChannnel.scrollTop;
				}
			},
			getList(order) {
				this.orderActive = order;
				this.$refs.ctnWrapperSuper.scrollTop = 0;
				setTimeout(() => {
					this.searchFn();
					this.superbottomAllLoaded = true;
				});
			},
			changeKind(parm) {
				this.searchKind = parm;
				this.searchFn();
			},
			searchBegin() {
				if(event.keyCode == 13){
					this.selHandler();
				}
			},
			backFromFn() {
				this.$refs.search.blur();
				var lastInfo = {};
				try{
					lastInfo = JSON.parse(localStorage.getItem('channelSearchIndex'));
				} catch(e) {}
				for (var attr in lastInfo) {
					this[attr] = lastInfo[attr];
				}
				this.backSearchFn();
			},
			backSearchFn () {
				var that = this;
				this.resultSwitch = true;
				var url = '';
				if (this.searchKind == 0) {//达人
					url = '/KMS-MSERVER/mobileChannel/expertAndMaster/list?type=2';
					this.superPageNo = 0;
					this.superbottomAllLoaded = false;
					this.superList = [];
					url += '&orderType=' + this.orderActive;
					if (this.value != '') {
						url += '&title=' + this.value;
					}
					let url1 = url;
					this.temp = {};
					for(let i = 0;i <= this.superPageNo; i++){
						url = url1+'&startPage='+i;
						this.$http({
							method:'GET',
							url:this.$global().host+url
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
						);
					}
				} else { //频道
					url = '/KMS-MSERVER/mobileChannel/search/channelList?type=2';
					this.channelPageNo = 0;
					this.channelbottomAllLoaded = false;
					this.superList = [];
					url += '&cateId=0';
					if (this.value != '') {
						url += '&title=' + this.value;
					}
					let url1 = url;
					this.temp = {};
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
						);
					}
				}
			},
			selHandler() { 
				let that = this;
				if(this.value){
					this.resultSwitch = true;
					if (this.searchKind == 0) {
						this.orderActive = 0;
					}
					this.searchFn();
					//设置缓存
					this.setHistoryItems(this.value);
					//读取历史搜索
					this.getHistoryItems();
					this.$refs.search.blur();
				
				}
			},
			cancelHandler() {
				this.value='';
				this.$refs.search.focus();
			},
			setHistoryItems(keyword){
				keyword = keyword.trim();
				let historyItems = localStorage.getItem('channelHistoryItems') || [];
				if(!historyItems.length){
					historyItems.push(keyword);
					localStorage.setItem('channelHistoryItems',historyItems);
				}else{
					const onlyItem = localStorage.getItem('channelHistoryItems').split('|').filter(e=>e != keyword);
					if(onlyItem.length>0){
						historyItems = keyword + '|' + onlyItem.join('|');
						localStorage.setItem('channelHistoryItems',historyItems);
					}
				}
	 		},
	 		//读取历史搜索
	 		getHistoryItems(){
	 			if(!window.localStorage.getItem('channelHistoryItems')){
	 				return;
	 			}
	 			this.historyItems = window.localStorage.getItem('channelHistoryItems').split('|');
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
	 				
	 		},
			historyClickHandler() {//历史搜索点击
				this.resultSwitch = true;
				this.value = event.target.innerHTML;
				this.searchFn();
			},
			searchFn(isFocus) {
				var url = '';
				if (this.searchKind == 0) {//达人
					url = '/KMS-MSERVER/mobileChannel/expertAndMaster/list?type=2';
					this.superPageNo = 0;
					this.superbottomAllLoaded = false;
					setTimeout(() => {this.$refs.ctnWrapperSuper.scrollTop = 0;}, 50);
					this.superList = [];
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
					})
				} else { //频道
					url = '/KMS-MSERVER/mobileChannel/search/channelList?type=2';
					this.channelPageNo = 0;
					this.channelbottomAllLoaded = false;
					setTimeout(() => {this.$refs.ctnWrapperChannnel.scrollTop = 0;}, 50);
					this.channelListFocus = [];
					url += '&cateId=0';
					url += '&startPage=' + this.channelPageNo;
					if (this.value != '') {
						url += '&title=' + this.value;
					}
					this.channelListFocus = [];
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
			loadBottom() {
				var url = '';
				if (this.searchKind == 0) { //达人
					url = '/KMS-MSERVER/mobileChannel/expertAndMaster/list?type=2';
					this.superPageNo++;
					url += '&orderType=' + this.orderActive;
					if (this.value != '') {
						url += '&title=' + this.value;
					}
					url += '&startPage=' + this.superPageNo;
					this.getMoreData(url, 'superList', 'superTotalPage', 'superPageNo', 'superbottomAllLoaded');
				} else { //频道
					url = '/KMS-MSERVER/mobileChannel/search/channalList?type=2';
					this.channelPageNo++;
					url += '&cateId=0';
					if (this.value != '') {
						url += '&title=' + this.value;
					}
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
	 		//读取历史搜索
	 		getHistoryItems(){
	 			if(!window.localStorage.getItem('channelHistoryItems')){
	 				return;
	 			}
	 			this.historyItems = window.localStorage.getItem('channelHistoryItems').split('|');
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
				if(!this.value){
					//发起请求，读取历史搜索数据
					this.resultSwitch = false;
				}
			}
		}
	}
</script>
<style lang="less">
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
				width: 3.55rem;
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