import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import * as Yup from 'yup';

import { BackButton } from '../../../components/BackButton';

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
import { Bullet } from '../../../components/Bullet';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

export function SignUpFirstStep() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [driverLicense, setDriverLicense] = useState('');

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNextStep = async () => {
    try {
      const schema = Yup.object().shape({
        driverLicense: Yup.string().required('CNH é obrigatória'),
        email: Yup.string()
          .email('E-mail inválido')
          .required('E-mail é obrigatório'),
        name: Yup.string().required('Nome é obrigatório'),
      });

      const data = { name, email, driverLicense };
      await schema.validate(data);

      navigation.navigate('SignUpSecondStep' as never, { user: data } as never);
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
            <FormTitle>1. Dados</FormTitle>
            <InputBox>
              <Input
                iconName="user"
                placeholder="Nome"
                onChangeText={setName}
                value={name}
              />
            </InputBox>
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
                iconName="credit-card"
                placeholder="CNH"
                keyboardType="numeric"
                onChangeText={setDriverLicense}
                value={driverLicense}
              />
            </InputBox>
          </Form>

          <ButtonBox>
            <Button title="Próximo" onPress={handleNextStep} />
          </ButtonBox>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
