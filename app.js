var AWS        = require('aws-sdk')      // AWS SDK for Node.js - http://aws.amazon.com/sdk-for-node-js/
var DOC        = require("dynamodb-doc") // AWS Labs DynamoDB Document SDK - http://github.com/awslabs/dynamodb-document-js-sdk
var express    = require('express')      // ExpressJS
var bodyParser = require('body-parser')  // ExpressJS Body Parser
var uuid       = require('node-uuid')    // Node UUID

// Set some constants
var hostname = "api.travb.co"
var port = 80
AWS.config.update({region: "us-east-1"})

// Instantiate instances of Dynamo Document SDK and Express
var dynamo = new DOC.DynamoDB();
var app = express()

// Use express middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Create a 'user' resource in the DynamoDB table 'users'
app.post('/user', function(req, res) {
    user = req.body
    user.id = uuid.v4()
    dynamo.putItem({ TableName:"users", Item:user }, function (err, data) {
        if (err)
            res.status(500).json(err)
        else
            res.status(201).location("http://"+hostname+"/user/"+user.id).end()
    })
})

// Fetch a 'user' resource from the DynamoDB table 'users' with key 'id'
app.get('/user/:id', function(req, res) {
    dynamo.getItem({ TableName:"users", Key: { id:req.params.id }}, function (err, data) {
        if (err)
            res.status(500).json(err)
        else
            res.status(200).json(data.Item)
    })
})

// Now that we've defined our routes, run the server
app.listen(port)