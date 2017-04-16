var test = require('bandage');
var  wolfram = require('..');

test('maths', function *(t) {
  var client = wolfram.createClient(process.env.WOLFRAM_APPID);

  var result = yield client.query("integrate 2x");
  t.ok(Array.isArray(result), "result is an array");
  t.equal(result.length, 2, "with 2 result pods");
  t.equal(result[0].primary, true, "first pod should be primary");
  t.ok(Array.isArray(result[0].subpods), "subpods present");
  t.ok(result[0].subpods[0].text.indexOf('x^2 + constant') >= 0, 'answer');
  t.ok(result[0].subpods[0].image, "image answer");
});

test('simple', function *(t) {
  var client = wolfram.createClient(process.env.WOLFRAM_APPID);
  var result = yield client.query("1+1");
  t.ok(Array.isArray(result), "result is an array");
  t.equal(result.length, 6, "with 6 result pods");
  t.ok(!result[0].primary, "first pod not primary");
  t.equal(result[0].subpods[0].text, '1 + 1', 'interpretation in pod 1');
  t.ok(result[1].primary, 'second pod primary');
  t.equal(result[1].subpods[0].text, '2', 'answer in pod 2');
});

test('noanswer', function *(t) {
  var client = wolfram.createClient(process.env.WOLFRAM_APPID);

  var result = yield client.query("adh89u8n0eudhdah");
  t.ok(Array.isArray(result), "result is an array");
  t.equal(result.length, 0, 'but no pods found');
});

test('missingAppId', function *(t) {
  var client = wolfram.createClient();

  try {
    yield client.query("integrate 2x");
    t.ok(false, 'should not be here');
  }
  catch (e) {
    t.ok(/key not set/.test(e), "error contains reason");
  }
});

test('badAppId', function *(t) {
  var client = wolfram.createClient("bogus-trololoo");

  try {
    yield client.query("integrate 2x");
    t.ok(false, 'should not be here');
  }
  catch (e) {
    t.equal(typeof e, "string", "error should be a string describing the message");
  }
});
