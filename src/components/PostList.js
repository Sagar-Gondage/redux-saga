import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, removePost, fetchMorePosts } from "../actions/postActions";
import { 
    Card, 
    CardBody, 
    CardHeader,
    ListGroup, 
    ListGroupItem, 
    Badge,
    Button,
    Spinner
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt, faInbox, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import './PostList.css'; // For animations
import styles from './PostList.module.css'; // Import CSS modules with correct filename
import useInfiniteScroll from '../hooks/useInfiniteScroll'; // Import our custom hook

// Loading indicator component for fetching more posts
const LoadingMoreIndicator = () => (
    <div className={`fade-in ${styles.loadingMoreSpinner}`}>
        <div className="d-flex align-items-center justify-content-center">
            <div className={styles.spinnerContainer}>
                <Spinner 
                    color="primary" 
                    size="sm" 
                    className={`${styles.spinnerOverlay} ${styles.spinnerPrimary}`} 
                />
                <Spinner 
                    color="primary" 
                    size="sm" 
                    className={`${styles.spinnerOverlay} ${styles.spinnerSecondary}`} 
                />
            </div>
            <span className={styles.loadingMoreText}>Loading more posts...</span>
        </div>
    </div>
);

const PostList = () => {
    const dispatch = useDispatch();
    const { 
        posts, 
        loading, 
        loadingMore, 
        error, 
        page, 
        hasMore 
    } = useSelector(state => state.posts);
    const [refreshing, setRefreshing] = useState(false);
    
    // Function to trigger loading more posts
    const loadMorePosts = useCallback(() => {
        if (!loadingMore && hasMore) {
            console.log("[PostList] Loading more posts, page:", page + 1);
            dispatch(fetchMorePosts(page + 1));
        } else {
            console.log("[PostList] Cannot load more:", { loadingMore, hasMore, page });
        }
    }, [dispatch, loadingMore, hasMore, page]);

    // Use our custom infinite scroll hook - enable debugging for development
    useInfiniteScroll({
        onLoadMore: loadMorePosts,
        hasMore: hasMore,
        isLoading: loadingMore,
        threshold: 300,
        useWindowScroll: true,
        debug: true // Enable debugging to see what's happening with the scroll detection
    });

    // Handle initial post loading
    useEffect(() => {
        dispatch(fetchPosts(1));
        console.log("[PostList] Initial load triggered");
    }, [dispatch]);

    // Monitor state changes for debugging
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log("[PostList] State updated:", { 
                postsCount: posts.length, 
                loading, 
                loadingMore, 
                page, 
                hasMore
            });
        }
    }, [posts.length, loading, loadingMore, page, hasMore]);

    const handleRemovePost = (id) => {
        dispatch(removePost(id));
    };

    const handleRefresh = () => {
        setRefreshing(true);
        dispatch(fetchPosts(1));
        setTimeout(() => setRefreshing(false), 2000);
    };

    // Content loader for skeleton UI while loading
    const ContentLoader = () => (
        <div className={`d-flex justify-content-center ${styles.container}`}>
            <Card className={styles.card}>
                <CardHeader className={styles.cardHeader}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Loading Posts...</h4>
                        <Spinner size="sm" color="light" />
                    </div>
                </CardHeader>
                <CardBody className="p-2">
                    <ListGroup flush>
                        {[...Array(5)].map((_, i) => (
                            <ListGroupItem key={i} className={`border-0 mb-2 ${styles.listItem}`}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div className="placeholder-glow w-75">
                                        <span className="placeholder col-12" style={{height: '1.5rem'}}></span>
                                    </div>
                                    <div className="placeholder-glow" style={{ width: '60px' }}>
                                        <span className="placeholder col-12 rounded-pill" style={{height: '1.5rem'}}></span>
                                    </div>
                                </div>
                                <div className="placeholder-glow mb-3">
                                    <span className="placeholder col-12" style={{height: '0.9rem'}}></span>
                                    <span className="placeholder col-10" style={{height: '0.9rem'}}></span>
                                    <span className="placeholder col-8" style={{height: '0.9rem'}}></span>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <div className="placeholder-glow" style={{ width: '80px' }}>
                                        <span className="placeholder col-12 rounded-pill" style={{height: '1.8rem'}}></span>
                                    </div>
                                </div>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </CardBody>
            </Card>
        </div>
    );

    if (loading) {
        return <ContentLoader />;
    }

    if (error) {
        return (
            <div className={`d-flex justify-content-center ${styles.container}`}>
                <Card className={styles.card} style={{maxWidth: '500px'}}>
                    <CardHeader className={styles.cardHeader} style={{background: 'linear-gradient(135deg, #cb2d3e 0%, #ef473a 100%)'}}>
                        <h4 className="mb-0">Error Loading Posts</h4>
                    </CardHeader>
                    <CardBody className="text-center p-4">
                        <p className="mb-3">{error}</p>
                        <Button color="primary" onClick={() => dispatch(fetchPosts())} style={{borderRadius: '50px'}}>
                            Try Again
                        </Button>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className={`d-flex justify-content-center fade-in ${styles.container}`}>
            <Card className={styles.card}>
                <CardHeader className={styles.cardHeader}>
                    <h4 className="mb-0">Latest Posts</h4>
                    <Button 
                        color="link" 
                        className={`${styles.refreshButton} ${refreshing ? 'rotate-animation' : ''}`}
                        onClick={handleRefresh}
                    >
                        <FontAwesomeIcon icon={faSyncAlt} />
                    </Button>
                </CardHeader>
                <CardBody className="p-2" style={{ position: 'relative', zIndex: 1 }}>
                    <ListGroup 
                        className={`custom-scrollbar stagger-children ${styles.listGroup}`}
                    >
                        {posts.length === 0 ? (
                            <div className={`fade-in ${styles.noPostsMessage}`}>
                                <FontAwesomeIcon 
                                    icon={faInbox} 
                                    className="mb-3" 
                                    style={{fontSize: '2rem', color: '#6c757d'}} 
                                />
                                <p>No posts available. Add a new post above!</p>
                            </div>
                        ) : (
                            <>
                                {posts.map((post) => (
                                    <ListGroupItem 
                                        key={post.id}
                                        className={`border-0 mb-2 hover-effect ${styles.listItem}`}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className={styles.postTitle}>{post.title}</h5>
                                            <Badge 
                                                pill
                                                className={`pulse-effect ${styles.badgeCustom}`}
                                            >
                                                #{post.id}
                                            </Badge>
                                        </div>
                                        <p className={styles.postBody}>{post.body}</p>
                                        <div className="d-flex justify-content-end">
                                            <Button 
                                                color="danger" 
                                                size="sm"
                                                className={`hover-effect ${styles.buttonRemove}`}
                                                onClick={() => handleRemovePost(post.id)}
                                            >
                                                <FontAwesomeIcon icon={faTrashAlt} className="me-1" /> Remove
                                            </Button>
                                        </div>
                                    </ListGroupItem>
                                ))}
                                
                                {/* Enhanced loading indicator at the bottom when fetching more posts */}
                                {loadingMore && <LoadingMoreIndicator />}
                                
                                {/* No more posts message */}
                                {!hasMore && posts.length > 0 && (
                                    <div className="text-center text-muted py-3 fade-in">
                                        <small>No more posts to load</small>
                                    </div>
                                )}
                            </>
                        )}
                    </ListGroup>
                </CardBody>
            </Card>
            
            {/* Debug information panel - only show in development */}
            {process.env.NODE_ENV === 'development' && (
                <div className={styles.debugPanel}>
                    <div><strong>Posts:</strong> {posts.length}</div>
                    <div><strong>Page:</strong> {page}</div>
                    <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
                    <div><strong>Loading More:</strong> {loadingMore ? 'Yes' : 'No'}</div>
                    <div><strong>Has More:</strong> {hasMore ? 'Yes' : 'No'}</div>
                </div>
            )}
        </div>
    );
};

export default PostList;