import React, { useState, useEffect } from 'react'
import { Moon, Sun, Zap, Eye, EyeClosed } from 'lucide-react'

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <section className="fixed inset-0 h-screen bg-[#EEF2F5] dark:bg-slate-900 flex flex-row items-center justify-center transition-colors duration-300">
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-xl transition-all duration-300 hover:bg-gray-200/50 dark:hover:bg-slate-800 absolute top-5 right-5 z-10"
            >
                {darkMode ? (
                    <Moon className="w-5 h-5 text-blue-400 animate-in fade-in zoom-in duration-300" />
                ) : (
                    <Sun className="w-5 h-5 text-yellow-500 animate-in fade-in zoom-in duration-300" />
                )}
            </button>

            <div className="flex flex-col justify-center items-center gap-4 max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 p-8 py-16 shadow-sm md:shadow-xl space-y-10 transition-colors duration-300">
                <div className="flex items-center justify-center flex-col space-y-2">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Zap className="w-8 h-8 text-white"/>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Inventory System</h1>
                    <small className="text-slate-500 dark:text-slate-400 text-sm">Enter your details to login</small>
                </div>

                <form className="w-full flex flex-col gap-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            placeholder="name@company.com"
                            className="w-full text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-lg border outline-none border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="password" className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Password</label>
                        <div className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••"
                                required
                                className="flex-1 bg-transparent text-slate-700 dark:text-slate-200 outline-none" 
                            />
                            <button 
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                {showPassword ? <Eye className="w-5 h-5" /> : <EyeClosed className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full text-white font-bold rounded-lg p-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] mt-2"
                    >
                        Login
                    </button>
                </form>
            </div>
        </section>
    )
}

export default Login