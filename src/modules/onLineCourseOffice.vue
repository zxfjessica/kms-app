<template>
	<div>
		<v-common-header></v-common-header>
		<div id="officeContainer" class="my-office-document container">
			<!-- 文档 -->
			<div class="officeBox" v-if="type == 1">
				<iframe :src="officeUrl" id="myOfficeIframe" name="myOfficeIframe" @load="officeLoad"></iframe>
				<!-- <a :href="officeUrl" @click="loadingA"  v-if="ifIOS && isPPT"></a>
				<div  @click="loadingA" v-if="!ifIOS && isPPT" ref="pptClick"></div> -->
			</div>
			
			<!-- 图片 -->
			<div class="pics-box" v-if="type == 2">
				<div v-for="(pic, index) in picUrlList"
						class="img-wrapper">
					<img class="preview-img"  
						 @click="$preview.open(index, picUrlList)" 
						 @load="imgLoad($event)"
						 v-lazy.officeContainer="pic">
					<div class="load-icon">
						<mt-spinner type="fading-circle"></mt-spinner>
					</div>
				</div>
			</div>
			<!-- scorm -->
			<div v-if="type == 3">
				<iframe :src="scormUrl" id="myScormIframe" @load="scormLoad"></iframe>
			</div>

			<div class="onloading" v-show="showOnloading">
				<p>加载中</p>
				<mt-spinner type="triple-bounce" color="#f7f7f7"></mt-spinner>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import { Indicator, Spinner, Toast } from 'mint-ui';
	import commonHeader from '../components/commonHeader.vue';
	let officeNum = 0;
	export default{
		data(){
			return {
				coursesId: '',
				type: '',
				officeUrl: '',
				picUrlList: [],
				scormUrl: '',
				showOnloading: true,
				isPPT: false,
				ifIOS: true
			}
		},
		components: {
			"v-common-header": commonHeader
		},
		mounted(){
			let that = this;
			that.coursesId = that.$route.params.ID;
			that.type = that.$route.query.type;


			var nav = navigator.userAgent;
			if(nav.indexOf('iPhone') >=0){
				this.ifIOS = true;
			}else{
				this.ifIOS = false;
			}


			that.$http.get(that.$global().host + '/KMS-MSERVER/learning/courses/viewCoursesFile?coursesId=' + this.coursesId).then(
				response => {
					if(!response.body.data || (response.body.data.length == 0)){
						return this.showOnloading = false, Toast({message: '没有数据！', duration: 1000});
					}
					if(that.type == 1){
						var end = response.body.data[0].addresses.toLowerCase().slice(-3);
						if(end == 'ppt' || end == 'ptx'){
							this.isPPT = true;
							that.officeUrl = that.$global().officeHost + '?url=' + this.$global().idvHost + response.body.data[0].addresses + '&token=cyberwisdomsupport';
						}else{//pdf
							this.isPPT = false;
							that.officeUrl = that.$global().officeHost + '?url=' + this.$global().idvHost + response.body.data[0].addresses + '&token=cyberwisdomsupport&type=imgall';
							
						}
						//this.showOnloading = false
					}else if(that.type == 2){
						that.picUrlList = response.body.data;
						for(let i = 0; i < that.picUrlList.length; i++){
							that.picUrlList[i].src = that.$global().imgHost + that.picUrlList[i].addresses;
						}
						//that.imgLoadNum = 0;
					}else if(that.type == 3){
						that.scormUrl = that.$global().officeHost + '?url=' + this.$global().imgHost + response.body.data[0].addresses + '&token=cyberwisdomsupport'
					}
				}
			);
		},
		methods: {
			closeOnloading(){
				this.showOnloading && (this.showOnloading = false);
			},
			imgLoad(eve){
				this.closeOnloading();
			},
			officeLoad(eve){
				officeNum++;
				if(officeNum == 2){
					this.closeOnloading();
				}
			},
			scormLoad(eve){
				this.closeOnloading();
				
			},
			loadingA(){
				this.showOnloading = true;
				if(!this.ifIOS){
					window.location.replace(this.officeUrl);
				}
				
			}
		},
		beforeDestroy(){
			officeNum = 0;
			this.closeOnloading();
		}
	}
</script>
<style lang="less">
	.my-office-document{
		.officeBox{
			line-height: 1rem;
			text-align: center;
			font-size: 0.4rem;
			height: 100%;
		}
		iframe{
			width: 100%;
			//height: calc(~"100vh - 46px");
			height: 100%;
			border: none;
			display: block;
			.container-fluid{
				padding: 0 !important;
			}
		}
		.pics-box{
			.img-wrapper {
				position: relative;
			}
			img[lazy=loading] {
			  background-color: #ddd;
			}
			img{
				width: 100%;
				display: block;
				margin: 0 auto;
			}
			.load-icon {
				display: none;
				position: absolute;
				top: 50%;
				left: 50%;
				margin-top: -0.5rem;
				margin-left: -0.5rem;
				width: 1rem;
				height: 1rem;
				text-align: center;
			}
			img[lazy=loading] + .load-icon {
				display: block;
			}
		}
		.onloading{
			position: absolute;
		    height: 1rem;
		    width: 3rem;
		    top: 50%;
		    left: 50%;
		    text-align: center;
		    line-height: 0.6rem;
		    padding: 0.5rem 0;
		    margin-left: -1.5rem;
		    margin-top: calc(~"-1rem - 23px");
		    background-color: rgba(0,0,0,.2);
		    color: #fff;
		    font-size: 0.4rem;
		    border-radius: 5px;
		    z-index: 2000;
		}
	}
</style>