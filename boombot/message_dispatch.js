const commands = require('../commands/commands') 
const PostbackFilter = require('./postback_dispatch').PostbackFilter
const FBMessenger = require('../ui/messenger')
const messenger = new FBMessenger(process.env.FB_PAGE_TOKEN)
const store = require('../boombot/store')

function defaultText(id) {
  let elements = [{
    content_type: 'text',
    title: 'Yes',
    payload: 'Spool'
  }]
  messenger.sendQuickRepliesMessage(id, "Not sure what that means.\n\n" +
    "Do you want to see the Developer Events in your location?", elements)
}

function attachmentsHandler(id, attachments, state) {
  if (state === "Expecting users location") {
    commands.search.processCoordinates(id, attachments[0].payload.coordinates)
  }
  else {
    defaultText(id)
  }
} 

function messageTextHandler(id, message, state) {
  console.log(state)

  if (message.toLowerCase() === "get started" || message.toLowerCase() === "help") {
    commands.start(id, message)
  }
  else if (message.toLowerCase() === "feedback") {
    commands.askForFeedback(id)
  }
  else if (message.toLowerCase() === "./notifications") {
    commands.notifications.ask(id)
  }
  else if (message.toLowerCase() === "./events") {
    commands.search.spoolEvents(id)
  }
  else if (message.toLowerCase() === "./create") {
    commands.create(id)
  }
  else if (state === "Expecting users location") {
    commands.location(id, message)
  }
  else if (state === "Expecting user Feedback") {
    commands.feedback.thankForFeedback(id)
  }
  else {
    defaultText(id)
  }
}

// Routing for messages
function MessageDispatch(event) {
	const senderID = event.sender.id
  const message = event.message

  console.log(`Received message for user ${senderID} with message: `)
  console.log(message)

  // You may get a text, attachment, or quick replies but not all three
  let messageText = message.text;
  let messageAttachments = message.attachments;
  let quickReply = message.quick_reply;
  
  // Quick Replies contain a payload so we take it to the Postback
  if (quickReply) {
    PostbackFilter(senderID, quickReply.payload);
  }

  else if (messageAttachments) {
    store.getState(senderID, (state) => {
      attachmentsHandler(senderID, messageAttachments, state);
    })
  } 
  
  else if (messageText) {
    store.getState(senderID, (state) => {
      messageTextHandler(senderID, messageText, state);
    })
  }
}

module.exports = MessageDispatch