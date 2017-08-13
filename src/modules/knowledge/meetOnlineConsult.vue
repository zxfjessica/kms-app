<template>
	<div>
		<v-common-header>
			<!-- <mt-button slot="rightContent" :style="'position: relative;'">
				<span class="fontfamily">发布</span>
			</mt-button> -->
		</v-common-header>
		<div class="container publish-consultation">
			<div class="consultWay">
				<table id="tbOne" style="border-bottom: 1px solid #eee;">
					<tr>
						<td @click="consultType = 2">
							<span class="button" :class="{'active': consultType == 2}"></span>
							<span class="tip">在线请教</span>
						</td>
						<td @click="consultType = 1">
							<span class="button" :class="{'active': consultType == 1}"></span>
							<span class="tip">见面请教</span>
						</td>
					</tr>
				</table>
				<table class="problem">
					<tr style="border-top: 1px solid #eee;">
						<td class="must1">*</td>
						<td style="border-bottom: 1px solid #eee;">
							<input type="text" placeholder="请填写标题，不超过100字" v-model="title">
						</td>
					</tr>
					<tr>
						<td class="must2">*</td>
						<td>
							<textarea placeholder="内容补充" v-model="consultContent"></textarea>
						</td>
					</tr>
				</table>
				<div class="blog-friends" v-if="imageArr.length > 0">
					<span v-for="(item, index) in imageArr">
						<img :src="$global().imgHost + item">
						<i class="delete" @click="deletePic(index)">x</i>
					</span>
				</div>
				<div class="addPic">
					<i @click="picSelVisible = true"></i>
				</div>
				<!-- 在线请教 -->
				<div class="onlineTeach">
					<div class="integral">
						<span class="coin-signs"></span>
						<input :placeholder="'请输入积分,现有' + ownScore+'积分'" type="text" v-model="score">
					</div>
					<div class="biaoqian" v-if="consultType == 2">
						<span class="label">*</span>
						<input placeholder="请输入标签，不超过100字" type="text" v-model="labels">
					</div>
					<div class="privacy" v-if="consultType == 2">
						<table>
							<tr>
								<td @click="replyPublic = 1">
									<span class="btn" :class="{'active': replyPublic}"></span>
									<span>公开</span>
								</td>
								<td @click="replyPublic = 0">
									<span class="btn" :class="{'active': !replyPublic}"></span>
									<span>私密</span>
								</td>
							</tr>
						</table>
					</div>
					<div class="prompt" v-if="consultType == 1">
						<strong>约见须知：</strong>
						<div>具体见面时间地点请提前与专家达人线下沟通确认。专家达人联系方式请查看专家达人主页。约见完成后请提交评价和评分，最高5分。</div>
					</div>
				</div>
				<div class="pushBtn" @click="saveConsultData">发布</div>
			</div>
			<!-- 打开相册选项 -->
			<mt-popup v-model="picSelVisible"
			  		  position="bottom"
			  		  :closeOnClickModal="false"
			  		  class="choose-pics-box">
				<v-pic-sel  @picSelControl="picSelVisible = false"
							@picSelSuccessControl="successToGetPic"></v-pic-sel>
			</mt-popup>
		</div>
	</div>
