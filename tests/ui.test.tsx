import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '@/ui/components/layout/Sidebar';
import { AuthProvider } from '@/ui/contexts/AuthContext';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({ replace: jest.fn() }),
}));

// Mock AuthContext to avoid Firebase initialization in JSDOM
jest.mock('@/ui/contexts/AuthContext', () => ({
  useAuth: () => ({ user: null, loading: false, isDemo: true, signIn: jest.fn(), signOutUser: jest.fn() }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Sidebar UI Component', () => {
  it('renders the sidebar with correct navigation links', () => {
    render(
      <AuthProvider>
        <Sidebar />
      </AuthProvider>
    );

    // Verify logo
    expect(screen.getByText('EcoTrack')).toBeInTheDocument();

    // Verify main navigation links
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Log Activity')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();
    expect(screen.getByText('Eco Actions')).toBeInTheDocument();

    // Verify demo user fallback is rendered (since Firebase is mocked/unconfigured)
    expect(screen.getByText('Demo User')).toBeInTheDocument();
  });
});
