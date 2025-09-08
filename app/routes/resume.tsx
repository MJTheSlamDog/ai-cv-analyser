import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
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
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate(`/auth?next=/resume/${id}`);
        }
    }, [isLoading, auth, navigate, id]);

    useEffect(() => {
        const loadResume = async () => {
            try {
                const resume = await kv.get(`resume:${id}`);
                if (!resume) {
                    setError("No resume data found.");
                    return;
                }

                let data;
                try {
                    data = JSON.parse(resume);
                } catch (err) {
                    console.error("❌ Failed to parse resume JSON:", err);
                    setError("Resume data is corrupted.");
                    return;
                }

                // Load PDF blob
                try {
                    const resumeBlob = await fs.read(data.resumePath);
                    if (resumeBlob) {
                        const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
                        setResumeUrl(URL.createObjectURL(pdfBlob));
                    } else {
                        setError("Failed to load resume PDF file.");
                    }
                } catch (err) {
                    console.error("❌ Error reading resume PDF:", err);
                    setError("Error reading resume PDF.");
                }

                // Load image blobs (multiple pages supported)
                const urls: string[] = [];
                if (Array.isArray(data.imagePaths)) {
                    for (const path of data.imagePaths) {
                        try {
                            const blob = await fs.read(path);
                            if (blob) {
                                urls.push(URL.createObjectURL(blob));
                            }
                        } catch (err) {
                            console.error(`❌ Error reading image at ${path}:`, err);
                        }
                    }
                }
                setImageUrls(urls);

                setFeedback(data.feedback || "");
                console.log({ resumeUrl, imageUrls: urls, feedback: data.feedback });
            } catch (err) {
                console.error("❌ Error loading resume:", err);
                setError("Something went wrong while loading your resume.");
            }
        };

        loadResume();
    }, [id, fs, kv]);

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
                    {error && (
                        <div className="text-red-600 font-semibold">{error}</div>
                    )}
                    {imageUrls.length > 0 && resumeUrl && !error && (
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
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestion={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />

                        </div>
                    ) : (
                        !error && (
                            <img src="/images/resume-scan-2.gif" className="w-full" />
                        )
                    )}
                </section>
            </div>
        </main>
    );
};

export default Resume;