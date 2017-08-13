<template>
	<div>
		<v-common-header></v-common-header>
		<div class="myConsultUp">
			<div class="container myConsult">
				<mt-navbar v-model="selected" v-show="noMaEx">
				  <mt-tab-item id="1" @click="selected=1"><p>我的请教</p><span></span></mt-tab-item>
				  <mt-tab-item id="2" @click="selected=2"><p>请教我的</p><span></span></mt-tab-item>
				</mt-navbar>
				<p class="loadtips" v-if="loadingBefore">加载中……</p>
				<p class="loadtips" v-if="noConsult && selected==1">没有更多数据了！</p>
				<p class="loadtips" v-if="noConsult2 && selected==2">没有更多数据了！</p>
				<!-- tab-container -->
				<mt-tab-container v-model="selected">
					<mt-tab-container-item id="1" v-if="selected==1">
						<div class="ctn-wrapper" ref="scrollTop1" @scroll="scroll1">
							<div v-infinite-scroll="loadMore" infinite-scroll-disabled="disabledScroll1" infinite-scroll-immediate-check="false">
								<div v-for="item in lists">
									<v-my-consult :item="item" :selected="'1'" :type="'mine'" :scrollHeight1="scrollHeight1" :scrollHeight2="scrollHeight2" :pageNo="pageNo" :askPageNo="pageNo2"></v-my-consult>
								</div>
								<p v-if="loading" class="page-infinite-loading">
							        <mt-spinner type="fading-circle"></mt-spinner>
							        <span class="loading">加载中...</span>
						    	</p>
						    	<p class="loadtips-new" v-if="loadtips">没有更多数据了！</p>
							</div>
						</div>
					</mt-tab-container-item>
					<mt-tab-container-item id="2" v-if="selected==2" v-show="noMaEx">
						<div class="ctn-wrapper" ref="scrollTop2" @scroll="scroll2">
							<div v-infinite-scroll="loadMore2" infinite-scroll-disabled="disabledScroll2" infinite-scroll-immediate-check="false">
								<div v-for="item in lists2">
									<v-my-consult :item="item" :selected="'2'" :type="'ask'" :scrollHeight1="scrollHeight1" :scrollHeight2="scrollHeight2" :pageNo="pageNo2" :minePageNo="pageNo"></v-my-consult>
								</div>
								<p v-if="loading2" class="page-infinite-loading">
							        <mt-spinner type="fading-circle"></mt-spinner>
							        <span class="loading">加载中...</span>
						    	</p>
						    	<p class="loadtips-new" v-if="loadtips2">没有更多数据了！</p>
							</div>
						</div>
					</mt-tab-container-item>
				</mt-tab-container>
			</div>
		</div>
	</div>
