import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Auckland Weathe', () => {
  render(<App />);
  const linkElement = screen.getByText(/Auckland Weather/i);
  expect(linkElement).toBeInTheDocument();
});
