export default function UserIcon({
  fill = '#8A9AA9',
  stroke = '#ffffff',
}: {
  fill?: string;
  stroke?: string;
}) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'>
      <path
        d='M18.5289 14.1609C19.6405 13.2912 20.4519 12.0984 20.8501 10.7487C21.2484 9.399 21.2137 7.95939 20.751 6.63017C20.2882 5.30095 19.4204 4.14822 18.2682 3.33236C17.116 2.51649 15.7368 2.07806 14.3224 2.07806C12.908 2.07806 11.5288 2.51649 10.3766 3.33236C9.22441 4.14822 8.35658 5.30095 7.89383 6.63017C7.43108 7.95939 7.39642 9.399 7.79467 10.7487C8.19293 12.0984 9.00429 13.2912 10.1159 14.1609C8.21115 14.9199 6.54919 16.1786 5.3072 17.803C4.06521 19.4274 3.28975 21.3565 3.06348 23.3848C3.0471 23.5328 3.06021 23.6827 3.10206 23.8257C3.14391 23.9688 3.21367 24.1022 3.30738 24.2184C3.40108 24.3346 3.51689 24.4314 3.64818 24.5031C3.77948 24.5748 3.92369 24.6201 4.07259 24.6364C4.22148 24.6527 4.37215 24.6396 4.51598 24.598C4.65981 24.5564 4.79399 24.487 4.91085 24.3938C5.02772 24.3006 5.12499 24.1855 5.1971 24.0549C5.26921 23.9243 5.31476 23.7809 5.33114 23.6328C5.58011 21.4286 6.63695 19.3928 8.29975 17.9145C9.96254 16.4362 12.1147 15.619 14.3451 15.619C16.5754 15.619 18.7276 16.4362 20.3904 17.9145C22.0532 19.3928 23.11 21.4286 23.359 23.6328C23.3898 23.9099 23.5228 24.1658 23.7321 24.3511C23.9415 24.5365 24.2125 24.6381 24.4928 24.6364H24.6175C24.9148 24.6024 25.1864 24.4529 25.3733 24.2206C25.5602 23.9883 25.6472 23.6919 25.6153 23.396C25.388 21.3621 24.6083 19.428 23.36 17.8011C22.1116 16.1742 20.4416 14.9158 18.5289 14.1609ZM14.3224 13.3603C13.4254 13.3603 12.5485 13.0958 11.8027 12.6002C11.0569 12.1046 10.4756 11.4001 10.1323 10.576C9.78904 9.7518 9.69923 8.8449 9.87422 7.96996C10.0492 7.09502 10.4812 6.29134 11.1154 5.66055C11.7497 5.02975 12.5578 4.60018 13.4376 4.42614C14.3174 4.25211 15.2293 4.34143 16.058 4.68281C16.8867 5.02419 17.595 5.60231 18.0934 6.34404C18.5917 7.08578 18.8577 7.95782 18.8577 8.8499C18.8577 10.0461 18.3799 11.1934 17.5293 12.0393C16.6788 12.8851 15.5252 13.3603 14.3224 13.3603Z'
        fill={fill}
      />
    </svg>
  );
}
