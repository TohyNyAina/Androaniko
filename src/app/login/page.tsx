import Link from "next/link"

export default function Login () {
    return(
        <div>
            <h1>Login</h1>
            <Link href="/register">Register</Link>
            <Link href="/welcome">Welcome</Link>
        </div>
    )
}