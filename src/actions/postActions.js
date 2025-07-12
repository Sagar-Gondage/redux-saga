export const fetchPosts = (page = 1) => ({
    type: "FETCH_POSTS_REQUEST",
    payload: { page }
});

export const fetchMorePosts = (page) => ({
    type: "FETCH_MORE_POSTS_REQUEST",
    payload: { page }
});

export const addPost = (post) => ({
    type: "ADD_POST_REQUEST",
    payload: post
});

export const removePost = (id) => ({
    type: "REMOVE_POST_REQUEST",
    payload: id
});