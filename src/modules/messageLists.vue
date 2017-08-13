<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container message-lists-container" ref="scrollBox" @scroll="wrapperScrollHandler">
			<p class="is-ready-to-show" v-if="!isShow">加载中...</p>
			<div class="message-box" v-if="isShow && messageList.length > 0">
				<ul  v-infinite-scroll="loadMore"
				  	infinite-scroll-disabled="loading"
				  	infinite-scroll-distance="10"
				  	infinite-scroll-immediate-check="false">
					<li v-for="list in messageList">
						<router-link :to="'/knowledge/consultationDetail/' + list.contentId">
							<div class="list-container">
								{{list.content}}
							</div>
							<p>{{list.senderDate || '2017-08-04 18:25'}}</p>
						</router-link>

					</li>
				</ul>
				<p class="loadtips" ref="loadtips"></p>
			</div>
			
		</div>
	</div>
</template>
<script type="text/javascript">
	import commonHeader from '../components/commonHeader.vue';
	export default{
		data(){
			return {
				isShow: false,
				messageList: {},
				curPage: -1,
				loading: false,
				isFromConsultDetail: false,
				scrollTop: 0
			}
		},
		beforeRouteEnter(to, from, next){
			var isFromConsultDetail;
			if(from.fullPath.indexOf('/knowledge/consultationDetail/') >= 0){
				isFromConsultDetail = true;
			}else{
				isFromConsultDetail = false;
			};
			//console.log(isFromConsultDetail);
			next(function(vm){
				if(!isFromConsultDetail || !localStorage){
					vm.getMessage();
				}else{
					var oldVal = JSON.parse(localStorage.getItem('channelMessageLists'));
					vm.messageList = oldVal.message;
					vm.isShow = true;
					vm.scrollTop = oldVal.scrollTop;
					vm.curPage = oldVal.curPage;
					vm.totalPage = oldVal.totalPage;
					vm.loading = oldVal.loading;
				}
				
			});
		},
		components: {
			"v-common-header": commonHeader
		},
		methods:{
			getMessage(){
				var url = '/KMS-MSERVER/consult/msg';
				this.curPage++;
				url += '?startPage=' + this.curPage;
				this.$http({
					method: 'GET',
					url: this.$global().host + url
				}).then(response=>{
					this.isShow = true;
					if(response.body.status == 1){
						this.messageList = response.body.data.data;
						this.totalPage = response.body.data.totalPage;
						//console.log(this.messageList);
					}
					
				});
			},
			loadMore(){
				if(this.curPage >= this.totalPage){
					return  this.loading = true,
							this.$refs.loadtips.innerHTML = '没有更多数据了';
				}
				var url = '/KMS-MSERVER/consult/msg';
				this.curPage++;
				url += '?startPage=' + this.curPage;
				this.$refs.loadtips.innerHTML = '正在加载中...';
				this.$http({
					method: 'GET',
					url: this.$global().host + url
				}).then(response=>{
					if(response.body.status == 1){
						//this.$refs.loadtips.innerHTML = '';
						this.messageList = this.messageList.concat(response.body.data.data);
					}
					
				});
				//console.log(this.$refs.scrollBox.scrollTop);
			},
			wrapperScrollHandler(event){
				this.scrollTop = event.currentTarget.scrollTop;
			}
		},
		beforeDestroy(){
			localStorage.setItem('channelMessageLists', JSON.stringify({
				'message': this.messageList,
				'scrollTop': this.scrollTop,
				'curPage': this.curPage,
				'loading': this.loading,
				'totalPage': this.totalPage
			}));
		},
		watch: {
			scrollTop(val){
				var that = this;
				if(val){
					//that.$refs.scrollBox.scrollTop = val;
					setTimeout(function(){
						that.$refs.scrollBox && (that.$refs.scrollBox.scrollTop = val);
					//console.log(that.$refs.scrollBox.scrollTop);
					},10);
				}
			}
		}
	}
</script>
<style lang="less">
	.message-lists-container{
		background-color: #fff;
		font-family: Microsoft YaHei;
		ul{
			li{
				padding: 3.6%;
				border-bottom: 1px solid #eee;
				.list-container{
					font-size: .4rem;
					word-break: break-all;
					text-align: justify;
				}
				p{
					margin-top: .2rem;
					text-align: right;
					color: #999;
					font-size: .32rem;
				}
				a:visited{
					color: #999;
				}
			}
		}
	}
</style>