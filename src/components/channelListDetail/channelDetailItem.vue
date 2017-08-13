<template>
	<div class="channel-item-wrapper" :data-id="item.contentId">
		 <h3 class="item-title">
			<span class="item-title-text">
				<b class="title-text">{{ item.title || '未知' }}</b>
				<i class="item-kind-icon" v-if="item.knowledgeType!=0" :class="{'media': item.knowledgeType == 'KNO_DOCUMENT_FORMAT_14'}"></i>
			</span>
			<span class="item-kind" :class="item.contentType">{{ contentType }}</span>
		</h3>
		<div class="item-intro" ref="itemIntro">
			<!-- 文本 -->
			<div class="inner-item-intro ellipsis-line-2" ref="innerItemIntro">
				{{contentText}}
			</div>
			<!-- 图片 -->
			<div class="item-pic-wrapper">
				<img v-for="item in contentImg" :src="item" alt="">
			</div>
		</div>	
		<p class="other-info">
			<router-link :to="{path:'/knowledge/channelDetailSuper',query:{empNumber:item.createId}}">
				<span class="editor">
				{{ item.createName || '未知' }}
				</span>
			</router-link>
			<span class="read"><i>{{ item.readCount || 0 }}</i>人浏览</span>
			<span v-if="item.createDateStr" class="thisDate">{{item.createDateStr | time}}</span>
		</p>		 
	</div>
</template>
<script>
	export default {
		data(){
			return {
				introOverflow: false,
			}
		},
		props: {
			contentByP: {
				type: Object
			},
			item: {
				type: Object
			}
		},
		computed: {
			contentType() {
				switch(this.item.contentType) {
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
				if (this.item.listContent && this.item.listContent.length > 0) {
					for (let i = 0; i < this.item.listContent.length; i++) {
						if ( this.item.listContent[i].type == 'text' ) {
							return this.item.listContent[i].text;
						}
					}
				}
				return '';
			},
			contentImg() {
				var temp = [];
				if (this.item.listContent && this.item.listContent.length > 0) {
					for (let i = 0; i < this.item.listContent.length && temp.length < 3; i++) {
						if ( this.item.listContent[i].type == 'image' ) {
							temp.push(this.$global().imgHost + this.item.listContent[i].src);
						}
					}
				}
				return temp;
			}
		},
		mounted() {
			for (let attr in this.contentByP) {
				this.channelItem[attr] = this.contentByP[attr];
			}
		},
		filters: {
			time(value) {
				function add0(m){return m<10?''+m:m };
				var nowTime = new Date();
				var ny = nowTime.getFullYear();
				var nm = nowTime.getMonth()+1;
				var nd = nowTime.getDate();
				var y = value.slice(0,4);
				var m = value.slice(5,7);
				var d = value.slice(8,10);
				var h = value.slice(11,13);
				var mm = value.slice(14,16);
				var s = value.slice(17,19);
				if(y == ny){
					if(m == nm){
						if(d == nd){
							return add0(h)+':'+add0(mm)+':'+add0(s);
						}else{
							return y+'-'+add0(m)+'-'+add0(d)
						}
					}else{
						return y+'-'+add0(m)+'-'+add0(d)
					}
				}else{
					return y+'-'+add0(m)+'-'+add0(d)
				}
			}
		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	.channel-item-wrapper {
		.item-title {
			color: #333;
			position: relative;
			.item-title-text {
				position: relative;
				display: block;
				width: 87%;
				font-size: 0;
				.title-text {
					font-size: 0.4rem;
					line-height: 0.6rem;
					white-space: nowrap;
				    max-width: 89%;
				    display: inline-block;
				    overflow: hidden;
				    text-overflow: ellipsis;
				}
				.item-kind-icon {
					display: inline-block;
					width: 0.42rem;
					height: 0.32rem;
					vertical-align: top;
					position: relative;
					top: 0.3rem;
					margin-top: -0.16rem;
					margin-left: 0.1rem;
					&.media {
						background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
						background-size: 294%;
						.bgPosition(@signs4Width, @signs4Height, 29, 18, 0, 0);
					}
				}
			}
			.item-kind {
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
		}
		.item-intro {
			color: #999;
			overflow: hidden;
			margin-top: 0.26rem;
			position: relative;
			.inner-item-intro {
				font-size: 0.37rem;
				line-height: 0.55rem;
				word-break: break-word;
				max-height: 1rem;
				// white-space: nowrap;
    			overflow: hidden;
    			// text-overflow:ellipsis;

			}
			.intro-ellipsis {
				position: absolute;
				right: 0;
				bottom: 0;
				width: 0.37rem;
				height: 0.55rem;
				line-height: 0.55rem;
				background-color: #fff;
			}
		}
		.other-info {
			height: 0.48rem;
			margin-top: 0.26rem;
			span {
				float: left;
				font-size: 0.32rem;
				line-height: 0.48rem;
				&:before {
					content: '';
					display: block;
					width: 0.32rem;
					height: 0.32rem;
					float: left;
					position: relative;
					top: 0.3rem;
					margin-top: -0.2rem;
					margin-right: 0.08rem;
					background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
					background-size: 277%;
				}
				font-size: 0.32rem;
				color: #999;
				&.editor {
					&:before {
						background-size: 300%;
						.bgPosition(@signs4Width, @signs4Height, 19, 20, 0, 89);
					}
				}
				&.read {
					&:before {
						background-size: 340%;
						.bgPosition(@signs4Width, @signs4Height, 22, 16, 0, 60);
					}
				}
			}
			.read,.thisDate {
				margin-left: 0.6rem;
			}
			.thisDate{
				height: 0.37rem;
				&:before {
					background-size: 390%;
					.bgPosition(@signs4Width, @signs4Height, 20, 20, 0, 1337);
				}
			}
		}
		.item-pic-wrapper {
			margin-top: 0.26rem;
			font-size: 0;
			img {
				display: inline-block;
				width: 32%;
				height: 2rem;
				margin-right: 1.3%;
				margin-bottom: 0.4rem;
				border-radius: 5px;
				&:last-child {
					margin-right: 0;
				}
			}
		}
	}
</style>