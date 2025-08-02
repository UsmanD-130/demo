import { toast } from "react-toastify";

const Login = () => {

    const handleSubmit= () => {
        console.log("Hello")
    }
    return (
        <div>
            Login Page

            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="name">
                        Enter your name : 
                    </label>
                    <input type="text" />
                </div>
            </form>
        </div>
    )
}

export default Login;