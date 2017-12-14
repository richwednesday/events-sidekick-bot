const FBMessenger = require('../ui/messenger')
const messenger = new FBMessenger(process.env.FB_PAGE_TOKEN)
const store = require('../boombot/store')
const fetch = require('node-fetch')

const sendRequest = function(endpoint, cb) {
	fetch(`${process.env.CORE_URL}${endpoint}`)
		.then(res => res.json())
    .then(json => cb(null, json))
    .catch(err => {
    	console.log(err)
    	cb (err)
    })
}

function noEventsRoll(id, coordinates) {
  let elements = [{
    content_type: 'text',
    title: 'Search New Location',
    payload: 'Search'
  }]
  messenger.sendTextMessage(id, "Sorry, we cannot find any developer event in " +
    "your location.", (err, reply) => {
      
      messenger.sendTextMessage(id, "We have saved your location and " +
        "would link you up with other developers we find in this location, " +
        "and we believe you can start a meetup... 😉", (err, reply) => {

          let text = "For now, you can check events in another location.";
          messenger.sendQuickRepliesMessage(id, text, elements)
      })
  })
}


function generatePic() {
  let pics = [
    "http://res.cloudinary.com/dlyetwndj/image/upload/v1510996978/IMG_20171007_155132_kib83t.jpg",
    "http://res.cloudinary.com/dlyetwndj/image/upload/v1510996978/IMG_20171007_171716_sl8jsu.jpg",
    "http://res.cloudinary.com/dlyetwndj/image/upload/v1510996978/IMG_20171108_055454_vn2awq.jpg",
    "http://res.cloudinary.com/dlyetwndj/image/upload/v1510996975/IMG_20171101_205048_a03w4s.jpg",
    "http://res.cloudinary.com/dlyetwndj/image/upload/v1510996976/IMG_20171108_055221_sgatfw.jpg"
  ]

  return pics[Math.floor(Math.random() * (pics.length))]
}

function rollOutEvents(id, data) {
  let events = data.events
  let nextPage = data.nextPage

  let elements = [];
  let noPic = generatePic()

  for (event of events) {
  	elements.push({
  		title: event.title,
    	subtitle: `${event.date}\n${event.venue}`,              
    	image_url: event.picture ? event.picture : noPic,
    	buttons: [{
        type: "web_url",
        url: event.link,
        title: "Register"
      }, {
        type: "postback",
        payload: event.description ? 
          event.description.length < 630 ? `DESC${event.description}` :
          `DESC${event.description.slice(0, 630)}...`
          : `DESC${event.description}`,
        title: "Description"
      }, { 
        type: "element_share"
      }]         	
  	})
  }

  if (nextPage) {
    elements.push({
      title: "Show More Events",
      image_url: process.env.MORE_EVENTS_PIC,
      buttons: [{
        type: "postback",
        title: "Give Feedback",
        payload: "Feedback"
      }, {
        type: "postback",
        title: "More Events",
        payload: `More Events,${nextPage}`
      }]
    });
  }

  messenger.sendHScrollMessage(id, elements, (e, b) => notificationsAsk(id))
}

function notificationsAsk (id) {
  let elements = [{
    "content_type": "text",
    "title": "Yes, sure",
    "payload": "Start Letters"
  }, {
    "content_type": "text",
    "title": "Not interested",
    "payload": "Stop Letters"
  }]
  let text = "If you'd like, we could send you weekend updates of upcoming events." +
    "\n\nYou can modify your settings by typing ./notifications"
  
  store.checkIfSubscribed(id, (subscribed) => {
    if (subscribed) return;
    else messenger.sendQuickRepliesMessage(id, text, elements)    
  })
}

function generateWisdom(id) {
  const wisdom = [
    '“Computer science education cannot make anybody an expert programmer any more than studying brushes and pigment can make somebody an expert painter.” − Eric S. Raymond',
    '"50% of the computer programming is trial and error, the other 50% is copy and paste."',
    '“If debugging is the process of removing software bugs, then programming must be the process of putting them in.” - Edsger Dijkstra',
    '"Good software, like wine, takes time." - Joel Spolsky 🍷',
    '"Every great developer you know got there by solving problems they were unqualified to solve until they actually did it." - Patrick McKenzie',
    'The number one skill required for learning any complex system is patience.',
    '"Make it correct, make it clear, make it concise, make it fast. In that order." – Wes Dyer',
    '"Debugging is like being the detective in a crime movie where you are also the murderer." - Filipe Fortes',
    '"One of the best programming skills you can have is knowing when to walk away for awhile." - Oscar Godson',
    '"A good programmer is someone who always looks both ways before crossing a one-way street." - Doug Linder',
    '"Programs must be written for people to read, and only incidentally for machines to execute." - Harold Abelson & Gerald Jay Sussman',
    '“Whenever I have to think to understand what the code is doing, I ask myself if I can refactor the code to make that understanding more immediately apparent.”  - Martin Fowler',
    '“It’s not at all important to get it right the first time. It’s vitally important to get it right the last time."-The Pragmatic Programmer 📖',
    '"Programming isn\'t about what you know; it\'s about what you can figure out." - Chris Pine',
    '"Keep your code absolutely simple. Keep looking at your functions and figure out how you simplify further." - John Romero',
    '"Deleted code is debugged code." - Jeff Sickel',
    '"People think that computer science is the art of geniuses but the actual reality is the opposite, just many people doing things that build on each other, like a wall of mini stones." − Donald Knuth',
  ]

  return wisdom[Math.floor(Math.random() * (wisdom.length))]
}

