// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { userService } from 'C:/Users/John Anthony/studdy-system/studdy_frontend/src/services/UserService.jsx';

// const AuthContext = createContext({});

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       fetchUserProfile();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const fetchUserProfile = async () => {
//     try {
//       const userData = await userService.getCurrentUser();
//       setUser(userData);
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//       localStorage.removeItem('authToken');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = (userData, token) => {
//     localStorage.setItem('authToken', token);
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem('authToken');
//     setUser(null);
//     window.location.href = '/login';
//   };

//   const updateUserProfile = async (updatedData) => {
//     try {
//       const updatedUser = await userService.updateProfile(updatedData);
//       setUser(updatedUser);
//       return updatedUser;
//     } catch (error) {
//       console.error('Error updating user profile:', error);
//       throw error;
//     }
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     logout,
//     updateUserProfile,
//     fetchUserProfile
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };