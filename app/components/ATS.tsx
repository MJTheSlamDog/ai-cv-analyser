import React from "react";

interface Tip {
    type: "good" | "improve";
    tip: string;
}

interface ATSProps {
    score: number;
    suggestion: Tip[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestion }) => {
    let gradientClass = "";
    let icon = "";
    if (score > 74) {
        gradientClass = "from-green-100 to-white";
        icon = "/icons/ats-good.svg";
    } else if (score > 64) {
        gradientClass = "from-yellow-100 to-white";
        icon = "/icons/ats-warning.svg";
    } else {
        gradientClass = "from-red-100 to-white";
        icon = "/icons/ats-bad.svg";
    }

    return (
        <div
        className={`rounded-2xl shadow-md p-6 bg-gradient-to-b ${gradientClass}`}
        >
        <div className="flex items-center gap-4 mb-6">
            <img src={icon} alt="ATS status" className="w-12 h-12" />
            <h2 className="text-2xl font-bold text-gray-800">
            ATS Score – {score}/100
            </h2>
        </div>

        <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Resume Insights</h3>
            <p className="text-sm text-gray-600 mt-1">
            Here’s how your resume measures up according to ATS standards and
            where you can improve:
            </p>
        </div>

        {/* Suggestions */}
        <ul className="space-y-3 mb-6">
            {suggestion.map((s, index) => (
            <li key={index} className="flex items-start gap-2">
                <img
                src={s.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt={s.type}
                className="w-5 h-5 mt-0.5"
                />
                <p
                className={`text-sm ${
                    s.type === "good" ? "text-green-700" : "text-yellow-700"
                }`}
                >
                {s.tip}
                </p>
            </li>
            ))}
        </ul>

        <p className="text-sm text-gray-700 font-medium">
            Keep refining your resume to maximize your chances of landing your dream
            job 🚀
        </p>
        </div>
    );
};

export default ATS;
