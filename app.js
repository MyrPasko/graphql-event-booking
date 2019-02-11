const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose');

const app = express();

/** Temporary solution */
const events = [];

app.use(bodyParser.json());

/** [String!]! Not return null. It can be empty object, but not null (check it in the DOCS)
 * Something! - This must never be null!
 * 'events' can take arguments too.
 * ID - special type, must be unique, GQL add it by itself
 * 'input' - special type for inputs(properties of data object)*/

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        type RootQuery {
            events: [Event!]!      
        }
        
        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {                     // all schemas, matching by names
        events: () => {              // resolver, handle data, if it has form 'events' from schema
            return events;
        },
        createEvent: (args) => {
            const {title, description, price, date} = args.eventInput;  // there is nested object of type EventInput with the name "eventInput"
            const event = {
                _id: Math.random().toString(),
                title: title,
                description: description,
                price: +price,
                date: date
            };
            console.log({event, events});
            events.push(event);
            console.log({events});

            return event;                                               // new item must be return
        }
    },
    graphiql: true                   // little text redactor for queries
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
    }@graphql-learn-cluster-juk75.mongodb.net/test?retryWrites=true`)
    .then(() => {
        app.listen(3000);
    })
    .catch((err) => {
        console.log("Error from connection: ", err);
    });

