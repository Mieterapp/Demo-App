import {createSlice} from "@reduxjs/toolkit";
import api from "../api";

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const setToken = async (token) => {
    if(token === null){
        await SecureStore.deleteItemAsync('secure_token');
    }
    else {
        await SecureStore.setItemAsync('secure_token', token);
    }

};

const getToken = async () => {
    return await SecureStore.getItemAsync('secure_token');
};

const initialUser =  null;


const slice = createSlice({
   name: 'user',
   initialState: {
       user: {
            data: initialUser,
            failed: false,
            failedType: null,
            ts:null,
            userVerifiedLoading: true,
            userVerified:null
            //person: null
       },

   },
   reducers: {
       loginSuccess: (state, action) => {
           //onsole.log('login success');
           //state.user.data = action.payload
           //saveUserData(action.payload)
           //AsyncStorage.setItem('user', JSON.stringify(action.payload))
       },
       logoutSuccess: (state, action) => {
           //console.log('logout success');
           state.user = {
               data:null,
               failed:false,
               failedType:null,
           };
           AsyncStorage.removeItem('user');
           setToken(null)
       },
       loginFailed: (state, action) => {
           state.user.data = null;
           state.user.failed = true;
           state.user.failedType = action.payload;
           state.user.ts = Date.now();
       },
       getUserDataSuccess: (state, action) => {
           state.user.data = action.payload;
           state.user.ts = Date.now();
           AsyncStorage.setItem('user', JSON.stringify(state.user.data))
       },
       loadUserData: (state, action) => {
           //console.log(JSON.parse(AsyncStorage.getItem(action.payload)));
           state.user.data = action.payload;
       },
       registerFailed:(state, action) => {
           state.failed = true;
           state.failedType = "register"
       },
       userVerifiedLoad: (state) => {
           state.user.userVerifiedLoading = true;
           state.user.userVerified = false;
       },
       userVerifiedSuccess: (state, action) => {
           state.user.userVerified = true;
           state.user.userVerifiedLoading = false;
       },
       userVerifiedFailed: (state, action) => {
           state.user.userVerified = false;
           state.user.userVerifiedLoading = false;
       }
   },
});

export default slice.reducer;

export const userSelector = (state) => state.user

const { loginSuccess, logoutSuccess, loginFailed, getUserDataSuccess, loadUserData, registerFailed, userVerifiedLoad, userVerifiedSuccess, userVerifiedFailed } = slice.actions;

export const login = ({username, password}) => async dispatch => {
    try {
        console.log('try login',username, password);
        const res = api.post('/authenticate/', {email: username, password: password})
            .then(async response => {
                if(response.status !== undefined) {
                    if(response.status === 200) {
                        const token = response.data.token;
                        //api.defaults.headers.common['Authorization'] = 'JWT '+token;
                        await setToken(token);
                        dispatch(loginSuccess({username}));
                        dispatch(getAuthenticatedUser());

                    }
                }

                //dispatch(loginFailed({username}))
                return true;

            })
            .catch(error => {
                if(error.response){
                    //console.error(error.request)
                    return dispatch(loginFailed(error.request.status))
                }
                else if (error.request) {
                    //console.error(error.request)
                    // client never received a response, or request never left
                } else {
                    // anything else
                }
                return dispatch(loginFailed(error))
            });
        //console.log(res);

    } catch (e) {
        return console.error(e);
    }
}

export const logout = () => async dispatch => {
    try {
        //const res = await api.post('logout')
        dispatch(logoutSuccess());

    } catch (e) {
        return console.error(e.message());
    }
}


export const isAuthenticated = () =>  async dispatch => {
    try {
        //const res = await api.post('logout')
        const token = getToken();
        //console.log('load user data', await AsyncStorage.getItem('user'));
        if(token!== null){
            await AsyncStorage.getItem('user').then(response => {
                dispatch(loadUserData(JSON.parse(response)));
            })
            return true;
        }
        //check how old token is


    } catch (e) {
        return console.error(e.message());
    }
}

