import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import apiClient from '../ApiRequest/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
    id?: number
    username?: string;
    display_name?: string;
    role?: string;
    avatar?: string;
    create_at?: string;
    sex?: string
}
type AuthContextType = {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [refreshToken, setRefreshToken] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true);

    const login = (user: User) => {
        setUser(user); // Simulate login, update this for real API integration.
    };

    useEffect(() => {
        // Function to get the token from AsyncStorage
        const fetchAccessToken = async () => {
            const access_token = await AsyncStorage.getItem('access_token');
            setAccessToken(access_token);
            const refresh_token = await AsyncStorage.getItem('refresh_token');
            setAccessToken(refresh_token);
        };

        fetchAccessToken();
    }, []);
    const logout = () => {
        setUser(null); // Simulate logout.
    };

    const fetchUserInfor = async () => {
        try {
            const response = await apiClient.post("auth/access-token", { access_token: String(accessToken), refresh_token: String(refreshToken) })
            setUser(response.data.user)
            await AsyncStorage.setItem("access_token", response.data.accessToken)
        } catch (error: any) {
            console.log(error.response?.status)

        } finally {
            setLoading(false);
        }
    }
    // fetchUserInfor()
    useEffect(() => {
        const getAccessToken = async () => {
            const storedToken = await AsyncStorage.getItem("access_token");
            setAccessToken(storedToken);
            if (storedToken) {
                fetchUserInfor();
            }
        }
        getAccessToken()
    }, [])
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for accessing the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
