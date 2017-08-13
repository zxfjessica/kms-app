<template>
	<div class="create-audio-wrapper">
		<h6 class="create-audio-title" v-if="recordType == 0">长按图标录音</h6>
		<h6 class="create-audio-title" v-if="recordType == 2">点击图标播放录音</h6>
		<h6 class="create-audio-title" v-if="recordType != 0">
			{{String(mm).length == 1 ? '0' + mm: mm}} : 
			{{String(ss).length == 1 ? '0' + ss: ss}}</h6>
		<!-- <div class="audio-btn start" @click="recordStart" v-if="recordType == 0"></div>
		<div class="audio-btn recording" @click="recordEnd" v-else-if="recordType == 1"></div>
		<div class="audio-btn" :class="isPlaying ? 'playing' : 'stopPlay'" @click="recordPlay" v-else-if="recordType == 2"></div> -->
		<div class="record">
			<div class="progress-circle">
				<svg viewBox="0 0 100 100" ref="svg-box">
					<path class="progress-circle__track" :d="trackPath" stroke="#fde5e8" :stroke-width="relativeStrokeWidth" fill="none"></path>
					<path class="progress-circle__path" :d="trackPath" stroke-linecap="round" :stroke="stroke" :stroke-width="relativeStrokeWidth" fill="none" :style="circlePathStyle"></path>
				</svg>
			</div>
			<div class="circle state" v-show="recordType == 0" @touchstart="recordStart" @touchend="recordEnd"></div><!--   -->
			<div class="start state" v-show="recordType == 1"></div><!--  -->
			<div class="end state" v-show="recordType == 2 && playStatus === 'end'" @touchend="startPlay"></div>
			<div class="play state" v-show="recordType == 2 && playStatus === 'play'" @touchend="stopPlay"></div>
			<div class="over state" v-show="recordType == 2 && playStatus === 'over'" @touchend="overPlay"></div>
		</div>
		<div class="create-audio-bottom clearfix" v-if="recordType == 2">
			<span class="again-audio fl" @click="cancelRecord">取消</span>
			<span class="audio-next fr" @click="nextStep">完成</span>
		</div>
		<div class="cancel-audio-bottom" v-if="recordType != 2">
			<span class="cancel-audio" @click="cancelRecord">取消</span>
		</div>
	</div>
