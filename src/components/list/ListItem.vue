<template>
	<div class="list-item-container">
		<div class="item-wrapper">
			<div class="item-ctn" :class="{'pro-manage':projectManageByP}">
				<a :href="coursesLink">

					<div class="co-left">
						<a :href="coursesLink"><img :src="$global().imgHost+(item.image||item.coursesImage)" /></a>
						
						<span v-if="kindByP=='course'" class="mark" :class="{'office':Number(item.isOfficial),'origin':Number(item.isOriginal)}"><!-- <i v-if="item.isOfficial==1">官方</i><i v-if="item.isOriginal==1">原创</i> --></span>
						<span class="file-type" :class="item.fileType == 0 ? 'video' : 
														item.fileType == 1 ? 'file' :
														item.fileType == 2 ? 'picture': 
														item.fileType == 3 ? 'scorm' : ''" v-if="kindByP=='course'&&!item.coursesType"></span>
					</div>
					<div class="co-right">
						<h3 class="co-title"><a :href="coursesLink">{{item.name||item.coursesName}}</a></h3>
						<div class="kind">
							{{kindByP=='project'?item.organization:item.coursesType?"面授":"在线"}}
						</div>
						
						<div class="co-other" :class="courseKindByP=='learning'?'bottom-adjust':''">
							<span v-if="kindByP=='project'">{{item.learningCount}}人参与</span>
							<span v-else-if="kindByP=='course'">{{(typeof item.learningCount!='undefined')?item.learningCount:item.userCount}}人已学</span>
							<span class="praise">好评度<span>{{item.commentStar}}</span></span>
						</div>
						
					</div>
					<!-- <div v-if="courseKindByP=='completed'">
						<span class="comment-btn" 
							:class="{'face':item.coursesType}" 
							v-if="item.coursesType == 1">
							<a :href="'#/scanToExpressCourse/' + item.id">"追加评价"</a></span>
						<span class="comment-btn" 
							:class="{'face':item.coursesType}" 
							v-if="item.coursesType == 0 && item.isComment == 1">
							<a :href="'#/scanToExpressCourse/' + item.id">"追加评价"</a></span>
						<span class="comment-btn" 
							:class="{'face':item.coursesType}" 
							v-if="item.coursesType == 0 && item.isComment == 0">
							<a :href="'#/scanToExpressCourse/' + item.id">"评价课程"</a></span>
					</div> -->
				</a>
			</div>
			<div class="manage-btn-wrapper" v-if="projectManageByP">
				<span class="manage-btn">
					<a :href="'#/MyProjectManage/'+item.id">管理</a></span>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	/*项目列表项组件*/
	export default{
		props: {
			item: Object,
			kindByP: String,
			courseKindByP:{
				type:String,
				default:''
			},
			projectKindByP:{
				type:String,
				default:''
			},
			projectManageByP:{
				type: Boolean,
				default: false
			}
		},
		computed: {
			coursesLink() {
				if(this.kindByP=='project'){
					return "#/trainCourse/"+this.item.id;
				}
			
				return this.item.coursesType?"#/faceToFaceCourse/"+this.item.id:"#/onLineCourse/"+this.item.id;
			}
		}
	}
