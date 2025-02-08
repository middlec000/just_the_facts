import React, { useEffect, useState } from 'react';
import Post from '../components/Post';
import Evidence from '../components/Evidence';
import { fetchPosts } from '../services/api';

const Home: React.FC = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const loadPosts = async () => {
            const fetchedPosts = await fetchPosts();
            setPosts(fetchedPosts);
        };
        loadPosts();
    }, []);

    return (
        <div className="home">
            <h1>Home</h1>
            {posts.map((post) => (
                <div key={post.id}>
                    <Post content={post.content} author={post.author} timestamp={post.timestamp} />
                    {post.evidence && post.evidence.map((evi) => (
                        <Evidence key={evi.id} evidenceType={evi.type} description={evi.description} link={evi.link} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Home;