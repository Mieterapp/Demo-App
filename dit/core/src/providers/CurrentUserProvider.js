import React, { useContext, useEffect, useState } from 'react';

const CurrentUserContext = React.createContext();

export const CurrentUserProvider = ({ children }) => {

    useEffect(() => {
        (async () => {

            console.log('currentUser Provider');
            /*
            if(data && data.currentUser) {
                setCurrentUser(data.currentUser);
                setTimestamp(Date.now())
            }*/
        })();
    });


    return (
        <CurrentUserContext.Provider>
            {children}
        </CurrentUserContext.Provider>
    );

};