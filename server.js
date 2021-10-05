require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
//var model = require('./model');


//
//***
//import {getShortenedUrl} from 'view.js';
const { getShortenedURL, lookUpShortenedURL } = require('./model');
var bodyparser = require ('body-parser');
app.use(bodyparser.urlencoded({extended: false}));
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
/*
app.get('/api/hello/:id?', function(req, res) {
  val = getShortenedURL(req.params.id);
  console.log(val);
  res.json({ greeting: 'hello API' });
});
*/
//****


app.get('/api/shorturl/:id',function(req,res) {
    urlmap = lookUpShortenedURL(req.params.id);
    try{
      url = new URL(urlmap);
    } catch(err) {
      res.json({error: 'No short URL found for the given input'});
    }
    if (url.href) {
      res.redirect(url);
    } else {
      res.json({error: 'No short URL found for the given input'});
    }
  });


app.post('/api/shorturl', (function(req, res) {
  try{
    url = new URL(req.body.url);
  } catch(err) {
    res.json({error: 'Invalid URL'});
  }
  if ( url.protocol === "http:" || url.protocol === "https:") {
    dns.lookup(url.hostname, (err, address) => {
      if (address !== undefined) {
        val = getShortenedURL(req.body.url);
        res.json({"original_url":req.body.url,"short_url":val});
      } else {
        res.json({error: 'Invalid URL'});
      }
    });
  } else {
    res.json({error: 'Invalid URL'});
  }

}));

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
