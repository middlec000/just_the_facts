export const fetchPosts = async () => {
    const response = await fetch('/api/posts');
    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }
    return response.json();
};

export const submitPost = async (post) => {
    const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
    });
    if (!response.ok) {
        throw new Error('Failed to submit post');
    }
    return response.json();
};

export const fetchEvidence = async (postId) => {
    const response = await fetch(`/api/posts/${postId}/evidence`);
    if (!response.ok) {
        throw new Error('Failed to fetch evidence');
    }
    return response.json();
};