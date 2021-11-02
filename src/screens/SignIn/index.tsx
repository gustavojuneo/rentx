import React from 'react';
import { StatusBar } from 'expo-status-bar';
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

  return (
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
          />
        </InputBox>
        <InputBox>
          <Input iconName="lock" placeholder="Senha" password />
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
  );
}
