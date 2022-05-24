'use strict';
const joi = require('joi');
const db = require('@arangodb').db;

const createRouter = require('@arangodb/foxx/router');
//const db = require('@arangodb').db;
const errors = require('@arangodb').errors;
const foxxColl = db._collection('myFoxxCollection');
const DOC_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;

const router = createRouter();

module.context.use(router);

router.get('/hello-world', function (req, res) {
    res.send('Hello World!');
  })
  .response(['text/plain'], 'A generic greeting.')
  .summary('Generic greeting')
  .description('Prints a generic greeting.');

  // continued


router.get('/hello/:name', function (req, res) {
  res.send(`Hello ${req.pathParams.name}`);
})
.pathParam('name', joi.string().required(), 'Name to greet.')
.response(['text/plain'], 'A personalized greeting.')
.summary('Personalized greeting')
.description('Prints a personalized greeting.');

router.post('/sum', function (req, res) {
    const values = req.body.values;
    res.send({
      result: values.reduce(function (a, b) {
        return a + b;
      }, 0)
    });
  })
  .body(joi.object({
    values: joi.array().items(joi.number().required()).required()
  }).required(), 'Values to add together.')
  .response(joi.object({
    result: joi.number().required()
  }).required(), 'Sum of the input values.')
  .summary('Add up numbers')
  .description('Calculates the sum of an array of number values.');


  const aql = require('@arangodb').aql;

  router.get('/entries', function (req, res) {
    const keys = db._query(aql`
      FOR entry IN ${foxxColl}
      RETURN entry._key
    `);
    res.send(keys);
  })
  .response(joi.array().items(
    joi.string().required()
  ).required(), 'List of entry keys.')
  .summary('List entry keys')
  .description('Assembles a list of keys of entries in the collection.');

