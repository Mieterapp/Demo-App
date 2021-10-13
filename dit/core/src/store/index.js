import {configureStore} from "@reduxjs/toolkit";
import {combineReducers} from "@reduxjs/toolkit";

import user from "../slices/user";
import posts from '../slices/posts';
import news from '../slices/news';
import offers from "../slices/offers";
import pages from "../slices/pages";
import faqs from  '../slices/faqs';
import documents from "../slices/documents";
import customerchat from "../slices/customerchat";
import issues from "../slices/issues";
import issuesRequested from "../slices/issuesRequested";
import contracts from "../slices/contracts";
import device from "../slices/device";

const reducer = combineReducers({
    user,
    posts,
    news,
    faqs,
    offers,
    pages,
    documents,
    customerchat,
    issues,
    issuesRequested,
    contracts,
    device

});

const rootReducer = (state, action) => {

    if (action.type === 'user/logoutSuccess') {
        state = undefined;
    }
    return reducer(state, action);
};

const store = configureStore({
    //reducer,
    reducer:rootReducer
});

export default store;