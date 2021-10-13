import {createSlice} from '@reduxjs/toolkit'
import thunk from 'redux-thunk';
import api from "../api";

export const initialState = {
    issuesRequestedloading: true,
    issuesRequestedloadingHasErrors: false,
    addIssuesRequestedHasErrors: false,
    addIssuesRequestSuccess: false,
    issuesRequested: [],
}

const issuesRequestedSlice = createSlice({
    name: 'issuesRequested',
    initialState,
    reducers: {
        getIssuesRequested: (state) => {
            state.issuesRequestedloading = true
        },
        getIssuesRequestedSuccess: (state, {payload}) => {

            state.issuesRequested = payload
            state.issuesRequestedloading = false
            state.issuesRequestedlHasErrors = false
        },
        getIssuesRequstedFailure: (state) => {
            state.issuesRequestedloading = false
            state.issuesRequestedlHasErrors = true
        },
        addIssueRequest: (state, {payload}) => {
            state.issuesRequested.push(payload);
            state.addIssuesRequestedHasErrors = false;
            state.addIssuesRequestSuccess = true;
            //console.log(state);
        },
        addIssueRequestFailure: (state, action) => {
            state.addIssuesRequestSuccess = false;
            state.addIssuesRequestedHasErrors = true;
            //state.issuesRequested = [];
        },
        resetAddIssueRequestStatus: (state) => {
            state.addIssuesRequestSuccess = false;
            state.addIssuesRequestedHasErrors = false;
        }
    },
})

export const {getIssuesRequested, getIssuesRequestedSuccess, getIssuesRequstedFailure,addIssueRequest, addIssueRequestFailure, resetAddIssueRequestStatus} = issuesRequestedSlice.actions
export const issueRequestedSelector = (state) => state.issuesRequested
export default issuesRequestedSlice.reducer

export const fetchIssuesRequsted = (code) => async dispatch => {
    try {


        const requestCode = String(code).split(".").join("A");

        const endpoint = "/issues_status/"+requestCode;

        console.log('fetching my issues '+endpoint + '----'+code);
        const res = api.get(endpoint)
            .then(async response => {
                if(response.status !== undefined) {
                    if(response.status === 200) {
                        //response.config.transformRequest = null;
                        console.log(response.data)
                        if(response.data.tickets){
                            dispatch(getIssuesRequestedSuccess(response.data.tickets))
                        }

                    }
                }
                //dispatch(getIssuesFailure({response}))
                return true;

            })
            .catch(error => {
                if(error.response){
                    //console.error(error.request)
                    //return dispatch(getIssuesFailure(error.request.status))
                }
                else if (error.request) {
                    //console.error(error.request)
                    // client never received a response, or request never left
                } else {
                    // anything else
                }
                //console.error(error)
                //return dispatch(getIssuesFailure(error))
            });
        //console.log(res);

    } catch (e) {
        return console.error(e);
    }
};

export const createIssueRequest = (issue) => async dispatch => {
    try {
        const endpoint = "/issues_requested/"

        console.log('create issue request', issue);

        const res = api.post(endpoint, issue)
            .then(async response => {
                if(response.status !== undefined) {
                    if(response.status === 201) {
                        console.log('send ok',response.data);
                        dispatch(addIssueRequest(response.data))
                    }
                }

                //dispatch(loginFailed({username}))
                return true;

            })
            .catch(error => {
                if(error.response){
                    console.error(error)
                    console.error(error.response)
                    return dispatch(addIssueRequestFailure(error.request.status))
                }
                else if (error.request) {
                    //console.error(error.request)
                    // client never received a response, or request never left
                } else {
                    // anything else
                }
                return dispatch(addIssueRequestFailure(error))
            });


    } catch (e) {
        dispatch(addIssueRequestFailure(e))
        return console.error(e);
    }
};

export const resetAddIssueStatus = () => async dispatch => {
    dispatch(resetAddIssueRequestStatus())
};
