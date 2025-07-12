import { all, takeEvery, put, spawn, call, delay } from "redux-saga/effects";

// Function to fetch posts from API with pagination
function* fetchPostsSaga(action) {
    try {
        // Get page from action payload or default to 1
        const page = action.payload?.page || 1;
        const limit = 5;
        
        // Delay for 1 second to simulate network latency
        // yield delay(1000);
        
        // Make API call to JSONPlaceholder with pagination parameters
        const response = yield call(
            fetch, 
            `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
        );
        
        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.status}`);
        }
        
        const data = yield call([response, 'json']);
        const totalCount = 15;
        // const totalCount = parseInt(response.headers.get('x-total-count') || '100');
        const hasMore = page * limit < totalCount;
        
        // Dispatch success action with the fetched posts
        yield put({ 
            type: "FETCH_POSTS_SUCCESS", 
            payload: {
                posts: data,
                page,
                hasMore
            }
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        yield put({ type: "FETCH_POSTS_FAILURE", error: error.message });
    }
}

// Function to fetch more posts for pagination
function* fetchMorePostsSaga(action) {
    try {
        const { page } = action.payload;
        const limit = 5;
        
        // Delay for 1 second to simulate network latency
        yield delay(1000);
        
        // Make API call to JSONPlaceholder with pagination parameters
        const response = yield call(
            fetch, 
            `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
        );
        
        if (!response.ok) {
            throw new Error(`Failed to fetch more posts: ${response.status}`);
        }
        
        const data = yield call([response, 'json']);
        const totalCount = 15;
        // const totalCount = parseInt(response.headers.get('x-total-count') || '30');
        const hasMore = page * limit < totalCount;
        
        // Dispatch success action with the additional fetched posts
        yield put({ 
            type: "FETCH_MORE_POSTS_SUCCESS", 
            payload: {
                posts: data,
                page,
                hasMore
            }
        });
    } catch (error) {
        console.error("Error fetching more posts:", error);
        yield put({ type: "FETCH_MORE_POSTS_FAILURE", error: error.message });
    }
}

// Function to add a new post
function* addPostSaga(action) {
    try {
        // In a real app, you would make an API call to create the post
        console.log("Adding post in saga:", action.payload);
        
        // Dispatch success action with the new post data
        yield put({ type: "ADD_POST_SUCCESS", payload: action.payload });
    } catch (error) {
        console.error("Error in addPostSaga:", error);
        yield put({ type: "ADD_POST_FAILURE", error: error.message });
    }
}

// Function to remove a post
function* removePostSaga(action) {
    try {
        // In a real app, you would make an API call to delete the post
        console.log("Removing post in saga:", action.payload);
        
        // Dispatch success action with the post ID to remove
        yield put({ type: "REMOVE_POST_SUCCESS", payload: action.payload });
    } catch (error) {
        console.error("Error in removePostSaga:", error);
        yield put({ type: "REMOVE_POST_FAILURE", error: error.message });
    }
}

// Watches all the actions
function* watcher() {
    yield all([
        takeEvery("FETCH_POSTS_REQUEST", fetchPostsSaga),
        takeEvery("FETCH_MORE_POSTS_REQUEST", fetchMorePostsSaga),
        takeEvery("ADD_POST_REQUEST", addPostSaga),
        takeEvery("REMOVE_POST_REQUEST", removePostSaga)
    ]);
}

export default function* rootSaga() {
    const sagas = [watcher];

    yield all(
        sagas.map(saga =>
            spawn(function* () {
                while (true) {
                    try {
                        yield call(saga);
                        break;
                    } catch (e) {
                        console.log(e);
                    }
                }
            })
        )
    );
}