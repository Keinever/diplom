import Video from './video2.mp4'
export default function VideoLesson({video_file}) {
    return (
        <div className="">
            <div
                id="video-lesson"
                className="px-8 w-full"
            >
                <div className="w-full flex flex-col items-center p-4 border-2 rounded-md font-medium">
                    <h3 className="mb-5 pb-0 text-3xl text-center">Видеоурок</h3>
                    <div className="w-5/6 justify-center rounded-xl border-2 m-3 overflow-hidden">
                        <video
                            controls
                            className="h-auto"
                        >
                            <source src={Video} type="video/mp4"/>
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>
        </div>
    )
}