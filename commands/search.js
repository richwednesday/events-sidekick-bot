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

function noEventsRoll(id) {
  let elements = [{
    content_type: 'text',
    title: 'Search Another Location',
    payload: 'Search'
  }]
  messenger.sendQuickRepliesMessage(id, "Sorry, we cannot find any developer event in " +
    "your location.", elements)
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
        title: "Link to Event"
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
    "title": "No",
    "payload": "Stop Letters"
  }]
  let text = "Do you want to receive the Weekend Devloper Events just " +
    "like this one? \n\nYou can modify your settings by typing ./notifications"
  
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
  messenger.sendTextMessage(id, "This may take a minute. Here's a programming " +
    "wisdom while you wait: ", (err, body) => {

      messenger.sendTextMessage(id, generateWisdom())
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

	processCoordinates(id, coordinates) {
    holdPatience(id)

		let endpoint = `/events/location?masterKey=${process.env.CORE_API_KEY}&geo=${coordinates.lat},${coordinates.long}`
		sendRequest(endpoint, (err, body) => {
			if (err) return messenger.sendTextMessage(id, "Oops an error occured, 505")
			body.events.length ? rollOutEvents(id, body) : noEventsRoll(id)
		})
		store.setLocation(id, JSON.stringify({
			lat: coordinates.lat, 
			long: coordinates.long
		}))
		store.setState(id, "Got users location")
	},

  processNextPage(id, pageID) {
    let endpoint = `/events/page?masterKey=${process.env.CORE_API_KEY}&pageID=${pageID}`;
    sendRequest(endpoint, (err, body) => {
      if (err) return messenger.sendTextMessage(id, "Oops an error occured, 505")
      rollOutEvents(id, body);
    })
  },

	spoolEvents(id) {
		store.getLocation(id, (location) => {
			location ? this.processCoordinates(id, JSON.parse(location)) :
				this.getLocation(id)	 
		})
	}

} 



