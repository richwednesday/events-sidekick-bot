const FBMessenger = require('../ui/messenger')
const messenger = new FBMessenger(process.env.FB_PAGE_TOKEN)
const store = require('../boombot/store')

module.exports = function(id) {
	messenger.sendTextMessage(id, "The Developer Events Bot curates events from " +
		"different sources and if you create an event in any of these platforms, " +
		"you would find them on here.", (err, body) => {

		messenger.sendButtonsMessage(id, "1. Create an Event in a Facebook Developer " +
			"Circle.\n\nJoin or create a Developer Circle Group around you to " +
			"collaborate, learn, and code with other local developers.", [{
	            type: "web_url",
		        url: "https://developers.facebook.com/developercircles",
		        title: "Find a Circle"
        	}], (err, body) => {
          		
      		messenger.sendButtonsMessage(id, "2. Create an Event on Eventbrite", [{
				type: "web_url",
		        url: "https://www.eventbrite.com/create/",
		        title: "Go to Eventbrite"
			}], (err, body) => {

				messenger.sendButtonsMessage(id, "3. Create an Event on Meetup\n\n" +
					"Please ensure your event is an open event to be listed here.", [{
					type: "web_url",
			        url: "https://www.meetup.com/",
			        title: "Go to Meetup"
				}])

			})

        })	

	})

}
