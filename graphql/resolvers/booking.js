const User = require('../../models/user');
const Booking = require('../../models/Booking');
const Event = require('../../models/event');
const {transformBooking, transformEvent} = require('./merge');

module.exports = {                     // all schemas, matching by names
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch (err) {
            throw err;
        }
    },

    createEvent: async (args) => {
        const {title, description, price, date} = args.eventInput;  // there is nested object of type EventInput with the name "eventInput"

        const event = new Event({
            title: title,
            description: description,
            price: +price,
            date: new Date(date),
            creator: '5c6296dab67b8f4010d7a063'  // there must be ObjectId, but Mongoose can convert it automatically to string
        });

        let createdEvent;

        try {
            const result = await event.save();                                // new item must be return

            createdEvent = transformEvent(result);

            const creator = await User.findById('5c6296dab67b8f4010d7a063');

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

    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: '5c6296dab67b8f4010d7a063',
            event: fetchedEvent
        });
        const result = await booking.save();
        return transformBooking(result);
    },

    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (err) {
            throw err;
        }
    }
};
