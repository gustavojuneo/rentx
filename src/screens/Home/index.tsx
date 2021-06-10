import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { StatusBar } from 'expo-status-bar';
import { RFValue } from 'react-native-responsive-fontsize';

import Logo from '../../assets/logo.svg';

import { api } from '../../services/api';
import { CarDTO } from '../../dtos/CarDTO';
import { Car } from '../../components/Car';
import { Loading } from '../../components/Loading';

import { Container, Header, HeaderContent, TotalCars, CarList } from './styles';

export function Home() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<CarDTO[]>([]);

  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', { car });
  }

  async function getCars() {
    try {
      const { data } = await api.get('cars');
      setCars(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCars();
  }, []);

  return (
    <Container>
      <StatusBar style="light" />

      <Header>
        <HeaderContent>
          <Logo width={RFValue(108)} height={RFValue(12)} />
          <TotalCars>Total de 12 carros</TotalCars>
        </HeaderContent>
      </Header>

      {loading ? (
        <Loading />
      ) : (
        <CarList
          data={cars}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Car data={item} onPress={() => handleCarDetails(item)} />
          )}
        />
      )}
    </Container>
  );
}