</template>
<script>
	import { Toast, MessageBox, Indicator } from 'mint-ui';
	import picSelTip from '../../components/channelList/picSelTip.vue';
	import commonHeader from '../../components/commonHeader.vue'
	export default{
		components: {
			'v-pic-sel': picSelTip,
			'v-common-header': commonHeader
		},
		data() {
			return {
				consultData: {},
				replyPublic: 1, //1公开  0私密
				consultID: '',
				consultType: 2, //1面授  2在线
				title: '',
				consultContent: '',
				score: '',
				labels: '',
				picSelVisible: false,
				imageArr: [],
				askedId: '',
				personInfo: {},
				curEmpNumber: '',
				ownScore: 100

			}
		},
		beforeRouteEnter(to, from, next){
			next(vm=>{
				try{
					ExpressPlugin.getUserWorkId(workId => {
						vm.curEmpNumber = workId;
						if(to.query.empNumber == vm.curEmpNumber){
							return MessageBox({
								title: '提示', 
								message: '不能向本人发起请教!',
								confirmButtonText: '返回',
								showCancelButton: false,
								closeOnClickModal: false
							}).then(action=>{
								vm.$router.go(-1);
							});
						}
						var url = '/KMS-MSERVER/learning/person/main?empNumber=' + vm.curEmpNumber;
						vm.getData(url,'personInfo','GET', {}, (parm)=>{
							parm.ownScore = parm.personInfo.score;
						});
					},error => {});
				}catch(err){

				}
			});
		},
		mounted(){
			this.askedId = this.$route.query.empNumber;
		},
		methods: {
			saveConsultData(){
				//console.log(111);
				if(this.title.length <= 0){
					return Toast({message: '请教名称不能为空！', duration: 1000});
				}
				if(this.consultContent.length <= 0){
					return Toast({message: '请教内容不能为空！', duration: 1000});
				}
				
				var that = this;
				var url = '/KMS-MSERVER/consult/save';
				var data = '';
				data += 'id=' + that.consultID;
				data += '&&title=' + that.title;
				data += '&&consultType=' + that.consultType;
				data += '&&rewardScore=' + that.score;
				data += '&&askedId=' + that.askedId;
				data += '&&images=' + that.imageArr.join(',');
				data += '&&consultComplement=' + encodeURIComponent(JSON.stringify(that.consultContent));

				if(that.consultType == 1){
					data += '&&labels=';
					data += '&&isView=';

				}else{
					if(this.labels.length <= 0){
						return Toast({message: '在线请教标签不能为空！', duration: 1000});
					}
					data += '&&labels=' + that.labels;
					data += '&&isView=' + that.replyPublic;
				}

				console.log(url);
				Indicator.open('正在提交...');
				that.$http.post(this.$global().host + url, data).then(response=>{
					Indicator.close();
					if(response.body.status == 1){
						Toast({message: '发布成功！', duration: 1000});
						window.location.replace('#/knowledge/myConsult');
					}else if(response.body.errorMessage){
						Toast({message: response.body.errorMessage, duration: 1000});
					}
				});
			},
			deletePic(index){
				MessageBox.confirm('删除后将不可恢复，确定删除第'+ (index + 1) +'个图片?').then(action => {
					console.log(action);
				  	if(action == 'confirm'){
				  		this.imageArr.splice(index, 1);
				  	}
				},action=>{
					console.log(action);
				});
			},
			successToGetPic(parm){//添加图片
				console.log(parm);
				this.imageArr.push(parm);
				this.picSelVisible = false;
			}
		},
		watch: {
			labels(val, oldVal){
				if(val.length > 300){
					//console.log(val);
					this.labels = oldVal;
					Toast({message: '标签不能超过100字！', duration: 1000});
				}
			},
			title(val, oldVal){
				if(val.length > 100){
					//console.log(val);
					this.title = oldVal;
					Toast({message: '请教标题不能超过100字！'});
				}
			},
			score(val, oldVal){
				if(this.ownScore > 200){
					if(val > 200){
						//console.log(val);
						this.score = 200;
						Toast({message: '悬赏积分不能超过200分！'});
					}
				}else {
					if(val > this.ownScore){
						//console.log(val);
						this.score = this.ownScore;
						Toast({message: '悬赏积分不能超过剩余积分！'});
					}
					
				}
				
			}
		}
	}
