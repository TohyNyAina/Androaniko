import Link from "next/link"

export default function Login () {
    return(
        <div>
            <div className="max-w-lg mx-auto  bg-white dark:bg-gray-800 rounded-lg shadow-md px-8 py-10 flex flex-col items-center">
                <h1 className="text-xl font-bold text-center text-gray-700 dark:text-gray-200 mb-8">Bienvenu sur Androaniko</h1>
                <form action="#" className="w-full flex flex-col gap-4">
                    <div className="flex items-start flex-col justify-start">
                        <label className="text-sm text-gray-700 dark:text-gray-200 mr-2">Nom d' utilisateur:</label>
                        <input type="text" id="username" name="username" className="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>

                    <div className="flex items-start flex-col justify-start">
                        <label className="text-sm text-gray-700 dark:text-gray-200 mr-2">Mot de passe:</label>
                        <input type="password" id="password" name="password" className="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>

                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-sm">Register</button>
                </form>

                <div className="mt-4 text-center">
                    <span className="text-sm text-gray-500 dark:text-gray-300">Vous n'avez pas de compte? </span>
                    <Link href="/register" className="text-blue-500 hover:text-blue-600">S'inscrire</Link>
                </div>
            </div>
        </div>
    )
}