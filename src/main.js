import Vue from 'vue'
import App from './App'
import routes from './routerMap.js'
// 插件
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import VueResource from 'vue-resource'
Vue.use(VueResource)
import calendar from './components/calendar/index'
Vue.use(calendar)
// mint-ui组件
import {
	Header,
	Button,
	Cell,
	Actionsheet,
	Popup,
	TabContainer,
	TabContainerItem,
	Navbar,
	TabItem,
	Search,
	Badge,
	DatetimePicker,
	Switch,
	Range,
	Picker,
	Progress,
	InfiniteScroll,
	Field,
	Loadmore,
	Swipe,
	SwipeItem,
	Spinner,
	Lazyload,
	CellSwipe
} from 'mint-ui';

Vue.use(Lazyload);
Vue.use(InfiniteScroll);
Vue.component(Header.name, Header);
Vue.component(Button.name, Button);
Vue.component(Cell.name, Cell);
Vue.component(Actionsheet.name, Actionsheet);
Vue.component(Popup.name, Popup);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(Search.name, Search);
Vue.component(Badge.name, Badge);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Switch.name, Switch);
Vue.component(Range.name, Range);
Vue.component(Picker.name, Picker);
Vue.component(Progress.name, Progress);
Vue.component(Field.name, Field);
Vue.component(Loadmore.name, Loadmore);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Spinner.name, Spinner);
Vue.component(CellSwipe.name, CellSwipe);

import './js/flexible.js'
import VueGlobal from './js/global.js'
Vue.use(VueGlobal)

// 页面点击埋点插件
import VueCountlyExt from './js/countly.vue.plugin.js'
Vue.use(VueCountlyExt)

//图片预览插件
import preview from './plugins/preview/index'
Vue.use(preview)


// LESS,CSS样式
import './css/common.less'

//调试窗口
import './js/vconsole.min.js'

//设置请求头Content-Type
Vue.http.interceptors.push((request, next) => {
  request.headers.set('Content-Type', 'application/x-www-form-urlencoded')
  next(response => {
    return response
  })
})
/* eslint-disable no-new */
const router = new VueRouter({
	//mode: 'history',
	base: __dirname,
	routes
})
new Vue({
	router,
	el: '#app',
	render: h => h(App)
})
