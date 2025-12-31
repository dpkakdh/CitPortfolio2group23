// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import { loginUser, registerUser } from "../api/authApi";

// const TOKEN_KEY = "token";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);

//   /**
//    * Restore basic user info from token
//    * (replace with /me endpoint if you have one)
//    */
//   useEffect(() => {
//     if (!token) {
//       setUser(null);
//       return;
//     }

//     if (!user) {
//       setUser({ isAuthenticated: true });
//     }
//   }, [token, user]);

//   /**
//    * LOGIN
//    */
//   const login = async (email, password) => {
//     setLoading(true);
//     try {
//       const res = await loginUser({ email, password });

//       // Your apiFetch returns JSON directly
//       const jwt = res?.token;
//       if (!jwt) throw new Error("Token not returned from API");

//       localStorage.setItem(TOKEN_KEY, jwt);
//       setToken(jwt);

//       // Store minimal user info (expand if backend returns more)
//       const u = res?.user || { email };
//       setUser(u);

//       return { success: true, token: jwt, user: u };
//     } catch (err) {
//       return {
//         success: false,
//         message:
//           err?.response?.data?.message ||
//           err?.message ||
//           "Login failed",
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   /**
//    * REGISTER
//    */
//   const register = async (payload) => {
//     setLoading(true);
//     try {
//       await registerUser(payload);
//       return { success: true };
//     } catch (err) {
//       return {
//         success: false,
//         message:
//           err?.response?.data?.message ||
//           err?.message ||
//           "Registration failed",
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   /**
//    * LOGOUT
//    */
//   const logout = () => {
//     localStorage.removeItem(TOKEN_KEY);
//     setToken(null);
//     setUser(null);
//   };

//   const value = useMemo(
//     () => ({
//       token,
//       user,
//       loading,
//       isAuthenticated: !!token,
//       login,
//       register,
//       logout,
//     }),
//     [token, user, loading]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// /**
//  * Hook
//  */
// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
//   return ctx;
// }
