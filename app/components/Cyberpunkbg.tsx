import React from "react";

const CyberpunkBg: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 1024"
        preserveAspectRatio="xMidYMid slice"
        >
        <defs>
            <radialGradient id="glowBlue" cx="30%" cy="30%" r="80%">
                <stop offset="0%" stopColor="#BBFBFF" stopOpacity="1" />
                <stop offset="100%" stopColor="#4E71FF" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="glowPurple" cx="70%" cy="70%" r="80%">
                <stop offset="0%" stopColor="#d8b4fe" stopOpacity="1" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </radialGradient>
        </defs>

        <rect width="100%" height="100%" fill="#a7f3d0" />
        <circle cx="400" cy="300" r="500" fill="url(#glowBlue)" />
        <circle cx="1200" cy="700" r="600" fill="url(#glowPurple)" />
        </svg>
    );
};

export default CyberpunkBg;
