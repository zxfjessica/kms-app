<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container csSq" @scroll="scroll" ref="scrollTop">
			<p class="is-ready-to-show" v-if="showOnloading">加载中...</p>
			<p class="is-ready-to-show" v-if="noData">没有更多数据了！</p>
			<div v-if="!showOnloading" v-infinite-scroll="loadMore" infinite-scroll-immediate-check="false" infinite-scroll-disabled="load" ref="loadmore">
				<div v-for="item in lists">
					<v-my-consult :item="item" :square="'square'" :scrollTop="scrollTop" :pageNo="pageNo" :type="'square'"></v-my-consult>
				</div>
				<p v-show="loading" class="page-infinite-loading">
		          <mt-spinner type="fading-circle"></mt-spinner>
		          <span class="loading">加载中...</span>
		          <p class="loadtips-new" v-if="loadtips">没有更多数据了！</p>
		        </p>
			</div>
		</div>
	</div>
</template>
<script>
	import commonHeader from '../../components/commonHeader.vue'
	import myConsult from '../../components/myConsult/myConsultPart.vue';
	import { InfiniteScroll,Toast } from 'mint-ui'
	export default {
		components: {
			'v-common-header': commonHeader,
			'v-my-consult': myConsult
		},
		data() {
			return{
				getScoreLog: [],
				load:false,
				loading:false,
				lists: [],
				pageNo:0,
				scrollTop:0,
				showOnloading:true, 
				loadtips:false,
				noData:false,
			}
		},
		beforeRouteEnter(to,from,next){
			next(vm => {
				if(from.path.match('knowledge/consultationDetail') || from.path.match('/knowledge/channelDetailSuper')){
					var project = JSON.parse(localStorage.getItem("dingWei"));
					vm.pageNo = project.pageNo;
					vm.temp = {};
					for(let i=0;i<=project.pageNo;i++){
						vm.$http({
							method: 'GET',
							url: vm.$global().host + '/KMS-MSERVER/consult/list?startPage='+i
						}).then(response => {
							if(response.status==200&&response.body.status){
								if(response.body.data){
									vm.showOnloading = false;
									vm.temp[i] = response.body.data;
									if(Object.getOwnPropertyNames(vm.temp).length == (project.pageNo+1)){
										for(let attr in vm.temp){
											vm.lists = vm.lists.concat(vm.temp[attr])
										}
										setTimeout(function(){
											var top = project.consultTop;
											vm.$refs.scrollTop.scrollTop = top;
										},10)
									}
								}
							}
						})
					}
					
				}else{
					vm.$http({
						method: 'GET',
						url: vm.$global().host + '/KMS-MSERVER/consult/list?startPage=0'
					}).then(response => {
						if(response.status==200&&response.body.status){
							if(response.body.data){
								vm.showOnloading = false;
								vm.lists = response.body.data
							}
						}
					})
				}
			})
		},
		methods: {
			loadMore() {
				this.loading = true;
				this.pageNo = Number(this.pageNo)+Number(1);
				this.$http({
					method: 'GET',
					url: this.$global().host+'/KMS-MSERVER/consult/list?startPage='+this.pageNo
				}).then(
				response => {
					if(response.body.data.length != '0'){
						this['lists'] = this['lists'].concat(response.body.data);
					}else{
						this.load = true;
						this.loading = false;
						this.pageNo = Number(this.pageNo)-Number(1);
						this.loadtips = true;
					}
				})
			},
			scroll(){
				this.scrollTop = event.currentTarget.scrollTop;
			}
		},
		watch: {
			lists(val,oldVal){
				if(val.length == 0){
					this.noData = true;
				}
			}
		}
	}
</script>
<style lang="less">
	.csSq{
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
</style>