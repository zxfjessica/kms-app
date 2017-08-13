<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container">
			<p class="loadtips" v-if="loadingShow">加载中......</p>
			<p class="loadtips" v-if="noData">没有更多数据了！</p>
			<div class="tableHeight" ref="ctnWrapper" @scroll="scroll" v-if="!loadingShow">
				<div v-infinite-scroll="loadMore" infinite-scroll-disabled="disabledScroll" infinite-scroll-immediate-check="false" infinite-scroll-distance="1">
					<table class="channelList">
						<tr v-for="list in lists" @click="localTop">
							<td>
								<div  v-if="list.result==2 || list.result==3" @click="alertTip(list.result)">
								<img :class="{'img_ing':list.result==2?false:true}" :src="$global().imgHost+list.headImage">
								</div>
								<router-link :to="{'path':'/knowledge/channelDetailChannel','query':{id:list.id}}" v-if="list.result==0">
									<img :class="{'img_ing':list.result==2?false:true}" :src="$global().imgHost+list.headImage">
								</router-link>
							</td>
							<td>
								<!-- result=0 -->
								<router-link :to="{'path':'/knowledge/channelDetailChannel','query':{id:list.id}}" v-if="list.result==0">
									<div :class="{'bg-noPass':list.result==3?true:false}">
										<div class="marginBottom">
											<div class="title">{{list.name}}</div>
										</div>
										<p class="ellipsis-line-2 desc-width">{{list.description}}</p>
									</div>
									<div>
										<router-link :to="{'path':'/knowledge/channelManageDetail','query':{id:list.id,result:list.result}}">
											<button class="manage" v-if="list.result==0">管理</button>
										</router-link>
										<button @click="deleteChannel(list.id)" class="delete" v-if="list.result==3">删除</button>
										<router-link :to="{'path':'/knowledge/channelApply','query':{id:list.id,name:list.name,description:list.description,score:list.score,headImage:list.headImage,cateId:list.cateId,managerList:list.managerList}}">
											<button class="reEdit" v-if="list.result==3">重新编辑</button>
										</router-link>
									</div>
								</router-link>
								<!-- result=2和3 -->
								<div v-if="list.result==2 || list.result == 3" @click="alertTip(list.result)">
									<div :class="{'bg-noPass':list.result==3?true:false}">
										<div class="marginBottom">
											<div class="title">{{list.name}}</div>
										</div>
										<p class="ellipsis-line-2 desc-width">{{list.description}}</p>
									</div>
									<div>
										<router-link :to="{'path':'/knowledge/channelManageDetail','query':{id:list.id,result:list.result}}">
											<button class="manage" v-if="list.result==0">管理</button>
										</router-link>
										<button @click="deleteChannel(list.id)" class="delete" v-if="list.result==3">删除</button>
										<router-link :to="{'path':'/knowledge/channelManageDetail','query':{id:list.id,result:list.result}}">
											<button class="reEdit" v-if="list.result==3">重新编辑</button>
										</router-link>
									</div>
								</div>
							</td>
						</tr>
					</table>
					<p v-if="loading" class="page-infinite-loading">
						<span class="loading">加载中...</span>
					</p>
					<p class="loadtips-new" v-if="loadtips">没有更多数据了！</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import commonHeader from '../../components/commonHeader.vue';
	import {Toast,MessageBox } from 'mint-ui';
	export default{
		components: {
			'v-common-header': commonHeader
		},
		data(){
			return{
				loading: true,
				lists:[],
				status2:[],
				empNumber:'',
				ctnWrapper:0,
				loadingShow:true,
				disabledScroll:false,
				pageNo:0,
				loading:false,
				loadtips:false,
				noData:false,
			}
		},
		beforeRouteEnter (to, from, next) {
		   next(vm => {
		        // 通过 `vm` 访问组件实例
		        if(from.path.match('/knowledge/channelDetailChannel')){
		        	var project = JSON.parse(localStorage.getItem('channelPro'));
		        	vm.pageNo = project.pageNo;
		        	vm.temp={};
		        	for(let i=0;i<=vm.pageNo;i++){
		        		vm.$http({
			        		method: 'GET',
			        		url: vm.$global().host + '/KMS-MSERVER/mobileChannel/search/channelManagerList?startPage='+i
			        	}).then(response => {
			        		if(response.status==200&&response.body.status){
								if(response.body.data){
									if(response.body.data.length != 0){
										vm.temp[i] = response.body.data;
										if(Object.getOwnPropertyNames(vm.temp).length == (vm.pageNo+1)){
											for(let attr in vm.temp){
												vm.lists = vm.lists.concat(vm.temp[attr])
											}
											vm.loadingShow = false;
											setTimeout(function(){
												var top = project.scrollTop;
												vm.$refs.ctnWrapper.scrollTop = top;
											},10)
										}
									}
								}
							}
			        	})
		        	}
		        }else{
		        	vm.$http({
		        		method: 'GET',
		        		url: vm.$global().host + '/KMS-MSERVER/mobileChannel/search/channelManagerList?startPage=0'
		        	}).then(response => {
		        		if(response.status==200&&response.body.status){
							if(response.body.data){
								vm.loadingShow = false;
		        				vm.lists = response.body.data
							}
						}else{
							vm.lists = '找不着数据！';
						}
		        	})
		        }
		        
		    })
		},
		methods: {
			// 删除频道
			deleteChannel(id){
				MessageBox.confirm('确定执行此操作?').then(action => {
					this.getData('/KMS-MSERVER/mobileChannel/deleteChannel?channelId='+id,'status2','POST');
				});
			},
			scroll(){
				this.ctnWrapper = event.currentTarget.scrollTop;
			},
			localTop(){
				window.localStorage.setItem('channelPro',JSON.stringify({'scrollTop':this.ctnWrapper,'pageNo':this.pageNo}));
			},
			loadMore(){
				this.loading = true;
				this.pageNo = Number(this.pageNo)+Number(1);
				this.$http({
					method:'GET',
					url:this.$global().host+'/KMS-MSERVER/mobileChannel/search/channelManagerList?startPage='+this.pageNo
				}).then(response => {
					if(response.status==200&&response.body.status){
						if(response.body.data){
							if(response.body.data.length != 0){
								this.lists = this.lists.concat(response.body.data);
							}else{
								this.loading = false;
								this.loadtips = true;
								this.disabledScroll = true;
								this.pageNo = Number(this.pageNo)-Number(1);
							}
						}
					}
				})
			},
			alertTip(val){
				if(val == 2){
					Toast({message: '正在审核中',duration: 1000})
				}
			}
		},
		watch: {
			status2(val,oldVal){
				this.getData('/KMS-MSERVER/mobileChannel/search/channelManagerList','lists','GET',{});
			},
			lists(val,oldVal){
				if(val.length == 0){
					this.noData = true;
				}
			}
		}
	}
