module.exports = function (web) {

    // Nunjucks
    const path = require('path');
    const nunjucks = require('nunjucks');
    nunjucks.configure(path.join(__dirname, '../views'), {
        autoescape: true,
        express: web.app
    });

    web.app.set('view engine', 'nunjucks');

    // Modules
    const bodyParser = require('body-parser');

    // Create Express App
    app.web.server = require('http').createServer(web.app);

    // Body Parser
    web.app.use(bodyParser.json());
    web.app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    // Homepage
    web.app.get('/', web.dsSession(), (req, res) => {
        res.render('test');
        return;
    });

    // Complete
    web.fn();
    resolve(web);

};