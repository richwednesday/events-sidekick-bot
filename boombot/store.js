const redis = require('redis');
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_URL,
	{no_ready_check: true});

client.on("error", err => console.log("Error " + err));
client.on('connect', () => console.log('Connected to Redis'))

module.exports = {
	setState(id, value) {
		client.set(id, value)
	},

	getState(id, cb) {
		client.get(id, (err, reply) => {
			if (err) {
				console.log(err)
				cb(null)
			}
			cb(reply)
		})
	},

	setLocation(id, location) {
		client.set(`${id}-location`, location)
	},

	getLocation(id, cb) {
		client.get(`${id}-location`, (err, reply) => {
			if (err) {
				console.log(err)
				cb(null)
			}
			cb(reply)
		})	
	},

	getSubscribers(cb) {
		client.hkeys("subscribers", (err, replies) => {
			if (err) return console.log(err)
			cb(replies)
		})
	},

	addSubscriber(id) {
		client.hset("subscribers", id, "true")
	},

	removeSubscriber(id) {
		client.hdel("subscribers", id)
	},

	checkIfSubscribed(id, cb) {
		this.getSubscribers(reply => {
			reply.indexOf(id) >= 0 ? cb(true) : cb(false) 
		})
	}

}