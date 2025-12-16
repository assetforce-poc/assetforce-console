/**
 * Unit tests for useTenantMembership hook
 */

import { gql } from '@apollo/client';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { useTenantMembership } from '../src/hooks/tenant/useTenantMembership';
import type { CooldownStatus, Tenant, TenantApplication } from '../src/hooks/tenant/types';

// ============ GraphQL Queries (must match hook definitions) ============

const TENANT_MINE = gql`
  query TenantMine {
    tenant {
      mine {
        id
        name
        displayName
      }
    }
  }
`;

const TENANT_APPLICATIONS = gql`
  query TenantApplications {
    tenant {
      applications {
        id
        status
        message
        createdAt
        updatedAt
        tenant {
          id
          name
          displayName
        }
      }
    }
  }
`;

const TENANT_COOLDOWN = gql`
  query TenantCooldown($input: TenantCooldownInput) {
    tenant {
      cooldown(input: $input) {
        canApply
        until
        reason
      }
    }
  }
`;

const TENANT_APPLY = gql`
  mutation TenantApply($input: TenantApplyInput!) {
    tenant {
      users {
        apply(input: $input) {
          success
          message
          application {
            id
            status
            tenant {
              id
              name
              displayName
            }
          }
        }
      }
    }
  }
`;

const TENANT_CANCEL = gql`
  mutation TenantCancel($input: TenantCancelInput!) {
    tenant {
      users {
        cancel(input: $input) {
          success
          message
        }
      }
    }
  }
`;

const TENANT_LEAVE = gql`
  mutation TenantLeave($input: TenantLeaveInput!) {
    tenant {
      users {
        leave(input: $input) {
          success
          message
        }
      }
    }
  }
`;

// ============ Test Data with __typename ============

interface TenantWithTypename extends Tenant {
  __typename: 'Tenant';
}

interface TenantApplicationWithTypename {
  __typename: 'TenantApplication';
  id: string;
  tenant: TenantWithTypename;
  status: string;
  message: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CooldownWithTypename extends CooldownStatus {
  __typename: 'CooldownStatus';
}

const mockTenants: TenantWithTypename[] = [
  { __typename: 'Tenant', id: 'tenant-1', name: 'org-1', displayName: 'Organization 1' },
  { __typename: 'Tenant', id: 'tenant-2', name: 'org-2', displayName: 'Organization 2' },
];

const mockApplications: TenantApplicationWithTypename[] = [
  {
    __typename: 'TenantApplication',
    id: 'app-1',
    tenant: { __typename: 'Tenant', id: 'tenant-3', name: 'org-3', displayName: 'Organization 3' },
    status: 'PENDING',
    message: 'Please approve',
    createdAt: '2025-12-16T10:00:00Z',
    updatedAt: '2025-12-16T10:00:00Z',
  },
];

const mockCooldown: CooldownWithTypename = {
  __typename: 'CooldownStatus',
  canApply: true,
  until: null,
  reason: null,
};

// ============ Mock Helpers ============

function createMineMock(tenants: TenantWithTypename[] = mockTenants): MockedResponse {
  return {
    request: { query: TENANT_MINE },
    maxUsageCount: Number.MAX_SAFE_INTEGER,
    result: {
      data: {
        tenant: {
          __typename: 'TenantQuery',
          mine: tenants,
        },
      },
    },
  };
}

function createApplicationsMock(
  applications: TenantApplicationWithTypename[] = mockApplications
): MockedResponse {
  return {
    request: { query: TENANT_APPLICATIONS },
    maxUsageCount: Number.MAX_SAFE_INTEGER,
    result: {
      data: {
        tenant: {
          __typename: 'TenantQuery',
          applications,
        },
      },
    },
  };
}

function createCooldownMock(cooldown: CooldownWithTypename = mockCooldown): MockedResponse {
  return {
    request: { query: TENANT_COOLDOWN, variables: { input: null } },
    maxUsageCount: Number.MAX_SAFE_INTEGER,
    result: {
      data: {
        tenant: {
          __typename: 'TenantQuery',
          cooldown,
        },
      },
    },
  };
}

function createApplyMock(
  tenantId: string,
  message: string | null,
  success: boolean = true
): MockedResponse {
  return {
    request: {
      query: TENANT_APPLY,
      variables: { input: { tenantId, message } },
    },
    result: {
      data: {
        tenant: {
          __typename: 'TenantMutation',
          users: {
            __typename: 'TenantUsersMutation',
            apply: {
              __typename: 'ApplyResult',
              success,
              message: success ? null : 'Apply failed',
              application: success
                ? {
                    __typename: 'TenantApplication',
                    id: 'new-app-1',
                    status: 'PENDING',
                    tenant: {
                      __typename: 'Tenant',
                      id: tenantId,
                      name: 'org',
                      displayName: 'Org',
                    },
                  }
                : null,
            },
          },
        },
      },
    },
  };
}

function createCancelMock(applicationId: string, success: boolean = true): MockedResponse {
  return {
    request: {
      query: TENANT_CANCEL,
      variables: { input: { id: applicationId } },
    },
    result: {
      data: {
        tenant: {
          __typename: 'TenantMutation',
          users: {
            __typename: 'TenantUsersMutation',
            cancel: {
              __typename: 'MutationResult',
              success,
              message: success ? null : 'Cancel failed',
            },
          },
        },
      },
    },
  };
}

function createLeaveMock(tenantId: string, success: boolean = true): MockedResponse {
  return {
    request: {
      query: TENANT_LEAVE,
      variables: { input: { tenantId } },
    },
    result: {
      data: {
        tenant: {
          __typename: 'TenantMutation',
          users: {
            __typename: 'TenantUsersMutation',
            leave: {
              __typename: 'MutationResult',
              success,
              message: success ? null : 'Leave failed',
            },
          },
        },
      },
    },
  };
}

function createBaseMocks(): MockedResponse[] {
  return [createMineMock(), createApplicationsMock(), createCooldownMock()];
}

function createWrapper(mocks: MockedResponse[]) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
  };
}

