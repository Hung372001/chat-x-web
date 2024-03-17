import React from 'react';

export default function CopyIcon({ fill = '#8A9AA9' }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path fillRule='evenodd' clipRule='evenodd' d='M3 6V20H17V6H3ZM15 8H5V18H15V8Z' fill={fill} />
      <path d='M18 5H6V3H20V17H18V5Z' fill={fill} />
    </svg>
  );
}
