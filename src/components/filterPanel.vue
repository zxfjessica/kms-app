<template>
	<div class="filter-container" v-if="showFlag">
		<h4>{{title}}</h4>
		<ul>
			<li v-for="item in itemdata" 
				@click="clickHandler"
				:dataId="item[activeCondition]"
				:class="{active:actived==String(item[activeCondition])}">
				<div class="li-content">{{item[contentName]}}</div>
				<span class="tick"></span>
			</li>
		</ul>
	</div>
</template>
<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			itemdata: {
				type: Array,
				default: []
			},
			activeConditionAttr: {
				type: String,
				default: 'hierarchyId'
			},
			activeCondition: {
				type: String,
				default: 'id'
			},
			actived: {
				type: String,
				default: ''
			},
			contentName: {
				type: String,
				default: 'hierarchyName'
			},
			showFlag: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			clickHandler(event) {   
				this.$emit('selClickHandler', {
					activeConditionAttr: this.activeConditionAttr,
					dataId: event.currentTarget.getAttribute('dataId')
				});
			}
		}
	}
</script>
<style lang="less">
	.fliter-container {
		h4{
			font-size:0.43rem;
			line-height:1.3rem;
			margin-left: 1%;
			color:#5A5A5A;
		}
		li{
			display: inline-block;
			width:30.5%;
			height: 1rem;
			line-height: 1rem;
			white-space: nowrap;
			overflow: hidden;
			text-overflow:ellipsis;
			padding:1%;
			margin:0.4%;
			text-align:center;
			color:#777;
			font-size:0.33rem;
			.li-content{

				background:#EFEFEF;
				border:1px solid #EFEFEF;
				border-radius:0.2rem;
				padding: 0 3%;
				white-space: nowrap;
				overflow: hidden;
				text-overflow:ellipsis;
			}
			&.active{
				position: relative;
				.li-content{
					border: 1px solid #ff4141;
					background: #fff;
				}
				.tick{
					display: block;
					position: absolute;
					top:-5px;
					right:-5px;
					width: 0.53rem;
					height: 0.53rem;
					background:url('../../static/img/shunfeng_signs.png') #fff no-repeat 0 49.78%;
					background-size: 157.9% 4014%;
				}
			}

		}
	}
</style>