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

    getCurrentUserProfile() {
        const user = this.getCurrentUser();
        return user && user.profile ? user.profile : null;
    }

    async getProfileByEmail(email) {
        try {
            const response = await axios.get(`${this.apiUrl}/profiles`, {
                params: { email }
            });

            const profiles = response.data;
            return profiles.length > 0 ? profiles[0] : null;
        } catch (error) {
            console.error('Error al obtener perfil por email:', error);
            return null;
        }
    }

    async register({ name, email, password, role }) {
        try {
            const newUserRes = await axios.post(`${this.apiUrl}/users`, {
                username: email,
                password
            });
            const newUser = newUserRes.data;

            const profile = {
                id: newUser.id,
                profileId: newUser.id,
                userId: newUser.id,
                name,
                email,
                role
            };

            await axios.post(`${this.apiUrl}/profiles`, profile);

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
