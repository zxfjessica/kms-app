import NavConfig from './nav.config.json';

const registerRoute = (config) => {
	let route = [];
	config.map(nav =>
		nav.list.map(page =>{
			if(!page.module){
				route.push({
					path: page.path,
					component: require(`./modules/${page.name}`),
					meta: {
						title: page.title || page.name,
						description: page.description
					}
				})
			}else{
				route.push({
					path: page.path,
					component: require(`./modules/${page.module}/${page.name}`),
					meta: {
						title: page.title || page.name,
						description: page.description
					}
				})
			}
			
		})
	);

	return {
		route,
		navs: config
	};
};

const route = registerRoute(NavConfig);

route.route.push({
	path: '/',
	redirect: '/main'
});

export const navs = route.navs;
export default route.route;