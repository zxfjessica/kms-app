<template>
	<div class="list-container">
		
		<div class="content">
			
				<ul class="course-list" v-if="itemdataByP.length">
					<li class="co-li" v-for="item in itemdataByP">
						<v-item :item="item" :kindByP="searchkindByP" ></v-item>
					</li>
				</ul>
				<div v-else>找不着数据！！！</div>
			
		</div>
		
	</div>
</template>
<script>
 	import ListItem from "./ListItem.vue"
 
	export default {
		data() {
			return {
				
				project:{},
				course:{},
				orderActive:0,
				searchkind:this.searchkindByP,//当前组件类别（课程还是项目）
				searchcontent:this.searchcontentByP
				
			}
		},
		/*
			@searchkindByP:是哪一种列表	
			@searchcontentByP:搜索内容
		*/
		props: {
			"searchkindByP":String,
			"searchcontentByP":{
				type:String,
				default:""
			},
			"itemdataByP":{
				type:Array,
				default:[]
			}
		},
		mounted() {
			/*列表内容请求*/
			var data={};
			if(this.searchkindByP=='project'){
				data={
					"type":0
				}
				//项目列表请求
				this.getData('/KMS-MSERVER/learning/learningSearch/list','project','GET',data);

				
			}else if(this.searchkindByP=='course'){
				
				
				
				
			}
			this.searchkind=this.searchkindByP
		},
		computed:{
			itemData() {
				if(this.searchkindByP=='project'){
					return this.project;
				}else if(this.searchkindByP=='course'){
					return this.course;
				}
			}
		},
		methods: {
			getData(url,pro,method,data) {
				this.$http({
					method:method,
					url:this.$global().host+url,
					data:data?data:{}
				}).then(

					response => {
						if(response.status==200&&response.body.status){
							if(response.body.data){
								this[pro] = response.body.data;
							}else{
								this[pro] = '找不着数据！';
							}
							
						}
						
					},
					response =>{
						// error callback
						console.log('error');
					}
				)
			}
			
			
		},
		components: {
			"v-item":ListItem
		}
	}
</script>
<style lang="less">
	.list-container,.my-course-container{
		.course-list{
			padding: 0 12px;
			.co-li{
				padding-top:30px;
				padding-bottom:0.69rem;
				border-bottom:1px solid #eee;
				font-size: 0;
				position:relative;
			}
		}
	}
	
	
</style>