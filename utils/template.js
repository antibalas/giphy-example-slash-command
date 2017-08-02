// Simple templating functions. Interprets all template variables <%...%> as code and
//  execute them, replacing the template variable with the result
var fs = require('fs');

var templates = {
  yelp_typeahead: fs.readFileSync(__dirname + '/../templates/yelp-template.html', {
    encoding: 'UTF-8'
  }),

  yelp_resolver: fs.readFileSync(__dirname + '/../templates/resolver-template.html', {
    encoding: 'UTF-8'
  })
};

exports.yelp_typeahead = function (data) {
  return templates.yelp_typeahead.replace(/<%[\s\S]*?%>/g, function (functionBody) {
    functionBody = functionBody.replace(/<%([\s\S]*?)%>/g, '$1');
    return Function('data', functionBody)(data);
  });
};

exports.yelp_resolver = function (data) {
  return templates.yelp_resolver.replace(/<%[\s\S]*?%>/g, function (functionBody) {
    functionBody = functionBody.replace(/<%([\s\S]*?)%>/g, '$1');
    return Function('data', functionBody)(data);
  });
};
