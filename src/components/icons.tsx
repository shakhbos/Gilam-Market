import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
}

export const LikeIcons = ({ stroke, fill = 'none', width = 20, height = 20, className, ...props }: IconProps & { stroke?: string }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill={fill} xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
            <path d="M16.2501 10.4766L10.0001 16.6666L3.75009 10.4766C3.33784 10.0754 3.01312 9.59325 2.79638 9.06043C2.57963 8.52762 2.47556 7.9557 2.4907 7.38068C2.50585 6.80567 2.63989 6.24002 2.88439 5.71935C3.12888 5.19868 3.47853 4.73428 3.91133 4.35539C4.34412 3.97649 4.85068 3.69131 5.3991 3.5178C5.94752 3.3443 6.52593 3.28622 7.09789 3.34724C7.66986 3.40825 8.223 3.58703 8.72248 3.87233C9.22196 4.15762 9.65696 4.54324 10.0001 5.0049C10.3447 4.54659 10.7802 4.16434 11.2793 3.88207C11.7785 3.59981 12.3305 3.42361 12.9009 3.3645C13.4712 3.3054 14.0477 3.36465 14.5941 3.53856C15.1405 3.71247 15.6451 3.9973 16.0764 4.37521C16.5077 4.75311 16.8563 5.21597 17.1004 5.73481C17.3446 6.25365 17.479 6.81731 17.4953 7.39049C17.5117 7.96368 17.4095 8.53406 17.1952 9.06594C16.9809 9.59783 16.6592 10.0798 16.2501 10.4816" stroke={stroke || "black"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    )
}

export const BusketIcons = ({ width = 20, height = 20, stroke = "black", className, ...props }: IconProps & { stroke?: string }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
            <path d="M4.99992 14.1667C4.07944 14.1667 3.33325 14.9129 3.33325 15.8333C3.33325 16.7538 4.07944 17.5 4.99992 17.5C5.92039 17.5 6.66659 16.7538 6.66659 15.8333C6.66659 14.9129 5.92039 14.1667 4.99992 14.1667ZM4.99992 14.1667H14.1666M4.99992 14.1667V2.5H3.33325M14.1666 14.1667C13.2461 14.1667 12.4999 14.9129 12.4999 15.8333C12.4999 16.7538 13.2461 17.5 14.1666 17.5C15.0871 17.5 15.8333 16.7538 15.8333 15.8333C15.8333 14.9129 15.0871 14.1667 14.1666 14.1667ZM4.99992 4.16667L16.6666 5L15.8333 10.8333H4.99992" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>



    )
}
export const BackIcons = ({ width = 24, height = 24, className, ...props }: IconProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/4000/svg" className={className} {...props}>
            <path d="M15 6L9 12L15 18" stroke="black" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}
export const HomeIcons = ({ width = 20, height = 20, stroke = "black", className, ...props }: IconProps & { stroke?: string }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 17.5V12.5C7.5 12.058 7.67559 11.634 7.98816 11.3215C8.30072 11.0089 8.72464 10.8333 9.16667 10.8333H10.8333C11.2754 10.8333 11.6993 11.0089 12.0118 11.3215C12.3244 11.634 12.5 12.058 12.5 12.5V17.5M4.16667 10H2.5L10 2.5L17.5 10H15.8333V15.8333C15.8333 16.2754 15.6577 16.6993 15.3452 17.0118C15.0326 17.3244 14.6087 17.5 14.1667 17.5H5.83333C5.39131 17.5 4.96738 17.3244 4.65482 17.0118C4.34226 16.6993 4.16667 16.2754 4.16667 15.8333V10Z" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    )
}
export const PersonIcons = ({ width = 20, height = 20, stroke = "black", className, ...props }: IconProps & { stroke?: string }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
            <path d="M5 17.5V15.8333C5 14.9493 5.35119 14.1014 5.97631 13.4763C6.60143 12.8512 7.44928 12.5 8.33333 12.5H11.6667C12.5507 12.5 13.3986 12.8512 14.0237 13.4763C14.6488 14.1014 15 14.9493 15 15.8333V17.5M13.3333 5.83333C13.3333 7.67428 11.8409 9.16667 10 9.16667C8.15905 9.16667 6.66667 7.67428 6.66667 5.83333C6.66667 3.99238 8.15905 2.5 10 2.5C11.8409 2.5 13.3333 3.99238 13.3333 5.83333Z" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    )
}

