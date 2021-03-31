$(() => {

    // Socket Connection
    const socket = io.connect();
    let firstTime = true;
    let user = null;
    $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)" });

    // Connected
    socket.on('discordConnected', user => {
        if (firstTime) { firstTime = false; $.LoadingOverlay('hide'); $('.bot_list').fadeIn(); }
        user = user;
    });

    // Select Bot
    $('[id^="ds_bot_"]').click(function () {

        // Get Bot ID
        const botID = $(this).attr('id').substring(7);
        socket.emit('connectDiscordBot', botID, (data) => {

            /* Quando Carregar. Vamos pegar os dados do bot e colocar um class active aqui e desativar o active do antigo bot. */

            console.log('Bot Data');
            console.log(data);

        });

    });

});