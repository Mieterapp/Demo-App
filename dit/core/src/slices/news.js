import {createSlice} from '@reduxjs/toolkit'
import thunk from 'redux-thunk';
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const initialState = {
    loading: false,
    hasErrors: false,
    news: [],

}

const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

// A slice for posts with our three reducers
const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        getNews: (state) => {
            state.loading = true
        },
        getNewsSuccess: (state, {payload}) => {
            state.news = payload
            state.loading = false
            state.hasErrors = false
            AsyncStorage.setItem('news', JSON.stringify(state.news))
        },
        getNewsFailure: (state) => {
            state.loading = false
            state.hasErrors = true
        },
    },
    //middleware: [thunk.withExtraArgument(api)]

})


// Three actions generated from the slice
export const {getNews, getNewsSuccess, getNewsFailure} = newsSlice.actions

// A selector
export const newsSelector = (state) => state.news
// The reducer
export default newsSlice.reducer

// Asynchronous thunk action
export function fetchNews() {
    return async (dispatch) => {
        dispatch(getNews())
        const endpoint = "/news/";
        //console.log('getting news',api);

        try {
            const res = await api.get(endpoint)
                .then(response => {
                     //console.log(response)

                    if(response.status !== undefined) {
                        if(response.status === 200) {

                            wait(400).then(() => {
                                //state.loading = false
                                //dispatch(setNewsLoading)
                                dispatch(getNewsSuccess(response.data))
                            });


                        }
                    }

                    //dispatch(loginFailed({username}))
                    return true;

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
                    dispatch(getNewsFailure())

                });
            //console.log(res);

        } catch (e) {
            return console.error(e);
        }



        /*try {
            //const response = await fetch('https://jsonplaceholder.typicode.com/posts')
            const response = await fetch(api)
            const data = await response.json()

            console.log(data);

            dispatch(getNewsSuccess(data))
        } catch (error) {
            console.log(error);
            dispatch(getNewsFailure())
        }*/
    }
}