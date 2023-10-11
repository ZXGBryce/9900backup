import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyButton } from './MyButton';

describe('MyButton', () => {
  it('renders button with default title', () => {
    render(<MyButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    // screen.debug();
    // screen.logTestingPlaygroundURL();
  });

  it('renders button with custom text', () => {
    render(<MyButton text="A custom text" />);
    expect(screen.getByRole('button', { name: /a custom text/i })).toBeInTheDocument();
  });

  it('renders button with disabled props', () => {
    render(<MyButton disable = 'true' />);
    expect(screen.getByRole('button', { disabled: true })).toBeInTheDocument();
  });

  it('triggers onClick when clicked', () => {
    const onClick = jest.fn();
    render(<MyButton onClick={onClick} />);
    userEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
})
