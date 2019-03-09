const User = require('../../models/user');
const Event = require('../../models/event');
const {transformEvent} = require('./merge');

module.exports = {                     // all schemas, matching by names
    /** Events resolvers */
    events: async () => {              // resolver, handle data, if it has form 'events' from schema
        try {
            const events = await Event.find();
            return events.map((event) => {
                console.log({...event._doc});
                return transformEvent(event);
            })
        } catch (error) {
            throw error;
        }
    },

    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
            console.log(req.isAuth);
        const {title, description, price, date} = args.eventInput;  // there is nested object of type EventInput with the name "eventInput"
        const event = new Event({
            title: title,
            description: description,
            price: +price,
            date: new Date(date),
            creator: req.userId  // there must be ObjectId, but Mongoose can convert it automatically to string
        });

        let createdEvent;

        try {
            const result = await event.save();                                // new item must be return

            createdEvent = transformEvent(result);

            const creator = await User.findById(req.userId);

            console.log("Creator: ", creator, req.userId);

            if (!creator) {
                throw new Error('User was not found.')
            }
            creator.createdEvents.push(event);
            await creator.save();

            return createdEvent;
        } catch (error) {
            throw error;
        }
    },
};
