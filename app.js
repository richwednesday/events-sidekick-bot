'use strict'
require('dotenv').config()

const child_process = require("child_process");
const bodyParser = require('body-parser');
const express = require('express');
const Boombot = require('./boombot/boombot')


console.log("Launching cron service...");
child_process.fork("cron.js", ['FORKED']);

// Enable "Get Started" button, greeting and persistent menu for your bot
// Can uncomment this code to set it
// Boombot.BotProfile.enableGetStarted()
// Boombot.BotProfile.setGreeting()
// Boombot.PersistentMenu.enable()

// Webserver parameter
const PORT = process.env.PORT

// Starting our webserver and putting it all together
const app = express();
app.use(bodyParser.json())

app.post('/webhook', (req, res) => {
  console.log(req.body)

  let data = req.body;

  if (data.object == 'page') {    
    data.entry.forEach((pageEntry) => {
      
      // Iterate over each messaging event
      if (pageEntry.messaging) { 
        pageEntry.messaging.forEach((messagingEvent) => {
          if (messagingEvent.message) {
            Boombot.MessageDispatch(messagingEvent);
          } else if (messagingEvent.postback) {
            Boombot.PostbackDispatch(messagingEvent);
          } else {
            console.log("Webhook received unknown messagingEvent: ", messagingEvent);
          }
        });
      }
      else console.log("Webhook received unknown Event: ", pageEntry)
    });

    res.sendStatus(200);
  }

});

app.listen(PORT);
console.log('Developer Events listening on :' + PORT + '...');
