import React, { useContext, useEffect, useState } from 'react';

//import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import store from "../store";


const DitContext = React.createContext();

export const DitProvider = ({ children }) => {
    const [timestamp, setTimestamp] = useState(0);
    //const store = configureStore({reducer: rootReducer})
    /*const store = configureStore({
        reducer: {
            posts: postsReducer
        }
    })*/

    useEffect(() => {
        (async () => {
            setTimestamp(Date.now());
        })();
    }, []);

    return (
        <DitContext.Provider value={{ timestamp }}>
            <Provider store={store}>
                {children}
            </Provider>
        </DitContext.Provider>
    );
}

export function useDit() {
    const { timestamp } = useContext(DitContext);
    return {
        timestamp
    }
}
