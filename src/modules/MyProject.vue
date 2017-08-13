<template>
	<div>
		<v-common-header></v-common-header>
		<div class="my-project-container container">
			<div class="pro-ctn-wrapper"
				ref="ctnWrapper" 
				@scroll="scroll">
				<ul class="course-list"
					v-infinite-scroll="loadBottom"
			 		infinite-scroll-disabled="bottomAllLoaded"
			 		infinite-scroll-distance="10"
			 		infinite-scroll-immediate-check="false"
			 		style="padding-bottom:1rem">
			 		<li class="co-li" v-for="item in project">
			 			<v-item :item="{'image':item.projectImage,'name':item.projectName,'learningCount':item.applyCount,'commentStar':item.commentStar,'organization':item.organization,'id':item.id}" 
			 				kindByP="project" 
			 				:projectManageByP="true">
			 			</v-item>
			 		</li>
			 		<p class="loadtips"
			 			v-show="!bottomAllLoaded">加载中……</p>
			 		<p class="loadtips"
			 			v-show="bottomAllLoaded">没有更多数据了！</p>
			 	</ul>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import ListItem from "../components/list/ListItem.vue";
	import loadmore from "../components/loadMore.vue";
	import { Toast } from 'mint-ui';
	import commonHeader from '../components/commonHeader.vue';
	export default {
		data() {
			return {
				project: [],
				pageno: -1,
				totalPage: 1,
				scrollTop: 0,
				topStatus: '',
				bottomAllLoaded: false
			}
		},
		beforeRouteEnter (to, from, next) {
		   next(vm => {
		        // 通过 `vm` 访问组件实例
		        if(from.path.match('/trainCourse/')||from.path.match('/MyProjectManage/')){
		        	vm.backFromFn();
		        }else{
		        	vm.backFromOther();
		        }
		    })
		},
		beforeDestroy() {
			let data = {};
			data['pageno'] = this.pageno;
			data['totalPage'] = this.totalPage;
			data['scrollTop'] = this.scrollTop;
			data['bottomAllLoaded'] = this.bottomAllLoaded;
			data = JSON.stringify(data);
			try{
				window.localStorage.setItem('myProject',data);
			}catch(e) {
				alert(e);
			}
		},
		methods:{
			scroll() {
				this.scrollTop = event.currentTarget.scrollTop;
			},
			handleTopChange(status){
				this.topStatus = status;
			},
			loadBottom() {
				var url = '/KMS-MSERVER/learning/person/projectManage/list?';
				this.pageno++;
				url+='startPage='+this.pageno;
				this.getMoreData(url,'project','totalPage','pageno','bottomAllLoaded','loadmore');
			},
			backFromOther(){
				let that = this;
				var url = '/KMS-MSERVER/learning/person/projectManage/list?';	
				this.pageno = 0;
				url += 'startPage='+this.pageno;
				this.getData(url,'project','GET',{},function(parm){
					if (parm.totalPage === -1 || parm.pageno >= parm.totalPage) {
						parm.bottomAllLoaded = true;
					}
				});
			},
			backFromFn(){
				let that = this;
				var lastInfo = JSON.parse(localStorage.getItem('myProject'));
				var lastAllLoad = lastInfo.bottomAllLoaded;
				var url1 = '';
				var url = '/KMS-MSERVER/learning/person/projectManage/list?';
				for(let attr in lastInfo){
					if (attr === 'bottomAllLoaded') {
						continue;
					}
					this[attr] = lastInfo[attr];
				}
				url1 = url;
				this['project'] = [];
				this.temp = {};
				for(let i=0;i<=lastInfo.pageno;i++){
					url = url1;
					url += '&startPage='+i;
					this.$http({
						method:'POST',
						url:this.$global().host+url
					}).then(
						response => {
							if(response.status==200&&response.body.status){
								if(response.body.data){
									this.temp[i] = response.body.data;
									this.totalPage = response.body.totalPage-1;
									if(Object.getOwnPropertyNames(this.temp).length == (this.pageno+1)){
										for(let attr in this.temp){
											this['project'] = this['project'].concat(this.temp[attr]);
										}
										if (lastAllLoad) {
											that.bottomAllLoaded = true;
										}
										setTimeout(function(){
											that.$refs.ctnWrapper.scrollTop = lastInfo.scrollTop;
										},10);
										
									}
								}else{
									this['project'] = '找不着数据！';
								}
								
							}	
						},
						response =>{
							// error callback
							console.log('error');
						}
					)
				}
			},
			getMoreData(url,content,totalPage,pageno,bottomAllLoaded,loadMore) {
				this.$http({
					method:'GET',
					url:this.$global().host+url
				}).then(
					response => {
						if(response.status==200&&response.body.status){
							if(response.body.data){
								this[content] = this[content].concat(response.body.data);
								this[totalPage] = response.body.totalPage-1;
								if(this[pageno]>=response.body.totalPage){
									this[bottomAllLoaded] = true;
									Toast({message: '没有更多数据了', duration: 1000});
								}
							}else{
								this[content] = '找不着数据！';
							}
						}	
					},
					response =>{
						// error callback
						//console.log('error');
					}
				)
			},
		},
		components:{
			"v-item":ListItem,
			"v-loadmore": loadmore,
			"v-common-header": commonHeader
		}
	}
</script>
<style lang="less">
	.my-project-container {
		.pro-ctn-wrapper{
			height: calc(~"100vh - 46px");
			background-color: #f2f2f2;
			overflow-y: scroll;
		}
		.loadtips {
			position: static;
		}
	}
</style>