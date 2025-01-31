import { jwtDecode } from 'jwt-decode'; // Add this import

export const saveToken = (token, user) => {
    if (!token || !user) {
        console.error('Token or user data missing');
        return false;
    }
    
    try {
        // Decode token to check expiration
        const decodedToken = jwtDecode(token);
        if (!decodedToken.exp) {
            console.error('Token missing expiration');
            return false;
        }

        // Store token data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('tokenExpiration', decodedToken.exp * 1000); // Convert to milliseconds
        return true;
    } catch (error) {
        console.error('Error saving token:', error);
        return false;
    }
};

export const getToken = () => {
    try {
        const token = localStorage.getItem('token');
        const expiration = localStorage.getItem('tokenExpiration');
        
        if (!token || !expiration) {
            return null;
        }

        // Check if token is expired
        if (Date.now() >= parseInt(expiration)) {
            clearToken();
            return null;
        }

        return token;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

export const getUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};

export const clearToken = () => {
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiration');
    } catch (error) {
        console.error('Error clearing token:', error);
    }
};

export const isTokenValid = () => {
    try {
        const token = getToken();
        if (!token) return false;

        const decodedToken = jwtDecode(token);
        return decodedToken.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};