</script>
<style lang="less">
@import "../../css/customFn.less";
	.fontfamily{
		font-family: "Microsoft YaHei" ! important;
	}
	.publish-consultation{
		.choose-pics-box{
			height: calc(~"1.173rem * 3 + 0.1rem + 1px");
		}
	}
	.consultWay{
		width: 100%;
		height: calc(~"100vh - 46px - 1.2rem");
		overflow-y: scroll;
		textarea, input{
			color: #999;
			font-family: "Microsoft YaHei";
		}
		table:nth-child(1){
			width: 100%;
			background: #fff;
			tr{
				td{
					height: 1.39rem;
					text-align: center;
					.button{
					    height: 0.35rem;
					    width: 0.35rem;
					    border-radius: 0.35rem;
					    background: #fff;
					    display: inline-block;
					    margin-right: 0.2rem;
					    border:1px solid #999;
					    position: relative;
						top: 2px;
						&.active{
							background-color: #ff4141;
							border-color: #ff4141;
						}
					}
					.tip{
						font-size: 0.45rem;
    					color: #999;
					}
				}
			}
		}
		.problem{
			background: #fff;
			width: 100%;
			margin-top: 0.3rem;
			tr{
				input{
					height: 0.7rem;
					border: none;
					padding: 0.3rem;
					width: 9rem;
					font-size: 0.4rem;
				}
				textarea{
					border: none;
					font-size: 0.4rem;
					height: 1.3rem;
				    padding: 0.3rem 0.3rem;
				    width: 9rem;
				    text-align: justify;
				    resize: none;
				}
				.must1{
					width: 0.4rem;
					position: relative;
				    left: 0.4rem;
				    top: 0.1rem;
				    color: #f84541;
				    font-size: 0.4rem;
				}
				.must2{
					width: 0.4rem;
					position: relative;
				    left: 0.4rem;
				    top: -0.4rem;
				    color: #f84541;
				    font-size: 0.4rem;
				}
			}
		}
		.blog-friends{
			//line-height: 1.2rem;
			/* border-bottom: 1px solid #eee; */
			font-size: 0;
			//height: 1.2rem;
			background-color: #fff;
			padding: .2rem 3.6%;
			text-align: left;
			/*.swiper-container{
				height: 100%;
				.swiper-slide{
					width: .9rem;
				}*/
				span{
					display: inline-block;
					position: relative;
					height: .8rem;
					width: .8rem;
					margin-top: .2rem;
					margin-right: .1rem;
					img{
						height: 100%;
						width: 100%;
					}
					i{
						position: absolute;
						top: -0.2rem;
						right: -0.2rem;
						height: .4rem;
						width: .4rem;
						background-size: 300%;
						background-image: url(../../../static/img/shunfeng_signs4.png);
						.bgPosition(@signs4Width, @signs4Height, 23, 23, 0, 311);
					}
				}
				
			/*}*/
		}
		.addPic{
			background-color: #fff;
			height: 0.6rem;
			text-align: right;
			padding: 0 3.6% .25rem;
			i{
				display: inline-block;
				width: 0.7rem;
			    height: 0.5rem;
    			background-size: 147%;
    			background-image: url(../../../static/img/shunfeng_signs4.png);
    			.bgPosition(@signs4Width, @signs4Height, 44, 32, -15, 1656);
			}
		}
		.integral{
				background: #fff;
				margin-top: 0.3rem;
				border-top: 1px solid #eee;
				padding: .35rem 3.6%;
				font-size: 0;
			    .coin-signs{
			    	display: inline-block;
		    		width: .7rem;
		    		height: 0.5rem;
		    		background-size: 176%;
		    		background-image: url(../../../static/img/shunfeng_signs4.png);
		    		.bgPosition(@signs4Width, @signs4Height, 31, 24, 0, 399);
			    }
			    
			    input{
			    	width: 8rem;
				    font-size: 0.4rem;
				    border: 0px;
				    position: relative;
				    top: -0.06rem;
			    }
			}
			.integral1{
				height: 1.55rem;
			    width: 100%;
			    background: #fff;
			    margin-top: 0.3rem;
			    border: 1px solid #eee;
			    border-left: none;
			    border-right: none;
			    span{
			    	content: "";
			    	background: url(../../../static/img/shunfeng_signs4.png) no-repeat 0px -7.4rem;
			    	width: 0.6rem;
			    	height: 0.6rem;
			    	background-size: 1.5rem;
			    	display: inline-block;
			    	margin:0.4rem 0.1rem 0rem 0.4rem;
			    }
			    input{
			    	width: 8rem;
				    font-size: 0.4rem;
				    border: 0px;
				    position: relative;
				    top: -0.06rem;
			    }
			}
			.prompt{
				background-color: #fff;
				border: 1px solid #eee;
				border-right: 0;
				border-left: 0;
				height: 3.0rem;
				padding-top: 0.4rem;
	    		width: 100%;
	    		margin-top: 0.3rem;
	    		strong{
	    			font-size: 0.5rem;
	    			margin-left: 0.4rem;
	    		}
	    		div{
	    			color: #999;
	    			font-size: 0.4rem;
	    			padding: 0.2rem 0.4rem;
	    		}
			}
			.biaoqian{
				height: 1.55rem;
			    width: 100%;
			    background: #fff;
			    border-bottom: 1px solid #eee;
				.label{
					color:#fb4144;
					margin-left: 0.4rem;
					position: relative;
    				top: 0.5rem;
				}
				input{
			    	width: 8rem;
				    font-size: 0.4rem;
				    border: 0px;
				    position: relative;
				    top: 0.5rem;
				    margin-left: 0.15rem;
			    }
			}
			.privacy{
				margin-top: 0.3rem;
			    height: 1.3rem;
			    width: 100%;
			    background: #fff;
			    border: 1px solid #eee;
			    border-left: 0;
			    border-right: 0;
			    font-size: 0.45rem;
    			color: #999;
			    .btn{
			    	height: 0.35rem;
					width: 0.35rem;
					border-radius: 0.35rem;
					background: #fff;
					display: inline-block;
					margin-right: 0.2rem;
					border:1px solid #919191;
					position: relative;
    				top: 2px;
    				&.active{
    					background-color: #ff4141;
    					border-color: #ff4141;
    				}
			    }
			}
			.pushBtn{
				position: absolute;
			    bottom: 0px;
			    width: 100%;
			    height: 1.2rem;
			    text-align: center;
			    background: #ff4141;
			    color: #fff;
			    font-size: 0.4rem;
			    line-height: 1.2rem;
			}
	}
</style>