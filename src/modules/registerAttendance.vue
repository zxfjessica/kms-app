<template>
	<div>
		<v-common-header :reTitle="isRegisterSuccess == 1 ? '签到成功' : isRegisterSuccess == 0 ? '签到失败' : ''"></v-common-header>
		<div class="register-attendance">
			<div class="img-box">
				<img v-if="isRegisterSuccess == 0" src="../../static/img/phone_2.png">
				<img v-else-if="isRegisterSuccess == 1" src="../../static/img/phone.png">
				<p>{{title}}</p>
			</div>
			<!-- <a href="javascript:;" @click="goBack"><div class="back-btn">返回</div></a> -->
			<mt-button v-on:click="toBeBack" class="back-btn">返回</mt-button>
		</div>
	</div>
</template>
<script type="text/javascript">
	import { Toast, MessageBox } from 'mint-ui';
	import commonHeader from '../components/commonHeader.vue';
	export default{
		data(){
			return{
				title: '',
				isRegisterSuccess: null
			}
		},
		components: {
			"v-common-header": commonHeader
		},
		mounted(){
			//http://10.202.4.75:8180/KMS-MSERVER/learning/sign/toSign/{classId}
			this.$http({										
				type: 'GET',
				url: this.$global().host+'/KMS-MSERVER/learning/sign/toSign/' + this.$route.params.ID
			}).then(function(data) {
				if(data.data.status == 1){
					this.title = '你已经签到啦'
					this.isRegisterSuccess = 1;
				}else{
					this.title = '非班级成员无法签到，请联系班主任';
					this.isRegisterSuccess = 0;
					if(data.data.errorMessage){
						Toast({
							message: data.data.errorMessage,
							duration: 1000
						});
					}
					
				}
			});				

		},
		methods: {
			toBeBack(){
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
	.register-attendance{
		.img-box{
			position: absolute;
		    width: 100%;
		    text-align: center;
		    top: 30%;

		    img{
		    	width: 15%;
		    }
		    p{
		    	margin-top: 3.6%;
				font-size: 0.42rem;
		    }
		}
		.back-btn{
			display: block;
			width: 100%;
			position: absolute;
		    bottom: 0;
		    height: 50px;
		    text-align: center;
		    cursor: pointer;
			line-height: 50px;
		    background-color: #ff4141 !important;
		    color: #fff;
		    font-size: 1.3em;
		    border-radius: 0;
			
		}
	}
</style>