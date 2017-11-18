const FBMessenger = require('../ui/messenger')
const messenger = new FBMessenger(process.env.FB_PAGE_TOKEN)
const store = require('../boombot/store')
const fetch = require('node-fetch')

const processCoordinates = require('./search').processCoordinates

module.exports = function(id, location) {
	fetch(`http://api.opencagedata.com/geocode/v1/json?q=${location}&key=${process.env.OPEN_CAGE_KEY}`)
		.then(function(res) {
		    return res.json();
		}).then(function(json) {
			let items = json.results;
		    let elements = [];
		    let text = "Hmm...can you be more specific? Or you can try typing " +
			    "the name of a nearby city."

		    if (items.length > 1) {
			    for (let item of items) {
			    	elements.push({
			    		content_type: "text",
						title: item.formatted.replace(/[0-9]/g, ''),
						payload: `Geometry,${item.geometry.lat},${item.geometry.lng}` 
			    	})
			    }
			    messenger.sendQuickRepliesMessage(id, text, elements)
			}

			else if (items.length === 1) {
				processCoordinates(id, {lat: items[0].geometry.lat, long: items[0].geometry.lng})
			}

			else {
				messenger.sendTextMessage(id, text)
			}
		});
}
