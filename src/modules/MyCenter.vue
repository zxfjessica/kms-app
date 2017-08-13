<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container mycenter-container center-container center" v-show="loading>=2">
			<div class="scroll-box">
				<div class="my-info">
					<div class="top-wrapper">
						<div class="top">
							<router-link :to="{ path: '/knowledge/channelDetailSuper',  'query': { empNumber: info.empNumber } }">
								<img v-if="info.headPath" :src="$global().imgHost + info.headPath"/>
							</router-link>
							<span class="lecturer-level signs3" 
								  v-if="info.isLecturer == 1 && info.lecturerLevelId != 1 && info.lecturerLevelId != 8"
								  :class="info.lecturerLevelId == 1 ? 'lecturer-level1' :
								  		  info.lecturerLevelId == 2 ? 'lecturer-level2' :
								  		  info.lecturerLevelId == 3 ? 'lecturer-level3' :
								  		  info.lecturerLevelId == 4 ? 'lecturer-level4' :
								  		  info.lecturerLevelId == 5 ? 'lecturer-level5' :
								  		  info.lecturerLevelId == 6 ? 'lecturer-level6' :
								  		  info.lecturerLevelId == 7 ? 'lecturer-level7' : 'lecturer-level8'"></span>
						</div>
					</div>
					<div class="bottom">
						<span class="name">{{info.name}}</span>|
						<span class="tag">{{info.post}}</span>
						
					</div>
				</div>

				<div class="other-info">
					<a class="info-link" href="#/MyCenter/MyCourse"><div class="info-ctn-wrapper"><span class="info-img"><img src="../../static/img/wodekecheng.png"></span><i class="info-title">我的课程</i></div></a>
					<a class="info-link" :href="'#/myClasses?type=1'"><div class="info-ctn-wrapper"><span class="info-img"><img src="../../static/img/wodebanji.png"></span><i class="info-title">我的班级</i></div></a>
					<a class="info-link" :href="'#/myExamList?type=1'"><div class="info-ctn-wrapper"><span class="info-img"><img src="../../static/img/kaoshi.png"></span><i class="info-title">我的考试</i></div></a>
					<a class="info-link" href="#/mySurvey?type=1"><div class="info-ctn-wrapper"><span class="info-img"><img src="../../static/img/wodediaoyan.png"></span><i class="info-title">我的调研</i></div></a><!-- #/mySurvey/1 敬请期待-->
					<a class="info-link" :href="'#/MyCenter/myProject'"><div class="info-ctn-wrapper"><span class="info-img"><img src="../../static/img/project_manage.png"></span><i class="info-title">项目管理</i></div></a>
					<a class="info-link" :href="'#/knowledge/myConsult'"><div class="info-ctn-wrapper"><span class="info-img"><img src="../../static/img/my_consult.png"></span><i class="info-title">我的请教</i></div></a>
					<a class="info-link" :href="'#/knowledge/myPrecipitate'"><div class="info-ctn-wrapper"><span class="info-img"><img src="../../static/img/my_precipitate.png"></span><i class="info-title">我的沉淀</i></div></a>
					<a class="info-link" :href="'#/knowledge/myChannel'" v-if="myChannelNum"><div class="info-ctn-wrapper"><span class="info-img"><img src="../../static/img/my_channel.png"></span><i class="info-title">我的频道</i></div></a>
					<!-- <a class="info-link" :href="'#/teacherHome/' + info.empNumber" v-if="info.isLecturer == 1">
						<div class="info-ctn-wrapper"><span class="info-img"><img src="../../static/img/lecturer.png"></span><i class="info-title">我是讲师</i></div>
					</a> -->
				</div>
				<div class="my-collection">
					<a class="info-link" :href="'#/teacherHome/' + info.empNumber" v-if="info.isLecturer == 1">
						<i class="signs-lecturer"></i>
						<span>我是讲师</span>
						<b class="icon-right"></b>
					</a>
					<!-- <a class="info-link" href="javascript:void(0)">
						<i class="sign-integral"></i>
						<span>积分兑换</span>
						<b class="icon-right"></b>
					</a> -->
					<a class="info-link" href="#/MyCenter/MyCollect">
						<i class="signs-collect"></i>
						<span>我的收藏</span>
						<b class="icon-right"></b>
					</a>
				</div>
			</div>
			
			<v-common-footer :active="3"></v-common-footer>
		</div>
	</div>
</template>
<script type="text/javascript">
	import commonHeader from '../components/commonHeader.vue';
	import commonFooter from '../components/commonFooter.vue';
	export default {
		data() {
			return {
				info:{},
				myChannelNum: 0,
				loading: 0
			}
		},
		components: {
			"v-common-header": commonHeader,
			"v-common-footer": commonFooter
		},
		mounted() {
			this.getData('/KMS-MSERVER/learning/person/main','info','GET', {}, parm => {
				parm.loading++;
				parm.getData('/KMS-MSERVER/mobileChannel/search/channelManagerList?empNumber=' + parm.info.empNumber, 'myChannelNum', 'GET', {}, tempParm => {
					tempParm.myChannelNum = tempParm.myChannelNum.length;
					parm.loading++;
				});
			});
		}
	}
