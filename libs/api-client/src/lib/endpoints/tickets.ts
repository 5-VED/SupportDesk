import axiosInstance from '../axios-instance';

export const ticketApi = {
    getAllTickets: () => axiosInstance.get('/api/tickets'),
    getTicketById: (id: string) => axiosInstance.get(`/api/tickets/${id}`),
    createTicket: (data: any) => axiosInstance.post('/api/tickets', data),
    updateTicket: (id: string, data: any) => axiosInstance.put(`/api/tickets/${id}`, data),
    deleteTicket: (id: string) => axiosInstance.delete(`/api/tickets/${id}`),
};
