Boardgames API!

Welcome to my board games API which holds all of the content that is required for the front-end side of this project. This readme will go through the steps required to access your own personal version of this API.

1: Forking

Fork your own version of this repo to your GitHub account. The fork button is located to the top right of this page.
Clone your fork of this repository and cd into it in your terminal, then open in your code editor.

`gh repo clone YOUR_GITHUB_ACCOUNT/nc-be-games-Eth4nF`

2: Dependencies

All of the current dependencies needed can be installed by running the command: `npm i`

3: Setup

For the database to work as intended, you will need to create your own .env files.
run the command `npm run setup-dbs`

Create test env file .env.test Inside this file, write the following line of code:
PGDATABASE=nc_games_test
This will set the environment to test when running our test command, npm run test.

Create development env file .env.development Inside this file, write the following line of code:
PGDATABASE=nc_games


4: Seeding the data

to seed the data, enter the terminal command:

`npm run seed`

do this twice to initialise the db after you have read through the setup env part of the readme.

5: Run tests
To run the provided tests, use terminal command:

`npm run test`

Here is the link to the hosted backend: https://back-end-project-ethanf.herokuapp.com/api
To access the endpoints, just type "/" followed by any of these key words/terms: categories, reviews (after reviews, type "/" follwed by a number to access an individual review), users (similar to reviews, type "/" followed by any of the usernames to access data about a specific user.
