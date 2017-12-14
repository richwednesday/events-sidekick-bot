const commands = require('../commands/commands') 
const PostbackFilter = require('./postback_dispatch').PostbackFilter
const FBMessenger = require('../ui/messenger')
const messenger = new FBMessenger(process.env.FB_PAGE_TOKEN)
const store = require('../boombot/store')

let yesReplies = ["yes", "yea", "yup", "ya", "yep", "yaaaaas", "totally", "totes",
  "sure", "you bet", "for sure", "sure thing", "certainly", "definitely", "yeah",
  "of course", "gladly", "indubitably", "absolutely", "indeed", "undoubtedly", "aye"]
let noReplies = ["no", "nope", "naa", "nah", "neh", "nay", "at all", "not at all",
  "negative", "Uhn Uhn", "no way"]

let ai = {
  provideHelp(id) {
    messenger.sendTextMessage(id, "Type 👉 ./events to see your developer events,", (e, r) => {
      messenger.sendTextMessage(id, "👉 ./create to create a developer event,", (e, r) => {
        messenger.sendTextMessage(id, "👉 ./notifications to manage your notifications,", (e, r) => {
          messenger.sendTextMessage(id, "👉 ./help to land here", (e, r) => {
            messenger.sendTextMessage(id, "and 👉 ./feedback to help this bot get better.")    
          })
        })
      })    
    })
  },

  sayGoodbye(id) {
    messenger.sendTextMessage(id, "Bye, bye!")
  },

  noProfanity(id) {
    messenger.sendTextMessage(id, "Uh...rude.")
  },

  lovelyWord(id) {
    messenger.sendTextMessage(id, "Glad you love this. Please share with your friends lets grow the developers network.")
  },

  okayTimes(id) {
    messenger.sendTextMessage(id, "👍")
  }
}


function defaultText(id) {
  let elements = [{
    content_type: 'text',
    title: 'Yes',
    payload: 'Spool'
  }]
  messenger.sendQuickRepliesMessage(id, "Not sure what that means.\n\n" +
    "Do you want to see the Developer Events in your location?", elements)
  store.setState(id, "Asking to spool")
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

  if (message.toLowerCase() === "get started") {
    commands.start(id, message)
  }

  else if (state === "Expecting users location") {
    commands.location(id, message)
  }
  else if (state === "Expecting user Feedback") {
    commands.feedback.thankForFeedback(id)
  }
  else if (state === "Expecting event topic") {
    commands.search.processTopic(id, message)
  }

  else if (state === "Notications for subscriber") {
    if (new RegExp(yesReplies.join("|"), 'i').test(message)) {
      commands.notifications.stop(id)
    }
    else if (new RegExp(noReplies.join("|"), 'i').test(message)) {
      commands.notifications.resume(id)
    }
    else {
      messenger.sendTextMessage(id, "Please reply with yes or no")
    }
  }
  else if (state === "Notications for non subscriber") {
    if (new RegExp(yesReplies.join("|"), 'i').test(message)) {
      commands.notifications.start(id)
    }
    else if (new RegExp(noReplies.join("|"), 'i').test(message)) {
      commands.notifications.stop(id)
    }
    else {
      messenger.sendTextMessage(id, "Please reply with yes or no")
    }
  }
  else if (state === "Asking to spool") {
    if (new RegExp(yesReplies.join("|"), 'i').test(message)) {
      commands.search.spoolEvents(id)
    }
    else if (new RegExp(noReplies.join("|"), 'i').test(message)) {
      helpFunction(id)
    }
    else {
      messenger.sendTextMessage(id, "Please reply with yes or no")
    }
  }

  else if (/feedback/i.test(message)) commands.askForFeedback(id)
  else if (/notification/i.test(message)) commands.notifications.ask(id)
  else if (/events/i.test(message)) commands.search.spoolEvents(id)
  else if (/create/i.test(message)) commands.create(id)


  else if (/help/i.test(message)) ai.provideHelp(id)

  else if (/love/i.test(message)) ai.lovelyWord(id)

  else if (/ok/i.test(message)) ai.okayTimes(id)

  else if (/brb/i.test(message)) ai.sayGoodbye(id)
  else if (/bye/i.test(message)) ai.sayGoodbye(id)
  else if (/later/i.test(message)) ai.sayGoodbye(id)

  else if (/fuck/i.test(message)) ai.noProfanity(id)

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