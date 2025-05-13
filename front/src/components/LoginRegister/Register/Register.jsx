import {useState} from "react";
import api, {get_csrf} from "../../../api.js";

export default function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const csrfToken = get_csrf();

            const res = await api.post('api-auth/register/', {
                    email: email,
                    password: password,
                    first_name: firstName,
                    last_name: lastName,
                },
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json'
                    }
                });

            if (res.status === 201) {
                window.location.reload()
            }
        } catch (error) {
            console.log(error)
            setPassword("")
            setPassword2("")
        }
    }
    return (
        <div className="flex justify-center my-5">
            <form onSubmit={handleSubmit} className="form-container flex flex-col justify-between">
                <div>
                    <div className="flex flex-col mb-4">
                        <label
                            htmlFor="name"
                            className="text-gray-500 font-light text-xs"
                        >
                            First Name
                        </label>
                        <input
                            className="form-input border-2 rounded-lg p-1"
                            type="name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />

                    </div>
                    <div className="flex flex-col mb-4">
                        <label
                            htmlFor="lastname"
                            className="text-gray-500 font-light text-xs"
                        >
                            Last Name
                        </label>
                        <input
                            className="form-input border-2 rounded-lg p-1"
                            type="lastname"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />

                    </div>
                    <div className="flex flex-col mb-4">
                        <label
                            htmlFor="email"
                            className="text-gray-500 font-light text-xs"
                        >
                            E-mail
                        </label>
                        <input
                            className="form-input border-2 rounded-lg p-1"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                    </div>
                    <div className="flex flex-col mb-4">
                        <label
                            htmlFor="password"
                            className="text-gray-500 font-light text-xs"
                        >
                            Пароль
                        </label>
                        <input
                            className="form-input border-2 rounded-lg p-1"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                    </div>
                    <div className="flex flex-col mb-4">
                        <label
                            htmlFor="password"
                            className={`
                            font-light text-xs 
                            ${!password2
                                ? "text-gray-500"
                                : password !== password2 ? "text-red-700" : "text-green-700"}
                            `}
                        >
                            {!password2
                                ? "Пароль ещё раз"
                                : password !== password2 ? "Пароли не совпадают" : "Пароли совпадают"}
                        </label>
                        <input
                            className="form-input border-2 rounded-lg p-1"
                            type="password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                        />

                    </div>
                </div>
                <button
                    className="form-button h-10 border-2 mt-5 rounded-lg bg-gradient-to-tr
                    from-blue-400 to-blue-700
                    text-white"
                    type="submit"
                    disabled={password !== password2}
                >
                    Зарегистрироваться
                </button>
            </form>
        </div>
    )
}