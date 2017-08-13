<template>
	<div class="audio-item">
		<span class="audio-bar" @click="play">
			{{String(mm).length == 1 ? '0' + mm: mm}} : 
			{{String(ss).length == 1 ? '0' + ss: ss}}</span>
		<i class="delete" @click="deleteAudio" v-if="type == 'add'">x</i>
		<audio controls="controls" autoplay="autoplay" src="" ref="audio" class="audio-player"><!-- $global().imgHost +   -->
			不支持
		</audio>
	</div>
</template>
<script>
	export default{
		name: 'audioItem',
		props: {
			type: {
				type: String
			},
			audioTime: {},
			audioPath: {}
		},
		data(){
			return {
				isPlay: false,
				mm: 0,
				ss: 0,
				total: {
					time: this.audioTime,
					minute: parseInt(this.audioTime / 60),
					second: this.audioTime - parseInt(this.audioTime / 60)*60
				}
			}
		},
		mounted(){
			this.mm = parseInt(this.audioTime / 60);
			this.ss = this.audioTime - parseInt(this.audioTime / 60)*60;
		},
		methods: {
			deleteAudio(){
				this.$emit('deleteAudio');
			},
			play(){
				this.isPlay = !this.isPlay;
				clearInterval(this.timePlay);
				if(this.isPlay){
					this.$refs.audio.src = this.$global().imgHost + this.audioPath;
					this.$refs.audio.play();
					this.startDaojishi(this.total.time);
				}else{
					this.mm = this.total.minute;
					this.ss = this.total.second;
					this.$refs.audio.src = '';
					this.isPlay = false;
				}
				
			},
			startDaojishi(time){//倒计时开启
				var that = this;
				that.mm = parseInt(time / 60);
				that.ss = time - that.mm * 60
				if(that.ss == 0){
					that.mm -= 1;
					that.ss = 59;
				}
				that.timePlay = setInterval(function(){
					//console.log(111);
					that.ss -= 1;
					if(that.ss == 0 && that.mm != 0){
						that.mm -= 1;
						that.ss = 59;
						//clearInterval(timeSet);
					}else if(that.ss == 0 && that.mm == 0){
						clearInterval(that.timePlay);
						//console.log(that.total);
						setTimeout(()=>{
							that.mm = that.total.minute;
							that.ss = that.total.second;
							that.$refs.audio.src = '';
							that.isPlay = false;

						}, 1000);						
					}
				}, 1000);
			}
		}
	}
</script>
<style lang="less" scoped>
@import "../../css/customFn.less";
	.audio-item{
		position: relative;
		height: .8rem;
		margin-top: .1rem;
		margin-bottom: .3rem;
		line-height: .8rem;
		span.audio-bar{
			display: block;
			height: 100%;
			background-color: #f2f2f2;
			border-radius: 10px;
			text-align: left;
			padding-left: .9rem;
			&:before{
				content: '';
				position: absolute;
				top: .1rem;
				left: .3rem;
				height: .6rem;
				width: .6rem;
				background-image: url('../../../static/img/shunfeng_signs4.png');
				background-size: 200%;
				.bgPosition(@signs4Width, @signs4Height, 20, 31, 0, 1296);
			}
		}
		.delete{
			position: absolute;
			right: .3rem;
			top: 50%;
			margin-top: -0.4rem;

		}
		.audio-player{
			visibility: hidden;
			position: absolute;
		}
	}
</style>