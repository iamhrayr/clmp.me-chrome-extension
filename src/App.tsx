import React from "react";
import { useMutation } from "react-query";
import { useCopyToClipboard } from "react-use";
import {
  ChakraProvider,
  Button,
  Input,
  Flex,
  Box,
  Icon,
  Stack,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { IoQrCodeOutline, IoCopyOutline } from "react-icons/io5";

import theme from "./theme";
import { shortifyUrl } from "./api";

function App() {
  const [done, setDone] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [code, setCode] = React.useState("");
  const [, copyToClipboard] = useCopyToClipboard();

  const onSuccess = React.useCallback(
    (data) => {
      copyToClipboard(data.shortUrl);
      setDone(true);
      setUrl(data.shortUrl);
      setCode(data.code);
    },
    [copyToClipboard]
  );

  const { mutate, isLoading } = useMutation(shortifyUrl, {
    onSuccess,
  });

  const onClickShortify = React.useCallback(() => {
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
          onClick={onClickShortify}
        >
          Shortify & Copy
        </Button>

        {done && (
          <>
            <Box mb="4" textAlign="center">
              <Input readOnly value={url} mb="2" size="sm" textAlign="center" />
              <span>Automatically Copied ;)</span>
            </Box>

            <Stack direction="row" spacing={4} align="center">
              <Tooltip label="Copy" placement="bottom">
                <IconButton
                  size="sm"
                  aria-label="Copy"
                  icon={<Icon as={IoCopyOutline} />}
                  onClick={() => copyToClipboard(url)}
                />
              </Tooltip>

              <Tooltip label="Open QR code" placement="bottom">
                <IconButton
                  size="sm"
                  as="a"
                  target="_blank"
                  href={`http://clmp.me/qr/${code}`}
                  aria-label="QR"
                  icon={<Icon as={IoQrCodeOutline} />}
                />
              </Tooltip>
            </Stack>
          </>
        )}
      </Flex>
    </ChakraProvider>
  );
}

export default App;
