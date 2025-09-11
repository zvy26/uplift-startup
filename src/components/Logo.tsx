import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'text' | 'full';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'icon',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'w-24 h-6',
    md: 'w-32 h-8',
    lg: 'w-48 h-12',
  };

  if (variant === 'text') {
    return (
      <img
        src="/logo-text.svg"
        alt="IELTS Essay Band Uplift"
        className={`${textSizeClasses[size]} ${className}`}
      />
    );
  }

  if (variant === 'full') {
    return (
      <img
        src="/logo.svg"
        alt="IELTS Essay Band Uplift"
        className={`${sizeClasses[size]} ${className}`}
      />
    );
  }

  // Default icon variant
  return (
    <img
      src="/favicon.svg"
      alt="IELTS Essay Band Uplift"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
};



