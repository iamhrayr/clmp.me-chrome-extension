import * as React from "react";
import { useMutation } from "react-query";
import { useCopyToClipboard } from "react-use";
import {
  Button,
  Input,
  Flex,
  Box,
  Icon,
  Stack,
  Tooltip,
  FormControl,
  FormLabel,
  Switch,
  VStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { IoQrCodeOutline, IoCopyOutline } from "react-icons/io5";

import { shortifyUrl } from "../api";

function Main() {
  const [done, setDone] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [isProtectEnabled, setIsProtectEnabled] = React.useState(false);
  const [passcode, setPasscode] = React.useState("");
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

  const { mutate, isLoading, error } = useMutation(shortifyUrl, {
    onSuccess,
  });

  const onShortifyClick = React.useCallback(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      setDone(false);

      const url = tabs[0]?.url;
      url && mutate({ url, passcode });
    });
  }, [mutate, passcode]);

  const onIsProtectedToggle = React.useCallback((e) => {
    setIsProtectEnabled(e.target.checked);
  }, []);

  const onPasscodeChange = React.useCallback((e) => {
    setPasscode(e.target.value);
  }, []);

  return (
    <Box>
      {!done ? (
        <VStack spacing="2">
          <FormControl
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FormLabel htmlFor="passcode" mb="0">
              Protected url?
            </FormLabel>
            <Switch
              id="passcode"
              isChecked={isProtectEnabled}
              onChange={onIsProtectedToggle}
            />
          </FormControl>

          {isProtectEnabled && (
            <Input
              width={160}
              size="sm"
              placeholder="Passcode"
              value={passcode}
              onChange={onPasscodeChange}
            />
          )}

          <Button
            size="sm"
            variant="outline"
            isLoading={isLoading}
            isDisabled={isProtectEnabled && passcode.length === 0}
            onClick={onShortifyClick}
          >
            Shortify & Copy
          </Button>
        </VStack>
      ) : (
        <Flex alignItems="center" justifyContent="center" direction="column">
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
        </Flex>
      )}

      {error && (
        <Text fontSize="sm" textAlign="center" color="red.400">
          {(error as any).message}
        </Text>
      )}
    </Box>
  );
}

export default Main;