// ============ Tests ============

describe('useTenantMembership', () => {
  describe('initial data fetching', () => {
    it('should fetch my tenants on mount', async () => {
      const { result } = renderHook(() => useTenantMembership(), {
        wrapper: createWrapper(createBaseMocks()),
      });

      expect(result.current.isLoadingMine).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoadingMine).toBe(false);
      });

      expect(result.current.myTenants).toHaveLength(2);
      expect(result.current.myTenants[0]?.id).toBe('tenant-1');
    });

    it('should fetch pending applications on mount', async () => {
      const { result } = renderHook(() => useTenantMembership(), {
        wrapper: createWrapper(createBaseMocks()),
      });

      await waitFor(() => {
        expect(result.current.isLoadingApplications).toBe(false);
      });

      expect(result.current.pendingApplications).toHaveLength(1);
      expect(result.current.pendingApplications[0]?.id).toBe('app-1');
    });

    it('should fetch global cooldown on mount', async () => {
      const { result } = renderHook(() => useTenantMembership(), {
        wrapper: createWrapper(createBaseMocks()),
      });

      await waitFor(() => {
        expect(result.current.globalCooldown).not.toBeNull();
      });

      expect(result.current.globalCooldown?.canApply).toBe(true);
    });

    it('should filter only pending applications', async () => {
      const baseApp = mockApplications[0]!;
      const mixedApplications: TenantApplicationWithTypename[] = [
        { ...baseApp, status: 'PENDING' },
        { ...baseApp, id: 'app-2', status: 'APPROVED' },
        { ...baseApp, id: 'app-3', status: 'REJECTED' },
      ];

      const { result } = renderHook(() => useTenantMembership(), {
        wrapper: createWrapper([
          createMineMock(),
          createApplicationsMock(mixedApplications),
          createCooldownMock(),
        ]),
      });

      await waitFor(() => {
        expect(result.current.isLoadingApplications).toBe(false);
      });

      expect(result.current.pendingApplications).toHaveLength(1);
      expect(result.current.pendingApplications[0]?.status).toBe('PENDING');
    });
  });

  describe('search functionality', () => {
    it('should update search state', async () => {
      const { result } = renderHook(() => useTenantMembership(), {
        wrapper: createWrapper(createBaseMocks()),
      });

      act(() => {
        result.current.setSearch('test');
      });

      expect(result.current.search).toBe('test');
    });

    it('should not search when search is empty', async () => {
      const { result } = renderHook(() => useTenantMembership(), {
        wrapper: createWrapper(createBaseMocks()),
      });

      await waitFor(() => {
        expect(result.current.isLoadingMine).toBe(false);
      });

      // Available tenants should be empty when no search
      expect(result.current.availableTenants).toEqual([]);
      expect(result.current.isLoadingAvailable).toBe(false);
    });
  });

  describe('apply mutation', () => {
    it('should apply successfully', async () => {
      const onApplySuccess = jest.fn();
      const mocks = [
        ...createBaseMocks(),
        createApplyMock('tenant-1', null, true),
        // Refetch mocks after mutation
        createMineMock(),
        createApplicationsMock(),
        createCooldownMock(),
      ];

      const { result } = renderHook(() => useTenantMembership({ onApplySuccess }), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.isLoadingMine).toBe(false);
      });

      let applyResult: Awaited<ReturnType<typeof result.current.apply>> | undefined;
      await act(async () => {
        applyResult = await result.current.apply('tenant-1');
      });

      expect(applyResult?.success).toBe(true);
      expect(onApplySuccess).toHaveBeenCalled();
      expect(result.current.error).toBeNull();
    });

    it('should handle apply failure', async () => {
      const onError = jest.fn();
      const mocks = [...createBaseMocks(), createApplyMock('tenant-1', null, false)];

      const { result } = renderHook(() => useTenantMembership({ onError }), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.isLoadingMine).toBe(false);
      });

      await act(async () => {
        await result.current.apply('tenant-1');
      });

      expect(result.current.error).toBe('Apply failed');
      expect(onError).toHaveBeenCalledWith('Apply failed');
    });
  });

  describe('cancel mutation', () => {
    it('should cancel successfully', async () => {
      const onCancelSuccess = jest.fn();
      const mocks = [
        ...createBaseMocks(),
        createCancelMock('app-1', true),
        // Refetch mocks after mutation
        createMineMock(),
        createApplicationsMock([]),
        createCooldownMock(),
      ];

      const { result } = renderHook(() => useTenantMembership({ onCancelSuccess }), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.isLoadingApplications).toBe(false);
      });

      await act(async () => {
        await result.current.cancel('app-1');
      });

      expect(onCancelSuccess).toHaveBeenCalled();
      expect(result.current.error).toBeNull();
    });

    it('should handle cancel failure', async () => {
      const onError = jest.fn();
      const mocks = [...createBaseMocks(), createCancelMock('app-1', false)];

      const { result } = renderHook(() => useTenantMembership({ onError }), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.isLoadingApplications).toBe(false);
      });

      await act(async () => {
        await result.current.cancel('app-1');
      });

      expect(result.current.error).toBe('Cancel failed');
      expect(onError).toHaveBeenCalledWith('Cancel failed');
    });
  });

  describe('leave mutation', () => {
    it('should leave successfully', async () => {
      const onLeaveSuccess = jest.fn();
      const mocks = [
        ...createBaseMocks(),
        createLeaveMock('tenant-1', true),
        // Refetch mocks after mutation
        createMineMock([mockTenants[1]!]),
        createApplicationsMock(),
        createCooldownMock(),
      ];

      const { result } = renderHook(() => useTenantMembership({ onLeaveSuccess }), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.isLoadingMine).toBe(false);
      });

      await act(async () => {
        await result.current.leave('tenant-1');
      });

      expect(onLeaveSuccess).toHaveBeenCalled();
      expect(result.current.error).toBeNull();
    });

    it('should handle leave failure', async () => {
      const onError = jest.fn();
      const mocks = [...createBaseMocks(), createLeaveMock('tenant-1', false)];

      const { result } = renderHook(() => useTenantMembership({ onError }), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.isLoadingMine).toBe(false);
      });

      await act(async () => {
        await result.current.leave('tenant-1');
      });

      expect(result.current.error).toBe('Leave failed');
      expect(onError).toHaveBeenCalledWith('Leave failed');
    });
  });

  describe('error handling', () => {
    it('should clear error', async () => {
      const mocks = [...createBaseMocks(), createApplyMock('tenant-1', null, false)];

      const { result } = renderHook(() => useTenantMembership(), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.isLoadingMine).toBe(false);
      });

      await act(async () => {
        await result.current.apply('tenant-1');
      });

      expect(result.current.error).toBe('Apply failed');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('options', () => {
    it('should use custom debounce delay', async () => {
      jest.useFakeTimers();

      const { result } = renderHook(() => useTenantMembership({ debounceMs: 500 }), {
        wrapper: createWrapper(createBaseMocks()),
      });

      act(() => {
        result.current.setSearch('test');
      });

      // Search should not trigger immediately
      expect(result.current.search).toBe('test');

      jest.useRealTimers();
    });
  });
});
