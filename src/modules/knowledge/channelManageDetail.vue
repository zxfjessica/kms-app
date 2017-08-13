<template>
	<div class="top-container">
		<div class="manage-detail-main" v-show="!addAdminPanelVisiable && !selKindPanelVisiable">
			<v-common-header :reTitle="'管理频道'">
				<div slot="rightContent">
				    <span @click="saveModify" v-if="$route.query.result!=3">保存修改</span>
				    <span @click="saveModify" v-if="$route.query.result==3">提交</span>
				</div>
			</v-common-header>
			<div class="manage-detail-container container">
				<p class="is-ready-to-show" v-if="showOnloading">加载中...</p>
				<div class="sroll-box channel-apply-container" v-if="!showOnloading">
					<div class="modify-content">
						<div class="cover-wrapper">
							<p class="cover-title channel-line">频道封面</p>
							<div class="cover-sel" @click="picSelVisible = true">
								<img :src="$global().imgHost + headImage" alt="">
							</div>
						</div>
						<div class="info-wrapper">
							<p class="channel-line"><span class="icon-must">*</span>频道名称</p>
							<input type="text" placeholder="输入频道名称(请控制在6个字以内)" v-model="channelName" class="integral-name" />
							<p class="channel-line"><span class="icon-must">*</span>频道简介</p>
							<textarea name="integralIntro" placeholder="简单介绍一下你的频道吧~" v-model="channelIntro" cols="30" rows="10" class="integral-intro"></textarea>
						</div>
						<div class="integral-wrapper">
							<p class="channel-line">订阅所需积分</p>
							<div class="integral-list">
								<span class="integral-item" 
									:class="{'selected':integralActive==0}"
									:data-id="0"
									@click="selIntegralHandler">
									免费
								</span>
								<span class="integral-item icon-item" 
									:class="{'selected':integralActive==1}"
									:data-id="1"
									@click="selIntegralHandler">
									69
								</span>
								<span class="integral-item icon-item" 
									:class="{'selected':integralActive==2}"
									:data-id="2"
									@click="selIntegralHandler">
									99
								</span>
								<span class="integral-item other" 
									:class="{'selected':integralActive==3}"
									:data-id="3"
									@click="selIntegralHandler"
									ref="otherIntegral">
									其他积分
								</span>
							</div>
							<div class="other-integral" v-show="integralActive==3 && !integralFinish"><!--  -->
								<input class="other-integral-text" v-model="customIntegral" type="text">
								<span class="sure-btn" @click="changeIntegralHandler">确定</span> <!-- -->
							</div>

						</div>
						<div class="sel-kind-wrapper" @click.stop="selKindPanelVisiable = true"><!--  -->
							<p class="channel-line">选择分类</p>
							<span class="sel-kind">{{selKind}}</span>
							<span class="left-arrow"></span>
						</div>
					</div>
					<div class="recommend-wrapper">
						<p class="recommend-title" v-if="$route.query.result==0">推荐至本频道的内容</p>
						<ul class="recommend-list" v-if="recommendList.length > 0">
							<li v-for="list in recommendList">
								<router-link :to="{ 'path': '/knowledge/channelDetailBlog', 'query': { id: String(list.contentId), type: list.contentType}}">
									<div class="recommend-list-wrapper">
										<router-link :to="'/knowledge/channelDetailSuper?empNumber=' + list.empNumber">
											<img :src="$global().imgHost + list.headPath">
										</router-link>
										<div class="right-other">
											<router-link :to="'/knowledge/channelDetailSuper?empNumber=' + list.empNumber">
												<span>{{list.name}}</span>
											</router-link>
											<p class="intro">{{list.title}}</p>
										</div>
									</div>
								</router-link>
								<div class="oper-btn">
									<span class="pass-btn" @click="pending(list.id, 1)">通过</span>
									<span class="nopass-btn" @click="showRefuseBox = true, refuseID = list.id">拒绝</span>
								</div>
							</li>
						</ul>
					</div>
					<!-- 打开相册选项 -->
					<mt-popup v-model="picSelVisible"
					  		  position="bottom"
					  		  :closeOnClickModal="false">
						<v-pic-sel  @picSelControl="picSelVisible = false"
									@picSelSuccessControl="successToGetPic"></v-pic-sel>
					</mt-popup>

				</div>
				
			</div>
		</div>
		<!-- 选择分类面板  -->
		<v-channel-types-select v-show="selKindPanelVisiable"
								@watchTypes="getTypesData"
								@watchSelKindPanel="selKindPanelVisiable = false"></v-channel-types-select>
		<!-- 选择分类面板  -->
		<!-- 审核拒绝 -->
		<v-message-box v-if="showRefuseBox" :width="70" :isShowShadowBg="true">
			<div slot="title">
				<div>拒绝的理由</div>
			</div>
			<div slot="content">
				<div class="content">
					<div class="cause">
						<textarea v-model="refuseNote" placeholder="请输入拒绝理由"></textarea>
					</div>
				</div>
			</div>
			<span slot="confirm" @click="pending(refuseID, 2)">确定</span>
			<span slot="cancel" @click="showRefuseBox = false, refuseNote = ''">取消</span>
		</v-message-box>
		<!-- 审核拒绝 -->
	</div>
