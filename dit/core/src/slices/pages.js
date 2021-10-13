import {createSlice} from '@reduxjs/toolkit'
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const initialState = {
    loadingPages: false,
    hasErrorsPages: false,
    pages: null,

}

const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

const pagesSlice = createSlice({
    name: 'pages',
    initialState,
    reducers: {
        getPages: (state) => {
            state.loadingPages= true
        },
        getPagesSuccess: (state, {payload}) => {
            state.pages = payload
            state.loadingPages = false
            state.hasErrorsPages = false
            AsyncStorage.setItem('pages', JSON.stringify(state.pages))
        },
        getPagesFailure: (state) => {
            state.loadingPages = false
            state.hasErrorsPages = true
        },
    },
})

export const {getPages, getPagesSuccess, getPagesFailure} = pagesSlice.actions

export const pagesSelector = (state) => state.pages
export default pagesSlice.reducer

export function fetchPages() {
    return async (dispatch) => {
        dispatch(getPages())
        const endpoint = "/pages/";

        try {
            const res = await api.get(endpoint)
                .then(response => {
                    //console.log(response)
                    if(response.status !== undefined) {
                        if(response.status === 200) {
                            var pagesData = {};
                            response.data.forEach((p)=> {
                                pagesData[p.id] = p;
                            });
                            return dispatch(getPagesSuccess(pagesData))
                        }else {

                        }
                    }

                    return dispatch(getPagesFailure(response.data));

                    //dispatch(loginFailed({username}))
                    //return true;

                })
                .catch(error => {

                    console.log(error)

                    if(error.response){
                        console.error(error.request)
                    }
                    else if (error.request) {
                        console.error(error.request)
                        // client never received a response, or request never left
                    } else {
                        // anything else
                    }
                    dispatch(getPagesFailure())

                });
        } catch (e) {
            return console.error(e);
        }
    }
}