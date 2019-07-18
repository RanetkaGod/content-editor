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


var firebase_config = {
    apiKey: "AIzaSyCngEOxYs4dzyEg-pkA1nBe-3qm6bLWBNA",
    authDomain: "blogrnt.firebaseapp.com",
    databaseURL: "https://blogrnt.firebaseio.com",
    projectId: "blogrnt",
    storageBucket: "blogrnt.appspot.com",
    messagingSenderId: "488445207512",
    appId: "1:488445207512:web:1228ca6a11494da9"
};
firebase.initializeApp(firebase_config)

export const db = firebase.firestore();
export const storage = firebase.storage();
