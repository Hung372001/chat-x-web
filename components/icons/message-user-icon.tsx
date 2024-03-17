import React from 'react';

export default function MessageUserIcon({
  fill = '#8A9AA9',
  stroke = '#ffffff',
  strokeWidth = 1.5,
}: {
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
}) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='38' height='26' viewBox='0 0 38 26' fill='none'>
      <path
        d='M13.6 25H24.4C33.4 25 37 22.6 37 16.6V9.4C37 3.4 33.4 1 24.4 1H13.6C4.6 1 1 3.4 1 9.4V16.6C1 22.6 4.6 25 13.6 25Z'
        stroke={stroke}
        strokeWidth='1.3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M15.9707 13.5675C16.7589 12.9507 17.3342 12.105 17.6166 11.148C17.899 10.191 17.8744 9.17021 17.5463 8.22771C17.2182 7.28522 16.6028 6.46786 15.7859 5.88937C14.9689 5.31087 13.991 5 12.9881 5C11.9852 5 11.0072 5.31087 10.1903 5.88937C9.37331 6.46786 8.75797 7.28522 8.42985 8.22771C8.10173 9.17021 8.07716 10.191 8.35954 11.148C8.64193 12.105 9.21723 12.9507 10.0054 13.5675C8.65485 14.1056 7.47642 14.9981 6.59578 16.1499C5.71514 17.3017 5.16529 18.6696 5.00485 20.1077C4.99324 20.2127 5.00253 20.3189 5.0322 20.4204C5.06188 20.5218 5.11135 20.6164 5.17779 20.6988C5.24423 20.7812 5.32634 20.8498 5.41944 20.9007C5.51253 20.9515 5.61479 20.9836 5.72037 20.9952C5.82594 21.0067 5.93277 20.9975 6.03476 20.968C6.13674 20.9385 6.23188 20.8893 6.31475 20.8232C6.39761 20.7571 6.46658 20.6754 6.51771 20.5829C6.56884 20.4903 6.60114 20.3886 6.61275 20.2836C6.78929 18.7206 7.53865 17.2772 8.71767 16.229C9.89669 15.1807 11.4227 14.6013 13.0042 14.6013C14.5856 14.6013 16.1116 15.1807 17.2906 16.229C18.4697 17.2772 19.219 18.7206 19.3956 20.2836C19.4174 20.48 19.5117 20.6615 19.6601 20.7929C19.8086 20.9243 20.0008 20.9964 20.1995 20.9952H20.2879C20.4987 20.9711 20.6913 20.8651 20.8238 20.7003C20.9563 20.5356 21.018 20.3255 20.9954 20.1157C20.8342 18.6735 20.2814 17.3021 19.3962 16.1485C18.5111 14.995 17.3269 14.1027 15.9707 13.5675ZM12.9881 12.9998C12.3521 12.9998 11.7303 12.8122 11.2015 12.4608C10.6726 12.1094 10.2605 11.6099 10.0171 11.0255C9.77367 10.4411 9.70998 9.79808 9.83406 9.1777C9.95815 8.55732 10.2644 7.98746 10.7142 7.54019C11.1639 7.09292 11.7369 6.78833 12.3607 6.66492C12.9845 6.54152 13.6311 6.60486 14.2187 6.84692C14.8063 7.08898 15.3086 7.49889 15.6619 8.02483C16.0153 8.55076 16.2039 9.16909 16.2039 9.80163C16.2039 10.6498 15.8651 11.4633 15.262 12.0631C14.6589 12.6628 13.841 12.9998 12.9881 12.9998Z'
        fill={fill}
      />
      <path d='M23 9H32' stroke={stroke} strokeWidth='1.5' strokeLinecap='round' />
      <path d='M23 13H32' stroke={stroke} strokeWidth='1.5' strokeLinecap='round' />
      <path d='M23 17H32' stroke={stroke} strokeWidth='1.5' strokeLinecap='round' />
    </svg>
  );
}
