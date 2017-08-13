<template>
	<div class="v-expression-box">
		<span class="all-expressions">现有评论{{expressTotalSize}}</span>
		<div class="show-expression">
			<ul class="express-box" v-infinite-scroll="loadMore"
								  	infinite-scroll-disabled="loading"
								  	infinite-scroll-distance="10"
								  	infinite-scroll-immediate-check="false"
								  	ref="expressBox">
				<li class="express-item" v-for="exp in expressionsList"
									     @click.stop.prevent="replyChild(exp.id, exp.commenterName)">
					<v-detail-comment :expressItem="exp" 
									  :expressShowNum="expressShowNum"></v-detail-comment>
				</li>
			</ul>
			<p class="loadtips" ref="loadtips"></p>
		</div>
	</div>
</template>
<script>
	import detailComment from '../../components/knowledgeDetail/detailComment.vue';
	export default{
		components: {
			"v-detail-comment": detailComment
		},
		props:{
			expressList:{
				type: Array
			},
			size: {
				type: Number
			},
			isToGetData: {},
			id:{
				type: String
			},
			type:{
				type: String
			}
		},
		data(){
			return{
				expressionsList: [],
				expressTotalSize: 0,
				expressShowNum: 3,
				pageNum: -1,
				loading: false,
				totalPage: 0,
				replyId: ''
			}
		},
		mounted(){
			this.pageNum++;
			this.getExpressions(this.pageNum);
		},
		methods: {
			loadMore(){
				this.pageNum++;
				if(this.pageNum >= this.totalPage){
					return  this.loading = true,
							this.$refs.loadtips.innerHTML = '没有更多数据了';
				}
				var url = '/KMS-MSERVER/comment/' + this.type + '/list?contentId=' + this.id + '&&defaultReplySize=500&&pageSize=15';
				url += '&&startPage=' + this.pageNum;
				this.$refs.loadtips.innerHTML = '正在加载中...';	
				this.$http({
					method: 'GET',
					url: this.$global().host + url
				}).then(
					response =>{
						this.expressionsList = this.expressionsList.concat(this.initReplyExpressions(response.body.data));
					}
				);
			},
			getExpressions(pageNum){//获取评论列表					
				this.$http({
					method: 'GET',
					url: this.$global().host + '/KMS-MSERVER/comment/' + this.type + '/list?contentId=' + this.id + '&&defaultReplySize=500&&pageSize=15&&startPage=' + pageNum
				}).then(
					response =>{
						this.expressionsList = this.initReplyExpressions(response.body.data);
						this.expressTotalSize = response.body.totalSize;
						this.totalPage = response.body.totalPage;
						this.$emit('watchIsToGetData');
					}
				);
			},
			getChildExpressions(id){//根据ID获取评论回复列表		
				this.$http({
					method: 'GET',
					url: this.$global().host + '/KMS-MSERVER/comment/' + this.type + '/listReply?parentId=' + id +'&&pageSize=500&&startPage=0'
				}).then(
					response =>{
						var arr = this.expressionsList;
						this.expressionsList = this.initReplyExpressions(arr, response.body.data, id);
						this.$emit('watchIsToGetData');
					}
				);
			},
			replyChild(id, commenterName){
				this.replyId = id;
				this.$emit('replyControl', id, commenterName);
			},
			replace_html(str) {//转码将字符编码转换为html编码
				if(str){
					str = str.replace(/\[em_([0-9]*)\]/g, '<img src=\"static\/img\/face\/$1.gif\">');
					str = str.replace(/\n/g, '<br>');
					str = str.replace(/&lt;/g, '\<');
					str = str.replace(/&gt;/g, '\>');
					return str;
				}
		         
			},
			formatTime(time){
				var newTime;
				var d = new Date(time);
				console.log(d);
				var year = d.getFullYear();
				console.log("year", year);
				var month = (d.getMonth() + 1) >9 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);
				console.log("month", month);
				var date = d.getDate() > 9 ? d.getDate() : '0' + d.getDate();
				console.log("date", date);
				var hour = d.getHours() > 9 ? d.getHours() : '0' + d.getHours();
				console.log("hour", hour);
				var minute = d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes();
				console.log("minute", minute);
				var second = d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds();
				console.log("second", second);
				newTime = year + '-' + month + '-' + date + ' ' + hour + ":" + minute + ":" + second;
				console.log("newTime", newTime);
				return newTime;
			},
			initReplyExpressions(arr, childLists, childID){//初始化评论数据
				var arrLists = arr;
				for(let i = 0; i<arrLists.length; i++){
					if(!arrLists[i].commentReply){
						arrLists[i].commentReply = [];
					}
					arrLists[i].commentContent = this.replace_html(arrLists[i].commentContent);
					arrLists[i].commentDate = this.formatTime(arrLists[i].commentDate);
					if(childID && childLists){
						if(arrLists[i].id == childID){
							arrLists[i].commentReply = childLists;
						}
					}
					for(let j = 0; j<arrLists[i].commentReply.length; j++){
						if(j < this.expressShowNum){
							arrLists[i].commentReply[j].isShow = true;
						}else{
							arrLists[i].commentReply[j].isShow = false;
						}
						arrLists[i].commentReply[j].commentContent = this.replace_html(arrLists[i].commentReply[j].commentContent);
					}
					
				}
				return arrLists;
			}
		},
		watch:{
			isToGetData(val){
				var that = this;
				if(val == 'child'){
					this.getChildExpressions(this.replyId);
				}else if(val != '' && typeof(val) == 'object'){
					var arr = that.expressionsList;
					that.expressionsList = [];
					setTimeout(()=>{
						arr.unshift(val);
						that.expressionsList = that.initReplyExpressions(arr);
						that.expressTotalSize++;
					}, 10);
				}
			}
		}
	}
</script>
<style lang="less">
	.v-expression-box{
		.all-expressions{
			line-height: 1rem;
			font-size: .4rem;
			display: inline-block;
			padding: 0 .3rem;
			background-color: #ff4141;
			color: #fff;
			border-top-right-radius: .5rem;
			border-bottom-right-radius: .5rem;
		}
		max-height: calc(~"100vh - 1.5rem - 46px");
		overflow-y: hidden;
		.show-expression{
			/*padding: 3.6%;*/
			/*height: calc(~"100% - 1rem");*/
			max-height:  calc(~"100vh - 2.5rem - 46px");
			overflow-y: auto; 
			ul.express-box{
				li.express-item{
					padding: .2rem .32rem;
					font-size: 0;
				}
			}
			.loadtips{
				margin-bottom: .26rem;
			}
		}
	}
</style>