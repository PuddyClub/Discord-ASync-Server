// Prepare Module
const firebase = require('firebase');
const express = require('express');

// App
const app = {};

module.exports = {

    // Start Firebase
    firebase: function (cfg) { 
        firebase.initializeApp(cfg); 
        app.auth = firebase.auth(); 
        app.db = firebase.database(); 
        return firebase; 
    }

};