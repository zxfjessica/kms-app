<template>
	<div>
		<div class="channel-detail-main" 
			v-show="!newBlogVisiable && !newTopicDiscussionVisiable && !newAudioVisiable">
			<mt-header title="频道详情" class="is-fixed">
				<div slot="left">
				    <mt-button icon="back" @click="channelCloseHandler"></mt-button>
				</div>
				<div slot="right" class="header-right-btn">
				    <mt-button class="menu-btn" @click="showChannelMenuHandler" v-if="channelInfo.isFocus"></mt-button>
				    <div class="channel-menu" v-show="menuVisiable">
				    	<ul class="menu-list">
				    		<!-- <li @click="setIndexHandler(!channelInfo.isMainPage)">{{channelInfo.isMainPage?'取消主页':'设为主页'}}</li> -->
				    		<li v-if="!channelInfo.isManager && channelInfo.isFocus"
				    			@click="focusHandler($route.query.id || channelIdByP)">
				    			取消订阅</li>
				    		<li @click="newBlogVisiable = true, menuVisiable = false, blogType = 'blog'">发博客</li>
				    		<li @click="newBlogVisiable = true, menuVisiable = false, blogType = 'theme'">主题讨论</li>
				    		<!-- <li>视频</li>
				    		<li>语音</li> @click="newAudioHandler" -->
				    	</ul>
				    </div>
				</div>
			</mt-header>
			<div class="channel-detail-content container" @click="noControl = false" ><!-- v-show="loading >= 2" -->
				<p class="loadtips"
					v-show="loading<2">加载中……</p>
				<div class="home" @click.stop="backHome" v-if="channelIdByP>-1 && loading >= 2">
					<img src="../../../static/img/back_home.png" alt="">
				</div>
				<div class="content-top" v-show="loading >= 2">
					<div class="bg-wrapper">
						<img class="bg-pic" :src="imageBefore" alt="">
						<div class="bg-mask"></div>
					</div>
					<img class="portrait-img" :src="imageBefore" alt="">
					<div class="top-info">
						<h4 class="info-title">{{channelInfo.name || '未知'}}</h4>
						<p class="info-intro control" @click.stop.prevent="noControl = true">{{channelInfo.description || '未知'}}</p><!--  -->
						 <transition name="fade">
							<p class="info-intro no-control" v-if="noControl">{{channelInfo.description || '未知'}}</p><!--  -->
						</transition>
						<div class="other-info-wrapper" ref="otherInfoWrapper" style="height:0.48rem">
							<p class="other-info" :class="{'overflow-block': overFlow}" ref="otherInfo">
								<span>管理员：<i>{{channelInfo.managerName || '未知'}}</i></span>
								<b>&nbsp;|&nbsp;</b>
								<span>订阅量：<i>{{channelInfo.focusCount || 0}}</i></span>
								<b>&nbsp;|&nbsp;</b>
								<span>浏览：<i>{{channelInfo.readCount || 0}}</i></span>
								<!-- 管理员：唐小仙&nbsp;|&nbsp;订阅量：3622&nbsp;|&nbsp;浏览：36222222 -->
							</p>
						</div>
						<span class="cancel-btn" v-if="channelInfo.isFocus"
							@click="setIndexHandler(!channelInfo.isMainPage)">
							{{channelInfo.isMainPage?'取消主页':'设为主页'}}
						</span>
					</div>
				</div>
				<div class="no-focus-box" v-show="!channelInfo.isFocus && loading >= 2">
					<img src="../../../static/img/refuse.png">
					<p style="margin-bottom:0.2rem">未订阅该频道，暂不可查看该频道内容</p>
					<p v-if="channelInfo.score>0">订阅该频道需要<i>{{channelInfo.score}}</i>积分</p>
					<span @click="focusHandler({channelId: $route.query.id || channelIdByP, score: channelInfo.score || 0})">立即订阅</span>
				</div>
				<div class="search-block" v-show="channelInfo.isFocus && loading >= 2">
					<form action="javascript: return true">
						<input  id="search"
								class="search-input" 
								type="search" 
								placeholder="搜索频道内容"
								@keypress="searchBegin"
								v-model="value"
								ref="search">
					</form>
				</div>
				<div class="content-list-wrapper"  v-show="channelInfo.isFocus && loading >= 2" 
					ref="contentListWrapper" :class="{'index': channelIdByP>-1}" @scroll="scrollHandler"><!-- :class="{'index': channelIdByP>-1}" -->
					<ul class="channel-list"
						v-infinite-scroll="loadBottom"
				 		infinite-scroll-disabled="bottomAllLoaded"
				 		infinite-scroll-distance="10"
				 		infinite-scroll-immediate-check="false">
						<li v-for="item in channelItem">
							<router-link :to="{ 'path': '/knowledge/channelDetailBlog', 'query': { id: String(item.contentId), type: item.contentType} }">
								<v-channel-detail-item :item="item"></v-channel-detail-item>
							</router-link>
						</li>
					</ul>
					<p class="loadtips"
						v-show="!bottomAllLoaded">加载中……</p>
					<p class="loadtips"
						v-show="bottomAllLoaded">没有更多数据了！</p>
				</div>
				<v-common-footer :active="2" v-if="channelIdByP>-1 && !newBlogVisiable"></v-common-footer>
			</div>
		</div>
		<!-- 订阅提示 -->
		<v-subscribe-tip :subscribeTipVisibleByP="subscribeTipVisible" 
			@subscribeTipSureControl="subscribeTipSureHandler"
			@visibleControl="tipVisibleHandler"
			:integral="integral"
			:channelId = "popUpChannelId">
		</v-subscribe-tip>
		<!-- 发表博客模块 -->
		<v-new-blog v-if="newBlogVisiable"
					:id="String(channelIdByP)"
					:empNumber="empNumber"
					:type="blogType"
					@newBlogCancelControl="newBlogVisiable=false"></v-new-blog>
	</div>
