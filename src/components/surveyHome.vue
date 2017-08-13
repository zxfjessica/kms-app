<template>
	<div class="survey-container">
		<div class="header">
			<h2>{{title}}</h2>
			<p>共{{itemsNumber}}题</p>
		</div>
		<div class="description">
			<div class="description-ctn">
				<h4>调研说明：</h4>
				<p>{{describeContent}}</p>
			</div>
		</div>
		<a class="start-btn" @click="close">开始</a>
		
	</div>
</template>
<script type="text/javascript">
	export default{
		name: 'surveyHome',
		props: [
			'itemsNumber',
			'surveyID',
			'closeSurveyHome',
			'describeContent',
			'title'
		],
		data(){
			return {
				
			}
		},
		methods: {
			close(){
				this.$emit('closeSurveyHome');
			}
		}
	}
</script>
<style lang="less">
	.survey-container{
	    font-size: 12px;
	    position: absolute;
	    height: 100%;
	    width: 100%;
	    top: 0;
	    background-color: #f2f2f2;
	    z-index: 1000;
		.header{
			text-align: center;
			padding:0.43rem 0;
			background-color: #fff; 
			h2{
				font-size: 0.48rem;
				line-height: 1.5em;
			}
			p{
				font-size: 0.38rem;
				line-height: 1.5em;
				color:#939393;
			}
			border-bottom: 1px solid #f4f4f4;
		}
		.description{
			background-color: #fff; 
			padding: 0.48rem 0.32rem;
			margin-bottom: 50px;
			h4,p{
				line-height: 2em;
			}
			h4{
				font-size: 0.38rem;
			}
			p{
				font-size: 0.32rem;
				color: #939393;
				word-wrap: break-word;
			}
		}
		.start-btn{
			display: block;
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 50px;
    		line-height: 50px;
			text-align: center;
			font-size: 0.435rem;
			color:#fff;
			background-color: #ff4141; 
		}
	}
</style>
