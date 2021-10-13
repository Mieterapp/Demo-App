import {createSlice} from '@reduxjs/toolkit'
import thunk from 'redux-thunk';
export const initialState = {
    loading: false,
    hasErrors: false,
    posts: [],

}



// A slice for posts with our three reducers
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        getPosts: (state) => {
            state.loading = true
        },
        getPostsSuccess: (state, {payload}) => {
            state.posts = payload
            state.loading = false
            state.hasErrors = false
        },
        getPostsFailure: (state) => {
            state.loading = false
            state.hasErrors = true
        },
    },
    //middleware: [thunk.withExtraArgument(api)]

})


// Three actions generated from the slice
export const {getPosts, getPostsSuccess, getPostsFailure} = postsSlice.actions

// A selector
export const postsSelector = (state) => state.posts
// The reducer
export default postsSlice.reducer

// Asynchronous thunk action
export function fetchPosts() {
    return async (dispatch, { api}) => {
        dispatch(getPosts())
        api = "https://jsonplaceholder.typicode.com/posts";
        console.log('getting posts',api);
        try {
            //const response = await fetch('https://jsonplaceholder.typicode.com/posts')
            const response = await fetch(api)
            const data = await response.json()

            dispatch(getPostsSuccess(data))
        } catch (error) {
            dispatch(getPostsFailure())
        }
    }
}