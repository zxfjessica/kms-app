<template>
	<div>
		<v-common-header></v-common-header>
		<div class="consult-detail-container container">
			<p class="is-ready-to-show" v-if="!isShow">加载中...</p>
			<div v-if="isShow">
				<header class="detail-head">
					<h2>{{consult.newsTitle}}</h2>
					<div class="info-wrapper">
						<p class="info">
							<span class="createdate">{{timeFormate(consult.createrDate)}}</span>
							<span class="origin fr">资讯来源：<i>{{consult.organization}}</i></span>
						</p>
					</div>
				</header>
				<section class="content">
					<div v-for="item in consult.contentSequence">
						<p v-if="item.type==='text'">
							{{item.text}}
						</p>
						<img v-else-if="item.type==='image'" :src="$global().imgHost + item.src"/>
					</div>
					
				</section>
			</div>

		</div>
	</div>
</template>
<script type="text/javascript">
	import commonHeader from '../components/commonHeader.vue';
	export default {
		data() {
			return {
				consult:{},
				isShow: false
			}
		},
		components: {
			"v-common-header": commonHeader
		},
		mounted() {
			this.getData('/KMS-MSERVER/learnhome/view/news?newsId='+this.$route.params.ID,'consult','GET',{},function(parm){
				parm.isShow = true;
			});
		},
		methods: {
			timeFormate(time) {
				if(!time){
					return;
				}
				var that_time = new Date(time);
				var yy = that_time.getFullYear();      //年
				var mm = that_time.getMonth() + 1;     //月
				var dd = that_time.getDate();          //日
				var hh = that_time.getHours();         //时
				var ii = that_time.getMinutes();       //分
				var ss = that_time.getSeconds();       //秒
				var clock = yy + "-";
				if(mm < 10) clock += "0";
				clock += mm + "-";
				if(dd < 10) clock += "0";
				clock += dd + " ";
				if(hh < 10) clock += "0";
				clock += hh + ":";
				if (ii < 10) clock += '0'; 
				clock += ii + ":";
				if (ss < 10) clock += '0'; 
				clock += ss;  
				return clock;
			}
		}
	}
</script>
<style lang="less">
	.consult-detail-container{
		background-color:#fff;
		.detail-head{
			h2{
				width: 95%;
				margin:0 auto;
				font-size : 0.386rem;
				line-height: 1.5em;
				padding: 0.2rem 0;
			}
			.info-wrapper{
				background-color: #eee;
				.info{
					overflow: hidden;
					width :95%;
					margin :0 auto;
					span{
						font-size :0.34rem;
						line-height: 2em;
					}
					.origin{
						max-width: 54%;
						white-space: nowrap;
						overflow: hidden;
						text-overflow :ellipsis;
					}
				}
			}
			
		}
		.content{
			width: 95%;
			margin :0 auto;
			margin-top :16px;
			line-height: 0.55rem;
			p,img{
				display: block;
				margin :8px 0;
			}
			img{
				width: 100%;
			}
		}
	}
</style>
