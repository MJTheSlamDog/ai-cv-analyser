import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
    { title: "Resumind | Review" },
    { name: "description", content: "Detailed analysis of your resume" },
];

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();

    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [resumeUrl, setResumeUrl] = useState("");
    const [feedback, setFeedback] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
      // Check if user is unauthenticated and currently on the root path
        if (!isLoading && !auth.isAuthenticated)navigate(`/auth?next=/resume/${id}`);
    }, [isLoading]);

    useEffect(() => {
        const loadResume = async () => {
        const resume = await kv.get(`resume:${id}`);
        if (!resume) return;

        const data = JSON.parse(resume);

        // Load PDF blob
        const resumeBlob = await fs.read(data.resumePath);
        if (!resumeBlob) return;

        const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setResumeUrl(pdfUrl);

        // Load image blobs (multiple pages supported)
        const urls: string[] = [];
        if (Array.isArray(data.imagePaths)) {
            for (const path of data.imagePaths) {
            const blob = await fs.read(path);
            if (blob) {
                urls.push(URL.createObjectURL(blob));
            }
            }
        }
        setImageUrls(urls);

        setFeedback(data.feedback || "");
        console.log({ pdfUrl, imageUrls: urls, feedback: data.feedback });
        };

        loadResume();
    }, [id]);

    return (
        <main className="!pt-0">
        <nav className="resume-nav">
            <Link to="/" className="back-button">
            <img
                src="/icons/back.svg"
                alt="logo"
                className="w-2.5 h-2.5"
            />
            <span className="text-gray-800 text-sm font-semibold">Home</span>
            </Link>
        </nav>

        <div className="flex flex-row w-full max-lg:flex-col-reverse">
            <section className="feedback-section br-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
            {imageUrls.length > 0 && resumeUrl && (
                <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit overflow-auto p-2">
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                    {imageUrls.map((url, idx) => (
                    <img
                        key={idx}
                        src={url}
                        className="w-full h-full object-contain rounded-2xl mb-4"
                        title={`resume-page-${idx + 1}`}
                    />
                    ))}
                </a>
                </div>
            )}
            </section>

            <section className="feedback-section">
                <h2 className="text-4xl !text-black font-bold">Resume Review</h2>

                {feedback ? (
                    <div className="flex flex-col gap-6 animate-in fade-in duration-1000 mt-6">
                        Summary ATS Details
                    </div>
                ): (
                    <img src="/images/resume-scan-2.gif" className="w-full" />
                )}
            </section>
        </div>
        </main>
    );
};

export default Resume;
