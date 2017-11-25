const FBMessenger = require('../ui/messenger')
const messenger = new FBMessenger(process.env.FB_PAGE_TOKEN)

// Enables persistent menu for your bot
PersistentMenu = {
  enable() {
  	// Design your persistent menu here:
  	messenger.setMessengerProfile({
      persistent_menu: [
        {
          locale: 'default',
          composer_input_disabled: false,
          call_to_actions: [
            {
            	type: 'nested',
              title: '⚛️ Search Events',
              call_to_actions: [
                {
                  type: 'postback',
                  title: '⚛️ Get Events Now',
                  payload: 'Spool'
                },
                {
                  type: 'postback',
                  title: '⚛️ Get Events in New Location',
                  payload: 'Search'
                },
                {
                  type: 'postback',
                  title: '⚛️ Get Events By Topic',
                  payload: 'Topic'
                }
              ]
            },
            {
              type: 'postback',
              title: '🌇 Create Event',
              payload: 'Create'
            },
            {
              type: 'nested',
              title: '👤 Prefernces',
              call_to_actions: [
                {
                  type: 'postback',
                  title: '🔦 Feedback',
                  payload: 'Feedback'
                },
                {
                  type: 'postback',
                  title: '🔔 Notifications',
                  payload: 'Notifications'
                }  
              ]
            }
          ]
        }
      ]
    })
  }
}

module.exports = PersistentMenu
