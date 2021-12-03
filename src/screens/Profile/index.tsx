import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import * as ImagePicker from 'expo-image-picker';
import * as Yup from 'yup';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { useTheme } from 'styled-components';
import { Feather } from '@expo/vector-icons';

import {
  Container,
  Header,
  HeaderTop,
  HeaderTitle,
  LogoutButton,
  PhotoContainer,
  Photo,
  PhotoButton,
  Content,
  Options,
  Option,
  OptionTitle,
  Section,
  InputBox,
} from './styles';

import { BackButton } from '../../components/BackButton';
import { Input } from '../../components/Input';
import { useAuth } from '../../hooks';
import { Button } from '../../components/Button';

type Option = 'dataEdit' | 'passwordEdit';

export function Profile() {
  const { user, signOut, updateUser } = useAuth();
  const theme = useTheme();
  const navigation = useNavigation();
  const [option, setOption] = useState<Option>('dataEdit');
  const [avatar, setAvatar] = useState(user.avatar);
  const [name, setName] = useState(user.name);
  const [driverLicense, setDriverLicense] = useState(user.driver_license);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSignOut = () => {
    Alert.alert(
      'Tem certeza?',
      'Ao ser desconectado, você precisará de internet para conectar novamente.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: () => signOut(),
        },
      ]
    );
  };

  const handleOptionChange = (selectedOption: Option) => {
    setOption(selectedOption);
  };

  const handleSelectAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (result.cancelled) return;

    if (result.uri) {
      setAvatar(result.uri);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const schema = Yup.object().shape({
        driverLicense: Yup.string().required('CNH é obrigatória.'),
        name: Yup.string().required('O Nome é obrigatório.'),
      });

      const data = { name, driverLicense };
      await schema.validate(data);
      await updateUser({
        id: user.id,
        user_id: user.id,
        email: user.email,
        name,
        driver_license: driverLicense,
        avatar,
        token: user.token,
      });

      navigation.navigate(
        'Confirmation' as never,
        {
          title: 'Perfil Atualizado!',
          message: `Suas informações foram atualizadas.`,
          nextScreenRoute: 'Profile',
        } as never
      );
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        Alert.alert('Opa', err.message);
      } else {
        Alert.alert('Não foi possível atualizar o perfil!');
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <HeaderTop>
              <BackButton color={theme.colors.shape} onPress={handleBack} />
              <HeaderTitle>Editar Perfil</HeaderTitle>
              <LogoutButton onPress={handleSignOut}>
                <Feather name="power" size={24} color={theme.colors.shape} />
              </LogoutButton>
            </HeaderTop>
            <PhotoContainer>
              {!!avatar && <Photo source={{ uri: avatar }} />}
              <PhotoButton onPress={handleSelectAvatar}>
                <Feather name="camera" size={24} color={theme.colors.shape} />
              </PhotoButton>
            </PhotoContainer>
          </Header>

          <Content style={{ marginBottom: useBottomTabBarHeight() + 20 }}>
            <Options>
              <Option
                onPress={() => handleOptionChange('dataEdit')}
                active={option === 'dataEdit'}
              >
                <OptionTitle active={option === 'dataEdit'}>Dados</OptionTitle>
              </Option>
              <Option
                onPress={() => handleOptionChange('passwordEdit')}
                active={option === 'passwordEdit'}
              >
                <OptionTitle active={option === 'passwordEdit'}>
                  Trocar senha
                </OptionTitle>
              </Option>
            </Options>

            {option === 'dataEdit' ? (
              <Section>
                <InputBox>
                  <Input
                    iconName="user"
                    placeholder="Nome"
                    autoCapitalize="words"
                    autoCorrect={false}
                    defaultValue={user.name}
                    onChangeText={setName}
                  />
                </InputBox>
                <InputBox>
                  <Input
                    iconName="mail"
                    readOnly
                    autoCapitalize="words"
                    autoCorrect={false}
                    defaultValue={user.email}
                  />
                </InputBox>
                <InputBox>
                  <Input
                    iconName="credit-card"
                    placeholder="CNH"
                    keyboardType="numeric"
                    defaultValue={user.driver_license}
                    onChangeText={setDriverLicense}
                  />
                </InputBox>
              </Section>
            ) : (
              <Section>
                <InputBox>
                  <Input iconName="lock" password placeholder="Senha Atual" />
                </InputBox>
                <InputBox>
                  <Input iconName="lock" password placeholder="Nova Senha" />
                </InputBox>
                <InputBox>
                  <Input
                    iconName="lock"
                    password
                    placeholder="Confirmar Senha"
                  />
                </InputBox>
              </Section>
            )}
            <InputBox>
              <Button title="Salvar alterações" onPress={handleProfileUpdate} />
            </InputBox>
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
