import Pdf from '../A_A_Fardzinov_review_2.pdf'

export default function DescriptionTask({ description, instraction_file}) {
    return (
        <div className="pt-5">
            <div
                id="description"
                className="px-8"
            >
                <div className="p-4 border-2 rounded-md font-medium">
                    <h3 className="mb-5 pb-0 text-3xl text-center">Инструкции</h3>
                    <div className="border-2 mb-5 p-3 rounded-md">
                        <p className="text-lg text-balance">{description}</p>
                    </div>
                    <a href={Pdf}
                       without rel="noopener noreferrer"
                       target="_blank"
                       className="mb-5 text-blue-500 text-xl"
                    >
                        <button
                            className="hover:bg-indigo-50 hover:text-blue-700 border-2 p-3 rounded-md"
                        >
                            Файл с инструкциями
                        </button>
                    </a>
                </div>
            </div>
        </div>
    )
}