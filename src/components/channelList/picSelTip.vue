<template>
	
	  <div class="pic-sel-wrapper">
	  	<div class="pic-sel-btn" @click="albumsHandler">用户相册</div>
	  	<div class="pic-sel-btn" @click="photograpHandler">拍照</div>
	  	<div class="cancel-btn" @click="$emit('picSelControl')">取消</div>
	  </div>
</template>
<script>
	import { Toast } from 'mint-ui';
	export default {
		name: 'picSelTip',
		props: {
			/*picSelVisibleByP: {
				type: Boolean
			}*/
		},
		data(){
			return {
				imageArr: [],
				imageArrayUrl: [],
				imageArrayUrlCopy: [],
				imageCompressIndex: 0,
				imageTransferIndex: 0
			}
		},
		watch: {
			imageCompressIndex() {
				console.log('this.imageCompressIndex:' + this.imageCompressIndex);
			},
			imageTransferIndex() {
				console.log('this.imageTransferIndex:' + this.imageTransferIndex);
			}
		},
		mounted(){
		},
		methods: {
			successCallback(imageInfo) {
				var that = this;
				this.imageArr = [];
				this.imageArrayUrl = [];
				this.imageArrayUrlCopy = [];
				this.imageCompressIndex = 0;
				this.imageTransferIndex = 0;
				if (this.getIsIOS()) {
					var str = "";
					str = imageInfo;
					str = str.replace(/\n/g, '');
					var obj = JSON.parse(str);
					setTimeout(() => {
						that.imageArr.push(obj);
						console.log('successCallbackOri' + that.imageArr[0].original);
						console.log('successCallbackCom' + that.imageArr[0].thumbnail);
						//that.emit('picSelControl');
						that.$nextTick(() => {
							that.compressFileHandler();
						});
					}, 50);
				}else {
					this.imageArr.push(imageInfo);
					console.log('successCallbackOri' + that.imageArr[0].original);
					console.log('successCallbackCom' + that.imageArr[0].thumbnail);
					//that.$emit('picSelControl');
					that.$nextTick(() => {
						that.compressFileHandler();
					});
				}
				
			},
			compressFileHandler() {
				if (this.imageArr && this.imageArr.length > 0) {console.log('imageArrLength:' + this.imageArr.length);
					if (this.imageCompressIndex >= this.imageArr.length - 1) {console.log('HanimageCompressIndex:' + this.imageCompressIndex);
						this.compressFile(this.imageArr[this.imageCompressIndex].original, this.compressSuccessSubmit, this.onFail);
					} else {
						this.compressFile(this.imageArr[this.imageCompressIndex].original, this.compressSuccess, this.onFail);
					}
					this.imageCompressIndex ++;
				}
				console.log('compressFileHandler:' + this.imageCompressIndex);
			},
			compressSuccess(imgurl) {
				if (this.imageCompressIndex >= this.imageArr.length - 1) {
					this.compressFile(this.imageArr[this.imageCompressIndex].original, this.compressSuccessSubmit, onFail);
				} else {
					this.compressFile(this.imageArr[this.imageCompressIndex].original, this.compressSuccess, onFail);
				}
				this.imageCompressIndex ++;
				this.imageArrayUrlCopy.push(imgurl);
				console.log('compressSuccess');
			},
			compressSuccessSubmit(imgurl) {console.log('compressSuccessSubmit:' + imgurl);
				this.imageArrayUrlCopy.push(imgurl);
				if (this.imageArrayUrlCopy && this.imageArrayUrlCopy.length > 0) {
					if (this.imageTransferIndex >= this.imageArrayUrlCopy.length - 1) {
						this.transferImageToService('/KMS-MSERVER/upload/image', this.imageArrayUrlCopy[this.imageTransferIndex], this.onSuccessSubmit, this.onFail);
					} else {
						this.transferImageToService('/KMS-MSERVER/upload/image', this.imageArrayUrlCopy[this.imageTransferIndex], this.onSuccess, this.onFail);
					}
					this.imageTransferIndex++;
				}
				
			},
			errorCallback() {
				//console.log('Error');
				this.$emit('picSelControl');
				console.log('errorCallback:' + this);
			},
			getIsIOS() {//cordova
				try {
					var isiOS = device.platform == 'iOS';
					return isiOS;
				}catch(e){}
				console.log('getIsIOS');
			},
			getCameraOptions(sourceType) {console.log('getCameraOptions');
				return {
					sourceType: sourceType,
					saveToPhotoAlbum: true,
					destinationType: window.Camera.DestinationType.FILE_URI
				};
			},
			getPhotoFrom(sourceType) {console.log('getPhotoFrom');
				try {
					navigator.camera.getPicture(this.successCallback, this.errorCallback, this.getCameraOptions(sourceType));
				}catch(e) {}
			},
			albumsHandler() {//相册
				console.log('打开相册');
				this.$emit('picSelControl');
				try {
					this.getPhotoFrom(window.Camera.PictureSourceType.PHOTOLIBRARY);
				}catch(e) {}	
			},
			photograpHandler() {//拍照
				console.log('拍照');
				this.$emit('picSelControl');
				try {
					this.getPhotoFrom(window.Camera.PictureSourceType.CAMERA);
				}catch(e) {}
			},
			onSuccess(imgurl) {console.log('onSuccess');
				this.imageArrayUrl.push(imgurl);
				if (this.imageTransferIndex >= this.imageArrayUrlCopy.length - 1) {
					this.transferImageToService('/KMS-MSERVER/upload/image', this.imageArrayUrlCopy[imageTransferIndex], this.onSuccessSubmit, this.onFail);
				} else {
					this.transferImageToService('/KMS-MSERVER/upload/image', this.imageArrayUrlCopy[imageTransferIndex], this.onSuccess, this.onFail);
				}
				this.imageTransferIndex++;
			},
			onSuccessSubmit(imgurl) {console.log('onSuccessSubmit');
				this.imageArrayUrl.push(imgurl);
				var imagesData = "";
				for (var i = 0; i < this.imageArrayUrl.length; i++) {
					if (i == this.imageArrayUrl.length - 1) {
						imagesData = imagesData + this.imageArrayUrl[i];
					} else {
						imagesData = imagesData + this.imageArrayUrl[i] + ",";
					}
				}
				this.$emit('picSelSuccessControl', imagesData);
			},
			onFail(mess) {
				console.log('onFail', mess);
				Toast({message: '添加图片失败，请重新添加！', duration: 1000});
			},
			compressFile(filePath, onSuccess, onFail) {console.log('compressFile');
				var onsuccesscom = function(imgURL) {console.log('compressFile+onsuccesscom' + imgURL);
					if (imgURL) {
						onSuccess(imgURL);
					}
				}
				var onerrorcom = function(error) {console.log('compressFile+onerrorcom' + error);
					onFail(error);
				}
				var pathArray = [];
				pathArray.push(filePath);
				try{
					MediaOption.compress(onsuccesscom, onerrorcom,pathArray);
				}catch(e) {}
			},
			transferImageToService(servePath, filePath, onSuccess, onFail) {console.log('transferImageToService');
				var path = "";
				path = path + filePath;
				var fileName = path.substr(path.lastIndexOf('/') + 1);
				var mimeType = "image/jpeg";
				var opt = {
					'fileKey': 'file',
					'fileName': fileName,
					'mimeType': mimeType || 'audio/3gp'
				};
				var onsuccess = function(response) {
					//bytesSent: 58226
					//headers: Object
					//response: "{\"status\":1,\"data\":[\"mobile-common/images/001/448/610/570/292/e80b2c9c-4de3-4fb1-9f19-2bd273534224.jpg\"]}"
					//responseCode: 200

					var responseCode = response.responseCode;
					if (responseCode == 200) {
						var result = response.response;
						result = result.replace(/\n/g, '');
						var obj = JSON.parse(result);
						if (obj.status == 1) {
							var imgURL = obj.data[0];
							onSuccess(imgURL);
						}
					}

				}
				var onerror = function(response) {
					onFail(response);
				}
				try {
					var fileTransfer = new FileTransfer();
					fileTransfer.upload(path, encodeURI(this.$global().host + servePath), onsuccess, onerror, opt, true);
				} catch(e) {}
			},
			deleteFiles() {console.log('deleteFiles');
				try {
					MediaOption.deleteFile(this.imageArrayUrlCopy);
				} catch (e) {} 
			}
		}
	}
</script>
<style lang="less">
	.pic-sel-wrapper {
		div {
			height: 1.173rem;
			font-size: 0.42rem;
			text-align: center;
			line-height: 1.173rem;
			background-color: #fff;
		}
		.pic-sel-btn {
			&:first-child {	
				border: 1px solid #eee;
			}
		}
		.cancel-btn {
			margin-top: 0.1rem;
		}
	}
</style>