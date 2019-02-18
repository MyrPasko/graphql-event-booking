import React, {Component} from 'react';
import AuthContext from '../context/auth-context';


class EventsPage extends Component {
    static contextType = AuthContext;

    showChecking = () => {
        console.log("Checking: ", this.context.checking);
    };

    render() {
        return (
            <div>
                <h1>The Events page</h1>
                <h1>{this.context.checking}</h1>
                <button onClick={this.context.showThis}>Show this!</button>
            </div>
        );
    }
}

export default EventsPage;


