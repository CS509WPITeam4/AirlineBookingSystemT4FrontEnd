import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import FlightDetailsPage from './FlightDetailsPage';

// ✅ Mock token so it doesn't redirect to /login
beforeAll(() => {
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
    if (key === 'token') return 'mock-token';
    return null;
  });
});

// Utility to render the page with routing
const renderPage = () => {
  render(
    <MemoryRouter initialEntries={['/flights/FL123']}>
      <Routes>
        <Route path="/flights/:flightId" element={<FlightDetailsPage />} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('FlightDetailsPage', () => {
  test('renders Flight Summary initially', async () => {
    renderPage();
    const summary = await screen.findAllByText(/flight summary/i);
    expect(summary.length).toBeGreaterThan(0);
  });

  test('shows seat warning if low availability', async () => {
    renderPage();
    const seatWarning = await screen.findByText(/only 8 seats left/i);
    expect(seatWarning).toBeInTheDocument();
  });

  test('navigates to Passenger Info step when Next is clicked', async () => {
    renderPage();
    const nextButton = await screen.findByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    const passengerInfoMatches = await screen.findAllByText(/passenger information/i);
    expect(passengerInfoMatches.length).toBeGreaterThan(0);
  });
});
