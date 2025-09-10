import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

interface ResumeCardProps {
    resume: {
        id: string;
        companyName?: string;
        jobTitle?: string;
        feedback?: { overallScore?: number };
        imagePaths?: string[];
    };
}

const ResumeCard = ({ resume }: ResumeCardProps) => {
    const { id, companyName, jobTitle, feedback, imagePaths } = resume;
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState("");

    useEffect(() => {
        const loadResume = async () => {
        if (!imagePaths || imagePaths.length === 0) {
            console.warn("No imagePaths found for resume", id);
            return;
        }

        try {
            const blob = await fs.read(imagePaths[0]); // first page preview
            if (!blob) return;
            setResumeUrl(URL.createObjectURL(blob));
        } catch (err) {
            console.error("Error reading resume image:", err);
        }
        };

        loadResume();
    }, [fs, imagePaths, id]);

    return (
        <Link
        to={`/resume/${id}`}
        className="resume-card animate-in fade-in duration-1000"
        >
        <div className="resume-card-header">
            <div className="flex flex-col gap-2">
            {companyName && (
                <h2 className="!text-black font-bold break-words">{companyName}</h2>
            )}
            {jobTitle && (
                <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
            )}
            {!companyName && !jobTitle && (
                <h2 className="!text-black font-bold">Resume</h2>
            )}
            </div>
            <div className="flex-shrink-0">
            <ScoreCircle score={feedback?.overallScore || 0} />
            </div>
        </div>

        {resumeUrl && (
            <div className="gradient-border animate-in fade-in duration-1000">
            <div className="w-full h-full">
                <img
                src={resumeUrl}
                alt="resume preview"
                className="w-full h-[350px] max-sm:h-[200px] object-cover object-top rounded-md"
                />
            </div>
            </div>
        )}
        </Link>
    );
};

export default ResumeCard;
