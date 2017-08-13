<template>
	<div class="write-expression">
		<h1 class="mint-popup-title clearfix">
			<span class="fl">你的评价:</span>
			<set-star :model="setStar"
					  :totalStar="5.0"
					  @watch="watchStar"
					  :action="'touchMove'"
					  class="set-star-box fl"></set-star>
			<i class="signs close-signs fr" @click="closeExpress"></i>
		</h1>
		<div class="writings">
			<textarea v-model="myExpressionContent" 
					  placeholder="请输入评论内容，200字以内" 
					  @focus.stop="changeInput"
					  @blur.stop="stopInput"></textarea>
			<p class="written">{{myExpressionContent.length}} / 200</p> 
		</div>
		<div class="send" @click="sendExpression">发送</div>
	</div>
</template>
<script type="text/javascript">
	import { MessageBox, Toast } from 'mint-ui';
	import textareaBox from '../components/textareaBox.vue';
	import setStar from '../components/setStar.vue';
	export default{
		name: 'writeExpression',
		props: [
			'watch',
			'coursesId'
		],
		components: {
			textareaBox,
			setStar
		},
		data(){
			return {
				setStar: 0,
				myExpressionContent: '',
				bgColorWidth: 0,
				input: false
			}
		},
		methods: {
			watchStar(val){
				this.setStar = val;
			},
			changeInput: function(){
				this.input = true;
				this.$emit('watch', this.input);
			},
			stopInput: function(){
				this.input = false;
				this.$emit('watch', this.input);
				
			},
			closeExpress: function(){
				this.$emit('closeExpress');
			},
			sendExpression: function(){
				if(this.setStar <= 0){
					return Toast({
							message: '课程评分不可为空',
							className: 'changeIndex',
							duration: 1000
						});
				}
				if(this.myExpressionContent == ''){
					return Toast({
							message: '课程评论不可为空',
							className: 'changeIndex',
							duration: 1000
						});
				}

				this.$http({
					type: 'GET',
					url: this.$global().host+'/KMS-MSERVER/learning/courses/saveComment/' + this.coursesId + '?coursesStar='+this.setStar+'&&coursesComment=' + this.myExpressionContent
				}).then(function(data) {
					if(data.data.status == 1){
						Toast({
							message: '评论成功！',
							className: 'changeIndex',
							duration: 1000
						});
						this.setStar = 0;
						this.myExpressionContent = '';
						this.bgColorWidth = 0;
						this.$emit('closeExpress');
					}else{
						Toast({
							message: '评论失败！',
							className: 'changeIndex',
							duration: 1000
						});
					}
				});		
			}
		},
		watch: {
			myExpressionContent: function(val, oldVal){
				if(val.length > 200){
					Toast({
						message: '评论长度不可超过200！',
						className: 'changeIndex',
						duration: 1000
					});
					this.myExpressionContent = oldVal;

				}
			}
		}
	}
</script>
<style lang="less">
	.online-detail{
		section.online-course{	
			.write-expression{
				position: relative;
				height: 100%;
				.writings{
					background-color: #fff;
					height: 40%;
					textarea{
						-webkit-appearance: none;
					    resize: none;
					    width: 88.6%;
					    height: 60%;
					    margin: 5% 3.6% 0;
					    padding: 1% 2%;
					    border-radius: 3px;
					    line-height: 0.55rem;
					    border-color: #eee;
					    background-color: #fafafa;
					    outline: none;
					    color: #333;
					    font-size: 0.35rem;
					}
					p{
						background-color: #fff;
					    padding-bottom: 3.6%;
					    text-align: right;
					    padding-right: 3.6%;
					    color: #999999;
					}
				}
				
				.send{
					position: absolute;
				    bottom: 0;
				    line-height: 1rem;
				    width: 100%;
				    text-align: center;
				    font-size: 0.4rem;
				    background-color: #ff4141;
				    color: #fff;
				    z-index: 2000;
				}
			}
		}
	}
</style>