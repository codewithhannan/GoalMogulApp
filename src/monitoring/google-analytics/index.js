/** @format */

import * as firebase from 'firebase'

// Firebase setup for google analytics
// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyDF_56cvRDghaJm-NpqgpR4GEqf5T5nzDQ',
    authDomain: 'goalmogul-ios.firebaseapp.com',
    databaseURL: 'https://goalmogul-ios.firebaseio.com',
    projectId: 'goalmogul-ios',
    storageBucket: 'goalmogul-ios.appspot.com',
    messagingSenderId: '1007283017039',
    appId: '1:1007283017039:web:59538b49134884f995213a',
    measurementId: 'G-BZ5HMXJQ9K',
}

export const initFireBase = () => {
    firebase.initializeApp(firebaseConfig)
    firebase.analytics()
    firebase.analytics().logEvent('App Started')
}
