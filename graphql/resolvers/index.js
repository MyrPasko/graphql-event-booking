const authResolver = require('./auth');
const eventsResolver = require('./events');
const bookingResolver = require('./booking');

const rootResolver = {
    ...authResolver,
    ...eventsResolver,
    ...bookingResolver
};

module.exports = rootResolver;


/** Option with promises */
// const events = (eventIds) => {
//     return Event.find({_id: {$in: eventIds}})
//         .then((events) => {
//             console.log(events);
//             return events.map((event) => {
//                 return {
//                     ...event._doc,
//                     _id: event.id,
//                     date: new Date(event._doc.date).toISOString(),
//                     creator: user.bind(this.event.creator)
//                 }
//             })
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// };

// const user = (userId) => {
//     return User.findById(userId)
//         .then((user) => {
//             return {...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents)}
//         })
//         .catch((err) => {
//
//         });
// };

// module.exports = {                     // all schemas, matching by names
//     /** Events resolvers */
//     events: () => {              // resolver, handle data, if it has form 'events' from schema
//         return Event
//             .find()
//             .then((events) => {
//                 return events.map((event) => {
//                     console.log({...event._doc});
//                     return {
//                         ...event._doc,
//                         _id: event._doc._id.toString(),
//                         date: new Date(event._doc.date).toISOString(),
//                         creator: user.bind(this, event._doc.creator)
//                     };
//                 })
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     },
//     createEvent: (args) => {
//         const {title, description, price, date} = args.eventInput;  // there is nested object of type EventInput with the name "eventInput"
//         // Hardcode method
//         // const event = {
//         //     _id: Math.random().toString(),
//         //     title: title,
//         //     description: description,
//         //     price: +price,
//         //     date: date
//         // };
//
//         const event = new Event({
//             title: title,
//             description: description,
//             price: +price,
//             date: new Date(date),
//             creator: '5c6296dab67b8f4010d7a063'  // there must be ObjectId, but Mongoose can convert it automatically to string
//         });
//
//         let createdEvent;
//
//         return event
//             .save()                                // new item must be return
//             .then((result) => {
//                 createdEvent = {
//                     ...result._doc,
//                     _id: result._doc._id.toString(),
//                     date: new Date(result._doc.date).toISOString(),
//                     creator: user.bind(this.result._doc.creator)
//                 };
//                 console.log(result);
//                 return User.findById('5c6296dab67b8f4010d7a063');
//             })
//             .then((user) => {
//                 if (!user) {
//                     throw new Error('User was not found.')
//                 }
//                 user.createdEvents.push(event);
//                 return user.save();
//             })
//             .then((result) => {
//                 return createdEvent;
//             })
//             .catch((err) => {
//                 console.log(err);
//                 throw err;
//             });
//
//     },
//
//     /** User resolvers */
//     createUser: (args) => {
//         const {email, password} = args.userInput;  // there is nested object of type EventInput with the name "eventInput"
//
//         return User.findOne({email: email})
//             .then((user) => {
//                 if (user) {
//                     throw new Error('User exists already.')
//                 }
//                 return bcrypt.hash(password, 12)
//             })
//             .then((hashedPassword) => {
//                 const user = new User({
//                     email: email,
//                     // password: password                     // it is wrong way of storing data, we can't store password as plain text
//                     password: hashedPassword
//                 });
//
//                 return user.save()                                // new item must be return
//             })
//             .then((result) => {
//                 console.log(result);
//                 return {
//                     ...result._doc,
//                     password: null,
//                     _id: result._doc._id.toString()
//                 };
//             })
//             .catch((err) => {
//                 throw err;
//             });
//
//
//     },
// };
