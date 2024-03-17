export default function LockIconAlt({
  fill = '#8A9AA9',
  stroke = '#ffffff',
  strokeWidth = 1.5,
}: {
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
}) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='25' height='24' viewBox='0 0 25 24' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M18.25 10.5C19.9069 10.5 21.25 11.8431 21.25 13.5V19.5C21.25 21.1569 19.9069 22.5 18.25 22.5H6.25C4.59315 22.5 3.25 21.1569 3.25 19.5V13.5C3.25 11.8431 4.59315 10.5 6.25 10.5V7.5C6.25 4.18629 8.93629 1.5 12.25 1.5C15.5637 1.5 18.25 4.18629 18.25 7.5V10.5ZM12.25 3.5C14.4591 3.5 16.25 5.29086 16.25 7.5V10.5H8.25V7.5C8.25 5.29086 10.0409 3.5 12.25 3.5ZM18.25 12.5H6.25C5.69772 12.5 5.25 12.9477 5.25 13.5V19.5C5.25 20.0523 5.69772 20.5 6.25 20.5H18.25C18.8023 20.5 19.25 20.0523 19.25 19.5V13.5C19.25 12.9477 18.8023 12.5 18.25 12.5Z'
        fill={fill}
      />
    </svg>
  );
}
