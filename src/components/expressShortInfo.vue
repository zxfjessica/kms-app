<template>
	<div class="express-info">
		<p class="express-top">
			<span class="good-express signs signs_good">好评度{{expressions.commentStar}}</span>
			<i class="check-express fr" @click="showExpressBox">查看全部{{expressions.commentCount}}条评价<b class="icon icon-comment"></b></i>
		</p>
		<ul class="clearfix">
			<li class="fl">
				<h3><span>全部</span></h3>
				<p>{{expressions.commentCount}}</p>
			</li>
			<li class="fl">
				<h3><span class="signs signs_good">好评</span></h3>
				<p>{{expressions.goodComCount}}</p>
			</li>
			<li class="fl">
				<h3><span class="signs signs_middle">中评</span></h3>
				<p>{{expressions.midComCount}}</p>
			</li>
			<li class="fl">
				<h3><span class="signs signs_worse">差评</span></h3>
				<p>{{expressions.lowComCount}}</p>
			</li>
		</ul>
	</div>
</template>
<script type="text/javascript">
	export default{
		name: 'expressShortInfo',
		props: [
			'expressions'
		],
		data(){
			return {}
		},
		methods: {
			showExpressBox(){
				this.$emit('showExpressions');
			}
		}
	}
</script>
<style lang="less"></style>