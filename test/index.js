// Tiny Config
const tinyCfg = require('./config.json');

// Get Module
const ds = require('../index');

// Start Firebase
ds.firebase(tinyCfg);

// Start Config
firebase.initializeApp();