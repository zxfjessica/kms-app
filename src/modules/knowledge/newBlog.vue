<template>
<div>
	<div class="new-blog-wrapper main-page" v-if="!addAdminPanelVisiable">
		<mt-header :title="type == 'blog' ? '发博客' : type == 'theme' ? '发主题讨论' : ''" class="is-fixed">
			<div slot="left">
			    <mt-button @click="cancelHandler">取消</mt-button>
			</div>
			<div slot="right" class="header-right-btn">
			    <mt-button class="publish-btn" @click="publishHandler">发表</mt-button>
			</div>
		</mt-header>
		<div class="new-blog-content container">
			<section class="input-section">
				<div class="title-box">
					<textarea class="blog-title" placeholder="添加标题" v-model="blogTitle"></textarea>
				</div>
				
				<textarea class="blog-content" placeholder="写点什么吧" v-model="blogInfo"></textarea>
				<div class="blog-friends" v-if="imageArr.length > 0">
					<!-- <img :src="$global().host + item" v-for="item in imageArr"> -->
					
				    <span v-for="(item, index) in imageArr">
				    	<img :src="$global().imgHost + item">
				    	<i clas="delete" @click="deletePic(index)"></i>
				    </span>
				            
				</div>
				<div class="blog-sel-menu-wrapper">
					<span class="remind" @click="addAdminPanelVisiable = true">@</span>
					<span class="pic" @click="picSelVisible = true"></span>
					<!-- <span class="camera"></span>
					<span class="unknow"></span> -->
				</div>
			</section>
			<section class="original-section" v-if="type == 'blog'">
				<span class="original-text">原创</span>
				<mt-switch class="origin-switch" v-model="isOriginal"></mt-switch>
			</section>
			<section class="syn-section">
				<h3 class="syn-title">同步到我的频道<span class="syn-title-iconswitch"></span></h3>
				<div class="syn-list" v-if="myChannel.length > 0">
					<div class="syn-box" v-infinite-scroll="loadMoreChannel"
									  	 infinite-scroll-disabled="loading"
									  	 infinite-scroll-distance="10"
									  	 infinite-scroll-immediate-check="false">

						<div class="syn-radio-wrapper" v-for="item in myChannel">
							<label class="syn-label">
								<input class="syn-radio" name="synRadio" type="radio" :value="item.id" @click="synchronizeId = item.id"/>
								<span class="syn-radio-label">{{item.name}}</span>
							</label>
							<span v-if="item.isManager" class="self"></span>
						</div>
					</div>
					<p class="loadtips" ref="loadtips"></p>
				</div>
			</section>
		</div>

		<!-- 打开相册选项 -->
		<mt-popup v-model="picSelVisible"
		  		  position="bottom"
		  		  :closeOnClickModal="false"
		  		  class="choose-pics-box">
			<v-pic-sel  @picSelControl="picSelVisible = false"
						@picSelSuccessControl="successToGetPic"></v-pic-sel>
		</mt-popup>
	</div>
	<div class="add-admin-panel" v-show="addAdminPanelVisiable">
		<v-select-admin :selEmpKind="selAdminKind"
						:isChoose="true"
						:type="'friends'"
						@panelControl="addAdminPanelVisiable=false"
						@adminCheckControl="adminCheckHandler"></v-select-admin>
	</div>

	
</div>
	
