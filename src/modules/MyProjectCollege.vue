<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container pro-college">
			<div class="college-title-wrapper">
				<div class="college-title">
					<h4>{{classData.className}}</h4>
				</div>
			</div>
			<section class="ctn">
				<div class="college-tb-wrapper">
					<div class="college-tb">
						<div class="tb-head-wrapper">
							<div class="tb-head">
								<div class="row">
									<span class="del-title">删除</span>
									<span>序号</span>
									<span class="job-num-title">工号</span>
									<span>姓名</span>
									<span>签到次数</span>
								</div>
							</div>
						</div>
						<div class="tb-body-wrapper" ref="tb_body_wrapper">
							 <div class="tb-body"
							 		v-infinite-scroll="loadBottom"
							  		infinite-scroll-disabled="bottomAllLoaded"
							  		infinite-scroll-distance="10"
							  		infinite-scroll-immediate-check="false">
							 	<div class="row" v-for="(item,$index) in userList">
							 		<span class="del-btn-wrapper">
							 			<i class="del-btn" 
							 				:class="{'disabled': classData.isFinish}"
							 				@click="delHandler(item, classData.isFinish)">
							 			</i>
							 		</span>
							 		<span>{{$index+1}}</span>
							 		<span class="job-num">{{item.memberId}}</span>
							 		<span>{{item.memberName}}</span>
							 		<span>{{item.signCount}}</span>
							 	</div>						 	
							 </div>
						</div>
						
					</div>
				</div>
				<div class="add" :class="{'disabled': classData.isFinish}" @click="openAddHander(classData.isFinish)">新增学员</div>
				<mt-popup
				  v-model="popupVisible"
				  popup-transition="popup-fade"
				  :closeOnClickModal="false">
				  	<div class="add-container">
				  		<h6>新增学员</h6>
				  		<form action="javascript:return true">
				  			<input class="add-input" 
				  				type="text" 
				  				v-model="addValue" 
				  				placeholder="请输入学员工号"
				  				@keypress="submit"
				  				ref="addInput" />
				  			<div class="sign-box-wrapper">
				  				<input id="sign-box" type="checkbox" ref="signCheckbox"/>
				  				<label for="sign-box">代签到</label>
				  			</div>
				  		</form>
				  		<span class="submit-btn" :class="{'able':addValue!=''}" @click="addStuHandler">提交</span>
				  	</div>
				  	<span class="add-close-btn" @click="popupVisible=false"></span>
				</mt-popup>
			</section>
		</div>
	</div>
