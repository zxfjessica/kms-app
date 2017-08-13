<template>
	<div class="ma-item-wrapper">
		<a href="javascript:void(0)">
			<div class="img-wrapper">
				<img :src="$global().imgHost + itemByP.coverPath" alt="">
			</div>
			<div class="item-info" 
				:class="{'expert-item-info': itemTypeByP=='expert'}">
				<h3>
					{{itemByP.name || '未知'}}
					<span class="icon" 
						:class="{'expert': itemByP.expertFlag, 'master': itemByP.master}">
					</span>
					<i>{{itemByP.deptName || '未知'}}</i>
				</h3>
				<p class="tag">
					{{(itemByP.label && itemByP.label.split(',').join(' | ')) || '这个人很懒，什么都没写'}}
				</p>
				<p class="intro">{{itemByP.skilledFieldDesc || '这个人很懒，什么都没写'}}</p>
				<p class="intro-detail" @click.stop="contentDetailHandler">{{itemByP.content || ''}}</p>
			</div>
			<!-- 专家频道列表项 -->
			<div class="consult-wrapper" v-if="itemTypeByP=='expert_channel'">
				<p class="consult-num"><span>{{itemByP.askedMeetingCount || 0}}</span>人请教</p>
				<a class="consult-btn" 
					href="javascript:void(0);" 
					@click.stop="consultTo(itemByP.empNumber)"
					:class="{'hide': isSelf}">
					<span>向TA请教</span>
				</a> 
			</div>
			<!-- 认证专家达人列表项 -->
			<p class="expert-consult-num" v-if="itemTypeByP=='expert'"><span>{{itemByP.askedMeetingCount}}</span>人请教</p>
		</a>
	</div>
</template>
<script>
	export default {
		props: {
			itemTypeByP: {
				type: String,
				default: 'expert_channel'
			},
			itemByP: {
				type: Object
			}
		},
		computed: {
			isSelf() {
				if(localStorage.getItem('channelEmpNumber') == this.itemByP.empNumber) {
					return true;
				}
				return false;
			}
		},
		methods: {
			consultTo(emp) {
				this.$router.push({path: '/knowledge/meetOnlineConsult/-1', query: {empNumber: emp}});
			},
			contentDetailHandler() {
				if (!this.itemByP.content ||
						!this.itemByP.contentId ||
						!this.itemByP.contentType) {
					return;
				}
				if (this.itemByP.contentType == 'consult') {
					this.$router.push({ 'path': '/knowledge/consultationDetail/' + this.itemByP.contentId});
				} else {
					this.$router.push({ 'path': '/knowledge/channelDetailBlog', 'query': { id: String(this.itemByP.contentId), type: this.itemByP.contentType} });
				}
			}
		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	//专家频道列表项、认证专家达人列表项
	.ma-item-wrapper {
		position: relative;
		a {
			display: block;
		}
		.img-wrapper {
			display: inline-block;
			vertical-align: top;
			img {
				width: 1.8rem;
				height: 2.4rem;
			}
		}
		.item-info {
			width: 53%; 
			display: inline-block;
			margin-left: 0.2rem;
			.transform-translateY (-0.1rem); 
			&.expert-item-info {
				width: 73%;
				.intro-detail {
					width: 72%;
				}
			}
			h3 {
				font-size: 0.42rem;
				line-height: 0.63rem;
				margin-bottom: 0.16rem;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				.icon {
					display: inline-block;
					width: 0.26rem;
					height: 0.24rem;
					vertical-align: baseline;
					margin: 0 0.17rem;
					background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
					background-size: 311%;
					&.expert {
						.bgPosition(@signs4Width, @signs4Height, 23, 22, 0, 279);
					}
					&.master {
						.bgPosition(@signs4Width, @signs4Height, 23, 16, 0, 980);
					}
				}
				.master {
					display: inline-block;
					width: 0.26rem;
					height: 0.24rem;
					vertical-align: baseline;
					margin: 0 0.17rem;
					background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
					background-size: 311%;
					.bgPosition(@signs4Width, @signs4Height, 23, 22, 0, 980);
				}
				i {
					font-size: 0.32rem;
					line-height: 0.48rem;
					color: #666;
				}
			}
			.tag, .intro {
				color: #aaa;
				font-size: 0.32rem;
				line-height: 0.48rem;
			}
			.tag, .intro, .intro-detail {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.intro-detail {
				color: #777;
				font-size: 0.37rem;
				line-height: 0.55rem;
				margin-top: 0.26rem;
			}
		}
		.consult-wrapper {
			position: absolute;
			top: 0%;
			//top: 50%;
			right: 0;
			//.transform-translateY (-50%); 
			.consult-num {
				font-size: 0.32rem;
				margin-bottom: 0.26rem;
				color: #ea3d3e;
			}
			.consult-btn {
				display: block;
				width: 1.57rem;
				height: 1.57rem;
				background-color: #ff4143;
				color: #fff;
				text-align: center;
				border-radius: 50%;
				position: relative;
				span {
					display: block;
					width: 1rem;
					position: absolute;
					left: 50%;
					top: 50%;
					font-size: 0.37rem;
					.transform-translate (-50%, -50%); 
				}
				&.hide {
					display: none;
				}
			}
		}
		.expert-consult-num {
			font-size: 0.32rem;
			line-height: 0.48rem;
			position: absolute;
			right: 0;
			top: 0.155rem;
			color: #fb9272;
		}
	}
</style>