
// Socket Connection
socket = io.connect();

$("html").fadeIn();
$.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)" });

// Connected
socket.on('discordConnected', user => {

    // First Time
    if (firstTime) { firstTime = false; $.LoadingOverlay('hide'); $('.bot_list').fadeIn(); startApp(false); }

    // Nope
    else {

        // Exist Bot Selected
        if (bot.id) {
            socket.emit('connectDiscordBot', bot.id, (data) => {

                // Success
                if (data.success) {

                    // Set Bot Name
                    $('#ds_bot_' + bot.id + ' > span > span').text(data.tag);
                    $('#ds_bot_' + bot.id + ' > span > img').attr('src', data.avatar);
                    startBot(bot.id, true);

                    // Exist Guild Selected
                    if (bot.guild) {
                        socket.emit('connectDiscordGuild', bot.guild, (data) => {

                            // Complete
                            if (data.success) { startGuild(bot.guild, true); }
                            $.LoadingOverlay("hide"); startApp(true);

                            // Update Page Data
                            socket.emit('updateCountPage', 'connectDiscordGuild');

                        });
                    }

                    // Nope
                    else { bot.guild = null; $.LoadingOverlay("hide"); startApp(true); }

                }

                // Nope
                else {

                    // End Load
                    $.LoadingOverlay("hide");

                    // Select Server Button
                    $("#select_server").removeClass('disabled');

                    // Set Message
                    $('#app').empty().append(
                        $('<center>').text(tinyLang.botNotFound)
                    );

                    // Start Plugins
                    bot.id = null;
                    bot.guild = null;
                    startApp(true);

                }

            });
        }

        // Nope
        else { $.LoadingOverlay("hide"); startApp(true); }
        socket.emit('updateCountPage', 'discordConnected');

    }

    // User
    dsUser = user;

});
