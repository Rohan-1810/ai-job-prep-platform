import { useContext,useEffect } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register, logout, getMe} from "../services/auth.api.js";


// 🛠️ API INTERCEPTORS

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    const { user, setUser, loading, setLoading } = context;

    // 🔐 LOGIN
    const handleLogin = async ({ email, password }) => {
        try {
            setLoading(true);
            console.log("🔐 handleLogin called");

            const data = await login({ email, password });
            console.log("✅ Login data received:", data);

            // Safety check
            if (data && data.user) {
                setUser(data.user);
                console.log("✅ User set:", data.user);
            }
            return data;

        } catch (error) {
            console.error("❌ Login error in handleLogin:", error);
            alert("Login failed. Check credentials or server.");
            throw error;
        } finally {
            setLoading(false); 
        }
    };

    // 📝 REGISTER
    const handleRegister = async ({ username, email, password }) => {
        try {
            setLoading(true);
            console.log("📝 handleRegister called");

            const data = await register({ username, email, password });
            console.log("✅ Register data received:", data);

            if (data && data.user) {
                setUser(data.user);
                console.log("✅ User set:", data.user);
            }

        } catch (error) {
            console.error("❌ Register error in handleRegister:", error);
            alert("Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    // 🚪 LOGOUT
    const handleLogout = async () => {
        try {
            setLoading(true);

            await logout();
            setUser(null);

        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, handleLogin, handleRegister, handleLogout };
};