export default function Presentation() {
    return (
        <div className="pt-5">
            <div
                id="description"
                className="px-8"
            >
                <div className="p-4 border-2 rounded-md font-medium text-center">
                    <h3 className="mb-5 pb-0 text-3xl text-center">Презентация</h3>
                    <a href={Pdf}
                       without rel="noopener noreferrer"
                       target="_blank"
                       className="mb-5 text-blue-500 text-xl"
                    >
                        <button
                            className="hover:bg-indigo-50 hover:text-blue-700 border-2 p-3 rounded-md"
                        >
                            Посмотреть презентацию
                        </button>
                    </a>
                </div>
            </div>
        </div>
    )
}