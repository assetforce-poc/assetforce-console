import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SubgraphStatus } from '../../../../generated/graphql';
import type { Subgraph } from '../../types';
import { SubgraphList } from '../SubgraphList';

const mockSubgraphs: Subgraph[] = [
  {
    id: 'subgraph-1',
    name: 'aac',
    displayName: 'AAC Subgraph',
    status: SubgraphStatus.Active,
    graphqlUrl: 'http://aac:8081/graphql',
    priority: 1,
    failureCount: 0,
    lastHealthyAt: '2025-12-26T00:00:00Z',
    createdAt: '2025-12-26T00:00:00Z',
    updatedAt: '2025-12-26T00:00:00Z',
  },
  {
    id: 'subgraph-2',
    name: 'imc',
    displayName: null,
    status: SubgraphStatus.Unhealthy,
    graphqlUrl: 'http://imc:8082/graphql',
    priority: 2,
    failureCount: 5,
    lastHealthyAt: null,
    createdAt: '2025-12-26T00:00:00Z',
    updatedAt: '2025-12-26T00:00:00Z',
  },
];

describe('SubgraphList', () => {
  describe('empty state', () => {
    it('should display empty state when no subgraphs', () => {
      render(<SubgraphList subgraphs={[]} />);

      expect(screen.getByText('No Subgraphs Registered')).toBeInTheDocument();
      expect(screen.getByText(/Register a subgraph to start routing GraphQL traffic/)).toBeInTheDocument();
    });

    it('should show register button in empty state when onRegister provided', () => {
      const onRegister = jest.fn();
      render(<SubgraphList subgraphs={[]} onRegister={onRegister} />);

      const registerButton = screen.getByRole('button', { name: /register subgraph/i });
      expect(registerButton).toBeInTheDocument();
    });
  });

  describe('list rendering', () => {
    it('should display all subgraphs with correct data', () => {
      render(<SubgraphList subgraphs={mockSubgraphs} />);

      // Check first subgraph
      expect(screen.getByText('aac')).toBeInTheDocument();
      expect(screen.getByText('AAC Subgraph')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('http://aac:8081/graphql')).toBeInTheDocument();

      // Check second subgraph (with null displayName and failures)
      expect(screen.getByText('imc')).toBeInTheDocument();
      const allDashes = screen.getAllByText('-');
      expect(allDashes.length).toBeGreaterThan(0); // null displayName and/or null lastHealthyAt shows as '-'
      expect(screen.getByText('Unhealthy')).toBeInTheDocument();
    });

    it('should display action buttons for each subgraph', () => {
      render(<SubgraphList subgraphs={mockSubgraphs} />);

      // Should have Deactivate button for ACTIVE subgraph (tooltip "Deactivate")
      expect(screen.getByLabelText('Deactivate')).toBeInTheDocument();

      // Should have Activate button for UNHEALTHY subgraph (tooltip "Activate")
      expect(screen.getByLabelText('Activate')).toBeInTheDocument();

      // Should have Refresh buttons (2, one per subgraph)
      const refreshButtons = screen.getAllByLabelText(/refresh schema/i);
      expect(refreshButtons).toHaveLength(2);

      // Should have Remove buttons (2, one per subgraph)
      const removeButtons = screen.getAllByLabelText(/remove/i);
      expect(removeButtons).toHaveLength(2);
    });
  });

  describe('interactions', () => {
    it('should call onActivate when activate button clicked', async () => {
      const onActivate = jest.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();

      render(<SubgraphList subgraphs={mockSubgraphs} onActivate={onActivate} />);

      // Find all buttons with tooltip "Activate"
      const activateButtons = screen.getAllByLabelText('Activate');
      expect(activateButtons).toHaveLength(1); // Only UNHEALTHY subgraph has activate button

      await user.click(activateButtons[0]);

      expect(onActivate).toHaveBeenCalledTimes(1);
      expect(onActivate).toHaveBeenCalledWith('imc');
    });

    it('should call onDeactivate when deactivate button clicked', async () => {
      const onDeactivate = jest.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();

      render(<SubgraphList subgraphs={mockSubgraphs} onDeactivate={onDeactivate} />);

      // Find all buttons with tooltip "Deactivate"
      const deactivateButtons = screen.getAllByLabelText('Deactivate');
      expect(deactivateButtons).toHaveLength(1); // Only ACTIVE subgraph has deactivate button

      await user.click(deactivateButtons[0]);

      expect(onDeactivate).toHaveBeenCalledTimes(1);
      expect(onDeactivate).toHaveBeenCalledWith('aac');
    });

    it('should call onViewDetail when row clicked', async () => {
      const onViewDetail = jest.fn();
      const user = userEvent.setup();

      render(<SubgraphList subgraphs={mockSubgraphs} onViewDetail={onViewDetail} />);

      // Click the first row (find by name 'aac')
      const firstRow = screen.getByText('aac').closest('tr');
      if (firstRow) await user.click(firstRow);

      expect(onViewDetail).toHaveBeenCalledWith('aac');
    });
  });
});
