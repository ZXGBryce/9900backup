import { render, screen } from '@testing-library/react';
import { WidthDiv } from './WidthDiv';

describe('WidthDiv', () => {
  it('renders WidthDiv with default title', () => {
    render(<WidthDiv />);
    expect(screen.getByRole('div')).toBeInTheDocument();
    // expect(screen.getByRole('div', { name: /widthDiv/i })).toBeInTheDocument();
    screen.debug();
    screen.logTestingPlaygroundURL();
  });
})
