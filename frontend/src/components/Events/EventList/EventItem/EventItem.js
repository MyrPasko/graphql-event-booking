import React from 'react';
import './EventItem.css';

const eventItem = (props) => {
    const {
        event: {
            _id: eventId,
            price,
            title,
            date,
            creator: {
                _id: creatorId
            }
        },
        userId,
        onDetail
    } = props;

    console.log({userId, creatorId});

    return (
        <li key={eventId} className="events__list-item">
            <div>
                <h1>{title}</h1>
                <h2>$ {price} - {new Date(date).toLocaleDateString()}</h2>
            </div>
            <div>
                {userId === creatorId
                    ?
                    <p>You are the owner of this event</p>
                    :
                    <button className="btn" onClick={() => onDetail(eventId)}>View details</button>}
            </div>
        </li>
    );
};

export default eventItem;
