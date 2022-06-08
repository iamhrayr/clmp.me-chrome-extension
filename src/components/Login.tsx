// import React from "react";
// import {
//   Button,
//   Input,
//   Flex,
//   Box,
//   Icon,
//   Stack,
//   Tooltip,
//   FormControl,
//   FormLabel,
//   Switch,
//   VStack,
//   HStack,
//   IconButton,
//   Text,
// } from "@chakra-ui/react";

import * as React from "react";
import { useMutation } from "react-query";
import { useFormik } from "formik";
import {
  Container,
  Button,
  Stack,
  Input,
  Text,
  Alert,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { IoArrowBack } from "react-icons/io5";
import * as yup from "yup";

import { useSetAuth } from "../modules/auth/hooks";

import { signIn } from "../api";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const fields = [
  {
    name: "Email",
    id: "email",
    type: "email",
  },
  {
    name: "Password",
    id: "password",
    type: "password",
  },
];

export default function Login({ onBackClick }: { onBackClick: () => void }) {
  const storeSignInData = useSetAuth();
  const { mutateAsync, isLoading } = useMutation("signIn", signIn);
  const [error, setError] = React.useState("");

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await mutateAsync({
          email: values.email,
          password: values.password,
        });

        storeSignInData({
          token: res.token,
          refreshToken: res.refreshToken,
          isAuthenticated: true,
          payload: { email: res.payload.email },
        });

        // navigate("/dashboard");
      } catch (err: any) {
        setError(err.message);
      }
    },
  });

  return (
    <Container>
      <HStack mb="2">
        <IconButton
          aria-label="Back"
          icon={<IoArrowBack />}
          variant="ghost"
          size="sm"
          onClick={onBackClick}
        />
        <Text>Back</Text>
      </HStack>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
          {fields.map((field) => (
            <SingleField key={field.id} {...field} formik={formik} />
          ))}

          {error && <Alert status="error">{error}</Alert>}

          <Button type="submit" size="sm" isLoading={isLoading}>
            Sign In
          </Button>
        </Stack>
      </form>
    </Container>
  );
}

function SingleField({
  formik,
  id,
  type,
  name,
}: {
  formik: any;
  id: string;
  type: string;
  name: string;
}) {
  return (
    <Stack spacing={1}>
      <Input
        placeholder={name}
        size="sm"
        id={id}
        name={id}
        type={type}
        value={formik.values[id]}
        onChange={formik.handleChange}
        isInvalid={formik.touched[id] && !!formik.errors[id]}
      />

      {formik.touched[id] && formik.errors[id] && (
        <Text fontSize="sm" color="red.500">
          {formik.errors[id]}
        </Text>
      )}
    </Stack>
  );
}
