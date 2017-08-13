;(function() {
	var global = {}
	global.install = function(vue) {
		vue.prototype.$global = function() {
			var host, userAccount, imgHost, officeHost;
			if(window.location.port) {
				host = 'http://192.168.1.4:8001';
				userAccount = '015533';
				officeHost = 'http://10.202.78.58:8080/view/url';
			} else {
				host = 'http://10.202.33.121:8080';/* http://kms-mcmsrepo.sit.sf-express.com *//*https://kms-mappserver.sf-express.com*/
				userAccount = '015533';
				officeHost = 'http://kms.sf-express.com/view/url';/*http://10.202.78.58:8080/view/url*/
			}
			return {
				host: host,
				userName: userAccount,
				officeHost: officeHost,
				imgHost: 'http://10.202.32.116:8080/KMS/',
				//imgHost: 'http://kms-mappserver.sf-express.com/KMS/',/*http://10.202.32.116:8080/KMS/*/
				idvHost: 'http://10.202.32.116:8080/KMS/'/*http://kms.sf-express.com/KMS/*/
			}
		},
		vue.prototype.getData = function(url,pro,method,data,fn){
			this.$http({
				method:method,
				url:this.$global().host+url,
				data:data?data:{}
			}).then(

				response => {
					if(response.status==200&&response.body.status){
						if(response.body.data){
							this[pro] = response.body.data;
							this.totalPage = response.body.totalPage-1;
							if(fn){fn(this);}
						}else{//找不到数据
							this[pro] = 0;
						}
						
					}
					
				},
				response =>{
					// error callback
					//alert('数据加载错误！');
				}
			)
		}
	}
	if(typeof exports == 'object') {
		module.exports = global
	}
})()

