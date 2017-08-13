<template>
	<div>
		<div class="apply-main" v-show="!addAdminPanelVisiable&&!selKindPanelVisiable">
			<v-common-header>
				<mt-button slot="rightContent" class="strategy-btn">
				 	申请攻略
				 	<!-- <router-link to="/channelApply">申请攻略</router-link> -->
				</mt-button>
			</v-common-header>
			<div class="container channel-apply-container">
				<div class="setting-content">
					<div class="cover-wrapper">
						<p class="cover-title">频道封面</p>
						<div class="cover-sel" @click="picSelVisible=true">
							<img src="../../../static/img/banner/peixun.png" alt="">
						</div>
					</div>
					<div class="info-wrapper">
						<p><span class="icon-must">*</span>频道名称</p>
						<input type="text" placeholder="输入频道名称" class="integral-name" />
						<p><span class="icon-must">*</span>频道简介</p>
						<textarea name="integralIntro" placeholder="简单介绍一下你的频道吧~" cols="30" rows="10" class="integral-intro"></textarea>
					</div>
					<div class="integral-wrapper">
						<p>订阅所需积分</p>
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
								@click="selIntegralHandler">
								其他积分
							</span>
						</div>
						<div class="other-integral" v-show="integralActive==3">
							<input class="other-integral-text" placeholder="请输入不超过200的积分" type="text">
							<span class="sure-btn">确定</span>
						</div>
					</div>
					<div class="sel-kind-wrapper" @click.stop="openSelHandler">
						<p>选择分类</p>
						<span class="sel-kind">{{selKind}}</span>
						<span class="left-arrow"></span>
					</div>
					<div class="admin-wrapper">
						<p>其他管理员</p>
						<div class="add-btn-wrapper">
							<span class="add-admin-btn" @click="addAdminPanelVisiable=true">+</span>
						</div>
					</div>
				</div>
				<div class="submit-btn">提交</div>
			</div>
			<v-pic-sel :picSelVisibleByP="picSelVisible"
					@picSelControl="picSelVisible=false">
			</v-pic-sel>
		</div>
		<!-- 管理员选择面板 -->
		<div class="add-admin-panel" v-show="addAdminPanelVisiable">
			<v-sel-admin @panelControl="addAdminPanelVisiable=false"></v-sel-admin>
		</div>
		<!-- 管理员选择面板 -->
		<!-- 选择分类面板  -->
		<div classs="sel-kind-panel" v-show="selKindPanelVisiable">
			<mt-header title="选择分类" class="is-fixed">
				<div slot="left">
				    <mt-button icon="back" @click="selKindPanelVisiable=false"></mt-button>
				</div>
			</mt-header>
			<div class="sel-kind-container container">
				<div class="sel-kind-title">
					<p>选择分类{{cateListVisiable}}</p>
				</div>
				<div class="cate-list-wrapper">
					<ol class="cate-list" v-show="cateListVisiable==0">
						<li :data-level="0" @click="cateLevelSelHandler">
							<h6>综合服务</h6>
							<span class="left-arrow"></span>
						</li>
					</ol>
					<ol class="cate-list" v-show="cateListVisiable==1">
						<li :data-level="1" @click="cateLevelSelHandler">
							<h6>综合服务1</h6>
							<span class="left-arrow"></span>
						</li>
					</ol>
					<ol class="cate-list" v-show="cateListVisiable==2">
						<li :data-level="2" @click="cateLevelSelHandler">
							<h6>综合服务2</h6>
						</li>
					</ol>
				</div>
			</div>
		</div>
		<!-- 选择分类面板  -->
	</div>
</template>
<script>
	import commonHeader from '../../components/commonHeader.vue';
	import picSelTip from '../../components/channelList/picSelTip.vue';
	import myFriend from './myFriend.vue';
	export default {
		data() {
			return {
				integralActive: 0,//0:免费，1:69,2:99,3：其他
				otherIntegralVisiable: false,
				selKind: 'HR雅虎',//选中的类型
				addAdminPanelVisiable: false,//其他管理员面板开关
				selKindPanelVisiable: false,
				cateListVisiable: 0,//选择列表的层级：0：第一级，1：第二级，2：第三级
				picSelVisible: false
			}
		},
		components: {
			'v-common-header': commonHeader,
			'v-pic-sel': picSelTip,
			'v-sel-admin': myFriend
		},
		methods: {
			openSelHandler() {
				this.selKindPanelVisiable=true;
				this.cateListVisiable = 0;
			},
			cateLevelSelHandler(event) {
				if(Number(event.currentTarget.getAttribute('data-level')) > 1) {
					this.selKind = event.currentTarget.getElementsByTagName('h6')[0].innerHTML;
					this.selKindPanelVisiable = false;
					return;
				}
				this.cateListVisiable = Number(event.currentTarget.getAttribute('data-level')) + 1;
			},
			selIntegralHandler(event) {
				this.integralActive = event.currentTarget.getAttribute('data-id');
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
		p {
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
				border-radius: 5px;
				padding: 2%;
				font-size: 0.37rem;
				line-height: 0.5rem;
			}
			.integral-name {
				margin-bottom: 0.24rem;
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
					padding: 0.26rem 0;
					border-radius: 3px;
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
					top: -18%;
					border-bottom: 8px solid #ff9a35;
					border-left: 8px solid transparent;
					border-right: 8px solid transparent;
				}
				&:after {
					content: "";
					position: absolute;
					right: 9%;
					top: -18%;
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
				.add-admin-btn {
					border: 1px solid #eee;
					color: #666;
					display: block;
					width: 0.96rem;
					height: 0.96rem;
					padding: 0.13rem;
					font-size: 1.2rem;
					text-align: center;
					line-height: 0.9rem;
				}
			}
		}
	}
	.sel-kind-container{
		.sel-kind-title {
			height: 1.17rem;
			padding: 0 0.32rem;
			p {
				line-height: 1.17rem;
				font-size: 0.48rem;
				color: #666;
			}
		}
		.cate-list-wrapper {
			height: calc(~"100vh - 1.17rem - 46px");
			overflow-y: scroll;
		}
		.cate-list {
			background-color: #fff;
			li {
				height: 0.83rem;
				border-bottom: 1px solid #eee;
				margin-left: 0.32rem;
				padding-top: 0.37rem;
				position: relative;
				h6 {
					font-size: 0.46rem;
					line-height: 0.46rem;
				}
			}
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
	}
</style>