<template>
	<div class="channel-detail-item-wrapper">
		<a class="info-wrapper" href="javascript:void(0)" @click="showBlogDetailHandler">
			<h5 class="title">
				<span class="inner-title">{{channelSuperItem.title || '未知'}}</span>
				<span class="kind-icon" :class="{'media': channelSuperItem.knowledgeType == 'KNO_DOCUMENT_FORMAT_14'}"></span>
			</h5>
			<p class="intro ellipsis-line-2" v-if="contentText != ''">
				{{ contentText }}
			</p>
		</a>
		<div class="info-kind" :class="channelSuperItem.contentType">{{contentType}}</div>
		<div class="img-list">
			<img v-for="item in contentImg" :src="item" alt="">
		</div>
		<div class="item-footer">
			<span class="date">{{channelSuperItem.createDateStr.slice(0,10)}}</span>
			<span class="read"><b class="read-num">{{channelSuperItem.readCount}}</b></span>
			<span class="praise"><b class="praise-num">{{channelSuperItem.praiseCount}}</b></span>
		</div>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				channelSuperItem: {
					contentId: 0,
					title: '未知',
					contentType: '未知',
					listContent: [],
					createName: '未知',
					readCount: 0,
					knowledgeType: "0",
					createDateStr: "未知",
					praiseCount: 0
				}
			}
		},
		props: {
			contentByP: {
				type: Object
			}
		},
		computed: {
			contentType() {
				switch(this.channelSuperItem.contentType) {
					case 'theme':
						return '讨论';
					case 'blog':
						return '博客';
					case 'knowledge':
						return '知识';
					case 'information':
						return '资讯';
					case 'consult':
						return '请教';
					default: 
						return '未知'
				}
			},
			contentText() {
				if (this.channelSuperItem.listContent && this.channelSuperItem.listContent.length > 0) {
					for (let i = 0; i < this.channelSuperItem.listContent.length; i++) {
						if ( this.channelSuperItem.listContent[i].type == 'text' ) {
							return this.channelSuperItem.listContent[i].text;
						}
					}
				}
				return '';
			},
			contentImg() {
				var temp = [];
				if (this.channelSuperItem.listContent && this.channelSuperItem.listContent.length > 0) {
					for (let i = 0; (i < this.channelSuperItem.listContent.length) && (temp.length < 3); i++) {
						if ( this.channelSuperItem.listContent[i].type == 'image' ) {
							temp.push(this.$global().imgHost + this.channelSuperItem.listContent[i].src);
						}
					}
				}
				return temp;
			}
		},
		mounted() {
			this.channelSuperItem = this.contentByP;
		},
		methods: {
			showBlogDetailHandler() {
				this.$emit('showBlogDetailControl');
			}
		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	.channel-detail-item-wrapper {
		position: relative;
		.info-wrapper {
			display: block;
			.title {
				width: 87%;
				margin-bottom: 0.22rem;
				max-height: 1.12rem;
				overflow: hidden;
				.inner-title {
					display: inline-block;
					max-width: calc(~'100% - 0.84rem');
					font-size: 0.42rem;
					line-height: 0.56rem;
					position: relative;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.kind-icon {
					display: inline-block;
					width: 0.42rem;
					height: 0.32rem;
					background-color: #fff;
					vertical-align: top;
					position: relative;
					top: 0.3rem;
					margin-top: -0.16rem;
					&.media {
						background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
						background-size: 294%;
						.bgPosition(@signs4Width, @signs4Height, 29, 18, 0, 0);
					}
				}
			}
			.intro {
				color: #666;
				font-size: 0.37rem;
				line-height: 0.45rem;
				max-height: 0.88rem;
				overflow: hidden;
				margin-bottom: 0.23rem;
			}
		}
		.info-kind {
			width: 1.12rem;
			font-size: 0.32rem;
			text-align: center;
			border: 1px solid #ccc;
			border-radius: 2px;
			position: absolute;
			right: 0;
			top: 0;
			&.blog {
				color: #73a7bf;
				border: 1px solid #73a7bf;
			}
			&.theme {
				color: #01dc0c;
				border: 1px solid #01dc0c;
			}
			&.knowledge {
				color: #fd8447;
				border: 1px solid #fd8447;
			}
			&.information {
				color: #9687ca;
				border: 1px solid #9687ca;
			}
			&.consult {
				color: #9687ca;
				border: 1px solid #9687ca;
			}
		}
		.img-list {
			margin-bottom: 0.22rem;
			font-size: 0;
			img {
				width: 2.24rem;
				height: 2.24rem;
				border-radius: 5px;
				&:nth-child(2) {
					margin: 0 2%;
				}
			}
		}
		.item-footer {
			width: 80%;
			overflow: hidden;
			position: relative;
			> span {
				position: relative;
				padding-left: 0.53rem;
				margin-right: 13%;
				font-size: 0.32rem;
				line-height: 0.48rem;
				b {
					color: #666;
					font-weight: normal;
					font-size: 0.32rem;
					line-height: 0.48rem;
				}
				&:before {
					content: "";
					position: absolute;
					left: 0;
					top: 50%;
					display: block;
					width:0.53rem;
					height: 0.32rem;
					margin-top: -0.16rem;
					background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
					background-size: 315%;
					.bgPosition(@signs4Width, @signs4Height, 22, 16, 0, 63);
				}
				&:last-child {
					margin-right: 0;
					float: right;
				}
			}
			.date {
				&:before {
					background-size: 223%;
					.bgPosition(@signs4Width, @signs4Height, 20, 20, 0, 1337);
				}
			}
			.read {
				position: absolute;
				left: 50%;
				.transform-translateX (-50%);
				&:before {
					background-size: 260%;
					.bgPosition(@signs4Width, @signs4Height, 22, 16, 0, 1368);
				}
			}
			.praise {
				&:before {
					background-size: 225%;
					.bgPosition(@signs4Width, @signs4Height, 22, 20, 0, 1393);
				}
			}
		}
	}
</style>