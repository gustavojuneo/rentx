import React from 'react';
import { useTheme } from 'styled-components';
import { ActivityIndicator } from 'react-native';
import { RectButtonProps } from 'react-native-gesture-handler';
import { Container, Title } from './styles';

interface ButtonProps extends RectButtonProps {
  title: string;
  color?: string;
  light?: boolean;
  loading?: boolean;
}

export function Button({
  title,
  color,
  enabled = true,
  light = false,
  loading = false,
  ...rest
}: ButtonProps) {
  const theme = useTheme();

  return (
    <Container
      {...rest}
      color={color}
      style={{ opacity: enabled === false || loading === true ? 0.5 : 1 }}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.background_primary} />
      ) : (
        <Title light={light}>{title}</Title>
      )}
    </Container>
  );
}
