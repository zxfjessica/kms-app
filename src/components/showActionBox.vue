<template>
	<div class="show-action-box">
		<div class="img-box">
			<img v-if="title" src="../../static/img/phone_2.png">
			<img v-else src="../../static/img/phone.png">
			<p >{{title ? title : '提交成功！'}}</p>
		</div>
		<!-- <a href="javascript:;" @click="goBack"><div class="back-btn">返回</div></a> -->
		<mt-button v-on:click="toBeBack" class="back-btn">返回</mt-button>
	</div>
</template>
<script type="text/javascript">
	export default{
		name: 'showAxtionBox',
		props: [
			"title"
		],
		data(){
			return{

			}
		},
		mounted(){
			//this.examId = this.$route.params.ID;
			//console.log(this.title);
		},
		beforeDestroy(){
			document.getElementById('beBackBtn').style.display = 'block';
		},
		methods: {
			/*goBack(){
				this.$router.go(-1);
			}*/
			toBeBack: function(){
				if(this.$route.query.scan){
					if(this.$route.path.indexOf('kaoshi-datiye') >= 0){
						window.location.replace('#/myExamList?type=1');
						localStorage.setItem('kaoshi-datiye-isFinish', true);
					}else{
						window.location.replace('#/mySurvey?type=1');
						localStorage.setItem('diaoyan-isFinish', true);
					}
				}else{
					if(this.$route.path.indexOf('kaoshi-datiye') >= 0){

						localStorage.setItem('kaoshi-datiye-isFinish', true);
					}else{
						
						localStorage.setItem('diaoyan-isFinish', true);
					}
					this.$router.go(-1)
				}
			}
		}
	}
</script>
<style lang="less">
	.show-action-box{
		height: 100%;
		.img-box{
			position: absolute;
		    width: 100%;
		    text-align: center;
		    top: 25%;

		    img{
		    	width: 15%;
		    }
		    p{
		    	margin-top: 3.6%;
				font-size: 1.4em;
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