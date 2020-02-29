"use strict";

const express = require('express');
const dotenv = require('dotenv');
const rp = require('request-promise-native');

dotenv.config();
const app = express();

app.use(express.json());

let isRequesting = true;
let allResponses = [];

app.get('/', (req, res) => {
	return res.status(200).send({
    'requestTarget': process.env.TARGETURL,
    'totalResponses': allResponses.length,
		'lastResponse': allResponses[allResponses.length-1],
		'isRequesting': isRequesting,
    'message': 'Made possible by the emotional support of Ricky Marine',
    'repository': 'https://www.github.com/philipLutz/requester'
   });
});

function timeout(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeRequests() {
	while (allResponses.length < process.env.LIMIT) {
		let response = {
			status: null,
			date: null,
		};
		await Promise.all([
			rp(process.env.TARGETURL)
			.then(function(res) {
				response.status = 'success';
				response.date = new Date();
				console.log(response);
				allResponses.push(response);
			})
			.catch(function(err) {
				response.status = 'error';
				response.date = Date.now();
				console.log(response);
				allResponses.push(response);
			}),
			timeout(process.env.TIMEOUT*1000)
		]);
	}
	isRequesting = false;
	console.log('Requests complete');
}

const PORT = process.env.PORT || 80;

app.listen(PORT);
console.log(
  `Requesting ${process.env.TARGETURL} and listening on port ${PORT}`
);

makeRequests();

module.exports = app;
