import {useState} from "react";
import api, {get_csrf} from "../../../api.js";
import {useNavigate} from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const csrfToken = get_csrf();

            const res = await api.post('api-auth/login/', {email: email, password: password}, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json'
                }
            });
            if (res.status === 200) {
                navigate('/courses')
            }
        } catch (error) {
            console.log(error);
            setPassword("");
        }
    }
    return (
        <div className="flex justify-center my-5">
            <form onSubmit={handleSubmit} className="form-container flex flex-col justify-between">
                <div>
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
                </div>
                <button
                    className="form-button border-2 h-10 mt-5 rounded-lg bg-gradient-to-tr
                    from-blue-400 to-blue-700
                    text-white"
                    type="submit"
                >
                    Войти
                </button>
            </form>
        </div>
    )
}