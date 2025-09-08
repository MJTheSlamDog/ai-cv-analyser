import React from 'react'
import ScoreGauge from './ScoreGauge'

const Category = ({ title, score }: { title: string, score: number}) => {
    return (
        <div className="resume-summary">
            {title} - {score}
        </div>
    );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md w-full">
            <div className="flex flex-row items-center p-4 gap-8">
                <ScoreGauge score={feedback.overallScore} />
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold">Resume Score</h2>
                    <p className="text-sm text-gray-500">This score was calculated based on the variables listed below.</p>
                </div>
            </div>

        <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
        </div>
    )
}

export default Summary