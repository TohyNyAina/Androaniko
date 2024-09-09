import Image from "next/image";
import { Html, Head, Main, NextScript } from "next/document";
import Login from "./login/page";

export default function Home() {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <meta name="theme-color" content="#000000"/>
      </head>
      <body>
        <div>
          <Login/>
        </div>
      </body>
    </html>
  );
}
