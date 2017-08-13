<template>
	<div>
		<div class="apply-main" v-show="!addAdminPanelVisiable&&!selKindPanelVisiable">
			<v-common-header>
				<mt-button slot="rightContent" class="strategy-btn">
				 	<router-link to="/knowledge/channelApply">申请攻略</router-link>
				</mt-button>
			</v-common-header>
			<div class="container channel-apply-container">
				<div class="setting-content">
					<div class="cover-wrapper" @click="picSelVisible = true">
						<p class="cover-title channel-line">频道封面</p>
						<div class="cover-sel">
							<img src="../../../static/img/user-default.png" v-if="!imageArr" alt="">
							<img :src="$global().imgHost + imageArr" v-if="imageArr" alt="">
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
						<div class="other-integral" v-show="integralActive==3 && !integralFinish">
							<input class="other-integral-text" placeholder="请输入不超过200的积分" v-model="customIntegral" type="text">
							<span class="sure-btn" @click="changeIntegralHandler">确定</span>
						</div>
					</div>
					<div class="sel-kind-wrapper" @click.stop="selKindPanelVisiable=true">
						<p class="channel-line">选择分类</p>
						<span class="sel-kind">{{selKind}}</span>
						<span class="left-arrow"></span>
					</div>
					<div class="admin-wrapper">
						<p class="channel-line">其他管理员</p>
						<div class="add-btn-wrapper">
							<img v-for="item in selAdminImgArr" :src="$global().imgHost + item" alt="">
							<span class="add-admin-btn" @click="addAdminPanelVisiable = true">+</span><!-- openSelAdminHandler -->
						</div>
					</div>
				</div>
				<div class="submit-btn" @click="channelApplySubmit">提交</div>
			</div>
			<mt-popup
			  v-model="picSelVisible"
			  position="bottom"
			  :closeOnClickModal="false">
				<v-pic-sel  @picSelControl="picSelVisible=false"
							@picSelSuccessControl="successToGetPic"
							ref="picSel"></v-pic-sel>
			</mt-popup>
		</div>
		<!-- 管理员选择面板 -->
		<div class="add-admin-panel" v-show="addAdminPanelVisiable">
			<v-sel-admin :selEmpKind="selAdminKind"
						 :isChoose="true"
						 :type="'admins'"
						 @panelControl="addAdminPanelVisiable=false"
						 @adminCheckControl="adminCheckHandler">
			</v-sel-admin>
		</div>
		<!-- 管理员选择面板 -->
		<!-- 选择分类面板  -->
		<v-channel-types-select v-show="selKindPanelVisiable"
								@watchTypes="getTypesData"
								@watchSelKindPanel="selKindPanelVisiable = false"></v-channel-types-select>
		<!-- 选择分类面板  -->
	</div>