</script>
<style lang="less">
	@J-ITEMORDER:#999;
	@import '../../css/customFn.less';
	.list-item-container{
		.co-left{
			display: inline-block;
			vertical-align:top;
			width:36.2%;
			height: 2.08rem;
			position:relative;
			//overflow:hidden;
			a{
				display: block;
				width: 100%;
				height: 100%;
			}
			img{
				display: block;
				width:100%;
				height:100%;
			}
			
			.mark{
				display: block;
				position: absolute;
				left:0;
				top: 0;
				width: 34px;
				height: 34px;
				color: #fff;
				&.office{
					background: url('../../../static/img/shunfeng_signs.png') no-repeat;
					background-size: 30.5px;
					background-position: 0 -84px;
				}
				&.origin{
					background: url('../../../static/img/shunfeng_signs.png') no-repeat;
					background-size: 30.5px;
					background-position: 0 -121px;
				}
			}
			.file-type{
				width:0.797rem;
				height:0.44rem;
				position:absolute;
				right:0;
				bottom:0;
				background:url('../../../static/img/shunfeng_signs.png') no-repeat;
				background-size: 100%;
				&.video{
					background-position: 11% 20.64%;
				}
				&.file{
					background:url('../../../static/img/shunfeng_signs3.png') no-repeat;
					background-size: 262%;
					.bgPosition(@signs3Width, @signs3Height, 60, 35, 0, 938);
				}

				&.picture{
					background:url('../../../static/img/shunfeng_signs3.png') no-repeat;
					background-size: 262%;
					.bgPosition(@signs3Width, @signs3Height, 60, 35, 0, 1041);
				}
				&.scorm{
					background:url('../../../static/img/shunfeng_signs3.png') no-repeat;
					background-size: 262%;
					.bgPosition(@signs3Width, @signs3Height, 60, 35, 0, 1088);
				}
			}
		}
		
		.co-right{
			height:100%;
			width:60%;
			font-size: 0.43rem;
			margin-left:0.35rem;
			display: inline-block;
			


		}
		.item-wrapper{
			//border-bottom: 1px solid #eee;
			.mint-button--default{
				&.face {
					background-color: transparent;
					color: #ff4141;
					box-shadow: 0 0 1px #ff4141;
				}
			}
			.item-ctn{
				&.pro-manage{
					border-bottom: 1px solid #eee;
				}
			}
			.manage-btn-wrapper{
				height: 1.17rem;
				.manage-btn{
					float: right;
					display: block;
					font-size: 0.37rem;
					width: 14%;
					border: 1px solid #ff4141;
					text-align: center;
					border-radius: 3px;
					margin-top: 0.26rem;
					padding: 3px 0;
					a{
						display: block;
						color: #ff4141;
						font-size: 0.37rem;
					}
				}
			}
		}
		
		.comment-btn{
			font-size:0.35rem;
			display: block;
			width:20%;
			height:2em;
			line-height: 2em;
			text-align: center;
			position:absolute;
			right:0.32rem;
			margin:0;
			padding:0 6px;
			border: 1px solid #ff4141;
    		a{
    			color: #ff4141;
    		}
		}
		.co-title{
		    width: 100%;
		    font-size: 1em;
		    line-height: 1.27em;
		    height: 2.54em;
		    overflow: hidden;
		    color: #333;
		    a{
		    	font-size: 0.4rem;
		    }
		}
		.kind{
			font-size:0.32rem;
			color:@J-ITEMORDER;
			line-height: 1.5em;
		}
		.co-other{
		    width: 60%;
		    overflow: hidden;
		    color: #999;
		    font-size: 0.32rem;
		    line-height: 1em;
		    margin-top: 3%;
		    position: absolute;
			/*&.bottom-adjust{
				bottom:1.14rem;
			}
			.al-study,.praise{
				display: inline-block;
				font-size:0.32rem;
				span{
					display: inline-block;
					vertical-align: middle;
					margin-right:0.28em
				}
			}
			.al-study,.praise{
				position: absolute;
				width: 40%;
				overflow: hidden;
				
			}
			.join,.praise{
				display: inline-block;
				font-size:0.32rem;
				span{
					display: inline-block;
					vertical-align: middle;
					margin-right:0.28em
				}
			}
			
			.join,.praise{
				width: 40%;
				overflow: hidden;
				
			}*/
			.praise{
				float: right;
			}
			
		}
		
		.progress{
			font-size:0.32rem;
			position:absolute;
			width:100%;
			margin-bottom: 6px;
			.progress-wrapper{
				width:36%;
				height:30px;
				vertical-align: middle;
			}
			.progress-text{
				margin-left:0.35rem;
			}
			.progress-wrapper,.progress-text{
				display: inline-block;
			}
		}
	}
</style>