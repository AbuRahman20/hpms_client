import React from "react";
import BrandingSection from "../components/Login/BrandingSection";
import LoginForm from "../components/Login/LoginForm";

function Login() {

    return (
        <div className="min-h-screen w-full bg-linear-to-br from-teal-50 to-white flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                <BrandingSection />
                <LoginForm />
            </div>
        </div>
    );
}
export default Login;