<template>
	<span class="newsigns" :class="isCollect == '1' ? 'isCollect': 'notCollect'" @click="collect">({{collectCount}})</span>
</template>
<script type="text/javascript">
	import { Toast, MessageBox } from 'mint-ui';
	export default{
		name: 'collectItem',
		props: [
			'isCollectCount',
			'courseCollectCount',
			'courseType',
			'coursesId'
		],
		data(){
			return {
				isCollect: 1,
				collectCount: 0
			}
		},
		mounted(){
			
			this.isCollect = this.isCollectCount;
			this.collectCount = this.courseCollectCount;
		},
		methods: {
			collect: function(){
				var that = this;
				var collectType;
				if(that.isCollect == 0){
					collectType = 0;
				}else{
					collectType = 1;
				}
				var collectUrl = that.$global().host+'/KMS-MSERVER/learning/collect/' + that.courseType + '/' + that.coursesId+ "?doType=" + collectType;		
				that.$http({
					type: 'GET',
					url: collectUrl
				}).then(function(data) {
					Toast({
						message: data.data.data.result,
						className: 'changeIndex',
						duration: 1000
					});
					if(data.data.data.result){
						if(data.data.data.result == '收藏成功'){
							that.collectCount += 1;
							that.isCollect = 1;

						}else if(data.data.data.result == '取消成功'){
							that.isCollect = 0;
							that.collectCount -= 1;
						}
					}
				});			

			}
		}
	}
</script>
<style lang="less"></style>