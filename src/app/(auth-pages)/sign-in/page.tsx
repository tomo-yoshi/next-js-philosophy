
const SignInForm: React.FC = () => {

    return (
        <form>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    className="border"
                    type="email"
                    id="email"
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    className="border"
                    type="password"
                    id="password"
                    required
                />
            </div>
            <button
                className="bg-blue-800 text-white px-2 py-1"
                type="submit"
                formAction={''}
            >
                Sign In
            </button>
        </form>
    );
};

export default SignInForm;