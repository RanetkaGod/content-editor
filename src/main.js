import Vue from 'vue'
import App from './App.vue'
import {firestorePlugin} from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'

Vue.use(firestorePlugin)

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')


var firebase_config = {***};
firebase.initializeApp(firebase_config)

export const db = firebase.firestore();
export const storage = firebase.storage();
