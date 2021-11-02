import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { Feather } from '@expo/vector-icons';
import { TextInputProps } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';

import { Container, IconContainer, InputText } from './styles';

interface InputProps extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>['name'];
  password?: boolean;
}

export function Input({ iconName, password, ...rest }: InputProps) {
  const theme = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(password);

  const handlePasswordVisibilityChange = () => {
    setIsPasswordVisible(oldState => !oldState);
  };

  return (
    <Container>
      <IconContainer>
        <Feather name={iconName} size={24} color={theme.colors.text_detail} />
      </IconContainer>
      <InputText
        placeholderTextColor={theme.colors.text_detail}
        secureTextEntry={isPasswordVisible}
        {...rest}
      />
      {password && (
        <BorderlessButton onPress={handlePasswordVisibilityChange}>
          <IconContainer style={{ marginRight: 0 }}>
            <Feather
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={24}
              color={theme.colors.text_detail}
            />
          </IconContainer>
        </BorderlessButton>
      )}
    </Container>
  );
}
