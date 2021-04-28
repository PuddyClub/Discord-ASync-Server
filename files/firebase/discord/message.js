module.exports = function (cmd, cfg) {
    return new Promise((resolve, reject) => {

        // Message
        const msg = cmd[0];

        // Firebase
        const db = cfg.bot.firebase.db.main;
        
        // Complete
        resolve();
        return;

    });
};