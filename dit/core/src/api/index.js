import React from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from "axios";


const getToken = async () => {
    return await SecureStore.getItemAsync('secure_token');
};

const apiPrefix ="/api/v1";

const api = axios.create({
    baseURL: 'http://dit-demo-app.dev.resident.immomio.com'+apiPrefix,
    //baseURL: 'https://dwapp-demo.datasec.de'+apiPrefix,
    //baseURL: 'https://dwapp-0064-test.datasec.de'+apiPrefix,
    //baseUrl: 'http://10.23.91.61'+apiPrefix,
    headers: {
        'Content-Type': 'application/json'
    },
})
api.interceptors.request.use(
    async config => {
        //const token = SecureStore.getItemAsync('secure_token')
        const token = await getToken();
        //console.log('TOKEN#######',token)
        if (token != null) {
            config.headers['Authorization'] = `JWT ${token}`
        }

        return config
    },
    error => Promise.reject(error)
)


//api.apiPrefix = apiPrefix;
export default api