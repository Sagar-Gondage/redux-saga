import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addPost } from "../actions/postActions";
import { 
    Form, 
    Input, 
    Button, 
    Card, 
    CardBody,
    CardHeader,
    FormGroup,
    Label
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faPen, faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import './PostList.css'; // For animations
import styles from './AddPost.module.css'; // Import CSS modules with correct filename

function AddPost() {
    const dispatch = useDispatch();
    const [post, setPost] = useState({
        title: "",
        body: ""
    });
    const [errors, setErrors] = useState({
        title: "",
        body: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setPost(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ""
            });
        }
    };

    const handleSubmit = e => {
        e.preventDefault();
        
        // Validate inputs
        const newErrors = {
            title: post.title.trim() === "" ? "Title is required" : "",
            body: post.body.trim() === "" ? "Content is required" : ""
        };
        
        setErrors(newErrors);
        
        // If no errors, submit the post
        if (!newErrors.title && !newErrors.body) {
            setIsSubmitting(true);
            
            // Simulate a delay to show the animation
            setTimeout(() => {
                dispatch(addPost(post));
                setPost({ title: "", body: "" });
                setIsSubmitting(false);
            }, 500);
        }
    };

    return (
        <div className={`d-flex justify-content-center fade-in ${styles.container}`}>
            <Card className={styles.card}>
                <CardHeader className={styles.cardHeader}>
                    <h4 className="mb-0">Create New Post</h4>
                </CardHeader>
                <CardBody className="p-4" style={{ position: 'relative', zIndex: 1 }}>
                    <Form onSubmit={handleSubmit} className="fade-in">
                        <FormGroup className={styles.formGroup}>
                            <Label for="title" className={styles.label}>
                                <FontAwesomeIcon icon={faPen} className={styles.iconMargin} />
                                Post Title
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Enter an interesting title"
                                value={post.title}
                                onChange={handleChange}
                                className={`hover-effect ${styles.input} ${errors.title ? 'is-invalid' : ''}`}
                            />
                            {errors.title && <div className={styles.errorText}>{errors.title}</div>}
                        </FormGroup>
                        <FormGroup className={styles.formGroup}>
                            <Label for="body" className={styles.label}>
                                <FontAwesomeIcon icon={faAlignLeft} className={styles.iconMargin} />
                                Post Content
                            </Label>
                            <Input
                                id="body"
                                name="body"
                                type="textarea"
                                rows="5"
                                placeholder="Share your thoughts..."
                                value={post.body}
                                onChange={handleChange}
                                className={`hover-effect ${styles.textArea} ${errors.body ? 'is-invalid' : ''}`}
                            />
                            {errors.body && <div className={styles.errorText}>{errors.body}</div>}
                        </FormGroup>
                        <Button
                            type="submit"
                            className={`w-100 mt-3 hover-effect ${styles.submitButton} ${isSubmitting ? 'pulse-effect' : ''}`}
                            disabled={isSubmitting}
                        >
                            <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
                            {isSubmitting ? 'Publishing...' : 'Publish Post'}
                        </Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
}

export default AddPost;