</template>
<script>
	import commonHeader from '../../components/commonHeader.vue';
	import picSelTip from '../../components/channelList/picSelTip.vue';
	import channelTypesSelect from '../../components/common/channelTypesSelect.vue';
	import myFriend from './myFriend.vue';
	import {Toast} from 'mint-ui';
	import { bytesCount } from '../../js/commonFunction.js';
	export default {
		data() {
			return {
				integralActive: 0,//选中积分：0:免费，1:69,2:99,3：其他
				otherIntegralVisiable: false,
				selKind: '',//选中的类型
				addAdminPanelVisiable: false,//其他管理员面板开关
				selKindPanelVisiable: false,//选择分类面板
				picSelVisible: false,
				selAdminKind: 'friends',//friends:好友；admin:其他管理员
				selAdminIdArr: [],//选中管理员工号
				selAdminImgArr: [],//选中管理员工头像
				cateId: '',//选中类型的id
				channelName: '',//频道名称
				channelIntro: '',//频道简介
				selIntegral: 0,//选中积分
				customIntegral: '',//自定义积分
				integralFinish: false,
				imageArr: ''//头像
			}
		},
		components: {
			'v-common-header': commonHeader,
			'v-pic-sel': picSelTip,
			'v-sel-admin': myFriend,
			'v-channel-types-select': channelTypesSelect
		},
		mounted() {
		},
		methods: {
			channelApplySubmit() {//频道申请提交事件
				if (this.channelName == '') {
					Toast({message: '请输入频道名称！', duration: 1000});
					return;
				}
				if (this.channelIntro == '') {
					Toast({message: '请输入频道简介！', duration: 1000});
					return;
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
				newChannelInfo.name = this.channelName;
				newChannelInfo.description = this.channelIntro;
				newChannelInfo.score = this.selIntegral;
				newChannelInfo.cateId = this.cateId;
				newChannelInfo.headImage = this.imageArr;
				newChannelInfo.managerList = this.selAdminIdArr.join(',');
				var tipBox = Toast({
				  message: '开通申请中...',
				  duration: -1
				});
				this.$http.get(this.$global().host + '/KMS-MSERVER/mobileChannel/saveChannel', { params: newChannelInfo }).then(
					response => {
						if(response.status==200){
							tipBox.close();
							if (response.body.status) {
								Toast({message: response.body.data.result, duration: 1000});
								this.$router.go(-1);
								this.$refs.picSel.deleteFiles(); //删除图片缓存
							} else {
								Toast({message: response.body.errorMessage, duration: 1000});
							}
						}	
					}
				)
			},
			selIntegralHandler(event) {
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
			changeIntegralHandler() {
				//自定义积分
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
				this.selIntegral = Number(this.customIntegral);console.log(Number(this.customIntegral));
				this.$refs.otherIntegral.innerHTML = this.customIntegral;
				this.customIntegral = '';
				this.integralFinish = true;
			},
			adminCheckHandler(parm) {//获取选择管理员
				this.selAdminIdArr = parm.admin;
				this.selAdminImgArr = parm.adminImg;
			},
			getTypesData(parm){
				this.selKind = parm.selKind;
				this.cateId = parm.cateId;
				//console.log(parm);
			},
			successToGetPic(parm){
				this.imageArr = parm;
				this.picSelVisible=false;
			}
		},
		watch: {
			channelName(val, oldVal) {
				if(bytesCount(val) > 12){
					return this.channelName = oldVal, Toast({message: '频道名称不能超过6个字！', duration: 1000});
				}
			},
			channelIntro(val, oldVal) {
				if(val.length > 80){
					return this.channelIntro = oldVal, Toast({message: '频道简介不能超过80字！', duration: 1000});;
				}
			}
		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	.apply-main {
		.strategy-btn.mint-button {
			font-family: Microsoft YaHei, Arial;
			width: 100%!important;
			text-align: right;
			overflow: visible;
			label {
				position: relative;
				a {
					color: #fff;
				}
			}
		}
		.mint-popup-bottom {
			height: auto;
		}
	}
	.channel-apply-container {
		.setting-content {
			height: calc(~"100vh - 1rem - 46px");
			overflow-y: scroll;
		}
		.submit-btn {
			background-color: #ff4143;
			color: #fff;
			text-align: center;
			font-size: 0.48rem;
			height: 1rem;
			line-height: 1rem;
		}
		p.channel-line {
			font-size: 0.48rem;
			margin-bottom: 0.24rem;
		}
		.cover-wrapper{
			height: 1.17rem;
			background-color: #fff;
			padding: 0 0.32rem;
			.cover-title {
				float: left;
				font-size: 0.48rem;
				line-height: 1.17rem;
			}
			.cover-sel {
				float: right;
				margin-top: 0.185rem;
				position: relative;
				img {
					width: 0.8rem;
					height: 0.8rem;
					margin-right: 0.38rem;
				}
				&:after {
					content: '';
					position: absolute;
					top: 0.28rem;
					right: 0;
					width: 0.18rem;
					height: 0.24rem;
					background: url('../../../static/img/shunfeng_signs.png') no-repeat;
					background-size: 254%;
					.bgPosition(@signsWidth, @signsHeight, 14, 31, 0, 123);	
				}
			}
		}
		.info-wrapper {
			background-color: #fff;
			margin-top: 0.24rem;
			padding: 0.24rem 0.32rem;
			p {
				.icon-must {
					color: #ff4143;
					vertical-align: sub;
					margin-right: 0.08rem;
				}
			}
			.integral-name, .integral-intro {
				width: 96%;
				.appearance-clear;
				border: 1px solid #eee;
				border-radius: 3px;
				padding: 2%;
				font-size: 0.37rem;
				line-height: 0.5rem;
				color: #999;
			}
			.integral-name {
				margin-bottom: 0.24rem;
			}
			.integral-intro{
				resize: none;
			}
		}
		.integral-wrapper {
			background-color: #fff;
			padding: 0.42rem 0.32rem;
			margin-top: 0.24rem;
			.integral-list {
				overflow: hidden;
				.integral-item {
					display: block;
					float: left;
					width: calc(~"22% - 2px");
					text-align: center;
					color: #ff9a35;
					font-size: 0.37rem;
					margin-right: 4%;
					margin-bottom: 0.3rem;
					border: 1px solid #ff9a35;
					// padding: 0.26rem 0;
					border-radius: 3px;
					height: 1rem;
					line-height: 1rem;
					&:nth-child(4n) {
						margin-right: 0%;
					}
					&.selected {
						color: #fff;
						background-color: #ff9a35;
					}
					&.other {
						position: relative;
						&:after {
							content: "";
							position: absolute;
							bottom: 0.08rem;
							left: 50%;
							.transform-translateX(-50%);
							width: 0.24rem;
							height: 0.24rem;
							background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
							background-size: 550%;
							.bgPosition(@signs4Width, @signs4Height, 14, 7, 0, 798);
						}
						&.selected {
							&:after {
								.bgPosition(@signs4Width, @signs4Height, 14, 7, 0, 764);
							}
						}
					}
				}
				.icon-item {
					position: relative;
					text-indent: 6%;
					&:before {
						content: "";
						position: absolute;
						top: 50%;
						left: 22%;
						display: block;
						width: 0.42rem;
						height: 0.37rem;
						margin-top: -0.185rem;
						background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
						background-size: 260%;
						.bgPosition(@signs4Width, @signs4Height, 31, 24, 0, 403);
					}
					&.selected {
						&:before {
							.bgPosition(@signs4Width, @signs4Height, 31, 24, 0, 713);
						}
					}
				}
			}
			.other-integral {
				border: 1px solid #ff9a35;
				border-radius: 3px;
				background-color: #f2f2f2;
				padding: 0.16rem 0.08rem;
				position: relative;
				height: 0.86rem;
				.other-integral-text {
					width: calc(~"96% - 2px");
					height: 0.45rem;
					border: 1px solid #eee;
					font-size: 0.37rem;
					padding: 0.18rem;
					border-radius: 3px;
					.appearance-clear;
				}
				.sure-btn {
					position: absolute;
					right: calc(~"0.08rem + 1px");
					top: 1px;
					display: block;
					width: 1.7rem;
					height: calc(~"0.46rem - 2px");
					 padding: 0.18rem; 
					 margin-top: 0.16rem; 
					text-align: center;
					color: #fff;
					background-color: #ff9000;
					border: 1px solid transparent;
				}
				&:before {
					content: "";
					position: absolute;
					right: 9%;
					//top: -18%;
					top: -8px;
					margin-top: -0.5px;
					border-bottom: 8px solid #ff9a35;
					border-left: 8px solid transparent;
					border-right: 8px solid transparent;
				}
				&:after {
					content: "";
					position: absolute;
					right: 9%;
					//top: -18%;
					top: -7.5px;
					margin-right: 1px;
					margin-top: 1px;
					border-bottom: 7px solid #f2f2f2;
					border-left: 7px solid transparent;
					border-right: 7px solid transparent;
				}
			}
		}
		.sel-kind-wrapper {
			padding: 0 0.32rem;
			margin-top: 0.24rem;
			background-color: #fff;
			height: 1.17rem;
			position: relative;
			p {
				line-height: 1.17rem;
			}
			.left-arrow {
				position: absolute;
				right: 0.32rem;
				top: 50%;
				display: block;
				width: 0.18rem;
				height: 0.24rem; 
				margin-top: -0.12rem;
				background: url('../../../static/img/shunfeng_signs.png') no-repeat;
				background-size: 254%;
				.bgPosition(@signsWidth, @signsHeight, 14, 31, 0, 123);	
			}
			.sel-kind {
				position: absolute;
				right: 0.7rem;
				top: 0;
				height: 1.17rem;
				line-height: 1.17rem;
				font-size: 0.42rem;
				color: #666;
			}

		}
		.admin-wrapper {
			margin: 0.24rem 0;
			background-color: #fff;
			p {
				line-height: 1.17rem;
				border-bottom: 1px solid #eee;
				margin-left: 0.32rem;
			}
			.add-btn-wrapper {
				padding: 0.26rem 0.32rem;
				font-size: 0;
				img {
					display: inline-block;
					width: 1.22rem;
					height: 1.22rem;
					vertical-align: top;
					border: 1px solid #eee;
					margin: 0 0.1rem;
				}
				.add-admin-btn {
					border: 1px solid #eee;
					color: #666;
					display: inline-block;
					width: 0.96rem;
					height: 0.96rem;
					padding: 0.13rem;
					font-size: 1.2rem;
					text-align: center;
					line-height: 0.9rem;
					margin: 0 0.1rem;
				}
			}
		}
	}
</style>