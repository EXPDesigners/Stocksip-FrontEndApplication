import { BaseService } from '@/shared/services/base.service.js';
import axios from 'axios';

class UserService extends BaseService {
    constructor() {
        super();
        this.resourceEndpoint = import.meta.env.VITE_USER_ENDPOINT_PATH;
        this.apiUrl = import.meta.env.VITE_API_URL;
        this.profileEndpoint = import.meta.env.VITE_PROFILE_ENDPOINT_PATH;
    }

    async login(username, password) {
        try {
            const res = await axios.get(`${this.apiUrl}${this.resourceEndpoint}?username=${username}&password=${password}`);
            const users = res.data;

            if (users.length === 0) return false;

            const user = users[0];

            const profileRes = await axios.get(`${this.apiUrl}${this.profileEndpoint}/${user.profileId}`);
            const profile = profileRes.data;

            if (!profile) throw new Error('Profile not found');

            const currentUser = {
                ...user,
                profileId: profile.profileId,
                profile
            };

            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            return true;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }


    getCurrentUser() {
        const savedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    }

    async register({ name, email, password, role }) {
        try {
            // Crear usuario
            const newUserRes = await axios.post(`${this.apiUrl}/users`, {
                username: email,
                password
            });
            const newUser = newUserRes.data;

            // Crear perfil asociado
            const profile = {
                id: newUser.id,         // ID del perfil será igual al del usuario
                profileId: newUser.id,  // También usado como identificador lógico
                userId: newUser.id,     // Referencia explícita al user
                name,
                email,
                role
            };

            await axios.post(`${this.apiUrl}/profiles`, profile);

            // Actualizar el usuario con el profileId
            await axios.patch(`${this.apiUrl}/users/${newUser.id}`, {
                profileId: newUser.id
            });

            return newUser;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }


}

export default new UserService();
