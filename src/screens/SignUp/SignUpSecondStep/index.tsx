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

import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

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
  const { user } = route.params as Params;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRegister = async () => {
    try {
      const schema = Yup.object().shape({
        password: Yup.string().required('Senha é obrigatória'),
        confirmPassword: Yup.string()
          .required('A confirmação senha é obrigatória')
          .oneOf([Yup.ref('password'), null], 'As senhas precisam ser iguais!'),
      });

      const data = { password, confirmPassword };
      await schema.validate(data);

      navigation.navigate('Confirmation', {
        title: 'Conta criada!',
        message: `Agora é só fazer login\ne aproveitar`,
        nextScreenRoute: 'SignIn',
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        Alert.alert('Opa', error.message);
      }
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
            />
          </ButtonBox>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
