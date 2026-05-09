import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:5000/api/auth',
    withCredentials: true
});

// Log all requests
api.interceptors.request.use(
    config => {
        console.log("📤 API Request:", config.method.toUpperCase(), config.url);
        return config;
    },
    error => {
        console.error("❌ Request error:", error);
        return Promise.reject(error);
    }
);

// Log all responses and errors
api.interceptors.response.use(
    response => {
        console.log("📥 API Response:", response.status, response.data);
        return response;
    },
    error => {
        console.error("❌ Response error:", error.message, error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

// 📝 REGISTER
export async function register({ username, email, password }) {
    try {
        console.log("📝 Attempting register with:", { username, email });
        const response = await api.post('/register', {
            username,
            email,
            password
        });
        console.log("✅ Register successful:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Register API error:", error.message, error.response?.data);
        throw error; 
    }
}

// 🔐 LOGIN
export async function login({ email, password }) {
    try {
        console.log("🔐 Attempting login with:", { email });
        const response = await api.post('/login', {
            email,
            password
        });
        console.log("✅ Login successful:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Login API error:", error.message, error.response?.data);
        throw error; 
    }
}

// 🚪 LOGOUT
export async function logout() {
    try {
        const response = await api.get('/logout');
        return response.data;
    } catch (error) {
        console.error("Logout API error:", error);
        throw error; 
    }
}

// 👤 GET USER
export async function getMe() {
    try {
        const response = await api.get('/get-me');
        return response.data;
    } catch (error) {
        console.error("GetMe API error:", error);
        throw error; 
    }
}