</script>
<style lang="less">
	.tableHeight{
		height: calc(~"100vh - 48px");
		overflow-y: scroll;
		.channelList{
			width: 100%;
			.paddingTop{
				padding-top: 0.9rem;
			}
			.title{
			    white-space: nowrap;
			    overflow: hidden;
			    width: 6.4rem;
			    text-overflow: ellipsis;
			    font-weight: bold;
			    font-size: 0.4rem;
			}
			.desc-width{
				width: 6.4rem;
				margin-top: 0.3rem;
				color: #666;
				-webkit-line-clamp: 2;
				font-size: 0.37rem;
				-webkit-box-orient: inherit;
			}
			.results{
				width: 1.6rem;
    			height: 1.1rem;
				position: relative;
				top: -1rem;
    			left: 5rem;
			}
			tr{
				height: 3rem;
				background-color: #fff;
				border-bottom: 1px solid #dcdcdc;
				td:nth-child(1){
					width: 30%;
					img{
						width: 1.8rem;
						height: 1.8rem;
						background-color: #ddd;
						margin-left: 0.64rem;
					}
				}
				td:nth-child(2){
					vertical-align:top;
					padding-top: 0.5rem;
					padding-bottom: 0.1rem;
					div{
						span{
							color: #000000;
	    					font-size: 0.4rem;
						}
						button.unsubscribe,
						button.manage{
							float: right;
							margin-right: 0.64rem;
							height: 0.667rem;
						    width: 1.814rem;
						    background-color: #fff;
						    border: 1px solid #c8c8c8;
						    color: #131313;
						    border-radius: 0.1rem;
						}
						button.delete{
							float: right;
							height: 0.667rem;
						    width: 1.814rem;
						    background-color: #fff;
						    border: 1px solid #c8c8c8;
						    color: #131313;
						    border-radius: 0.1rem;
						    margin-right: 0.64rem;
						}
						button.reEdit{
							float: right;
							height: 0.667rem;
						    width: 1.814rem;
						    background-color: #fff;
						    border: 1px solid #c8c8c8;
						    color: #131313;
						    border-radius: 0.1rem;
						    margin-right: 0.1rem;
						}
						button.manage,
						button.delete,
						button.reEdit{
							margin-top: 0.1rem;
						}
					}
					.no_ing{
						margin-top: -0.3rem;
					}
					.marginTop{
						margin-top: 0.5rem;
					}
				}
			}
			.page-infinite-loading{
				height: 1.28rem;
				display: inline-block;
				position: relative;
    			left: 3.9rem;
				span{
					display: inline-block;
				}
				.mint-spinner-fading-circle{
					display: inline-block;
					position: relative;
	    			top: 0.25rem;
				}
			}
		}
	}
	.loadtips-new{
	    		padding-bottom: 0.26rem;
	    		padding-top: 0.26rem;
	    		width: 100%;
			    text-align: center;
			    font-size: 0.32rem;
			    color: #999;
			}
	.loading{
		display: block;
		text-align: center;
		color: #999;
	}
	.bg-noPass{
		background: url('../../../static/img/noPass.png') no-repeat 4.6rem 0.2rem;
		background-size: 1.6rem;
	}
</style>