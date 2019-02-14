import React, {Component} from 'react';
import './App.css';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import AuthPage from "./pages/AuthPage";
import EventsPage from "./pages/EventsPage";
import BookingsPage from "./pages/BookingsPage";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Redirect from="/" to="/auth" exact/>
                    <Route path="/auth" component={AuthPage}/>
                    <Route path="/events" component={EventsPage}/>
                    <Route path="/bookings" component={BookingsPage}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
