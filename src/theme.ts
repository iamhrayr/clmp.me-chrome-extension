import { extendTheme, ColorMode } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark" as ColorMode,
  useSystemColorMode: false,
};
// 3. extend the theme
const theme = extendTheme({ config });
export default theme;
