import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

const noneVariant = {
  none: {
    _focus: {
      outline: 'none',
      boxShadow: 'none',
      colorScheme: 'none',
    },
  },
};

const breakpoints = createBreakpoints({
  sm: '320px',
  md: '768px',
  lg: '960px',
  xl: '1200px',
  '2xl': '1600px',
});

const theme = extendTheme({
  colors: {
    black: '#16161D',
  },
  components: {
    Button: {
      variants: noneVariant,
      defaultProps: {
        variant: 'none',
      },
    },
    Link: {
      variants: noneVariant,
      defaultProps: {
        variant: 'none',
      },
    },
  },
  breakpoints,
});

export default theme;
