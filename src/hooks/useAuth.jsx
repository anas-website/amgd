import { useState, useEffect, createContext, useContext } from 'react';
import { account, tables, DATABASE_ID, TABLE_USERS } from '../appwrite/config';
import { Query } from 'appwrite';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const sessionUser = await account.get();
            setUser(sessionUser);
            setRole(null);

            // Fetch role from users table (optional - 404 if collection doesn't exist yet)
            try {
                const userTableRes = await tables.listDocuments(
                    DATABASE_ID,
                    TABLE_USERS,
                    [Query.equal('$id', sessionUser.$id)]
                );
                if (userTableRes.documents.length > 0) {
                    setRole(userTableRes.documents[0].role);
                }
            } catch (dbError) {
                // Users table missing (404) or DB error - user stays logged in, just no admin role
                console.warn('Could not fetch user role (create "users" collection in Appwrite if needed):', dbError?.message || dbError);
            }
        } catch (error) {
            // No valid session (expired, not logged in)
            setUser(null);
            setRole(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            await account.deleteSession('current');
        } catch (error) {
            // Ignore error if there is no session to delete
        }
        const session = await account.createEmailPasswordSession(email, password);
        await checkSession();
        return session;
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            setUser(null);
            setRole(null);
        }
    };

    const value = {
        user,
        role,
        loading,
        login,
        logout,
        isAdmin: role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
