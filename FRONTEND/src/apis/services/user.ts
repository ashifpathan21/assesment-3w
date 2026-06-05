import api from "../api"

export interface ISignin {
    name: string,
    email: string,
    username: string,
    password: string
}

export interface ILogin {
    email: string,
    password: string
}

export const userAPI = {
    signin: (data: ISignin) => api.post('/user/signup', data),
    login: (data: ILogin) => api.post('/user/login', data),
    getProfile: () => api.get('/user/profile')
}

