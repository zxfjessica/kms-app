<template>
	<div class="sel-admin-wrapper">
		<mt-header :title="type == 'friends' ? '选择好友' : '选择管理员'" class="is-fixed">
			<div slot="left">
			    <mt-button icon="back" @click="panelHandler"></mt-button>
			</div>
			<mt-button slot="right" 
				icon="search" 
				style="text-align:right" 
				@click.stop="searchEmphandler"
				v-show="!searchPanel">
			</mt-button>
			<div v-show="searchPanel"
				slot="right">
				<div class="search-wrapper">
					<div class="mint-search">
						<div class="mint-searchbar">
							<div class="mint-searchbar-inner">
								<form action="javascript:void(0)" style="width:100%">
									<i class="icon-search" 
										@click="selHandler"
										:class="{'text-center':textCenter}"
										v-if="value==''&&textCenter"></i>
									<input type="search" 
										v-model="value" 
										placeholder="请输入..." 
										class="mint-searchbar-core" 
										:class="{'text-center':value==''&&textCenter}" 
										@keypress="searchBegin"
										ref="search" id="searchEmp">
								</form>
								
								<i class="icon-search" @click="selHandler" v-show="value!=''||!textCenter"></i>
							</div>
							<span class="mint-searchbar-cancel" v-if="value" @click="cancelHandler">取消</span>
						</div>
					</div>
				</div>
			</div>
		</mt-header>
		<!-- <div class="scroll-box"> -->
		<section class="friend-list-wrapper container" :class="{'limit-height': isChoose}" @click.stop.prevent="searchPanel = false">
			<div class="ctn-wrapper" ref="ctnWrapper">
				<ul class="friend-list"
					v-infinite-scroll="selLoadMoreHandler"
			 		infinite-scroll-disabled="selEmpAllLoad"
			 		infinite-scroll-distance="10"
			 		infinite-scroll-immediate-check="false">
					<li v-for="item in selEmpList">
						<input  class="friend-sel" 
							    type="checkbox"  
							    :class="{'hasChecked': item.checked}"
								@click="empCheckHandler(item)" 
								:value="type == 'friends'?item.userId:item.empNumber"
								:data-img="$global().imgHost + item.headPath"/><!-- selectedList.indexOf(item.empNumber) >= 0 -->
						<div class="portrait">
							<img :src="$global().imgHost + item.headPath" alt=""/>
						</div>
						<div class="info">
							<p>名称：<span>{{type == 'friends'?item.userName:item.name}}</span></p>
							<p>部门：<span>{{item.deptName}}</span></p>
						</div>
						<span class="num">{{type == 'friends'?item.userId:item.empNumber}}</span>
					</li>
				</ul>
				<p class="loadtips"
					v-show="!selEmpAllLoad">加载中……</p>
				<p class="loadtips"
					v-show="selEmpAllLoad">没有更多数据了！</p>
			</div>
		</section>
		<footer v-if="isChoose">
			<div class="swiper-container">
		        <div class="swiper-wrapper" ref="sliderBar">
		            <div class="swiper-slide" v-for="item in checkedEmpImgArr">
		            	<i><img :src="$global().imgHost + item" alt=""></i>
		            </div>
		        </div>
			</div>
			<span class="finish" @click="panelHandler">完成</span>
		</footer>
	</div>
