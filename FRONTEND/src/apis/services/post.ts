import api from "../api";



export const postAPI = {
    create: (data: FormData) => api.post('/post/', data),
    delete: (postId: string) => api.delete(`/post/${postId}`),
    getFeed: (page: number = 0) => api.get(`/post/?q=${page}`)
}