export const BurgerIcons = ({ width = 20, height = 20, stroke = "black", className, ...props }: IconProps & { stroke?: string }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/4000/svg" className={className} {...props}>
            <path d="M3.33331 6.66669H16.6666M3.33331 13.3334H16.6666" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}
export const SearchIcons = ({ width = 20, height = 20, className, ...props }: IconProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
            <path d="M17.5 17.5L12.5 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>


    )
}
export const TelIcons = ({ width = 20, height = 20, className, ...props }: IconProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
            <path d="M4.16667 3.33337H7.5L9.16667 7.50004L7.08333 8.75004C7.9758 10.5596 9.44039 12.0242 11.25 12.9167L12.5 10.8334L16.6667 12.5V15.8334C16.6667 16.2754 16.4911 16.6993 16.1785 17.0119C15.866 17.3244 15.442 17.5 15 17.5C11.7494 17.3025 8.68346 15.9221 6.38069 13.6194C4.07792 11.3166 2.69754 8.25065 2.5 5.00004C2.5 4.55801 2.67559 4.13409 2.98816 3.82153C3.30072 3.50897 3.72464 3.33337 4.16667 3.33337Z" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    )
}
export const BackPlusIcons = ({ width = 20, height = 20, className, ...props }: IconProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/4000/svg" className={className} {...props}>
            <path d="M4.99992 14.1667C4.07944 14.1667 3.33325 14.9129 3.33325 15.8333C3.33325 16.7538 4.07944 17.5 4.99992 17.5C5.92039 17.5 6.66659 16.7538 6.66659 15.8333C6.66659 14.9129 5.92039 14.1667 4.99992 14.1667ZM4.99992 14.1667H14.1666M4.99992 14.1667V2.5H3.33325M14.1666 14.1667C13.2461 14.1667 12.4999 14.9129 12.4999 15.8333C12.4999 16.7538 13.2461 17.5 14.1666 17.5C15.0871 17.5 15.8333 16.7538 15.8333 15.8333C15.8333 14.9129 15.0871 14.1667 14.1666 14.1667ZM4.99992 4.16667L10.0041 4.52417M15.9524 10.0017L15.8333 10.8333H4.99992M12.4999 5H17.4999M14.9999 2.5V7.5" stroke="white" strokeWidth="1.4" />
        </svg>
    )
}
export const ShareIcons = ({ width = 22, height = 22, className, ...props }: IconProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/4000/svg" className={className} {...props}>
            <path d="M7.25001 8.91666L12.75 6.08332M7.25001 11.0834L12.75 13.9167M7.5 10C7.5 11.3807 6.38071 12.5 5 12.5C3.61929 12.5 2.5 11.3807 2.5 10C2.5 8.61929 3.61929 7.5 5 7.5C6.38071 7.5 7.5 8.61929 7.5 10ZM17.5 5C17.5 6.38071 16.3807 7.5 15 7.5C13.6193 7.5 12.5 6.38071 12.5 5C12.5 3.61929 13.6193 2.5 15 2.5C16.3807 2.5 17.5 3.61929 17.5 5ZM17.5 15C17.5 16.3807 16.3807 17.5 15 17.5C13.6193 17.5 12.5 16.3807 12.5 15C12.5 13.6193 13.6193 12.5 15 12.5C16.3807 12.5 17.5 13.6193 17.5 15Z" stroke="#121212" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    )
}
export const PlusIcons = ({ width = 20, height = 20, className, ...props }: IconProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/4000/svg" className={className} {...props}>
            <path d="M10.0003 4.16667V15.8333M4.16699 10H15.8337" stroke="black" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    )
}

