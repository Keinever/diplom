import LoginRegister from "../../components/LoginRegister/LoginRegister.jsx";

export default function LoginRegisterPage () {
    return (
        <div className="min-h-full bg-fixed">
            <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-tr from-indigo-100 to-blue-300 bg-fixed">
                <LoginRegister />
            </div>
        </div>
    )
}