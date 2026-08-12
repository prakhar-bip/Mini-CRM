import React, { useState } from 'react';
import { Package, User } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  type?: 'product' | 'user' | 'customer' | 'generic';
  style?: React.CSSProperties;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  type = 'product',
  style,
  className,
  width = '38px',
  height = '38px',
}) => {
  const [hasError, setHasError] = useState(false);

  const containerStyle: React.CSSProperties = {
    width,
    height,
    borderRadius: '8px',
    backgroundColor: 'var(--very-light-blue)',
    border: '1px solid var(--border-color)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
    ...style,
  };

  if (!src || hasError) {
    return (
      <div style={containerStyle} className={className} title={alt}>
        {type === 'user' || type === 'customer' ? (
          <User size={typeof width === 'number' ? width * 0.5 : 18} color="#5B90E5" />
        ) : (
          <Package size={typeof width === 'number' ? width * 0.5 : 18} color="#5B90E5" />
        )}
      </div>
    );
  }

  return (
    <div style={containerStyle} className={className}>
      <img
        src={src}
        alt={alt}
        onError={() => setHasError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
};
