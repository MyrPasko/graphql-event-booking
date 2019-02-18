import React from 'react';

export default React.createContext({
    token: null,
    userId: null,
    checking: null,
    login: () => {},
    logout: () => {},
    showThis: () => {},
})
