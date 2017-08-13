<template>
	<div class="star-wrapper" @touchstart.stop="levelSel">
		<span v-for="(item,$index) in totalStar" 
			  class="star" 
			  :class="{'active':($index<=Math.floor(innerScore)&&innerScore%1>0.5)||$index<Math.floor(innerScore),'half':(innerScore%1<=0.5&&innerScore%1>0&&$index==Math.ceil(innerScore)-1&&innerScore>0)}"
			  :index="$index"
			  @click.stop="clickLevelSel"
			 >
			  {{Number(innerScore)}}</span>
		<span class="score-num" v-if="showScore">{{innerScore}}</span>
	</div>
</template>
<script>
	export default {
		props: {
			score: {
				type: String,
				default: ''
			},
			totalStar: Number,
			clickOnOff: {
				type: Boolean,
				default: false
			},
			touchOnOff: {
				type: Boolean,
				default: false
			},
			showScore: {
				type: Boolean,
				default: false
			},
			integer: {//传出的评星是否整数，向上取整
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				innerScore: '0.0'
			}
		},
		watch: {
			score(val) {
				this.innerScore = this.score;
			}
		},
		mounted() {
			this.innerScore = this.score;
		},
		methods: {
			clickLevelSel(event) {
				if(!this.clickOnOff){
					return;
				}
				var index = Number(event.currentTarget.getAttribute('index'));
				if(event.offsetX >= (event.currentTarget.clientWidth/2)){
					this.innerScore = index + 1;
				}else{
					if(index == 0){
						if(event.offsetX <= (event.currentTarget.clientWidth/5)){
							this.innerScore = index;
							return;
						}
					}
					this.innerScore = index + 0.5;
				}
			},
			levelSel(event) {
				if(!this.touchOnOff){
					return;
				}
				if(event.currentTarget.className != 'star-wrapper'){
					return;
				}
				var index = Number(event.currentTarget.getAttribute('index'));
				var dis = (event.touches[0].pageX - event.currentTarget.offsetLeft)/event.touches[0].target.clientWidth;
				if( dis < 0 ){
					dis = 0;
				}
				if( dis > Number( this.totalStar ) ){
					dis = Number( this.totalStar )
				}
				if(dis % 1 > 5 || dis % 1 ===0){
					this.innerScore = Math.round(dis);
				}else{
					this.innerScore = Math.floor(dis) + 0.5;
				}
				event.currentTarget.addEventListener('touchmove',this.levelSelMove,false);
				event.currentTarget.addEventListener('touchend',this.levelSelEnd,false);
			},
			levelSelMove(event){
				event.preventDefault();
				event.stopPropagation();
				var index = Number(event.currentTarget.getAttribute('index'));
				var dis = (event.touches[0].pageX - event.currentTarget.offsetLeft)/event.touches[0].target.clientWidth;
				if( dis < 0 ){
					dis = 0;
				}
				if( dis > Number( this.totalStar ) ){
					dis = Number( this.totalStar )
				}
				if(dis % 1 > 5 || dis % 1 ===0){
					this.innerScore = Math.round(dis) + '.0';
				}else{
					this.innerScore = Math.floor(dis) + 0.5;
				}
				event.currentTarget.addEventListener('touchend',this.levelSelEnd,false);
			},
			levelSelEnd(){
				event.preventDefault();
				event.stopPropagation();
				event.currentTarget.removeEventListener('touchmove',this.levelSelMove,false);
				event.currentTarget.removeEventListener('touchend',this.levelSelEnd,false);

				if(this.integer){
					if(String(this.innerScore).indexOf('.') >= 0){
						this.innerScore = Math.round(this.innerScore);
					}
				}

				this.$emit('watch',this.innerScore);
			}
		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	.star-wrapper{
		font-size: 0;
		.star{
			display: inline-block;
			width: 16px;
			height: 16px;
			background: url("../../../static/img/shunfeng_signs.png") no-repeat;
			background-size: 176%;	
			.bgPosition(@signsWidth, @signsHeight, 16, 16, 0, 1295);		
			&.active{
				.bgPosition(@signsWidth, @signsHeight, 16, 16, 0, 1257);
			}
			&.half{
				.bgPosition(@signsWidth, @signsHeight, 16, 16, 0, 1333);
			}
		}
		.score-num{
			float: right;
			display: block;
			width: 18px;
			font-size: 12px;
			line-height: 16px;
			color: #ffa703;
			margin-left: 2px;
		}
	}
</style>