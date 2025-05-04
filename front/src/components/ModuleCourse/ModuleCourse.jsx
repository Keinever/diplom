import {useState} from "react"
import Lesson from "../Lesson/Lesson.jsx";
import * as React from "react";
import { Video, FlaskConical, ArrowBigLeft, ArrowBigRight } from "lucide-react"
import Task from "../Tasks/Task/Task.jsx";

export default function ModuleCourse() {
    const [lessonIndex, setLessonIndex] = useState(0)
    const data = [
        {icon: <Video />, pass: true},
        {icon: <FlaskConical />, pass: false},
    ]

    function handlePrevOrNext(move) {
        if ((lessonIndex <= 0 && move !== 'next') || (lessonIndex >= data.length - 1 && move !== 'prev')) {return}
        move === 'prev' ? setLessonIndex(lessonIndex - 1) : setLessonIndex(lessonIndex + 1)
    }

    return (
        <div className="w-full">
            <div className="flex z-0 flex-row justify-between px-8 py-3 bg-white border-b-2">
                <div
                    className="content-center cursor-pointer bg-indigo-100 hover:bg-indigo-200 text-blue-700 rounded-2xl"
                >
                    <ArrowBigLeft
                        onClick= {() => handlePrevOrNext('prev')}
                    />
                </div>
                <div className="flex flex-row">
                    {data.map((item, index) => (
                        <div className={`p-2 rounded-xl cursor-pointer
                        ${
                            item.pass
                                ? lessonIndex === index
                                    ? "bg-green-600 text-blue-700"
                                    :"bg-green-400 text-blue-700 hover:bg-green-500"
                                : lessonIndex === index
                                    ? "bg-gradient-to-tr from-indigo-100 to-blue-300 text-blue-700"
                                    : "bg-indigo-100 text-blue-700 hover:bg-indigo-200"
                        }
                        `}
                             onClick={() => setLessonIndex(index)}
                        >
                            {item.icon}
                        </div>
                    ))}
                </div>
                <div
                    className="content-center cursor-pointer bg-indigo-100 hover:bg-indigo-200 text-blue-700 rounded-2xl"
                >
                    <ArrowBigRight
                        onClick= {() => handlePrevOrNext('next')}
                    />
                </div>
            </div>
            {lessonIndex === 0 && <Lesson />}
            {lessonIndex === 1 && <Task />}
        </div>
    )
}