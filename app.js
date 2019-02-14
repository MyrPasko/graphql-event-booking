const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema= require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

/** [String!]! Not return null. It can be empty object, but not null (check it in the DOCS)
 * Something! - This must never be null!
 * 'events' can take arguments too.
 * ID - special type, must be unique, GQL add it by itself
 * 'input' - special type for inputs(properties of data object)
 * Check the password field in User schema. It must be nullable
 * Check the password field in UserInput schema. It must not be nullable*/

app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true                   // little text redactor for queries
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
    }@graphql-learn-cluster-juk75.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
    .then(() => {
        app.listen(4000);
    })
    .catch((err) => {
        console.log("Error from connection: ", err);
    });