</script>
<style lang="less">
	@import "../css/customFn.less";
	.mycenter-container{
		.scroll-box{
			height: calc(~"100% - 47px");
			overflow-y: scroll;
		}
		&.center{
			background: #f2f2f2;
			.my-info{
				background:url("../../static/img/center_bg.jpg") no-repeat left top;
				background-size: 100% 100%;
				font-size: 0;
				width:100%;
				height: 3rem;
				padding: .6rem 0 0.8rem 0;
				position: relative;
				
				.top-wrapper{
					.top{
						margin-bottom: 0.2rem;
					    position: relative;
					    width: 2rem;
					    height: 2rem;
					    margin: 0 auto;
					    border: 0.2rem solid rgba(255, 255, 255, 0.2);
						.border-radius (50%);
						img{
							width: 100%;
    						height: 100%;
							.border-radius (50%);
						}
						.lecturer-level{
							position: absolute;
						    bottom: 0.5rem;
						    right: 0rem;
						}
					}
				}
				.bottom{
					padding:0.2rem 0;
					line-height: 2em;
					color:#fff;
					font-size:0.36rem;
					text-align:center;
					span{
						display: inline-block;
						
						margin:0 0.3rem;
					}
				}
			}
			.other-info{
				font-size:0;
				padding: 0 0.5rem 0.5rem;
				background:#fff;
				.info-link{
					display: inline-block;
					width:calc(100%/4);
					
					background:#fff;
					margin-top: 0.5rem;
					.info-ctn-wrapper{
						width:100%;
						margin:0 auto;
						.info-img{
							width: 60%;
							display: block;
							margin: 0 auto;
							margin-bottom:0.2rem;
							img{
								display: block;
								width:100%;
								height:100%;	
							}
						}
						.info-title{
							display: block;
							font-size:0.36rem;
							text-align: center;

						}
					}
				}
			}
			.my-collection{
				padding:0.05rem 0;
				margin-top:0.4rem;
				margin-bottom:0.4rem;
				.info-link{
					display: block;
					font-size: 0;
					position: relative;
					border-bottom: 1px solid #eee;
					background-color: #fff;
					i {
						display: block;
						width: 0.6rem;
						height: 0.56rem;
						margin-left: 13px;
						position: absolute;
						top: 50%;
						left: 0;
						transform: translateY(-50%);
						&.signs-collect{
							background: url('../../static/img/shunfeng_signs.png') no-repeat;
							background-size: 140%;
							.bgPosition(@signsWidth, @signsHeight, 43, 37, 0, 1397);
						}
						&.signs-lecturer {
							background: url('../../static/img/lecturer_small.png') no-repeat;
							background-size: 100%;
							.bgPosition(@signsWidth, @signsHeight, 41, 37, 0, 0);
						}	
						&.sign-integral {
							background: url('../../static/img/integral_small.png') no-repeat;
							background-size: 94%;
							.bgPosition(@signsWidth, @signsHeight, 43, 42, 0, 0);
						}
					}
					
					span{
						font-size:0.36rem;
						height: 1rem;
						line-height: 1rem;
						margin-left: 41px;
						// margin-left: 13px;
					}
					.icon-right{
						display: block;
						position: absolute;
						top:50%;
						right:13px;
						.transform-translateY (-50%);
						width:0.18rem;
						height: 0.43rem;
						background: url("../../static/img/shunfeng_signs.png") no-repeat ;
						background-position:0 7.84939374601149% ;
						background-size: 0.6rem;
					}
				}
			}
		}
		.tag-list{
			li.active{
				a{
					color: #ff4141;
				}
			}
		}
		/*.center-footer{
			line-height: 50px;
		    text-align: center;
		    position: absolute;
		    bottom: 0;
		    border-top: 1px solid #dedede;
		    font-size: 1.2em;
			width: 100%;
			background-color: #fff;
		    .tag-list {
		    	li{
				    height: 50px;
				    line-height: 50px;
				    text-align: center;
					float: left;
					width: 49.5%;
					&.active{
						a{
							color: #ff4141;
						}
					}
					a{
						font-size: 0.38rem;
						vertical-align: sub;
						display: block;
					    width: 100%;
					    height: 100%;
						img{
							height: 1.5em;
						    position: relative;
						    top: 3px;
						    right: 8px;
						}
					}
				}
				li:nth-child(2n){
					border-left: 1px solid #ddd;
				}
		    }*/
			/*ul{
				li{
					width: 49.5%;
					img{
						height: 1.5em;
					    position: relative;
					    top: 4px;
					    right: 8px;
					}
				}
				li:last-child{
					border-left: 1px solid #dedede;
				}
			}
		}*/
	}
</style>