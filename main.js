"use strict";

const express = require('express');
const dotenv = require('dotenv');
const rp = require('request-promise-native');

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

function timeout(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeRequests() {
	while (allResponses.length < process.env.LIMIT) {
		let response = {
			statusCode: null,
			date: null,
			message: null
		};
		await Promise.all([
			rp(process.env.TARGETURL)
			.then(function(res) {
				response.statusCode = res.statusCode;
				response.date = res.response.headers.date;
				response.message = res.message;
				console.log(response);
				allResponses.push(response);
			})
			.catch(function(res) {
				response.statusCode = res.statusCode;
				response.date = res.response.headers.date;
				response.message = res.message;
				console.log(response);
				allResponses.push(response);
			}),
			timeout(process.env.TIMEOUT*1000)
		]);
		// setTimeout(
		// 	await rp(process.env.TARGETURL)
		// 	.then(function(res) {
		// 		response.statusCode = res.statusCode;
		// 		response.date = res.response.headers.date;
		// 		response.message = res.message;
		// 		console.log(response);
		// 		allResponses.push(response);
		// 	})
		// 	.catch(function(res) {
		// 		response.statusCode = res.statusCode;
		// 		response.date = res.response.headers.date;
		// 		response.message = res.message;
		// 		console.log(response);
		// 		allResponses.push(response);
		// 	}),
		// 	process.env.TIMEOUT*1000
		// )
		// await rp(process.env.TARGETURL)
		// .then(function(res) {
		// 	response.statusCode = res.statusCode;
		// 	response.date = res.response.headers.date;
		// 	response.message = res.message;
		// 	console.log(response);
		// 	allResponses.push(response);
		// })
		// .catch(function(res) {
		// 	response.statusCode = res.statusCode;
		// 	response.date = res.response.headers.date;
		// 	response.message = res.message;
		// 	console.log(response);
		// 	allResponses.push(response);
		// })
	}
}

app.listen(process.env.PORT);
console.log(
  `Requesting ${process.env.TARGETURL} and listening on port ${process.env.PORT}`
);

makeRequests();

module.exports = app;
