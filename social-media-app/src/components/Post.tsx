import React from 'react';

interface PostProps {
    content: string;
    author: string;
    timestamp: string;
}

const Post: React.FC<PostProps> = ({ content, author, timestamp }) => {
    const handleLike = () => {
        // Logic for liking the post
    };

    const handleComment = () => {
        // Logic for commenting on the post
    };

    return (
        <div className="post">
            <h3>{author}</h3>
            <p>{content}</p>
            <small>{timestamp}</small>
            <button onClick={handleLike}>Like</button>
            <button onClick={handleComment}>Comment</button>
        </div>
    );
};

export default Post;