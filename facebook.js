'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

var exports = {};

const token = "EAAS6Ppy5MfcBAEEuoEdWEAmLrVWtLtUKlCtBU9q2ZAA1KJaKf8LBeQY23yGTHY4tZBQfkDtlF3JYU06M1SWYYXiuW77qgCPOZA4ms3cZC7uH3dIBK5fK4tsSJveXcChMzEFTk3CmGE6mRSZAf7II13UBXdCqZBIpGtuSpEWyHDvAZDZD"


app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Facebook API twerks')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'test_token') {
        res.send(req.query['hub.challenge'])
    } else {
        res.send('Error, wrong token')
    }
})

exports.listen = function () {
    // Spin up the server
    app.listen(app.get('port'), function() {
        console.log('running on port', app.get('port'))
    })
};

app.post('/webhook/', function (req, res) {

    let messaging_events = req.body.entry[0].messaging;
    
    for (let i = 0; i < messaging_events.length; i++) {

        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        
        if (event.message && event.message.text) {
            let text = event.message.text
            sendTextMessage(sender, text); 
        }
    	if (event.postback) {
            let text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
     	}
    }
    
    res.sendStatus(200)
})

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

// function callApi(sender, text) {

//     request({
//         url: 'http://192.81.209.68/api/',
//         method: 'POST',
//         json: {
//             text: text,
//             facebook :  sender 
//         }
//     }, function(error, response, body) {
//         // if (error) {
//         //     console.log('Error sending messages: ', error)
//         // // } else if (response.body.error) {
//         //     // console.log('Error: ', response.body.error)
//         // }

        
//         // var url = response.body.image;
//         // var message = body.text;
        
//         // if (message ) sendTextMessage(sender, message ); 
        
//         // if (url) {
            
//         //     refreshGrid(sender,url, function(result) {

//         //         console.log(result);
//         //     });
            
//         // } 
        
//     })
// }

function sendGenericMessage(sender, image) {
	let messageData = {

        "attachment": {
			"type": "image",
			"payload": {
				"url"	: image,
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

app.post("/send", function(req, res){

    var facebookIds = req.body.facebookIds;

    for (var i = 0; i < facebookIds.length; i++ ) {

        var image = req.body.image;
        if (image) {

            refreshGrid(facebookIds[i], image, function(result) {

                console.log(result);
            });
        }
        sendTextMessage(facebookIds[i], req.body.text);
    }

    var slackIds = req.body.slackIds;

    for (var i = 0; i < slackIds.length; i++ ) {

        var image = req.body.image;
        if (image) {

            slackRefreshGrid(image, slackIds[i]);
        }
        bot.postMessage(slackIds[i], req.body.text);
    }

	//bot.postMessage("D25K85JSX", req);
    res.send(req.body);    // echo the result back
    
});


app.get("/send", function(req, res){    

    
    res.send('GET')
    var sender = "10157758880380472";
    sendTextMessage(sender,sender);
    
	//bot.postMessage("D25K85JSX", req);
	
});

module.exports = exports;