<template>
	<div style="height:100%;">
		<div class="top-container" v-if="!newBlogVisiable && !newTopicDiscussionVisiable && !newAudioVisiable">
			<v-common-header :showMessage="true" v-if="firstChoose == 2  || $route.query.toIndex" :messageNum="messageNum"></v-common-header>
			<div class="container homePage knowledge knowledge-index" v-show="firstChoose == 2  || $route.query.toIndex">
				<p class="is-ready-to-show" v-if="showOnloading">加载中...</p>
				<div v-if="!showOnloading" style="height:100%;">
					<div class="ctn-wrapper" ref="ctnWrapper" @scroll="wrapperScrollHandler">
						
						<div class="search">
							<div class="search-content clearfix">
								<div class="types-box fl">
									<router-link to="/knowledge/channelTypes">
										<dt>
											<dl><span class="types-signs"></span></dl>
											<dd>分类</dd>
										</dt>
									</router-link>
									
								</div>
								<div class="search-box fr" @click="searchHandler">
									<i class="icon-search"></i>
									搜索平台内容
								</div>
							</div>
						</div>
						<!-- 焦点图 -->
						<mt-swipe :auto="4000" class="top-swiper">
							<mt-swipe-item v-for="(swiper,index) in swipers" v-if="index<5">
								<a  v-if="swiper.moduleId == 'knowledge'" >
									<router-link :to="{'path':'/knowledge/channelDetailBlog','query':{id:swiper.targetId,type:swiper.moduleId}}">
										<img :src="$global().imgHost+swiper.imagePath">
									</router-link>
								</a>
								<a  v-else-if="swiper.moduleId == 'information'">
									<router-link :to="{'path':'/knowledge/channelDetailBlog','query':{id:swiper.targetId,type:swiper.moduleId}}">
										<img :src="$global().imgHost+swiper.imagePath">
									</router-link>
								</a>
								<a  v-else-if="swiper.moduleId == 'consult'">
									<router-link :to="{'path':'/knowledge/consultationDetail/'+swiper.targetId}">
										<img :src="$global().imgHost+swiper.imagePath">
									</router-link>
								</a>
								<a  v-else-if="swiper.moduleId == 'blog'">
									<router-link :to="{'path':'/knowledge/channelDetailBlog','query':{id:swiper.targetId,type:swiper.moduleId}}">
										<img :src="$global().imgHost+swiper.imagePath">
									</router-link>
								</a>
								<a  v-else-if="swiper.moduleId == 'theme'">
									<router-link :to="{'path':'/knowledge/channelDetailBlog','query':{id:swiper.targetId,type:swiper.moduleId}}">
										<img :src="$global().imgHost+swiper.imagePath">
									</router-link>
								</a>
							</mt-swipe-item>
						</mt-swipe>
						<div class="learning-news">
							<img src="../../../static/img/tu_04.jpg">
							<div class="neirong">
								<div class="first" ref="learningNews">
									<p v-for="(item, index) in dynamic" :id="'item' + index" class="neirong-item">
										<router-link :to="{'path':'/knowledge/channelDetailBlog','query':{id:item.contentId,type:item.contentType}}" v-if="item.contentType == 'knowledge'">
												<span class="box">知识</span>
												<span class="text">{{item.title}}</span>
										</router-link>
										<router-link :to="{'path':'/knowledge/consultationDetail/'+item.contentId}" v-if="item.contentType == 'consult'">
											<a>
												<span class="box">请教</span>
												<span class="text">{{item.title}}</span>
											</a>
										</router-link>
										<router-link :to="{'path':'/knowledge/channelDetailBlog','query':{id:item.contentId,type:item.contentType}}" v-if="item.contentType == 'blog'">
											<a>
												<span class="box">博客</span>
												<span class="text">{{item.title}}</span>
											</a>
										</router-link>
										<router-link :to="{'path':'/knowledge/channelDetailBlog','query':{id:item.contentId,type:item.contentType}}" v-if="item.contentType == 'theme'">
											<a>
												<span class="box">主题</span>
												<span class="text">{{item.title}}</span>
											</a>
										</router-link>
										<router-link :to="{'path':'/knowledge/channelDetailBlog','query':{id:item.contentId,type:item.contentType}}" v-if="item.contentType == 'information'">
											<a>
												<span class="box">资讯</span>
												<span class="text">{{item.title}}</span>
											</a>
										</router-link>
									</p>
								</div>
							</div>
						</div>
						<section>
							<div class="module my-channel">
								<h4 class="module-title title clearfix">
									<span class="myChannelNav">我的频道</span>
								</h4>
								<div class="slider">
									<div class="slider-bar clearfix">
										<div class="swiper-container fl">
									        <div class="swiper-wrapper" ref="sliderBar">
									            <div class="swiper-slide" v-for="(n,index) in myChannelList" @click="chooseActive($event,index+1, myChannelList.length,n.id)" :class="{'choose-active': activeIndex == index+1,'mostLiu':mostLiu}">{{n.name | text}}</div>
									        </div>
									    </div>
									    <div class="more fl">
									    	<router-link to="/knowledge/channelManage">
									    		<span class="signs4 more-signs"></span>
									    	</router-link>
									    </div>
									</div>
									<div class="slider-container module-container">
										<ul>
											<li v-for="(n,index) in channelContent" v-if="index < 3">
												<router-link :to="{path:(n.contentType == 'knowledge' || n.contentType == 'blog' || n.contentType == 'theme')?'/knowledge/channelDetailBlog':n.contentType == consult?'/knowledge/consultationDetail/'+n.contentId:'',query:{id:n.contentId,type:n.contentType}}">
													<div class="item-title">
														<div class="name">{{n.title}}</div>
														<i class="signs4 video-signs" v-if="n.knowledgeType == 'KNO_DOCUMENT_FORMAT_14'"></i>
													</div>
													<div class="item-detail ellipsis-line-2">
														<span v-for="(sub,index) in n.listContent" v-if="sub.type == 'text' && index == 0">{{sub.text}}</span>
													</div>
													<div class="item-image clearfix">
														<img v-for="(sub,index) in n.imgSrc" class="fl" :src="sub">
													</div>
													<div class="item-publish">
														<span class="name signs4 name-signs">
															<router-link :to="{path:'/knowledge/channelDetailSuper',query:{empNumber:n.createId}}">
															{{n.createName || '未知'}}
															</router-link>
														</span>
														<span class="read signs4 read-signs">{{n.readCount || 0}}人浏览</span>
													</div>
												</router-link>
											</li>
										</ul>
										<div class="more" v-show="myChannelListLen">
											<div class="ifNoChannel" v-if="channelContent.length == 0"></div>
											<router-link :to="{ 'path': '/knowledge/channelDetailChannel', 'query': { id: getChannelId } }">
												<span>更多</span>
											</router-link>
										</div>
									</div>
								</div>
							</div>
							<div class="module professer-channel">
								<mt-navbar v-model="proChaSelected">
								  	<mt-tab-item id="1" >专家达人</mt-tab-item>
								  	<mt-tab-item id="2" >最新请教</mt-tab-item>
								</mt-navbar>
								<mt-tab-container  v-model="proChaSelected">
									<mt-tab-container-item id="1" v-if="proChaSelected == '1'">
										<div class="item-container module-container">
											<ul>
												<li v-for="(item,index) in expertAndMasterList" v-if="index < 3">
													<mt-cell-swipe
													  	title=""
													  	:right="[
														    {
														      content: '向TA请教',
														      style: { background: '#ff4141', color: '#fff' },
														      handler: () => ToConsult(item.empNumber)
														    }
														  ]" class="clearfix" v-if="item.empNumber!=empNumber">
														<router-link :to="{path:'/knowledge/channelDetailSuper',query:{empNumber:item.empNumber}}">
															<div class="item-container-left fl">
																<img :src="$global().imgHost+item.coverPath">
															</div>
															<div class="item-container-right fr">
															  	<h3 class="item-title">
															  		{{item.name}}
															  		<span class="signs4 class-signs king-signs"></span>
															  		<span>{{item.deptName}}</span>
															  		<span class="learn">{{item.askedMeetingCount}}人请教</span>
															  	</h3>
															  	<div class="item-info">
															  		<span>{{item.label || '这个人很懒，什么也没有留下~'}}</span>
															  	</div>
															  	<div class="item-detail">{{item.skilledFieldDesc || '这个人很懒，什么也没有留下~'}}</div>
															  	<router-link :to="{path:(item.contentType == 'knowledge' || item.contentType == 'blog' || item.contentType == 'theme')?'/knowledge/channelDetailBlog':item.contentType == 'consult'?'/knowledge/consultationDetail/'+item.contentId:'',query:{id:item.contentId,type:item.contentType}}">
															  		<div class="item-example">{{item.content || ''}}</div>
															  	</router-link>
															</div>
														</router-link>
													</mt-cell-swipe>
													<mt-cell-swipe title="" class="clearfix" v-if="item.empNumber==empNumber">
														<router-link :to="{path:'/knowledge/channelDetailSuper',query:{empNumber:item.empNumber}}">
															<div class="item-container-left fl">
																<img :src="$global().imgHost+item.coverPath">
															</div>
															<div class="item-container-right fr">
															  	<h3 class="item-title">
															  		{{item.name}}
															  		<span class="signs4 class-signs king-signs"></span>
															  		<span>{{item.deptName}}</span>
															  		<span class="learn">{{item.askedMeetingCount}}人请教</span>
															  	</h3>
															  	<div class="item-info">
															  		<span>{{item.label || '这个人很懒，什么也没有留下~'}}</span>
															  	</div>
															  	<div class="item-detail">{{item.skilledFieldDesc || '这个人很懒，什么也没有留下~'}}</div>
															  	<router-link :to="{path:(item.contentType == 'knowledge' || item.contentType == 'blog' || item.contentType == 'theme')?'/knowledge/channelDetailBlog':item.contentType == 'consult'?'/knowledge/consultationDetail/'+item.contentId:'',query:{id:item.contentId,type:item.contentType}}">
															  		<div class="item-example">{{item.content || '这个人很懒，什么也没有留下~'}}</div>
															  	</router-link>
															</div>
														</router-link>
													</mt-cell-swipe>
												</li>
											</ul>

											<div class="more" :class="{'noDate':expertAndMasterList.length==0?true:false}">
												<router-link to="/knowledge/expertList">
													<span>更多</span>
												</router-link>
											</div>
										</div>
									</mt-tab-container-item>
									<mt-tab-container-item id="2" v-if="proChaSelected == '2'">
										<div class="learn-container module-container">
											<ul>
												<li v-for="(item,index) in consultList" v-if="index < 3">
													<router-link :to="{path:'/knowledge/consultationDetail/' + item.id}">
														<div class="item-title"><i class="signs5" v-if="item.rewardScore?true:false">{{item.rewardScore}}</i>{{item.title}}</div>
														<div class="item-info">
															<router-link :to="{path:'/knowledge/channelDetailSuper',query:{empNumber:item.createId}}">
																<span>{{item.createName}}</span>
															</router-link>
																向
															<router-link :to="{path:'/knowledge/channelDetailSuper',query:{empNumber:item.askedId}}">
																<span>{{item.askedName}}</span>
															</router-link>
															请教
														</div>
														<div class="item-detail maxTwo">{{item.replyContentFormat | consultText}}</div>
													</router-link>
												</li>
											</ul>

											<div class="more" :class="{'noDate':consultList.length==0?true:false}">
												<router-link to="/knowledge/consultSquare">
													<span>更多</span>
												</router-link>
											</div>
										</div>
									</mt-tab-container-item>
								</mt-tab-container>
							</div>
							<div class="module all-to-say">
								<h4 class="module-title title clearfix">
									<span class="myChannelTalk">大家说</span>
								</h4>
								<div class="module-container clearfix">
									<ul>
										<li v-for="(n,index) in peopleSayList" class="clearfix" v-if="index < 5">
											<div class="left-container fl">
											<router-link :to="{path:'/knowledge/channelDetailSuper',query:{empNumber:n.empNumber}}">
												<img :src="imgHost+n.coverPath">
												</router-link>
											</div>
											<div class="right-container fr">
												<router-link :to="{path:'/knowledge/channelDetailSuper',query:{empNumber:n.empNumber}}">
													<div class="item-title">{{n.name}}</div>
												</router-link>
												<div class="item-time">{{n.createDateStr}}</div>
												<router-link :to="{path:(n.type == 'knowledge' || n.type == 'blog' || n.type == 'theme')?'/knowledge/channelDetailBlog':n.type == 'consult'?'/knowledge/consultationDetail/'+n.id:'',query:{id:n.id,type:n.type}}" v-if="n.type!='discussion'">
													<div class="item-example">{{n.title}}</div>
												</router-link>
												<router-link :to="{path:'/knowledge/channelDetailBlog/',query:{id:n.id,type:'theme'}}" v-if="n.type=='discussion'">
													<div class="item-example">{{n.title}}</div>
												</router-link>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</section>
						
					</div>
					<div class="pancil" v-if="!showChannelSigns">
						<img @click="showChannelSigns = true" src="../../../static/img/pancil.png">
					</div>
					<mt-popup
					  	v-model="showChannelSigns"
					  	popup-transition="popup-fade"
					  	:closeOnClickModal="false"
					  	position="bottom"
					  	class="channel-signs-popBox">
					  	<div class="channel-signs-box">
					  		<ul class="clearfix">
					  			<li style="margin-left:25%" class="fl" @click="newBlogVisiable = true, showChannelSigns = false, blogType = 'blog'">
					  				<dt>
					  					<dl><i class="signs4 boke"></i></dl>
					  					<dd>博客</dd>
					  				</dt>
					  			</li>
					  			<li class="fl" @click="newBlogVisiable = true, showChannelSigns = false, blogType = 'theme'">
					  				<dt>
					  					<dl><i class="signs4 zhutitaolun"></i></dl>
					  					<dd>主题讨论</dd>
					  				</dt>
					  			</li>
					  			<!-- <li class="fl">
					  				<dt>
					  					<dl><i class="signs4 shipin"></i></dl>
					  					<dd>视频</dd>
					  				</dt>
					  			</li>
					  			<li class="fl">
					  				<dt>
					  					<dl><i class="signs4 yuyin"></i></dl>
					  					<dd>语音</dd>
					  				</dt>
					  			</li> -->
					  		</ul>
					  		<div class="close-btn">
					  			<span @click="showChannelSigns = false">x</span>
					  		</div>
					  	</div>
					</mt-popup>
				</div>
				<v-common-footer :active="2" v-if="firstChoose != 3 || $route.query.toIndex"></v-common-footer>
			</div>
			<div class="previewer-container" v-if="firstChoose == 1 && !$route.query.toIndex">
				<div class="all-wrapper">
					<div class="channel">
						<h1>选择你想订阅的频道</h1>
						<ul class="tag clearfix">
							<li class="tag-item fl" v-for="(item, index) in firstSelChannels" 
								@click="chooseChannel(item)" 
								:class="{'active': channelActiveIndexObj[item.id] == 1, 'text-overflow': channelTypeCount(item.name)>9}"
								:data-id="item.id">
								<span>{{item.name}}</span>
							</li>
						</ul>
					</div>
					<div class="types">
						<h1>选择你感兴趣的分类</h1>
						<p>有新内容通知你哦~</p>
						<ul class="tag clearfix">
							<li class="tag-item fl" v-for="(item, index) in firstSelCates" 
								@click="chooseType(item)" 
								:class="{'active': typeActiveIndexObj[item.id] == 1}"
								:data-id="item.id">
								<span>{{item.categoryName}}</span>
							</li>
						</ul>
					</div>
				</div>
				<div class="submit-btn" @click="enterToHome">
					<span>选择好了，进入首页</span>
				</div>
			</div>
			<v-channel-detail v-if="firstChoose == 3 && !$route.query.toIndex" :channelIdByP="channelId"></v-channel-detail>
		</div>
		<v-new-blog v-if="newBlogVisiable" :id="channelIdByP" :empNumber="empNumber" :type="blogType" @newBlogCancelControl="newBlogVisiable=false"></v-new-blog>
	</div>	
