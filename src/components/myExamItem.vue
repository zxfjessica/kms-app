<template>
	<div>
		<a class="kaishikaoshi" :href="'#/kaoshi-datiye/' + exam.id + '?type=0'" v-if="exam.resultStatus == 2 && isAttend == 0"></a>
		<div class="main-content">
			<h3>{{exam.examName}}</h3>
			<p>时间：{{exam.startTimeStr}}~{{exam.endTimeStr}}</p>
			<p class="exam-result" v-if="isAttend == 0">考试时长：{{exam.longTime}}分钟</p>
			<p class="exam-result" v-if="isAttend == 1">
				考试结果：
				<span v-if="exam.examResult == 0 || exam.examResult == 1">{{exam.empScore}}分</span>
				<span v-else-if="exam.examResult == 2 || exam.examResult == 3" :style="'color: #666666;'">{{exam.empScore}}分</span>
				<span v-else-if="exam.examResult == 4" :style="'color: #f5cb37;'">未阅卷</span>
			</p>
			<div class="type exam-type" v-if="exam.resultStatus != 2 && isAttend == 0 || exam.examResult != 4 && isAttend == 1">
				<img class="outTime" v-if="exam.resultStatus == 1 && isAttend == 0" src="../../static/img/outoftime.png">
				<img class="noStart" v-if="exam.resultStatus == 0 && isAttend == 0" src="../../static/img/not_start.png">
				<img class="retest" v-if="(exam.examResult == 2 || exam.examResult == 3) && isAttend == 1" src="../../static/img/buhege.png">
				<img class="retest" v-if="(exam.examResult == 0 || exam.examResult == 1) && isAttend == 1" src="../../static/img/hege.png">
			</div>
		</div>
		<div class="is-retest" v-if="(exam.examResult == 2 || exam.examResult == 0) && isAttend == 1"><!--  -->
			<a :href="'#/kaoshi-datiye/' + exam.id + '?type=0'" v-if="exam.examResult == 2"><span class="chongkao"> 重考</span></a><!--  -->
			<a :href="'#/kaoshi-datiye/' + exam.id + '?type=1'" v-if="exam.examResult == 0"><span class="chakan">查看</span></a><!--  -->
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		name: 'myExamItem',
		props: [
			'exam',
			'isAttend'
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
	.my-exam-list, .my-survey-list{
		section{
			.lists{
				.list{
					position: relative;
					padding: 3.6%;
					margin-bottom: 12px;
					background-color: #fff;
					a.kaishikaoshi{
						position: absolute;
					    z-index: 1;
					    width: 92%;
					    height: 100%;
					    top: 0;
					}
					.main-content{
						position: relative;
						h3{
							font-size: 0.4rem;
							margin-bottom: 0.25rem;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: nowrap;
						}
						p{
							color: #999;
							margin-bottom: 0.25rem;
							font-size: 0.38rem;
						}
						p.exam-result{
							margin-bottom: 0;
						}
						.type{
							position: absolute;
						    bottom: 0;
						    right: 0;
						    width: 18%;
						    img{
						    	width: 100%;
						    }
						}
					}
					.is-retest{
						border-top: 1px solid #dedede;
					    margin-top: 0.25rem;
					    padding-top: 3.6%;
					    text-align: right;
					    span{
					    	display: inline-block;
						    width: 22%;
						    text-align: center;
						    line-height: 0.74rem;
						    border-radius: 3px;
						    border: 1px solid #ff4141;
						    color: #ff4141;
					    }
					}
				}
			}
		}
	}
</style>