</template>
<script>
	import Swiper from '../../plugins/swiper/swiper.min';
	import {Toast} from 'mint-ui';
	export default {
		name: 'myFriend',
		data() {
			return {
				value: '',
				searchPanel: false,
				checkedEmpIdArr: [],
				checkedEmpImgArr: [],
				selEmpList: [],
				selEmpTotalPage: 0,
				selEmpPageNo: 0,
				selEmpAllLoad: false,
				selEmpFirstAllLoad: false,
				selectedList: ''

			}
		},
		props: {
			selEmpKind: {
				type: String
			},
			isChoose: {//是否显示底部选中条
				type: Boolean,
				default: false
			},
			type: {
				type: String,
				default: 'friends'
			}
		},
		mounted(){
			/*if(this.type == 'friends'){
				this.getFriends();
			}else if(this.type == 'admins'){
				this.getAdmins();
			}*/
			this.getEmpData();
		},
		methods: {
			//数据初始化
			init(arr){
				for(let i = 0; i< arr.length; i++){
					arr[i].checked = false;
				}
				return arr;
			},
			getUrl(){
				var url;
				if(this.type == 'friends'){
					url = '/KMS-MSERVER/mymessage/friends';
				}else if(this.type == 'admins'){
					url = '/KMS-MSERVER/usermessage/user/search';
				}
				return url;
			},
			/*getFriends(){
				var url = this.getUrl();
				this.getData(url,'selEmpList','GET', {}, (parm) => {
					parm.selEmpList = parm.init(parm.selEmpList);
					parm.selEmpTotalPage = parm.totalPage;
					if (parm.selEmpPageNo >= parm.selEmpTotalPage) {
						parm.selEmpAllLoad = true;
						parm.selEmpFirstAllLoad = true;
					}
					
				});
			},*/
			getEmpData(){
				var url = this.getUrl();
				this.getData(url,'selEmpList','GET', {}, (parm) => {
					parm.selEmpList = parm.init(parm.selEmpList);
					parm.selEmpTotalPage = parm.totalPage;
					if (parm.selEmpPageNo >= parm.selEmpTotalPage) {
						parm.selEmpAllLoad = true;
						parm.selEmpFirstAllLoad = true;
					}
					
				});
			},
			adminSearchHandler(value) {// 管理员搜索函数
				this.selEmpPageNo = 0;
				this.selEmpAllLoad = false;
				//this.selEmpKind = 'admin';
				this.selEmpList = [];
				var url = this.getUrl();
				url += '?searchKey=' + value;
				this.getData(url,'selEmpList','GET', {}, (parm) => {
					parm.selEmpList = parm.init(parm.selEmpList);
					parm.selEmpTotalPage = parm.totalPage;
					if (parm.selEmpPageNo >= parm.selEmpTotalPage) {
						parm.selEmpAllLoad = true;
					}
				});
			},
			selLoadMoreHandler() {//管理员 || 好友加载更多
				//console.log(this.value);
				var url = this.getUrl();
				//if(value){
					url += '?searchKey=' + this.value || '';
				//}
				
				this.selEmpPageNo++;
				url += '&startPage=' + this.selEmpPageNo;
				this.getMoreData(url, 'selEmpList', 'selEmpTotalPage', 'selEmpPageNo', 'selEmpAllLoad');
			},
			getMoreData(url,content,totalPage,pageno,bottomAllLoaded) {
				this.$http({
					method:'GET',
					url:this.$global().host+url
				}).then(
					response => {
						if(response.status==200&&response.body.status){
							if(response.body.data){
								this[content] = this.init(this[content].concat(response.body.data));
								this[totalPage] = response.body.totalPage-1;
								if(this[pageno]>=response.body.totalPage){
									this[bottomAllLoaded] = true;
								}
							}else{
								this[content] = '找不着数据！';
							}
						}	
					},
					response =>{
						// error callback
						//console.log('error');
					}
				)
			},
			panelHandler() {
				this.$emit('panelControl');
			},
			searchEmphandler() {
				this.searchPanel = true;
				this.$refs.search.focus();
			},
			searchBegin() {
				if(event.keyCode == 13){
					this.selHandler();
				}
			},
			selHandler() {
				if (this.value == '') {
					return Toast({message: '请输入搜索内容！', duration: 1000});
				}
				this.$refs.search.blur();
				this.$refs.ctnWrapper.scrollTop = 0;
				//this.$emit('searchController', this.value);
				this.adminSearchHandler(this.value);
			},
			cancelHandler() {//取消搜索
				this.value = '';
				this.$refs.search.blur();
			},
			/*selLoadMoreHandler() {
				this.$emit('selLoadMoreController', this.value);
			},*/
			empCheckHandler(item) {//管理员选择
				item.checked = !item.checked;
				var empNumber = (this.type == 'friends')? 'userId': 'empNumber';
				if (item.checked) {
					//console.log(111);
					if(this.checkedEmpIdArr.length < 6){
						this.checkedEmpIdArr.push(item[empNumber]);
						this.checkedEmpImgArr.push(item.headPath);
					}else{
						return item.checked = false, Toast({message: '最多只能选择6个！', duration: 1000});
					}
					
				} else {
					let index = this.checkedEmpIdArr.indexOf(item[empNumber]);
					this.checkedEmpIdArr.splice(index, 1);
					let imgIndex = this.checkedEmpImgArr.indexOf(item.headPath);
					this.checkedEmpImgArr.splice(imgIndex, 1);
				}
				this.selectedList = this.checkedEmpIdArr.join(',');
				console.log(this.checkedEmpIdArr);
				this.$emit('adminCheckControl', {'admin': this.checkedEmpIdArr, 'adminImg': this.checkedEmpImgArr});
			}
		},
		watch: {
			value(val, oldVal) {
				if(oldVal && val == '' && this.searchPanel){
					//if(document.getElementById('searchEmp').value == ''){
						//this.searchFn(true);
					this.getEmpData();
					//}
				}
			},
			checkedEmpImgArr(val){
				if(val.length > 0){
					setTimeout(()=>{
						var swiper = new Swiper('.swiper-container', {
					        pagination: '.swiper-pagination',
					        slidesPerView: 8,
			        		//centeredSlides: true,
					        spaceBetween: 0,
					        freeMode: true
					    });

					}, 50);
				}
			}
		}
	}
