<template>
	<div class="exam-question-title">
		<div class="xuanze-title">
			<span class="title-index">{{curIndex + 1}}</span>. 
			<span class="title-type">({{curItem.questionType == 1 ? '单选题' : 
										curItem.questionType == 2 ? '多选题' : 
										curItem.questionType == 3 ? '判断题' :
										curItem.questionType == 4 ? '填空题' :'问答题'}})</span>
			<span class="title-content">
				<span class="content-list" v-for="title in curItem.questionTitleList">
					<span class="text-box box" v-if="title.type == 'text'">{{title.text}}</span>
					<span class="img-box box" v-if="title.type == 'image'">
						<img :src="title.src"
							  class="preview-img"
							  @click="$preview.open(title.index, picList)"><!-- -->
					</span>
					<span class="video-box box" v-if="title.type == 'video'">
						<v-video-item :videoPath="title.src"
										@playVideo="$emit('playVideo')"></v-video-item>
					</span>
				</span>
				
			</span>
		</div>
	</div>
</template>
<script>
	import videoItem from './videoItem.vue';
	export default{
		name: 'examQuestionTitle',
		props: {
			index: {},
			item: {}
		},
		data(){
			return{
				picList: []
			}
		},
		computed:{
			curIndex(){
				return this.index;
			},
			curItem(){
				return this.item;
			}
		},
		components: {
			'v-video-item': videoItem
		},
		mounted(){
			/*this.curIndex = this.index;
			this.curItem = this.item;*/
		},
		methods:{},
		watch:{
			curItem(val){
				if(val){
					var imgArr = [];
					var index = 0;
					var targetArr = this.curItem.questionTitleList;
					if(targetArr && targetArr.length > 0){
						for(let i = 0; i < targetArr.length; i++){
								
							if(targetArr[i].type == 'image'){
								targetArr[i].index = index++;
								targetArr[i].src = this.$global().imgHost + targetArr[i].src;
								imgArr.push(targetArr[i]);
							}
						}
					}
					this.picList = imgArr;
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	.exam-question-title{
		font-size: 0.5rem;
		.xuanze-title{
			width: 100%;
			word-break: break-word;
			.title-index, .title-content, .title-type{
				display: inline-block;
			}
			.title-content{
				span.content-list{
					display: inline-block;
					margin-bottom: .3rem;
					.box{
						img, video{
							width: 100%;
						}
					}
					.tiankong{
						color: #a1a1a1;
					    padding: 0 15px;
					    border-bottom: 1px solid #333;
					}
				}
			}
		}
		
	}
</style>