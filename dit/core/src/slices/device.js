import {createSlice} from '@reduxjs/toolkit'
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const initialState = {
    loading: true,
    hasErrors: false,
    device: null,
}

const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        setDevice: (state) => {
            state.loading = true
        },
        setDeviceSuccess: (state, {payload}) => {
            state.device = payload
            state.loading = false
            state.hasErrors = false
            //AsyncStorage.setItem('device', JSON.stringify(state.device))
        },
        setDeviceFailure: (state) => {
            state.loading = false
            state.hasErrors = true
        },
    },
})

export const {setDevice, setDeviceSuccess, setDeviceFailure} = deviceSlice.actions
export const deviceSelector = (state) => state.device
export default deviceSlice.reducer

export const getDevice  = (type) => async dispatch => {
    try {
        console.log('get device', type);
        var endpoint = '/push-notifications/register-device/apns/';

        if(type == "gcm") {
            endpoint = '/push-notifications/register-device/gcm/';
        }

        console.log(endpoint);

        const res = api.get(endpoint)
            .then(async response => {
                if(response.status !== undefined) {
                    if(response.status === 200) {
                        //console.log(response.data);
                        dispatch(setDeviceSuccess(response.data))
                    }
                }

                //dispatch(getIssuesFailure({response}))
                return true;

            })
            .catch(error => {
                if(error.response){
                    console.error(error.request)
                    dispatch(setDeviceFailure())
                    //return dispatch(getIssuesFailure(error.request.status))
                }
                else if (error.request) {
                    //console.error(error.request)
                    dispatch(setDeviceFailure())
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
}

export const postDevice = (device, type) => async dispatch => {
    try {

        console.log('post device', device, type);

        var endpoint = '/push-notifications/register-device/apns/';

        if(type == "apns") {
            endpoint = '/push-notifications/register-device/apns/';
        }

        if(type == "gcm") {
            endpoint = '/push-notifications/register-device/gcm/';
        }

        const res = api.post(endpoint, device)
            .then(async response => {
                if(response.status !== undefined) {
                    if(response.status === 201) {
                        //dispatch(setDeviceSuccess(response.data))
                        console.log('device created: '.type);
                        dispatch(getDevice());
                    }
                }

                //dispatch(getIssuesFailure({response}))
                return true;

            })
            .catch(error => {
                if(error.response){
                    console.error(error.request)
                    dispatch(setDeviceFailure())
                    //return dispatch(getIssuesFailure(error.request.status))
                }
                else if (error.request) {
                    //console.error(error.request)
                    dispatch(setDeviceFailure())
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