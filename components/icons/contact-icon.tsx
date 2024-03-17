export default function ContactIcon({
  fill = '#8A9AA9',
  stroke = '#ffffff',
}: {
  fill?: string;
  stroke?: string;
}) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path
        d='M7.55556 1V4.3V1ZM16.4444 1V4.3V1ZM2.55556 8.799H21.4444H2.55556ZM22 8.15V17.5C22 20.8 20.3333 23 16.4444 23H7.55556C3.66667 23 2 20.8 2 17.5V8.15C2 4.85 3.66667 2.65 7.55556 2.65H16.4444C20.3333 2.65 22 4.85 22 8.15Z'
        fill={fill}
      />
      <path
        d='M7.55556 1V4.3M16.4444 1V4.3M2.55556 8.799H21.4444M22 8.15V17.5C22 20.8 20.3333 23 16.4444 23H7.55556C3.66667 23 2 20.8 2 17.5V8.15C2 4.85 3.66667 2.65 7.55556 2.65H16.4444C20.3333 2.65 22 4.85 22 8.15Z'
        stroke={stroke}
        strokeWidth='1.5'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M11.9949 13.7H12.0049M8.29395 13.7H8.30395M8.29395 16.7H8.30395'
        stroke={stroke}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
