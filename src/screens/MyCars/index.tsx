import React, { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import { useNavigation, useIsFocused } from '@react-navigation/core';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import { FlatList } from 'react-native';
import { format, parseISO } from 'date-fns';

import { api } from '../../services/api';
import { Car as ModelCar } from '../../database/model/Car';

import { BackButton } from '../../components/BackButton';
import { LoadAnimation } from '../../components/LoadAnimation';
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
  CarWrapper,
  CarFooter,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate,
} from './styles';

interface DataProps {
  id: string;
  car: ModelCar;
  start_date: string;
  end_date: string;
}

export function MyCars() {
  const navigation = useNavigation();
  const theme = useTheme();
  const screenIsFocus = useIsFocused();
  const [cars, setCars] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState(true);

  function handleBack() {
    navigation.goBack();
  }

  useEffect(() => {
    let isMounted = true;
    async function fetchCars() {
      try {
        const response = await api.get('rentals');
        const dataFormatted = response.data.map((data: DataProps) => {
          return {
            car: data.car,
            id: data.id,
            start_date: format(parseISO(data.start_date), 'dd/MM/yyyy'),
            end_date: format(parseISO(data.end_date), 'dd/MM/yyyy'),
          };
        });
        if (isMounted) {
          setCars(dataFormatted);
        }
      } catch (err) {
        console.log(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchCars();
    return () => {
      isMounted = false;
    };
  }, [screenIsFocus]);

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
        <LoadAnimation />
      ) : (
        <Content>
          <Appointments>
            <AppointmentTitle>Agendamentos feitos</AppointmentTitle>
            <AppointmentQuantity>{cars.length}</AppointmentQuantity>
          </Appointments>

          <FlatList
            data={cars}
            contentContainerStyle={{ padding: 24 }}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <CarWrapper>
                <Car data={item.car} />
                <CarFooter>
                  <CarFooterTitle>Período</CarFooterTitle>
                  <CarFooterPeriod>
                    <CarFooterDate>{item.start_date}</CarFooterDate>
                    <AntDesign
                      name="arrowright"
                      size={20}
                      color={theme.colors.title}
                      style={{ marginHorizontal: 10 }}
                    />
                    <CarFooterDate>{item.end_date}</CarFooterDate>
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
