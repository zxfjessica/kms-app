<template>
	<div class="info-box">
		<h1 class="mint-popup-title clearfix">
			简介
			<i class="signs close-signs fr" @click="closeInfo"></i>
		</h1>
		<div class="mint-popup-content">
			<ul class="info-lists">
				<li class="list short-info">
					<h3>{{courseType == 'courses' ? '课程': '项目'}}简介</h3>
					<div class="control-box" :class="!isInfoUnfold ? 'fold' : 'unfold'" ref="infoControlHeight">
						<ul class="infos" ref="infoItemHeight">
							<li class="info" v-for="intro in introdution">
								<div v-if="intro.type == 'image'"><img :src="$global().imgHost + intro.src" @load="loadCourImg"></div><!--  -->
								<div v-if="intro.type == 'text'"><p v-html="intro.text"></p></div><!-- {{intro.text}} -->
								<!-- <div v-if="intro.type == 'video'"><video :src="intro.src" controls="controls"></video></div> -->
							</li>
						</ul>
					</div>
					<div class="fold-out" @click="isInfoUnfold = true" v-if="!isInfoUnfold && isShowInfoControl">
						...<i>展开</i>
					</div>
					<div class="fold-out" @click="isInfoUnfold = false" v-if="isInfoUnfold && isShowInfoControl">
						...<i>收起</i>
					</div>
				</li>
				<li class="list catalog" v-if="catologList">
					<h3>课程目录</h3>
					<div class="control-box" :class="!isUnfold ? 'fold' : 'unfold'" ref="controlHeight">
						<ul class="infos" ref="itemHeight">
							<li class="info" v-for="cat in catologList">
								<div class="info-box">
									<div v-if="cat.type == 'image'"><img :src="$global().imgHost + cat.src" @load="loadCatImg"></div><!--  -->
									<div v-if="cat.type == 'text'"><p v-html="cat.text"></p></div><!-- {{cat.text}} -->
									<!-- <div v-if="cat.type == 'video'"><video :src="cat.src" controls="controls"></video></div> -->
								</div>
							</li>		
						</ul>
					</div>
					<div class="fold-out" @click="isUnfold = true" v-if="!isUnfold && isShowControl">
						...<i>展开</i>
					</div>
					<div class="fold-out" @click="isUnfold = false" v-if="isUnfold && isShowControl">
						...<i>收起</i>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		name: 'infomationBox',
		props: [
			'introdution',
			'catolog',
			'courseType',
			'coursesId'
		],
		data(){
			return{
				courseIntro: '',
				courseDirect: '',
				isUnfold: false,
				isShowControl: false,
				isInfoUnfold: false,
				isShowInfoControl: false,
				catologList: [],
				introdutionList: []
			}
		},
		mounted(){
			this.catologList = this.catolog;
			this.introdutionList = this.introdution;
		},
		methods:{
			closeInfo: function(){
    			this.$emit('closeInfo')
			},
			loadCourImg(eve){
				if(!this.isShowInfoControl){
					if(this.$refs.infoItemHeight.clientHeight > this.$refs.infoControlHeight.clientHeight){
						this.isShowInfoControl = true;
					}else{
						this.isShowInfoControl = false;
					}
				}
				
			},
			loadCatImg(eve){
				if(!this.isShowControl){
					if(this.$refs.infoItemHeight.clientHeight > this.$refs.infoControlHeight.clientHeight){
						this.isShowControl = true;
					}else{
						this.isShowControl = false;
					}
				}
				
			}
		},
		watch: {
			catologList(val){
				var that = this;
				setTimeout(function(){
					if(that.$refs.itemHeight.clientHeight > that.$refs.controlHeight.clientHeight){
						that.isShowControl = true;
					}else{
						that.isShowControl = false;
					}
				}, 500);
			},
			introdutionList(val){
				//
				var that = this;
				setTimeout(function(){
					if(that.$refs.infoItemHeight.clientHeight > that.$refs.infoControlHeight.clientHeight){
						that.isShowInfoControl = true;
					}else{
						that.isShowInfoControl = false;
					}
				}, 500);
			}
		}
	}
</script>
<style lang="less">
	.info-box{
		height: 100%;
		.info-lists{
			height: calc(~"100vh - 5.7rem - 46px - 1.2rem");
    		overflow-y: auto;
    		font-size: 0.3rem;
			li.list{
				background-color: #fff;
				padding: 3.6% 0;

				h3{
					font-size: 0.35rem;
					padding-left: 3.6%;
					margin-bottom: 2%;
				}
				.infos{
					padding: 0 3.6%;
					color: #999999;
					.info{
    					line-height: 0.6rem;
    					img{
    						width: 100%;
    						margin-top: 8px;
    					}
    					video{
    						width: 100%;
    						min-height: 15em;
    						margin-top: 8px;
    					}
    					p{
    						word-wrap: break-word;
    					}
					}
				}
				.control-box{
    				max-height: 1.8rem;
				}
				.fold{
					overflow: hidden;
					max-height: 1.8rem;
				}
				.unfold{
					overflow: visible;
					max-height: none;
				}
				.fold-out{
					line-height: 0.65rem;
					color: #999;
					padding: 0 3.6%;
					i{
						margin-left: 3px;
						color: #ff4141;
					}
				}
						
			}
			li.list:not(:last-child){
				margin-bottom: 3.6%;
			}
			li.list.lecture{
				padding-right: 3.6%;
				h3{
					margin: 0;
				}
			}
		}
	}
</style>