import * as React from "react";
import { ChakraProvider, Box, HStack, Link } from "@chakra-ui/react";

import { useIsAuthenticated, useClearAuth } from "../modules/auth/hooks";
import theme from "../theme";

import Main from "./Main";
import Login from "./Login";

function App() {
  const isAuthenticated = useIsAuthenticated();
  const clearAuth = useClearAuth();

  const [showSignIn, setShowSignIn] = React.useState(false);

  return (
    <ChakraProvider theme={theme}>
      <Box w="240px" p={4}>
        {showSignIn && !isAuthenticated ? (
          <Login onBackClick={() => setShowSignIn(false)} />
        ) : (
          <Main />
        )}
        <HStack justifyContent="center" mt={2}>
          {!isAuthenticated ? (
            <>
              <Link onClick={() => setShowSignIn((prevVal) => !prevVal)}>
                Sign In
              </Link>

              <Link
                href="https://clmp.me/signup"
                target="_blank"
                rel="noreferrer"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                href="https://clmp.me/dashboard"
                target="_blank"
                rel="noreferrer"
              >
                Dashboard
              </Link>

              <Link onClick={() => clearAuth()}>Sign Out</Link>
            </>
          )}
        </HStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
