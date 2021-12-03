import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { Feather } from '@expo/vector-icons';
import { TextInputProps, TouchableOpacity } from 'react-native';

import { Container, IconContainer, InputText } from './styles';

interface InputProps extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>['name'];
  password?: boolean;
  value?: string;
  readOnly?: boolean;
}

export function Input({
  iconName,
  password,
  value,
  readOnly = false,
  ...rest
}: InputProps) {
  const theme = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(password);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handlePasswordVisibilityChange = () => {
    setIsPasswordVisible(oldState => !oldState);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    setIsFilled(!!value);
  };

  return (
    <Container>
      <IconContainer isFocused={isFocused}>
        <Feather
          name={iconName}
          size={24}
          color={
            isFocused || isFilled ? theme.colors.main : theme.colors.text_detail
          }
        />
      </IconContainer>
      <InputText
        placeholderTextColor={theme.colors.text_detail}
        secureTextEntry={isPasswordVisible}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        isFocused={isFocused}
        editable={!readOnly}
        autoCorrect={password ? false : rest.autoCorrect}
        {...rest}
      />
      {password && (
        <TouchableOpacity
          onPress={handlePasswordVisibilityChange}
          activeOpacity={0.5}
        >
          <IconContainer style={{ marginRight: 0 }}>
            <Feather
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={24}
              color={theme.colors.text_detail}
            />
          </IconContainer>
        </TouchableOpacity>
      )}
    </Container>
  );
}
