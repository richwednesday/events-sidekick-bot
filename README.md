# BoomBot
All you need to launch your own functional Node.js bot for Facebook Messenger together with some Natural language understanding from Wit.ai.

[Talk to Demo Bot](http://m.me/1482295225158608/)

It's as easy as:

1. Clone the boilerplate.
2. Customize message bindings and commands for your bot.
3. Push your bot to Heroku/Now and review it with Facebook.
4. You're live! :speech_balloon:

**BoomBot is a minimalistic boilerplate** and *a microframework proof-of-concept* that allows you to launch your functional bot on Messenger in a matter of minutes. It is inspired by an awesome [ruby version](https://github.com/progapandist/rubotnik-boilerplate). The main promise of **BoomBot** is to speed up bot development in Node.js and provide a more natural mental model for bot-user interactions.

**BoomBot** is also **very** beginner friendly :baby: :baby_bottle: and can be used in class to teach programming students about bots.

## Installation
Assuming you are going to use this boilerplate as a starting point for your own bot:

```bash
git clone git@github.com:richwednesday/boombot-boilerplate.git

mv boombot-boilerplate YOUR_PROJECT_NAME

cd YOUR_PROJECT_NAME

rm -rf .git # to delete boilerplate's git history
git init # to start tracking your own project

npm install
```

Now open the boilerplate in your favorite text editor and let's take a look at the structure

## Directory structure

```bash
.
├── .gitignore
├── app.js # <= !!! YOUR STARTING POINT !!!
├── boombot # an embryo for the framework
│   ├── message_dispatch.js
|   ├── postback_dispatch.js
│   ├── persistent_menu.js # design your persistent menu here
│   ├── bot-profile.js
│   ├── boombot.js
│   ├── user.js # User model, define your own containers for state
│   └── user_store.js # in-memory storage for users
├── commands # everything in this folder will become
             # methods for Dispatch classes
│   ├── commands.js # require all your commands here
│   ├── contribute.js 
│   └── feedback.js
│   └── question.js
│   └── start.js
├── package.json
├── package-lock.json
├── README.md # this readme
└── ui # convenience class to build UI elemens
    └── messenger.js

```

# Setup

## Facebook setup pt. 1. Tokens and environment variables.

Login to [Facebook For Developers](https://developers.facebook.com/). In the top right corner, click on your avatar and select **"Add a new app"**

![create app](./docs/fb_app_create.png)

In the resulting dashboard, under PRODUCTS/Messenger/Settings, scroll to **"Token Generation"** and either select an existing page for your bot (if you happen to have one) or create a new one.

![generate token](./docs/token_generation.png)

Copy **Page Access Token** and keep it at hand.

Create a file named `.env` on the root level of the boilerplate.

```js
ACCESS_TOKEN=your_page_access_token_from_the_dashboard
APP_SECRET=your_app_secret_from_the_dashboard 
```

From now on, they can be referenced inside your program as `process.env.ACCESS_TOKEN` and `process.env.VERIFY_TOKEN`.

**Note:**

## Running on localhost
Starting your bot on localhost by running this command
```
node app
```

By default, bot will run on port 5000. Start [ngrok](https://ngrok.com/) on the same port:

```
ngrok http 5000
```
This will expose your localhost for external connections through an URL like `https://92832de0.ngrok.io` (the name will change every time you restart ngrok, so better keep it running in a separate terminal tab). Make note of the URL that start with `https://`, you will give to Facebook in the next step.

![ngrok running](./docs/ngrok.png)

## Facebook setup pt. 2. Webhooks.

Now that your bot is running on your machine, we need to connect it to the Messenger Platform. Go back to your dashboard. Right under **Token Generation** find **Webhooks** and click "Setup Webhooks". In the URL field put your HTTPS ngrok address ending with `/webhook`, provide the verify token you came up with earlier and under Subscription Fields tick *messages* and *messaging_postbacks*. Click **"Verify and Save"**.

![webhook setup](./docs/webhook_setup.png)

> :tada: Congrats! Your bot is connected to Facebook! You can start working on it.  



