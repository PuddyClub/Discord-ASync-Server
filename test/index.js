// Tiny Config
const tinyCfg = require('./config.json');

// Get Module
const ds = require('../index')(tinyCfg);

// Start Config
firebase.initializeApp();