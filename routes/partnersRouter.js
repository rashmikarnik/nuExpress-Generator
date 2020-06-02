const express = require('express');
const bodyParser = require('body-parser');

const partnersRouter = express.Router();

/*partner router path */
partnersRouter.use(bodyParser.json());
partnersRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the Partners to you');
})
.post((req, res) => {
    res.end(`Will add the Partners: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Partners');
})
.delete((req, res) => {
    res.end('Deleting all Partners');
});

/*End Points */
partnersRouter.route('/:partnersId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})

.get((req, res) => {
    res.end(`Will send the detail of partner: ${req.params.partnersId} to you`);
})

.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /partner/${req.params.partnersId}`);
})

.put((req, res) => {
    res.write(`Updating the partners: ${req.params.partnersId}\n`);
    res.end(`Will update the partners: ${req.body.name}
        with description: ${req.body.description}`);
})

.delete((req, res) => {
    res.end(`Deleting partners: ${req.params.partnersId}`);
});

module.exports = partnersRouter;