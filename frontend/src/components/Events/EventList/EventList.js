import React from 'react';
import './EventList.css';
import EventItem from "./EventItem/EventItem";

const eventList = (props) => {

    const {authUserId, onViewDetail} = props;

    const events = props.events.map((event) => {
        return <EventItem
            key={event._id}
            event={event}
            userId={authUserId}
            onDetail={onViewDetail}
        />
    });

    return (
        <ul className="event__list">
            {events}
        </ul>
    );
};

export default eventList;
