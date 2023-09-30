const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
var cors = require('cors');
module.exports = function () {
    const app = express();

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());
    // app.use(express.static(process.cwd() + '/public'));

    /* App (Android, iOS) */
    // TODO: 도메인을 추가할 경우 이곳에 Route를 추가하세요.
    require('../src/app/User/userRoute')(app);
    require('../src/app/Signal/signalRoute')(app);
    require('../src/app/Comment/commentRoute')(app);
    require('../src/app/SignalFind/findRoute')(app);
    require('../src/app/BlackList/blackRoute')(app);
    require('../src/app/HashTag/hashtagRoute')(app);
    require('../src/app/Chat/chatRoute')(app);
    require('../src/app/Message/msgRoute')(app);
    require('../src/app/Report/reportRoute')(app);
    // require('../src/app/Board/boardRoute')(app);

    return app;
};