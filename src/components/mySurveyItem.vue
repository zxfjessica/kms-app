<template>
	<div>
		<a class="kaishikaoshi" :href="'#/diaoyan/' + survey.id" v-if="survey.resultStatus == 2 && type == 0"></a><!--  -->
		<div class="main-content">
			<h3>{{survey.title}}</h3>
			<p>时间：{{survey.publishStartDateStr}}~{{survey.publishEndDateStr}}</p>

			<div class="type survey-type">
				<img v-if="survey.resultStatus == 1"  class="outTime" src="../../static/img/outoftime.png">
				<img v-if="survey.resultStatus == 0" class="noStart" src="../../static/img/not_start.png">
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		name: 'mySurveyItem',
		props: [
			'survey',
			'type'
		],
		data(){
			return {

			}
		},
		methods: {
			
		}
	}
</script>
<style lang="less">
	.my-survey-list{
		section{
			.survey-lists{
				.survey-list{
					.main-content{
						p{
							margin-bottom: 0em;
						}
					}
				}
			}
		}
	}
</style>