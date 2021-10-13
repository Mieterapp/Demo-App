import {createSlice} from '@reduxjs/toolkit'
import thunk from 'redux-thunk';
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const initialState = {
    loading: true,
    hasErrors: false,
    issues: [],
}

const issuesSlice = createSlice({
    name: 'issues',
    initialState,
    reducers: {
        getIssues: (state) => {
            state.loading = true
        },
        getIssuesSuccess: (state, {payload}) => {
            state.issues = payload
            state.loading = false
            state.hasErrors = false
            AsyncStorage.setItem('issues', JSON.stringify(state.issues))
        },
        getIssuesFailure: (state) => {
            state.loading = false
            state.hasErrors = true
        },
        issueAdded: (stat, action) => {

        }
    },
    //middleware: [thunk.withExtraArgument(api)]

})

export const {getIssues, getIssuesSuccess, getIssuesFailure} = issuesSlice.actions
export const issuesSelector = (state) => state.issues
export default issuesSlice.reducer

export const fetchIssues = () => async dispatch => {
    try {
        //console.log('fetching issues');
        const endpoint = "/issues/"
        const res = api.get(endpoint)
            .then(async response => {
                if(response.status !== undefined) {
                    if(response.status === 200) {
                        //response.config.transformRequest = null;
                        if(response.data !== null) {
                            //console.log('1', response.data.null);
                            if(response.data.null !== undefined) {
                                var issuesData = [];
                                response.data.null.forEach((issue)=>{
                                    if(issue != null){
                                        issuesData[issue.id] = issue;
                                    }

                                    //issuesData.push(issue);
                                });
                                dispatch(getIssuesSuccess(issuesData))
                            }
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