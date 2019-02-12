const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

/** [String!]! Not return null. It can be empty object, but not null (check it in the DOCS)
 * Something! - This must never be null!
 * 'events' can take arguments too.
 * ID - special type, must be unique, GQL add it by itself
 * 'input' - special type for inputs(properties of data object)
 * Check the password field in User schema. It must be nullable
 * Check the password field in UserInput schema. It must not be nullable*/

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        type User {
            _id: ID!
            email: String!
            password: String
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input UserInput {
            email: String!
            password: String!
        }
        
        type RootQuery {
            events: [Event!]!      
        }
        
        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {                     // all schemas, matching by names

        /** Events resolvers */
        events: () => {              // resolver, handle data, if it has form 'events' from schema
            return Event
                .find()
                .then((events) => {
                    return events.map((event) => {
                        console.log({...event._doc});
                        return {
                            ...event._doc,
                            _id: event._doc._id.toString()
                        };
                    })
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        createEvent: (args) => {
            const {title, description, price, date} = args.eventInput;  // there is nested object of type EventInput with the name "eventInput"
            // Hardcode method
            // const event = {
            //     _id: Math.random().toString(),
            //     title: title,
            //     description: description,
            //     price: +price,
            //     date: date
            // };

            const event = new Event({
                title: title,
                description: description,
                price: +price,
                date: new Date(date)
            });

            return event
                .save()                                // new item must be return
                .then((result) => {
                    console.log(result);
                    return {
                        ...result._doc,
                        _id: result._doc._id.toString()
                    };
                })
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

        },

        /** User resolvers */
        createUser: (args) => {
            const {email, password} = args.userInput;  // there is nested object of type EventInput with the name "eventInput"

            return User.findOne({email: email})
                .then((user) => {
                    if (user) {
                        throw new Error('User exists already.')
                    }
                    return bcrypt.hash(password, 12)
                })
                .then((hashedPassword) => {
                    const user = new User({
                        email: email,
                        // password: password                     // it is wrong way of storing data, we can't store password as plain text
                        password: hashedPassword
                    });

                    return user.save()                                // new item must be return
                })
                .then((result) => {
                    console.log(result);
                    return {
                        ...result._doc,
                        password: null,
                        _id: result._doc._id.toString()
                    };
                })
                .catch((err) => {
                    throw err;
                });


        },
    },
    graphiql: true                   // little text redactor for queries
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
    }@graphql-learn-cluster-juk75.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
    .then(() => {
        app.listen(3000);
    })
    .catch((err) => {
        console.log("Error from connection: ", err);
    });