</template>
<script>
	import {
		Toast,
		MessageBox,
		Indicator
	} from 'mint-ui';
	export default{
		name: 'audioSelTip',
		prop: {},
		data() {
			return{
				recordType: 0, //0初始化  1开始录音  2结束录音 
				mm: 0,
				ss: 0,
				total: {
					time: 0,
					minute: 0,
					second: 0
				},

				recordResult: '',
				strokeWidth: 6,
				width: 107,
				percentage: 0,
				playStatus: '',
				backAudioList: []//服务器地址
			}
		},
		beforeDestroy(){
			clearInterval(this.timeRecording);
		},
		computed: {
			stroke() {
				var ret
				if(this.recordType == 2 && this.playStatus == 'play'){
					ret = '#fd545b';
				}else{
					ret = 'transparent';
				}
				return ret;
			},
			perimeter() {
				var radius = 50 - parseFloat(this.relativeStrokeWidth) / 2;
				return 2 * Math.PI * radius;
			},
			circlePathStyle() {
				var perimeter = this.perimeter;
				return {
					strokeDasharray: `${perimeter}px,${perimeter}px`,
					strokeDashoffset: (1 - this.percentage / 100) * perimeter + 'px',
					transition: `stroke-dashoffset ${this.total.time}s linear 0s` //, stroke ${this.time.second}s ease
				};
			},
			relativeStrokeWidth() {
				return(this.strokeWidth / this.width * 100).toFixed(1);
			},
			trackPath() {
				var radius = parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10);

				return `M 50 50 m 0 -${radius} a ${radius} ${radius} 0 1 1 0 ${radius * 2} a ${radius} ${radius} 0 1 1 0 -${radius * 2}`;
			},
		},
		mounted(){
			var that = this;
			that.checkTape();
		},
		methods: {
			checkTape(){
				console.log("开始执行语音权限检测 ")
				if(localStorage.checkTape){
					console.log("开启过 ")
					return
				}else{
					console.log("1 ")
					try{
						cordova.exec(function(result){
							console.log("执行开启 ")
							if(typeof result == "string") {
								result = JSON.parse(result)
							}
							if(result.limitReached) {
								return
							}
							localStorage.checkTape = "true"
							cordova.exec(()=>{
								console.log("3")
							}, ()=>{
								console.log("4")
							}, 'SpeechRecorder', 'stopRecording', []);
						}, function(){
							console.log("2")
						}, 'SpeechRecorder', 'startRecording', []);
					}catch(err){
						console.log('catch:',err);
					}
					
					
				}
				
			},
			recordUpload() {//录音上传
				console.log("开始")
				var success = (result) => {
					Indicator.close();
					console.log("成功", result)
					console.log(result.response)
					var record = JSON.parse(result.response)
					console.log(record)
					if(record.status == 1) {
						console.log(record.data)
						var backAudioList = record.data
						if(backAudioList) {
							/*backAudioList.forEach((sub) => {
								sub.speechStyle = {
									"backgroundPositionX": -34 + 'px'
								}
								
							})*/
						} else {
							backAudioList = []
						}
						this.backAudioList = backAudioList[0];
						console.log('最终上传结果：', this.backAudioList);

						this.$emit('finishRecord', this.total, this.backAudioList);
						//return true;
					}
				}

				var fail = (response) => {
					Toast('发送失败');
					Indicator.close();
					console.log("失败", response)
					//return false;
				}

				try{
					var fileTransfer = new FileTransfer();
					var fileFullPath = this.recordResult;						
					var uploadUrl = this.$global().host + '/KMS-MSERVER/cultureupload/media';
					console.log("数据", fileFullPath, fileFullPath.substr(fileFullPath.lastIndexOf('/') + 1));

					/*var params = {
						'userCode': that.$globals.userAccount,
						'backInfoId': this.backId,
						'dealId': this.evaluate.dealId,
						'upload': fileFullPath,
						'timeLength': this.time.second,
						'uploadFileName': fileFullPath.substr(fileFullPath.lastIndexOf('/') + 1)
					}*/
					var opt = {
						'fileKey': 'file',
						'fileName': fileFullPath.substr(fileFullPath.lastIndexOf('/') + 1),
						'mimeType': 'audio/aac'/*,
						'params': params*/
					}
					console.log(opt)
					Indicator.open('正在上传音频...');
					fileTransfer.upload(fileFullPath, encodeURI(uploadUrl), success, fail, opt, true);
				}catch(err){
					console.log(err);
					//return false;
				}
				
			},
			nextStep(){
				clearInterval(this.timeRecording);
				clearInterval(this.timePlay);
				this.recordUpload();
				/*var isSuccessUpload = 
				if(!isSuccessUpload){
					return Toast({message: '录音上传失败！请重试！', duration: 1000});
				}else{
					
				}
				*/
			},
			cancelRecord(){
				clearInterval(this.timeRecording);
				clearInterval(this.timePlay);
				this.recordType = 0;
				this.$emit('closeAudio');

			},
			recordStart() { //开始录音
				var that = this;
				var success = (result) => {
					console.log("startRecording", result);
					if(typeof result == "string") {
						result = JSON.parse(result)
					}
					if(result.limitReached) {
						return
					}

					that.recordType = 1;
					that.timeRecording = setInterval(()=>{
				    	that.ss++
				    	if(that.ss == 60){
				    		that.mm ++;
				    		that.ss = 0;
				    		//clearInterval(timeSet);
				    	}
				    	var all = that.ss + that.mm * 60;
				    	if(all >= 300){//超过5分钟结束录音
				    		that.recordEnd();
				    	}
				    }, 1000);

					console.log(result, result.file)
					that.recordResult = result.file
					console.log(that.recordResult, result.file)
				}
				var fail = (error) => {
						console.log("startError", error);
					}

				try{
					cordova.exec(success, fail, 'SpeechRecorder', 'startRecording', []);
				}catch(err){
					console.log('catch:', err);
				}
				
			},
			recordEnd() { //结束录音
				var that = this;
				console.log("开始结束录音");
				var success = (result) => {
					if(typeof result == "string") {
						result = JSON.parse(result)
					}
					console.log("stopRecording", result);
					if(result.limitReached) {
						return
					}
					
					if(that.mm == 0 && that.ss < 2) {
						clearTimeout(that.timeRecording);
						that.recordType = 0;
						Toast({
							message: '录音时间太短',
							duration: 1000
						});
						return
					}

					clearInterval(that.timeRecording);
					that.recordType = 2;
					that.playStatus = 'end';
					that.total.time = parseInt(that.mm * 60 + that.ss);
					that.total.minute = that.mm;
					that.total.second = that.ss;
					//console.log(that.total);
					console.log(result);
					that.recordResult = result.file;
				}
				var fail = (error) => {
					console.log("stopRecordingError", error);
				}
				try{
					cordova.exec(success, fail, 'SpeechRecorder', 'stopRecording', []);
				}catch(err){
					console.log('catch:', err);
				}
				
			},
			startPlay() { //播放录音
				var that = this;
				clearInterval(that.timePlay);
				var success = (result) => {
					if(typeof result == "string") {
						result = JSON.parse(result)
					}
					that.percentage = 100;
					that.playStatus = 'play';
					that.startDaojishi(that.total.time);

					console.log("startPlaying", result);
					if(result.end) {
						this.percentage = 0
						that.playStatus = 'over';
						clearInterval(that.timePlay)
						return
					}

				}
				var fail = (error) => {
					console.log("startError", error);
				}
				try{
					cordova.exec(success, fail, 'AudioPlayer', 'startPlaying', [that.recordResult]);
				}catch(err){
					console.log('catch:', err);
				}
			},
			stopPlay() { //结束播放
				var that = this;
				clearInterval(that.timePlay);
				var success = (result) => {
					if(typeof result == "string") {
						result = JSON.parse(result)
					}
					console.log("stopPlaying", result);
					if(!result.end) {
						return
					}
					console.log("关闭");
					that.percentage = 0;
					that.playStatus = 'over';
					that.$refs['svg-box'].style.display = 'block';
					clearInterval(that.timePlay);
				}
				var fail = (error) => {
					console.log("startError", error);
				}
				try{
					cordova.exec(success, fail, 'AudioPlayer', 'stopPlaying', [that.recordResult]);
				}catch(err){
					console.log('catch:', err);
				}
				
			},
			overPlay() { //播放录音
				clearInterval(this.timer)
				this.startPlay()
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
						that.$refs['svg-box'].style.display = 'none';
						that.playStatus = 'over';
						that.stopPlay();
						//console.log(that.total);
						setTimeout(()=>{
							that.mm = that.total.minute;
							that.ss = that.total.second;
						}, 1000);
						
					}
				}, 1000);
			}
		},
		watch:{
			total(val){
				console.log(val);
			}
		}
	}
