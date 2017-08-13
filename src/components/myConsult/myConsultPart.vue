<template>
	<div class="myConsuleLists">
		<div class="myConsuleList">
			<table>
				<tr @click="setScrollTop">
					<td>
						<router-link :to="{path:'/knowledge/channelDetailSuper',query:{empNumber:item.askedId}}">
							<div class="img" v-bind:style="{ background:'url('+$global().imgHost+item.headPath+') no-repeat',backgroundSize: backgroundSize}">
								<!-- 专家图标认证 -->
								<div v-if="item.expertFlag" class="titlePic"></div>
								<!-- 达人图标认证 -->
								<div v-if="item.master" class="titlePic2"></div>
							</div>
						</router-link>
					</td>
					<td>
						<router-link :to="{ 'path': '/knowledge/consultationDetail/' + item.id}">
							<!-- 我的请教 -->
							<div class="myCs" v-if="selected==1">
								<span class="people">向
								<router-link :to="{path:'/knowledge/channelDetailSuper',query:{empNumber:item.askedId}}">
									<span class="name">{{item.askedName}}</span>
								</router-link>
								请教</span>
								<span class="time">{{item.createDate | time}}</span>
							</div>
							<!-- 请教我的 -->
							<div class="csMe" v-if="selected==2">
								<span class="people">
								<router-link :to="{path:'/knowledge/channelDetailSuper',query:{empNumber:item.createId}}">
									<span class="name">{{item.createName}}</span>
								</router-link>
								</span></span>
								<span class="time">{{item.createDate | time}}</span>
							</div>
							<!-- 请教广场 -->
							<div class="csSq" v-if="square=='square'">
								<span class="people">
								<router-link :to="{path:'/knowledge/channelDetailSuper',query:{empNumber:item.createId}}">
									<span class="name">{{item.createName}}</span>
								</router-link>
								向
								<router-link :to="{path:'/knowledge/channelDetailSuper',query:{empNumber:item.askedId}}">
									<span class="name" style="color:#188eee">{{item.askedName}}</span>
								</router-link>
								请教</span>
								<span class="time">{{item.createDate | time}}</span>
							</div>
							<div class="problem"><i class="signs5" v-if="item.rewardScore?true:false">{{item.rewardScore}}</i>{{item.title}}</div>
							<div class="answer">{{item.replyContentFormat | transform}}</div>
						</router-link>
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			item: Object,
			selected:String,
			square:String,
			scrollTop:{
				type:Number
			},
			pageNo:{
				type:Number
			},
			type: {
				type:String
			},
			scrollHeight1: {
				scrollHeight1:Number
			},
			scrollHeight2: {
				scrollHeight2:Number
			},
			askPageNo:{
				type:Number
			},
			minePageNo:{
				type:Number
			}
		},
		data() {
			return {
				backgroundSize: 'cover'
			}
		},
		methods: {
			setScrollTop() {
				if(this.type == 'square'){
					var project = {'consultTop':this.scrollTop,'pageNo':this.pageNo};
					window.localStorage.setItem('dingWei',JSON.stringify(project));
				}else if(this.type == 'mine'){
					var project = {'consultTop':this.scrollHeight1,'askListTop':this.scrollHeight2,'pageNo':this.pageNo,'askPageNo':this.askPageNo,'type':'mine'};
					window.localStorage.setItem('minedingWei',JSON.stringify(project));
					window.localStorage.setItem('askdingWei','');
				}else if(this.type == 'ask'){
					var project = {'consultTop':this.scrollHeight2,'mineListTop':this.scrollHeight1,'pageNo':this.pageNo,'minePageNo':this.minePageNo,'type':'ask'};
					window.localStorage.setItem('askdingWei',JSON.stringify(project));
					window.localStorage.setItem('minedingWei','');
				}
			}
		},
		filters: {
			time(value) {
				function add0(m){return m<10?'0'+m:m };
				var nowTime = new Date();
				var ny = nowTime.getFullYear();
				var nm = nowTime.getMonth()+1;
				var nd = nowTime.getDate();
				var time = new Date(value);
				var y = time.getFullYear();
				var m = time.getMonth()+1;
				var d = time.getDate();
				var h = time.getHours();
				var mm = time.getMinutes();
				var s = time.getSeconds();
				if(y == ny){
					if(m == nm){
						if(d == nd){
							return add0(h)+':'+add0(mm)+':'+add0(s);
						}else{
							return y+'-'+add0(m)+'-'+add0(d)
						}
					}else{
						return y+'-'+add0(m)+'-'+add0(d)
					}
				}else{
					return y+'-'+add0(m)+'-'+add0(d)
				}
			},
			transform(val){
				if(val[0]){
					if(val[0].type=='text'){
						return val[0].text
					}else if(val[0].type=='image'){
						return '[图片]'
					}else if(val[0].type=='audio'){
						return '[语音]'
					}
				}else{
					return '';
				}
			}
		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	.myConsuleLists{
		.myConsuleList{
			width: 100%;
			background: #fff;
			border-bottom: 1px solid #e6e6e6;
			table{
				tr{
					height: 2.6rem;
					td:nth-child(1){
						width: 2.6rem;
						.img{
							height: 1.6rem;
							width: 1.6rem;
							margin-left: 0.4rem;
							.titlePic{
								display: inline-block;
								width: 0.5rem;
								height: 0.5rem;
								background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
								background-size: 1.6rem;
								margin-top: 1.15rem;
								.bgPosition(@signs4Width, @signs4Height, 19, 20, 0, 280);
							}
							.titlePic2{
								display: inline-block;
								width: 0.5rem;
								height: 0.5rem;
								background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
								background-size: 1.6rem;
								margin-top: 1.15rem;
								.bgPosition(@signs4Width, @signs4Height, 19, 20, 0, 978);
							}
						}
					}
					td:nth-child(2){
						width: 8rem;
						.time{
							float: right;
							color: #999;
							margin-right: 0.4rem;
						}
						.people{
							font-size: 0.3rem;
							color: #999;
							.name{
								font-size: 0.35rem;
								color: #188eee;
							}
						}
						.problem,.answer{
							overflow: hidden;
						    text-overflow: ellipsis;
						    white-space: nowrap;
						    width: 7.3rem;
						    font-size: 0.38rem;
							margin-top: 0.17rem;
						}
						.problem{
							color: #333;
							font-size: 0.4rem;
							.signs5{
								color: #ff9223;
								margin-right: 0.2rem;
							}
							.signs5:before{
								content: '';
								width: 0.5rem;
    							height: 0.4rem;
								display: inline-block;
								background: url('../../../static/img/shunfeng_signs4.png') no-repeat;
								background-size: 243%;
								.bgPosition(@signs4Width, @signs4Height, 31, 24, 0, 403);
								position: relative;
								top: 0.05rem;
							}
						}
						.answer{
							color: #999;
						}
					}
				}
			}
		}

	}
</style>