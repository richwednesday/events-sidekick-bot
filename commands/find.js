const FBMessenger = require('../ui/messenger')
const messenger = new FBMessenger(process.env.FB_PAGE_TOKEN)
const store = require('../boombot/store')


let developers = [
    {
      content_type: 'text',
      title: 'Front end',
      payload: 'DevType,Frontend'
    },
    {
      content_type: 'text',
      title: 'Back end',
      payload: 'DevType,Backend'
    },
    {
      content_type: 'text',
      title: 'iOS/Android',
      payload: 'DevType,iOS/Android'
    },
    {
      content_type: 'text',
      title: 'UI/UX',
      payload: 'DevType,UI/UX'
    },
	{
      content_type: 'text',
      title: 'Graphics Design',
      payload: 'DevType,Graphics'
    },
    {
      content_type: 'text',
      title: 'Data Scientist',
      payload: 'DevType,Data Scientist'
    },
    {
      content_type: 'text',
      title: 'Game Developer',
      payload: 'DevType,Game Developer'
    }
]

module.exports = {
	launch(id) {
		let text = "What type of developer best describes you?"
		messenger.sendQuickRepliesMessage(id, text, developers)
		store.setState(id, "Type of developer")
	},

	processDevType(id, type) {
		store.getLocation(id, (location) => {
			location ? this.nextStep(id, location) : this.askLocation(id)
		})
	},

	nextStep(id, ) {
		messenger.sendTextMessage(id, "Got that, would let you know what I find.")
	}

	askLocation(id) {
		let element = [{content_type: "location"}]
		messenger.sendQuickRepliesMessage(id, "Lastly, send your location " +
			"below. \n\nYou can type it or use the send location button."
		store.setState(id, "Expecting users location for connect")
	}
}