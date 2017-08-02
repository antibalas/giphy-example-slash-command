'use strict';

const createTemplate = require('../utils/template.js').yelp_typeahead;
const yelp = require('yelp-fusion');
const yelpConfig = require('../utils/yelp_config.js');
const _ = require('underscore');

const clientID = yelpConfig.clientID;
const clientSecret = yelpConfig.clientSecret;

module.exports = function(req, res) {
  var term = req.query.text.trim();
  if (!term) {
    res.json([{
      title: '<i>(enter a search term such as coffee)</i>',
      text: ''
    }]);
    return;
  }

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
      res.json(results);
    }
  }).catch(e => {
    res.status(500).send("Failed to get businesses " + e);
  });
};

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
    name: business.name,
    title: createTemplate({
      name: business.name,
      image_url: business.image_url,
    }),
    display_address: business.location.display_address,
    display_phone: business.display_phone,
    text: JSON.stringify(entry)
  };
}

function buildResponse(businesses) {
  return _.chain(businesses)
    .reject(isInvalidBusiness)
    .map(formatBusiness)
    .value();
}
