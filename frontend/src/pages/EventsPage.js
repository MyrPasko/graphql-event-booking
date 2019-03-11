import React, {Component} from 'react';
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import './EventsPage.css';
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";


class EventsPage extends Component {
    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null,
    };

    isActive = true;

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    }

    componentDidMount() {
        this.fetchEvents();
    }


    startCreateEventHandler = () => {
        this.setState({creating: true});
    };

    modalConfirmHandler = () => {
        this.setState({creating: false});
        const title = this.titleElRef.current.value;
        const price = +this.priceElRef.current.value;              // converts it to number
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;

        if (title.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0) {
            return;
        }

        const event = {title, price, date, description};
        console.log(event);

        const requestBody = {
            query: `
                mutation {
                    createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
                       _id
                       title
                       description
                       date
                       price
                       creator {
                           _id
                           email
                       }
                    }
                }
            `
        };

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                "content-Type": 'application/json',
                "Authorization": `Bearer ${token}`,
            }
        })
            .then((result) => {
                console.warn(result);
                if (result.status !== 200 && result.status !== 201) {
                    throw new Error("Failed!");
                }
                return result.json();
            })
            .then((resData) => {
                this.setState((prevState) => {
                    return {events: [...prevState.events, resData.data.createEvent]};
                });

            })
            .catch((error) => {
                console.error(error);
            })
    };

    modalCancelHandler = () => {
        this.setState({creating: false, selectedEvent: null});
    };

    fetchEvents = () => {
        this.setState({isLoading: true});

        const requestBody = {
            query: `
                query {
                    events {
                       _id
                       title
                       description
                       date
                       price
                       creator {
                           _id
                           email
                       }
                    }
                }
            `
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                "content-Type": 'application/json',
            }
        })
            .then((result) => {
                console.warn(result);
                if (result.status !== 200 && result.status !== 201) {
                    throw new Error("Failed!");
                }
                return result.json();
            })
            .then((resData) => {
                const {events} = resData.data;
                console.log("Res data: ", resData.data);
                if (this.isActive) {
                    this.setState({events, isLoading: false});
                }
            })
            .catch((error) => {
                console.error(error);
                if (this.isActive) {
                    this.setState({isLoading: false});
                }
            })
    };

    showDetailHandler = (eventId) => {
        this.setState((prevState, prevProps) => {
            const selectedEvent = prevState.events.find(event => event._id === eventId);
            return {selectedEvent};
        }, () => {
            console.log(this.state.selectedEvent);
        });

    };

    bookEventHandler = (eventId) => {
        console.log("Book event handler is working now!!!");

        if (!this.context.token) {
            this.setState({selectedEvent: null});
            return;
        }

        const requestBody = {
            // string params always in double quotes
            query: `
                mutation {
                    bookEvent(eventId: "${eventId}") {
                       _id
                       createdAt
                       updatedAt
                    }
                }
            `
        };

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                "content-Type": 'application/json',
                "Authorization": `Bearer ${token}`,
            }
        })
            .then((result) => {
                console.warn(result);
                if (result.status !== 200 && result.status !== 201) {
                    throw new Error("Failed!");
                }
                return result.json();
            })
            .then((resData) => {
                console.log("Bookings is successful.", resData);
                this.setState({selectedEvent: null});
            })
            .catch((error) => {
                console.error(error);
                this.setState({selectedEvent: null});
            })
    };

    componentWillUnmount() {
        this.isActive = false;
    }

    render() {
        return (
            <>
                {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
                {this.state.creating && <Modal
                    title="Add event"
                    canCancel
                    canConfirm
                    onCancel={this.modalCancelHandler}
                    onConfirm={this.modalConfirmHandler}
                    confirmText="Confirm"
                >
                    <form action="">
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={this.titleElRef} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" ref={this.priceElRef} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" id="date" ref={this.dateElRef} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <textarea id="description" rows="4" ref={this.descriptionElRef} />
                        </div>
                    </form>
                </Modal>}
                {this.state.selectedEvent && <Modal
                    title={this.state.selectedEvent.title}
                    canCancel
                    canConfirm
                    onCancel={this.modalCancelHandler}
                    onConfirm={() => this.bookEventHandler(this.state.selectedEvent._id)}
                    confirmText={this.context.token ? "Book" : "Confirm"}
                >
                    <h1>{this.state.selectedEvent.title}</h1>
                    <h2>$ {this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
                    <p>{this.state.selectedEvent.description}</p>
                </Modal>}
                {this.context.token && <div className="events-control">
                    <p>Share your own Events!</p>
                    <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
                </div>}
                {this.state.isLoading
                    ?
                    <Spinner />
                    :
                    <EventList
                        events={this.state.events}
                        authUserId={this.context.userId}
                        onViewDetail={this.showDetailHandler}
                    />}
            </>
        );
    }
}

export default EventsPage;


