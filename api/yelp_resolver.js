'use strict';

const createTemplate = require('../utils/template.js').yelp_resolver;
const yelp = require('yelp-fusion');
const yelpConfig = require('../utils/yelp_config.js');
const _ = require('underscore');

const clientID = yelpConfig.clientID;
const clientSecret = yelpConfig.clientSecret;

module.exports = function(req, res) {
  try {
    var term = JSON.parse(req.query.text.trim());
    handleIdString(term, res);
  } catch (e) {
    /* 
      Need to hit Yelp API again because user hit enter before search 
      result could be returned
    */
    var term = req.query.text.trim();
    handleSearchString(term, req, res);
  }
};

function handleIdString(term, res) {
  var image = term.title;
  res.json({
    body: createTemplate({
      name: term.name,
      url: term.url,
      artwork_url: term.image,
      address: term.display_address,
      phone: term.display_phone,
      category: term.category
    })
  });
}

function handleSearchString(term, req, res) {
  yelp.accessToken(clientID, clientSecret).then(response => {
    const client = yelp.client(response.jsonBody.access_token);
    return client.search({
      term: term,
      location: 'San Francisco, CA',
      limit: 4
    });
  }).catch(e => {
    res.status(500).send("Failed to get access_token " + e);
  }).then(response => {
    var results = buildResponse(response.jsonBody.businesses);
    if (results.length === 0) {
      res.json([{
        title: '<i>(no results)</i>',
        text: ''
      }]);
    } else {
      res.json(results[0]);
    }
  }).catch(e => {
    res.status(500).send("Failed to get businesses " + e);
  });
}

function buildResponse(businesses) {
  return _.chain(businesses)
    .reject(isInvalidBusiness)
    .map(formatBusiness)
    .value();
}

function isInvalidBusiness(business) {
  return !business || !business.image_url;
}

function formatBusiness(business) {
  var entry = {};
  entry.name = business.name;
  entry.image = business.image_url;
  entry.display_address = business.location.display_address;
  entry.display_phone = business.display_phone;
  entry.url = business.url;
  entry.category = business.categories[0].title;

  return {
    body: createTemplate({
      name: entry.name,
      url: entry.url,
      artwork_url: entry.image,
      address: entry.display_address,
      phone: entry.display_phone,
      category: entry.category
    }),
    display_address: business.location.display_address,
    display_phone: business.display_phone,
    text: JSON.stringify(entry)
  };
}
