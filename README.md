# richen-library

Visit a production view of the application here at [richen-library](https://richen-library.herokuapp.com/)

List your favourite books! Organize them by genre and update information right inside the application. Authenticated and secure, this application was built using [NodeJS](https://nodejs.org/en/), [ReactJS](https://reactjs.org/), [MongoDB](https://www.mongodb.com/), [Apollo GraphQL](https://www.apollographql.com/), [ExpressJS](https://expressjs.com/) and also includes the following frameworks:

- [apollo-server-express](https://www.npmjs.com/package/apollo-server-express) for connecting express with Apollo in production
- [Mongoose](https://mongoosejs.com/) for MongoDB
- [eslint](https://www.npmjs.com/package/eslint) for linting
## Motivation

Originally making this for the [fso2020](https://fullstackopen.com/en/) course, I've decided to maintain it and showcase it.

It shows knowledge of Apollo GraphQL Queries, Mutations, Subscriptions, Fragments, and Error Handling. This application also outlines User Authentication, State Management, and Production Pipelines.
## Local Development

- `git fork` or `git clone` this repository and save it locally
- run `npm install` to get dependencies
- for development run `npm run dev-server` and `npm run dev-client`
    - make sure all files in `src/services/` point to the correct endpoints
- for production run `npm build` to build the ui and `npm run start` to start the server
    - make sure you change the endpoints in `src/services/` !!!

## Contributing

Fork this repository. Using the above local development changes.

Make a new branch for your changes and add it to the forked repository you created. Name it related to your fix / refactor `eg. hotfix-styling-login`. Then, make a pull request with your changes and our team will review it.

## TODO

The majority of the older commits seem vague and I plan to add a changelog to accommodate. However, for now the exercises in the application can be viewed:

- [Part 8: GraphQL](https://fullstackopen.com/en/part8)
 
 Note the links are for Full Stack Open 2021, and this project is based of Full Stack Open 2020. Nothing much has changed in the curriculum from the looks of it.