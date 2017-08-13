<template>
	<div>
		<div class="my-precipitate-wrapper">
			<div class="my-precipitate-main">
				<mt-header title="我的沉淀" class="is-fixed">
					<div slot="left">
					    <mt-button icon="back" @click="back"></mt-button>
					</div>
				</mt-header>
				<div class="my-precipitate-container container" ref="tableTop" @scroll="scroll">
					<div v-infinite-scroll="loadMore" infinite-scroll-disabled="disabledScroll" infinite-scroll-immediate-check="false" infinite-scroll-distance="1">
						<p class="is-ready-to-show" v-if="showOnloading">加载中...</p>
						<p class="is-ready-to-show" v-if="noDate">没有更多数据了！</p>
						<div class="content-list-wrapper">
							<ul class="channel-list">
								<li v-for="item in precipitationLists" @click="localSaveTop">
									<router-link :to="{'path':item.contentType=='blog'?'/knowledge/channelDetailBlog':item.contentType=='theme'?'/knowledge/channelDetailBlog':item.contentType=='knowledge'?'/knowledge/channelDetailBlog':item.contentType=='information'?'/knowledge/channelDetailBlog':item.contentType=='consult'?'/knowledge/consultationDetail/'+item.contentId:'',query:{id:item.contentId,type:item.contentType}}">
										<v-channel-detail-item :item="item"></v-channel-detail-item>
									</router-link>
								</li>
							</ul>
						</div>
						<p v-if="loading" class="page-infinite-loading">
							<span class="loading">加载中...</span>
						</p>
						<p class="loadtips-new" v-if="loadtips">没有更多数据了！</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import channelDetailItem from '../../components/channelListDetail/channelDetailItem.vue';
	export default {
		data() {
			return {
				showOnloading: true,
				precipitationLists:[],
				scrollTop:0,
				pageNo:0,
				loading:false,
				loadtips:false,
				disabledScroll:false,
				noDate:false,

			}
		},
		components: {
			'v-channel-detail-item': channelDetailItem
		},
		props: {
			channelIdByP: {
				type: Number
			}
		},
		beforeRouteEnter (to, from, next) {
			next(vm => {
				if(from.path.match('knowledge/consultationDetail') || from.path.match('knowledge/channelDetailTheme') || from.path.match('knowledge/channelDetailBlog') || from.path.match('knowledge/channelDetailInformation') || from.path.match('knowledge/channelDetailInformation') || from.path.match('knowledge/channelDetailKnowledge')){
					var project = JSON.parse(localStorage.getItem('precipitate'));
					vm.pageNo = project.pageNo;
					vm.temp = {};
					for(let i=0;i<=vm.pageNo;i++){
						vm.$http({
							method:'GET',
							url:vm.$global().host+'/KMS-MSERVER/mobileChannel/search/userContentList?startPage='+i
						}).then(response => {
							if(response.status==200&&response.body.status){
								if(response.body.data){
									vm.temp[i] = response.body.data;
									if(Object.getOwnPropertyNames(vm.temp).length == (vm.pageNo+1)){
										for(let attr in vm.temp){
											vm.precipitationLists = vm.precipitationLists.concat(vm.temp[attr])
										}
										setTimeout(function(){
											var top = project.scrollTop;
											vm.$refs.tableTop.scrollTop = top;
										},10)
									}
								}
							}
						})
					}
				}else{
					vm.$http({
						method: 'GET',
						url: vm.$global().host + '/KMS-MSERVER/mobileChannel/search/userContentList?startPage=0'
					}).then(response => {
						if(response.status==200&&response.body.status){
							if(response.body.data){
								vm.precipitationLists = response.body.data;
							}else{
								vm.precipitationLists = '找不着数据！';
							}
						}
					})
				}
			})
		},
		methods: {
			back() {
				this.$router.go(-1);
			},
			scroll() {
				this.scrollTop = event.currentTarget.scrollTop;
			},
			localSaveTop() {
				window.localStorage.setItem('precipitate',JSON.stringify({'scrollTop':this.scrollTop,'pageNo':this.pageNo}))
			},
			loadMore(){
				this.loading = true;
				this.pageNo = Number(this.pageNo)+Number(1);
				this.$http({
					method:'GET',
					url:this.$global().host+'/KMS-MSERVER/mobileChannel/search/userContentList?startPage='+this.pageNo
				}).then(response => {
					if(response.status==200&&response.body.status){
						if(response.body.data){
							if(response.body.data.length != 0){
								this.precipitationLists = this.precipitationLists.concat(response.body.data);
							}else{
								this.loading = false;
								this.loadtips =true;
								this.disabledScroll = true,
								this.pageNo = Number(this.pageNo)-Number(1);
							}
						}
					}
				})
			}
		},
		watch: {
			precipitationLists(val,oldVal){
				if(val.length != 0){
					this.showOnloading = false;
				}else if(val.length == 0){
					this.showOnloading = false;
					this.noDate = true;
				}
			}
		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	.my-precipitate-wrapper {
		.header-right-btn {
			position: relative;
			.menu-btn {
				width: 26px;
				height: 26px;
				display: block;
				float: right;
				background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
				background-size: 178%;
				.bgPosition(@signs4Width, @signs4Height, 37, 39, 0, 662);
			}
			.channel-menu {
				position: absolute;
				top: 46px;
				right: 0%;
				padding: 5% 0.37rem;
				color: #fff;
				background: #484848;
				border-radius: 5px;
				z-index: 10;
				li {
					padding: 0.32rem 0.47rem; 
					border-bottom: 1px solid rgba(225, 225, 225, 0.5);
					font-size: 0.37rem;
					line-height: 1.5em;
					text-align: left;
					&:last-child {
						border-bottom: none;
					}
				}
				&:before {
					content: "";
					position: absolute;
					right: 10%;
					top: -0.2rem;
					margin-bottom: -1px;
					border-bottom: 0.2rem solid #484848;
					border-left: 0.2rem solid transparent;
					border-right: 0.2rem solid transparent;
				}
			}
		}
		.my-precipitate-container{
			height: calc(~"100vh - 48px");
			.content-list-wrapper {
				background-color: #fff;
			}
			.channel-list {
				li {
					padding: 0.53rem 0;
					margin: 0 0.32rem;
					border-bottom: 1px solid #eee;
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
</style>