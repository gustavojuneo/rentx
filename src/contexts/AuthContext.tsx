import React, { createContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';

import { UserDTO } from '../dtos/UserDTO';
import { api } from '../services/api';

interface AuthState {
  token: string;
  user: UserDTO;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: UserDTO;
  signIn: (credentials: SignInCredentials) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [data, setData] = useState<AuthState>({} as AuthState);

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const response = await api.post<AuthState>('/sessions', {
        email,
        password,
      });
      const { token } = response.data;

      api.defaults.headers.authorization = `Bearer ${token}`;
      setData(response.data);
    } catch (err) {
      console.log(err);
      Alert.alert(
        'Opa',
        'Não foi possível autenticar, por favor verificar as credencias!'
      );
    }
  };

  return (
    <AuthContext.Provider value={{ user: data.user, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
