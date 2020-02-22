"use strict";

const express = require('express');
const dotenv = require('dotenv');
const request = require('request');

dotenv.config();
const app = express();

app.use(express.json());

let allResponses = [];

app.get('/', (req, res) => {
	return res.status(200).send({
    'requestTarget': process.env.TARGETURL,
    'totalResponses': allResponses.length,
    'message': 'Made possible by the emotional support of Ricky Marine',
    'repository': 'https://www.github.com/philipLutz/requester'
   });
});

let response = null;
async function makeRequests() {
  try {
    await request(process.env.TARGETURL, function (error, response, body) {
      response = {
        error: error,
        statusCode: response && response.statusCode,
        timeStamp: Date.now()
      };

      allResponses.push(response);

      console.log(response, `totalResponses: ${allResponses.length}`);

      response = null;

      setTimeout(function() {
        makeRequests();
      }, (process.env.TIMEOUT*1000));
    });
  } catch(error) {
    console.log(error);
    setTimeout(function() {
      makeRequests();
    }, 1000);
  }
}

app.listen(process.env.PORT);
console.log(
  `Requesting ${process.env.TARGETURL} and listening on port ${process.env.PORT}`
);

makeRequests();

module.exports = app;
