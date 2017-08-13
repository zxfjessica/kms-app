import Calendar from './calendar'
const install = (Vue) => {
  Vue.component(Calendar.name, Calendar)
}

export default {
  version: '0.0.3',
  install
}
