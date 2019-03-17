import React, {Component} from 'react';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingChart from "../components/Bookings/BookingChart/BookingChart";
import BookingControls from "../components/Bookings/BookingsControls/BookingControls";

class BookingsPage extends Component {
    state = {
        isLoading: false,
        bookings: [],
        outputType: 'list'
    };

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchBookings();
    }

    fetchBookings = () => {
        this.setState({isLoading: true});

        const requestBody = {
            query: `
                query {
                    bookings {
                       _id
                       createdAt
                       event {
                           _id
                           title
                           date
                           price
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
                const {bookings} = resData.data;
                this.setState({bookings, isLoading: false});
            })
            .catch((error) => {
                console.error(error);
                this.setState({isLoading: false});
            })
    };

    deleteBookingHandler = (bookingId) => {
        this.setState({isLoading: true});

        /** Not recommended approach */
        // const requestBody = {
        //     query: `
        //         mutation {
        //             cancelBooking(bookingId: "${bookingId}") {
        //                _id
        //                title
        //                description
        //                price
        //                date
        //                creator {
        //                    _id
        //                    email
        //                }
        //             }
        //         }
        //     `
        // };

        /** Recommended approach */
        const requestBody = {
            query: `
                mutation CancelBooking ($id: ID!) {
                    cancelBooking(bookingId: $id) {
                       _id
                       title
                       description
                       price
                       date
                       creator {
                           _id
                           email
                       }
                    }
                }
            `,
            variables: {
                id: bookingId
            }
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
                // this.fetchBookings();                              // we can make additional call
                this.setState((prevState, prevProps) => {
                    const updatedBookings = prevState.bookings.filter((booking) => {
                        return booking._id !== bookingId;
                    });
                    return {bookings: updatedBookings, isLoading: false};
                });

            })
            .catch((error) => {
                console.error(error);
                this.setState({isLoading: false});
            })
    };

    changeOutputTypeHandler = (outputType) => {
        if (outputType === 'list') {
            this.setState({outputType: 'list'});
        } else {
            this.setState({outputType: 'chart'});
        }
    };

    render() {
        let content = <Spinner />;
        if (!this.state.isLoading) {
            // content = (this.state.isLoading
            //         ? (
            //             <Spinner />
            //         ) : (
            //             <BookingList
            //                 bookings={this.state.bookings}
            //                 onDelete={this.deleteBookingHandler}
            //             />
            //         )
            // )
            content = (
                <>
                    <BookingControls
                        onChange={this.changeOutputTypeHandler}
                        activeOutputType={this.state.outputType}
                    />
                    <div>
                        {this.state.outputType === 'list' && (
                            <BookingList
                                bookings={this.state.bookings}
                                onDelete={this.deleteBookingHandler}
                            />
                        )}
                        {this.state.outputType === 'chart' && (
                            <BookingChart bookings={this.state.bookings}/>
                        )}
                    </div>
                </>
            )
        }

        return (
            <>
                {content}
            </>
        )
    }

}

export default BookingsPage;
