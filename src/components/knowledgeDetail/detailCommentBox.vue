<template>
	<div class="comment-box-wrapper clearfix">
		<div class="left-brn fl">
			<span class="face-btn" @click="faceSwitchHandler"></span>
		</div>
		<div class="right-content-box fr">
			<div class="comment-input-wrapper clearfix">
				<div contenteditable="true" 
					class="commnet-input fl" 
					ref="commnetInput"
					:dataText="'回复 ' + replyName + ':'">
				</div>
				<span class="send-btn fr" 
					:class="sendDisable"
					@click="sendHandler">发送</span>
			</div>
			<div class="face-wrapper" v-show="faceVisiable">
				<div class="face-inner-wrapper">
					<span v-for="$index in 74" @click="selFaceHandler">
						<img :src="'static/img/face/'+$index+'.gif'">
					</span>
				</div>
			</div>
		</div>
		
	</div>
</template>
<script>
	import { Toast } from 'mint-ui';
	export default {
		name: 'detailCommentBox',
		props: {
			replyName: {
				type: String
			}
		},
		data() {
			return {
				faceVisiable: false
			}
		},
		mounted() {
			this.$refs.commnetInput.focus();
		},
		methods: {
			test() {
				//alert();
			},
			sendHandler() {//发送事件
				if(this.$refs.commnetInput.innerHTML == '') {
					Toast({message: '发送内容不能为空！', duration: 1000});
					return;
				}
				this.$emit('sendControl', this.replace_em(this.$refs.commnetInput.innerHTML));
				this.$refs.commnetInput.innerHTML = '';
			},
			faceSwitchHandler() {
				this.faceVisiable = !this.faceVisiable;
			},
			selFaceHandler(event) {
				this.$refs.commnetInput.innerHTML += event.currentTarget.innerHTML;
				this.faceVisiable = false;
			},
			//转码将html编码转为字符编码
			replace_em(str) {
		         str = str.replace(/<img src=\"static\/img\/face\/([0-9]*).gif\">/g, '\[em_$1\]');
		         return str;
			}

		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	.comment-box-wrapper {
		position: relative;
		padding: 0.2rem 0.42rem;
		height: 1.1rem;
		background-color: #eee;
		.left-brn{
			height: 100%;
			width: 1rem;
			.face-btn {
				display: inline-block;
				width: 0.8rem;
				height: 0.8rem;
				vertical-align: top;
				position: relative;
				top: 0.15rem;
				background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
				background-size: 150%;
				.bgPosition(@signs4Width, @signs4Height, 48, 48, 0, 2049);
			}
		}
		.right-content-box{
			height: 100%;
			width: calc(~"100% - 1rem");
			.comment-input-wrapper {
				width: 100%;
				overflow-y: hidden;
				.commnet-input {
					.appearance-clear;
					display: inline-block;
				    width: calc(~"80% - 0.4rem");
				    height: 0.5rem;
				    word-break: break-word;
				    overflow-y: auto;
				    padding: 0.3rem .2rem;
				    font-size: 0.4rem;
				    line-height: .55rem;
				    text-indent: 0.2rem;
				    vertical-align: top;
				    border: none;
				    border-radius: 0;
				    background-color: #fff;
					.allow-select;
					&[contentEditable=true]:empty:before{
					    content:attr(dataText);
					    color: #999;
					}
				}
				.send-btn {
					display: inline-block;
					width: 20%;
					height: 1.1rem;
					line-height: 1.1rem;
					font-size: 0.36rem;
					color: #fff;
					text-align: center;
					background-color: #ff4143;
					&.sendDisable {
						background-color: #eee;
					}
				}
			}
		}
		
		.face-wrapper {
			position: absolute;
			top: 0;
			left: 0;
			.transform-translateY (-100%);
			background-color: #fff;
			font-size: 0.7rem;
			padding: 0.34rem;
			.face-wrapper {
				background-color: #eee;
			}
			img {
				vertical-align: top;
				margin: 0;
				padding: 0px 1px;
			}
		}
	}
</style>