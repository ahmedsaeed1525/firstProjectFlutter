import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

export const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button onClick={onClick} style={{ padding: '10px 20px', fontSize: '16px' }}>
      {children}
    </button>
  );
};
