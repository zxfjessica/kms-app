<template>
	<div class="channel-manage-wrapper">
		<v-common-header>
			<mt-button slot="rightContent" class="open-btn">
			 	<router-link to="/knowledge/channelApply" class="open-link"><span>+</span>开通频道</router-link>
			</mt-button>
		</v-common-header>
		<div class="container ma-channel-container">
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
									placeholder="搜索感兴趣的频道" 
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
					:class="{'active': searchKind==1}"
					@click="changeKind(1)">
						已订阅
					<span class="kind-active"></span>
				</div>
				<div class="kind-option" 
					:class="{'active': searchKind==0}"
					@click="changeKind(0)">
						未订阅
					<span class="kind-active"></span>
				</div>
			</div>
			<section>
				<div class="ctn-wrapper" ref="ctnWrapper" @scroll="wrapperScrollHandler">
					<ul class="channel-list"
						v-infinite-scroll="loadBottom"
				 		infinite-scroll-disabled="bottomAllLoaded"
				 		infinite-scroll-distance="10"
				 		infinite-scroll-immediate-check="false">
						<li v-for="channelItem in channelList" :class="{'is-manager': searchKind==0 && channelItem.isManager}">
							<router-link :to="{'path': '/knowledge/channelDetailChannel', 'query': {id: channelItem.id}}">
								<v-channel-item :kind="'channel'"
												:itemByP="channelItem"
												@subscribeTip="subscribeTipHandler"
												@operItemCallbackController="operItemCallback">
								</v-channel-item>
							</router-link>
						</li>
					</ul>
					<p class="loadtips"
						v-show="!bottomAllLoaded || !contentLoaded">加载中……</p>
					<p class="loadtips"
						v-show="bottomAllLoaded && contentLoaded">没有更多数据了！</p>
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
</template>
<script>
	import commonHeader from '../../components/commonHeader.vue';
	import channelItem from '../../components/channelList/channelItem.vue';
	import subscribeTip from '../../components/channelList/subscribeTip.vue';
	import { Toast } from 'mint-ui';
	import { getEmpNumber } from '../../js/commonFunction.js';
	export default {
			data() {
				return {
					value: '',
					searchKind: 0,//0:未订阅，1:已订阅
					channelListFocus: [],//已订阅
					pageNoFocus: 0,
					totalPageFocus: 0,
					bottomAllLoadedFocus: false,
					channelList: [],//未订阅
					pageNo: 0,
					totalPage: 0,
					bottomAllLoaded: false,
					scrollTop: 0,
					subscribeTipVisible: false,//订阅提示
					integral: -1,//订阅、未订阅弹出框的积分显示
					popUpChannelId: -1, //订阅、未订阅弹出框的id显示
					channelIsFocus: false, //该分类是否感兴趣
					contentLoaded: false,
					myScore: 0,//剩余积分
					empNumber: ''
				}
			},
			components: {
				'v-common-header': commonHeader,
				'v-channel-item': channelItem,
				'v-subscribe-tip': subscribeTip
			},
			beforeRouteEnter(to, from, next) {
				next(
					vm => {
						if (from.path.match('channelDetailChannel') || from.path.match('channelDetailBlog')
								|| from.path.match('meetOnlineConsult')) {
							vm.backFromFn();
						} else {
							vm.backFromOther();
						}
					}
				);
			},
			beforeDestroy() {
				var data = {};
				data['searchKind'] = this.searchKind;
				data['pageNo'] = this.pageNo;
				data['totalPage'] = this.totalPage;
				data['scrollTop'] = this.scrollTop;
				if (this.value != '') {
					data['value'] = this.value;
				}
				try {
					localStorage.setItem('channelManage', JSON.stringify(data));
				} catch(e) {}
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
				
			},
			methods: {
				wrapperScrollHandler() {
					this.scrollTop = this.$refs.ctnWrapper.scrollTop;
				},
				changeKind(parm) {
					var url = '';
					this.searchKind = parm;
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
				backFromOther () {
					var url = '/KMS-MSERVER/mobileChannel/search/channelList?type=3';
					url += '&isFocus=' + this.searchKind;
					this.getData(url,'channelList','GET',{},function(parm){
						parm.totalPage = parm.totalPage;
						if (parm.pageNo >= parm.totalPage) {
							parm.bottomAllLoaded = true;
						} else {
							parm.bottomAllLoaded = false;
						}
						parm.contentLoaded = true;
					});
				},
				backFromFn() {
					var lastInfo = {};
					try{
						lastInfo = JSON.parse(localStorage.getItem('channelManage'));
					}catch(e){}
					for (var attr in lastInfo) {
						this[attr] = lastInfo[attr];
					}
					this.backSearchFn();
				},
				backSearchFn() {
					var that = this;
					//频道
					this.bottomAllLoaded = false;
					var url = '/KMS-MSERVER/mobileChannel/search/channelList?type=3';
					url = this.urlLimit(url, 'pageNo', true);
					if (this.value != '') {
						url += '&title=' + this.value;
					}
					let url1 = url;
					this.temp = {};
					/*限制条件*/
					for(let i = 0;i <= this.pageNo; i++){
						url = url1+'&startPage='+i;
						this.$http({
							method:'GET',
							url:this.$global().host+url
						}).then(
							response => {
								if(response.status==200&&response.body.status){
									if(response.body.data){
										this.temp[i] = response.body.data;
										if(Object.getOwnPropertyNames(this.temp).length == (this.pageNo+1)){
											for(let attr in this.temp){
												this['channelList'] = this['channelList'].concat(this.temp[attr]);
											}
											setTimeout(function(){
												that.$refs.ctnWrapper.scrollTop = that.scrollTop;
											},10);
											this.contentLoaded = true;
										}
										if (this.pageNo >= this.totalPage) {
											this.bottomAllLoaded = true;
										}
									}else{
										this['channelList'] = 0;
									}
									
								}	
							}
						)
					}
				},
				searchFn(isFocus) {
					var url = '/KMS-MSERVER/mobileChannel/search/channelList?type=3';
					this.pageNo = 0;	
					this.$refs.ctnWrapper.scrollTop = 0;
					this.channelList = [];
					url = this.urlLimit(url,'pageNo');
					if (this.value != '') {
						url += '&title=' + this.value;
					}
					this.channelList = [];
					this.contentLoaded = false;
					this.getData(url,'channelList','GET',{},function(parm){
						parm.totalPage = parm.totalPage;
						if (parm.pageNo >= parm.totalPage) {
							parm.bottomAllLoaded = true;
						} else {
							parm.bottomAllLoaded = false;
						}
						parm.contentLoaded = true;
					});
					if (! isFocus) {
						this.$refs.search.blur();
					}
				},
				loadBottom() {
					var url = '/KMS-MSERVER/mobileChannel/search/channelList?type=3';
					this.pageNo++;
					url = this.urlLimit(url, 'pageNo');
					this.getMoreData(url, 'channelList', 'totalPage', 'pageNo', 'bottomAllLoaded');
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
				urlLimit(url, pageName, noStartPage) {
					url += '&isFocus=' + this.searchKind;
					if (!noStartPage) {
						url += '&startPage=' + this[pageName];
					}	
					return url;
				},
				operItemCallback(parm) {//订阅置顶之后的回调
					if (parm == 'first') { //置顶回调
						this.searchFn();
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
	.channel-manage-wrapper{
		.open-btn {
			&.mint-button {
				font-family: Microsoft YaHei, Arial;
				width: 100%!important;
				text-align: right;
				overflow: visible;
				label {
					position: relative;
				}
				.open-link {
					color: #fff;
					span {
						font-size: 1.4em;
						position: absolute;
						left: -19px;
						top: 0;
						line-height: 20px;
					}
				}
			}
		}
		.ma-channel-container {
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
			.ctn-wrapper {
				height: calc(~"100vh - 2.34rem - 48px");
				overflow-y: scroll;
				background-color: #fff;
				position: relative;
				top: 1px;
				.channel-list {
					li {
						padding: 0.4rem 0;
						padding-right: 4%;
						margin-left: 4%;
						border-bottom: 1px solid #eee;
						padding-bottom: 1rem;
						&.is-manager {
							//background-color: #000;
							padding: 0.2rem 0;
							padding-right: 4%;
						}
					}
					margin-bottom: 1rem;
				}
				.loadtips {
					position: relative;
					top: -0.5rem;
				}
			}
		}
	}
</style>
