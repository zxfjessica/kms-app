import './countly.min.js'

window.onunload = function() {
	Countly.end_session();
};

(function() {
	var countly = {}
	countly.flag = true;
	countly.install = function(vue) {
		document.addEventListener('deviceready',function(){
			//console.log('Device is Ready!');
				if (window.cordova && window.ExpressPlugin) {
					//console.log("cordova已经加载好而且自定义插件也加载好");
					if (typeof(ExpressPlugin.getCountlyInfos)!='undefined') {
						//获取埋点countly所需数据，并在成功回调里进行countly初始化
						try{
							ExpressPlugin.getCountlyInfos(getCountlyInfoSuccess, getCountlyInfoFailed);
						}catch(e){
							//console.log("countly",e);
						}
					}else{
						//console.log("当前app版本不支持countly功能，需升级版本");
					}
				}
		},false);
		/* 获取埋点countly所需数据成功回调方法
		* 成功返回json字符串：{device_id:'原生countly的device_id', account:'丰声账号', equipment_type:'设备型号', system:'操作系统', app_version:'app版本号'}
		* 若当前用户丰声客户端不支持countly埋点，则pluginFlag为false
		*/
		var m_countly_infos = {pluginFlag: false};
		function getCountlyInfoSuccess(data) {
			try{
				m_countly_infos.pluginFlag = true;
				m_countly_infos.infos = data ? JSON.parse(data) : undefined;
				Countly.init({
					app_key: "SFOPEN", //埋点秘钥
					url: "http://maoap.sit.sf-express.com:9280", //测试环境服务端地址
//					url: "http://maoap.sf-express.com"//生产环境地址
				});
				if(countly.flag) {
					let userId = m_countly_infos.infos.account
					if(Countly.device_id.lastIndexOf(userId) < 0) {
						Countly.device_id = m_countly_infos.infos.device_id;
					}
					countly.flag = false;
				}
					
				Countly.begin_session();
			}catch(e){
				//console.log("json解析有误: ", e);
			}
			//console.log("获取埋点countly所需数据成功: ", data);
		}
		/*获取埋点countly所需数据失败回调方法*/
		function getCountlyInfoFailed(data) {
			//console.log("获取埋点countly所需数据失败: ", data);
		}
		
		vue.prototype.$countly=function(){
			return{
				getMCountlyInfos:function() {
					return m_countly_infos;
				},
				addCountlyCustomEvent:function(key, segmentation){
					Countly.add_event({
						"key":key,
						"segmentation": segmentation
					});
				}
			}
		}
	}
	
	if(typeof exports == 'object') {
		module.exports = countly
	}
})()
/*
 * 埋点例子
	var countlyInfo = this.$countly().getMCountlyInfos();
    if (countlyInfo.pluginFlag) {
      this.$countly().addCountlyCustomEvent('wyqj_tap',{"account":countlyInfo.infos.account, "equipment_type":countlyInfo.infos.equipment_type});
    };
 * */