var xml = require('libxmljs')
  , qs = require('querystring')
  , request = require('request');

function Client(appKey, opts) {
  var qp = this.qp = {};
  qp.appid = appKey;
  qp.units = 'metric';
  // Not all formats are supported yet. Needs work in pod mappers below.
  // http://products.wolframalpha.com/docs/WolframAlpha-API-Reference.pdf
  qp.format = 'plaintext,image';

  Object.keys(opts || {}).forEach(function (key) {
    qp[key] = opts[key];
  });
}

Client.prototype.query = function (input, cb) {
  if(!this.qp.appid) {
    return cb(new Error("Application key not set"), null);
  }
  if (!input) {
    return cb(null, []);
  }

  // TODO: perhaps other attributes should be set on a per query basis as well
  // at the moment everything but input is global
  this.qp.input = input;
  var uri = 'http://api.wolframalpha.com/v2/query?' + qs.stringify(this.qp);

  if (opts.debug) {
    request(uri).pipe(process.stdout);
    return;
  }

  request(uri, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      return cb(error, null);
    }

    var doc = xml.parseXml(body);
    var root = doc.root();

    if (root.attr('error').value() !== 'false') {
      var message = root.get('//error/msg').text();
      return cb(message, null);
    }

    var pods = root.find('pod').map(function (pod) {
      var subpods = pod.find('subpod').map(function (node) {
        var obj = {};
        obj.title = node.attr('title').value();
        obj.value = node.get('plaintext').text();
        if (node.get('img')) { // if format does not include image, this isnt set
          obj.image = node.get('img').attr('src').value();
        }
        return obj;
      });
      return { subpods: subpods };
    });
    cb(null, pods);
  });
};

exports.createClient = function(appKey) {
  return new Client(appKey);
};
