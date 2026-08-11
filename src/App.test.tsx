import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App';
import { AppStateProvider } from './hooks/useAppState';

describe('واجهة نَبِّهني', () => {
  it('تعرض واجهة عربية باتجاه RTL', () => {
    render(<MemoryRouter initialEntries={['/']}><AppStateProvider><App /></AppStateProvider></MemoryRouter>);
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('dir', 'rtl');
    expect(screen.getByRole('status', { name: 'يتم تشغيل نَبِّهني' })).toBeInTheDocument();
    expect(screen.getByText('ابدأ التجربة')).toBeInTheDocument();
  });
});
