import {useState} from "react"

export default function Perfomance() {
    const [student] = useState({
        fullName: "Иванов Пётр Сергеевич"
    });

    const [tasks] = useState([
        {id: 1, name: 'Основы алгоритмизации', maxScore: 10, actualScore: 9, attemptsLeft: 0},
        {id: 2, name: 'ООП', maxScore: 15, actualScore: 14, attemptsLeft: 2},
        {id: 3, name: 'Работа с БД', maxScore: 20, actualScore: 18, attemptsLeft: 1},
        {id: 4, name: 'Веб-разработка', maxScore: 25, actualScore: 22, attemptsLeft: 3},
    ]);

    return (


        <div className="w-full">
            <h1 className="p-6">Журнал студента: {student.fullName}</h1>
            <table className="mx-4 w-full text-sm text-left rtl:text-right">
                <thead className="text-xs uppercase bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Название
                    </th>
                    <th scope="col" className="px-6 py-3">
                        балл
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Ост. попыток
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr className="">
                    <th scope="row" className="px-6 py-4 font-medium">
                        бд
                    </th>
                    <td className="px-6 py-4">
                        50
                    </td>
                    <td className="px-6 py-4">
                        2
                    </td>
                </tr>
                <tr className="">
                    <th scope="row" className="px-6 py-4 font-medium">
                        множество
                    </th>
                    <td className="px-6 py-4">
                        -
                    </td>
                    <td className="px-6 py-4">
                        3
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

    );
}