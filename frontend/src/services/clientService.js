import API from './api';

export const getClients = async () => (await API.get('/clients')).data.clients;
export const createClient = async (client) => (await API.post('/clients', client)).data.client;
export const updateClient = async (id, client) => (await API.put(`/clients/${id}`, client)).data.client;
export const deleteClient = async (id) => API.delete(`/clients/${id}`);
