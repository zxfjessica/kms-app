<template>
	<div>
		<div class="list-main" v-show="!superDetailVisiable && !channelDetailVisiable">
			<v-common-header></v-common-header>
			<div class="container expert-list-container">
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
											placeholder="搜索专家达人" 
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
								认证专家
							<span class="kind-active"></span>
						</div>
						<div class="kind-option" 
							:class="{'active': searchKind==1}"
							@click="changeKind(1)">
								认证达人
							<span class="kind-active"></span>
						</div>
					</div>
				</div>
				<div id="result_ctn" class="result-ctn">
					<div class="tab" v-if="searchKind==0">
						<div class="tab-bottom">			
							<a href="javascript:void(0)" :class="{active:!expertOrderActive}" @click="getList(0)"><span class="order-icon new"></span>按最新</a>
							<a href="javascript:void(0)" :class="{active:expertOrderActive}" @click="getList(1)"><span class="order-icon hot"></span>按最热</a>
						</div>
					</div>
					<div class="tab" v-if="searchKind==1">
						<div class="tab-bottom">			
							<a href="javascript:void(0)" :class="{active:!masterOrderActive}" @click="getList(0)"><span class="order-icon new"></span>按最新</a>
							<a href="javascript:void(0)" :class="{active:masterOrderActive}" @click="getList(1)"><span class="order-icon hot"></span>按最热</a>
						</div>
					</div>
					<section class="super-result" v-show="searchKind==0">
						<div class="ctn-wrapper" ref="ctnWrapperExpert" @scroll="wrapperScrollHandler">
							<ul class="super-list"
								v-infinite-scroll="loadBottom"
						 		infinite-scroll-disabled="expertAllLoaded"
						 		infinite-scroll-distance="10"
						 		infinite-scroll-immediate-check="false">
								<li v-for="item in expertList" @click="showSuperDetailHandler">
									<router-link :to="{ path: '/knowledge/channelDetailSuper',  'query': { empNumber: item.empNumber } }">
										<v-super-item :itemByP="item"></v-super-item>
									</router-link>
								</li>
							</ul>
							<p class="loadtips"
								v-show="!expertAllLoaded">加载中……</p>
							<p class="loadtips"
								v-show="expertAllLoaded">没有更多数据了！</p>
						</div>
					</section>
					<section class="super-result" v-show="searchKind==1">
						<div class="ctn-wrapper" ref="ctnWrapperMaster" @scroll="wrapperScrollHandler">
							<ul class="super-list"
								v-infinite-scroll="loadBottom"
						 		infinite-scroll-disabled="masterAllLoaded"
						 		infinite-scroll-distance="10"
						 		infinite-scroll-immediate-check="false">
								<li v-for="item in masterList" @click="showSuperDetailHandler">
									<router-link :to="{ path: '/knowledge/channelDetailSuper',  'query': { empNumber: item.empNumber } }">
										<v-super-item :itemByP="item"></v-super-item>
									</router-link>
								</li>
							</ul>
							<p class="loadtips"
								v-show="!masterAllLoaded">加载中……</p>
							<p class="loadtips"
								v-show="masterAllLoaded">没有更多数据了！</p>
						</div>
					</section>
				</div>
			</div>
		</div>
		<div class="super-detail" v-if="superDetailVisiable">
			<v-channel-detail-super @closeSuperControl="superDetailVisiable=false">
			</v-channel-detail-super>
		</div>
	</div>
