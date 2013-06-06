# Wolfram|Alpha API wrapper for Node.js
Wolfram is a simple Wolfram|Alpha API wrapper for Node.js with support for both plaintext and image results.

At the moment all the query parameters are customizable as per the [API reference](http://products.wolframalpha.com/docs/WolframAlpha-API-Reference.pdf), but not everything that can appear in the result XML is parsed yet.

## Usage
Register for an application ID in the [Wolfram|Alpha developer website](http://products.wolframalpha.com/developers/).

Install the module with npm, and install the libxml dependency in your OS first:

```bash
sudo apt-get install libxml2-dev
npm install wolfram
```

Example usage:

```javascript
var wolfram = require('wolfram').createClient("APIKEY-HERE");

wolfram.query("integrate 2x", function (err, result) {
  if (err) throw err;
  console.log("Result: %j", result);
});
```

## Running tests
Set the API key as an environment variable, then run the library's test command:

```bash
export WOLFRAM_APPID=APIKEY-HERE
npm test
```

## License
MIT-Licensed.
