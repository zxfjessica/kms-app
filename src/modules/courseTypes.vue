<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container courseTypes clearfix">
			<p class="is-ready-to-show" v-if="!isShow">加载中...</p>
			<div class="container-left fl" v-if="isShow">
				<ul class="tags">
					<li class="tag" v-bind:class="{active : index == showIndex}" v-for="(tag, index) in tags" v-on:click="changeIndex(index)">{{tag.categoryName}}</li>
				</ul>
			</div>
			<div class="container-right fl" v-if="isShow">
				<ul class="courses">
					<li class="course" v-for="(course, index) in courses">
						<h3><i :style="'background-color: #' + color[index % 3]"></i><a :href="'#/CourseList/' + course.id">{{course.categoryName}}</a></h3>
						<ul class="course-catologs clearfix">
							<li class="course-catolog fl" v-for="list in course.sonList">
								<a :href="'#/CourseList/' + list.id"><div>{{list.categoryName}}</div></a>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	import commonHeader from '../components/commonHeader.vue';
	export default{
		data(){
			return {
				tags: [],
				showIndex: 0,
				courses: [],
				color: ['33cc33', 'f5cb37', 'f15e4c'],
				isShow: false
			}
		},
		components: {
			"v-common-header": commonHeader
		},
		mounted(){
			this.$http({
				method: "GET",
				url: this.$global().host + "/KMS-MSERVER/learning/courses/coursesAllCate"
			}).then(function(data){
				this.isShow = true;
				this.tags = data.data.data;

			});
		},
		methods: {
			changeIndex: function(index){
				if(this.tags[index].sonList && this.tags[index].sonList.length > 0){
					this.courses = this.tags[index].sonList;

				}else{
					this.courses = [];
				}
				this.showIndex = index;
			}
		},
		watch: {
			tags: function(){
				this.courses = this.tags[0].sonList;
			}
		}
	}

</script>
<style lang="less">
	.courseTypes{
		font-size: 12px;
		.container-left{
			width: 25%;
			.tags{
				.tag{
					text-align: center;
				    font-size: 0.45rem;
				    /*line-height: 3em;*/
				    padding: 14.6% 7%;
    				border-bottom: 1px solid #dedede;
    				width: 86%;
				    overflow: hidden;
				    text-overflow: ellipsis;
				    white-space: nowrap;
				}
				.active{
					background-color: #f8f8f8;
    				border-bottom: 2px solid #ff4141;
				}
			}
		}
		.container-right{
		    width: 67.8%;
		    padding: 0 3.6%;
		    background-color: #f8f8f8;
		    position: relative;
		    right: 0;
		    top: 0;
		    bottom: 0;
		    height: 100%;
			.courses{
				padding-bottom: 5%;
				.course{
					h3{
						position: relative;
						font-size: 0.45rem;
					    padding: 5.3% 0;
					    border-bottom: 1px solid #dedede;
					    padding-left: 5.3%;
					    width: 100%;
					    white-space: nowrap;
					    overflow: hidden;
					    text-overflow: ellipsis;
					}
					i{
					    display: inline-block;
					    height: 0.45rem;
					    width: 2.7%;
					    position: absolute;
					    left: 0;
					    top: 50%;
					    margin-top: -0.25rem;
					}
					.course-catologs{
						.course-catolog{
							width: 47.35%;
						    margin-top: 5.3%;
						    font-size: 0.35rem;
						    /* line-height: 0.4rem; */
						    text-align: center;
						    background-color: #fff;
						    height: 1.2rem;
						    overflow: hidden;
						    a{
						    	display: table;
							    width: 100%;
							    height: 100%;
							    background-color: #fff;
							    div{
							    	display: table-cell;
							    	vertical-align: middle;
							    	color: #666;
							    	padding: 2px 4px 1px;
							    }
						    }
						    
						}
						.course-catolog:nth-child(2n){
							margin-left: 5.3%;
						}
					}
				}
			}
		}
	}
</style>