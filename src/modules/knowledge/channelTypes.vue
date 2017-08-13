<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container courseTypes clearfix knowledge knowledge-channel-types">
			<p class="is-ready-to-show" v-if="!isShow">加载中...</p>
			<div class="container-left fl" v-if="isShow">
				<ul class="tags">
					<li class="tag" v-bind:class="{active : index == showIndex, 'focus': tag.isFocus}" v-for="(tag, index) in tags" v-on:click="changeIndex(index)">{{tag.categoryName}}</li>
				</ul>
			</div>
			<div class="container-right fl" v-if="isShow">
				<div class="top-img">
					<router-link :to="{ 'path': '/knowledge/channelList', 'query': { id: tags[showIndex].id, coursename: tags[showIndex].categoryName}}">
						<img src="../../../static/img/types_bg.png">
						<span class="name">{{tags[showIndex].categoryName}}</span>
					</router-link>
				</div>
				<ul class="courses">
					<li class="course" v-for="(course, index) in courses">
						<router-link :to="{ 'path': '/knowledge/channelList', 'query': { id: course.id, coursename: course.categoryName } }">
							<h3>
								<span class="secTag"
									:class="{'focus': course.isFocus}">
									{{course.categoryName}}	
								</span>
								<b class="icon icon-info"></b>
							</h3>
						</router-link>
						<ul class="course-catologs clearfix">
							<li class="course-catolog fl" v-for="list in course.sonList">
								<router-link :to="{ 'path': '/knowledge/channelList', 'query': { id: list.id, coursename: list.categoryName } }">
									<div :class="{'focus': list.isFocus}">{{list.categoryName}}</div>
								</router-link>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	import commonHeader from '../../components/commonHeader.vue';
	export default{
		components: {
			'v-common-header': commonHeader
		},
		data(){
			return {
				tags: [],
				showIndex: 0,
				courses: [],
				isShow: false
			}
		},
		mounted(){
			this.$http({
				method: "GET",
				url: this.$global().host + "/KMS-MSERVER/mobileChannel/allCate?type=2"
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
.knowledge-channel-types{
	.focus {
		position: relative;
		&:after {
			content: '';
			position: absolute;
			right: 6%;
			top: 20%;
			display: block;
			width: 4px;
			height: 4px;
			border-radius: 50%;
			background-color: #ff4141;
		}
	}
	.container-left .tags .active{
		background-color: #fff;
		color: #ff4141;
		border-bottom-width: 1px;
	}
	.container-left .tags .tag{
		font-size: 0.373rem;
		padding: 21.6% 8%;
		&.focus {
			&:after {
				right: 8%;
				top: 20%;
			}
		}
	}
	.container-left {
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
	}
	.container-right{
		background-color: #fff;    
		overflow-y: auto;
		.top-img{
			position: relative;
			height: 2.8rem;
		    width: 100%;
		    margin-top: 0.35rem;
		    img{
				height: 100%;
			    width: 100%;
			}
			.name{
				position: absolute;
				top: 50%;
				right: .3rem;
				margin-top: -.3rem;
				font-size: .427rem;
				line-height: .6rem;
				z-index: 10;
				color: #428988;
			}
		}
		
		.courses .course .course-catologs .course-catolog a{
			background-color: #f2f2f2;
			border-radius: 5px;
			background: none;
		}
		.courses .course h3{
			padding-left: 0;
			border: none;
			padding: 0;
			line-height: 1.4rem;
			position: relative;
			font-size: 0.4rem;
			.icon-info{
				position: absolute;
				right: 0;
				top: 0.5rem;
			}
			.secTag {
				&.focus {
					&:after {
						right: -18%;
						top: -20%;
					}
				}
			}
		}
		.courses .course ul.course-catologs{
			border-bottom: 1px solid #eee;
			padding-bottom: 0.3rem;
			.course-catolog{
				margin: 0;
				margin-bottom: 0.2rem;
				height: 1.43rem;
				font-size: 0.375rem;
				line-height: 0.45rem;
				width: calc(~"(100% - 0.4rem) / 3");background-color: #f2f2f2;
				border-radius: 5px;
				a{
					div{
						padding: 0.1rem .1rem .03rem;
					}
				}
				&.course-catolog:nth-child(2n){
					margin: 0;
				}
				&.course-catolog:not(:nth-child(3n-2)){
					margin-left: 0.2rem;
				}
			}
		}
	}
}
</style>