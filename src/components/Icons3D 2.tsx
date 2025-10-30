import React from 'react';

interface IconProps {
  size?: number;
  active?: boolean;
}

// Иконка дома (Home)
export const HomeIcon3D: React.FC<IconProps> = ({ size = 32, active = false }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="homeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={active ? "#5EAEA4" : "#9CA3AF"} />
          <stop offset="100%" stopColor={active ? "#3D8B83" : "#6B7280"} />
        </linearGradient>
      </defs>
      <path
        d="M16 4L4 14V28H12V20H20V28H28V14L16 4Z"
        fill="url(#homeGrad)"
        opacity="0.9"
      />
      <path
        d="M16 4L4 14V28H12V20H20V28H28V14L16 4Z"
        fill="white"
        opacity="0.2"
      />
    </svg>
  );
};

// Иконка сердца (Favorites)
export const HeartIcon3D: React.FC<IconProps> = ({ size = 32, active = false }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={active ? "#EC4899" : "#9CA3AF"} />
          <stop offset="100%" stopColor={active ? "#BE185D" : "#6B7280"} />
        </linearGradient>
      </defs>
      <path
        d="M16 28L5.5 17.5C2.5 14.5 2.5 9.5 5.5 6.5C8.5 3.5 13.5 3.5 16 6L16 6C18.5 3.5 23.5 3.5 26.5 6.5C29.5 9.5 29.5 14.5 26.5 17.5L16 28Z"
        fill="url(#heartGrad)"
        opacity="0.9"
      />
      <ellipse
        cx="16"
        cy="12"
        rx="8"
        ry="4"
        fill="white"
        opacity="0.3"
      />
    </svg>
  );
};

// Иконка корзины (Cart)
export const CartIcon3D: React.FC<IconProps> = ({ size = 32, active = false }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="cartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={active ? "#F5A962" : "#9CA3AF"} />
          <stop offset="100%" stopColor={active ? "#D97706" : "#6B7280"} />
        </linearGradient>
      </defs>
      <path
        d="M10 28C8.9 28 8 27.1 8 26C8 24.9 8.9 24 10 24C11.1 24 12 24.9 12 26C12 27.1 11.1 28 10 28ZM24 28C22.9 28 22 27.1 22 26C22 24.9 22.9 24 24 24C25.1 24 26 24.9 26 26C26 27.1 25.1 28 24 28ZM8.2 6L10.8 16H23.2L27.4 8H8.2ZM4 4H28L22 18H12L8 6H4Z"
        fill="url(#cartGrad)"
        opacity="0.9"
      />
      <ellipse
        cx="17"
        cy="10"
        rx="6"
        ry="3"
        fill="white"
        opacity="0.3"
      />
    </svg>
  );
};

// Иконка профиля (Profile)
export const ProfileIcon3D: React.FC<IconProps> = ({ size = 32, active = false }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="profileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={active ? "#8B5CF6" : "#9CA3AF"} />
          <stop offset="100%" stopColor={active ? "#6D28D9" : "#6B7280"} />
        </linearGradient>
      </defs>
      <circle
        cx="16"
        cy="12"
        r="5"
        fill="url(#profileGrad)"
        opacity="0.9"
      />
      <path
        d="M6 28C6 23 10.5 19 16 19C21.5 19 26 23 26 28H6Z"
        fill="url(#profileGrad)"
        opacity="0.9"
      />
      <circle
        cx="16"
        cy="10"
        r="3"
        fill="white"
        opacity="0.3"
      />
    </svg>
  );
};

// Иконка поиска
export const SearchIcon3D: React.FC<IconProps> = ({ size = 24 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="searchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9CA3AF" />
          <stop offset="100%" stopColor="#6B7280" />
        </linearGradient>
      </defs>
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke="url(#searchGrad)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M16 16L20 20"
        stroke="url(#searchGrad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

// Иконка микрофона
export const MicIcon3D: React.FC<IconProps> = ({ size = 24 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="micGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5EAEA4" />
          <stop offset="100%" stopColor="#3D8B83" />
        </linearGradient>
      </defs>
      <rect
        x="9"
        y="3"
        width="6"
        height="10"
        rx="3"
        fill="url(#micGrad)"
        opacity="0.9"
      />
      <path
        d="M6 11C6 14.3 8.7 17 12 17C15.3 17 18 14.3 18 11"
        stroke="url(#micGrad)"
        strokeWidth="2"
        fill="none"
      />
      <line
        x1="12"
        y1="17"
        x2="12"
        y2="21"
        stroke="url(#micGrad)"
        strokeWidth="2"
      />
      <ellipse
        cx="12"
        cy="7"
        rx="2"
        ry="1.5"
        fill="white"
        opacity="0.4"
      />
    </svg>
  );
};

// Иконка уведомлений
export const NotificationIcon3D: React.FC<IconProps> = ({ size = 24 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="notifGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E86C6C" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
      </defs>
      <path
        d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"
        fill="url(#notifGrad)"
        opacity="0.9"
      />
      <ellipse
        cx="12"
        cy="10"
        rx="4"
        ry="2"
        fill="white"
        opacity="0.3"
      />
    </svg>
  );
};

// Иконка локации
export const LocationIcon3D: React.FC<IconProps> = ({ size = 24 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="locationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5EAEA4" />
          <stop offset="100%" stopColor="#3D8B83" />
        </linearGradient>
      </defs>
      <path
        d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
        fill="url(#locationGrad)"
        opacity="0.9"
      />
      <circle
        cx="12"
        cy="9"
        r="2.5"
        fill="white"
        opacity="0.6"
      />
      <ellipse
        cx="12"
        cy="7"
        rx="3"
        ry="1.5"
        fill="white"
        opacity="0.3"
      />
    </svg>
  );
};
