import Vue from 'vue'
import App from './App.vue'
import router from './router'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import regular from '@fortawesome/fontawesome-free-regular'
import brands from '@fortawesome/fontawesome-free-brands'

import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import VueLazyload from 'vue-lazyload'
import Photoswipe from 'vue-pswipe'

const VueUploadComponent = require('vue-upload-component')
Vue.component('file-upload', VueUploadComponent)

fontawesome.library.add(solid)
fontawesome.library.add(regular)
fontawesome.library.add(brands)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(BootstrapVue)
Vue.use(Photoswipe, {
  counterEl: false,
  history: false,
  focus: false,
  fullscreenEl: false
})
// init vue apollo
const httpLink = new HttpLink({
  uri: 'https://gallery.kvnmm.com/graphql'
})

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})
Vue.use(VueApollo)
Vue.use(VueLazyload, {})

Vue.config.productionTip = false

new Vue({
  router,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
