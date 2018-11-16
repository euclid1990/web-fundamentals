import _ from 'lodash';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VeeValidate from 'vee-validate';
import mdcAutoInit from '@material/auto-init';
import { MDCRipple } from '@material/ripple';
import { MDCTextField } from '@material/textfield';
import { MDCTopAppBar } from '@material/top-app-bar/index';
import { MDCList } from '@material/list';
import { MDCDrawer } from '@material/drawer';
import { MDCDialog } from '@material/dialog';
import * as HttpStatus from 'http-status';
import Api from './api';
import Guard from './guard';
import db from './db';
import router from './router';
import '../styles/app.scss';

// Registering material components
mdcAutoInit.register('MDCTextField', MDCTextField);
mdcAutoInit.register('MDCRipple', MDCRipple);
mdcAutoInit.register('MDCTopAppBar', MDCTopAppBar);
mdcAutoInit.register('MDCList', MDCList);
mdcAutoInit.register('MDCDrawer', MDCDrawer);
mdcAutoInit.register('MDCDialog', MDCDialog);

// Assign mdcAutoInit to global variables
window.mdcAutoInit = mdcAutoInit;

// Call after all scripts are loaded so it works properly.
mdcAutoInit();

// Install the Vue router via Vue.use()
Vue.use(VueRouter);

// Install validation library for Vue.js
Vue.use(VeeValidate);

// Use a Global Mixin to affect every Vue instance
Vue.mixin({
  methods: {
    isAuthenticated() {
      return Guard.isAuthenticated();
      /*
      this.db.users
        // .where('signed_out_at').equals('null')
        .orderBy(':id').reverse().limit(10).toArray().then((data) => {
          console.log(data);
        });
      */
    }
  },
  created() {
    this.db = db;
    this.guard = Guard;
    this.httpStatus = HttpStatus;
    this.api = new Api();
    this.addErrors = (errors) => {
      _.each(errors, (v, k) => {
        this.errors.add({ field: k, msg: _.head(v) });
      });
    };
  }
});

// Create and mount the root instance.
const app = new Vue({ // eslint-disable-line no-unused-vars
  router
}).$mount('#app');

// Register the service worker if it's available
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./service-worker.js')
    .then(registration => {
      console.log('Service Worker registered: ', registration);
    })
    .catch(error => {
      console.log('Service Worker registration failed: ', error);
    });
}