function holdPatience(id) {
  messenger.sendTextMessage(id, "This may take a minute. Here's some programming " +
    "wisdom while you wait: ", (err, body) => {

      messenger.sendTextMessage(id, generateWisdom())
  })

}

function saveUserLocation(id, coordinates) {
  let endpoint = `/users/location?masterKey=${process.env.CORE_API_KEY}&uid=${id}&geo=${coordinates.lat},${coordinates.long}`
  sendRequest(endpoint, (err, body) => {
    if (err) console.log(err) 
    else console.log(body)
  })
}


module.exports = {
	getLocation(id) {
		let element = [{content_type: "location"}]
		messenger.sendQuickRepliesMessage(id, "Where do you live?\n\nTell us " +
			"the name of your city or state, so we can find out what's " + 
			"going down there...", element)
		store.setState(id, "Expecting users location")
	},

  sendEvents(id, coordinates) {
    let endpoint = `/events/location?masterKey=${process.env.CORE_API_KEY}&geo=${coordinates.lat},${coordinates.long}`
    sendRequest(endpoint, (err, body) => {
      if (err) return messenger.sendTextMessage(id, "Oops an error occured, 505")
      body.events.length ? rollOutEvents(id, body) : noEventsRoll(id)
    })
  },

  sendSubscribedMessage(id) {
    messenger.sendTextMessage(id, "Developer Events... Coming right up.\n" +
      "Enough with the coding, time to get up and go out :)")
  },

	processCoordinates(id, coordinates) {
    holdPatience(id)
		this.sendEvents(id, coordinates)

		store.setLocation(id, JSON.stringify({
			lat: coordinates.lat, 
			long: coordinates.long
		}))
	  store.setState(id, "Got users location")
    saveUserLocation(id, coordinates)
	},

  processNextPage(id, pageID) {
    let endpoint = `/events/page?masterKey=${process.env.CORE_API_KEY}&pageID=${pageID}`;
    sendRequest(endpoint, (err, body) => {
      if (err) spoolEvents(id)
      else rollOutEvents(id, body)
    })
  },

	spoolEvents(id) {
		store.getLocation(id, (location) => {
			location ? this.sendEvents(id, JSON.parse(location)) :
				this.getLocation(id)	 
		})
	},

  eventDescription(id, desc) {
    desc.length ? messenger.sendTextMessage(id, desc) :
      messenger.sendTextMessage(id, "Sorry, there is no description for this " +
        "event. Please visit the link to find out more.")
  },

  topicEvents(id) {
    let elements = [
    {"content_type": "text", "title": "Machine Learning", "payload": "Topic,Machine Learning"}, 
    {"content_type": "text", "title": "Python", "payload": "Topic,Python"},
    {"content_type": "text", "title": "JavaScript", "payload": "Topic,JavaScript"},
    {"content_type": "text", "title": "AI", "payload": "Topic,AI"},
    {"content_type": "text", "title": "Android", "payload": "Topic,Android"},
    {"content_type": "text", "title": "AR/VR", "payload": "Topic,AR/VR"},
    {"content_type": "text", "title": "Wordpress", "payload": "Topic,Wordpress"},
    {"content_type": "text", "title": "Mobile", "payload": "Topic,Mobile"},
    {"content_type": "text", "title": "Kotlin", "payload": "Topic,Kotlin"},
    {"content_type": "text", "title": "Bitcoin", "payload": "Topic,Bitcoin"},
    {"content_type": "text", "title": "Startup", "payload": "Topic,Startup"},
    ]
    messenger.sendQuickRepliesMessage(id, "Please select a topic or type a topic " +
      "you want to search for", elements)
    store.setState(id, "Expecting event topic")
  },

  processTopic(id, topic) {
    store.setState(id, "Got Event Topic")
    console.log(topic)
  }

} 



