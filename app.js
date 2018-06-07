require('dotenv').config();
const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const axios = require('axios');
const morgan = require('morgan');
const apicache = require('apicache');
const cache = apicache.middleware;

var PORT = process.env.PORT || 8000;
const key = process.env.API_KEY;
const url = "https://api.themoviedb.org/3/search/movie";
app.use(morgan('dev'));
app.use(express.static('public'));
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true
});

app.get("/", function(req, resp) {
    resp.render("main.html", {data: null});
});

app.get("/movie", cache('5 minutes'), function(req, resp, next) {
    console.log('Generating a new response');
    let name = req.query.name;
    let config = {
            params: {
                api_key: key,
                query: name
            }
    };
    axios.get(url, config)
        .then(function (response) {
            var results;
            console.log(response.data);
            if (response.data) {
                results = response.data;
            } else {
                results = null;
            }
            resp.render('main.html', {data: results});
            })
        .catch(next);
});
app.listen(PORT, function(){
    console.log("App starts at PORT ", PORT);
});