</template>
<script>
	import commonHeader from '../../components/commonHeader.vue';
	import superItem from '../../components/channelList/superItem.vue';
	import channelItem from '../../components/channelList/channelItem.vue';
	import channelDetailSuper from './channelDetailSuper.vue';
	import { getEmpNumber } from '../../js/commonFunction.js';
	export default {
		data() {
			return {
				searchKind: 0,//0：认证专家，1:认证达人
				expertOrderActive: 0,//0：最热、1：最新
				masterOrderActive: 0,//0：最热、1：最新
				value: '',
				superDetailVisiable: false,//专家达人详情页显示开关
				expertList: [],
				expertPageNo: 0,
				expertTotalPage: 0,
				expertAllLoaded: false,
				expertScrollTop: 0,
				masterList: [],
				masterPageNo: 0,
				masterTotalPage: 0,
				masterAllLoaded: false,
				masterScrollTop: 0,
				value: ''
			}
		},
		components: {
			'v-common-header': commonHeader,
			'v-super-item': superItem,
			'v-channel-item': channelItem,
			'v-channel-detail-super': channelDetailSuper
		},
		beforeRouteEnter(to, from, next) {
			next(
				vm => {
					if (from.path.match('channelDetailSuper') || from.path.match('consultationDetail') || from.path.match('channelDetailBlog') || from.path.match('meetOnlineConsult')) {
						vm.backFromFn();
					} else {
						vm.backFromOtherFn();
					}
					getEmpNumber(vm);
				}
			);
		},
		beforeDestroy() {
			let data = {};
			data['searchKind'] = this.searchKind;
			data['expertOrderActive'] = this.expertOrderActive;
			data['expertPageNo'] = this.expertPageNo;
			data['expertTotalPage'] = this.expertTotalPage;
			data['expertScrollTop'] = this.expertScrollTop;
			data['masterOrderActive'] = this.masterOrderActive;
			data['masterPageNo'] = this.masterPageNo;
			data['masterTotalPage'] = this.masterTotalPage;
			data['masterScrollTop'] = this.masterScrollTop;
			if (this.value != '') {
				data['value'] = this.value;
			}
			try {
				localStorage.setItem('expertList',JSON.stringify(data));
			}catch (e) {}
		},
		methods: {
			wrapperScrollHandler() {
				if (this.searchKind == 0) {
					this.expertScrollTop = this.$refs.ctnWrapperExpert.scrollTop;
				} else {
					this.masterScrollTop = this.$refs.ctnWrapperMaster.scrollTop;
				}
			},
			getList(parm) {
				if (this.searchKind == 0) {//专家
					this.expertOrderActive = parm;
					this.$refs.ctnWrapperExpert.scrollTop = 0;
				} else {//达人
					this.masterOrderActive = parm;
					this.$refs.ctnWrapperMaster.scrollTop = 0;
				}
				setTimeout(() => {this.searchFn();}, 50);
			},
			backFromOtherFn() {
				this.searchFn();
			},
			backFromFn() {
				var lastInfo = {};
				try {
					lastInfo = JSON.parse(localStorage.getItem('expertList'));
				} catch (e) {}
				for (var attr in lastInfo) {
					if (attr == 'expertScrollTop') {
						this.$refs.ctnWrapperExpert.scrollTop = lastInfo[attr];
					}
					if (attr == 'masterScrollTop') {
						this.$refs.ctnWrapperMaster.scrollTop = lastInfo[attr];
					}
					this[attr] = lastInfo[attr];
				}
				this.backSearchFn();
			},
			backSearchFn() {
				var that = this;
				this.expertAllLoaded = false;
				this.masterAllLoaded = false;
				var url = '/KMS-MSERVER/mobileChannel/expertAndMaster/list?type=3';
				url += '&cateId=0';
				if (this.value != '') {
					url += '&title=' + this.value;
				}
				url += '&userType=0';
				url += '&orderType=' + this.expertOrderActive;
				let url1 = url;
				this.temp = {};
				/*限制条件*/
				for(let i = 0;i <= this.expertPageNo; i++){
					url = url1+'&startPage='+i;
					this.$http({
						method:'GET',
						url:this.$global().host+url
					}).then(
						response => {
							if(response.status==200&&response.body.status){
								if(response.body.data){
									this.temp[i] = response.body.data;
									if(Object.getOwnPropertyNames(this.temp).length == (this.expertPageNo+1)){
										for(let attr in this.temp){
											this['expertList'] = this['expertList'].concat(this.temp[attr]);
										}
										setTimeout(function(){
											that.$refs.ctnWrapperExpert.scrollTop = that.expertScrollTop;
										},10);
									}
									if (this.expertPageNo >= this.expertTotalPage) {
										this.expertAllLoaded = true;
									}
								}else{
									this['expertList'] = 0;
								}
								
							}	
						}
					)
				}
				var url2 = '/KMS-MSERVER/mobileChannel/expertAndMaster/list?type=3';
				url2 += '&cateId=0';
				if (this.value != '') {
					url2 += '&title=' + this.value;
				}
				url2 += '&userType=1';
				url2 += '&orderType=' + this.masterOrderActive;
				let url3 = url2;
				this.temp1 = {};
				/*限制条件*/
				for(let i = 0;i <= this.masterPageNo; i++){
					url2 = url3+'&startPage='+i;
					this.$http({
						method:'GET',
						url:this.$global().host+url2
					}).then(
						response => {
							if(response.status==200&&response.body.status){
								if(response.body.data){
									this.temp1[i] = response.body.data;
									if(Object.getOwnPropertyNames(this.temp1).length == (this.masterPageNo+1)){
										for(let attr in this.temp1){
											this['masterList'] = this['masterList'].concat(this.temp1[attr]);
										}
										setTimeout(function(){
											that.$refs.ctnWrapperMaster&&(that.$refs.ctnWrapperMaster.scrollTop = that.masterScrollTop);
										},10);
									}
									if (this.masterPageNo >= this.masterTotalPage) {
										this.masterAllLoaded = true;
									}
								}else{
									this['masterList'] = 0;
								}
								
							}	
						}
					)
				}
				this.$refs.search.blur();
			},
			subscribeTipHandler() {
				this.subscribeTipVisible = true;
			},
			changeKind(parm) {
				this.searchKind = parm;
				this.searchFn();
			},
			showSuperDetailHandler() { //显示达人详情
				this.superDetailVisiable = true;
			},
			showChannelDetailHandler() { //显示频道详情
				this.channelDetailVisiable = true;
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
				var url = '/KMS-MSERVER/mobileChannel/expertAndMaster/list?type=3';
				if (this.searchKind == 0) { //专家
					this.expertPageNo++;
					url += '&orderType=' + this.expertOrderActive;
					url = this.urlLimit(url, 'expertPageNo');
					this.getMoreData(url, 'expertList', 'expertTotalPage', 'expertPageNo', 'expertAllLoaded');
				} else { //达人
					this.masterPageNo++;
					url += this.masterOrderActive;
					url += '&orderType=' + this.masterOrderActive;
					url = this.urlLimit(url, 'masterPageNo');
					this.getMoreData(url, 'masterList', 'masterTotalPage', 'masterPageNo', 'masterAllLoaded');
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
				var that = this;
				var url = '';
				if (this.searchKind == 0) {//专家
					url = '/KMS-MSERVER/mobileChannel/expertAndMaster/list?type=3';
					this.expertPageNo = 0;
					this.expertAllLoaded = false;
					setTimeout(() => {this.$refs.ctnWrapperExpert.scrollTop = 0;}, 50);
					this.expertList = [];
					url += '&orderType=' + this.expertOrderActive;
					url = that.urlLimit(url, 'expertPageNo');
					that.getData(url,'expertList','GET',{},function(parm){
						parm.$nextTick(() => {
							parm.expertTotalPage = parm.totalPage;
							if (parm.expertPageNo >= parm.expertTotalPage) {
								parm.expertAllLoaded = true;
							} else {
								parm.expertAllLoaded = false;
							}
						});
					});
				} else { //达人
					url = '/KMS-MSERVER/mobileChannel/expertAndMaster/list?type=3';
					this.masterPageNo = 0;
					this.masterAllLoaded = false;
					setTimeout(() => {this.$refs.ctnWrapperMaster.scrollTop = 0;}, 50);
					this.masterList = [];
					url += '&orderType=' + this.masterOrderActive;
					url = this.urlLimit(url, 'masterPageNo');
					this.getData(url,'masterList','GET',{},function(parm){
						parm.$nextTick(() => {
							parm.masterTotalPage = parm.totalPage;
							if (parm.masterPageNo >= parm.masterTotalPage) {
								parm.masterAllLoaded = true;
							} else {
								parm.masterAllLoaded = false;
							}
						});
					});
				}
				if (! isFocus) {
					this.$refs.search.blur();
				}
			},
			urlLimit(url, pageNo, noStartPage) {
				url += '&cateId=0';
				if (this.value != '') {
					url += '&title=' + this.value;
				}
				url += '&userType=' + this.searchKind;
				if (!noStartPage) {
					url += '&startPage=' + this[pageNo];
				}
				return url;
			}
		},
		watch:{
			value() {
				if(document.activeElement.id == 'search'){
					if(this.value == ''){
						if (this.searchKind == 0) {//专家
							this.expertPageNo = 0;
							this.expertAllLoaded = false;
						} else {
							this.masterPageNo = 0;
							this.masterAllLoaded = false;
						}
						this.searchFn(true);
					}
				}
			}
		}
	}
</script>
<style lang="less">
	//部分样式位于达人频道列表页
</style>