</template>
<script>
	import { MessageBox } from 'mint-ui';
	import { Toast, Indicator } from 'mint-ui';
	import loadmore from "../components/loadMore.vue";
	import commonHeader from '../components/commonHeader.vue';
	export default{
		data() {
			return {
				popupVisible: false,
				addValue:'',
				classData: {
					'className': '班级名称',
					'classList': {
						data: []
					},
					isFinish: 0
				},
				pageno: 0,//userList的页数
				bottomAllLoaded: false,
				totalPage: 0
			}
		},
		computed:{
			userList() {
				return this.classData.classList && this.classData.classList.data || [];
			}
		},
		mounted() {
			var url = '/KMS-MSERVER/learning/person/classManager/userList?classId=' + this.$route.params.ID;
			this.getData(url,'classData','GET', {}, function(parm) {
				parm.$nextTick(
					() => {
						if (parm.classData.classList && parm.classData.classList.totalPage === 1) {
							parm.bottomAllLoaded = true;
						}
					}
				);
			});
		},
		methods: {
			loadBottom() {
				var that = this;
				var url = '/KMS-MSERVER/learning/person/classManager/userList?classId=' + this.$route.params.ID;
				this.pageno++;
				url += '&startPage=' + this.pageno;
				this.getMoreData(url, 'classData', 'totalPage', 'pageno', 'bottomAllLoaded', 'loadmore');
				Indicator.open({
				  text: '加载中...',
				  spinnerType: 'fading-circle'
				});
			},
			getMoreData(url,content,totalPage,pageno,bottomAllLoaded,loadMore) {
				this.$http({
					method:'GET',
					url:this.$global().host+url
				}).then(
					response => {
						if(response.status==200&&response.body.status){
							setTimeout(() => {Indicator.close();}, 300);
							if(response.body.data){
								if(!response.body.data.classList || this.totalPage && this[pageno] >= this.totalPage){
									this[bottomAllLoaded] = true;
									setTimeout(() => {Toast({message: '没有更多数据了', duration: 1000});}, 300);
									return;
								}else{
									this[content].classList.data = this[content].classList.data.concat(response.body.data.classList.data);
									this[totalPage] = response.body.data.classList.totalPage;
									return;
								}	
							}else{
								this[content] = '找不着数据！';
							}	
						}	
					},
					response =>{
						// error callback
						console.log('error');
					}
				)
			},
			delHandler(item, isFinish) {
				if (isFinish) {
					return;
				}
				document.body.className += ' del';
				MessageBox({
					title:'',
					message: '是否删除' + item.memberName + '？</br>工号:' + item.memberId,
					showConfirmButton: true,
					showCancelButton: true,
					confirmButtonText: '确定',
					closeOnClickModal: false
				}).then((action) => {
					if (action === 'confirm') {
						let url = '/KMS-MSERVER/learning/person/classManager/userAddOrDel',
							option = 'classId=' + Number(this.$route.params.ID);
						option += '&empNumber=' + item.memberId;
						option += '&doType=0';
						this.operationData(url, option);
					}
					document.body.className = document.body.className.replace('del', '').trim();
				});
			},
			openAddHander(isFinish) {
				if (isFinish) {
					return;
				}
				this.popupVisible=true;
				this.$nextTick(() => {
					this.$refs.addInput.focus();
				});
			},
			submit() {
				if(event.keyCode == 13){
					this.addStuHandler();
				}
			},
			addStuHandler(){
				if(this.addValue == ''){
					Toast({message: '请输入内容！', duration: 1500});
					return;
				}
				if (Number(this.addValue) !== Number(this.addValue)) {
					Toast({message: '格式错误！请重新输入！', duration: 1500});
					this.addValue = '';
					return;
				}
				//添加成员
				let url = '/KMS-MSERVER/learning/person/classManager/userAddOrDel',
					option = 'classId=' + Number(this.$route.params.ID);
				option += '&doType=1';
				option += '&empNumber=' + this.addValue;
				if (this.$refs.signCheckbox.checked) {
					option += '&isSign=1';
				}else {
					option += '&isSign=0';
				}
				this.operationData(url, option);

			},
			operationData(url, option) {
				this.$http.post(this.$global().host + url, option).then(
					response => {
						if(response.body.status && response.body.data.result){
							if (response.body.data.result === '学员工号不存在') {
								Toast({message: response.body.data.result, duration: 1000});
								return;
							}
							this.operation(response.body.data.result);
						}
					},
					() => {
						alert('err');
					}
				)
			},
			operation(result) {
				this.$refs.tb_body_wrapper.scrollTop = 0;
				this.pageno = 0;
				let url = '/KMS-MSERVER/learning/person/classManager/userList?classId=' + this.$route.params.ID;
				this.getData(url, 'classData', 'GET', {}, function(parm) {
					/* 重置 */
					parm.addValue = '';
					parm.$refs.signCheckbox.checked = false;
					Toast({message: result, duration: 1000});
					parm.popupVisible = false;
					if (parm.classData.classList && parm.classData.classList.totalPage === 1) {
						parm.bottomAllLoaded = true;
					} else {
						parm.bottomAllLoaded = false;
					}
				});
			}
		},
		watch: {
			popupVisible() {
				if (this.popupVisible) {
					document.body.className += ' add';
				} else {
					document.body.className = document.body.className.replace('add', '').trim();
				}
			}
		},
		components:{
			"v-loadmore": loadmore,
			"v-common-header": commonHeader
		}
	}
