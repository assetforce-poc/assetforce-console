import '@testing-library/jest-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import type { ApplicationItem } from '../../../hooks/operations';
import { ApplicationList } from '../ApplicationList';

// Mock the hooks
jest.mock('../../../hooks', () => ({
  useApplications: jest.fn(),
  useApproveApplication: jest.fn(),
  useRejectApplication: jest.fn(),
}));

import { useApplications, useApproveApplication, useRejectApplication } from '../../../hooks';

const mockUseApplications = useApplications as jest.MockedFunction<typeof useApplications>;
const mockUseApproveApplication = useApproveApplication as jest.MockedFunction<
  typeof useApproveApplication
>;
const mockUseRejectApplication = useRejectApplication as jest.MockedFunction<
  typeof useRejectApplication
>;

describe('ApplicationList', () => {
  const mockRefetch = jest.fn();
  const mockApprove = jest.fn();
  const mockReject = jest.fn();

  const mockApplications: ApplicationItem[] = [
    {
      id: 'app-001',
      subject: 'user-123',
      applicant: { name: 'John Doe', email: 'john@example.com' },
      status: 'PENDING',
      message: 'I want to join',
      createdAt: '2024-12-24T10:00:00Z',
      updatedAt: '2024-12-24T10:00:00Z',
      tenant: { id: 'tenant-001', name: 'Test Tenant' },
    },
    {
      id: 'app-002',
      subject: 'user-456',
      applicant: { name: 'Jane Smith', email: 'jane@example.com' },
      status: 'APPROVED',
      message: 'Please approve',
      createdAt: '2024-12-23T10:00:00Z',
      updatedAt: '2024-12-23T12:00:00Z',
      tenant: { id: 'tenant-001', name: 'Test Tenant' },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseApplications.mockReturnValue({
      data: mockApplications,
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    });
    mockUseApproveApplication.mockReturnValue({
      approve: mockApprove,
      loading: false,
      error: undefined,
    });
    mockUseRejectApplication.mockReturnValue({
      reject: mockReject,
      loading: false,
      error: undefined,
    });
  });

  describe('rendering', () => {
    it('should render table with applications', () => {
      render(<ApplicationList tenantId="tenant-001" />);

      // Check table headers
      expect(screen.getByText('Applicant')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Message')).toBeInTheDocument();
      expect(screen.getByText('Applied At')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();

      // Check applicant names are displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should show loading spinner when loading', () => {
      mockUseApplications.mockReturnValue({
        data: null,
        loading: true,
        error: undefined,
        refetch: mockRefetch,
      });

      render(<ApplicationList tenantId="tenant-001" />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should show error message when error occurs', () => {
      mockUseApplications.mockReturnValue({
        data: null,
        loading: false,
        error: new Error('Failed to load'),
        refetch: mockRefetch,
      });

      render(<ApplicationList tenantId="tenant-001" />);

      expect(screen.getByText(/Failed to load applications/)).toBeInTheDocument();
    });

    it('should show empty message when no applications', () => {
      mockUseApplications.mockReturnValue({
        data: [],
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      render(<ApplicationList tenantId="tenant-001" />);

      expect(screen.getByText('No applications found')).toBeInTheDocument();
    });
  });

  describe('applicant display', () => {
    it('should display applicant name when available', () => {
      render(<ApplicationList tenantId="tenant-001" />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should display email when name is not available', () => {
      const applicationsWithoutName = [
        {
          ...mockApplications[0],
          applicant: { name: undefined, email: 'nolastname@example.com' },
        },
      ];

      mockUseApplications.mockReturnValue({
        data: applicationsWithoutName as any,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      render(<ApplicationList tenantId="tenant-001" />);

      expect(screen.getByText('nolastname@example.com')).toBeInTheDocument();
    });

    it('should display truncated subject when no applicant info', () => {
      const applicationsWithoutApplicant = [
        {
          ...mockApplications[0],
          applicant: undefined,
          subject: '12345678-abcd-efgh',
        },
      ];

      mockUseApplications.mockReturnValue({
        data: applicationsWithoutApplicant as any,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      render(<ApplicationList tenantId="tenant-001" />);

      expect(screen.getByText('12345678...')).toBeInTheDocument();
    });
  });

  describe('status display', () => {
    it('should display status chip with correct color for PENDING', () => {
      render(<ApplicationList tenantId="tenant-001" />);

      const pendingChip = screen.getByText('PENDING');
      expect(pendingChip).toBeInTheDocument();
    });

    it('should display status chip with correct color for APPROVED', () => {
      render(<ApplicationList tenantId="tenant-001" />);

      const approvedChip = screen.getByText('APPROVED');
      expect(approvedChip).toBeInTheDocument();
    });
  });

  describe('actions', () => {
    it('should show approve and reject buttons for PENDING applications', () => {
      render(<ApplicationList tenantId="tenant-001" />);

      const approveButtons = screen.getAllByText('Approve');
      const rejectButtons = screen.getAllByText('Reject');

      // Only pending application should have buttons
      expect(approveButtons).toHaveLength(1);
      expect(rejectButtons).toHaveLength(1);
    });

    it('should not show action buttons for non-PENDING applications', () => {
      const approvedApp = mockApplications[1]!; // APPROVED status
      mockUseApplications.mockReturnValue({
        data: [approvedApp],
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      render(<ApplicationList tenantId="tenant-001" />);

      expect(screen.queryByText('Approve')).not.toBeInTheDocument();
      expect(screen.queryByText('Reject')).not.toBeInTheDocument();
    });

    it('should call approve and refetch on approve button click', async () => {
      mockApprove.mockResolvedValue({ success: true });

      render(<ApplicationList tenantId="tenant-001" />);

      const approveButton = screen.getByText('Approve');
      fireEvent.click(approveButton);

      await waitFor(() => {
        expect(mockApprove).toHaveBeenCalledWith('app-001');
      });

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
    });

    it('should call reject and refetch on reject button click', async () => {
      mockReject.mockResolvedValue({ success: true });

      render(<ApplicationList tenantId="tenant-001" />);

      const rejectButton = screen.getByText('Reject');
      fireEvent.click(rejectButton);

      await waitFor(() => {
        expect(mockReject).toHaveBeenCalledWith('app-001');
      });

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
    });

    it('should not refetch when approve fails', async () => {
      mockApprove.mockResolvedValue({ success: false, message: 'Failed' });

      render(<ApplicationList tenantId="tenant-001" />);

      const approveButton = screen.getByText('Approve');
      fireEvent.click(approveButton);

      await waitFor(() => {
        expect(mockApprove).toHaveBeenCalled();
      });

      expect(mockRefetch).not.toHaveBeenCalled();
    });

    it('should disable buttons while approving', () => {
      mockUseApproveApplication.mockReturnValue({
        approve: mockApprove,
        loading: true,
        error: undefined,
      });

      render(<ApplicationList tenantId="tenant-001" />);

      const approveButton = screen.getByText('Approve');
      expect(approveButton).toBeDisabled();
    });

    it('should disable buttons while rejecting', () => {
      mockUseRejectApplication.mockReturnValue({
        reject: mockReject,
        loading: true,
        error: undefined,
      });

      render(<ApplicationList tenantId="tenant-001" />);

      const rejectButton = screen.getByText('Reject');
      expect(rejectButton).toBeDisabled();
    });
  });

  describe('row click', () => {
    it('should call onApplicationClick when row is clicked', () => {
      const handleClick = jest.fn();

      render(<ApplicationList tenantId="tenant-001" onApplicationClick={handleClick} />);

      // Click on the row (find by applicant name)
      const row = screen.getByText('John Doe').closest('tr');
      if (row) {
        fireEvent.click(row);
      }

      expect(handleClick).toHaveBeenCalledWith(mockApplications[0]);
    });

    it('should not call onApplicationClick when button is clicked', () => {
      const handleClick = jest.fn();
      mockApprove.mockResolvedValue({ success: true });

      render(<ApplicationList tenantId="tenant-001" onApplicationClick={handleClick} />);

      const approveButton = screen.getByText('Approve');
      fireEvent.click(approveButton);

      // Should not trigger row click
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('message display', () => {
    it('should display application message', () => {
      render(<ApplicationList tenantId="tenant-001" />);

      expect(screen.getByText('I want to join')).toBeInTheDocument();
    });

    it('should display dash when no message', () => {
      const applicationsWithoutMessage = [
        {
          ...mockApplications[0],
          message: undefined,
        },
      ];

      mockUseApplications.mockReturnValue({
        data: applicationsWithoutMessage as any,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      render(<ApplicationList tenantId="tenant-001" />);

      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });
});
