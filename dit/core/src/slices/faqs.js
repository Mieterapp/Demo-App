import {createSlice} from '@reduxjs/toolkit'
import thunk from 'redux-thunk';
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const initialState = {
    loading: false,
    hasErrors: false,
    faqs: [],

}

// A slice for posts with our three reducers
const faqsSlice = createSlice({
    name: 'faqs',
    initialState,
    reducers: {
        getFaqs: (state) => {
            state.loading = true
        },
        getFaqsSuccess: (state, {payload}) => {
            state.faqs = payload
            state.loading = false
            state.hasErrors = false
            AsyncStorage.setItem('faqs', JSON.stringify(state.faqs))
        },
        getFaqsFailure: (state) => {
            state.loading = false
            state.hasErrors = true
        },
    },
    //middleware: [thunk.withExtraArgument(api)]

})


// Three actions generated from the slice
export const {getFaqs, getFaqsSuccess, getFaqsFailure} = faqsSlice.actions

// A selector
export const faqsSelector = (state) => state.faqs
// The reducer
export default faqsSlice.reducer

// Asynchronous thunk action
export function fetchFaqs() {
    return async (dispatch) => {
        dispatch(getFaqs())
        const endpoint = "/faqs/";
        //console.log('getting faqs',api);

        try {
            const res = await api.get(endpoint)
                .then(response => {
                     //console.log(response)

                    if(response.status !== undefined) {
                        if(response.status === 200) {
                            dispatch(getFaqsSuccess(response.data))
                        }
                    }
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
                    dispatch(getFaqsFailure())

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