Boardgames API!

Welcome to my board games API which holds all of the content that is required for the front-end side of this project. This readme will go through the steps required to access your own personal version of this API.

1: Forking

Fork your own version of this repo to your GitHub account. The fork button is located to the top right of this page.
Clone your fork of this repository and cd into it in your terminal, then open in your code editor.

gh repo clone YOUR_GITHUB_ACCOUNT/nc-be-games-Eth4nF

2: Dependencies

All of the current dependencies needed can be installed by running the command: npm i

3: Seeding the data

to seed the data, enter the terminal command:

npm run seed

do this twice to initialise the db after you have read through the setup env part of the readme.

4. Run tests
To run the provided tests, use terminal command:

npm run test

5: Setup

For the database to work as intended, you will need to create your own .env files.

Create test env file .env.test Inside this file, write the following line of code:
PGDATABASE=nc_games_test
This will set the environment to test when running our test command, npm run test.

Create development env file .env.development Inside this file, write the following line of code:
PGDATABASE=nc_games
