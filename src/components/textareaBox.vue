<template>
<div class="components-of-textarea-box">
	<textarea v-model="newModel" :placeholder="placeholder">
							
	</textarea>
	<p class="written">{{newModel.length}} / {{totalLetter}}</p>
</div>
	
</template>
<script type="text/javascript">
	import { Toast, MessageBox } from 'mint-ui';
	export default{
		name: 'textareaBox',
		props: [
			'model',
			'placeholder',
			'totalLetter',
			'watch'
		],
		data(){
			return {
				newModel: ''
			}
		},
		mounted(){
			this.newModel = this.model;
		},
		watch: {
			newModel(val, oldVal){
				if(val.length > this.totalLetter){
					this.newModel = oldVal;
					Toast({
						message: '评论不可超过200字',
						duration: 1000
					});
				}else{
					this.newModel = val
				}
				this.$emit('watch', this.newModel);
			}
		}
	}
</script>
<style lang="less">
	.components-of-textarea-box{
		textarea{
			width: calc(~"96% - 2px");
		    height: 9em;
		    padding: 1% 2%;
		    border-radius: 3px;
		    font-size: 1em;
		    line-height: 2em;
		    color: #333;
		    border: 1px solid #eee;
		    background-color: #fafafa;
		    resize: none;
		    outline: none;
		    -webkit-appearance: none;
		}
		p{
		    text-align: right;
		    color: #999999;
		}
	}
</style>