</template>
<script>
	import { Toast, MessageBox } from 'mint-ui';
	import commonHeader from '../../components/commonHeader.vue';
	import picSelTip from '../../components/channelList/picSelTip.vue';
	import channelTypesSelect from '../../components/common/channelTypesSelect.vue';
	import messageBox from '../../components/common/messageBox.vue';
	import { bytesCount } from '../../js/commonFunction';
	export default {
		data() {
			return {
				showOnloading: true,
				picSelVisible: false,
				addAdminPanelVisiable: false,
				selKindPanelVisiable: false,
				channelId: '',
				channelDetailData: {},
				selAdminKind: 'friends',//friends:好友；admin:其他管理员
				channelName: '',
				channelIntro: '',
				integralActive: 0,//选中积分：0:免费，1:69,2:99,3：其他
				recommendList: [],
				selIntegral: '',
				cateId: '',
				selKind: '',
				headImage: '',
				showRefuseBox: false,
				refuseNote: '',
				refuseID: '' //审核拒绝通过的频道的id
			}
		},
		components: {
			'v-pic-sel': picSelTip,
			'v-common-header': commonHeader,
			'v-channel-types-select': channelTypesSelect,
			"v-message-box": messageBox
		},
		mounted(){
			this.channelId = this.$route.query.id;
			this.getChannelDetail();
			this.getRecommendList();
		},
		methods: {
			getChannelDetail(){		
				var url = '/KMS-MSERVER/mobileChannel/channelInit';
				url += '?channelId=' + this.channelId;				
				this.$http({
					method: 'GET',
					url: this.$global().host + url
				}).then(response=>{
					this.showOnloading = false;
					if(response.body.status == 1){
						this.channelDetailData = response.body.data;
						this.channelName = response.body.data.name;
						this.channelIntro = response.body.data.description;
						this.selIntegral = response.body.data.score;
						this.cateId = response.body.data.cateId;
						this.selKind = response.body.data.categoryName;
						this.headImage = response.body.data.headImage;
					}else if(response.body.errorMessage){
						Toast({message: response.body.errorMessage, duration: 1000});
					}
					
				});
			},
			getRecommendList(){					
				var url = '/KMS-MSERVER/mobileChannel/auditChannelRecomedList';
				url += '?channelId=' + this.channelId;				
				this.$http({
					method: 'GET',
					url: this.$global().host + url
				}).then(response=>{
					if(response.body.status == 1){;
						this.recommendList = response.body.data;
					}else if(response.body.errorMessage){
						Toast({message: response.body.errorMessage, duration: 1000});
					}
					
				});
			},
			getTypesData(parm){//修改分类
				this.selKind = parm.selKind;
				this.cateId = parm.cateId;
			},
			successToGetPic(parm){//修改封面
				this.headImage = parm;
			},
			selIntegralHandler(event) {//选择积分
				this.integralActive = event.currentTarget.getAttribute('data-id');
				if (event.currentTarget.getAttribute('data-id') != '3') {
					if (!Number(event.currentTarget.innerHTML)) {//免费
						this.selIntegral = 0;
					}else {
						this.selIntegral = Number(event.currentTarget.innerHTML);
					}
				} else {
					this.selIntegral = this.customIntegralSure;
					this.integralFinish = false;
				}
				
			},
			changeIntegralHandler() {//自定义积分
				if (this.customIntegral == '') {
					Toast({message: '请输入积分！', duration: 1000});
					return;
				}
				if (!Number(this.customIntegral)) {
					Toast({message: '请输入正确格式积分！', duration: 1000});
					return;
				}
				if (Number(this.customIntegral) > 200) {
					Toast({message: '积分不得超过200！', duration: 1000});
					return;
				}
				this.selIntegral = Number(this.customIntegral);
				this.$refs.otherIntegral.innerHTML = this.customIntegral;
				this.customIntegral = '';
				this.integralFinish = true;
			},
			saveModify() {//频道申请提交事件
				if (this.channelName == '') {
					Toast({message: '请输入频道名称！', duration: 1000});
					return;
				}
				if(bytesCount(this.channelName) > 12){
					return Toast({message: '频道名称不能超过6字！', duration: 1000});
				}
				if (this.channelIntro == '') {
					Toast({message: '请输入频道简介！', duration: 1000});
					return;
				}
				if(this.channelIntro.length > 80){
					return Toast({message: '频道简介不能超过80字！', duration: 1000});
				}
				if (this.selKind == '') {
					Toast({message: '请选择频道分类！', duration: 1000});
					return;
				}
				if (this.integralActive == '3') {
					 //其他积分
					if (this.$refs.otherIntegral.innerHTML == '其他积分' ||  Number(this.$refs.otherIntegral.innerHTML) == NaN) {
						Toast({message: '请选择积分！', duration: 1000});
						return;
					} else {
						this.selIntegral = Number(this.$refs.otherIntegral.innerHTML);
					}
				}
				var newChannelInfo = {};
				newChannelInfo.channelId = this.channelId;
				newChannelInfo.name = this.channelName;
				newChannelInfo.description = this.channelIntro;
				newChannelInfo.score = this.selIntegral;
				newChannelInfo.cateId = this.cateId;
				newChannelInfo.headImage = this.headImage;
				this.$http.get(this.$global().host + '/KMS-MSERVER/mobileChannel/saveChannel', { params: newChannelInfo }).then(
					response => {
						if(response.status==200&&response.body.status){
							Toast({message: response.body.data.result, duration: 1000});
						}	
					},
					response =>{
						// error callback
					}
				)
			},
			pending(id, type){
				//http://10.202.4.75:8180/KMS-MSERVER/mobileChannel/auditChannelRecomed		
				if(this.refuseNote.length == 0){
					return Toast({message: '拒绝理由不能为空！', duration: 1000});
				}	
				var url = '/KMS-MSERVER/mobileChannel/auditChannelRecomed';	
				url += '?id=' + id;
				url += '&&note=' + this.refuseNote;
				url += '&&status=' + type;
				this.$http({
					method: 'GET',
					url: this.$global().host + url
				}).then(response=>{
					this.showRefuseBox = false;
					this.refuseNote = '';
					if(response.body.status == 1){
						Toast({message: response.body.data.result, duration: 1000});
						this.getRecommendList();
					}else if(response.body.errorMessage){
						Toast({message: response.body.errorMessage, duration: 1000});
					}
				});
			}
		},
		watch: {
			channelName(val, oldVal) {
				if(bytesCount(val) > 12 && oldVal != ''){
					return this.channelName = oldVal, Toast({message: '频道名称不能超过6字！', duration: 1000});

				}
			},
			channelIntro(val, oldVal) {
				if(val.length > 80 && oldVal !=''){
					return this.channelIntro = oldVal, Toast({message: '频道简介不能超过80字！', duration: 1000});

				}
			},
			refuseNote(val, oldVal) {
				if(val.length > 100){
					return this.refuseNote = oldVal, Toast({message: '拒绝理由不能超过100字！', duration: 1000});

				}
			}
		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	.manage-detail-main{
		.right-wrapper{
			.mint-header .mint-button{
				width: 100% !important;
			}
		}
	}
	.top-container{
		.v-message-box{
			.content{
				/*padding: 0 7%;*/
				text-align: left;
				font-size: 12px;
				div{
					margin-bottom: .15rem;
					color: #999;
					label{
						line-height: 0.7rem;
					}
					input, textarea{
						color: #999;
						width: calc(~"100% - 10px");
						padding: 0 5px;
						line-height: 0.6rem;
					}
					textarea{
						height: 1.1rem;
						line-height: .55rem;
					}
				}
				.cause{
					textarea{
						padding: 5px;
						margin-top: .3rem;
						height: 2.2rem;
					}
				}
			}
		}
	}
	
	.manage-detail-container {
		.mint-popup-bottom {
			height: auto;
		}
		.recommend-wrapper {
			background-color: #fff;
			margin-top: 0.24rem;
			.recommend-title {
				font-size: 0.48rem;
				line-height: 0.72rem;
				padding: 0.42rem 0.32rem;
				border-bottom: 1px solid #eee;
			}
			.recommend-list {
				background-color: #f2f2f2;
				li {
					padding-left: 0.32rem;
					padding-top: .3rem;
					margin-bottom: .3rem;
					background-color: #fff;
					.recommend-list-wrapper {
						font-size: 0;
					    height: 1.8rem;
					    display: block;

						img {
							width: 1.8rem;
							height: 1.8rem;
							vertical-align: top;
						}
						.right-other {
							display: inline-block;
							margin-left: 0.2rem;
							width: calc(~"100% - 2.3rem");
							padding-right: .3rem;
							span, .intro{
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
							}
							span {
								font-weight: 600;
								font-size: 0.4rem;
								line-height: 0.9rem;
								color: #333;
							}
							.intro {
								margin: 0;
								font-size: 0.37rem;
								line-height: 0.9rem;
								color: #999;
							}
							
						}
					}
					.oper-btn {
						padding-right: 0.3rem;
						margin-top: .3rem;
						display: block;
						line-height: 1.2rem;
						border-top: 1px solid #eee;
						text-align: right;
						span {
							font-size: 0.32rem;
						    border-radius: 2px;
						    padding: 0.12rem 0.45rem;
							&.pass-btn {
								border: 1px solid #eee;
								color: #333;
								margin-right: 0.4rem;
							}
							&.nopass-btn {
								border: 1px solid #ff4341;
								color: #ff4341;
							}
						}
					}
				}
			}
		}
			
		
	}
</style>