<template>
	<div class="homePage-footer">
		<ul class="tag-list clearfix">
			<li><a href="#"><span class="signs study" :class="{'active' : active == 1}">学习</span></a></li>
			<li><a href="#/knowledge/index"><span class="signs channel" :class="{'active' : active == 2}">频道</span></a></li>
			<li><a href="#/MyCenter"><span class="signs center" :class="{'active' : active == 3}">我的</span></a></li>
		</ul>
	</div>
</template>
<script>
	export default{
		props:{
			active: {
				type: Number
			}
		}
	}
</script>
<style lang="less">
	@import "../css/customFn.less";
	.homePage-footer,.center-footer{
	    background-color: #fff;
	    border-top: 1px solid #ddd;
	    position: absolute;
	    bottom: 0;
	    left: 0;
	    right: 0;
	    &.isfixed{
	    	position: fixed;
	    }
	    .tag-list {
	    	li{
			    height: 46px;
    			line-height: 46px;
			    text-align: center;
				float: left;
				
				width: calc(~"(100% - 2px) / 3");
				&.active{
					a{
						color: #ff4141;
					}
				}
				a{
					font-size: 0.4rem;
					vertical-align: sub;
					display: block;
				    width: 100%;
				    height: 100%;
					/* img{
						height: 0.57rem;
					    position: relative;
					    top: 5px;
					    right: 8px;
					} */
					span:before {
						top: 50%;
						left: -2px;
						margin-top: -12px;
					}
					.study {
						&.active {
							color: #ff4141;
							&:before {
								background: url('../../static/img/main_red.png') no-repeat;
								background-size: 80%;
								margin-top: -9px;
								left: -5px;
								.bgPosition(47, 43, 48, 44, 0, -0.7);
							}
						}
						&:before {
							background: url('../../static/img/main.png') no-repeat;
							background-size: 80%;
							margin-top: -9px;
							left: -5px;
							.bgPosition(47, 43, 48, 44, 0, -0.7);
						}
					}
					.channel {
						&.active {
							color: #ff4141;
							&:before {
								background: url('../../static/img/channel_red.png') no-repeat;
								background-size: 60%;
								.bgPosition(47, 43, 48, 44, 0, 0);
								margin-top: -10px;
							}
						}
						&:before {
							background: url('../../static/img/channel.png') no-repeat;
							background-size: 60%;
							.bgPosition(47, 43, 48, 44, 0, 0);
							margin-top: -10px;
						}
					}
					.center {
						&.active {
							color: #ff4141;
							&:before {
								background: url('../../static/img/my_icon_red.png') no-repeat;
								background-size: 74%;
								.bgPosition(47, 43, 48, 44, 0, 0);
								margin-top: -11px;
							}
						}
						&:before {
							background: url('../../static/img/my_icon.png') no-repeat;
							background-size: 74%;
							.bgPosition(47, 43, 48, 44, 0, 0);
								margin-top: -11px;
						}
					}
				}
			}
			li:not(:first-child){
				border-left: 1px solid #ddd;
			}
	    }
	}
</style>