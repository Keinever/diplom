import * as React from 'react'
import VideoLesson from "./VideoLesson.jsx";
import Presentation from "./Presentation.jsx";

export default function Lesson() {
    const [tabValue, setTabValue] = React.useState(1);

    return (
        <div className="w-full">
            <div className="w-full flex flex-row justify-center px-8">
                <div className={`p-2 rounded-xl cursor-pointer
                ${
                    tabValue === 1
                        ? "bg-gradient-to-tr from-indigo-100 to-blue-300 text-blue-700"
                        : "bg-indigo-50 text-blue-700 hover:bg-indigo-100"
                    }
                `}
                onClick={() => setTabValue(1)}
                >
                    Видеоурок
                </div>
                <div className={`p-2 rounded-xl cursor-pointer
                ${
                    tabValue === 2
                        ? "bg-gradient-to-tr from-indigo-100 to-blue-300 text-blue-700"
                        : "bg-indigo-50 text-blue-700 hover:bg-indigo-100"
                }
                `}
                onClick={() => setTabValue(2)}
                >
                    Презентация
                </div>
            </div>
            {tabValue === 1 && <VideoLesson />}
            {tabValue === 2 && <Presentation />}
        </div>
    )
}