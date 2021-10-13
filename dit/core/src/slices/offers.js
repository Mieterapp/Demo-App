import {createSlice} from '@reduxjs/toolkit'
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const initialState = {
    loadingOffers: false,
    hasErrorsOffers: false,
    offers: [],

}

const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

const offersSlice = createSlice({
    name: 'offers',
    initialState,
    reducers: {
        getOffers: (state) => {
            state.loadingOffers= true
        },
        getOffersSuccess: (state, {payload}) => {
            state.offers = payload
            state.loadingOffers = false
            state.hasErrorsOffers = false
            AsyncStorage.setItem('offers', JSON.stringify(state.offers))
        },
        getOffersFailure: (state) => {
            state.loadingOffers = false
            state.hasErrorsOffers = true
        },
    },
})

export const {getOffers, getOffersSuccess, getOffersFailure} = offersSlice.actions

export const offersSelector = (state) => state.offers
export default offersSlice.reducer

export function fetchOffers() {
    return async (dispatch) => {
        dispatch(getOffers())
        const endpoint = "/offers/";

        console.log('offers')

        try {
            const res = await api.get(endpoint)
                .then(response => {
                    //console.log(response)

                    if(response.status !== undefined) {
                        if(response.status === 200) {
                            console.log('data',response.data.length)
                            return dispatch(getOffersSuccess(response.data))
                            wait(400).then(() => {

                            });
                        }else {

                        }
                    }

                    return dispatch(getOffersFailure(response.data));

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
                    dispatch(getOffersFailure())

                });
        } catch (e) {
            return console.error(e);
        }
    }
}