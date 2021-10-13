import {createSlice} from '@reduxjs/toolkit'
import thunk from 'redux-thunk';
import api from "../api";
import {getAuthenticatedUser} from "./user";
import {getFaqs} from "./faqs";
export const initialState = {
    loading: false,
    hasErrors: false,
    customerchat: [],

}

// A slice for posts with our three reducers
const customerchatSlice = createSlice({
    name: 'customerchat',
    initialState,
    reducers: {
        getCustomerchat: (state) => {
            state.loading = true
        },
        getCustomerchatSuccess: (state, {payload}) => {
            //console.log(payload.messages);
            state.customerchat = payload.messages
            state.loading = false
            state.hasErrors = false
        },
        getCustomerchatFailure: (state) => {
            state.loading = false
            state.hasErrors = true
        },
    },
    //middleware: [thunk.withExtraArgument(api)]

})

// Three actions generated from the slice
export const {getCustomerchat, getCustomerchatSuccess, getCustomerchatFailure} = customerchatSlice.actions

// A selector
export const customerchatSelector = (state) => state.customerchat
// The reducer
export default customerchatSlice.reducer

export const fetchCustomerchat = () => async dispatch => {
    try {
        dispatch(getCustomerchat())
        const res = api.get('/customer-chat/')
            .then(async response => {
                if(response.status !== undefined) {
                    if(response.status === 200) {
                        console.log('getchat');
                        dispatch(getCustomerchatSuccess(response.data));
                    }
                }

                //dispatch(loginFailed({username}))
                return true;

            })
            .catch(error => {
                if(error.response){
                    //console.error(error.request)
                    return dispatch(getCustomerchatFailure(error.request.status))
                }
                else if (error.request) {
                    //console.error(error.request)
                    // client never received a response, or request never left
                } else {
                    // anything else
                }
                return dispatch(getCustomerchatFailure(error))
            });
        //console.log(res);

    } catch (e) {
        return console.error(e);
    }
}


export const sendMessage = (message) => async dispatch => {
    try {
        console.log('send message');
        const res = api.post('/customer-chat/', message)
            .then(async response => {
                if(response.status !== undefined) {
                    if(response.status === 201) {
                        /*const token = response.data.token;
                        //api.defaults.headers.common['Authorization'] = 'JWT '+token;
                        await setToken(token);
                        dispatch(loginSuccess({username}));
                        dispatch(getAuthenticatedUser());*/
                        console.log('send ok',response);
                        //dispatch(load(response.data))
                        dispatch(fetchCustomerchat())


                    }
                }

                //dispatch(loginFailed({username}))
                return true;

            })
            .catch(error => {
                if(error.response){
                    console.error(error)
                    //console.error(error.response)
                    //return dispatch(loginFailed(error.request.status))
                }
                else if (error.request) {
                    //console.error(error.request)
                    // client never received a response, or request never left
                } else {
                    // anything else
                }
                //return dispatch(loginFailed(error))
            });
        //console.log(res);

    } catch (e) {
        return console.error(e);
    }
}
