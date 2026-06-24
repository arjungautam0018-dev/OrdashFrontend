import React from "react";
import Svg, { Path } from "react-native-svg";
import { SvgProps } from "react-native-svg";

// 📍 Location Icon
export const LocationIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
    />
  </Svg>
);



// Dropdwons type navbar left

export const MenuIcon = ({
  width = 24,
  height = 24,
  color = "#333",
  ...props
}: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    width={width}
    height={height}
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
    />
  </Svg>
);




// 🔍 Search Icon
export const SearchIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </Svg>
);


// 🎛️ Settings / Sliders Icon
export const SlidersIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
    />
  </Svg>
);


// ❤️ Heart / Like Icon
export const HeartIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />
  </Svg>
);

// ⭐ Star Icon
export const StarIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
    />
  </Svg>
);

// ➕ Plus Icon
export const PlusIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </Svg>
);

//Store Icon
export const StoreIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={props.color || "#7DD3A0"}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* roof / top line */}
    <Path d="M21 22H3" />

    {/* pillars */}
    <Path opacity={0.5} d="M19 22V15" />
    <Path opacity={0.5} d="M5 22V15" />

    {/* main shop body */}
    <Path d="M16.53 2H7.47c-1.2 0-1.8 0-2.28.3C4.7 2.6 4.43 3.14 3.89 4.21L2.49 7.76c-.32.82-.6 1.78-.06 2.48C2.79 10.7 3.36 11 4 11c1.1 0 2-.9 2-2 0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2 .64 0 1.21-.3 1.57-.76.55-.69.27-1.66-.06-2.48L21.51 4.21C20.97 3.14 20.7 2.6 20.22 2.3 19.73 2 19.13 2 16.53 2Z" />
  </Svg>
);

// Bag Icon
export const BagIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="#7DD3A0"   // soft green
    strokeWidth={1.5}  // lighter stroke = less bold
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M18 7h-3V6a3 3 0 0 0-6 0v1H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" />

    <Path d="M11 6a1 1 0 0 1 2 0v1h-2V6z" />

    <Path d="M8 9v10" />
    <Path d="M12 9v10" />
    <Path d="M16 9v10" />
  </Svg>
);

export const ArrowRightIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="#7DD3A0"   // soft green
    strokeWidth={1.5}  // light stroke for modern look
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M5 12h14" />
    <Path d="M13 5l7 7-7 7" />
  </Svg>
);

export const WArrowRightIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={props.color || "#7DD3A0"}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M5 12h14" />
    <Path d="M13 5l7 7-7 7" />
  </Svg>
);