export const setUserData = (user) => async dispatch => {
    try {
        console.log('save user',user);
        const res = api.patch('/authenticated-user/', user)
            .then(async response => {
                if(response.status !== undefined) {
                    if(response.status === 200) {
                        /*const token = response.data.token;
                        //api.defaults.headers.common['Authorization'] = 'JWT '+token;
                        await setToken(token);
                        dispatch(loginSuccess({username}));
                        dispatch(getAuthenticatedUser());*/
                        console.log(response);
                        dispatch(loadUserData(response.data))


                    }
                }

                //dispatch(loginFailed({username}))
                return true;

            })
            .catch(error => {
                if(error.response){
                    //console.error(error.request)
                    return dispatch(loginFailed(error.request.status))
                }
                else if (error.request) {
                    //console.error(error.request)
                    // client never received a response, or request never left
                } else {
                    // anything else
                }
                return dispatch(loginFailed(error))
            });
        //console.log(res);

    } catch (e) {
        return console.error(e);
    }
}



export const getUserData = (refresh= false) => async dispatch => {
    try {
        //const res = await api.post('logout')
        const token = getToken();
        //console.log('load user data', await AsyncStorage.getItem('user'));
        if(token!== null){
            if(refresh){
                dispatch(loadUserData(JSON.parse(response)));
            }
            else {
                await AsyncStorage.getItem('user').then(response => {
                    dispatch(loadUserData(JSON.parse(response)));
                })
            }

            return true;
        }
        //check how old token is


    } catch (e) {
        return console.error(e.message());
    }
}


export const getAuthenticatedUser = () => async dispatch => {
    try {

        const res = await api.get('/authenticated-user/',{})
            .then(response => {

                if(response.status !== undefined) {
                    if(response.status === 200) {
                        //console.log('AUTHUSER',response.data)
                        dispatch(getUserDataSuccess((response.data)));
                    }
                }
                //dispatch(loginFailed({username}))
                return true;
            })
            .catch(error => {

                //console.log(error.response);

                if(error.response){
                }
                else if (error.request) {
                    //console.error(error.request)
                    // client never received a response, or request never left
                } else {
                    // anything else
                }
            });
        //console.log(res);

    } catch (e) {
        return console.error(e);
    }
}



export const registerUser = ({email, password, contract, birthdate}) => async dispatch => {
    try {
        console.log('reg user', email);

        //return false;
        const res = api.post('/register/', {email: email, password: password, contract: contract, birthdate: birthdate})
            .then(async response => {
                if(response.status !== undefined) {
                    if(response.status === 200) {
                        console.log(response);
                        //dispatch(loadUserData(response.data))
                    }
                }

                //dispatch(loginFailed({username}))
                return true;

            })
            .catch(error => {
                if(error.response){
                    console.error(error.request)
                    return dispatch(loginFailed(error.request.status))
                }
                else if (error.request) {
                    //console.error(error.request)
                    // client never received a response, or request never left
                } else {
                    // anything else
                }
                return dispatch(loginFailed(error))
            });
        //console.log(res);

    } catch (e) {
        return console.error(e);
    }
}

export const verifyUser = ({token}) => async dispatch => {
    try {
        const res = api.post('/register/verify-email/', {token: token})
            .then(response => {

                if(response.status !== undefined) {
                    if(response.status === 200) {
                        //console.log('AUTHUSER',response.data)
                        dispatch(userVerifiedSuccess(response.data));
                        //dispatch(getUserDataSuccess((response.data)));
                    }
                }
                //dispatch(loginFailed({username}))
                return true;
            })
            .catch(error => {
                dispatch(userVerifiedFailed(response.data));
                if(error.response){
                }
                else if (error.request) {
                    //console.error(error.request)
                    // client never received a response, or request never left
                } else {
                    // anything else
                }
                return false;
            });

    } catch (e) {
        dispatch(userVerifiedFailed(response.data));
        return console.error(e);
    }
}