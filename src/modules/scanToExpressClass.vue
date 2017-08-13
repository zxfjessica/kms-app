<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container scan-to-express-class">
			<div class="scroll-box">
				<section>
					<div class="express-box course-express">
						<div class="mint-popup-title clearfix">
							<span>组织内容评价：</span>
							<set-star :model="setOrganizeStar"
									  :totalStar="5.0"
									  @watch="watchOrganizeStar"
									  :action="'touchMove'"
									  v-if="isFirst == 1"
									  class="set-star-box fr"></set-star>
						</div>
						<div class="express-bottom">
							<textarea-box :model="organizeExpress"
										  :placeholder="'请您从组织安排、时间、环境等方面对本期培训进行整体评价'"
										  :totalLetter="200"
										  @watch="watchOrganize"></textarea-box>
						</div>
					</div>
				</section>
			</div>
			<footer>
				<div v-if="canGoBack" @click="goBack">返回</div>
				<div v-else @click="sendExpresses">发送评论</div>
			</footer>
		</div>
	</div>
</template>
<script type="text/javascript">
	import { Toast, MessageBox, Indicator } from 'mint-ui';
	import textareaBox from '../components/textareaBox.vue';
	import setStar from '../components/setStar.vue';
	import commonHeader from '../components/commonHeader.vue';
	export default{
		components: {
			textareaBox,
			setStar,
			"v-common-header": commonHeader
		},
		data(){
			return{
				setOrganizeStar: 0,
				organizeBgColorWidth: 0,
				organizeExpress: '',
				coursesId: '',
				isFirst: '0', //0评论班级 || 1追评班级
				canGoBack: false
			}
		},
		mounted(){
			this.coursesId = this.$route.params.ID;
			
			this.$http({										
				type: 'GET',
				url: this.$global().host+'/KMS-MSERVER/learning/sign/viewClass/' + this.coursesId
			}).then(function(data) {
				if(data.data.errorMessage){
					return MessageBox({
						title: '',
						message: data.data.errorMessage,
						confirmButtonText: '返回',
						showCancelButton: false,
						closeOnClickModal: false
					}).then((response)=>{
						try {
						
					 		ExpressPlugin.backToWidget();
						} catch (e) {
						}
					});
				}
				
				if(data.data.data){
					this.isFirst = data.data.data.isFirst
				}
				if(this.$route.query.scan && !this.isFirst){
					MessageBox({
						title: '',
						message: '您已评价过该班级',
						confirmButtonText: '知道了',
						showCancelButton: false,
						closeOnClickModal: false
					}).then((response)=>{
						try {
						
					 		ExpressPlugin.backToWidget();
						} catch (e) {
						}
					});
				}
			});
		},
		methods: {
			watchOrganizeStar(val){
				this.setOrganizeStar = val;
			},
			watchOrganize(val){
				this.organizeExpress = val;
			},
			sendExpresses: function(){
				let that = this;
				if(!parseFloat(this.setOrganizeStar) && this.isFirst){
					return Toast({
							message: '组织评分不可为空',
							duration: 1000
						});
				}else if(!this.organizeExpress){
					return Toast({
							message: '组织评论不可为空',
							duration: 1000
						});
				}
				var url = this.$global().host+'/KMS-MSERVER/learning/sign/comment/class/' + this.coursesId;
				url += '?isFirst=' + this.isFirst;	
				url += '&&commentStar=' + this.setOrganizeStar;
				url += '&&commentContent=' + this.organizeExpress;

				Indicator.open({
					text: '正在提交',
					spinnerType: 'triple-bounce'
				});
				this.$http.get(url).then(function(data) {
					Indicator.close();
					if(data.data.status == 1){
						Toast({
							message: '评论成功！',
							className: 'changeIndex',
							duration: 1000
						});
						this.canGoBack = true;
					}else{
						Toast({
							message: data.data.errorMessage,
							className: 'changeIndex',
							duration: 1000
						});
					}
				});						
			},
			goBack: function(){
				if(this.$route.query.scan){
					try {
						//console.log(111);
				 		ExpressPlugin.backToWidget();
					} catch (e) {
					}
				}else{
					this.$router.go(-1)
				}
			}
		}
	}
</script>
<style lang="less">
	.scan-to-express-class{
		header{
		}
		section{
			
		}
		footer{
			
		}
	}
</style>