</template>
<script>
	import channelDetailItem from '../../components/channelListDetail/channelDetailItem.vue';
	import newBlog from './newBlog.vue';
	import newTopicDiscussion from './newTopicDiscussion.vue';
	import newAudio from './newAudio.vue';
	import { Toast } from 'mint-ui';
	import { getEmpNumber } from '../../js/commonFunction.js';
	import subscribeTip from '../../components/channelList/subscribeTip.vue';
	import commonFooter from '../../components/commonFooter.vue';
	export default {
		data() {
			return {
				noControl: false,
				menuVisiable: false,
				newBlogVisiable: false,//写博客页面
				newTopicDiscussionVisiable: false,//主题评论页面
				newAudioVisiable: false,//语音页面
				newRoute: false,//是否 以新路由方式打开
				channelInfo: {},
				channelItem: [],
				overFlow: false,
				pageNo: 0,
				totalPage: 0,
				bottomAllLoaded: false,
				value: '',
				channelId: -1,
				blogType: '',
				empNumber: '002628',
				loading: 0,
				scrollTop: 0,
				myScore: 0,//剩余积分
				subscribeTipVisible: false,//订阅提示
				integral: -1,//订阅、未订阅弹出框的积分显示
				popUpChannelId: -1 //订阅、未订阅弹出框的id显示
			}
		},
		props: {
			channelIdByP: {
				type: Number,
				default: -1
			}
		},
		components: {
			'v-channel-detail-item': channelDetailItem,
			'v-new-blog': newBlog,
			'v-topic-discussion': newTopicDiscussion,
			'v-audio': newAudio,
			'v-subscribe-tip': subscribeTip,
			'v-common-footer': commonFooter,
		},
		computed: {
			imageBefore() {
				return !this.channelInfo.headImage?'static/img/user-default.png': this.$global().imgHost + this.channelInfo.headImage;
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				getEmpNumber(vm);
				if (from.path.match('/knowledge/index')) {
					vm.newRoute = true;
				}
				if (from.path.match('/consultationDetail') || from.path.match('/channelDetailBlog')) {
					vm.backFromFn();
				} else {
					vm.backFromOtherFn();
				}
			});
		},
		beforeDestroy() {
			let data = {};
			data['pageNo'] = this.pageNo;
			data['totalPage'] = 0;
			data['scrollTop'] = this.scrollTop;
			data['bottomAllLoaded'] = this.bottomAllLoaded;
			try{
				localStorage.setItem('channelDetailChannel', JSON.stringify(data));
			}catch(e){}
		},
		mounted() {
			if (this.$route.query.id) {
				this.channelId = this.$route.query.id;
			} else {//主页
				this.channelId = this.channelIdByP;
				getEmpNumber(this);
				this.backFromOtherFn();
			}
			this.$nextTick(() => {
					this.getBaseTopData();
				}
			);
			//获取剩余积分
			this.getData('/KMS-MSERVER/learning/person/main?empNumber=' + this.empNumber, 'myScore', 'GET', {}, parm => {
				parm.$nextTick(
					() => {
						parm.myScore = parm.myScore.score;
					}
				);
			});
		},
		methods: {
			channelCloseHandler() {
				this.$router.go(-1);
			},
			backHome() {
				this.$router.push({ 'path': '/knowledge/index', 'query': { 'toIndex': true } });
			},
			scrollHandler() {
				this.scrollTop = event.currentTarget.scrollTop;
			},
			getBaseTopData() {
				var url = '/KMS-MSERVER/mobileChannel/channelInit?channelId=';
				if (this.$route.query.id) {
					//频道顶部信息
					url += this.$route.query.id;
				} else {//主页
					//频道顶部信息
					url += this.channelIdByP;
				}
				this.getData(url, 'channelInfo', 'GET', {}, function(parm) {
						if (parm.$refs.otherInfo.clientHeight > parm.$refs.otherInfoWrapper.clientHeight) {
							parm.overFlow = true;
						}
						parm.loading++;
					}
				);
			},
			getBaseContentData() {
				var url = '/KMS-MSERVER/mobileChannel/search/channelContentList?type=2';
				if (this.$route.query.id) {
					// 频道内容
					url += '&channelId=' + this.$route.query.id;
				} else {//主页
					// 频道内容
					url += '&channelId=' + this.channelIdByP;
				}
				this.getData(url,'channelItem','GET',{},function(parm){
					if (parm.pageNo >= parm.totalPage) {
						parm.bottomAllLoaded = true;
					} else {
						parm.bottomAllLoaded = false;
					}
					parm.loading++;
				});
			},
			showChannelMenuHandler() {//显示菜单事件
				this.menuVisiable = !this.menuVisiable;
			},
			backFromFn() {
				var lastInfo = {};
				var that = this;
				try{
					lastInfo = JSON.parse(localStorage.getItem('channelDetailChannel'));
				} catch(e) {}
				for (var attr in lastInfo) {
					this[attr] = lastInfo[attr];
				}
				
				this.bottomAllLoaded = false;
				var url = '/KMS-MSERVER/mobileChannel/search/channelContentList?type=2';
				if (this.$route.query.id) {
					// 频道内容
					url += '&channelId=' + this.$route.query.id;
				} else {//主页
					// 频道内容
					url += '&channelId=' + this.channelIdByP;
				}
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
											this['channelItem'] = this['channelItem'].concat(this.temp[attr]);
										}
										setTimeout(function(){
											that.$refs.contentListWrapper.scrollTop = that.scrollTop;
											that.loading++;
										},100);
									}
									if (this.pageNo == this.totalPage) {
										this.bottomAllLoaded = true;
									}
								}else{
									this['channelItem'] = 0;
								}
								
							}	
						}
					)
				}
			},
			backFromOtherFn() {
				this.getBaseContentData();
			},
			searchBegin() {
				if(event.keyCode == 13){
					this.selHandler();
				}
			},
			selHandler() {
				this.searchFn();
			},
			searchFn(isFocus) {
				// 频道内容
				var url = '/KMS-MSERVER/mobileChannel/search/channelContentList?type=2';
				this.pageNo = 0;
				url = this.urlLimit(url);
				this.getData(url,'channelItem','GET',{},function(parm){
					if (parm.pageNo >= parm.totalPage) {
						parm.bottomAllLoaded = true;
					} else {
						parm.bottomAllLoaded = false;
					}
				});
				if (! isFocus) {
					this.$refs.search.blur();
				}
			},
			loadBottom() {
				// 频道内容
				var url = '/KMS-MSERVER/mobileChannel/search/channelContentList?type=2';
				this.pageNo++;
				url = this.urlLimit(url);
				this.getMoreData(url, 'channelItem', 'totalPage', 'pageNo', 'bottomAllLoaded');
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
			urlLimit(url) {
				if (this.$route.query.id) {
					//频道顶部信息
					url += '&channelId=' + this.$route.query.id;
				} else {//主页
					//频道顶部信息
					url += '&channelId=' + this.channelIdByP;
				}
				if (this.value != '') {
					url += '&title=' + this.value;
				}
				url += '&startPage=' + this.pageNo;
				return url;
			},
			focusHandler(parm) {//订阅、取消订阅按钮
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
				this.menuVisiable = false;
			},
			setIndexHandler(isIndex) {//设置主页
				var info = 'channelId=' + this.channelId;
				info += '&type=2';
				if (isIndex) {//设置主页
					info += '&status=1';
				} else {//取消主页
					info += '&status=2';
				}
				this.$http.post(this.$global().host + '/KMS-MSERVER/mobileChannel/updateUserChannel', info).then(
					response => {
						if(response.status==200&&response.body.status){
							Toast({message: response.body.data.result, duration: 1000});
							this.getBaseTopData();
							if (this.channelIdByP>-1 && !isIndex) {//取消主页
								//this.$router.go(0);
							}
						}	
					}
				)
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
			subscribeTipSureHandler(channelId) {//频道列表确定使用积分订阅
				this.getData('/KMS-MSERVER/mobileChannel/channelInit?channelId=' + channelId, 
					'channelInfo', 'GET');
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
								that.getData('/KMS-MSERVER/mobileChannel/channelInit?channelId=' + that.channelId, 
									'channelInfo', 'GET');
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
	.channel-detail-main {
		input[type="search"]{-webkit-appearance:none;} 
		input::-webkit-search-cancel-button {display: none;}
		.header-right-btn {
			position: relative;
			.menu-btn {
				width: 26px;
				height: 26px;
				display: block;
				float: right;
				background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
				background-size: 178%;
				.bgPosition(@signs4Width, @signs4Height, 37, 39, 0, 662);
			}
			.channel-menu {
				position: absolute;
				top: 46px;
				right: 0%;
				// width: 124%;
				padding: 5% 0.37rem;
				color: #fff;
				background: #484848;
				border-radius: 5px;
				z-index: 10;
				li {
					padding: 0.32rem 0.47rem; 
					border-bottom: 1px solid rgba(225, 225, 225, 0.5);
					font-size: 0.37rem;
					line-height: 1.5em;
					text-align: left;
					&:last-child {
						border-bottom: none;
					}
				}
				&:before {
					content: "";
					position: absolute;
					right: 10%;
					top: -0.2rem;
					margin-bottom: -1px;
					border-bottom: 0.2rem solid #484848;
					border-left: 0.2rem solid transparent;
					border-right: 0.2rem solid transparent;
				}
			}
		}
		.channel-detail-content {
			position: relative;
			.home {
				width: 1rem;
				height: 1rem;
				position: absolute;
				bottom: 2rem; 
				right: 0.3rem;
				border-radius: 50%;
				z-index: 100;
				img {
					width: 100%;
					height: 100%;
				}
			}
			.content-top {
				padding: 0.5rem 3%;
				font-size: 0;
				position: relative;
				//z-index: 1000;
				.bg-wrapper {
					position: absolute;
					left: 0;
					top: 0;
					z-index: -1;
					overflow: hidden;
					width: 100%;
					height: 100%;
					.bg-pic {
						width: 100%;
						.blur(10px);
						position: absolute;
						left: 0;
						bottom: 0;
						z-index: -1;
					}
					.bg-mask {
						position: absolute;
						left: 0;
						top: 0;
						z-index: -1;
						width: 100%;
						height: 100%;
						background-color: rgba(0, 0, 0, 0.5);
					}
				}
				.portrait-img, .top-info {
					position: relative;
				}
				.portrait-img {
					width: 1.76rem;
					height: 1.76rem;
					display: inline-block;
					vertical-align: top;
				}
				.top-info {
					display: inline-block;
					color: #fff;
					width: calc(~"96% - 1.76rem");
					margin-left: 4%;
					position: relative;
					.info-title {
						width: 73%;
						font-size: 0.42rem;
						line-height: 0.63rem;
						position: relative;
						top: -0.04rem;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.info-intro {
						font-size: 0.37rem;
						line-height: 0.55rem;
						text-align: justify;
						&.control{
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						&.no-control{
							position: absolute;
						    top: .63rem;
						    background-color: #7B7B7B;
						    z-index: 1000;
						}
					}
					.other-info {
						font-size: 0;
						margin-top: 0.1rem;
						position: relative;
						top: 0.08rem;
						span {
							display: inline-block;
							vertical-align: baseline;
							font-size: 0.32rem;
							line-height: 0.48rem;
							white-space: nowrap;
							i, b {
								font-weight: normal;
								font-size: 0.32rem;
								line-height: 0.48rem;
								display: inline-block;
								white-space: nowrap;
							}
						}
						b {
							font-weight: normal;
							font-size: 0.32rem;
							line-height: 0.48rem;
						}
						&.overflow-block {
							span {
								width: 18.33%;
								border-right: 1px solid #fff;
								padding: 0 0.2rem;
								i {
									display: block;
									white-space: nowrap;
									overflow: hidden;
									text-overflow: ellipsis;
								}
								&:last-child {
									border-right: none;
									padding-left: 0.2rem;
									padding-right: 0rem;
								}
								&:first-child {
									padding-right: 0.2rem;
									padding-left: 0rem;
								}
							}
							b {
								display: none;
							}
						}
					}
					.cancel-btn {
						width: 1.62rem;
						height: 0.56rem;
						position: absolute;
						right: 0;
						top: -0.045rem;
						font-size: 0.32rem;
						line-height: 0.56rem;
						text-align: center;
						color: #fff;
						border: 1px solid #fff;
						border-radius: 3px;
					}
				}
			}
			.search-block {
				padding: 0.2rem 0;
				.search-input {
					.appearance-clear;
					border: 1px solid #eee;
					border-radius: 5px;
					width: 96%;
					margin: 0 2%;
					padding: 2%;
				}
			}
			.no-focus-box{
				text-align: center;
				img{
					display: block;
					margin: 2rem auto .5rem;
					width: 2.5rem;
					height: 2.5rem;
				}
				p{
					margin-bottom: 1rem;
					color: #999;
					font-size: .38rem;
					i {
						color: #ff4141;
					}
				}
				span{
					display: inline-block;
					line-height: 1rem;
					width: 3rem;
					text-align: center;
					color: #fff;
					background-color: #ff4141;
					font-size: .35rem;
				}
			}
			.content-list-wrapper {
				height: calc(~"100vh - 4rem - 46px");
				overflow-y: scroll;
				&.index {
					//height: calc(~"100vh - 5.5rem - 46px");
					.channel-list {
						margin-bottom: calc(~"1rem + 46px");
					}
					.loadtips {
						top: calc(~"-0.5rem - 46px");
					}
				}
				.channel-list {
					background-color: #fff;
					li {
						padding: 0.53rem 0;
						margin: 0 0.32rem;
						border-bottom: 1px solid #eee;
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