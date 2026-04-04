import axios from './axios';
import { LoginInput, RegisterInput } from '@/lib/client/validation';

export const api = {
    auth: {
        login: (data: LoginInput) => axios.post('/auth/login', data),
        register: (data: RegisterInput) => axios.post('/auth/register', data),
    },
    user: {
        // TODO: fix proper endpoint
        getProfile: () => axios.get('/user/profile'),
        claimDaily: () => axios.post('/user/daily'),
    },
};