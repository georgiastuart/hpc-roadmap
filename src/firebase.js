// Firebase
import firebase from 'firebase/app'
import 'firebase/firestore';
import { firebaseConfig } from '../firebase.config.js'

firebase.initializeApp(firebaseConfig);
export let db = firebase.firestore();