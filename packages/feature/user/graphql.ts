import { gql } from '@assetforce/graphql';

export const GET_USERS = gql`
  query GetUsers($realmId: String!, $status: UserStatus) {
    users(realmId: $realmId, status: $status) {
      userId
      subject
      zoneId
      realmId
      userType
      status
      isVerified
      profile {
        displayName
        email
        firstName
        lastName
        department
        title
      }
      preferences {
        timezone
        locale
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_ZONES_AND_REALMS = gql`
  query GetZonesAndRealms {
    zones {
      zoneId
      zoneName
      realms {
        realmId
        realmName
      }
    }
  }
`;
