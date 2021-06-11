import React, { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/core';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';

import { api } from '../../services/api';
import { CarDTO } from '../../dtos/CarDTO';

import { BackButton } from '../../components/BackButton';
import { Loading } from '../../components/Loading';
import { Car } from '../../components/Car';

import {
  Container,
  Header,
  Title,
  Subtitle,
  Content,
  Appointments,
  AppointmentTitle,
  AppointmentQuantity,
  CarList,
  CarWrapper,
  CarFooter,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate,
} from './styles';

interface CarProps {
  id: string;
  user_id: string;
  car: CarDTO;
  startDate: string;
  endDate: string;
}

export function MyCars() {
  const navigation = useNavigation();
  const theme = useTheme();
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);

  function handleBack() {
    navigation.goBack();
  }

  async function getCars() {
    try {
      const response = await api.get(`schedules_byuser?user_id=${1}`);
      setCars(response.data);
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
        <BackButton color={theme.colors.shape} onPress={handleBack} />

        <Title>
          Seus agendamentos, {'\n'}
          estão aqui.
        </Title>

        <Subtitle>Conforto, segurança e praticidade.</Subtitle>
      </Header>
      {loading ? (
        <Loading />
      ) : (
        <Content>
          <Appointments>
            <AppointmentTitle>Agendamentos feitos</AppointmentTitle>
            <AppointmentQuantity>{cars.length}</AppointmentQuantity>
          </Appointments>

          <CarList
            data={cars}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <CarWrapper>
                <Car data={item.car} />
                <CarFooter>
                  <CarFooterTitle>Período</CarFooterTitle>
                  <CarFooterPeriod>
                    <CarFooterDate>{item.startDate}</CarFooterDate>
                    <AntDesign
                      name="arrowright"
                      size={20}
                      color={theme.colors.title}
                      style={{ marginHorizontal: 10 }}
                    />
                    <CarFooterDate>{item.endDate}</CarFooterDate>
                  </CarFooterPeriod>
                </CarFooter>
              </CarWrapper>
            )}
          />
        </Content>
      )}
    </Container>
  );
}
