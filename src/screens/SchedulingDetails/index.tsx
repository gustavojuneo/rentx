import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/core';
import { useTheme } from 'styled-components';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { format } from 'date-fns';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import { api } from '../../services/api';

import { CarDTO } from '../../dtos/CarDTO';
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
  car: CarDTO;
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
  const [loading, setLoading] = useState(false);
  const { car, dates } = route.params as ParamsProps;
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>(
    {} as RentalPeriod,
  );
  const rentTotal = Number(dates.length * car.rent.price);

  function handleBack() {
    navigation.goBack();
  }

  async function handleConfirmScheduling() {
    try {
      setLoading(true);
      const schedulesByCar = await api.get(`/schedules_bycars/${car.id}`);
      const unavailable_dates = [
        ...schedulesByCar.data.unavailable_dates,
        ...dates,
      ];

      await api.post('schedules_byuser', {
        user_id: 1,
        car,
        startDate: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
        endDate: format(
          getPlatformDate(new Date(dates[dates.length - 1])),
          'dd/MM/yyyy',
        ),
      });

      const response = await api.put(`/schedules_bycars/${car.id}`, {
        id: car.id,
        unavailable_dates,
      });

      if (response.status === 200) {
        navigation.navigate('SchedulingComplete');
      }
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
        'dd/MM/yyyy',
      ),
    });
  }, []);

  return (
    <Container>
      <StatusBar style="dark" />
      <Header>
        <BackButton onPress={handleBack} />
      </Header>

      <CarImages>
        <ImageSlider imagesUrl={car.photos} />

        <Content>
          <Details>
            <Description>
              <Brand>{car.brand}</Brand>
              <Name>{car.name}</Name>
            </Description>

            <Rent>
              <Period>{car.rent.period}</Period>
              <Price>R$ {car.rent.price}</Price>
            </Rent>
          </Details>

          <Accessories>
            {car.accessories.map(accessory => (
              <Accessory
                key={accessory.type}
                name={accessory.name}
                icon={getAccessoryIcon(accessory.type)}
              />
            ))}
          </Accessories>

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
              <RentalPriceQuota>{`R$ ${car.rent.price} x${dates.length} diárias`}</RentalPriceQuota>
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