</script>
<style lang="less">
	@import "../css/customFn.less";
	.pro-college{
		@innerWidth: 92%;
		.college-title-wrapper{
			background-color: #fff;
		}
		.college-title{
			width: @innerWidth;
			margin: 0 auto;
			h4{
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				height: 1.35rem;
				font-size: 0.48rem;
				line-height: 1.35rem;
			}
		}
		.ctn{
			height: calc(~"100vh - 46px - 1.35rem");
			background-color: #fff;
			position: relative;
			.college-tb-wrapper{
				height: calc(~"100% - 1rem");
				.college-tb{
					height: 100%;
				}
			}
			.tb-head-wrapper{
				background-color: #eee;
				border-top: 1px solid #e6e6e6;
				border-bottom: 1px solid #e6e6e6;
			}
			.tb-head {
				width: @innerWidth;
				margin: 0 auto;
			}
			.tb-head,.tb-body{
				.row{
					overflow: hidden;
				}
				span{
					display: block;
					float: left;
					text-align: center;
					width: 20%;
					&.del-btn-wrapper,&.del-title{
						width: 12%;
					}
					&.job-num-title,&.job-num{
						width: 28%;
					}
				}
			}
			.tb-head{
				span{
					display: block;
					float: left;
					text-align: center;
					color: #999;
					width: 20%;
					height: 0.74rem;
					line-height: 0.74rem;
					font-size: 0.42rem;
					// white-space: nowrap;
					// overflow: hidden;
					// text-overflow: ellipsis;
				}
			}
			.tb-body-wrapper{
				height: calc(~"100% - 0.74rem - 2px");
				overflow: auto;
			}
			.tb-body{
				.row{
					padding: 0.24rem 4%;
					span{
						font-size: 0.4rem;
						min-height: 0.82rem;
						line-height: 0.82rem;
					}
					.job-num{
						word-break: break-word;
					}
					&:nth-child(even) {
						background: #fafafa;
					}
				}
			}
			.del-btn-wrapper{
				position: relative;
				.del-btn{
					display: block;
					width: 25px;
					height: 25px;
					background: url('../../static/img/shunfeng_signs3.png') no-repeat;
					background-size: 340%;
					.bgPosition(@signs3Width, @signs3Height, 44, 44, 0, 361);
					position: absolute;
					left: 50%;
					top: 50%;
					.transform-translateXY (-50%,-50%,0);
					&.disabled {
						background: url('../../static/img/shunfeng_signs4.png') no-repeat;
						background-size: 170%;
						.bgPosition(@signs4Width, @signs4Height, 44, 44, 0, 2105);
					}
				}
			}
			.add{
				width: 100%;
				height: 1rem;
				line-height: 1rem;
				font-size: 0.48rem;
				text-align: center;
				background-color: #ff4143;
				color: #fff;
				position: absolute;
				bottom: 0;
				&.disabled {
					background-color: #999;
				}
			}
			.mint-popup{
				width: 75%;
				border-radius: 10px;
			}
			.add-container{
				padding: 5% 12.6%;
				padding-bottom: 0;
				color: #777;
				h6{
					text-align: center;
					font-size: 0.42rem;
					line-height: 0.6rem;
					margin-bottom: 0.4rem;
				}
				.add-input{
					width: 100%;
					.appearance-clear;
					border: 1px solid #ccc;
					border-radius: 4px;
					font-size: 0.42rem;
					padding: 4px;
					box-sizing: border-box;
					margin-bottom: 0.4rem;
					color: #777;
				}
				.sign-box-wrapper{
					margin-bottom: 0.4rem;
					label{
						font-size: 0.42rem;
					}
					input[type="checkbox"] {
						vertical-align: text-bottom;
					  	-webkit-appearance: none;
					  	background: #fff;
					    height: 0.42rem;
					    width: 0.42rem;
					    border: 1px solid #ccc;
					    border-radius: 2px;
					    margin-right: 4px;
					}
					input[type="checkbox"]:checked {
					  	background: url('../../static/img/shunfeng_signs3.png') no-repeat;
					  	background-size: 640%;
					  	.bgPosition(@signs3Width, @signs3Height, 25, 17, 0, 415);
					}
				}
				.submit-btn{
					display: block;
					width: 100%;
					font-size: 0.42rem;
					line-height: 1.2rem;
					text-align: center;
					border-top: 1px solid #eee;
					&.able{
						color: #f00;
					}
				}
			}
			.add-close-btn{
				height: 0.75rem;
				width: 0.75rem;
				position: absolute;
				top: -0.7rem;
				right: -8%;
				background: url('../../static/img/shunfeng_signs3.png') no-repeat;
				background-size: 357%;
				.bgPosition(@signs3Width, @signs3Height, 36, 36, 0, 762);
			}
			.v-modal {
				height: 100vh;
				position: absolute;
				top: calc(~"0px - 1.35rem - 46px");
			}
		}
	}
	.mint-toast{
		z-index: 2023!important;
	}
	.mint-msgbox {
		padding: 0 6%;
		width: 48%;
	}
	.del {
		.mint-msgbox {
			padding: 0 6%;
			width: 58%;
		}
	}
	.college .mint-header.is-fixed{
		position: absolute;
	}
	.add .college{
		.pro-college{
			z-index: 3;
			overflow: visible;
		}
		.mint-header.is-fixed{
			z-index: 0;
		}
	} 
	.add-modal {
		display: none;
	}
	.college {
		.add-modal {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			opacity: 0.5;
			background: #000;
		}
	}
</style>