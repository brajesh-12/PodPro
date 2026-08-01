import Svg, { Line, Path, Mask, G, Circle } from 'react-native-svg';

export const Save = ({ color = "black", size = 24, fill = "none", strokeWidth = 1.6 }) => {
  return (
    <Svg fill={fill} width={size} height={size} viewBox="0 0 24 24">
      <Path
        stroke={color}
        strokeWidth={strokeWidth}
        d="M5.2 2.8h13.6c.22 0 .4.18.4.4v17.577a.4.4 0 0 1-.62.334l-5.482-3.597a2.001 2.001 0 0 0-2.196 0L5.42 21.11a.4.4 0 0 1-.62-.334V3.2c0-.22.18-.4.4-.4Z"
      />
    </Svg>
  );
};

export const Download = ({ size = 24, color = "black", strokeWidth = 2 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 17V3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 11L12 17L18 11" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M19 21H5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
};

export const Backward = ({ size = 24, color = "black", strokeWidth = 1.5, viewBox = "0 0 24 24" }) => {
  return (
    <Svg width={size} height={size} viewBox={viewBox} fill="none" >
      <Path d="M13.5 22C18.1944 22 22 18.1944 22 13.5C22 8.80558 18.1944 5 13.5 5H2M2 5L5 2M2 5L5 8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M14.3945 17.7773C13.5039 17.7773 12.7988 17.4863 12.2793 16.9043C11.7598 16.3184 11.5 15.4609 11.5 14.332V12.4512C11.5 11.3262 11.7578 10.4707 12.2734 9.88477C12.793 9.29492 13.4961 9 14.3828 9C15.2656 9 15.9668 9.29492 16.4863 9.88477C17.0098 10.4707 17.2715 11.3262 17.2715 12.4512V14.332C17.2715 15.4609 17.0117 16.3184 16.4922 16.9043C15.9766 17.4863 15.2773 17.7773 14.3945 17.7773ZM14.3945 16.4648C14.7773 16.4648 15.0684 16.3086 15.2676 15.9961C15.4668 15.6836 15.5664 15.1836 15.5664 14.4961V12.2754C15.5664 11.5957 15.4648 11.0996 15.2617 10.7871C15.0586 10.4746 14.7656 10.3184 14.3828 10.3184C13.9961 10.3184 13.7031 10.4746 13.5039 10.7871C13.3047 11.0996 13.2051 11.5957 13.2051 12.2754V14.4961C13.2051 15.1836 13.3047 15.6836 13.5039 15.9961C13.707 16.3086 14.0039 16.4648 14.3945 16.4648Z" fill={color} />
      <Path d="M7.5 9.79999H9.5V17.8" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
};

export const Forward = ({ color = "black", size = 24, strokeWidth = 1.5 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10.5 22C5.80558 22 2 18.1944 2 13.5C2 8.80558 5.80558 5 10.5 5H22M22 5L19 2M22 5L19 8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M16.4629 18.123C15.5723 18.123 14.8672 17.832 14.3477 17.25C13.8281 16.6641 13.5684 15.8066 13.5684 14.6777V12.7969C13.5684 11.6719 13.8262 10.8164 14.3418 10.2305C14.8613 9.64062 15.5645 9.3457 16.4512 9.3457C17.334 9.3457 18.0352 9.64062 18.5547 10.2305C19.0781 10.8164 19.3398 11.6719 19.3398 12.7969V14.6777C19.3398 15.8066 19.0801 16.6641 18.5605 17.25C18.0449 17.832 17.3457 18.123 16.4629 18.123ZM16.4629 16.8105C16.8457 16.8105 17.1367 16.6543 17.3359 16.3418C17.5352 16.0293 17.6348 15.5293 17.6348 14.8418V12.6211C17.6348 11.9414 17.5332 11.4453 17.3301 11.1328C17.127 10.8203 16.834 10.6641 16.4512 10.6641C16.0645 10.6641 15.7715 10.8203 15.5723 11.1328C15.373 11.4453 15.2734 11.9414 15.2734 12.6211V14.8418C15.2734 15.5293 15.373 16.0293 15.5723 16.3418C15.7754 16.6543 16.0723 16.8105 16.4629 16.8105Z" fill={color} />
      <Path d="M9.58008 18.123C9.03711 18.123 8.54297 18.0273 8.09766 17.8359C7.65234 17.6445 7.30078 17.3652 7.04297 16.998C6.79297 16.6543 6.66797 16.2344 6.66797 15.7383V15.6738L6.67969 15.6387H8.33789C8.33789 15.8613 8.38867 16.0625 8.49023 16.2422C8.5918 16.418 8.73438 16.5566 8.91797 16.6582C9.10547 16.7598 9.32617 16.8105 9.58008 16.8105C9.97461 16.8105 10.2852 16.7012 10.5117 16.4824C10.7422 16.2598 10.8574 15.9512 10.8574 15.5566C10.8574 15.1582 10.7441 14.8477 10.5176 14.625C10.291 14.4023 9.94922 14.291 9.49219 14.291H8.56641V13.0078H9.52734C9.80469 13.0078 10.0293 12.959 10.2012 12.8613C10.5488 12.6777 10.7227 12.3359 10.7227 11.8359C10.7227 11.4727 10.625 11.1875 10.4297 10.9805C10.2344 10.7695 9.95117 10.6641 9.58008 10.6641C9.35352 10.6641 9.15625 10.707 8.98828 10.793C8.625 10.9766 8.44336 11.2871 8.44336 11.7246H6.78516L6.77344 11.6895V11.625C6.77344 11.1992 6.88477 10.8164 7.10742 10.4766C7.3418 10.125 7.67188 9.84961 8.09766 9.65039C8.52734 9.44727 9.01758 9.3457 9.56836 9.3457C10.4316 9.3457 11.125 9.55664 11.6484 9.97852C12.1719 10.3965 12.4336 10.9902 12.4336 11.7598C12.4336 12.1582 12.3223 12.5176 12.0996 12.8379C11.8809 13.1582 11.5527 13.4199 11.1152 13.623C11.5879 13.791 11.9473 14.0488 12.1934 14.3965C12.4434 14.7441 12.5684 15.1484 12.5684 15.6094C12.5684 16.1289 12.4395 16.5762 12.1816 16.9512C11.9238 17.3262 11.5684 17.6152 11.1152 17.8184C10.666 18.0215 10.1543 18.123 9.58008 18.123Z" fill={color} />
    </Svg>
  );
};

export const SleepTimer = ({ size = 24, color = "black", strokeWidth = 2 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10.1084 3.23242C10.1594 3.30915 10.183 3.43999 10.1348 3.56152C9.67546 4.71837 9.20545 6.30021 9.22266 7.93945C9.24023 9.60548 9.76695 11.3749 11.3418 12.7529C14.3667 15.3994 18.279 14.564 20.4336 13.793C20.5576 13.7486 20.6921 13.7748 20.7725 13.8301C20.7912 13.843 20.8014 13.854 20.8066 13.8604C20.8063 13.8624 20.8063 13.865 20.8057 13.8682C19.9461 17.9423 16.3291 21 12 21C7.02944 21 3 16.9706 3 12C3 7.68922 6.03171 4.08426 10.0801 3.20508C10.0814 3.20479 10.0829 3.20432 10.084 3.2041C10.0895 3.20915 10.0986 3.21766 10.1084 3.23242Z" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M13 3.05493C14.7536 3.24878 16.3554 3.94646 17.6573 5" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M18.7083 6C19.9244 7.35878 20.7338 9.08925 20.9451 11" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
};

export const Share = ({ size = 24, color = "black", strokeWidth = 2 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8.59 13.51L15.42 17.49" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15.41 6.51001L8.59 10.49" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export const SpeedControl = ({ size = 24, color = "black", strokeWidth = 2 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 5H8V20" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M13.25 11.3L15.0114 14.5216L16.8011 11.3H18.9773L16.3466 15.6636L19.0227 20.0273H16.858L15.0114 16.8852L13.1818 20.0273H11L13.6591 15.6636L11.0682 11.3H13.25Z" fill={color} />
    </Svg>
  );
};

export const Bell = ({ size = 24, color = "black", strokeWidth = 2 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3.262 16.326C3.13137 16.4692 3.04516 16.6472 3.01386 16.8385C2.98256 17.0298 3.00752 17.226 3.08571 17.4034C3.1639 17.5807 3.29194 17.7316 3.45426 17.8375C3.61658 17.9434 3.80618 17.9999 4 18H20C20.1938 18.0001 20.3834 17.9438 20.5459 17.8381C20.7083 17.7324 20.8365 17.5817 20.9149 17.4045C20.9933 17.2273 21.0185 17.0311 20.9874 16.8398C20.9564 16.6485 20.8704 16.4703 20.74 16.327C19.41 14.956 18 13.499 18 9C18 7.4087 17.3679 5.88258 16.2426 4.75736C15.1174 3.63214 13.5913 3 12 3C10.4087 3 8.88258 3.63214 7.75736 4.75736C6.63214 5.88258 6 7.4087 6 9C6 13.499 4.589 14.956 3.262 16.326Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15 18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
};

export const SinglePodcast = ({ size = 24, color = "black", strokeWidth = 2 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 7C13.6569 7 15 8.34315 15 10V13C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13V10C9 8.34315 10.3431 7 12 7Z" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="12" y1="15" x2="12" y2="20" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="10" y1="20" x2="14" y2="20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M4.51555 17C3.55827 15.5699 3 13.8501 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 13.8401 20.4478 15.5512 19.5 16.9767" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  )
}

export const Podcasts = ({ size = 24, color = "black", strokeWidth = 2 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M13 17C13 16.7348 12.8946 16.4804 12.7071 16.2929C12.5196 16.1054 12.2652 16 12 16C11.7348 16 11.4804 16.1054 11.2929 16.2929C11.1054 16.4804 11 16.7348 11 17L11.5 21.5C11.5 21.6326 11.5527 21.7598 11.6464 21.8536C11.7402 21.9473 11.8674 22 12 22C12.1326 22 12.2598 21.9473 12.3536 21.8536C12.4473 21.7598 12.5 21.6326 12.5 21.5L13 17Z" fill={color} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16.85 18.58C18.4894 17.5312 19.7447 15.9793 20.4276 14.1569C21.1106 12.3345 21.1844 10.3399 20.6381 8.47199C20.0917 6.6041 18.9546 4.96363 17.3972 3.79653C15.8399 2.62943 13.9462 1.9986 12 1.9986C10.0538 1.9986 8.16012 2.62943 6.60275 3.79653C5.04538 4.96363 3.90828 6.6041 3.36193 8.47199C2.81558 10.3399 2.88942 12.3345 3.57237 14.1569C4.25533 15.9793 5.51061 17.5312 7.15 18.58" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 14C7.44287 13.2572 7.1036 12.3738 7.02021 11.449C6.93682 10.5242 7.1126 9.59446 7.52787 8.76393C7.94313 7.9334 8.58147 7.23492 9.37135 6.74675C10.1612 6.25857 11.0714 6 12 6C12.9286 6 13.8388 6.25857 14.6287 6.74675C15.4185 7.23492 16.0569 7.9334 16.4721 8.76393C16.8874 9.59446 17.0632 10.5242 16.9798 11.449C16.8964 12.3738 16.5571 13.2572 16 14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 12C12.5523 12 13 11.5523 13 11C13 10.4477 12.5523 10 12 10C11.4477 10 11 10.4477 11 11C11 11.5523 11.4477 12 12 12Z" fill={color} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export const Library = ({ size = 24, color = "black", strokeWidth = 2 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M16 6L20 20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 6V20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 8V20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4 4V20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export const Home = ({ size = 24, color = "black", strokeWidth = 2, fill = "none" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
      <Path d="M3.18579 9.15771C3.06333 9.42161 2.99993 9.70906 3 9.99999V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21L9 21V13.5C9 12.6716 9.67157 12 10.5 12H13.5C14.3284 12 15 12.6716 15 13.5V21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V9.99999C21.0001 9.70906 20.9367 9.42161 20.8142 9.15771C20.6918 8.8938 20.5132 8.65979 20.291 8.47199L13.291 2.47199C12.93 2.1669 12.4726 1.99951 12 1.99951C11.5274 1.99951 11.07 2.1669 10.709 2.47199L3.709 8.47199C3.4868 8.65979 3.30824 8.8938 3.18579 9.15771Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export const CloseIcon = ({ size = 24, color = "black", strokeWidth = 2 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 6L18 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export const ProfileIcon = ({ size = 24, color = "black", strokeWidth = 2 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" >
      <Mask id="mask0_1720_2504" maskType="alpha" maskUnits="userSpaceOnUse" x="1" y="1" width="22" height="22">
        <Circle cx="12" cy="12" r="10.5" fill="#D9D9D9" stroke="black" />
      </Mask>
      <G mask="url(#mask0_1720_2504)">
        <Circle cx="12" cy="12" r="10.25" stroke={color} strokeWidth={strokeWidth} />
        <Circle cx="12" cy="24" r="10" fill={color} />
        <Circle cx="12" cy="9" r="4" fill={color} />
      </G>
    </Svg>
  );
};

export const Downloaded = ({ size = 24, fill = "black" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM16.5703 9.67285C16.2103 9.26139 15.5843 9.22005 15.1729 9.58008L11.3955 12.8838L9.29297 11.2021C8.86602 10.8608 8.24287 10.9296 7.90137 11.3564C7.56001 11.7834 7.62979 12.4065 8.05664 12.748L10.6631 14.833C11.1205 15.1988 11.7739 15.1843 12.2148 14.7988L16.4766 11.0703C16.888 10.7103 16.9304 10.0843 16.5703 9.67285Z" fill={fill} />
    </Svg>
  )
};

export const Add = ({ size = 24, color = "black", strokeWidth = 2 }) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
      <Path d="M5 12H19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 5V19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export const Follow = ({ size = 24, strokeWidth = 2, color = "black" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={color} strokeWidth={strokeWidth} stroke-linecap="round" strokeLinejoin="round" />
      <Path d="M8 12H16" stroke={color} strokeWidth={strokeWidth} stroke-linecap="round" strokeLinejoin="round" />
      <Path d="M12 8V16" stroke={color} strokeWidth={strokeWidth} stroke-linecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export const Unfollow = ({size=24, color="black", strokeWidth=2}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" >
      <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 12H16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};