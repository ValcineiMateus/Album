// ===== CONFIGURAÇÃO DO FIREBASE =====
const firebaseConfig = {
    apiKey: "AIzaSyCK999CZ_jE_y_gjeXf8ltwvq0KNsAjNGM",
    authDomain: "album-web-33f4a.firebaseapp.com",
    projectId: "album-web-33f4a",
    storageBucket: "album-web-33f4a.firebasestorage.app",
    messagingSenderId: "338034804759",
    appId: "1:338034804759:web:272279e3bf71a28d6e7452"
};

firebase.initializeApp(firebaseConfig);

// Guardamos essa referência numa variável global simples (db) para o
// script.js poder usar direto. As fotos agora ficam no Cloudinary — veja
// cloudinary-config.js — então não precisamos mais do Firebase Storage aqui.
const db = firebase.firestore();