</template>
<script>
	import commonHeader from '../../components/commonHeader.vue';
	import myConsult from '../../components/myConsult/myConsultPart.vue';
	import {Toast} from 'mint-ui'
	export default {
		components: {
			'v-common-header': commonHeader,
			'v-my-consult': myConsult
		},
		data() {
			return{
				selected:'1',
				allLoaded: false,
				disabledScroll1: false,
				disabledScroll1: false,
				loading: false,
				loading2: false,
				scrollHeight1: 0,
				scrollHeight2: 0,
				pageNo: 0,
				pageNo2: 0,
				lists: [],
				lists2: [],
				empNumber:'',
				noMaEx:false,
				loadingBefore:true,
				loadtips:false,
				loadtips2:false,
				noConsult:false,
				noConsult2:false,
			}
		},
		beforeRouteEnter(to,from,next) {
			next(vm => {
				if(from.path.match('knowledge/consultationDetail')){
					if(localStorage.getItem('minedingWei') != ''){
						// 我的请教
						var project = JSON.parse(localStorage.getItem('minedingWei'));
						vm.pageNo = project.pageNo;
						vm.temp = {};
						for(let i=0;i<=project.pageNo;i++){
							var url = vm.$global().host+'/KMS-MSERVER/consult/minelist?startPage='+i;
							vm.$http({
								method:'GET',
								url:url
							}).then(response => {
								if(response.status==200&&response.body.status){
									if(response.body.data){
										vm.temp[i] = response.body.data;
										if(Object.getOwnPropertyNames(vm.temp).length == (project.pageNo+1)){
											for(let attr in vm.temp){
												vm.lists = vm.lists.concat(vm.temp[attr]);
											}
										}
										vm.loadingBefore = false;
										setTimeout(function(){
											vm.$refs.scrollTop1.scrollTop = project.consultTop;
										},10);
									}else{
										vm.lists = '找不着数据了！'
									}

								}
							});
						};
						vm.$http({
							method:'GET',
							url:vm.$global().host+'/KMS-MSERVER/consult/asklist?startPage=0'
						}).then(response => {
							if(response.status==200&&response.body.status){
								if(response.body.data){
									vm.loadingBefore = false;
									vm.lists2 = response.body.data;
								}else{
									vm.lists2 = '找不着数据了！'
								}
							}
						})
					}else{
						// 请教我的
						vm.selected = '2';
						var project2 = JSON.parse(localStorage.getItem('askdingWei'));
						vm.pageNo2 = project2.pageNo;
						vm.temp = {};
						for(let i=0;i<=project2.pageNo;i++){
							vm.$http({
								method:'GET',
								url:vm.$global().host+'/KMS-MSERVER/consult/asklist?startPage='+i
							}).then(response => {
								if(response.status==200&&response.body.status){
									if(response.body.data){
										vm.temp[i] = response.body.data;
										if(Object.getOwnPropertyNames(vm.temp).length == (project2.pageNo+1)){
											for(let attr in vm.temp){
												vm.lists2 = vm.lists2.concat(vm.temp[attr])
											}
										}
										vm.loadingBefore = false;
										setTimeout(function(){
											vm.$refs.scrollTop2&&(vm.$refs.scrollTop2.scrollTop = project2.consultTop);
										},10);
									}else{
										vm.lists2 = '找不着数据了！'
									}
								}
							})
						}
						vm.$http({
							method:'GET',
							url:vm.$global().host+'/KMS-MSERVER/consult/minelist?startPage=0'
						}).then(response => {
							if(response.status==200&&response.body.status){
								if(response.body.data){
									vm.loadingBefore = false;
									vm.lists = response.body.data
								}else{
									vm.lists = '找不着数据了！'
								}
							}
						})
					}
					
				}else{
					vm.$http({
						method:'GET',
						url:vm.$global().host+'/KMS-MSERVER/consult/minelist?startPage=0'
					}).then(response => {
						if(response.status==200&&response.body.status){
							if(response.body.data){
								vm.loadingBefore = false;
								vm.lists = response.body.data;
							}else{
								vm.lists = '找不着数据了！'
							}
						}
					});
					vm.$http({
						method:'GET',
						url:vm.$global().host+'/KMS-MSERVER/consult/asklist?startPage=0'
					}).then(response => {
						if(response.status==200&&response.body.status){
							if(response.body.data){
								vm.loadingBefore = false;
								vm.lists2 = response.body.data;
							}else{
								vm.lists2 = '找不着数据了！'
							}
						}
					})
				}
			})
		},	
		mounted() {
			//判断员工类型
			this.$http({
				method:'GET',
				url:this.$global().host+'/KMS-MSERVER/learning/person/main'
			}).then(response => {
				if(response.status==200&&response.body.status){
					if(response.body.data){
						if(response.body.data.expertFlag == 1 || response.body.data.master == 1){
							this.noMaEx = true;
						}else{
							this.noMaEx = false;
						}
					}
				}
			})
		},
		methods: {
			loadMore() {
				this.loading = true;
				this.pageNo = Number(this.pageNo)+Number(1);
				this.$http({
					method: 'GET',
					url: this.$global().host + '/KMS-MSERVER/consult/minelist?startPage='+this.pageNo
				}).then(
				response => {
					if(response.status==200&&response.body.status){
						if(response.body.data){
							if(response.body.data.length != 0){
								this.lists = this.lists.concat(response.body.data)
							}else{
								this.disabledScroll1 = true;
								this.loading = false;
								this.loadtips = true;
								this.pageNo = Number(this.pageNo)-Number(1);
							}
						}
					}
				})
			},
			loadMore2() {
				this.loading2 = true;
				this.pageNo2 = Number(this.pageNo2)+Number(1);
				this.$http({
					method: 'GET',
					url: this.$global().host + '/KMS-MSERVER/consult/asklist?startPage='+this.pageNo2
				}).then(
				response => {
					if(response.status==200&&response.body.status){
						if(response.body.data){
							if(response.body.data.length != 0){
								this.lists2 = this.lists2.concat(response.body.data)
							}else{
								this.disabledScroll2 = true;
								this.loading2 = false;
								this.loadtips2 = true;
								this.pageNo2 = Number(this.pageNo2)-Number(1);
							}
						}
					}
				})
			},
			scroll1(){
				this.scrollHeight1 = event.currentTarget.scrollTop;
			},
			scroll2(){
				this.scrollHeight2 = event.currentTarget.scrollTop;
			}
		},
		watch: {
			selected(val, oldVal) {
				var that = this;
				this.$nextTick(function(){
					if(this.selected == 1){
						that.$refs.scrollTop1.scrollTop = this.scrollHeight1;
					}else{
						that.$refs.scrollTop2.scrollTop = this.scrollHeight2;
					}
					
				});
			},
			lists(val,oldVal){
				if(val.length == 0){
					this.noConsult = true;
				}
			},
			lists2(val,oldVal){
				if(val.length == 0){
					this.noConsult2 = true;
				}
			}
		}
	}
</script>
<style lang="less">
.myConsultUp{
	.myConsult{
		.loading{
			display: block;
			text-align: center;
		}
		.page-infinite-loading{
			height: 1.28rem;
			span{
				display: inline-block;
			}
			.mint-spinner-fading-circle{
				margin-left: 3.9rem;
				position: relative;
    			top: 0.25rem;
    			right: 0.1rem;
			}
		}
		.mint-navbar{
			position: relative;
			z-index: 1;
			.mint-tab-item{
				.mint-tab-item-label{
					display: inline-block;
					width:100%;
					height: 100%;
					line-height:46px;
					border-bottom:1px solid #ddd;
					font-size: 0.42rem;
				}
				&.is-selected{
					.mint-tab-item-label{
						display: inline-block;
						height:100%;
						line-height:46px;
						font-size: 0.42rem;
						margin-bottom:0;
					}
					span{
						width: 1rem;
					    height: 0.05rem;
					    background: #ff4141;
					    display: block;
					    margin-left: 1.83rem;
					    position: relative;
					    top: -0.05rem;
					}
				}
			}
		}
		.ctn-wrapper{
			height: calc(~"100vh - 48px - 1.2rem");
    		overflow-y: scroll;
    		// padding-top: 0.3rem;
    		.loadtips-new{
				// background-color: #fff;
	    		padding-bottom: 0.26rem;
	    		padding-top: 0.26rem;
	    		width: 100%;
			    text-align: center;
			    font-size: 0.32rem;
			    color: #999;
			}
		}
	}
}
</style>