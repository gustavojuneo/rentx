import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { useTheme } from 'styled-components';
import * as Yup from 'yup';
import { api } from '../../../services/api';

import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

import {
  Container,
  Header,
  Steps,
  Title,
  Subtitle,
  Form,
  FormTitle,
  InputBox,
  ButtonBox,
} from './styles';

interface User {
  name: string;
  email: string;
  driverLicense: string;
}

interface Params {
  user: User;
}

export function SignUpSecondStep() {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const { user } = route.params as Params;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRegister = async () => {
    try {
      setIsWaiting(true);
      const schema = Yup.object().shape({
        password: Yup.string().required('Senha é obrigatória'),
        confirmPassword: Yup.string()
          .required('A confirmação senha é obrigatória')
          .oneOf([Yup.ref('password'), null], 'As senhas precisam ser iguais!'),
      });

      await schema.validate({ password, confirmPassword });

      const data = {
        name: user.name,
        email: user.email,
        driver_license: user.driverLicense,
        password,
      };

      await api
        .post('/users', data)
        .then(() => {
          navigation.navigate(
            'Confirmation' as never,
            {
              title: 'Conta criada!',
              message: `Agora é só fazer login\ne aproveitar`,
              nextScreenRoute: 'SignIn',
            } as never
          );
        })
        .catch(() =>
          Alert.alert('Opa', 'Não foi possível cadastrar o usuário!')
        );
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        Alert.alert('Opa', error.message);
      }
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="position">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <BackButton onPress={handleBack} />
            <Steps>
              <Bullet active />
              <Bullet />
            </Steps>
          </Header>

          <Title>Crie sua{'\n'}conta</Title>
          <Subtitle>
            Faça seu cadastro de{'\n'}
            forma rápida e fácil
          </Subtitle>

          <Form>
            <FormTitle>2. Senha</FormTitle>
            <InputBox>
              <Input
                iconName="lock"
                placeholder="Senha"
                password
                onChangeText={setPassword}
                value={password}
              />
            </InputBox>
            <InputBox>
              <Input
                iconName="lock"
                placeholder="Confirmar senha"
                password
                onChangeText={setConfirmPassword}
                value={confirmPassword}
              />
            </InputBox>
          </Form>

          <ButtonBox>
            <Button
              title="Cadastrar"
              color={theme.colors.success}
              onPress={handleRegister}
              loading={isWaiting}
            />
          </ButtonBox>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
