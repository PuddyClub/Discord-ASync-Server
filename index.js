// Prepare Module
const firebase = require('firebase');
const express = require('express');
const ON_DEATH = require('death');

// App
const app = {};

module.exports = {

    // Firebase
    firebase: {

        // Start
        start: function (cfg) {
            firebase.initializeApp(cfg);
            app.auth = firebase.auth();
            app.db = firebase.database();
            return firebase;
        },

        // Login Firebase
        login: function (token) { return app.auth.signInWithCustomToken(token); }

    }

};

// ON Death
ON_DEATH(async function (signal, err) {

    // Close Firebase Connection
    try { await firebase.auth().signOut(); } catch (err) { }
    return;

});