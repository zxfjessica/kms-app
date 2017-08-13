<template>
	<mt-swipe :auto="4000"
		class="lecturer-mien-wrapper">
		<mt-swipe-item v-for="list in content">
			<div class="lecturer-wrapper clearfix" v-for="(item, $index) in list">
		  		<router-link :to="'/teacherHome/'+item.lecturerCode">
		  			<div class="portrait-wrapper">
		  				<img :src="$global().imgHost+item.headPath" alt="">
		  			</div>
		  			<h4 class="tea-name">{{item.lecturerName}}</h4>
		  			<p class="level">{{item.lecturerLevelName}}</p>
		  			<div class="star-bg"><!--  :class="bgColor[$index]" -->
		  				<div class="star-container">
		  					<v-star :score="item.commentStar.toFixed(1)" :totalStar="5"></v-star>
		  				</div>
		  			</div>
		  		</router-link>
		  	</div>
		</mt-swipe-item>
	</mt-swipe>
</template>
<script>
	import Star from './list/Star.vue';
	export default {
		props: {
			content: {
				type: Array,
				default: [[],[],[]]
			}
		},
		data() {
			return {
				bgColor: ['green', 'red', 'blue']
			}
		},
		components: {
			"v-star": Star
		}
	}
</script>
<style lang="less" scoped>
	.lecturer-mien-wrapper.mint-swipe {
		height: 4.8rem ;
	}
	.lecturer-mien-wrapper.mint-swipe div{
		&.is-active {
			background: #fff;
		}
	}
	.lecturer-wrapper{
		width: 30%;
		margin-left: 2.5%;
		background-color: #f2f2f2;
		float: left;
		padding-top: 0.16rem;
		font-size: 0.4rem;
		p,h4{
			text-align: center;
			line-height: 0.7rem;
		}
		.tea-name {
			font-size: 0.38rem;
			color: #333;
		}
		.level {
			color: #666;
			font-size: 0.32rem;
			line-height: 0.32rem;
			margin-bottom: 0.16rem;
		}
	}
	.portrait-wrapper{
		width: 66%;
		margin: 0 auto;
		img{
			/*width: 100%;*/
			height: 2rem;
			width: 2rem;
			border-radius: 50%;
		}
	}
	.star-bg{
		width: 100%;
		/*background-color: #f7f7f7;
		&.blue{
			background-color: #03acea;
		}
		&.red{
			background-color: #f45c4f;
		}
		&.green{
			background-color: #02d69c;
		}*/
	}
	.star-container{
		width: 80px;
		height: 20px;
		padding-top: 2px;
		margin: 0 auto;
	}
</style>