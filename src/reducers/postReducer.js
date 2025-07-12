const initialState = {
    posts: [],
    loading: false,
    loadingMore: false,
    error: null,
    page: 1,
    hasMore: true
};

const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_POSTS_REQUEST":
            return {
                ...state,
                loading: true,
                error: null
            };
        case "FETCH_POSTS_SUCCESS":
            return {
                ...state,
                loading: false,
                posts: action.payload.posts,
                page: action.payload.page,
                hasMore: action.payload.hasMore,
                error: null
            };
        case "FETCH_POSTS_FAILURE":
            return {
                ...state,
                loading: false,
                error: action.error
            };
        case "FETCH_MORE_POSTS_REQUEST":
            return {
                ...state,
                loadingMore: true,
                error: null
            };
        case "FETCH_MORE_POSTS_SUCCESS":
            return {
                ...state,
                loadingMore: false,
                posts: [...state.posts, ...action.payload.posts],
                page: action.payload.page,
                hasMore: action.payload.hasMore,
                error: null
            };
        case "FETCH_MORE_POSTS_FAILURE":
            return {
                ...state,
                loadingMore: false,
                error: action.error
            };
        case "ADD_POST_SUCCESS":
            // Create a new post object with the next available ID
            const newPost = {
                id: state.posts.length > 0 ? Math.max(...state.posts.map(post => post.id)) + 1 : 1,
                userId: 1, // Default userId
                title: action.payload.title,
                body: action.payload.body
            };
            return {
                ...state,
                posts: [...state.posts, newPost]
            };
        case "REMOVE_POST_SUCCESS":
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.payload)
            };
        default:
            return state;
    }
};

export default postReducer;