const FBMessenger = require('../ui/messenger')
const messenger = new FBMessenger(process.env.FB_PAGE_TOKEN)
const store = require('../boombot/store')

module.exports = {
	ask(id) {
		store.checkIfSubscribed(id, (state) => {
			if (state) {
				let elements = [{content_type: 'text', title: 'Yes, stop', payload: 'Stop Letters'},
				     {content_type: 'text', title: 'No, continue', payload: 'Continue Letters'}]
				messenger.sendQuickRepliesMessage(id, "Do you want to stop receiving " +
					"weekly events updates? 😓", elements)
			}
			else {
				let elements = [{content_type: 'text', title: 'Yes, sure', payload: 'Start Letters'},
				    {content_type: 'text', title: 'No, please', payload: 'Stop Letters'}]
				messenger.sendQuickRepliesMessage(id, "Do you want to receive the upcoming " +
					"events updates during the weekend? ☺️", elements)
			}
		})
	},

	stop(id) {
		messenger.sendTextMessage(id, "Alright, you have been unsubscribed from weekly " +
			"events updates.", (err, body) => {

			messenger.sendTextMessage(id, "You can still come around to check for " +
				"the top events in your location :)")		
		})
		store.removeSubscriber(id)
	},

	resume(id) {
		messenger.sendTextMessage(id, "Alright, your subscription is still intact.")
	},

	start(id) {
		messenger.sendTextMessage(id, "Yes!!, you have been added to the list.")
		store.addSubscriber(id)
	}	
}