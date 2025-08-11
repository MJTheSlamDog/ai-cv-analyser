import { useLocation, useNavigate } from 'react-router'
import { usePuterStore } from '~/lib/puter'
import { useEffect } from "react";
import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart Feedback for your dream job" },
  ];
}

export default function Home() {

    const { auth } = usePuterStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if(!auth.isAuthenticated && location.pathname !== '/auth') navigate('/auth?next=/');
    }, [auth.isAuthenticated, location.pathname]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track your application & Resume Ratings</h1>
          <h2>Review your submissions and check AI-powered feedback</h2>
        </div>
      

        {resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </section>
      
    </main>
  );
}