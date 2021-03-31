$(() => {

    // Socket Connection
    const socket = io.connect();
    let firstTime = true;
    let user = null;
    const bot = { id: null };
    $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)" });

    // Connected
    socket.on('discordConnected', user => {
        if (firstTime) { firstTime = false; $.LoadingOverlay('hide'); $('.bot_list').fadeIn(); }
        user = user;
    });

    // Select Bot
    $('[id^="ds_bot_"]').click(function () {

        // Get Bot ID
        $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)" });
        const botID = $(this).attr('id').substring(7);
        socket.emit('connectDiscordBot', botID, (active) => {

            // Is Active
            if (active) {

                // Check ID
                if (typeof bot.id !== "string" || botID !== bot.id) {
                    $('#ds_bot_' + botID).parent().addClass('active').css('pointer-events', 'none');
                    $('#ds_bot_' + bot.id).parent().removeClass('active').css('pointer-events', '');
                }

                // Set new ID
                bot.id = botID;

            }

            // Complete
            $.LoadingOverlay('hide');
            return;

        });

    });

});