export const QrIcon = ({ size = 24, color = '#4CAF50' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM19 14h3v3h-3zM14 19h3v3h-3zM19 19h3v3h-3z" fill={color}/>
    <Path d="M12 2v2M12 18v2M2 12h2M18 12h2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

export const CloseIcon = ({ size = 24, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6l12 12"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CheckmarkIcon = ({ size = 24, color = '#4CAF50' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 6L9 17l-5-5"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CameraIcon = ({ size = 24, color = '#666' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 9a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
      fill={color}
    />
  </Svg>
);

export const ScanFrameIcon = ({ size = 280, color = '#4CAF50' }) => (
  <Svg width={size} height={size} viewBox="0 0 280 280" fill="none">
    <Path d="M20 0 H60 M220 0 H260 M0 20 V60 M0 220 V260 M260 0 H220 M280 20 V60 M280 220 V260 M20 280 H60 M220 280 H260" stroke={color} strokeWidth="6" strokeLinecap="round"/>
  </Svg>
);


// --- Bottom Nav Icons ---
// All use color prop: #2D2D2D inactive, accent color when focused

// 🏠 Home Nav Icon
export const NavHomeIcon = ({ size = 24, color = '#2D2D2D' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 20H7C5.89543 20 5 19.1046 5 18V10.9199C5 10.336 5.25513 9.78132 5.69842 9.40136L10.6984 5.11564C11.4474 4.47366 12.5526 4.47366 13.3016 5.11564L18.3016 9.40136C18.7449 9.78132 19 10.336 19 10.9199V18C19 19.1046 18.1046 20 17 20H15M9 20V14C9 13.4477 9.44772 13 10 13H14C14.5523 13 15 13.4477 15 14V20M9 20H15"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 🪑 Tables Nav Icon
export const NavTablesIcon = ({ size = 24, color = '#2D2D2D' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1.5 6.32H22.5V10.14H1.5Z" stroke={color} strokeWidth={1.6} strokeMiterlimit={10} />
    <Path d="M4.36 19.68H2.46L4.36 10.14H8.18L4.36 19.68Z" stroke={color} strokeWidth={1.6} strokeMiterlimit={10} />
    <Path d="M19.64 19.68H21.55L19.64 10.14H15.82L19.64 19.68Z" stroke={color} strokeWidth={1.6} strokeMiterlimit={10} />
    <Path d="M6.27 14.91H17.73" stroke={color} strokeWidth={1.6} strokeMiterlimit={10} strokeLinecap="round" />
  </Svg>
);

// ➕ Orders Nav Icon
export const NavOrdersIcon = ({ size = 24, color = '#2D2D2D' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 4.5V19.5M4.5 12H19.5"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 📦 Stock Nav Icon (outline only)
export const NavStockIcon = ({ size = 24, color = '#2D2D2D' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* box outline */}
    <Path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* bottom face */}
    <Path
      d="M2 17L12 22L22 17"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* vertical sides */}
    <Path
      d="M2 7V17M22 7V17M12 12V22"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 📊 Analytics Nav Icon
export const NavAnalyticsIcon = ({ size = 24, color = '#2D2D2D' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 1920 1920" fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M746.667 106.667V1493.33H1173.33V106.667H746.667ZM1056 224H864V1376H1056V224ZM106.667 533.333H533.333V1493.33H106.667V533.333ZM224 650.667H416V1376H224V650.667Z" fill={color} />
    <Path d="M1920 1706.67H0V1824H1920V1706.67Z" fill={color} />
    <Path fillRule="evenodd" clipRule="evenodd" d="M1386.67 746.667H1813.33V1493.33H1386.67V746.667ZM1504 864H1696V1376H1504V864Z" fill={color} />
  </Svg>
);

// ⚙️ Settings Icon (yellow outline)
export const SettingsIcon = ({ size = 24, color = '#F5C518' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 30 30" fill="none">
    <Path
      d="M27.52 21.134L26.528 22.866C26.254 23.345 25.648 23.508 25.173 23.232L22.418 21.628C21.02 23.219 19.129 24.359 16.983 24.799V27C16.983 27.553 16.54 28 15.992 28H14.008C13.46 28 13.017 27.553 13.017 27V24.799C10.871 24.359 8.98 23.219 7.582 21.628L4.827 23.232C4.352 23.508 3.746 23.345 3.472 22.866L2.48 21.134C2.206 20.656 2.369 20.044 2.843 19.769L5.609 18.157C5.28 17.163 5.083 16.106 5.083 15C5.083 13.894 5.28 12.838 5.609 11.843L2.843 10.232C2.369 9.956 2.206 9.345 2.48 8.866L3.472 7.134C3.746 6.656 4.352 6.492 4.827 6.768L7.582 8.372C8.98 6.781 10.871 5.641 13.017 5.201V3C13.017 2.447 13.46 2 14.008 2H15.992C16.54 2 16.983 2.447 16.983 3V5.201C19.129 5.641 21.02 6.781 22.418 8.372L25.173 6.768C25.648 6.492 26.254 6.656 26.528 7.134L27.52 8.866C27.794 9.345 27.631 9.956 27.157 10.232L24.391 11.843C24.72 12.838 24.917 13.894 24.917 15C24.917 16.106 24.72 17.163 24.391 18.157L27.157 19.769C27.631 20.044 27.794 20.656 27.52 21.134ZM29.008 18.536L26.685 17.184C26.815 16.474 26.901 15.749 26.901 15C26.901 14.252 26.815 13.526 26.685 12.816L29.008 11.464C29.957 10.912 30.281 9.688 29.733 8.732L27.75 5.268C27.203 4.312 25.989 3.983 25.041 4.536L22.694 5.901C21.598 4.961 20.352 4.192 18.967 3.697V2C18.967 0.896 18.079 0 16.983 0H13.017C11.921 0 11.033 0.896 11.033 2V3.697C9.648 4.192 8.402 4.961 7.306 5.901L4.959 4.536C4.011 3.983 2.797 4.312 2.25 5.268L0.267 8.732C-0.281 9.688 0.044 10.912 0.992 11.464L3.315 12.816C3.185 13.526 3.099 14.252 3.099 15C3.099 15.749 3.185 16.474 3.315 17.184L0.992 18.536C0.044 19.088 -0.281 20.312 0.267 21.268L2.25 24.732C2.797 25.688 4.011 26.017 4.959 25.464L7.306 24.099C8.402 25.039 9.648 25.809 11.033 26.303V28C11.033 29.104 11.921 30 13.017 30H16.983C18.079 30 18.967 29.104 18.967 28V26.303C20.352 25.809 21.598 25.039 22.694 24.099L25.041 25.464C25.989 26.017 27.203 25.688 27.75 24.732L29.733 21.268C30.281 20.312 29.957 19.088 29.008 18.536ZM15 18C13.357 18 12.025 16.657 12.025 15C12.025 13.344 13.357 12 15 12C16.643 12 17.975 13.344 17.975 15C17.975 16.657 16.643 18 15 18ZM15 10C12.261 10 10.042 12.238 10.042 15C10.042 17.762 12.261 20 15 20C17.739 20 19.959 17.762 19.959 15C19.959 12.238 17.739 10 15 10Z"
      fill={color}
    />
  </Svg>
);
