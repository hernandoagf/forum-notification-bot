# Forum Proposal Notification bot

A bot to post Proposal notifications on Discourse, Discord and through Email

## Requirements

In order to make this bot work, you would need:

- A Discourse webhook for topic events
- A Discourse API key to post replies
- A Discourse group that will receive notifications
- A Discord bot token
- A Discord role that will receive notifications

## Developer quickstart

- Install the dependencies: `yarn install`
- Copy the contents of the `.env.sample` file into a a new `.env` file and replace with your own information
- Run the bot using `yarn build` and `yarn start` or just `yarn dev` to run the bot with hot reloading
