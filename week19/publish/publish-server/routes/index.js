var express = require('express');
var router = express.Router();
const fs = require('fs');
const { request } = require('http');

/* GET home page. */
router.post('/', function(request, res, next) {
    //console.log(req);
    //fs.writeFileSync("../server/public/1.html", "Hello world") //同机部署才能用fs.writeFileSync
    //res.render('index', { title: 'Express' });

    fs.writeFileSync("../server/public/" + request.query.filename, request.body.content)
    res.send('');
    res.end();
});

module.exports = router;
