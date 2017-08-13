<template>
	<div>
		<v-common-header></v-common-header>
		<div class="container consultation-detail">
			<p class="is-ready-to-show" v-if="showOnloading">加载中...</p>
			<div class="showOnloading" v-if="!showOnloading">
				<div class="scroll-box" 
					 @click.stop.prevent="hideCommmentHandler" 
					 ref="scrollBox"
					 :class="status == 0 && (!showReplyBox && !showDateBox || showReplyBox && picSelVisible) ? 'height-100' : 
							 status == 0 && (showReplyBox && !picSelVisible || showDateBox) ? 'height-12' :
							 status == 1 && (userType == 0 || consultType == 1 && userType == 1) ? 'height-55' : 'height-15'">
					<section class="consultation-content">
						<!-- 请教者问题 -->
						<div class="consultation-box">
							<header class="title">
								{{consultData.title}}
								<img v-if="(consultData.isView !=null && consultData.isView == 0 || consultData.replySecret !=null && consultData.replySecret == 0) && consultType == 2" src="../../../static/img/public.png">
							</header>
							<section>
								<div class="top clearfix">
									<span class="come fl">
										<router-link :to="'/knowledge/channelDetailSuper?empNumber=' + consultData.createId"><i>{{consultData.createName}}</i></router-link>
										
										向
										<router-link :to="'/knowledge/channelDetailSuper?empNumber=' + consultData.askedId"><i>{{consultData.askedName}}</i></router-link>
										请教
									</span>
									<span class="type fr">{{consultType == 2 ? '在线请教' : '面见请教'}}</span>
								</div>
								<div class="middle fold-control-box">
									<div class="parent-box"><!--  :class="!isUnfold ? 'fold' : 'unfold'" ref="controlHeight" -->
										<div class="child-box content-box" ref="itemHeight">
											<div v-for="item in consultData.consultComplement">
												<p v-if="item.type == 'text'">{{item.text}}</p>
												<img :src="$global().imgHost + item.src" v-if="item.type == 'image'">
											</div>
										</div>
										
									</div>
									<!-- <div class="fold-out" @click="isUnfold = true" v-if="!isUnfold && isShowControl">
										...<i>展开</i>
									</div>
									<div class="fold-out" @click="isUnfold = false" v-if="isUnfold && isShowControl">
										...<i>收起</i>
									</div> -->
									
								</div>
								<div class="bottom clearfix">
									<span class="integration fl" v-if="consultData.rewardScore > 0">
										<i class="signs4 coin-signs"></i>{{consultData.rewardScore}}
									</span>
									<span class="time fr">{{createDate}}前</span>
								</div>
							</section>
							<aside>
								<div class="tags" v-if="consultData.labels">
									<i class="signs4 tag-signs"></i>
									<span v-for="tag in consultData.labels.split(',')">{{tag}} &nbsp;</span> 
								</div>
								<!-- <div class="modify-btn" v-if="status == 0 && userType == 0">
									<router-link :to="'/knowledge/meetOnlineConsult/' + this.consultID"><i class="signs4 modify-signs"></i></router-link>
									<i v-else-if="userType == 1" class="signs4 modify-signs" @click="showReplyBox = true"></i>
								</div> -->
							</aside>
						</div>
						<!-- -专家达人未回答，专家达人 || 请教者查看 -->
						<div class="asker-check-consultation" v-if="status == 0 && userType == 0">
							<dt>
								<dl>
									<img src="../../../static/img/refuse.png">
								</dl>
								<dd>
									<div>
										<p>专家达人暂未回答</p>
									</div>
								</dd>
							</dt>
						</div>
						<!-- 专家达人在线请教回复页面 -->
						<div class="answer-box" v-if="status == 0 && consultType == 2 && userType == 1">
							<div class="not-answer-now">
								<header>请输入回答内容</header>
								<section>
									<div class="content">
										<textarea placeholder="请输入15字以上的内容" v-model="consultAnswer" @click="changeScrollTop"></textarea>
										<div class="audio-box" v-if="timeList.length > 0"><!--  -->
											<div v-for="(time, index) in timeList">
												<v-audio-item :type="'add'"
																@deleteAudio="deleteAudio(index)"
																:audioPath="audioList[index]"
																:audioTime="time.time"></v-audio-item>	
											</div>
											
										</div>
										<div class="picture-box" v-if="imageArr.length > 0">
											<span v-for="(img, index) in imageArr">
												<img :src="$global().imgHost + img">
												<i class="delete" @click="deletePic(index)"></i>
											</span>
										</div>
										<div class="answer-signs">
											<span class="signs4 audio" @click="createAudioVisible = true"></span>
											<span class="signs4 picture" @click="picSelVisible = true"></span>
										</div>
									</div>
									
								</section>
								<footer>
									<ul class="clearfix">
										<li class="public fl" :class="{'active': replyPublic}" @click="replyPublic = true"><span class="radio"></span>公开</li>
										<li class="private fl" :class="{'active': !replyPublic}" @click="replyPublic = false"><span class="radio"></span>私密</li>
									</ul>
								</footer>
							</div>
						</div>
						<!-- 专家达人面见请教回复页面 -->
						<div class="have-a-date-box" v-if="status == 0 && consultType == 1 && showDateBox || status != 0 && userType!= 1 && showGrantBox">
							<v-message-box  :width="status == 2 ? 60 : 70">
								<div slot="title">
									<div v-if="status == 0 && !isRefuseDate">请填写一下信息，方便请教者与您联系</div>
									<div v-else-if="status == 0 && isRefuseDate">拒绝的理由</div>
									<div v-else-if="userType!= 1">赏积分</div>
								</div>
								<div slot="content">
									<div class="content" v-if="status == 0 && !isRefuseDate">
										<div class="phone">
											<label for="phoneNumber">手机号</label>
											<input v-model="datePhone" name="phoneNumber" id="phoneNumber"/>
										</div>
										<div class="adress">
											<label for="adress">见面地址</label>
											<input v-model="dateAdress" name="adress" id="adress"/>
										</div>
										<div class="remarks">
											<label for="remarks">备注</label>
											<textarea v-model="dateRemark" name="remarks" id="remarks">
												
											</textarea>
										</div>
										
									</div>
									<div class="content" v-else-if="status == 0 && isRefuseDate">
										<div class="cause">
											<textarea v-model="dateRefuseCause" placeholder="请输入拒绝理由"></textarea>
										</div>
									</div>
									<div class="content" v-else-if="userType!= 1">
										<div class="give-grant">
											<input v-model="grantScore" placeholder="请输入积分"/>
										</div>
										<div class="tips">
											可用积分{{consultData.scoreCount}}, 最高可悬赏100积分
										</div>
									</div>
								</div>

								<span v-if="status == 0" slot="confirm" @click="confirmDateData(isRefuseDate)">确定</span>
								<span v-if="status == 0" slot="cancel" @click="showDateBox = false">取消</span>

								<span v-if="userType!= 1" slot="confirm" @click="confirmGrantData(grantScore)">确定</span>
								<span v-if="userType!= 1" slot="cancel" @click="showGrantBox = false">取消</span>
								
							</v-message-box>
						</div>
						<!-- 2请教者 || 被请教者查看面见请教结果 || 查看在线请假-->
						<div class="asker-express-box" v-if="status == 1 || status == 2">
							<header class="answer-info clearfix">
								<span class="picture">
									<router-link :to="'/knowledge/channelDetailSuper?empNumber=' + consultData.askedId"><img :src="$global().imgHost + consultData.headPath"></router-link>
									<i class="signs4 class-signs" 
										v-if="consultData.master == 1 || consultData.experFlag == 1"
										:class="consultData.master == 1 ? 'king-signs' : consultData.experFlag == 1 ? 'v-signs': ''"></i>
								</span>
								<span class="name fl">{{consultData.askedName}}</span>
								<span class="time fr">{{replyDate}}前</span>
							</header>
							<section>
								<div class="consultation-result">
									<!-- 请教者和被请教者查看面见请教结果 -->
									<div class="answer-result" v-if="consultType == 1 && userType != 2">
										<div class="refuse" v-if="consultData.isMeeting == 0">
											<span v-if="userType == 0">啊哦，<i>{{consultData.askedName}}</i>拒绝了您的面见请教</span>
											<span v-else-if="userType == 1">您拒绝了<i>{{consultData.createName}}</i>的面见请教</span>
											<p>理由是： {{consultData.note}}</p>
										</div>
										<div class="agree" v-if="consultData.isMeeting == 1">
											<p>
												<span v-if="userType == 0">恭喜你! <i>{{consultData.askedName}}</i>同意你的面见请教，面见后记得回来评价哦~</span>
												<span v-else-if="userType == 1">您同意了<i>{{consultData.createName}}</i>的面见请教。您留给请教者的信息如下：</span>
											</p>
											<ul>
												<li class="clearfix">
													<i class="fl">手机号码：</i>
													<span class="fl">{{consultData.expertPhone}}</span>
												</li>
												<li class="clearfix">
													<i class="fl">面见地址：</i>
													<span>{{consultData.meetingAddress}}</span>
												</li>
												<li class="clearfix">
													<i class="fl">备注：</i>
													<span class="fl">{{consultData.note}}</span>
												</li>
											</ul>
										</div>
									</div>
									<!-- 在线请教结果 -->
									<div class="answer-result" v-if="consultType == 2">
										<div class="quesition fold-control-box">
											<div class="parent-box"><!--  :class="!isUnfoldGood ? 'fold' : 'unfold'" ref="controlHeightGood" -->
												<div class="child-box content-box"><!--  ref="itemHeightGood" -->
													<div v-for="item in replyContent" class="reply-item">
														<p v-if="item.type == 'text'">{{item.text}}</p>
														<!-- <img :src="$global().imgHost + item.src" v-if="item.type == 'image'"> -->
														<div class="img-wrapper">
															<img class="preview-img"  
																 @click="$preview.open(item.index, replyPicList)" 
																 :src="item.src"
																 v-if="item.type == 'image'">
														</div>
														
														<!-- <v-audio-item :type="'show'"
																		:audioPath="item.src"
																		:audioTime="item.time"
																		 v-if="item.type == 'audio'"></v-audio-item> -->
														<audio controls="controls" v-if="item.type == 'audio'" class="audio-item">
															<source :src="$global().imgHost + item.src" type="audio/aac" />
															不支持
														</audio>
													</div>
												</div>
											</div>
											<!-- <div class="fold-out" @click="isUnfoldGood = true" v-if="!isUnfoldGood && isShowControlGood">
												...<i>展开</i>
											</div>
											<div class="fold-out" @click="isUnfoldGood = false" v-if="isUnfoldGood && isShowControlGood">
												...<i>收起</i>
											</div> -->
											
											
										</div>
									</div>
									<section>
										<div class="show-asker-expression" v-if="status == 2 && userType != 2">
											<span>提问者评价</span>
											<p class="clearfix">
												<v-star class="fl" 
														:totalStar="5" 
														:score="consultData.commentStar + ''"></v-star>  
												<i class="fl">{{consultData.commentStar}}分</i> 
												<i class="fl">{{
														consultData.commentStar == 5 ? '太棒了': 
													  	consultData.commentStar == 4 ? '不错哦': 
													  	consultData.commentStar == 3 ? '还行吧': 
													  	consultData.commentStar == 2 ? '较糟糕' : '很差'
												}}</i>
											</p>
											<div class="content-box">
												<div v-for="item in consultData.evaluationContent">
													<p v-if="item.type == 'text'">{{item.text}}</p>
													<img :src="$global().imgHost + item.src" v-if="item.type == 'image'">
												</div>
											</div>
											
										</div>
										<div v-if="consultType == 2 && (status == 1 && userType != 0 || status == 2)">
											<dt>
												<dl>
													<div v-if="isGrant || userType == 1">
														<img src="../../../static/img/coin.png">
														<span v-if="userType == 1">{{consultData.totalRewardScore || 0}}</span>
														<span v-else>{{consultData.userRewardScore}}</span>
													</div>
													<div v-else @click="showGrantBox = true">
														<i>赏</i>
													</div>
												</dl>
												<dd>已有{{totalGrantSize}}人打赏</dd>
											</dt>
											<div class="swiper-container" v-if="!grantList.length == 0">
										        <div class="swiper-wrapper" ref="sliderBar" @touchend="loadMoreGrants">
										            <div class="swiper-slide" v-for="grant in grantList">
										            	<router-link :to="'/knowledge/channelDetailSuper?empNumber=' + grant.empNumber"><img :src="$global().imgHost + grant.headPath"></router-link>
										            </div>
										        </div>
											</div>
											<div class="thumbUp">
												<i class="signs4 thumbUp-signs"></i>
												{{totalPraise || 0}}
											</div>
										</div>
										
									</section>
									<aside v-if="consultType == 2 && (status == 1 && userType != 0 || status == 2)">
										<v-detail-comment-lists @replyControl="replyParent"
																:id="consultID"
																:isToGetData="isToGetData"
																:type="'consult'"
																@watchIsToGetData="initIsToGetData"></v-detail-comment-lists>
									</aside>
								</div>
							</section>
						</div>
						<!-- 打开相册选项 -->
						<mt-popup v-model="picSelVisible"
						  		  position="bottom"
						  		  :closeOnClickModal="false"
						  		  class="choose-pics-box">
							<v-pic-sel  @picSelControl="picSelVisible = false"
										@picSelSuccessControl="successToGetPic"></v-pic-sel>
						</mt-popup>
						<!-- 打开录音 -->
						<mt-popup
						  v-model="createAudioVisible"
						  v-if="createAudioVisible"
						  popup-transition="popup-fade"
						  :closeOnClickModal="false"
						  class="record-audio-box">
						  <v-select-audio @closeAudio="createAudioVisible=false"
								 		  @finishRecord="finishRecord"></v-select-audio>
						</mt-popup>
					</section>
				</div>
				
				<footer class="consultation-footer">
					<!-- 在线请教回复 -->
					<div class="submit-answer btn" @click="submitAnswer" v-if="status == 0 && consultType == 2 && userType == 1 && !picSelVisible">提交</div>
					<!-- 面见请教回复 -->
					<div class="have-a-date-btn btn" v-if="status == 0 && consultType == 1 && userType == 1">
						<ul class="clearfix">
							<li class="fl" :class="{'active': !isRefuseDate}" @click="isRefuseDate = false, showDateBox = true">同意见面</li>
							<li class="fl" :class="{'active': isRefuseDate}" @click="isRefuseDate = true, showDateBox = true">拒绝见面</li>
						</ul>
					</div>
					<!-- 1 未评价 -->
					<div class="asker-write-expression" v-if="status == 1 && userType == 0">
						<div class="top clearfix">
							<span class="fl">你的评价</span>
							<span class="fl">
								<v-star :totalStar="5" :integer="true" :touchOnOff="true" @watch="showExpressNum"></v-star>
							</span>
							<span class="fl">{{askerExpressNum}}分 {{
								askerExpressNum ==5 ? '太棒了': 
							  	askerExpressNum ==4 ? '不错哦': 
							  	askerExpressNum ==3 ? '还行吧': 
							  	askerExpressNum ==2 ? '较糟糕' : '很差'
							}}</span>
						</div>
						<div class="middle">
							<textarea v-model="askerExpression" placeholder="请输入评价内容不少于15字"></textarea>
							<p>{{askerExpression.length}}/200</p>
						</div>
						<div class="submit-answer btn" @click="sendExpression" v-if="status == 1 && userType == 0">发送</div>
					</div>
					
				</footer>
				<!-- 评论列表 -->
				<div class="tool-bars" v-if="consultType == 2 && (status == 1 && userType != 0 || status == 2)">
					<div class="oper-icon-wrapper" v-if="!commentBlockVisiable">
						<v-bottom-option :type="'consult'"
										 :id="consultID"
										 :isCollection="consultData.hasCollected" 
									 	 :hasPraise="consultData.isPraise" 
									 	 @watchTotalPrise="watchTotalPrise"
										 @commentControl="commentHandler">
						</v-bottom-option>
					</div>
					<div class="comment-block" v-if="commentBlockVisiable">
						<v-comment-box  @sendControl="sendHandler" 
										:replyName="replyName"></v-comment-box>
					</div>
				</div>
			</div>
			
		</div>
	</div>
