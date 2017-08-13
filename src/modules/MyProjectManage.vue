<template>
	<div>
		<v-common-header></v-common-header>
		<div class="pro-manage-wrapper container">
			<div class="ma-title">
				<h4>{{project.projectName}}</h4>
			</div>
			<section class="ctn">
				<div class="ma-info-title">
					<h5>基础信息</h5>
				</div>
				<div class="base-info">
					<div class="base-info-ctn">
						<p>项目管理员：<span>{{project.projectAdminName}}</span></p>
						<p>项目对象：<span class="project-object">{{project.projectObject}}</span></p>
						<p>开班权限：<span>{{projectClassView}}</span></p>
					</div>
				</div>
				<div class="ma-info-title">
					<h5>班级信息</h5>
				</div>
				<div class="ma-info-wrapper">
					<ul class="info-list">
						<li v-for="(item,$index) in classList" :data-id="item.id">
							<div class="item-wrapper">
								<div class="item-ctn">
									<div class="title-box" ref="titleBox">
										<h5 class="item-ctn-title" ref="titleItem">{{item.className}}</h5>
									</div>
									
									<p class="detail">班主任：<span>{{item.classManagerName}}</span>|<span>{{item.applyUserCount}}</span>人|<span>{{item.status}}</span></p>
								</div>
								<a :href="isManager($index)" class="stu-ma-btn" :class="{'disable':!item.isManager}">学员管理</a>
							</div>
						</li>
					</ul>
				</div>
			</section>
		</div>
	</div>
</template>
<script type="text/javascript">
	import commonHeader from '../components/commonHeader.vue';
	export default{
		data() {
			return {
				project:{
					'projectName': '项目名称',
					'projectAdminName': '项目管理员',
					'projectObject': '项目对象',
					'projectClassView': 0,
					'classList': []
				}
			}
		},
		components: {
			"v-common-header": commonHeader
		},
		computed: {
			classList() {
				return this.project.classList || [];
			},
			projectClassView() {
				var tempView = '仅自己';
				if (this.project.projectClassView === 0) {
					tempView = '所有培训管理员';
				}else if (this.project.projectClassView === 1) {
					tempView = '部分培训管理员';
				}
				return tempView;
			}
		},
		mounted() {
			var url = '/KMS-MSERVER/learning/person/classManager/list?';
			url += 'projectId=' + this.$route.params.ID;
			this.getData(url,'project','GET');
		},
		methods: {
			isManager(index) {
				return this.classList[index].isManager?'#/MyProjectCollege/'+this.classList[index].id:'javascript:void(0)';
			}
		},
		watch:{
			classList(val){
				if(val.length > 0){
					// overLine
					var that = this;
					setTimeout(() =>{
						for(let [index, item] of that.$refs.titleBox.entries()){
							if(that.$refs.titleBox[index].clientHeight < that.$refs.titleItem[index].clientHeight){
								that.$refs.titleItem[index].setAttribute('class', 'overLine');
							}
						}
					}, 50);
					
				}
			}
		}
	}
</script>
<style lang="less">
	@import "../css/customFn.less";
	.pro-manage-wrapper{
		@innerWidth: 92%;
		font-family: "微软雅黑";
		.ma-title{
			height: 1.34rem;
			background-color: #fff;
			h4{
				width: @innerWidth;
				margin: 0 auto;
				font-size: 0.48rem;
				line-height: 1.34rem;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
		.ctn{
			height: calc(~"100vh - 46px - 1.34rem");
			background-color: #fff;
		}
		.ma-info-title{
			height: 0.72rem;
			border-top: 1px solid #eee;
			border-bottom: 1px solid #eee;
			background-color: #f4f4f4;
			h5{
				width: @innerWidth;
				margin: 0 auto;
				font-size: 0.32rem;
				line-height: 0.72rem;
				color: #ababab;
			}
		}
		.base-info{
			background-color: #fff;
			padding: 0.43rem 0;
			.base-info-ctn{
				width: @innerWidth;
				margin: 0 auto;
				color: #ababab;
				font-size: 0.4rem;
				line-height: 0.6rem;
				span{
					color: #333;
				}
				p{
					font-size: 0.42rem;
					overflow: hidden;
					padding: 0.1rem 0;
				}
				.project-object{
					float: right;
					width: 75%;
				}
			}
		}
		.ma-info-wrapper{
			background-color: #fff;
		}
		.info-list{
			li{
				border-bottom: 1px solid #eee;
				height: 2.54rem;
			}
			.item-wrapper{
				position: relative;
				width: @innerWidth;
				height: 100%;
				margin: 0 auto;
				.item-ctn{
					position: relative;
					left: 0;
					top: 1.27rem;
					width: 70%;
					font-size: 0.38rem;
					line-height: 0.56rem;
					overflow: hidden;
					word-break: break-all;
					.transform-translateXY (0,-50%,0);
					.title-box{
						font-size: 0.4rem;
						max-height: 1.12rem;
						min-height: 0.56rem;
						overflow: hidden;
					}
					.overLine{
						position: relative;
					}
					.overLine:after{
						content: '...';
					    display: block;
					    position: absolute;
					    top: 0.56rem;
					    width: 0.58rem;
					    right: 0;
					    background-color: #fff;
					}
					.detail{
						color: #ababab;
						margin-top: 0.16rem;
						span{
							margin: 0 0.1rem;
							&:first-child{
								margin-left: 0;
							}
							&:last-child{
								margin-right: 0;
							}
						}
					}
				}
				.stu-ma-btn{
					display: block;
					width: 2rem;
					font-size: 0.4rem;
					color: #ff4141;
					text-align: center;
					position: absolute;
					right: 0;
					top: 50%;
					border: 1px solid #ff4141;
					border-radius: 3px;
					line-height: .7rem;
					.transform-translateXY (0,-50%,0);
					&.disable{
						border-color: #ddd;
						color: #ddd;
					}
				}
			}
		}
	}
</style>