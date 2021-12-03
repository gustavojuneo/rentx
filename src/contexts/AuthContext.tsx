import React, { createContext, useState, ReactNode, useEffect } from 'react';

import { UserDTO } from '../dtos/UserDTO';
import { api } from '../services/api';
import { database } from '../database';
import { User as ModelUser } from '../database/model/User';

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: UserDTO;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: UserDTO) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [data, setData] = useState<UserDTO>({} as UserDTO);

  const getUserCollectionFromDatabase = () => database.get<ModelUser>('users');

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const response = await api.post('/sessions', {
        email,
        password,
      });
      const { token, user } = response.data;
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const userCollection = getUserCollectionFromDatabase();
      await database.write(async () => {
        await userCollection.create(newUser => {
          (newUser.user_id = user.id),
            (newUser.name = user.name),
            (newUser.email = user.email),
            (newUser.driver_license = user.driver_license),
            (newUser.avatar = user.avatar),
            (newUser.token = token);
        });
      });

      setData({ ...user, token });
    } catch (err: any) {
      throw new Error(err);
    }
  };

  const signOut = async () => {
    try {
      const userCollection = getUserCollectionFromDatabase();
      await database.write(async () => {
        const userSelected = await userCollection.find(data.id);
        await userSelected.destroyPermanently();
      });

      setData({} as UserDTO);
    } catch (err: any) {
      throw new Error(err);
    }
  };

  const updateUser = async (user: UserDTO) => {
    try {
      const userCollection = getUserCollectionFromDatabase();
      await database.write(async () => {
        const userSelected = await userCollection.find(data.id);
        await userSelected.update(userData => {
          (userData.name = user.name),
            (userData.driver_license = user.driver_license),
            (userData.avatar = user.avatar);
        });
      });

      setData(user);
    } catch (err: any) {
      throw new Error(err);
    }
  };

  useEffect(() => {
    async function loadUserData() {
      const userCollection = getUserCollectionFromDatabase();
      const response = await userCollection.query().fetch();

      if (response.length > 0) {
        const userData = response[0]._raw as unknown as UserDTO;
        api.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${userData.token}`;
        setData(userData);
      }
    }
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user: data, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
