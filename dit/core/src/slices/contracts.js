import {createSlice} from '@reduxjs/toolkit'
import thunk from 'redux-thunk';
import api from "../api";
import {getAuthenticatedUser} from "./user";
import {getFaqs} from "./faqs";
export const initialState = {
    loading: false,
    hasErrors: false,
    contracts: {
        list: [],
        current: null,
        ts:null,
    },
    loadingCurrent: false,
    hasErrorsCurrent: false,
}

// A slice for posts with our three reducers
const contractsSlice = createSlice({
    name: 'contracts',
    initialState,
    reducers: {
        getContracts: (state) => {
            state.loading = true
        },
        getConstractsSuccess: (state,action) => {
            state.contracts.list = action.payload
            state.loading = false
            state.hasErrors = false
            state.contracts.ts = Date.now();
        },
        getContractsFailure: (state) => {
            state.loading = false
            state.hasErrors = true
        },
        getCurrentContract:(state, payload) => {
            state.loadingCurrent = true
        },
        getCurrentContractSuccess:(state, action) => {

            state.contracts.current = action.payload
            state.loadingCurrent = false
            state.hasErrorsCurrent = false
            state.contracts.ts = Date.now();
        },
        getCurrentContractFailed:(state, payload) => {
            state.loadingCurrent = false
            state.hasErrorsCurrent = true
        }
    },
})

// Three actions generated from the slice
export const {getContracts, getConstractsSuccess, getContractsFailure, getCurrentContract, getCurrentContractSuccess, getCurrentContractFailed} = contractsSlice.actions
// A selector
export const contractsSelector = (state) => state.contracts;
// The reducer
export default contractsSlice.reducer

export const fetchContracts = () => async dispatch => {
    try {
        //console.log('getcontracts');
        dispatch(getContracts())
        const res = api.get('/contracts/')
            .then(async response => {
                if(response.status !== undefined) {
                    if(response.status === 200) {
                        //console.log('getcontracts', response.data[0].id);
                        //console.log('contracts', response.data);
                        dispatch(getConstractsSuccess(response.data));
                        if(response.data.length > 0) {

                            dispatch(fetchContract(response.data[0].id));
                        }
                    }
                }
                //dispatch(loginFailed({username}))
                return true;

            })
            .catch(error => {
                if(error.response){
                    //console.error(error.request)
                    return dispatch(getContractsFailure(error.request.status))
                }
                else if (error.request) {
                    //console.error(error.request)
                    // client never received a response, or request never left
                } else {
                    // anything else
                }
                return dispatch(getContractsFailure(error))
            });


    } catch (e) {
        return console.error(e);
    }
}

export const fetchContract = (id) => async dispatch => {
    try {
        //console.log('getcontract for id '+id);
        dispatch(getCurrentContract())
        const res = api.get('/contracts/'+id+"/")
            .then(async response => {
                if(response.status !== undefined) {
                    if(response.status === 200) {
                        //console.log('getcontract for id ',response.data.contact_person.display_name);

                        dispatch(getCurrentContractSuccess(response.data));
                    }
                }
                //dispatch(loginFailed({username}))
                return true;

            })
            .catch(error => {
                if(error.response){
                    console.error(error.request)
                    return dispatch(getCurrentContractFailed(error.request.status))
                }
                else if (error.request) {
                    //console.error(error.request)
                    // client never received a response, or request never left
                } else {
                    // anything else
                }
                return dispatch(getCurrentContractFailed(error))
            });
        //console.log(res);

    } catch (e) {
        return console.error(e);
    }
}
