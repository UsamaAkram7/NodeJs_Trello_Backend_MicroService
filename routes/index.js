var express = require('express');
var router = express.Router();
var ObjectId;
ObjectId = require('mongodb').ObjectID;
const _ = require('underscore');
const axios = require('axios');
/*var redis = require("redis")
client = redis.createClient({  port: process.env.REDISPORT ,
         host: process.env.REDISHOST ,});*/
let rbac = `/security/api/rbac`;

router.use(function (req, res, next) {
    (async () => {
        try {
            const reqObjInfo = { url: `${rbac}/token/info`, method: "GET", headers: { token: req.headers.token } };
            const userInfo = await axios(reqObjInfo);
            const reqObjTeam = { url: `${rbac}/teams?companyId=${userInfo.data.companyId}&username=${userInfo.data.username}`, method: "GET", headers: { token: req.headers.token } };
            const userTeams = await axios(reqObjTeam);

            req.headers.company_id = userInfo.data.companyId;
            req.headers.company = userInfo.data.companyId;
            req.headers.companyid = userInfo.data.companyId;
            req.headers['company-id'] = userInfo.data.companyId;
            req.headers.teams = _.pluck(userTeams.data.data, 'name');
            req.headers.user = userInfo.data.username;
            req.headers.user_id = userInfo.data.username;
            next();

        } catch (e) {
            next();
        }
    })();
})


router.use(function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header("Accept-Encoding", "gzip");
    res.header("cache-control", "no-cache");
    return next();
});

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('index', { title: 'Express' });
    res.sendFile(__dirname +'/index.html')
});

module.exports = router;
