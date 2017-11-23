const FBMessenger = require('../ui/messenger')
const messenger = new FBMessenger(process.env.FB_PAGE_TOKEN)
const store = require('../boombot/store')

module.exports = {
	askForFeedback(id) {
		messenger.sendTextMessage(id, "Your feedback is very much appreciated as it will " +
			"help us improve this application: ")
		store.setState(id, "Expecting user Feedback") 
	},

	thankForFeedback(id) {
		messenger.sendTextMessage(id, "We appreciate your feedback. We would look " +
			"specially at it. 👍")
		store.setState(id, "Got User Feedback")
	}
}
