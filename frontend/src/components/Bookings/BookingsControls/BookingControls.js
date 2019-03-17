import React from 'react';
import './BookingControls.css';

const bookingControls = (props) => {
    return (
        <div className="bookings-control">
            <button
                className={props.activeOutputType === 'list' ? 'active' : ''}
                onClick={() => props.onChange('list')}>
                List
            </button>
            <button
                className={props.activeOutputType === 'chart' ? 'active' : ''}
                onClick={() => props.onChange('chart')}>
                Chart
            </button>
        </div>
    );
};

export default bookingControls;
