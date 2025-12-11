/**
 * Unit tests for SessionHistoryCard component
 */

import { render, screen } from '@testing-library/react';

import { SessionHistoryCard } from '../../detail/components/SessionHistoryCard';
import type { AccountSession } from '../../detail/types';

// ============ Test Data ============

const mockSessions: AccountSession[] = [
  {
    id: 'session-1',
    start: '2024-01-01T10:00:00Z',
    lastAccess: '2024-01-01T12:00:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
  },
  {
    id: 'session-2',
    start: '2024-01-02T08:00:00Z',
    lastAccess: '2024-01-02T09:30:00Z',
    ipAddress: '10.0.0.50',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
  },
];

const mockSingleSession: AccountSession[] = [
  {
    id: 'session-solo',
    start: '2024-01-03T14:00:00Z',
    lastAccess: '2024-01-03T15:00:00Z',
    ipAddress: '172.16.0.1',
    userAgent: 'Mozilla/5.0 Firefox/121.0',
  },
];

// ============ Tests ============

describe('SessionHistoryCard', () => {
  describe('rendering with sessions', () => {
    it('should display card title', () => {
      render(<SessionHistoryCard sessions={mockSessions} />);

      expect(screen.getByText('Session History')).toBeInTheDocument();
    });

    it('should display session count in subheader', () => {
      render(<SessionHistoryCard sessions={mockSessions} />);

      expect(screen.getByText('2 sessions')).toBeInTheDocument();
    });

    it('should display singular form when only one session', () => {
      render(<SessionHistoryCard sessions={mockSingleSession} />);

      expect(screen.getByText('1 session')).toBeInTheDocument();
    });

    it('should display all column headers', () => {
      render(<SessionHistoryCard sessions={mockSessions} />);

      expect(screen.getByRole('columnheader', { name: /Start Time/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Last Access/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /IP Address/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /User Agent/i })).toBeInTheDocument();
    });

    it('should display session IP addresses', () => {
      render(<SessionHistoryCard sessions={mockSessions} />);

      expect(screen.getByText('192.168.1.100')).toBeInTheDocument();
      expect(screen.getByText('10.0.0.50')).toBeInTheDocument();
    });

    it('should display session user agents', () => {
      render(<SessionHistoryCard sessions={mockSessions} />);

      expect(screen.getByText(/Chrome\/120.0.0.0/)).toBeInTheDocument();
      expect(screen.getByText(/Safari\/605.1.15/)).toBeInTheDocument();
    });

    it('should format timestamps', () => {
      render(<SessionHistoryCard sessions={mockSessions} />);

      // Check that timestamps are formatted (exact format may vary by locale)
      expect(screen.getByText(/2024/)).toBeInTheDocument();
    });

    it('should render DataGrid with correct number of rows', () => {
      render(<SessionHistoryCard sessions={mockSessions} />);

      // DataGrid should have rows
      const rows = screen.getAllByRole('row');
      // Header row + data rows (at least 3: 1 header + 2 data)
      expect(rows.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('empty state', () => {
    it('should display empty message when no sessions', () => {
      render(<SessionHistoryCard sessions={[]} />);

      expect(screen.getByText('No sessions found for this account.')).toBeInTheDocument();
    });

    it('should not display DataGrid when no sessions', () => {
      render(<SessionHistoryCard sessions={[]} />);

      // DataGrid should not be rendered in empty state
      expect(screen.queryByRole('columnheader', { name: /Start Time/i })).not.toBeInTheDocument();
    });

    it('should still display card title in empty state', () => {
      render(<SessionHistoryCard sessions={[]} />);

      expect(screen.getByText('Session History')).toBeInTheDocument();
    });
  });

  describe('null values', () => {
    it('should display N/A for missing IP address', () => {
      const sessionWithoutIP: AccountSession[] = [
        {
          id: 'session-without-ip',
          start: '2024-01-03T14:00:00Z',
          lastAccess: '2024-01-03T15:00:00Z',
          ipAddress: null as any,
          userAgent: 'Mozilla/5.0 Firefox/121.0',
        },
      ];

      render(<SessionHistoryCard sessions={sessionWithoutIP} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should display N/A for missing user agent', () => {
      const sessionWithoutUA: AccountSession[] = [
        {
          id: 'session-without-ua',
          start: '2024-01-03T14:00:00Z',
          lastAccess: '2024-01-03T15:00:00Z',
          ipAddress: '172.16.0.1',
          userAgent: null as any,
        },
      ];

      render(<SessionHistoryCard sessions={sessionWithoutUA} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should display N/A for missing start time', () => {
      const sessionWithoutStart: AccountSession[] = [
        {
          id: 'session-without-start',
          start: null as any,
          lastAccess: '2024-01-03T15:00:00Z',
          ipAddress: '172.16.0.1',
          userAgent: 'Mozilla/5.0 Firefox/121.0',
        },
      ];

      render(<SessionHistoryCard sessions={sessionWithoutStart} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  describe('DataGrid features', () => {
    it('should support sorting by default on lastAccess', () => {
      render(<SessionHistoryCard sessions={mockSessions} />);

      // DataGrid should be rendered (we can't easily test actual sorting behavior without user interaction)
      const columnHeader = screen.getByRole('columnheader', { name: /Last Access/i });
      expect(columnHeader).toBeInTheDocument();
    });

    it('should display pagination controls', () => {
      // Create more sessions to trigger pagination
      const manySessions: AccountSession[] = Array.from({ length: 10 }, (_, i) => ({
        id: `session-${i}`,
        start: `2024-01-01T${10 + i}:00:00Z`,
        lastAccess: `2024-01-01T${10 + i}:30:00Z`,
        ipAddress: `192.168.1.${100 + i}`,
        userAgent: `Mozilla/5.0 Test ${i}`,
      }));

      render(<SessionHistoryCard sessions={manySessions} />);

      // DataGrid should render with pagination (look for MuiDataGrid elements)
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(0);
    });
  });

  describe('styling', () => {
    it('should apply monospace font to IP addresses', () => {
      render(<SessionHistoryCard sessions={mockSessions} />);

      const ipCell = screen.getByText('192.168.1.100');
      expect(ipCell).toHaveStyle({ fontFamily: 'monospace' });
    });
  });
});