export const MinutIcons = ({ width = 20, height = 20, className, ...props }: IconProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/4000/svg" className={className} {...props}>
            <path d="M4.16699 10H15.8337" stroke="black" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>


    )
}
export const RoundedIcons = ({ width = 20, height = 20, className, ...props }: IconProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/4000/svg" className={className} {...props}>
            <g filter="url(#filter0_i_479_5996)">
                <circle cx="10" cy="10" r="10" fill="white" />
            </g>
            <circle cx="10" cy="10" r="9" stroke="black" strokeWidth="2" />
            <defs>
                <filter id="filter0_i_479_5996" x="0" y="0" width="20" height="22" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="2" />
                    <feGaussianBlur stdDeviation="1" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_479_5996" />
                </filter>
            </defs>
        </svg>
    )
}
export const SomeThingIcons = ({ width = 29, height = 34, className, ...props }: IconProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 29 34" fill="none" xmlns="http://www.w3.org/4000/svg" className={className} {...props}>
            <path d="M26.6151 32.9657C26.8723 33.4545 27.477 33.6421 27.9657 33.3849C28.4545 33.1277 28.6421 32.523 28.3849 32.0343L26.6151 32.9657ZM16.2446 11.1147L15.3597 11.5804L16.2446 11.1147ZM2.83312 7.16513L14.3599 11.0074L14.9924 9.11004L3.46557 5.26777L2.83312 7.16513ZM15.3597 11.5804L26.6151 32.9657L28.3849 32.0343L17.1295 10.649L15.3597 11.5804ZM5.38703 4.00571L3.00376 31.4134L4.99624 31.5866L7.37952 4.17897L5.38703 4.00571ZM12.4417 12.1788C12.6475 10.6005 14.692 10.3119 15.3597 11.5804L17.1295 10.649C15.4793 7.51359 10.8963 8.56365 10.4585 11.9202L12.4417 12.1788ZM14.1834 13.8435C13.2161 14.037 12.3088 13.1973 12.4417 12.1788L10.4585 11.9202C10.1538 14.2563 12.2255 16.2747 14.5756 15.8047L14.1834 13.8435ZM14.3599 11.0074C15.7901 11.4841 15.6616 13.5479 14.1834 13.8435L14.5756 15.8047C18.0649 15.1068 18.3682 10.2353 14.9924 9.11004L14.3599 11.0074ZM2.86049 2.87759C3.81117 1.86353 5.50745 2.62093 5.38703 4.00571L7.37952 4.17897C7.66443 0.902418 3.65084 -0.889673 1.40141 1.50971L2.86049 2.87759ZM3.46557 5.26777C2.45259 4.9301 2.13019 3.65658 2.86049 2.87759L1.40141 1.50971C-0.326556 3.35288 0.436281 6.36619 2.83312 7.16513L3.46557 5.26777Z" fill="black" />
        </svg>
    )
}
export const EditIcons = ({ width = 24, height = 24, className, ...props }: IconProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/4000/svg" className={className} {...props}>
            <path d="M7 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V17M16 5L19 8M20.385 6.585C20.7788 6.19115 21.0001 5.65698 21.0001 5.1C21.0001 4.54302 20.7788 4.00885 20.385 3.615C19.9912 3.22115 19.457 2.99989 18.9 2.99989C18.343 2.99989 17.8088 3.22115 17.415 3.615L9 12V15H12L20.385 6.585Z" stroke="black" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    )
}

export const CloseIcons = ({ width, height, className = "w-3 h-3", ...props }: IconProps) => {
    return (
        <svg width={width} height={height} className={className} aria-hidden="true" xmlns="http://www.w3.org/4000/svg" fill="none" viewBox="0 0 14 14" {...props}>
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
    )
}

export const FilterIcons = ({ width = 20, height = 20, stroke = "black", className, ...props }: IconProps & { stroke?: string }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 3.33337H17.5M9.16667 13.3334H14.1667M10.8333 16.6667H7.5M15 6.66671H3.33333M16.6667 10H6.66667" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    )
}

export const LoginIcons = ({ width = 20, height = 20, stroke = "black", className, ...props }: IconProps & { stroke?: string }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
            <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.3333 14.1667L17.5 10L13.3333 5.83334" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17.5 10H7.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}
