const DataLoader = require("dataloader");

const User = require("../../models/user");
const Event = require("../../models/event");
const {dateToString} = require("../../helpers/date");

const eventLoader = new DataLoader(eventIds => {
    return events(eventIds);
});

const userLoader = new DataLoader(userIds => {
    return User.find({_id: {$in: userIds}});
});

const events = async eventIds => {
    try {
        const events = await Event.find({_id: {$in: eventIds}});
        events.sort((a, b) => {                                  // must be sorted by Id to avoid DataLoader bug
            return (
                eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
            )
        });
        return events.map(event => {
            return transformEvent(event);
        });
    } catch (err) {
        throw err;
    }
};

const singleEvent = async eventId => {
    try {
        // const event = await Event.findById(eventId);                    // before using DataLoader
        const event = await eventLoader.load(eventId.toString()); // we must pass ID to DataLoader as a string
        // return transformEvent(event);                                         // before using DataLoader
        return event;                                                                      // we must avoid of double transforming of event
    } catch (err) {
        throw err;
    }
};

const user = async userId => {
    try {
        const user = await userLoader.load(userId.toString());

        console.log(user._doc);
        return {
            ...user._doc,
            _id: user.id,
            // createdEvents: events.bind(this, user._doc.createdEvents)          // before using DataLoader
            createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
        };
    } catch (err) {
        throw err;
    }
};

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
};

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    };
};

// exports.user = user;
// exports.singleEvent = singleEvent;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
