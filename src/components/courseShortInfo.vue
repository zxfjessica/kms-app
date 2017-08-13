<template>
	<div class="course-shortInfo">
		<h1 class="course-name">
			<span class="course-name">{{classInfo.coursesName}}</span>
			<span class="course-info" @click="showInfoBox"><i>简介</i><b class="icon icon-info"></b></span>
		</h1>
		<p class="course-detail">
			<span class="course-finish">{{classInfo.learningCount}}人已学</span> |
			<!-- <span class="course-goodFeedback">好评度{{classInfo.commentStar}}</span>-->
			<span class="course-type" v-if="classInfo.coursesType == 0">在线</span>
			<span class="course-type" v-else-if="classInfo.coursesType == 1">面授</span> | 
			<span class="course-goodFeedback">课程时长：{{classInfo.coursesTime}}</span>
		</p>
		<div class="course-people">
			<p class="course-upload">上传者： {{classInfo.createName}}</p>
			<p class="course-author">作者：{{classInfo.coursesDeveloperName}}</p>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		name: 'courseShortInfo',
		props: [
			'classInfo'
		],
		data(){
			return {}
		},
		methods: {
			showInfoBox(){
				this.$emit('showInfomation');
			}
		}
	}
</script>
<style lang="less"></style>