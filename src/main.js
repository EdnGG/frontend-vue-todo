import Vue from 'vue'
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

Vue.use(require('vue-moment'));
Vue.use(VueAxios, axios);

// Adding  API URL base 

// Mongo Atlas
// axios.defaults.baseURL = process.env.VUE_APP_KEY_CLOUD
axios.defaults.baseURL = process.env.VUE_APP_KEY_LOCAL

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
