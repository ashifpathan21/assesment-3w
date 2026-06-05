// send this when like a post (like-post) or unlike (unlike-post)
export interface ILikeSent {
    id: String
}

// send this when add or delete comment
export interface ICommentSent {
    id: String;
    text: String;
    commentId?: String
}

/*
 when someone liked on your post (liked-your-post) 
 parsed data contains like = {by:{_id,name,username,email},post:postId}
*/
export interface ILikedReceived {
    _id: string,
    by: {
        _id: string,
        name: string,
        email: string,
        username: string
    },
    post: string
}


export interface ICommentRecieved {
    _id: string,
    by: {
        _id: string,
        name: string,
        email: string,
        username: string
    },
    post: string,
    text: string
}