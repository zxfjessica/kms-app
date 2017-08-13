<template>
	<div class="video-shower">
		<img v-show="!showVideo"
			class="play-btn"
			src="../../../static/img/play.png" 
			@click="playVideo"
			alt="">
		<video :src="$global().imgHost + videoPath"
				class="blog-video"
				preload
				controls="controls"
				webkit-playsinline
				ref="videoPlayer"
				v-show="showVideo" 
				autoplay="autoplay"
				><!--
				$global().imgHost +  videoPath -->
			不支持该视频格式播放
		</video>
	</div>
</template>
<script>
import { Toast } from 'mint-ui';
	export default{
		name: 'videoItem',
		props: {
			videoPath: {
				type: String
			}
		},
		data(){
			return {
				showVideo: false
			}
		},
		mounted(){},
		methods: {
			playVideo() {
				this.showVideo = true;
				//this.$refs.videoPlayer.controls = 'controls';
				this.$refs.videoPlayer.play();
				this.autoFullScrenn(this.$refs.videoPlayer,this);

				this.$emit('playVideo');
			},
			setPage(direct){
				if(direct=='Horizontal'){
					try{
						ExpressPlugin.deviceChangeToHorizontal(()=>{
							console.log('change to horizontal:success');
						},()=>{
							console.log('change to horizontal:fail');
						});
					}catch(e){}
				}else{
					try{
						ExpressPlugin.deviceChangeToVertital(()=>{
							console.log('change to vertical:success');
						},()=>{
							console.log('change to vertical:fail');
						});
					}catch(e){}
				}
			},
			fullscreen(elem) {
				var prefix = 'webkit';
				  if ( elem[prefix + 'EnterFullScreen'] ) {
					return prefix + 'EnterFullScreen';
				  } else if( elem[prefix + 'RequestFullScreen'] ) {
					return prefix + 'RequestFullScreen';
				  };
				return false;
			},
			autoFullScrenn(v,that) {
				var ua   = navigator.userAgent.toLowerCase();  
				var Android = String(ua.match(/android/i)) == "android";
				if(!Android) return;//非android系统不使用;
				var video  = v,doc = document;
				var fullscreenvideo = that.fullscreen(doc.createElement("video"));
				if(!that.fullscreen) {
					Toast("不支持全屏模式");
					return;
				}
				video.addEventListener("webkitfullscreenchange",function(e){
					if(!Android){
						if(!doc.webkitIsFullScreen){//退出全屏暂停视频
							ExpressPlugin.showStatusBar();
						}
					}else{
						if(!doc.webkitIsFullScreen){//退出全屏暂停视频
							that.setPage('Vertical');
						}else{
							that.setPage('Horizontal')
						}
					}
				}, false);
				video.addEventListener("fullscreenchange",function(e){
					if(!Android){
						if(!doc.fullScreen){//退出全屏暂停视频
							ExpressPlugin.showStatusBar();
						}
					}else{
						if(!doc.fullScreen){//退出全屏暂停视频
							that.setPage('Vertical');
						}else{
							that.setPage('Horizontal')
						}
					}
				}, false);
				video.addEventListener("mozfullscreenchange",function(e){
					if(!Android){
						if(!doc.mozFullScreen){//退出全屏暂停视频
							ExpressPlugin.showStatusBar();
						}
					}else{
						if(!doc.mozFullScreen){//退出全屏暂停视频
							that.setPage('Vertical');
						}else{
							that.setPage('Horizontal')
						}
					}
				}, false);
				video.addEventListener("msfullscreenChange",function(e){
					if(!Android){
						if(!doc.msIsFullScreen){//退出全屏暂停视频
							ExpressPlugin.showStatusBar();
						}
					}else{
						if(!doc.msIsFullScreen){//退出全屏暂停视频
							that.setPage('Vertical');
						}else{
							that.setPage('Horizontal')
						}
					}
				}, false);
				// video.addEventListener("click", function(){
				// 	v.play();
				// 	video[fullscreenvideo]();
				// }, false);
				video.addEventListener('ended',function(){
					doc.webkitCancelFullScreen(); //播放完毕自动退出全屏
				},false);
			}
		}

	}
</script>
<style lang="less" scoped>
	.video-shower {
		margin-top: 0.3rem;
		background-color: #eee;
		height: 5rem;
		position: relative;
		.play-btn {
			display: block;
			width: 1.8rem;
			height: 1.8rem;
			position: absolute;
			left: 50%;
			top: 50%;
			margin-top: -0.9rem;
			margin-left: -0.9rem;
			z-index: 1000;
		}
		.blog-video {
			width: 100%;
			height: 100%;
		}
	}
</style>