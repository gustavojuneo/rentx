import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import { useTheme } from 'styled-components';

import { Button } from '../../components/Button';

import {
  Container,
  Header,
  Title,
  Subtitle,
  Form,
  InputBox,
  Footer,
  SignInButton,
  SignOutButton,
} from './styles';
import { Input } from '../../components/Input';

export function SignIn() {
  const theme = useTheme();
  const { navigate } = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigning, setIsSigning] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigning(true);
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().required('Senha obrigatória'),
      });

      await schema.validate({
        email,
        password,
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        Alert.alert('Opa', error.message);
      } else {
        Alert.alert(
          'Erro na autenticação',
          'Ocorreu um erro ao fazer login, verifique as credenciais'
        );
      }
    } finally {
      setIsSigning(false);
    }
  };

  const handleNewAccount = () => {
    navigate('SignUpFirstStep');
  };

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <StatusBar style="dark" />
          <Header>
            <Title>Estamos{'\n'}quase lá.</Title>
            <Subtitle>
              Faça seu login para começar{'\n'}
              uma experiência incrível.
            </Subtitle>
          </Header>

          <Form>
            <InputBox>
              <Input
                iconName="mail"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={setEmail}
                value={email}
              />
            </InputBox>
            <InputBox>
              <Input
                iconName="lock"
                placeholder="Senha"
                password
                onChangeText={setPassword}
                value={password}
              />
            </InputBox>
          </Form>

          <Footer>
            <SignInButton>
              <Button
                title="Login"
                onPress={handleSignIn}
                loading={isSigning}
              />
            </SignInButton>
            <SignOutButton>
              <Button
                title="Criar conta gratuita"
                color={theme.colors.background_secondary}
                light
                onPress={handleNewAccount}
              />
            </SignOutButton>
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