</template>
<script>
import { Toast, MessageBox, Indicator } from 'mint-ui';
import commonHeader from '../../components/commonHeader.vue';
import Star from '../../components/list/Star.vue';
import Swiper from '../../plugins/swiper/swiper.min';
import detailCommentLists from '../../components/knowledgeDetail/detailCommentLists.vue';
import bottomOption from '../../components/knowledgeDetail/detailBottomOption.vue';
import commentBox from '../../components/knowledgeDetail/detailCommentBox.vue';
import messageBox from '../../components/common/messageBox.vue';
import picSelTip from '../../components/channelList/picSelTip.vue';
import audioSelTip from '../../components/channelList/audioSelTip.vue';
import audioItem from '../../components/common/audioItem.vue';
import { resetPicAndAudioOrder } from '../../js/commonFunction.js';
export default{
	components: {
		'v-common-header': commonHeader,
		'v-star': Star,
		"v-detail-comment-lists": detailCommentLists,
		"v-bottom-option": bottomOption,
		"v-comment-box": commentBox,
		"v-message-box": messageBox,
		'v-pic-sel': picSelTip,
		'v-select-audio': audioSelTip,
		'v-audio-item': audioItem
	},
	data(){
	/*status：
	    0 专家未答&&请教者查看 ||专家回答页; 
		1 专家查看面见请教；
		2 请教者未评价，查看面见请教结果; 
		3 请教者未 || 已评价，普通人查看在线请假结果 

	consultID：
		1090 在线请教已完成  普通人 2
		500  在线请教没有回复 创建者 0
		501  在线请教有回复 创建者 1
		502  已经评价的请教
		504  同意面见请教
		1248 在线请教没有回复的 
		1249 面见请教没有回复的 

		更改登陆用户
		userIdForLogin=833257
	*/
		return{
			showOnloading: true,
			replyPublic: 1,//公开1 || 私密0
			consultType: 1,//在线请教1 || 面见请教2
			isReply: 1, //专家是否已回答1 || 0
			isExpress: 1, //请教者是否已经评价 1 || 0
			status: 0,  //0未回复  1未评价  2已完成
			isGrant: true, //普通人是否已经打赏 true || false
			isRefuseDate: false,//专家是否拒绝面见 true || false
			showDateBox: false,//是否显示 面见请教弹窗
			showGrantBox: false,//是否显示打赏积分弹窗
			showReplyBox: false,//是否显示专家在线请教回复框
			datePhone: '',//面见请教专家同意面见电话
			dateAdress: '',//面见请教专家同意面见地址
			dateRemark: '',//面见请教专家同意面见备注
			dateRefuseCause: '',//面见请教专家拒绝
			consultAnswer: '',//在线请教专家回复
			askerExpressNum: 0,
			askerExpression: '',
			commentBlockVisiable: false,
			consultID: '',//'1090',
			loginID: '000017',
			consultData: {},
			userType: 0, // 0 请教者； 1被请教者；2其他人
			createDate: '',//创建日期
			replyDate: '',//回复日期
			grantList: [], //打赏列表
			totalGrantSize: 0,
			totalPraise: 0,//总点赞数
			isPrise: 0,//是否点赞
			isReplyParent: false,//是否是回复评论true || 评价请教false
			replyName: '',//评论回复的对象
			replyId: '',//评论回复的ID
			isToGetData: '',//发送评论之后的请求对象
			isUnfold: false,//展开 | 收起
			isShowControl: false,//是否显示展开按钮
			isUnfoldGood: false,
			isShowControlGood: false,
			picSelVisible: false, //打开相册
			imageArr: [],
			createAudioVisible: false, //录音
			grantPage: -1,
			grantTotalPage: 0,
			grantLoading: false,
			timeList: [],
			audioList: [],//上传成功之后返回的服务器的录音地址
			replyContent: [],
			replyPicList: [],
			grantScore: ''
		}
	},
	mounted(){
		var that = this;
		this.consultID = this.$route.params.ID;
		this.getConsultationData();
	},
	methods: {
		getConsultationData(){//获取请教详情信息
			var that = this;
			that.$http({
				method: 'GET',
				url: this.$global().host + '/KMS-MSERVER/consult/view/' + that.consultID/*+'?userIdForLogin=' + that.loginID*/
			}).then(
				response =>{
					that.showOnloading = false;
					if(response.body.errorMessage){
						return MessageBox({
							title: '',
							message: response.body.errorMessage,
							confirmButtonText: '返回',
							showCancelButton: false,
							closeOnClickModal: false
						}).then((response)=>{
							that.$router.go(-1);
						});
					}
					if(response.body.status == 1){
						that.consultData = response.body.data;
						that.consultType = that.consultData.consultType;
						if(that.consultData.empNumber == that.consultData.createId){
							that.userType = 0;//请教者
						}else if(that.consultData.empNumber == that.consultData.askedId){
							that.userType = 1;//被请教者
						}else{
							that.userType = 2;//其他人
						}
						that.status = that.consultData.status;
						that.isGrant = that.consultData.hasReward;
						that.isPrise = that.consultData.isPraise;
						that.totalPraise = that.consultData.totalPraise;
						that.createDate = that.formatDate(that.consultData.createDate);
						that.replyDate = that.formatDate(that.consultData.replyDate);

						//在线请教回复音频置顶
						if(that.consultData.replyContent && that.consultData.replyContent.length > 0){
							var data = resetPicAndAudioOrder(that.consultData.replyContent, that);
							this.replyContent = data.audioList;
							this.replyPicList = data.picArr;
						}
						//that.replyContent = that.consultData.replyContent;

						if(this.consultType == 2 && (this.status == 2 || this.status == 1 && this.userType != 0)){
							that.getGrants(0);
						}

					}
					
				}
			);
		},
		getGrants(type){//获取打赏人列表
			var url;
			url = '/KMS-MSERVER/reward/list?contentId=' + this.consultID + '&&contentType=consult&&pageSize=10'

			if(type == 'concat'){
				this.grantPage ++;
				url += '&&startPage=' + this.grantPage;
			}
			this.$http({
				method: 'GET',
				url: this.$global().host + url
			}).then(
				response =>{
					this.grantTotalPage = response.body.totalPage;
					this.grantPage = response.body.currentPage;
					if(!type){
						this.grantList = response.body.data;
					}else if(type == 'concat'){
						this.grantList = this.grantList.concat(response.body.data);
					}
					
					this.totalGrantSize = response.body.totalSize;
					setTimeout(()=>{
						var swiper = new Swiper('.swiper-container', {
					        pagination: '.swiper-pagination',
					        slidesPerView: 8,
			        		//centeredSlides: true,
					        spaceBetween: 0,
			        		freeMode: true
					    });

					}, 500);
				}
			)
		},
		loadMoreGrants(){
			//console.log(this.$refs.sliderBar.querySelectorAll('.swiper-slide'));
			if(!this.grantLoading){
				if((this.grantTotalPage - 1) == this.grantPage){
					this.grantLoading = true;
					return Toast({message: '数据加载完了！', duration: 1000});
				}
				if(this.$refs.sliderBar.querySelectorAll('.swiper-slide').length >= 10 * (this.grantPage + 1)){
					this.getGrants('concat');
				};
			}else{
				return;
			}
			//console.log(this.$refs.sliderBar.querySelectorAll('.swiper-slide').length);
			
		},
		confirmGrantData(grant){//打赏积分
			if(!grant){
				return Toast({message: '请输入积分！', duration: 1000});
			}
			
			this.$http({
				method: 'GET',
				url: this.$global().host + '/KMS-MSERVER/reward/toReward?objectId=' + this.consultID + '&&objectType=consult&&userId=' + this.consultData.askedId + '&&userName=' +this.consultData.askedName + '&&rewardScore=' + grant
			}).then(
				response =>{
					if(response.body.status == 1){
						this.consultData.userRewardScore = grant;
						this.showGrantBox = false;
						this.isGrant = true;
						Toast({message: '积分已赏', duration: 1000});
						this.getGrants(0);
					}
					
				}
			)
			
		},
		watchTotalPrise(val){//获取总点赞数
			this.totalPraise = val;
		},
		successToGetPic(parm){//添加图片
			console.log(parm);
			this.imageArr.push(parm);
			this.picSelVisible=false;
		},
		deletePic(index){
			MessageBox.confirm('删除后将不可恢复，确定删除第'+ (index + 1) +'个图片?').then(action => {
				console.log(action);
			  	if(action == 'confirm'){
			  		this.imageArr.splice(index, 1);
			  	}
			},action=>{
				console.log(action);
			});
		},
		finishRecord(time, result) {//获取录音时间和路径
			console.log(time);
			this.timeList.push(time);
			this.audioList.push(result);
			console.log(this.audioList);
			console.log(this.timeList);
			/*this.recordTime = time;
			this.recordPath = result;*/
			this.createAudioVisible = false;
		},
		deleteAudio(index){
			//if(index){
				MessageBox.confirm('删除后将不可恢复，确定删除第'+ (index + 1) +'个音频?').then(action => {
					console.log(action);
				  	if(action == 'confirm'){
				  		this.timeList.splice(index, 1);
				  		this.audioList.splice(index, 1);
				  	}
				},action=>{
					console.log(action);
				});
			//}
		},
		initIsToGetData(){//初始化请求评论的对象
			//console.log('initIsToGetData');
			this.isToGetData = '';
		},
		replyParent(id, commenterName){//点击评论回复初始化输入框
			//console.log(id);
			//console.log(commenterName);
			this.replyId = id;
			this.replyName = commenterName;
			this.isReplyParent = true;
			this.$nextTick(()=>{
				this.commentBlockVisiable = true;
			});
			
		},
		formatDate(source){//格式化时间
			//console.log(source);
			source = source || new Date();
			let date = (new Date() - source) / 1000;
			let target;
			if(date >= (60 * 60 * 24 * 365)){
				//console.log('年');
				target = parseInt(date / (60 * 60 * 24 * 365)) + '年';
			}else if(date >= (60 * 60 * 24)){
				//console.log('天');
				target = parseInt(date / (60 * 60 * 24)) + '天';
			}else if(date >= (60 * 60)){
				//console.log('时');
				target = parseInt(date / (60 * 60)) + '小时';
			}else if(date >= 60){
				//console.log('分');
				target = parseInt(date / 60) + '分钟';
			}else{
				//console.log('秒');
				target = parseInt(date) + '秒';
			}
			return target;
		},
		submitAnswer(){//专家提交在线请教回答
			if(this.consultAnswer.length < 15 && this.audioList.length == 0 && this.imageArr.length == 0){
				return Toast({message: '回复内容不能少于15字！'});
			}
			var audioAndTime = [];
			for(let i = 0; i<this.audioList.length; i++){
				let item = this.audioList[i] + '_' + this.timeList[i].time;
				audioAndTime.push(item);
			}
			console.log(audioAndTime);
			//http://10.202.4.75:8180/KMS-MSERVER/consult/reply/{id}
			var url = '/KMS-MSERVER/consult/reply/' + this.consultID;
			url += '?replyContent=' + this.consultAnswer;
			url += '&&replySecret=' + this.replyPublic;
			url += '&&audios=' + audioAndTime.join(',');
			url += '&&images=' + this.imageArr.join(',');
			console.log(url);
			Indicator.open('正在提交...');
			this.$http({
				method: 'GET',
				url: this.$global().host + url
			}).then(response=>{
				Indicator.close();
				if(response.body.status == 1){
					Toast({message: '回复成功!', duration: 1000});
					this.getConsultationData();
				}
			});
			
		},
		confirmDateData(type){//专家回复面见请教
			//console.log(type);
			if(!type){
				if(!this.datePhone){
					return Toast({message: '请填写手机号码！', duration: 1000});
				}
				//http://10.202.4.75:8180/KMS-MSERVER/consult/agree-meething
				var url = '/KMS-MSERVER/consult/agree-meething';
				url += '?id=' + this.consultID;
				url += '&&expertPhone=' + this.datePhone;
				url += '&&meetingAddress=' + this.dateAdress;
				url += '&&note=' + this.dateRemark;
				//console.log(url);
				this.$http({
					method: 'GET',
					url: this.$global().host + url
				}).then(response=>{
					this.showDateBox = false;
					if(response.body.status == 1){
						Toast({message: '您已同意面见请教', duration: 1000});
						this.getConsultationData();//刷新页面
					}
				});
				
			}else{
				if(!this.dateRefuseCause){
					return Toast({message: '请填写拒绝理由！', duration: 1000});
				}
				//http://10.202.4.75:8180/KMS-MSERVER/consult/refuse-meething/{id}
				var url = '/KMS-MSERVER/consult/refuse-meething/' + this.consultID;
				url += '?note=' + this.dateRefuseCause;
				//console.log(url);
				this.$http({
					method: 'GET',
					url: this.$global().host + url
				}).then(response=>{
					this.showDateBox = false;
					if(response.body.status == 1){
						Toast({message: '您已拒绝面见请教', duration: 1000});
						this.getConsultationData();//刷新页面
					}
				});
			}
		},
		sendExpression(){//请教者发送评价
			var that = this;
			if(!that.askerExpressNum){
				return Toast({message: '请评分！', duration: 1000});
			}
			if(!that.askerExpression){
				return Toast({message: '请输入评论！', duration: 1000});
			}
			if(that.askerExpression.length < 15){
				return Toast({message: '评价内容不能少于15字！', duration: 1000});
			}

			var url = that.$global().host + '/KMS-MSERVER/consult/appraise/' + that.consultID;
			that.$http({
				method: 'GET',
				url:  url + '?evaluationContent=' + that.askerExpression + '&&commentStar=' + Number(that.askerExpressNum)
			}).then(response=>{
				//console.log(response.body);
				if(response.body.status == 1){
					Toast({message: '评价成功！', duration: 1000});
					this.getConsultationData();
				}
			});
		},
		showExpressNum(val){//监测获取评分的设置分数
			this.askerExpressNum = val;
		},
		commentHandler() {//点击显示评论输入框
			this.isReplyParent = false;
			this.commentBlockVisiable = true;
		},
		hideCommmentHandler(eve){//点击页面隐藏评论输入框
			//console.log(111);
			this.replyId = '';
			this.replyName = '';
			this.isReplyParent = false;
			this.commentBlockVisiable = false;
		},
		sendHandler(content) {//发送 请教评论 || 回复评论	
			//console.log(content);
			//评论请教
			if(!this.isReplyParent){
				if(content.length > 2000){
					return Toast({message: '评论内容不能超过2000字！', duration: 1000});
				}
				//console.log('评论请教');
				var url = '/KMS-MSERVER/comment/consult/save';

				var str = "commentContent="+ content+"&contentId=" + this.consultID;

				this.$http.post(this.$global().host + url, str).then(
					response =>{
						if(response.body.status == 1){
							Toast({message: '评论成功！', duration: 1000});
							//this.getExpressions(0);
							this.isToGetData = response.body.data;
						}
					}
				);
			}else{
				//http://10.202.4.75:8180/KMS-MSERVER/comment/{contentType}/saveReply						
				//回复评论
				//console.log('回复评论');
				if(content.length > 500){
					return Toast({message: '回复内容不能超过500字！', duration: 1000});
				}
				var url = '/KMS-MSERVER/comment/consult/saveReply'

				var str = "commentContent="+ content+"&parentId=" + this.replyId;

				this.$http.post(this.$global().host + url, str).then(
					response =>{
						if(response.body.status == 1){
							Toast({message: '回复成功！', duration: 1000});
							//this.getChildExpressions(this.replyId);
							this.isToGetData = 'child';
						}
					}
				);
			}	
		},
		changeScrollTop(){
			this.$refs.scrollBox&&(this.$refs.scrollBox.scrollTop += 500);
		}
	},
	watch: {
		askerExpression(val, oldVal){//请教者评论内存长度监视
			if(val.length > 200){
				return this.askerExpression = oldVal, Toast({message: '评价内容不能输入超过200字！', duration: 1000});
			}
		},
		grantScore(val, oldVal){
			//console.log(val);
			if(this.consultData.scoreCount > 100){
				if(parseInt(val) > 100){
					return this.grantScore = 100,  Toast({message: '打赏最多不能超过100积分！', duration: 1000});
				}
			}else{
				if(parseInt(val) > this.consultData.scoreCount){
					return this.grantScore = this.consultData.scoreCount,  Toast({message: '打赏最多不能超过自己的积分！', duration: 1000});
				}
			}
			
		}/*,
		consultData(val){//初始化时判断显示展开按钮
			var that = this;
			setTimeout(function(){
				//专家回复
				if(that.$refs.itemHeightGood){
					if(that.$refs.itemHeightGood.clientHeight > that.$refs.controlHeightGood.clientHeight){
						that.isShowControlGood = true;
					}else{
						that.isShowControlGood = false;
					}
				}
				
				//请教者请教问题
				if(that.$refs.itemHeight){
					if(that.$refs.itemHeight.clientHeight > that.$refs.controlHeight.clientHeight){
						that.isShowControl = true;
					}else{
						that.isShowControl = false;
					}
				}
				
			},50);
		}*/
	}
}
</script>
<style lang="less">
@import '../../plugins/swiper/swiper.min.css';
@import "../../css/customFn.less";
	.consultation-detail{
		input, textarea{
			font-family: Microsoft YaHei;
			border: 1px solid #eee;
			appearance: none;
			-webkit-appearance: none;
		}
		textarea{
			resize: none;
			font-size: .35rem;
			color: #999;
			box-shadow:0px 0px 0px rgba(0,0,0,0);
		}
		.showOnloading{
			height: 100%;
		}
		.content-box{
			img{
				width: 100%;
				margin-top: .2rem;
			}
		}
		.choose-pics-box{
			height: calc(~"1.173rem * 3 + 0.1rem + 1px");
		}
		.record-audio-box {
			width: 90%;
			bottom: -1rem;
			top: auto;
			margin-right: 10%;
		}
		.scroll-box{
			&.height-100{
				height: 100%;
			}
			&.height-15{
				height: calc(~"100% - 1.5rem");
			}
			&.height-12{
				height: calc(~"100% - 1.2rem");
			}
			&.height-55{
				height: calc(~"100% - 5.6rem");
			}
			overflow-y: auto;
			/*.consultation-content{
				margin-bottom: 50px;
			}*/
		}
		/*.fold-control-box{
			.parent-box{
				max-height: 10rem;
				line-height: .5rem;
				&.fold{
					max-height: 10rem;
					overflow: hidden;
				}
			}
			.unfold{
				overflow: visible;
				max-height: none;
			}
			.fold-out{
				color: #999;
				font-size: .35rem;
				i{
					margin-left: 3px;
					color: #188eee;
				}
			}
		}*/
		.consultation-box{
			background-color: #fff;
			padding-left: 3.6%;
			
			header.title{
				position: relative;
				padding-right: 3.6%;
				font-size: 0.427rem;
				padding: .3rem 3.6% .3rem 0;
				border-bottom: 1px solid #eee;
				img{
					position: absolute;
					bottom: -0.4rem;
					right: 3.6%;
					width: 1.5rem;
				}
			}
			section{
				padding: 3.6% 0;
				padding-right: 3.6%;
				font-size: 0.373rem;
				color: #999;
				border-bottom: 1px solid #eee;
				.top{
					margin-bottom: .3rem;
					font-size: 0.32rem;
					i{
						color: #188eee;
						font-size: 0.347rem;
					}
				}
				.middle{
					word-wrap: break-word;
					text-align: justify;
				}
				.bottom{
					margin-top: .3rem;
					text-align: right;
					font-size: 0.32rem;
					.integration{
						color: #ff9223;
						.coin-signs:before{
							background-size: 140%;
							height: 0.5rem;
							.bgPosition(@signs4Width, @signs4Height, 31, 24, 0, 402);

						}
					}
				}
			}
			aside{
				font-size: .347rem;
				color: #ccc;
				.tags{
					padding: .5rem 0;
					padding-right: 3.6%;
					border-bottom: 1px solid #eee;
					
					.tag-signs:before{
						background-size: 140%;
						height: 20px;
						top: -0.05rem;
						.bgPosition(@signs4Width, @signs4Height, 30, 30, 0, 568);

					}
				}
				.modify-btn{
					line-height: 1.4rem;
					text-align: center;
					.modify-signs:before{
						background-size: 140%;
						height: 0.8rem;
						top: -0.1rem;
						.bgPosition(@signs4Width, @signs4Height, 44, 44, 0, 608);

					}
				}
			}
		}
		.asker-check-consultation{
			padding: 3.6% 3.6% 6%;
			margin-top: .3rem;
			background-color: #fff;
			text-align: center;
			color: #ccc;
			font-size: .35rem;
			dt{
				dl{
					img{
						width: 2.3rem;
					}
				}
				dd{
					margin-top: .1rem;
					p{
						line-height: .6rem;
					}
				}
			}
		}
		.answer-box{
			margin-top: .3rem;
			.not-answer-now{
				header{
					padding: 0 3.6%;
					font-size: 0.42rem;
					line-height: 1.2rem;
					background-color: #fff;
				}
				section{
					padding: 0 3.6% 3.6%;
					background-color: #fff;
					color: #999;
					.content{
						border: 1px solid #eee;
						padding: 5px;
						textarea{
							width: 100%;
							height: 2rem;
							border: none;
						}
						.answer-signs{
							text-align: right;
							line-height: 0.6rem;
							span.audio, .picture{
								padding-left: .6rem;
								&:before{
									width: .6rem;
									height: .5rem;
								}
							}
							span.audio:before{
								background-size: 220%;
								.bgPosition(@signs4Width, @signs4Height, 15, 25, 0, 27);
							}
							span.picture:before{
								background-size: 160%;
								.bgPosition(@signs4Width, @signs4Height, 44, 32, 0, 1656);
							}
							.length{
								margin-left: .2rem;
							}
						}
						.audio-box{
							margin-bottom: .2rem;
							line-height: .8rem;
							font-size: .38rem;
							border-bottom: 1px solid #eee;
							
							
						}
						.picture-box{
							padding-bottom: .2rem;
							margin-bottom: .2rem;
							border-bottom: 1px solid #eee;
							font-size: 0;
							span{
								display: inline-block;
								position: relative;
								height: .8rem;
								width: .8rem;
								margin-top: .2rem;
								margin-right: .1rem;
								img{
									height: 100%;
									width: 100%;
								}
								i{
									position: absolute;
									top: -0.2rem;
									right: -0.2rem;
									height: .4rem;
									width: .4rem;
									background-size: 300%;
									background-image: url(../../../static/img/shunfeng_signs4.png);
									.bgPosition(@signs4Width, @signs4Height, 23, 23, 0, 311);
								}
							}
						}
					}
					
				}
				footer{
					padding: 0 3.6%;
					margin-top: .3rem;
					background-color: #fff;
					ul{
						li{
							width: 50%;
							line-height: 1.4rem;
							font-size: 0.42rem;
							color: #999;
							text-align: center;
							span{
								display: inline-block;
								height: .35rem;
								width: .35rem;
								border-radius: 50%;
								border: 1px solid #999;
								position: relative;
								top: 0.07rem;
								left: -0.2rem;
							}
							&.active{
								span{
									border-color: #ff4141;
									background-color: #ff4141;
								}
							}
						}
					}
				}
			}
		}
		.have-a-date-box{
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			z-index: 1000;
			background-color: rgba(0,0,0,.15);
			.agree-have-a-date{
				width: 80%;
				margin: 0 auto;
				margin-top: calc(~"(100vh - 10rem) / 2");
				padding-bottom: .4rem;
				border-radius: 10px;
				background-color: #fff;
				
			}
			.refuse-have-a-date{
				width: 80%;
				margin: 0 auto;
				margin-top: calc(~"(100vh - 6.7rem) / 2");
				padding-bottom: .4rem;
				border-radius: 10px;
				background-color: #fff;
			}
			.title{
				/*padding: 0 7%;*/
				font-size: 0.38rem;
				line-height: 0.9rem;
				border-top-left-radius: 10px;
				border-top-right-radius: 10px;
				background-color: #eee;
			}
			.content{
				/*padding: 0 7%;*/
				text-align: left;
				font-size: 12px;
				div{
					margin-bottom: .15rem;
					color: #999;
					label{
						line-height: 0.7rem;
					}
					input, textarea{
						color: #999;
						width: calc(~"100% - 10px");
						padding: 0 5px;
						line-height: 0.6rem;
					}
					textarea{
						height: 1.1rem;
						line-height: .55rem;
					}
				}
				.cause{
					textarea{
						padding: 5px;
						margin-top: .3rem;
						height: 2.2rem;
					}
				}
				.give-grant{
					margin-bottom: .2rem;
					input{
						width: 60%;
						margin: 0 auto;
						display: block;
					}
				}
				.tips{
					margin: 0;
					font-size: .347rem;
					line-height: .55rem;
					text-align: center;
				}
			}
		}
		.asker-express-box{
			margin-top: .3rem;
			background-color: #fff;
			.answer-info{
				position: relative;
				height: 1.5rem;
				padding-right: 3.6%;
				line-height: 1.5rem;
				.picture{
					position: absolute;
					left: 3.6%;
					top: .3rem;
					img{
						width: 1.2rem;
						height: 1.2rem;
					}
					.class-signs{
						padding-left: 0;
						position: absolute;
						left: 0.9rem;
						top: 0.8rem;
						&.v-signs:before{
							height: 0.5rem;
							background-size: 150%;
							.bgPosition(@signs4Width, @signs4Height, 23, 22, 0, 279);

						}
						&.king-signs:before{
							height: 0.5rem;
							background-size: 180%;
							.bgPosition(@signs4Width, @signs4Height, 22, 16, 0, 982);

						}
					}
				}
				.name{
					margin-left: calc(~"3.6% + 1.5rem");
					font-size: 0.347rem;
				}
				.time{
					color: #999;
					font-size: .32rem;
				}
			}
			section{
				margin-top: .1rem;
				.consultation-result{
					.answer-result{
						padding-left: 3.6%;
						font-size: 0.373rem;
						color: #999;
						line-height: .55rem;
						.refuse{
							padding: .45rem 3.6% .45rem 0;
							border-bottom: 1px solid #eee;
							i{
								color: #333;
							}
						}
						.agree{
							padding-bottom: 0.3rem;
							border-bottom: 1px solid #eee;
							p{
								border: none;
								padding-bottom: 0.3rem;
							}
							ul{
								padding-right: 3.6%;
								li{
									padding-left: .3rem;
									margin-bottom: .15rem;
									color: #999;
									i, span{
										display: inline-block;
									}
									i{
										width: 1.9rem;
									}
									span{
										width: calc(~"100% - 1.9rem");
									}
								}
							}
						}

						.quesition{
							word-wrap: break-word;
							padding-right: 3.6%;
							text-align: justify;
							.child-box{
								padding-bottom: .1rem;
							}
							.modify-signs{
								font-size: 0;
								&:before{
									height: .5rem;
									left: 5px;
									top: -.35rem;
									background-size: 90%;
									.bgPosition(@signs4Width, @signs4Height, 45, 45, 0, 1738)
								}
							}
							.reply-item{
								margin-top: .3rem;
								.audio-item{
									width: 100%;
								}
							}
							.img-wrapper {
								position: relative;
							}
							img[lazy=loading] {
							  background-color: #ddd;
							}
							img{
								width: 100%;
								display: block;
								margin: 0 auto;
							}
							.load-icon {
								display: none;
								position: absolute;
								top: 50%;
								left: 50%;
								margin-top: -0.5rem;
								margin-left: -0.5rem;
								width: 1rem;
								height: 1rem;
								text-align: center;
							}
							img[lazy=loading] + .load-icon {
								display: block;
							}
						}
					}
					
					section{
						padding: 0 3.6%;
						color: #999;
						.show-asker-expression{
							font-size: .32rem;
							padding: .3rem 0;
							
							p{
								margin: .1rem 0;
								.star-wrapper, i{
									margin-right: .5rem;
									color: #ccc;
								}
							}
							div{
								word-wrap: break-word;
								text-align: justify;
							}
						}
						dt{
							text-align: center;
							color: #999;
							margin-top: .2rem;
							dl{
								div{
									height: 1.2rem;
									width: 1.2rem;
									margin: 0 auto;
									border-radius: 50%;
									color: #ff9933;
									border: 1px solid #ff9933;
									img{
										width: 0.5rem;
										height: 0.35rem;
										margin-top: .15rem;
									}
									span{
										display: block;
										font-size: 12px;
										position: relative;
									}
									i{
										font-size: .427rem;
										line-height: 1.2rem;
									}
								}
							}
							dd{
								font-size: 12px;
								margin-top: .15rem;
							}
						}
						.swiper-container{
							margin-top: .3rem;
							z-index: 0;
							.swiper-wrapper{
								.swiper-slide{
									img{
										width: 1rem;
										height: 1rem;
									}
								}
							}
						}
						.thumbUp{
							margin-top: .2rem;
							.thumbUp-signs{
								&:before{
									background-size: 180%;
									height: .35rem;
									width: .7rem;
									.bgPosition(@signs4Width, @signs4Height, 22, 20, 0, 1393)
								}
							}
						}
					}
					aside{
						margin-top: .3rem;
						/*.all-expressions{
							line-height: 1rem;
							font-size: .4rem;
							display: inline-block;
							padding: 0 .3rem;
							background-color: #ff4141;
							color: #fff;
							border-top-right-radius: .5rem;
							border-bottom-right-radius: .5rem;
						}*/
						/*.show-expression{
							ul.express-box{
								li.express-item{
									padding: .2rem .32rem;
									font-size: 0;
								}
							}
						}*/
					}
				}
			}
		}
		.consultation-footer{
			position: absolute;
			bottom: 0;
			width: 100%;
			.btn{
				height: 1.2rem;
				line-height: 1.2rem;
				text-align: center;
				font-size: 0.45rem;
			}
			.submit-answer{
				background-color: #ff4141;
				color: #fff;
			}
			.have-a-date-btn{
				ul{
					border-top: 1px solid #eee;
					li{
						width: calc(~"(100% - 1px) / 2");
						background-color: #fff;
						&.active{
							background-color: #ff4141;
							color: #fff;
						}
						&:not(:first-child){
							border-left: 1px solid #eee;
						}
					}
				}
			}
			.asker-write-expression{
				background-color: #fff;
				padding: 0.4rem 0 0;
				font-size: .35rem;
				color: #999;
				.top{
					padding: 0 3.6%;
					padding-bottom: .3rem;
					line-height: .5rem;
					.star-wrapper{
						margin: 0 .1rem 0 .5rem;
						/*.star{
							width: 0.56rem;
							height: 0.56rem;
							//background-size: 200%;
						}*/
					}
				}
				.middle{
					margin: 0 3.6%;
					padding: .1rem 5px;
					border: 1px solid #eee;
					textarea{
						border: none;
						width: 100%;
						height: 2.2rem;
						line-height: .55rem;
					}
					p{
						text-align: right;
						font-size: 12px;
						line-height: .4rem;
					}
				}
				.submit-answer{
					margin-top: .3rem;
				}
			}
			
		}	
		/*.tool-bars{
			height: 1.5rem;
			font-size: 0;
			background-color: #eee;
		}
*/		.tab-list{
			position: absolute;
			right: .3rem;
			top: 0px;
			line-height: .5rem;
			text-align: right;
			ul{
				width: 100%;
				li{
					width: 100%;
					height: .5rem;
					span{
						display: inline-block;
						text-align: center;
						width: .5rem;
						height: .5rem;
						border-radius: 50%;
						color: #fff;
						background-color: rgba(0,0,0,.3);
					}
					
				}
			}
		}
	}
</style>