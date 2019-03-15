import React, {Component} from 'react';
import './AuthPage.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component {
    state = {
        isLogin: true,
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchModeHandler = () => {
        this.setState((prevState, prevProps) => {
            return {isLogin: !prevState.isLogin}
        });

    };

    submitHandler = (e) => {
        e.preventDefault();

        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        // let requestBody = {
        //     query: `
        //         query {
        //             login(email: "${email}", password: "${password}") {
        //                 userId
        //                 token
        //                 tokenExpiration
        //             }
        //         }
        //     `
        // };

        let requestBody = {
            query: `
                query Login ($email: String!, $password: String!) {
                    login(email: $email, password: $password) {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `,
            variables: {
                email: email,
                password: password
            }
        };

        if (this.state.isLogin) {
            requestBody = {
                query: `
                mutation CreateUser ($email: String!, $password: String!) {
                    createUser(userInput: {email: $email, password: $password}) {
                       _id
                       email 
                    }
                }
            `,
                variables: {
                    email: email,
                    password: password
                }
            };
        }

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
                console.log("Res Data: ", resData);
                if (resData.data.login.token) {
                    this.context.login(
                        resData.data.login.token,
                        resData.data.login.userId,
                        resData.data.login.tokenExpiration,
                    )
                }
                console.log("Context: ", this.context);
            })
            .catch((error) => {
                console.error(error);
            })
    };

    render() {
        const {isLogin} = this.state;

        return (
            <form action="" className="auth-form" onSubmit={(e) => this.submitHandler(e)}>
                <div className="form-control">
                    <label htmlFor="email">E-Mail</label>
                    <input type="email" id="email" ref={this.emailEl}/>
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordEl}/>
                </div>
                <div className="form-actions">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={this.switchModeHandler}>Switch
                        to {isLogin ? 'Login' : 'Sign In'}</button>
                </div>

            </form>
        );
    }
}

export default AuthPage;
