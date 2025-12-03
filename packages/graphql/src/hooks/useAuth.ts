"use client";

import { gql, useMutation, useLazyQuery } from "@apollo/client";

// GraphQL Operations for AAC
const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
      refreshToken
      expiresIn
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      expiresIn
    }
  }
`;

const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      email
      roles
    }
  }
`;

// Hooks
export function useLogin() {
  return useMutation(LOGIN_MUTATION);
}

export function useLogout() {
  return useMutation(LOGOUT_MUTATION);
}

export function useRefreshToken() {
  return useMutation(REFRESH_TOKEN_MUTATION);
}

export function useMe() {
  return useLazyQuery(ME_QUERY);
}