</script>
<style lang="less">
	.create-audio-wrapper {
		background-color: #fff;
		padding: 0.32rem .64rem;
		.create-audio-title {
			font-size: 0.42rem;
			line-height: 0.63rem;
			color: #333;
			text-align: center;
		}
		/*.audio-btn {
			width: 1.6rem;
			height: 1.6rem;
			border-radius: 50%;
			border: 1px solid #eee;
			background-color: #fff;
			position: relative;
			margin: 0 auto;
			margin-top: 0.32rem;
			&.start:after {
				content: '';
				width: 1.2rem;
				height: 1.2rem;
				border-radius: 50%;
				position: absolute;
				left: 50%;
				top: 50%;
				margin-top: -0.6rem;
				margin-left: -0.6rem;
				background-color: #ff4143;
			}
			&.recording:after {
				content: '';
				width: 1rem;
				height: 1rem;
				position: absolute;
				left: 50%;
				top: 50%;
				margin-top: -0.5rem;
				margin-left: -0.5rem;
				background-color: #ff4143;
			}
			&.stopPlay:after {
				content: '';
				position: absolute;
				left: 50%;
				top: 50%;
				margin-top: -0.5rem;
				margin-left: -0.35rem;
				border-top: .5rem solid transparent;
				border-bottom: .5rem solid transparent;
				border-left: .8rem solid #ff4141;
				border-right: none;
			}
			&.playing:before, &.playing:after{
				content: '';
			    width: .25rem;
			    height: 1rem;
			    position: absolute;
			    top: .3rem;
			    background-color: #ff4143;
			    z-index: 10;
			}
			&.playing:before{
			    left: .4rem;
			}
			&.playing:after {
				right: .4rem;
			}
		}*/
		.record{
		    position: relative;
			width: 1.5rem;
		    height: 1.5rem;
		    margin: .3rem auto;
			.progress-circle{
				height: 100%;
				width: 100%;
			}
			.state{
				position: absolute;
				width: 100%;
				height: 100%;
				left: 0;
				top: 0;
			}
		}
		.create-audio-bottom {
			margin-top: 0.32rem;
			span {
				border: 1px solid #eee;
				border-radius: 4px;
				padding: 0.32rem 0.64rem;
				font-size: 0.4rem;
				line-height: 0.6rem;
			}
		}
		.cancel-audio-bottom{
			margin-top: 0.32rem;
			text-align: center;
			span{
				display: inline-block;
				padding: 0.32rem 0.64rem;
				border: 1px solid #eee;
				border-radius: 4px;
				font-size: 0.4rem;
				line-height: 0.6rem;
			}
		}
	}
</style>