<template>
	<div>
		<a :href="'#/myClassesDetail/' + list.id">
			<div class="box-top">
				<div class="class-pic">
					<img :src="$global().imgHost + list.classImage">
				</div>
				<div class="class-info">
					<h3><a :href="'#/myClassesDetail/' + list.id">{{list.className}}</a></h3>
					<p>班主任：{{list.classManagerName}}</p>
					<p class="from">来自：{{list.projectName}}</p>
				</div>
				<div class="class-type">
					<img class="retest" v-if="list.result == 1 && type == 1" src="../../static/img/buhege.png">
					<img class="retest" v-if="list.result == 2 && type == 1" src="../../static/img/hege.png">
				</div>
			</div>
		</a>
		
		<div class="register-class clearfix"  v-if="list.isCouldComment == 1 && type == 1 || list.isDeleteApply == 1 && type == 0"><!-- -->
			<span class="Start-time fl" v-if="!justShowUnfinish">开班时间: <i>{{list.classStartTimeStr.slice(0,10)}}</i></span>
			<span class="close" 
				  v-if="type == 0 && list.isDeleteApply == 1" 
				  :class="{cannotCancle: list.isDeleteApply == 1 && type == 0}" 
				  @click="closeClass(list.id)">取消报名</span> <!-- -->
			<span class="express"  
				  v-if="list.isComment == 0 && type == 1"
				  :style="type == 0 ? 'border-color: #ff4141;' : ''">
				  	<a :href="'#/scanToExpressClass/' + list.id"
				  		:style="type == 0 ? 'color: #ff4141;' : ''">评价班级</a><!--  -->
			</span>
			<span class="re-express" 
				  v-if="list.isComment == 1 && type == 1">
				  	<a :href="'#/scanToExpressClass/' + list.id">追加评论</a><!--  -->
			</span><!-- <span class="re-express" >
				  	<a :href="'#/registerAttendance/' + list.id + '?scan=true'">签到</a>
			</span> -->
			
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		name: 'myClassItem',
		props: [
			'justShowUnfinish',
			'type',
			'list'
		],
		data(){
			return {

			}
		},
		methods: {
			closeClass: function(courseId){//取消报名
				var classUrl = this.$global().host+'/KMS-MSERVER/learning/project/applyClass/'+ courseId + "?doType=1";
				this.$http.get(classUrl).then(function(data) {
					Toast({message: data.data.data.result, duration: 1000});
					this.getData();
				});
			}
		}
	}
</script>
<style lang="less">
	.my-classes{
		.class-lists{
			.class-list{
				position: relative;
				padding: 5% 3% 0.1%;
				margin-bottom: 12px;
				background-color: #fff;
				.box-top{
					margin-bottom: 5%;
					font-size: 0;
					position: relative;
					.class-pic{
						display: inline-block;
						width: 36%;
						margin-right: 4%;
						height: 2rem;
						overflow: hidden;
						img{
							width: 100%;
							height: 100%;
						}
					}
					
					.class-info{
						display: inline-block;
						vertical-align: top;
						width: 58%;
						font-size: 0.38rem;
						h3{
							font-size: 0.4rem;
						    margin-bottom: 0.4rem;
						    text-overflow: ellipsis;
						    overflow: hidden;
						    white-space: nowrap;

						}
						p{
						    font-size: 0.32rem;
						    color: #999;
						    overflow : hidden;
						    text-overflow: ellipsis;
						    white-space: nowrap;
						    margin-bottom: 0.21rem;
						    &.from{
						    	position: absolute;
						    	bottom: 0;
						    	width: 58%;
						    	margin-bottom: 0rem;
						    }
						}
						
					}
					.class-type{
						position: absolute;
					    width: 18%;
					    bottom: 0;
					    text-align: right;
					    right: 0%;
						img{
							width: 100%;
						}
					}
				}
				/*取消报名、评论班级、追评班级*/
				.register-class{
					text-align: right;
					padding: 3% 3% 3% 0;
					font-size: 0.32rem;
					line-height: 0.74rem;
					border-top: 1px solid #dedede;
					.close, .express, .re-express{
						display: inline-block;
						width: 22%;
						text-align: center;
						border-radius: 3px;
					}
					.close{
						border: 1px solid #ff4141;
						color: #ff4141;
					}
					.express, .re-express{
						border: 1px solid #ff4141;
						a{
							color: #ff4141;
							
						}
					}
					.Start-time{
						color: #999999;
						line-height: 0.79rem;
					}
					.cannotCancle{
						color: #ff4141;
					}
				}
			}
		}
	}
</style>