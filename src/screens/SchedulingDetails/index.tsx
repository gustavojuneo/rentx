import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/core';
import { useTheme } from 'styled-components';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { format } from 'date-fns';
import { useNetInfo } from '@react-native-community/netinfo';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import { api } from '../../services/api';

import { CarDTO } from '../../dtos/CarDTO';
import { Car as ModelCar } from '../../database/model/Car';
import { getPlatformDate } from '../../utils/getPlataformDate';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';

import {
  Container,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  RentalPeriod,
  CalendarIcon,
  DateInfo,
  DateTitle,
  DateValue,
  Accessories,
  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuota,
  RentalTotalPrice,
  Footer,
} from './styles';
import { Alert } from 'react-native';

interface ParamsProps {
  car: ModelCar;
  dates: string[];
}

interface RentalPeriod {
  start: string;
  end: string;
}

export function SchedulingDetails() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);
  const { car, dates } = route.params as ParamsProps;
  const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>(
    {} as RentalPeriod
  );
  const rentTotal = Number(dates.length * car.price);

  function handleBack() {
    navigation.goBack();
  }

  async function handleConfirmScheduling() {
    try {
      setLoading(true);

      await api
        .post('rentals', {
          user_id: 1,
          car_id: car.id,
          start_date: new Date(dates[0]),
          end_date: new Date(dates[dates.length - 1]),
          total: rentTotal,
        })
        .then(() => {
          navigation.navigate(
            'Confirmation' as never,
            {
              title: 'Carro alugado!',
              message: `Agora você só precisa ir\naté a concessionária da RENTX\npegar o seu automóvel.`,
              nextScreenRoute: 'Home',
            } as never
          );
        });
    } catch (err) {
      setLoading(false);
      Alert.alert('Não foi possível confirmar o agendamento');
    }
  }

  useEffect(() => {
    setRentalPeriod({
      start: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
      end: format(
        getPlatformDate(new Date(dates[dates.length - 1])),
        'dd/MM/yyyy'
      ),
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function fetchCarUpdated() {
      const response = await api.get(`/cars/${car.id}`);
      if (isMounted) {
        setCarUpdated(response.data);
      }
    }

    if (netInfo.isConnected === true) {
      fetchCarUpdated();
    }
    return () => {
      isMounted = false;
    };
  }, [netInfo.isConnected]);

  return (
    <Container>
      <StatusBar style="dark" />
      <Header>
        <BackButton onPress={handleBack} />
      </Header>

      <CarImages>
        <ImageSlider
          imagesUrl={
            !!carUpdated.photos
              ? carUpdated.photos
              : [{ id: car.thumbnail, photo: car.thumbnail }]
          }
        />

        <Content>
          <Details>
            <Description>
              <Brand>{car.brand}</Brand>
              <Name>{car.name}</Name>
            </Description>

            <Rent>
              <Period>{car.period}</Period>
              <Price>R$ {car.price}</Price>
            </Rent>
          </Details>

          {carUpdated.accessories && (
            <Accessories>
              {carUpdated.accessories.map(accessory => (
                <Accessory
                  key={accessory.type}
                  name={accessory.name}
                  icon={getAccessoryIcon(accessory.type)}
                />
              ))}
            </Accessories>
          )}

          <RentalPeriod>
            <CalendarIcon>
              <Feather
                name="calendar"
                size={RFValue(24)}
                color={theme.colors.shape}
              />
            </CalendarIcon>

            <DateInfo>
              <DateTitle>DE</DateTitle>
              <DateValue>{rentalPeriod.start}</DateValue>
            </DateInfo>

            <Feather
              name="chevron-right"
              size={RFValue(10)}
              color={theme.colors.text_detail}
            />

            <DateInfo>
              <DateTitle>ATÉ</DateTitle>
              <DateValue>{rentalPeriod.end}</DateValue>
            </DateInfo>
          </RentalPeriod>

          <RentalPrice>
            <RentalPriceLabel>TOTAL</RentalPriceLabel>
            <RentalPriceDetails>
              <RentalPriceQuota>{`R$ ${car.price} x${dates.length} diárias`}</RentalPriceQuota>
              <RentalTotalPrice>R$ {rentTotal}</RentalTotalPrice>
            </RentalPriceDetails>
          </RentalPrice>
        </Content>

        <Footer>
          <Button
            title="Alugar agora"
            color={theme.colors.success}
            onPress={handleConfirmScheduling}
            enabled={!loading}
            loading={loading}
          />
        </Footer>
      </CarImages>
    </Container>
  );
}
