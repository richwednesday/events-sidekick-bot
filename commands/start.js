const FBMessenger = require('../ui/messenger')
const messenger = new FBMessenger(process.env.FB_PAGE_TOKEN)

module.exports = function(id) {
	let text = "What would you like to begin with: ";
	let elements = [
    {
      content_type: 'text',
      title: 'Find Events ⚛️',
      payload: 'Search'
    },
    {
      content_type: 'text',
      title: 'Find Devs 👨‍💻 👩‍💻',
      payload: 'Find'
    }
    // {
    //   content_type: 'text',
    //   title: 'Create Event 🌇',
    //   payload: 'Create'
    // }
  ]
	messenger.sendTextMessage(id, "Welcome, We're glad you're here ❤️", (err, body) => {
    	
		messenger.sendTextMessage(id, "You can find Developer events in your " +
			"location, connect, and share ideas.", (err, body) => {  
    		
    		messenger.sendTextMessage(id, "You can also find fellow Developers where " +
          "you are, create an event, and grow a community.", (err, body) => {
    	
    			messenger.sendQuickRepliesMessage(id, text, elements)	
    		})
    	})
	})
}
