<template>
	<div class="components-of-set-star clearfix">
		<span class="star-tips fr">
			<i :style="'color: #f5cb37;'">{{newModel}}</i>
			<i :style="'color: #999999; font-size: 12px;'">
				{{newModel > 4.5 ? '很好': 
					  newModel <= 4.5 && newModel > 3.5 ? '好': 
					  newModel <= 3.5 && newModel > 2.5 ? '不错': 
					  newModel <= 2.5 && newModel > 1.5 ? '继续努力': 
					  newModel <= 1.5 && newModel > 0.5 ? '差': '很差'}}
			</i>
		</span>
		<span class="set-star fr">
			<img @touchstart.stop="startSet" 
				 @touchmove.stop="moveSet" 
				 @touchend.stop="endSet" 
				 @click="setCommentStar($event)"
				 src="../../static/img/star.png"
				 v-if="action == 'touchMove'">
			<img v-else-if="action == 'click'" @click="setCommentStar($event)" src="../../static/img/star.png">
			<i class="bg-color" :style="'width: '+ bgColorWidth + '%'"></i>
		</span>
	</div>
</template>
<script type="text/javascript">
	export default{
		name: 'setStar',
		props: [
			'model',
			'watch',
			'totalStar',
			'action'
		],
		data(){
			return {
				bgColorWidth: 0,
				startX: 0,
				moveX: 0,
				endX: 0,
				newModel: 0
			}
		}, 
		mounted(){
			this.newModel = this.model;
		},
		methods: {
			setCommentStar(event){
					var percent = parseFloat((event.offsetX / event.target.clientWidth).toFixed(1)*10);
					this.newModel = (percent / 2).toFixed(1);
					this.bgColorWidth = percent * 10 + 2;
					this.$emit('watch', this.newModel);
			},
			startSet(event){
				this.startX = event.touches[0].clientX;
			},
			moveSet(event){
				this.moveX = event.touches[0].clientX - this.startX;
				if(this.moveX >= 0){
					var percent = parseFloat((this.moveX / event.target.clientWidth).toFixed(1)*10);
					this.bgColorWidth = percent * 10 + 2;
				}
				

			},
			endSet(event){
				this.endX = this.moveX;
				if(this.endX >= 0){
					var percent = parseFloat((this.endX / event.target.clientWidth).toFixed(1)*10);
					var star = (percent / 2).toFixed(1);
					this.bgColorWidth = percent * 10 + 2;
					if(star > this.totalStar){
						this.newModel = this.totalStar;
					}else{
						this.newModel = star;
					}
				}else{
					this.newModel = 0;
					this.bgColorWidth = 2;
				}

				this.$emit('watch', this.newModel);
			}
		}
	}
</script>
<style lang="less">
	.components-of-set-star{
		span.star-tips{
			margin-left: 8px;
			margin-top: 2px;
		}
		span.set-star{
		    position: relative;
		    width: 3.78rem;
		    height: 0.6rem;
		    display: inline-block;
		    background-color: #e7e7e7;
		    overflow: hidden;
		    top: 0.3rem;
			img{
				position: absolute;
				width: 100%;
				z-index: 10;
				height: 104%;
				display: block;
				top: -2%;
			}
			.bg-color{
				position: absolute;
			    height: 90%;
			    background-color: #ffa703;
			    z-index: 0;
			    top: 5%;
			    left: 1px
			}
		}
	}
</style>