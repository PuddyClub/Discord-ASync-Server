// Prepare Module
const firebase = require('firebase');
const express = require('express');
const ON_DEATH = require('death');

// App
const app = { auth: { login: null } };

module.exports = {

    // Firebase
    firebase: {

        // Set onAuthStateChanged
        onAuthStateChanged: function (callback) { app.auth.onAuthStateChanged = callback; },

        // Start
        start: function (cfg) {

            // Console Log
            console.log('Starting Firebase...');

            // Starting Firebase
            firebase.initializeApp(cfg);
            app.auth.root = firebase.auth();
            app.db = firebase.database();

            // Firebase AuthStateChanged
            app.auth.root.onAuthStateChanged((user) => {

                // Status Changed

                // is User
                if (user) {
                    console.log('Your server is logged!');
                }

                // Nope
                else {
                    console.log('Your server made logout!');
                }

                // Callback
                if (typeof app.auth.onAuthStateChanged === "function") { app.auth.onAuthStateChanged(user); }

            });

            // Complete
            console.log('Firebase Started!');
            return firebase;

        },

        // Login Firebase
        login: function (token) {
            return new Promise(async (resolve, reject) => {

                // Start Login
                const loginStart = function () {
                    return app.auth.root.signInWithCustomToken(token).then((userCredential) => {
                        resolve(userCredential);
                    }).catch((err) => {
                        reject(err);
                    });
                };

                // Is Function
                if (typeof token === "function") {

                    // Try Token
                    try {
                        const tokenResult = await token();
                        loginStart(tokenResult);
                    }

                    // Fail
                    catch (err) { reject(err); }

                }

                // Is String
                else if (typeof token === "string") {
                    loginStart(token);
                }

                // Nothing
                else { reject(new Error('Invalid Firebase Token Value in the login method!')); }

            });
        }

    }

};

// ON Death
ON_DEATH(async function (signal, err) {

    // Closing Message
    console.log(`Closing App: ${signal}`);
    if (err) { console.error(err); }

    // Close Firebase Connection
    try { await firebase.auth().signOut(); } catch (err) { console.error(err); }
    return;

});