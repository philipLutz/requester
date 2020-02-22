"use strict";

const express = require('express');
const dotenv = require('dotenv');
const request = require('request');
const app = express();

// Make URL and rate of requests a variables in .env

async function makeRequests() {
  try {
    await request('http://localhost:8080', function (error, response, body) {
      console.error('error:', error);
      console.log('statusCode:', response && response.statusCode);
      setTimeout(function() {
        makeRequests();
      }, 1000);
    });
  } catch(error) {
    console.log(error);
    setTimeout(function() {
      makeRequests();
    }, 1000);
  }
}
console.log('Requester running');

makeRequests();

module.exports = app;
