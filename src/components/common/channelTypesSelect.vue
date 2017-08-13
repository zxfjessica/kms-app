<template>
	<div classs="sel-kind-panel">
		<mt-header title="选择分类" class="is-fixed">
			<div slot="left">
			    <mt-button icon="back" @click="$emit('watchSelKindPanel')"></mt-button>
			</div>
			<div slot="right">
			    <mt-button @click="$emit('watchSelKindPanel')">确定</mt-button>
			</div>
		</mt-header>
		<div class="sel-kind-container container">
			<div class="sel-kind-title">
				<p>选择分类</p>
			</div>
			<div class="cate-list-wrapper">
				<ol class="cate-list" >
					<li :data-level="0" 
						@click.stop="cateLevelSelHandler"
						v-for="item in selCateList"
						:data-id="item.id"
						:abled="item.sonList"
						:class="{'active': cateId1ActiveTip==String(item.id)}">
						<h6 class="name" :class="{'current-sel': item.id == cateId}">
							<span class="cate-content">{{item.categoryName}}</span>
							<span class="left-arrow" v-if="item.sonList && item.sonList.length!=0"></span>
						</h6>
						<ul class="cateList" v-if="item.sonList">
							<li :data-level="1" 
								v-for="cate2 in item.sonList" 
								:data-id="cate2.id"
								@click.stop="cateLevelSelHandler"
								:abled="cate2.sonList"
								:class="{'active': cateId2ActiveTip==String(cate2.id)}">
								<h6 class="name" :class="{'current-sel': cate2.id == cateId}">
									<span class="cate-content">{{cate2.categoryName}}</span>
									<span class="left-arrow" v-if="cate2.sonList && cate2.sonList.length!=0"></span>
								</h6>
								<ul class="cateList" v-if="cate2.sonList" >
									<li :data-level="2" 
										v-for="cate3 in cate2.sonList"
										:data-id="cate3.id"
										@click.stop="cateLevelSelHandler"
										:abled="false">
										<h6 class="name" :class="{'current-sel': cate3.id == cateId}">
										<span class="cate-content">{{cate3.categoryName}}</span></h6>
									</li>
								</ul>
							</li>
						</ul>
					</li>
				</ol>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				cateId1ActiveTip: '',
				cateId2ActiveTip: '',
				cateListVisiable: 0,//选择列表的层级：0：第一级，1：第二级，2：第三级
				cateId: '',
				selKind: '',
				selCateList: []
			}
		},
		props: {
			/*selCateList: {
				type: Array
			}*/
		},
		mounted(){
			var url = '/KMS-MSERVER/mobileChannel/allCate?type=2';
			this.getData(url,'selCateList','GET');
		},
		methods: {
			cateLevelSelHandler(event) {
				this.selKind = event.currentTarget.getElementsByClassName('name')[0].getElementsByClassName('cate-content')[0].innerHTML;
				if (event.currentTarget.getAttribute('abled') != null && event.currentTarget.getAttribute('abled') != false) {
					//this.cateListVisiable = Number(event.currentTarget.getAttribute('data-level')) + 1;
					if (event.currentTarget.getAttribute('data-level') == '0') {//一级
						if (this.cateId1ActiveTip == event.currentTarget.getAttribute('data-id')) {
							this.cateId1ActiveTip = '';
						} else {
							this.cateId1ActiveTip = event.currentTarget.getAttribute('data-id');
						}	
					}
					if (event.currentTarget.getAttribute('data-level') == '1') {//二级
						if (this.cateId2ActiveTip == event.currentTarget.getAttribute('data-id')) {
							this.cateId2ActiveTip = '';
						} else {
							this.cateId2ActiveTip = event.currentTarget.getAttribute('data-id');
						}
					}
				} else { //末级
					this.cateId = Number(event.currentTarget.getAttribute('data-id'));
				}
				this.$emit('watchTypes', {'selKind':this.selKind, 'cateId': this.cateId});
			}
		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	.sel-kind-container {
		.sel-kind-title {
			height: 1.17rem;
			padding: 0 0.32rem;
			p {
				line-height: 1.17rem;
				font-size: 0.48rem;
				color: #666;
			}
		}
		.cate-list-wrapper {
			height: calc(~"100vh - 1.17rem - 46px");
			overflow-y: scroll;
		}
		.cate-list {
			background-color: #fff;
			list-style: none;
			.name {
				height: 0.83rem;
				border-bottom: 1px solid #eee;
				padding-left: 0.32rem;
				padding-top: 0.37rem;
				position: relative;
				font-size: 0.46rem;
				line-height: 0.46rem;
				&.current-sel {
					background-color: #eee
				}
				// &.current-sel:before {
				// 	content: '';
				// 	display: block;
				// 	position: absolute;
				// 	left: -0.15rem;
				// 	top: 50%;
				// 	width: 2px;
				// 	height: 2px;
				// 	border-radius: 50%;
				// 	background-color: #ff0000;
				// }
			}
			li {
				&.active {
					>.cateList {
						height: auto;
						li {
							&.active {
								>.cateList {
									height: auto;
								}
							}
						}
					}
				}
				>.cateList {
					height: 0;
					overflow: hidden;
					h6 {
						padding-left: 0.64rem;
						// &.current-sel:before {
						// 	left: 0.15rem;
						// }
					}
					>li {
						>.cateList {
							height: 0;
							overflow: hidden;
							h6 {
								padding-left: 0.94rem;
								// &.current-sel:before {
								// 	left: 0.45rem;
								// }
							}
						}
					}
				}
			}
		}
		.left-arrow {
			position: absolute;
			right: 0.32rem;
			top: 50%;
			display: block;
			width: 0.18rem;
			height: 0.24rem; 
			margin-top: -0.12rem;
			background: url('../../../static/img/shunfeng_signs.png') no-repeat;
			background-size: 254%;
			.bgPosition(@signsWidth, @signsHeight, 14, 31, 0, 123);	
		}
	}
</style>