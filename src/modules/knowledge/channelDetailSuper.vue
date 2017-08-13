<template>
	<div>
		<div class="super-detail-main" v-show="!blogDetailVisiable">
			<v-common-header></v-common-header>
			<div class="container super-detail-container" >
				<p class="loadtips" v-if="loading < 3">加载中...</p>
				<div class="detail-wrapper" 
					:class="{'btn-show': (personInfo.master || personInfo.expertFlag) && (personInfo.empNumber != empNumber)}" ref="ctnWrapper" 
					@scroll="scrollHandler">
					<div class="header" :class="{'ifChannel':channelListShow.length > 0}" v-if="loading == 3">
						<div class="bg-wrapper">
							<img class="header-bg" :src="$global().imgHost + personInfo.headPath" alt="">
							<div class="bg"></div>
						</div>
						<div class="header-ctn">
							<div class="protrait-wrapper">
								<img :src="$global().imgHost + personInfo.headPath" alt="">
								<span class="protrait-level"
									:class="{'master': personInfo.master, 'expert': personInfo.expertFlag}">
								</span>
							</div>
							<p class="super-name">
								<span>{{ personInfo.name || '未知' }}</span>|<span>{{personInfo.post || '未知'}}</span>
							</p>
							<p class="super-other-info">
								<span><i class="info-title">粉丝数</i>|<i class="info-ctn">{{ personInfo.fansCount || 0 }}</i>人</span>
								<span><i class="info-title">沉淀内容</i>|<i class="info-ctn">{{ contentCount || 0 }}</i>篇</span>
								<span><i class="info-title">影响力</i>|<i class="info-ctn">{{ parseInt(personInfo.influence) || 0 }}</i></span>
							</p>
						</div>
						<div class="entry-channel-wrapper">
							<div class="entry-btn" @click.stop="channelSelBlockHandler" v-if="channelListShow.length > 0">
								进入{{personInfo.empNumber != empNumber?'TA':'我'}}的频道
							</div>
							<div class="channel-sel-block" v-show="channelSelBlockVisiable">
								<ul class="channel-list">
									<li v-for="item in channelListShow" :data-id="item.id">
										<router-link :to="{ 'path': '/knowledge/channelDetailChannel', 'query': { id: item.id } }">
											{{ item.name }}
										</router-link>
									</li>
								</ul>
							</div>
						</div>
						<div class="consult-num"
							v-if="personInfo.master || personInfo.expertFlag">
							<span>{{personInfo.askedCount}}</span>人请教</div>
					</div>
					<div class="detail-list-wrapper" v-if="loading == 3">
						<ul class="detail-list"
							v-infinite-scroll="loadBottom"
					 		infinite-scroll-disabled="bottomAllLoaded"
					 		infinite-scroll-distance="10"
					 		infinite-scroll-immediate-check="false">
							<li v-for="item in userContentList">
								<!-- 请教详情页面链接 -->
								<router-link :to="{ 'path': '/knowledge/consultationDetail/'+item.contentId }" v-if="item.contentType == 'consult'">
									<v-channel-detail-item :contentByP="item"></v-channel-detail-item>
								</router-link>
								<!-- 其他详情页面链接 -->
								<router-link :to="{ 'path': '/knowledge/channelDetailBlog', 'query': { id: item.contentId, type: item.contentType} }" v-if="item.contentType != 'consult'">
									<v-channel-detail-item :contentByP="item"></v-channel-detail-item>
								</router-link>
							</li>	
						</ul>
						<p class="loadtips"
							v-show="!bottomAllLoaded">加载中……</p>
						<p class="loadtips"
							v-show="bottomAllLoaded">没有更多数据了！</p>
					</div>
				</div>
				<div class="consult-btn" 
					v-if="(personInfo.master || personInfo.expertFlag) && (personInfo.empNumber != empNumber) && loading == 3"@click.stop="consultTo(personInfo.empNumber)">
					向TA请教
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import commonHeader from '../../components/commonHeader.vue';
	import channelDetailItem from '../../components/channelListDetail/channelSuperDetailItem.vue';
	import { getEmpNumber } from '../../js/commonFunction.js';
	export default {
		data() {
			return {
				channelSelBlockVisiable: false,//选择进入频道按钮
				empNumber: -1,//当前主页专家达人工号
				personInfo: {},
				userContentList: [],
				pageNo: 0,
				totalPage: 0,
				bottomAllLoaded: false,
				scrollTop: 0,
				contentCount: 0,//沉淀内容数
				channelListShow: [],
				currentId: -1,//当前用户工号
				loading: 0
			}
		},
		props: {
			superIdByP: { //父组件传进的唯一识别
				type: String
			}
		},
		components: {
			'v-common-header': commonHeader,
			'v-channel-detail-item': channelDetailItem
		},
		beforeRouteEnter(to, from, next) {
			next(
				vm => {
					if (from.path.match('consultationDetail') || from.path.match('channelDetailBlog')) {
						vm.backFromFn();
					} else {
						vm.backFromOther();
					}
				}
			);
		},
		beforeDestroy() {
			var data = {};
			data['pageNo'] = this.pageNo;
			data['totalPage'] = this.totalPage;
			data['scrollTop'] = this.scrollTop;
			data['bottomAllLoaded'] = this.bottomAllLoaded;
			try {
				localStorage.setItem('channelDetailSuper', JSON.stringify(data));
			} catch(e) {}
		},
		mounted() {
			var that = this;
			// 顶部信息
			var url = '/KMS-MSERVER/learning/person/main?empNumber=' + this.$route.query.empNumber;
			this.getData(url,'personInfo','GET', {}, parm => {
				parm.loading++;
			});												
			//频道展示
			var url2 = '/KMS-MSERVER/mobileChannel/search/channelList?type=3';
			url2 += '&isFocus=1';
			url2 += '&empNumber=' + this.$route.query.empNumber;
			this.getData(url2,'channelListShow','GET', {}, parm => {
				parm.loading++;
			});
			//获取当前用户的工号
			getEmpNumber(this);
		},
		methods: {
			scrollHandler(event) {
				this.scrollTop = event.currentTarget.scrollTop;
			},
			loadBottom() {
				var url = '/KMS-MSERVER/mobileChannel/search/userContentList?empNumber=' + this.$route.query.empNumber;
				this.pageNo++;
				url += '&startPage=' + this.pageNo;
				this.getMoreData(url, 'userContentList', 'totalPage', 'pageNo', 'bottomAllLoaded');
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
								if(this[pageno] >= response.body.totalPage - 1){
									this[bottomAllLoaded] = true;
								}
							}else{
								this[content] = '找不着数据！';
							}	
						}	
					}
				);
			},
			backFromFn() {
				var lastInfo = {};
				var that = this;
				try{
					lastInfo = JSON.parse(localStorage.getItem('channelDetailSuper'));
				}catch(e){}
				for (var attr in lastInfo) {
					this[attr] = lastInfo[attr];
				}
				//内容
				this.bottomAllLoaded = false;
				var url = '/KMS-MSERVER/mobileChannel/search/userContentList?empNumber=' + this.$route.query.empNumber;
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
									this.contentCount = response.body.totalSize;
									this.totalPage = response.body.totalPage;
									if(Object.getOwnPropertyNames(this.temp).length == (this.pageNo+1)){
										for(let attr in this.temp){
											this['userContentList'] = this['userContentList'].concat(this.temp[attr]);
										}
										setTimeout(function(){
											that.$refs.ctnWrapper.scrollTop = that.scrollTop;
										},100);
										that.loading++;
									}
									if (this.pageNo >= response.body.totalPage - 1) {
										this.bottomAllLoaded = true;
									}
								}else{
									this['userContentList'] = 0;
								}
								
							}	
						}
					)
				}
			},
			backFromOther() {
				//内容列表
				var url1 = '/KMS-MSERVER/mobileChannel/search/userContentList?empNumber=' + this.$route.query.empNumber;
				this.$http({
					method:'GET',
					url:this.$global().host+url1
				}).then(
					response => {
						if(response.status==200&&response.body.status){
							if(response.body.data){
								this.userContentList = response.body.data;
								this.totalPage = response.body.totalPage-1;
								this.contentCount = response.body.totalSize;
								this.loading++;
								if (this.pageNo >= response.body.totalPage - 1) {
									this.bottomAllLoaded = true;
								}
							}	
						}	
					}
				);
			},
			consultTo(emp) {
				this.$router.push({path: '/knowledge/meetOnlineConsult/-1', query: {empNumber: emp}});
			},
			superCloseHandler() {
				this.$emit('closeSuperControl');
			},
			channelSelBlockHandler() {
				this.channelSelBlockVisiable = !this.channelSelBlockVisiable;
			},
			closeBlogDetailHandler() {
				this.blogDetailVisiable = false;
			}
		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	.super-detail-container {
		.detail-wrapper {
			height: 100%;
			overflow-y: scroll;
			&.btn-show {
				height: calc(~"100% - 1.2rem");
			}
		}
		.consult-btn {
			height: 1.2rem;
			line-height: 1.2rem;
			font-size: 0.4rem;
			background-color: #ff4341;
			text-align: center;
			color: #fff;
		}
		.header {
			height: 4.3rem;
			position: relative;
			padding-top: 0.36rem;
			&.ifChannel {
				height: 5.1rem;
			}
			img, .bg {
				position: absolute;
				bottom: 0;
				left	: 0;
				width: 100%;
			}
			.bg {
				height: 100%;
			}
			.bg-wrapper{
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				overflow: hidden;
				.header-bg {
					.blur(10px);
				}
				.bg {
					background-color: #000;
					opacity: 0.3;
				}
			}
			.header-ctn {
				position: relative;
			}
			.protrait-wrapper {
				width: 2.5rem;
				height: 2.5rem;
				margin: 0 auto;
				position: relative;
				overflow: hidden;
				img {
					width: calc(~"100% - 2px");
					height: calc(~"100% - 2px");
					border: 1px solid #fff;
					border-radius: 50%;
				}
				.protrait-level {
					position: absolute;
					right: 0.2rem;
					bottom: 0.28rem;
					width: 0.34rem;
					height: 0.21rem;
					&.master {
						background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
						background-size: 310%;
						.bgPosition(@signs4Width, @signs4Height, 23, 16, 0, 980);
					}
					&.expert {
						background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
						background-size: 310%;
						.bgPosition(@signs4Width, @signs4Height, 23, 22, 0, 279);
					}
				}
			}
			.super-name {
				text-align: center;
				font-size: 0.36rem;
				color: #fff;
				margin-top: 0.28rem;
				span {
					margin: 0 0.15rem;
				}
			}
			.super-other-info {
				text-align: center;
				font-size: 0.36rem;
				color: #fff;
				line-height: 0.63rem;
				span {
					margin: 0 0.1rem;
				}
				.info-title {
					margin-right: 0.15rem;
				}
				.info-ctn {
					margin-left: 0.15rem;
				}
			}
			.entry-channel-wrapper {
				position: relative;
				width: 40%;
				margin:  0 auto;
				.entry-btn {
					height: 0.74rem;
					line-height: 0.74rem;
					padding-right: 4px;
					margin-top: 0.12rem;
					border: 1px solid #fff;
					border-radius: 2rem;
					font-size: 0.4rem;
					color: #fff;
					text-align: center;
					position: relative;
					&:after {
						content: "";
						position: absolute;
						right: 10%;
						top: 50%;
						margin-top: -2px;
						border-top: 4px solid #fff;
						border-left: 4px solid transparent;
						border-right: 4px solid transparent;
					}
				}
				.channel-sel-block {
					position: absolute;
					top: 1.12rem;
					left: 3%;
					width: 86%;
					width: 74%;
					padding: 5% 10%;
					color: #fff;
					background: rgba(0, 0, 0, 0.8);
					border-radius: 5px;
					z-index: 10;
					.channel-list {
						max-height: 2.9rem;
						overflow-y: scroll;
					}
					li {
						padding: 0.2rem 0;
						border-bottom: 1px solid rgba(225, 225, 225, 0.5);
						font-size: 0.37rem;
						line-height: 0.55rem;
						text-align: center;
						height: 0.55rem;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						&:last-child {
							border-bottom: none;
						}
						a {
							color: #fff;
						}
					}
					&:before {
						content: "";
						position: absolute;
						left: 50%;
						top: -6px;
						margin-left: -3px;
						border-bottom: 6px solid rgba(0, 0, 0, 0.8);
						border-left: 6px solid transparent;
						border-right: 6px solid transparent;
					}
				}
			}
			.consult-num {
				font-size: 0.36rem;
				color: #ed0b0e;
				border: 1px solid #ed0b0e;
				border-radius: 2rem;
				position: absolute;
				right: 0.32rem;
				top: 0.52rem;
				padding: 0.04rem 0.12rem;
			}
		}
		.detail-list {
			background-color: #fff;
			margin-bottom: 1rem;
			li {
				padding:0.46rem 0.32rem 0.46rem 0;
				margin-left: 0.32rem;
				border-bottom: 1px solid #eee;
			}
		}
		.detail-list-wrapper {
			.loadtips {
				position: relative;
				top: -0.5rem;
			}
		}
	}
</style>