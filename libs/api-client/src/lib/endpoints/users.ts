import axiosInstance from '../axios-instance';

export const usersApi = {
    getAllUsers: () => axiosInstance.get('/api/users'),
    getUserById: (id: string) => axiosInstance.get(`/api/users/${id}`),
    createUser: (data: any) => axiosInstance.post('/api/users', data),
    updateUser: (id: string, data: any) => axiosInstance.put(`/api/users/${id}`, data),
    deleteUser: (id: string) => axiosInstance.delete(`/api/users/${id}`),
};
