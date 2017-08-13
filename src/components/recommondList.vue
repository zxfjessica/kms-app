<template>
	<mt-swipe :auto="0" class="recommond-lists">
		<mt-swipe-item v-for="item in list">
			<div class="recommond-list" v-for="itemlist in item" v-if="itemlist">
				<a :href="itemlist.contentType === 'project' ? '#/trainCourse/' + itemlist.contentId : 
					(itemlist.coursesType ? '#/faceToFaceCourse/' + itemlist.contentId: 
					'#/onLineCourse/' + itemlist.contentId)"
					class="img-wrapper">
					<img :src="$global().imgHost+itemlist.imagePath">
					<span class="file-type" 
							:class="fileType[itemlist.fileType]"
							v-if="itemlist.contentType === 'course' && !itemlist.coursesType">
					</span>
				</a>
				<p>{{itemlist.title}}</p>
			</div>
		</mt-swipe-item>
	</mt-swipe>
</template>
<script type="text/javascript">
	export default{
		name: 'recommondList',
		props: [
			"recommend",
			"number"
		],
		data(){
			return{
				list: [],
				fileType: ['video', 'file', 'pic', 'scorm']
			}
		},
		mounted(){
			this.list = [[this.recommend[0], this.recommend[1]],
							[this.recommend[2], this.recommend[3]],
							[this.recommend[4], this.recommend[5]]];
		}
	}
</script>
<style lang="less">
	@import "../css/customFn.less";
	.recommond-lists {
		.img-wrapper {
			display: block;
			position: relative;
		}
		.file-type {
			width: 0.797rem;
			height: 0.44rem;
			position: absolute;
			right: 0;
			bottom: 0;
			background: url('../../static/img/shunfeng_signs3.png') no-repeat;
			background-size: 268%;
			&.video {
				background: url('../../static/img/shunfeng_signs.png') no-repeat;
				background-size: 100%;
				.bgPosition(@signsWidth, @signsHeight, 60, 35, 0, 315);
			}
			&.file {
				.bgPosition(@signs3Width, @signs3Height, 60, 35, 0, 937);
			}
			&.pic {
				.bgPosition(@signs3Width, @signs3Height, 60, 35, 0, 1042);
			}
			&.scorm {
				.bgPosition(@signs3Width, @signs3Height, 60, 35, 0, 1087); 
			}
		}
	}
</style>