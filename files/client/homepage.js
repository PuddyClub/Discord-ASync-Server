$(() => {

    // Socket Connection
    const socket = io.connect();
    let firstTime = true;
    let user = null;
    $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)" });

    // Connected
    socket.on('discordConnected', user => {
        if (firstTime) { firstTime = false; $.LoadingOverlay('hide'); }
        user = user;
    });

    // Select Bot
    $('[id^="ds_bot_"]').click(function() {

        // Get Bot ID
        const botID = $(this).attr('id').substring(7);
        console.log(botID);

    });

});