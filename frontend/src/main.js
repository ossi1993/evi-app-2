// import "babel-polyfill";
import Vue from "vue";
import vSelect from 'vue-select';
import Multiselect from 'vue-multiselect';
import { VueCsvImport } from 'vue-csv-import';
import App from "./App.vue";
import router from "./router";
// import VueRouter from "vue-router";
import GullKit from "./plugins/gull.kit";
// import "babel-polyfill";
// import es6Promise from "es6-promise";
// es6Promise.polyfill();
import store from "./store";
import Breadcumb from "./components/breadcumb";
import firebase from "firebase/app";
import "firebase/auth";
import {firebaseSettings} from "@/data/config";
import i18n from "./lang/lang";
import VueHtmlToPaper from 'vue-html-to-paper';

import 'vue-select/dist/vue-select.css';

import "../node_modules/@ag-grid-enterprise/all-modules/dist/styles/ag-grid.css";
import "../node_modules/@ag-grid-enterprise/all-modules/dist/styles/ag-theme-material.css";
import "../node_modules/@ag-grid-enterprise/all-modules/dist/styles/ag-theme-alpine.css";
import "../node_modules/vue-multiselect/dist/vue-multiselect.min.css";
// import "../node_modules/@ag-grid-enterprise/all-modules/dist/styles/ag-theme-material/sass/ag-theme-material.scss";

import {AllModules} from "@ag-grid-enterprise/all-modules";
import {LicenseManager} from "@ag-grid-enterprise/core";
// import { AgGridVue } from 'ag-grid-vue';

LicenseManager.setLicenseKey("CompanyName=E.V.I. GmbH,LicensedApplication=TDS-App,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-009584,ExpiryDate=7_August_2021_[v2]_MTYyODI5MDgwMDAwMA==3f92f825617121bf9491fdb6a36c3b4c");

Vue.component("breadcumb", Breadcumb);
Vue.component('v-select', vSelect);
Vue.component('multiselect', Multiselect);
Vue.component('vue-csv-import', VueCsvImport);
// Vue.use(VueRouter);
// Vue.forceUpdate();
Vue.use(GullKit);
firebase.initializeApp(firebaseSettings);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  i18n,
  render: h => h(App)
}).$mount("#app");


const options = {
  // name: '_blank',
  // specs: [
  //   'fullscreen=yes',
  //   'titlebar=yes',
  //   'scrollbars=yes'
  // ],
  styles: [
    // 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    // 'https://unpkg.com/kidlat-css/css/kidlat.css',
    './views/app/inspection/print.css',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
    'https://unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.css',
  ]
}

Vue.use(VueHtmlToPaper, options);