/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($userEmail: String!) {
    getUser(userEmail: $userEmail) {
      id
      userEmail
      finetuningParametersPath
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $userEmail: String
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUsers(
      userEmail: $userEmail
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        userEmail
        finetuningParametersPath
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
