<template>
	<div class="list-item-container">
		<a :href="'#/teacherHome/'+content.lecturerCode">
			<div class="item-portrait">
				<img :src="$global().imgHost+content.headPath" alt="">
				<!-- <span class="level-icon"></span> -->
			</div>
			<div class="info">
				<div class="title-wrapper">
					<div class="score" :data-star="content.commentStar">
						<v-star :score="content.commentStar.toFixed(1)" :totalStar="5" :showScore="true"></v-star>
					</div>
					<h5 class="title">{{content.lecturerName}}</h5>
				</div>
				<div class="level">{{content.lecturerLevelName}}</div>
				<div class="skill">
					<span class="tag-title">擅长领域：</span>
					<div class="tag-wrapper" 
						ref="tagWrapper">
						<p class="span-wrapper" ref="spanWrapper">
							<span v-for="(item,$index) in innerLecturerTag"
								:class="{'spill-out': lastShowItem==$index}"
								v-if="$index<3">
								<i>{{item.substring(0,4)}}<b v-if="item.length>4">...</b></i>
							</span>
						</p>
					</div>
				</div>
			</div>
		</a>
		
	</div>
</template>
<script type="text/javascript">
	import Star from "./Star.vue";
	/*讲师列表项组件*/
	export default{
		props: {
			content: {
				type: Object,
				default: {
					lecturerName: '讲师姓名',
					headPath:'',
					lecturerLevelName: '讲师级别名称',
					lecturerTag: '沟通与培训，沟通',
					commentStar: 4.5
				}
			}
		},
		data() {
			return {
				lastShowItem: -1
			}
		},
		computed: {
			innerLecturerTag() {
				return this.content.lecturerTag.split(',');
			}
		},
		mounted() {
			this.addDot();
		},
		watch: {
			content() {
				this.addDot();
			}
		},
		methods: {
			addDot() {
				if(Math.round( this.$refs.spanWrapper.clientHeight / this.$refs.tagWrapper.clientHeight ) > 1 ){
					var children = this.$refs.spanWrapper.children,
						tempContent = 0;
					for(var i = 0;i < children.length; i++){
						tempContent += children[i].offsetWidth;
						if(tempContent >= this.$refs.spanWrapper.clientWidth){
							this.lastShowItem = i-1;
						}
					}
				}
			}
		},
		components: {
			"v-star": Star
		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	.teacher-list-container {
		.list-item-container {
			font-size: 0;
			position: absolute;
			top: 50%;
			.transform-translateY (-50%);
			.item-portrait,.info,.score{
				display: inline-block;
			}
			.item-portrait {
				// width: 2.4rem;
				// height: 2.4rem;
				width: 1.86rem;
				height: 1.86rem;
				//height: calc(~"70px / 1rem");
				vertical-align: top;
				margin-right: 0.4rem;
				position: relative;
				border-radius: 50%;
				img{
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
				.level-icon{
					position: absolute;
					display: block;
					width: 18px;
					height: 20px;
					background: url('../../../static/img/shunfeng_signs3.png') no-repeat;
					background-size: 83px;
					background-position: 0px -39px;
					bottom: 0;
					right: 0;
				}
			}
			.title-wrapper{
				overflow: hidden;
				font-size: 0.4rem;
			}
			.info{
				font-size: 0.4rem;
				width: calc(~"100vw - 3.1rem");
				height: 100%;
				.score {
					display: block;
				}
				.title {
					font-size: 1em;
					margin-top: 0.1rem;
				}
				.score{
					float: right;
					margin-top: 0.1rem;
					@media screen and (min-width:375px) {
						.star-wrapper{
							.star{
								width: 18px;
								height: 18px;
							}
							.score-num{
								line-height: 18px;
								font-size: 12px;
							}
						}
					}	
				}
				.level {
					font-size: 0.84em;
					line-height: 2em;
					color: #666;
				}
				.skill {
					font-size: 0.34rem;
					overflow: hidden;
					margin-top: -4px;
					.tag-title{
						float: left;
						display: block;
						font-size: 0.33rem;
						line-height: 0.33rem;
						border: 1px solid transparent;
						padding: 0.06rem;
						padding-left: 0;
						margin-top: 4px;
						color: #666;
					}
					.tag-wrapper{
						float: left;
						overflow: hidden;
						width: 4.8rem;
						max-height: calc(~"0.68rem + 20px");
						.span-wrapper{
							//padding-right: 0.34rem;
							overflow: hidden;
						}
						span{
							//position: relative;
							float: left;
							&.spill-out{
								// 超出样式
								// &:after{
								// 	content: "...";
								// 	position: absolute;
								// 	bottom: 0.1rem;
								// 	right: -0.34rem;
								// 	font-size: 0.34rem;
								// 	line-height: 0.34rem;
								// }
							}
						}
						i{
							display: block;
							font-size: 0.33rem;
							line-height: 0.33rem;
							color: #999;
							border: 1px solid #999;
							border-radius: 2px;
							padding: 0.06rem;
							margin-right: 4px;
							margin-top: 4px;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							max-width: calc(~"1.7rem + 4px");
						}
					}
				}
			}
		}
	}
</style>