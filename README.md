# Yelp Slash Command for Mixmax

This is a Mixmax Slash Command that allows the user to search for local businesses on Yelp - a perfect complement to the event scheduling features already available on MixMax.

## Running locally

1. Install using `npm install`
2. Run `npm start`

To simulate locally how Mixmax calls the typeahead URL (to return a JSON list of typeahead results), run:

```
curl https://localhost:9145/yelp/typeahead?text=coffee --insecure
```

To simulate locally how Mixmax calls the resolver URL (to return HTML that goes into the email), run:

```
curl https://localhost:9145/yelp/resolver?text=coffee --insecure
```

## Why do we run it in https locally?

Mixmax slash command APIs are required to be served over https. This is because they are queried directly from the Mixmax client in the browser (using AJAX) that's running on an https domain. Browsers forbid AJAX requests from https domains to call http APIs, for security. So we must run an https server with a locally-signed certificate.

See [here](http://developer.mixmax.com/docs/integration-api-appendix#local-development-error-neterr_insecure_response) for how to fix the **ERR_INSECURE_RESPONSE** error that you might get in Chrome.