</script>
<style lang="less">
	@import "../../css/customFn.less";
	@import '../../plugins/swiper/swiper.min.css';
	.friend-list {
		font-size: 0;
		position: relative;
		li {
			padding: 0.21rem 0;
			margin-left: 0.37rem;
			padding-left: 0.48rem;
			border-bottom: 1px solid #eee;
			position: relative;
		}
		.friend-sel {
			.appearance-clear;
			position: absolute;
			top: 50%;
			left: -0.1rem;
			width: 0.42rem;
			height: 0.42rem;
			margin-top: -0.16rem;
			border: 1px solid #ccc;
			border-radius: 3px;
			&.hasChecked {
				background: url('../../../static/img/shunfeng_signs3.png') no-repeat;
				background-size: 640%;
				.bgPosition(@signs3Width, @signs3Height, 25, 17, 0, 415);
			}
		}
		.portrait, .info {
			display: inline-block;
		}
		.portrait {
			vertical-align: top;
			img {
				width: 1.28rem;
				height: 1.28rem;
				border-radius: 50%;
			}
		}
		.info {
			font-size: 0.42rem;
			color: #ccc;
			margin: 0.1rem 0 0 0.28rem;
			span {
				color: #333;
			}
		}
		.num {
			position: absolute;
			right: 0.37rem;
			top: 0.31rem;
			font-size: 0.32rem;
		}
		.friend-list {
			margin-bottom: 1rem;
		}
		.loadtips {
			margin-top: -0.5rem;
		}
		
	}
	.sel-admin-wrapper {
		.search-wrapper {
			position: absolute;
			width: 88%;
			left: 10%;
			top: 0;
			.mint-search {
				height: 100%;
			}
			.mint-searchbar {
				padding: 9px 10px;
				background-color: transparent;
				.mint-searchbar-cancel {
					display: block;
					width: 20%;
					height: 28px;
					background-color: #ccc;
					position: absolute;
					right: 10px;
					top: 9px;
					line-height: 28px;
					text-align: center;
					color: #333;
				}
			}
		}
	}
	.friend-list-wrapper, .admin-list-wrapper {
		.ctn-wrapper {
			height: 100%;
			overflow-y: scroll;
		}
		.friend-list {
			margin-bottom: 1rem;
		}
		.loadtips {
			margin-top: -0.8rem;
		}
	}
	.sel-admin-wrapper{
		height: calc(~"100vh");
		section{
			&.limit-height{
				height: calc(~"100% - 47px - 1.2rem");
				overflow-y: auto;
			}
		}
		footer{
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 1.2rem;
			font-size: 0;
			line-height: 1.2rem;
			border-top: 1px solid #eee;
			.finish, .swiper-container{
				display: inline-block;
				float: left;
			}
			.finish{
				font-size: .4rem;
				width: 20%;
				text-align: center;
				background-color: #ff4141;
				color: #fff;
			}
			.swiper-container{
				width: 80%;
				height: 100%;
				.swiper-slide{
					//width: 1rem;
				}
				i{
					display: inline-block;
					position: relative;
					height: 1rem;
					width: 1rem;
					margin-top: .1rem;
					margin-right: .1rem;
				}
				img{
					height: 100%;
					width: 100%;
				}
				i:after{
					content: '';
					position: absolute;
					top: 0;
					right: 0;
					border: 2px solid #ff4141;
					border-radius: 50%;
				}
			}
		}
	}
</style>