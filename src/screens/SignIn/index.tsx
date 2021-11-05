import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
                onPress={() => {}}
                enabled={false}
                loading={false}
              />
            </SignInButton>
            <SignOutButton>
              <Button
                title="Criar conta gratuita"
                color={theme.colors.background_secondary}
                light
                onPress={() => {}}
                enabled={false}
                loading={false}
              />
            </SignOutButton>
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
