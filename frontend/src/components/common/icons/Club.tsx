type ClubProps = {
  size?: number;
  fill?: string;
  rotate?: number;
};

export default function Club({
  size = 24,
  fill = "#000000",
  rotate,
}: ClubProps) {
  return (
    <svg height={size} viewBox="0 0 512 512" transform={`rotate(${rotate})`}>
      <g>
        <path
          fill={fill}
          d="M331.149,509.306C332.006,510.438,332.406,509.769,331.149,509.306L331.149,509.306z"
        />
        <path
          fill={fill}
          d="M396.538,196.316c-31.76,0.598-60.193,14.219-80.377,35.647c-10.068,8.006-18.697,13.302-23.035,7.034
          c-8.644-9.722,18.322-23.59,34.945-38.358l-2.647,0.048c24.282-21.253,39.386-52.657,38.736-87.442
          C362.985,50.658,311.305,0.872,248.719,2.053c-62.585,1.172-112.364,52.856-111.191,115.441
          c0.73,38.972,21.061,72.984,51.413,92.817c16.121,11.412,34.112,21.747,27.214,30.136c-4.107,6.427-12.927,1.444-23.286-6.172
          c-20.965-20.663-49.902-33.199-81.657-32.609C48.626,202.838-1.156,254.531,0.02,317.116
          c1.173,62.577,52.861,112.364,115.438,111.183c57.665-1.076,104.416-45.041,110.509-100.888c0.008-0.024,0.04,0,0.04,0
          c0.885-4.92,2.309-15.646,5.897-15.43c4.239,0.239,5.522-0.766,5.874,18.11c3.038,92.386-48.127,176.639-49.391,178.944
          c-0.12,0.224-0.192,0.239-0.295,0.383c0.423-0.199,1.045-0.367,1.986-0.383c3.581-0.064,69.635,0,69.635,0s66.054,0.064,69.634,0
          c0.83-0.016,1.384,0.112,1.802,0.271c-0.088-0.119-0.139-0.111-0.235-0.271c-1.343-2.249-55.611-87.203-56.038-179.638
          c-0.355-18.868,0.965-17.919,5.188-18.326c3.581-0.343,5.399,10.319,6.468,15.175c0.008,0.024,0.04,0,0.04,0
          c8.186,55.608,56.556,97.794,114.218,96.709c62.58-1.18,112.367-52.864,111.191-115.441
          C510.803,244.929,459.123,195.144,396.538,196.316z"
        />
        <path
          fill={fill}
          d="M188.092,509.418C187.055,509.888,187.382,510.375,188.092,509.418L188.092,509.418z"
        />
      </g>
    </svg>
  );
}