</template>
<script>
import Swiper from '../../plugins/swiper/swiper.min';
import { Toast } from 'mint-ui';
import commonHeader from '../../components/commonHeader.vue';
import commonFooter from '../../components/commonFooter.vue';
import channelDetail from './channelDetailChannel.vue';
import newBlog from './newBlog.vue';
import { getEmpNumber, bytesCount } from '../../js/commonFunction.js';
export default{
	components: {
		'v-common-header': commonHeader,
		'v-common-footer': commonFooter,
		'v-channel-detail': channelDetail,
		'v-new-blog': newBlog
	},
	data(){
		return {
			swipers: [],
			index: 0,
			dynamicType:{//动态类型显示
				information:'资讯',
				course: '课程',
				project: '项目'
			},
			scrollTop: 0,
			loadArr: [],
			showOnloading: true,
			// color: ['33cc33', 'f15e4c', 'b273c2', 'f5cb37', '00aeef'],
			loadCount: 0,
			proChaSelected: '1',
			activeIndex: 1,
			typeActiveIndexObj: {},
			channelActiveIndexObj: {},
			firstChoose: 0,
			showChannelSigns: false,
			firstSelChannels: [],
			firstSelCates: [],
			peopleSayList:[],
			imgHost: String,			
			channelId: -1,
			expertAndMasterList:[],
			myChannelList:[],
			channelContent:[],
			fistId:0,
			consultList:[],
			getChannelId:0,
			// everyChannelPic:[],
			empNumber:'',
			newBlogVisiable: false,//写博客页面
			myChannelListLen:false,
			mostLiu:false,
		}
	},
	computed: {
		typeActiveIndex() {
			var tempArr = [];
			for (var attr in this.typeActiveIndexObj) {
				if (this.typeActiveIndexObj[attr]) {
					tempArr.push(Number(attr));
				}
			}
			return tempArr.join(',');
		},
		channelActiveIndex() {
			var tempArr = [];
			for (var attr in this.channelActiveIndexObj) {
				if (this.channelActiveIndexObj[attr]) {
					tempArr.push(Number(attr));
				}
			}
			return tempArr.join(',');
		}
	},
	beforeRouteEnter(to,from,next) {
		next(
			vm => {
				if(from.path.match('/main') || from.path.match('/MyCenter')){
					// 如果是从学习或我的进去频道时，自动在顶部
					window.localStorage.setItem('index',JSON.stringify({'scrollTop':'0'}))
				}
				vm.$http({
					method: 'GET',
					url: vm.$global().host + '/KMS-MSERVER/mobileChannel/pageMain/init?userIdForLogin=833256'
				}).then(
					response => {
						if(response.status==200&&response.body.status){
							if(response.body.data){
								vm.firstChoose = response.body.data.result;
								if (response.body.data.result == 3) {
									vm.channelId = response.body.data.channelId;
								}
							}
						}	
					})
				vm.getData('/KMS-MSERVER/mobileChannel/search/channelList?type=1','firstSelChannels','GET', {}, parm => {
					parm.$nextTick(
						() => {
							var tempObj = {};
							parm.firstSelChannels.map(value => {
								for (var key in value) {
									if (key == 'id') {
										if (value.id == 1) {
											tempObj[value.id] = 1;
											continue;
										}
										tempObj[value.id] = 0;
									}
								}
							});
							parm.channelActiveIndexObj = tempObj;
						}
					);
				});//进入首页频道数据
				vm.getData('/KMS-MSERVER/mobileChannel/allCate?type=1','firstSelCates','GET', {}, parm => {
					parm.$nextTick(
						() => {
							var tempObj = {};
							parm.firstSelCates.map(value => {
								for (var attr in value) {
									if (attr == 'id') {
										tempObj[value.id] = 0;
									}
								}
							});
							parm.typeActiveIndexObj = tempObj;
						}
					);
				});//进入首页种类数据
				getEmpNumber(vm);
			}
		);
	},
	beforeDestroy() {
		let data = {};
		data['scrollTop'] = this.scrollTop;
		data['proChaSelected'] = this.proChaSelected;
		localStorage.setItem('index',JSON.stringify(data));
		clearInterval(this.timer);
	},
	mounted() {
		this.imgHost = this.$global().imgHost
		let that = this;
		var index = 0;
		that.timer = setInterval(function(){
			if(index > 2){
				index = 0;
			}
			if(index ==0){
				that.setDocumentDisplay('item0', 'block');
				that.setDocumentDisplay('item1', 'block');
				that.setDocumentDisplay('item2', 'none');
				that.setDocumentDisplay('item3', 'none');
				that.setDocumentDisplay('item4', 'none');
				that.setDocumentDisplay('item5', 'none');
			}else if(index == 1){
				that.setDocumentDisplay('item2', 'block');
				that.setDocumentDisplay('item3', 'block');
				that.setDocumentDisplay('item0', 'none');
				that.setDocumentDisplay('item1', 'none');
				that.setDocumentDisplay('item4', 'none');
				that.setDocumentDisplay('item5', 'none');
			}else if(index == 2){
				that.setDocumentDisplay('item4', 'block');
				that.setDocumentDisplay('item5', 'block');
				that.setDocumentDisplay('item2', 'none');
				that.setDocumentDisplay('item3', 'none');
				that.setDocumentDisplay('item0', 'none');
				that.setDocumentDisplay('item1', 'none');
			}
			index ++;
		}, 2000);
		if(that.firstChoose == 2 || this.$route.query.toIndex){
			that.changeToGetData();
		}
	},
	methods: {
		channelTypeCount(str) {
			return bytesCount(str);
		},
		ToConsult(val){
			this.$router.push({ path: '/knowledge/meetOnlineConsult/-1', query: { 'empNumber': val }})
		},
		endFn(parm) {
			parm.loadArr.push(1);
			if(parm.loadArr.length>=5){
				var project = JSON.parse(localStorage.getItem('index'));
				if(project.scrollTop>0){
					setTimeout(function(){
						parm.$refs.ctnWrapper && (parm.$refs.ctnWrapper.scrollTop = project.scrollTop);
					},10);
				};
				if(project.proChaSelected == 1){
					this.proChaSelected = '1'
				}else if(project.proChaSelected == 2){
					this.proChaSelected =  '2'
				}
			}
			parm.loadCount++;
			if (parm.loadCount > 3) {
				parm.showOnloading = false;
			}
		},
		wrapperScrollHandler() {
			this.scrollTop = event.currentTarget.scrollTop;
		},
		searchHandler() {
			window.location.href = '#/knowledge/channelSearchIndex';
		},
		setDocumentDisplay(id, style){
			var obj = document.getElementById(id);
			if(obj) {
				obj.style.display = style;
			}
		},
		chooseActive(eve, index, length,id){
			var that = this;
			that.getChannelId = id;
			this.$http({
				method:'GET',
				url:that.$global().host+'/KMS-MSERVER/mobileChannel/search/channelContentList?channelId='+id+'&type=1'
			}).then(response => {
				if(response.status==200&&response.body.status){
					if(response.body.data){
						var a = [];
						this.channelContent = response.body.data;
						for(let i=0;i<response.body.data.length;i++){
							let listContent = response.body.data[i].listContent;
							a = [];
							if(listContent){
								for(let x=0;x<listContent.length;x++){
									if(listContent[x].type == 'image'){
										if(a.length < 3){
											var url = this.$global().host+listContent[x].src
											a.push(url);
										}
									}
								}
								this.channelContent[i].imgSrc = a
							}
						}
					}
				}
			})
			if(index != 1 && index != length){
				let sliderWidth = Number(eve.target.style.width.slice(0, -2)) * (index-2);
				setTimeout(() => {
					that.$refs.sliderBar.style.transform = 'translate3d(-' + sliderWidth + 'px, 0px, 0px)';
					that.$refs.sliderBar.style.transitionDuration = '100ms'
					that.activeIndex = index;
				}, 50);
			}else{
				that.activeIndex = index;
			}
			
		},
		enterToHome(){
			var tempActiveChannel = '';
			if(this.typeActiveIndex != ''){
				if (this.channelActiveIndex == '') {
					tempActiveChannel = '1';
				} else {
					tempActiveChannel = this.channelActiveIndex;
				}
				this.firstChoose = 2;
				this.$http.post(this.$global().host + '/KMS-MSERVER/mobileChannel/batchSaveUserChannel',
				'channelIds=' + tempActiveChannel + '&cateIds=' + this.typeActiveIndex);
			}else{
				return Toast({message: '请选择！', duration: 1000});
			}
			
		},
		chooseChannel(item){
			this.channelActiveIndexObj[event.currentTarget.getAttribute('data-id')] = !this.channelActiveIndexObj[event.currentTarget.getAttribute('data-id')];
		},
		chooseType(item, index){
			this.typeActiveIndexObj[event.currentTarget.getAttribute('data-id')] = !this.typeActiveIndexObj[event.currentTarget.getAttribute('data-id')];
		},
		changeToGetData(){
			//获取消息数据http://localhost:8080/KMS-MSERVER/consult/msg/count
			this.getData('/KMS-MSERVER/consult/msg/count', 'messageNum', 'GET', {}, parm=>{
				console.log(parm.messageNum);
			});
			this.getData('/KMS-MSERVER/mobileChannel/advert/list','swipers','GET',{},this.endFn);//焦点图数据获取
			this.getData('/KMS-MSERVER/mobileChannel/recommend/list','dynamic','GET',{},this.endFn);//动态数据获取
			// 获取请教聚焦
			this.getData('/KMS-MSERVER/consult/list', 'consultList', 'GET', {},this.endFn);
			//获取大家说
			this.getData('/KMS-MSERVER/mobileChannel/expertAndMaster/discussion', 'peopleSayList', 'GET', {},this.endFn);
			// 获取首页专家达人
			this.getData('/KMS-MSERVER/mobileChannel/expertAndMaster/list?type=1', 'expertAndMasterList', 'GET', {},this.endFn);
			// 获取首页我的频道列表
			this.$http({
				method: 'GET',
				url: this.$global().host+'/KMS-MSERVER/mobileChannel/search/channelList?type=3&isFocus=1&cateId=0'
			}).then(
			response => {
				if(response.status==200&&response.body.status){
					if(response.body.data){
						if(response.body.data.length != 0){
							this.myChannelListLen = true;
						}
						this['myChannelList'] = response.body.data;
						if(this['myChannelList'].length != 0){
							this.fistId = this['myChannelList'][0].id;
							this.getChannelId = this['myChannelList'][0].id;
							// 获取首页我的频道内容
							this.$http({
								method: 'GET',
								url:this.$global().host + '/KMS-MSERVER/mobileChannel/search/channelContentList?channelId='+this.fistId+'&type=1'
							}).then(
							response => {
								if(response.status==200&&response.body.status){
									// 让我的频道内容图片不超过三张
									var a = [];
									if(response.body.data){
										this['channelContent'] = response.body.data;
										for(let i=0;i<response.body.data.length;i++){
											let listContent = response.body.data[i].listContent;
											a = [];
											if(listContent){
												for(let x=0;x<listContent.length;x++){
													if(listContent[x].type == 'image'){
														if(a.length < 3){
															var url = this.$global().imgHost+listContent[x].src
															a.push(url);
														}
													}
												}
												this['channelContent'][i].imgSrc = a
											}
										}
									}else{//找不到数据
										this['channelContent'] = 0;
									}
								}
							})
						}
					}else{//找不到数据
						this['myChannelList'] = 0;
					}
				}
			})
		}
	},
	filters: {
		text(val){
			var length = val.length;
			var zLength = val.replace(/[^\x00-\xff]/g, "**").length
			if(zLength > 12){
				if(length == zLength){
					val = val.slice(0,12)
					return val;
				}else{
					val = val.slice(0,6)
					return val;
				}
			}else{
				return val;
			}
		},
		consultText(val){
			if(val != ''){
				if(val[0].type == 'text'){
					return val[0].text
				}else if(val[0].type == 'audio'){
					return '[语音]'
				}
			}
		}
	},
	watch: {
		firstChoose(val){
			if(val == 2){
				this.changeToGetData();
			}
		},
		myChannelList(val){
			if(val.length > 0){
				setTimeout(()=>{
					var swiper = new Swiper('.swiper-container', {
				        pagination: '.swiper-pagination',
				        slidesPerView: 3,
				        spaceBetween: 0
				    });

				}, 1000);
			}
		},
		$route(val, oldVal) {
			if (val.query.toIndex != oldVal.query.toIndex) {
				this.changeToGetData();
			}
		}
	}
}
</script>
<style lang="less">
@import '../../plugins/swiper/swiper.min.css';
@import "../../css/customFn.less";
	.top-container{
		height: 100%;
	}
	.previewer-container{
		background-color: #fff;
		width: 100%;
		height: 100%;
		text-align: center;
		position: relative;
		.all-wrapper {
			height: calc(~'100% - 2.3rem');
			overflow-y: scroll; 
		}
		h1{
			font-size: 0.7rem;
		    color: #000;
		    line-height: 200%;
		    padding-top: 0.5rem;
		}
		p{
			color: #999;
			font-size: .38rem;
		}
		ul{
			padding: 0 8%;
			li{
				width: calc(~"(100% - 1.04rem - 6px) / 3");
				padding: 0 .02rem;
				margin-top: 4.5%;
				line-height: 0.968rem;
				height: 0.968rem;
				border: 1px solid #eee;
				color: #666;
				font-size: 0.44rem;
				border-radius: 5px;
				white-space: nowrap;
				&.text-overflow {
					font-size: 0.36rem;
				}
			}
			li:not(:nth-child(3n-2)){
				margin-left: 0.3rem;
			}
		}
		.channel, .types{
			ul{
				li{
					&.active{
						background-color: #ff4141;
						color: #fff;
					}
				}
			}
		}
		.types {
			margin-bottom: 10%;
			.tag {
				li {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}
		.submit-btn{
			width: 100%;
			height: 2.3rem;
			background-color: #fff;
			span{
				position: absolute;
				bottom: 0.5rem;
				left: 50%;
				.transform-translateX (-50%);
				display: block;
				width: 70%;
				margin: 0 auto;
				line-height: 1.1rem;
				font-size: 0.4rem;
				background-color: #ff4141;
				color: #fff;
				border-radius: 5px;
			}
			
		}
	}
	.knowledge-index{
		.audio-signs{
			&:before{
				background-size: 170%;
				height: 0.45rem;
				left: .2rem;
				width: .7rem;
				.bgPosition(@signs4Width, @signs4Height, 15, 25, 0, 28);
			}
		}
		.video-signs{
			&:before{
				background-size: 170%;
				height: 0.45rem;
				left: .2rem;
				width: .7rem;
				.bgPosition(@signs4Width, @signs4Height, 29, 18, 0, -4);
			}
		}
		.ctn-wrapper{
			section{
				margin-bottom: 50px;
			}
			.search{
				font-size: 12px;
				.search-content{
					padding: 0 3.6%;
					.types-box{
						width: 10%;
						dt{
							dl{
								span{
									display: block;
									width: 100%;
									height: 0.5rem;
									margin-left: .05rem;
									background: url('../../../static/img/all.png') no-repeat;
									background-size: 54%;
									.bgPosition(27, 27, 0, 0, 3, 2);

								}
							}
							dd{
								margin-top: 0.1rem;
								line-height: 0.2rem;
								color: #999;
							}
						}
					}
					.search-box{
						width: 86.4%;
						.icon-search{
							margin-left: -10.4%;
						}
						@media (max-width: 767px){
							.icon-search{
								margin-left: -8%;
							}
						}
						@media (max-width: 600px){
							.icon-search{
								margin-left: -7%;
							}
						}
						@media (max-width: 414px){
							.icon-search{
								margin-left: -8%;
							}
						}
						@media (max-width: 360px){
							.icon-search{
								margin-left: -11%;
							}
						}
					}
				}
			}
			.top-swiper{
				.mint-swipe-indicators{
					text-align: center;
					width: 100%;
					left: 0;
				}
			}
			.learning-news{
				margin: 0;
			}
			.module{
				margin-top: 3.6%;
				background-color: #fff;
				.module-title{
					// .title{
					    height: 1.2rem;
					    line-height: 1.2rem;
					    margin: 0 3.6%;
					    border-bottom: 1px solid #dedede;
					    position: relative;
					    font-size: 0.42rem;
					    i{
					    	width: 8px;
						    height: 1.2em;
						    background: url('../../../static/img/shunfeng_signs.png') no-repeat 0 -59px;
						    background-size: 30px;
						    margin-top: 0.9em;
					    }
					//}
					b{
					    display: inline-block;
					    height: 0.4rem;
					    width: 0.15rem;
					    position: absolute;
					    left: -3.6%;
					    top: 0.4rem;
					}
				}
				.module-container{
					ul{
						li{
							.item-title{
								color: #333;
								font-size: 0.4rem;
								line-height: 0.6rem;
								font-weight: bold;
								span{
									font-weight: 400;
									font-size: 0.32rem;
									color: #999;
									&.learn{
										color: #ff4141;
										float: right;
										clear: both;
									}
								}
							}
							.item-detail {
								color: #999;
								font-size: 0.373rem;
								line-height: 0.48rem;
							}
							.item-info{
								color: #999;
								font-size: 0.32rem;
								line-height: 0.48rem;
							}
							.item-example{
								color: #999;
								margin-top: 0.2rem;
								font-size: 0.39rem;
							}
							.item-image{
								margin-bottom: .2rem;
								img{
									width: 32.4%;
									height: 2.2rem;
									display: block;
									&:not(:first-child){
										margin-left: 1.4%;
									}
								}
							}
						}
					}
					.more{
						padding-bottom: 3.6%;
						text-align: center;
						span{
							display: inline-block;
							width: 22%;
							border: 1px solid #ccc;
							border-radius: 5px;
							line-height: 0.8rem;
							font-size: 0.4rem;
						}
						
					}
					.noDate{
						padding-top: 0.4rem;
					}
				}
			}
			.my-channel{
				font-size: 0.4rem;
				.myChannelNav{
					text-align: center;
					display: block;
					font-weight: bold;
					font-size: 0.48rem;
				}
				.title{
					border: none;
				}
				.slider{
					.slider-bar{
						position: relative;
						font-size: 0.4rem;
						line-height: 1rem;
						border-top: 1px solid #eee;
						border-bottom: 1px solid #eee;
						background-color: #f7f7f7;
						.swiper-container {
						    width: 100%;
						    height: 100%;
						    display: inline-block;
						    width: 81%;
						    .mostLiu{
						    	display: inline-block;
						    }
							.swiper-slide {
								width: calc(~"100% / 3");
							    display: -webkit-box;
							    display: -ms-flexbox;
							    display: -webkit-flex;
							    display: flex;
							    -webkit-box-pack: center;
							    -ms-flex-pack: center;
							    -webkit-justify-content: center;
							    justify-content: center;
							    -webkit-box-align: center;
							    -ms-flex-align: center;
							    -webkit-align-items: center;
							    align-items: center;
							    white-space: nowrap;
							    &.choose-active{
							    	font-size: 0.427rem;
							    	font-weight: bold;
							    	position: relative;
							    	&.choose-active:before{
							    		content: '';
							    		position: absolute;
							    		border: 2px solid #ff4141;
							    		border-radius: 50%;
							    		left: 50%;
							    		margin-left: -1px;
							    		bottom: 0;
							    	}
							    }
							}
						}
						.more{
							display: inline-block;
							width: 19%;
							text-align: right;
							padding: 0;
							float: right;
						}
						.more-signs:before{
							background-size: 150%;
						    width: 0.7rem;
						    height: 0.45rem;
						    top: 0.05rem;
							.bgPosition(@signs4Width, @signs4Height, 28, 28, 0, 120);
						}
					}
					.slider-container{
						background-color: #fff;
						.ifNoChannel{
							padding-top: 0.35rem;
						}
						ul{
							padding-left: 3.6%;
							li{
								padding: 3.6% 3.6% 3.6% 0;
								.item-title{
    								margin-bottom: 0.15rem;
									.name{
										white-space: nowrap;
										text-overflow :ellipsis;
										overflow: hidden;
										max-width: 90%;
										display: inline-block;
									}
								}
								.item-detail{
									margin-bottom: 0.2rem;
									max-height: 0.96rem;
									overflow-y: hidden;
									word-break: break-all;
								}
								.item-publish{
									font-size: 0.32rem;
									color: #999;
									span{
										margin-right: 20px;
										a{
											color: #999;
										}
									}
								}
								.name-signs, .read-signs{
								    padding-left: 0.5rem;
								}
								.name-signs:before, .read-signs:before{
									background-size: 170%;
								    width: 0.7rem;
								    height: 0.4rem;
								}
								.name-signs:before{
									.bgPosition(@signs4Width, @signs4Height, 19, 20, 0, 86);
								    top: 0.04rem;
								}
								.read-signs:before{
									.bgPosition(@signs4Width, @signs4Height, 22, 16, -2, 60);
								    top: 0.05rem;
								}
							}
							li:not(:last-child){
								border-bottom: 1px solid #eee;
							}
						}
					}
				}
			}
			.professer-channel{
				.mint-navbar{
					border: none;
					.mint-tab-item{
						font-size: 0.4rem;
						line-height: 1.2rem;
						text-align: center;
						font-weight: 600;
						border-bottom: 1px solid #eee;
						.mint-tab-item-label{
							line-height: 1.2rem;
							font-size: 0.4rem;
							border: none;
						}
						&.is-selected{
							border-bottom: 1px solid #ff4141;
						}
					}
				}
				ul{
					padding-left: 3.6%;
					li:not(:last-child){
						border-bottom: 1px solid #eee;
					}
				}
				.mint-cell{
					background-image: none;
					padding: 3.6% 0 0 0;
					.mint-cell-wrapper{
						background-image: none;
						padding: 0;
							padding-right: 3.6%;
							padding-bottom: 3.6%;
						.mint-cell-value{
							display: block;
							width: 100%;

							.item-detail, .item-example{
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
							}
							.item-container-left{
								width: 18%;
								img{
									width: 1.7rem;
    								height: 2.16rem;
								}
							}
							.item-container-right{
								width: 76%;
								.item-detail{
									font-size: .32rem;
								}
								.item-title {
									position: relative;
									top: -0.1rem;
								}
								.item-info {
									span {
										display: block;
										white-space: nowrap;
										overflow: hidden;
										text-overflow: ellipsis;
									}
								}
								.item-example{
									color: #333;
									line-height: 0.6rem;
									margin-top: 0;
									position: relative;
									top: 0.1rem;
								}
								.class-signs{
								    &:before{
									    width: 0.5rem;
									    height: 0.3rem;
									    top: 0.1rem;	
								    }
									&.v-signs:before{
										background-size: 222%;
										.bgPosition(@signs4Width, @signs4Height, 23, 22, 0, 279);

									}
									&.king-signs:before{
										background-size: 230%;
										.bgPosition(@signs4Width, @signs4Height, 22, 16, 0, 982);

									}
								}
							}
							
						}
					}
					.mint-cell-right{
						padding: 0;
						.mint-cell-swipe-buttongroup{
							display: table;
							.mint-cell-swipe-button{
								font-size: 0.4rem;
								line-height: 0.5rem;
								width: 1rem;
								padding: 0 5px;
							    display: table-cell;
							    vertical-align: middle;
							}
						}
						
					}
				}
				.learn-container{
					ul{
						padding-left: 3.6%;
						padding-right: 3.6%;
						li{
							padding: 3.6% 0;
							height: auto;
							.item-title{
								font-size: 0.4rem;
								white-space: nowrap;
							    overflow: hidden;
							    text-overflow: ellipsis;
								.signs5{
									color: #ff9223;
									margin-right: 0.2rem;
									font-weight: normal;
								}
								.signs5:before{
									content: '';
									width: 0.5rem;
	    							height: 0.4rem;
									display: inline-block;
									background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
									background-size: 243%;
									.bgPosition(@signs4Width, @signs4Height, 31, 24, 0, 403);
									position: relative;
									top: 0.05rem;
								}
							}
							.item-info{
								span{
									color: #188eee;
								}
							}
							.item-detail{
								max-height: 1rem;
								overflow: hidden;
								margin-top: 0.2rem;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
						}
						li:not(:last-child){
							border-bottom: 1px solid #eee;
						}
					}
				}
			}
			.guess{
				.module-container{
					ul{
						padding: 0.3rem 0;
						li{
							margin-left: 3.6%;
							padding: 0.3rem 0;
							width: calc(~"85.6% / 3");
							text-align: center;
							background-color: #f2f2f2;
							dt{
								dl{
									img{
										width: 70%;
										margin: 0 auto;
									}
								}
								dd{
									margin-top: 0.2rem;
									font-size: 0.373rem;
									.class-signs{
										padding-left: 0.5rem;
									    &:before{
										    width: 0.5rem;
										    height: 0.373rem;
										    top: 0.1rem;	
									    }
										&.v-signs:before{
											background-size: 270%;
											.bgPosition(@signs4Width, @signs4Height, 23, 22, 0, 279);

										}
										&.king-signs:before{
											background-size: 300%;
											.bgPosition(@signs4Width, @signs4Height, 22, 16, 0, 982);

										}
									}
								}
							}
							
						}
					}
				}
			}
			.all-to-say{
				.module-title{
					text-align: center;
					font-weight: bold;
				}
				.myChannelTalk{
					font-size: 0.48rem;
				}
				.module-container{
					padding: 0 3.6%;
					ul{
						li{
							padding: 0.3rem 0;
							height: 1.4rem;
							width: 100%;
							.left-container{
								width: 15%;
								height: 1.4rem;
							    overflow: hidden;
							    width: 1.4rem;
								img{
									width: 100%;
								}
							}
							.right-container{
								width: 80%;
								height: 100%;
								position: relative;
								.item-title{
									font-weight: bold;
									font-size: 0.373rem;
									color: #333;
									display: inline-block;
								}
								.item-time{
									display: inline-block;
									float: right;
									color: #999;
								}
								.item-example{
									width: 100%;
									position: absolute;
									bottom: 0;
									color: #333;
									text-overflow: ellipsis;
									overflow: hidden;
									white-space: nowrap;
									font-size: 0.4rem;
								}
							}
						}
						li:not(:last-child){
							border-bottom: 1px solid #eee;
						}
					}
				}
			}
		}
		.pancil{
			position: absolute;
			bottom: 2rem;
			right: 0.3rem;
			width: 1rem;
			height: 1rem;
			border-radius: 50%;
			img{
				width: 100%;
			}
		}
		.channel-signs-popBox{
			width: 100%;
		    background: none;
		    color: #fff;
		    height: 25%;
		    .channel-signs-box{
		    	ul{
		    		li{
		    			width: 25%;
		    			text-align: center;
		    			font-size: .373rem;
		    			dt{
		    				dl{
		    					margin-bottom: .3rem;
		    					i{
		    						&:before{
		    							background-size: 140%;
		    						}
		    						&.boke:before{
		    							.bgPosition(@signs4Width, @signs4Height, 36, 40, 1, 1040);
		    						}
		    						&.zhutitaolun:before{
		    							.bgPosition(@signs4Width, @signs4Height, 40, 40, 0, 1090);
		    						}
		    						&.shipin:before{
		    							.bgPosition(@signs4Width, @signs4Height, 53, 32, 0, 1188);
		    						}
		    						&.yuyin:before{
		    							.bgPosition(@signs4Width, @signs4Height, 22, 38, 0, 1140);
		    						}
		    					}
		    				}
		    			}
		    			
		    		}
		    	}
		    	.close-btn{
		    		margin-top: 1rem;
		    		span{
		    			font-size: .32rem;
		    			display: block;
		    			width: 1.2rem;
		    			height: 1.2rem;
		    			margin: 0 auto;
		    			border-radius: 50%;
		    			color: #fff;
		    			background-color: #ff4141;
		    			line-height: 1.2rem;
		    			text-align: center;
		    		}
		    	}
		    }
		}
	}
</style>