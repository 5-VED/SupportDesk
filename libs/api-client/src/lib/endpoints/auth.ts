import axiosInstance from '../axios-instance';

export const authApi = {
    login: (email: string, password: string) =>
        axiosInstance.post('/api/auth/login', { email, password }),
    signup: (data: any) => axiosInstance.post('/api/auth/signup', data),
    logout: () => axiosInstance.post('/api/auth/logout'),
    getCurrentUser: () => axiosInstance.get('/api/auth/me'),
};
