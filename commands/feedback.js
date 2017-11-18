const FBMessenger = require('../ui/messenger')
const messenger = new FBMessenger(process.env.FB_PAGE_TOKEN)
const store = require('../boombot/store')

module.exports = {
	askForFeedback(id) {
		messenger.sendTextMessage(id, "Your feedback is much appreciated. \nThis will " +
			"help us improve this application: ")
		store.setState(id, "Expecting user Feedback") 
	},

	thankForFeedback(id) {
		messenger.sendTextMessage(id, "Thank you for your feedback. We'll look " +
			"into it. 👍")
		store.setState(id, "Got User Feedback")
	}
}