</template>
<script>
	import { Toast, MessageBox, Indicator } from 'mint-ui';
	import picSelTip from '../../components/channelList/picSelTip.vue';
	import myFriend from './myFriend.vue';
	import Swiper from '../../plugins/swiper/swiper.min';
	export default {
		data() {
			return {
				isOriginal: true, 
				originType: 0,//0原创  1转载
				synchronizeId: '',
				myChannel: [],
				blogTitle: '',
				blogInfo: '',
				synchronizeId: '',
				loading: false,
				myChannelPageNum: -1,
				myChannelTotalPage: 0,
				selAdminKind: 'friends',//friends:好友；admin:其他管理员
				selAdminIdArr: [],
				addAdminPanelVisiable: false,
				picSelVisible: false,
				imageArr: []

			}
		},
		components: {
			'v-pic-sel': picSelTip,
			'v-select-admin': myFriend
		},
		props: {
			id: {},
			empNumber: {},
			type: {}
		},
		mounted(){
			// 我的频道
			this.myChannelPageNum++;
			this.getMyChannel(this.myChannelPageNum);
		},
		methods: {
			getUrl(type){
				var url
				if(type == 'blog'){
					url = '/KMS-MSERVER/blog/save';
				}else if(type == 'theme'){
					url = '/KMS-MSERVER/discussion/save';
				}
				return url;
			},
			getMyChannel(pageNum){
				var url = '/KMS-MSERVER/mobileChannel/search/channelList?type=3&&isFocus=1&&empNumber=' + this.empNumber;
				url += '&&startPage=' + pageNum;
				this.$http({
					method: 'GET',
					url: this.$global().host + url
				}).then(
					response =>{
						this.myChannel = response.body.data;
						this.myChannelTotalPage = response.body.totalPage;
					}
				);
			},
			loadMoreChannel(){
				this.myChannelPageNum++;
				if(this.myChannelPageNum >= this.myChannelTotalPage){
					return  this.loading = true,
							this.$refs.loadtips.innerHTML = '没有更多数据了';
				}
				var url = '/KMS-MSERVER/mobileChannel/search/channelList?type=3&&isFocus=1&&empNumber=' + this.empNumber;
				url += '&&startPage=' + this.myChannelPageNum;
				this.$refs.loadtips.innerHTML = '正在加载中...';	
				this.$http({
					method: 'GET',
					url: this.$global().host + url
				}).then(
					response =>{
						this.myChannel = this.myChannel.concat(response.body.data);
					}
				);
			},
			adminCheckHandler(parm) {//获取选择管理员
				//console.log(parm);
				this.selAdminIdArr = parm.admin;
				//this.reSetSwiper();
			},
			successToGetPic(parm){//添加图片
				console.log(parm);
				this.imageArr.push(parm);
				this.picSelVisible = false;
			},
			deletePic(index){
				MessageBox.confirm('删除后将不可恢复，确定删除第'+ (index + 1) +'个图片?').then(action => {
					//console.log(action);
				  	if(action == 'confirm'){
				  		this.imageArr.splice(index, 1);
				  	}
				},action=>{
					//console.log(action);
				});
			},
			cancelHandler() { //取消发表博客
				this.$emit('newBlogCancelControl');
			},
			publishHandler() { //发表博客
				if(!this.blogTitle){
					return Toast({message: '标题不能为空!', duration: 1000});
				}
				if(this.blogInfo.length < 140 && this.imageArr.length == 0 && this.type == 'blog'){//纯文字做字数检验
					//this.blogInfo = oldVal;
					return Toast({message: '纯文字内容不能少于140字!', duration: 1000});
				}

				if(this.blogInfo.length == 0 && this.imageArr.length == 0 && this.type == 'theme'){
					return Toast({message: '纯文字内容不能为空!', duration: 1000});
				}

				//http://10.202.4.75:8180/KMS-MSERVER/blog/save		
				//console.log(this.type);
				var url = this.getUrl(this.type);
				//console.log(url);
				var data = '';
				if(this.type == 'blog'){
					data = 'title=' + this.blogTitle;
					if(this.isOriginal){
						this.originType = 0;
					}else{
						this.originType = 1;
					}
					data += '&&copr=' + this.originType;
				}else if(this.type == 'theme'){
					
					data = 'theme=' + this.blogTitle;
				}
				
				data += '&&content=' + encodeURIComponent(JSON.stringify(this.blogInfo));
				data += '&&channelId=' + this.synchronizeId;
				data += '&&infoToUser=' + this.selAdminIdArr.join('@');
				data += '&&images=' + this.imageArr.join(',');
				console.log(url);
				Indicator.open('正在提交...');
				this.$http.post(this.$global().host + url, data).then(response => {
					Indicator.close();
					if(response.body.status == 1){
						Toast({message: '发表成功！', duration: 1000});
						this.$router.push({path: '/knowledge/channelDetailSuper', query: {'empNumber': this.empNumber}});
					}else if(response.body.errorMessage){
						Toast({message: response.body.errorMessage, duration: 1000});
					}
					this.$emit('newBlogCancelControl');
				});
			}
		},
		watch: {
			blogTitle(val, oldVal){
				if(this.type == 'blog'){
					if(val.length > 40){
						this.blogTitle = oldVal;
						Toast({message: '标题不能超过40字哦!', duration: 1000});
					}
				}else if(this.type == 'theme'){
					if(val.length > 30){
						this.blogTitle = oldVal;
						Toast({message: '标题不能超过30字哦!', duration: 1000});
					}
				}
				
			}
		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	@import '../../plugins/swiper/swiper.min.css';
	.new-blog-wrapper {
		.header-right-btn {
			.mint-button {
				text-align: right;
			}
		}
		.choose-pics-box{
			height: calc(~"1.173rem * 3 + 0.1rem + 1px");
		}
		.new-blog-content {
			.input-section {
				background-color: #fff;
				padding-left: 0.37rem;
				padding-bottom: 0.32rem;
				.title-box{
					width: 96.4%;
					height: .6rem;
					padding: .3rem 3.6% .3rem 0;
					line-height: .6rem;
				}
				.blog-title, .blog-content {
					width: 96.4%;
					font-size: 0.37rem;
					color: #999;
					border: none;
					resize: none;
				}
				.blog-title {
					.appearance-clear;
					width: 100%;
					height: 100%;
					line-height: .6rem;
					white-space: nowrap;
					//line-height: 1.2rem;
				}
				.blog-content {
					.appearance-clear;
					height: 4.8rem;
					padding: 0.4rem 3.6% 0.4rem 0;
					border-top: 1px solid #eee;
				}
				.blog-friends{
					font-size: 0;
					//height: 1.2rem;
					background-color: #fff;
					padding: .2rem 3.6% .2rem 0;
					text-align: left;
					span{
						display: inline-block;
						position: relative;
						height: .8rem;
						width: .8rem;
						margin-top: .2rem;
						margin-right: .1rem;
						img{
							height: 100%;
							width: 100%;
						}
						i{
							position: absolute;
							top: -0.2rem;
							right: -0.2rem;
							height: .4rem;
							width: .4rem;
							background-size: 300%;
							background-image: url(../../../static/img/shunfeng_signs4.png);
							.bgPosition(@signs4Width, @signs4Height, 23, 23, 0, 311);
						}
					}
				}
				.blog-sel-menu-wrapper {
					font-size: 0;
					span {
						display: inline-block;
						width: 0.58rem;
						height: 0.58rem;
						background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
						background-size: 310%;
						margin-right: 0.8rem;
						&.remind {
							font-size: 0.58rem;
							color: #999;
							background: none;
						}
						&.pic {//background: none;
							height: 0.48rem;
							background-size: 180%;
							.bgPosition(@signs4Width, @signs4Height, 44, 32, 0, 1652)!important;
						}
						&.camera {
							.bgPosition(@signs4Width, @signs4Height, 15, 25, 0, 28);
						}
						&.unknow {
							.bgPosition(@signs4Width, @signs4Height, 15, 25, 0, 28);
						}
					}
				}
			}
			.original-section {
				margin-top: 0.32rem;
				background-color: #fff;
				// padding: 0.22rem;
				height: 1.173rem;
				.origin-switch {
					float: right;
					margin-top: 0.22rem;
					margin-right: 0.32rem;
				}
				.original-text {
					float: left;
					display: block;
					margin-top: 0.27rem;
					margin-left: 0.32rem;
					font-size: 0.42rem;
					line-height: 0.63rem;
				}
				.mint-switch-core {
					width: 1.12rem;
					height: 0.68rem;
					&:after {
						width: 0.56rem;
						height: 0.56rem;
						top: 5%;
					}
					&:before {
						width: 1.05rem;
						height: 0.62rem;
					}
				}
				.mint-switch-input:checked + .mint-switch-core {
					background-color: #ff4143;
					border-color: #ff4143;
					&:after {
						.transform-translateX(82%);
					}
				}
				.mint-switch-label {
					font-size: 0.42rem;
					line-height: 0.63rem;
				}
			}
			.syn-section {
				background-color: #fff;
				margin-top: 0.32rem;
				/*margin-bottom: 0.64rem;*/
				.syn-title {
					font-size: 0.42rem;
					line-height: 0.63rem;
					color: #333;
					padding: 0.27rem 0.32rem;
					border-bottom: 1px solid #eee;
				}
				.syn-list {
					max-height: calc(~"100vh - 46px - 1.17rem");
					overflow-y: auto;
					.syn-radio-wrapper {
						height: 1.173rem;
						position: relative;
						.syn-label {
							margin-left: 3.6%;
							display: inline-block;
							border-bottom: 1px solid #eee;
							height: 100%;
							width: 96.4%;
						}
						.syn-radio {
							.appearance-clear;
							width: 0.4rem;
							height: 0.4rem;
							padding: 0.24rem;
							background-color: #fff;
							border: 1px solid #ccc;
							border-radius: 50%;
							position: relative;
							top: 50%;
							vertical-align: top;
							.transform-translateY(-50%);
							&:checked {
								background-color: #ff4341;
								border: 1px solid #ff4341;
							}
						}
						.syn-radio-label {
							font-size: 0.37rem;
							line-height: 0.55rem;
							position: relative;
							top: 0.3115rem;
							margin-left: 0.2rem;
							width: 76%;
							display: inline-block;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
						.self {
							display: block;
							width: 0.4rem;
							height: 0.4rem;
							position: absolute;
							right: 0.32rem;
							top: 0.3865rem;
							background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
							background-size: 350%;
							.bgPosition(@signs4Width, @signs4Height, 19, 20, 0, 89);
						}
					}
					.loadtips{
						line-height: .6rem;
					}
				}
			}
		}
	}
</style>