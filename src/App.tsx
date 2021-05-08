import React from "react";
import { useMutation } from "react-query";
import { useCopyToClipboard } from "react-use";
import {
  ChakraProvider,
  Button,
  Input,
  Flex,
  useToast,
} from "@chakra-ui/react";

import theme from "./theme";
import { shortifyUrl } from "./api";

function App() {
  const [done, setDone] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [, copyToClipboard] = useCopyToClipboard();

  const onSuccess = React.useCallback(
    (data) => {
      copyToClipboard(data.shortUrl);
      setDone(true);
      setUrl(data.shortUrl);
    },
    [copyToClipboard]
  );

  const { mutate, isLoading } = useMutation(shortifyUrl, {
    onSuccess,
  });

  const shortifyAndCopyUrl = React.useCallback(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      setDone(false);
      const url = tabs[0].url;
      url && mutate(url);
    });
  }, [mutate]);

  return (
    <ChakraProvider theme={theme}>
      <Flex
        w="240px"
        p={4}
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Button
          mb="2"
          size="sm"
          variant="outline"
          isLoading={isLoading}
          onClick={shortifyAndCopyUrl}
        >
          Shortify & Copy
        </Button>
        {!done && (
          <Input
            readOnly
            value={"http://clmp.me/u/EheYG"}
            mb="2"
            size="sm"
            textAlign="center"
          />
        )}
        {!done && <span>Automatically Copied ;)</span>}
      </Flex>
    </ChakraProvider>
  );
}

export default App;
