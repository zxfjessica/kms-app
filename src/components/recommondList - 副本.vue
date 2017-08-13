<template>
	<mt-swipe :auto="0" class="recommond-lists">
		<mt-swipe-item>
			<div class="recommond-list" v-if="list1">
				<a :href="list1.contentType === 'project' ? '#/trainCourse/' + list1.contentId : 
					(list1.coursesType ? '#/faceToFaceCourse/' + list1.contentId: 
					'#/onLineCourse/' + list1.contentId)">
					<img :src="$global().imgHost+list1.imagePath">
				<p>{{list1.title}}</p>
				</a>
			</div>
			<div class="recommond-list" v-if="list2">
				<a :href="list2.contentType === 'project' ? '#/trainCourse/' + list2.contentId : 
					(list2.coursesType ? '#/faceToFaceCourse/' + list2.contentId: 
					'#/onLineCourse/' + list2.contentId)">
					<img :src="$global().imgHost+list2.imagePath">
				<p>{{list2.title}}</p>
				</a>
			</div>
		</mt-swipe-item>
		<mt-swipe-item>
			<div class="recommond-list" v-if="list3">
				<a :href="list3.contentType === 'project' ? '#/trainCourse/' + list3.contentId : 
					(list3.coursesType ? '#/faceToFaceCourse/' + list3.contentId: 
					'#/onLineCourse/' + list3.contentId)">
					<img :src="$global().imgHost+list3.imagePath">
				<p>{{list3.title}}</p>
				</a>
			</div>
			<div class="recommond-list" v-if="list4">
				<a :href="list4.contentType === 'project' ? '#/trainCourse/' + list4.contentId : 
					(list4.coursesType ? '#/faceToFaceCourse/' + list4.contentId: 
					'#/onLineCourse/' + list4.contentId)">
					<img :src="$global().imgHost+list4.imagePath">
				<p>{{list4.title}}</p>
				</a>
			</div>
		</mt-swipe-item>
		<mt-swipe-item>
			<div class="recommond-list" v-if="list5">
				<a :href="list5.contentType === 'project' ? '#/trainCourse/' + list5.contentId : 
					(list5.coursesType ? '#/faceToFaceCourse/' + list5.contentId: 
					'#/onLineCourse/' + list5.contentId)">
					<img :src="$global().imgHost+list5.imagePath">
					<p>{{list5.title}}</p>
				</a>
			</div>
			<div class="recommond-list" v-if="list6">
				<a :href="list6.contentType === 'project' ? '#/trainCourse/' + list6.contentId : 
					(list6.coursesType ? '#/faceToFaceCourse/' + list6.contentId: 
					'#/onLineCourse/' + list6.contentId)">
					<img :src="$global().imgHost+list6.imagePath">
				<p>{{list6.title}}</p>
				</a>
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
				list1: {},
				list2: {},
				list3: {},
				list4: {},
				list5: {},
				list6: {}
			}
		},
		mounted(){
			this.list1 = this.recommend[0];
			this.list2 = this.recommend[1];
			this.list3 = this.recommend[2];
			this.list4 = this.recommend[3];
			this.list5 = this.recommend[4];
			this.list6 = this.recommend[5];
		}
	}
</script>
<style lang="less">

</style>