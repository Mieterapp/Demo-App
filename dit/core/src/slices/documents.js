import {createSlice} from '@reduxjs/toolkit'
import thunk from 'redux-thunk';
import api from "../api";
import {getAuthenticatedUser} from "./user";
import {getFaqs} from "./faqs";
export const initialState = {
    documentsLoading: false,
    documentsHasErrors: false,
    documents: [],

}

// A slice for posts with our three reducers
const documentsSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        getDocuments: (state) => {
            state.documentsLoading = true
        },
        getDocumentsSuccess: (state, {payload}) => {

            /*if(payload.length > 0 ){
                var documentsTemp = {
                    operating_costs: [],
                    contract: [],
                    issues: []
                };

                payload.forEach(item => {

                    if(item.type == 'contract') {
                        documentsTemp.contract.push(item);
                    }

                    if(item.type == 'operating_costs') {
                        documentsTemp.operating_costs.push(item);
                    }

                    if(item.type == 'issues') {
                        documentsTemp.issues.push(item);
                    }
                });
            }*/

            //console.log(documentsTemp);
            state.documents = payload
            //state.documents = documentsTemp
            state.documentsLoading = false
            state.documentsHasErrors = false

            return state;
        },
        getDocumentsFailure: (state) => {
            state.documentsLoading = false
            state.documentsHasErrors = true
        },
    },
    //middleware: [thunk.withExtraArgument(api)]

})

// Three actions generated from the slice
export const {getDocuments, getDocumentsSuccess, getDocumentsFailure} = documentsSlice.actions

// A selector
export const documentsSelector = (state) => state.documents
// The reducer
export default documentsSlice.reducer

export const fetchDocuments = (code) => async dispatch => {
    try {
        //console.log('fetchDocuments');

        const requestCode = String(code).split(".").join("A");
        const endpoint = "/documents/"+requestCode+'/';

        dispatch(getDocuments())
        const res = api.post(endpoint, {})
            .then(async response => {
                if(response.status !== undefined) {
                    if(response.status === 200) {
                        //console.log(response.data);
                        return dispatch(getDocumentsSuccess(response.data));
                    }
                }

                //dispatch(loginFailed({username}))
                return true;

            })
            .catch(error => {
                if(error.response){
                    console.error(error.request)
                    return dispatch(getDocumentsFailure(error.request.status))
                }
                else if (error.request) {
                    //console.error(error.request)
                    // client never received a response, or request never left
                } else {
                    // anything else
                }
                return dispatch(getDocumentsFailure(error))
            });
        //console.log(res);

    } catch (e) {
        return console.error(e);
    }
}

export const fetchDocument = (href=null) => async dispatch => {
    try {
        dispatch(getDocuments())
        href = href.replace('/api/v1','');
        //href = href.replace('?','/?');

        console.log('document',href);

        const res = api.get(href)
            .then(async response => {
                console.log(response)
                if(response.status !== undefined) {
                    if(response.status === 200) {
                        //dispatch(getDocumentsSuccess(response.data));
                        console.log(response.data);
                    }
                }

                //dispatch(loginFailed({username}))
                return true;

            })
            .catch(error => {
                if(error.response){
                    console.error(error.request)
                    //return dispatch(getDocumentsFailure(error.request.status))
                }
                else if (error.request) {
                    //console.error(error.request)
                    // client never received a response, or request never left
                } else {
                    // anything else
                }
                //return dispatch(getDocumentsFailure(error))
            });
        //console.log(res);

    } catch (e) {
        return console.error(e);
    }
}