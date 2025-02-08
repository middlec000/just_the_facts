import React, { useEffect, useState } from 'react';
import { fetchUserData, fetchUserPosts } from '../services/api';
import Post from '../components/Post';

const Profile: React.FC = () => {
    const [userData, setUserData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const loadUserData = async () => {
            const data = await fetchUserData();
            setUserData(data);
        };

        const loadUserPosts = async () => {
            const posts = await fetchUserPosts();
            setUserPosts(posts);
        };

        loadUserData();
        loadUserPosts();
    }, []);

    return (
        <div className="profile">
            {userData && (
                <div className="user-info">
                    <h1>{userData.name}</h1>
                    <p>{userData.email}</p>
                </div>
            )}
            <div className="user-posts">
                <h2>Your Posts</h2>
                {userPosts.map(post => (
                    <Post key={post.id} content={post.content} author={post.author} timestamp={post.timestamp} />
                ))}
            </div>
        </div>
    );
};

export default Profile;