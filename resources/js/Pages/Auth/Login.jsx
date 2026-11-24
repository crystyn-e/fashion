import { Link, useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Logo Section */}
                    <div className="px-8 pt-8 pb-6 text-center">
                        <div className="flex justify-center mb-4">
                            <img
                                src="/images/logo-boesafashion.jpg"
                                alt="Logo Boesa Fashion"
                                className="w-20 h-20 object-contain rounded-xl"
                            />
                        </div>
                        {/* <h2 className="text-2xl font-light text-gray-800">
                            BOESA FASHION
                        </h2> */}
                        <p className="mt-2 text-sm text-gray-400">
                            Silakan login untuk mengakses dashboard
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="mx-8 mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                            {status}
                        </div>
                    )}

                    {/* Login Form */}
                    <form className="px-8 pb-8 space-y-6" onSubmit={submit}>
                        <div className="space-y-4">
                            {/* Username Field */}
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={data.username}
                                    className="appearance-none relative block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all duration-300"
                                    placeholder="Masukkan username"
                                    autoComplete="username"
                                    onChange={(e) =>
                                        setData("username", e.target.value)
                                    }
                                />
                                {errors.username && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="appearance-none relative block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all duration-300"
                                    placeholder="Masukkan password"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    className="h-4 w-4 text-[#C5A059] focus:ring-[#C5A059] border-gray-300 rounded"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                <label
                                    htmlFor="remember"
                                    className="ml-2 block text-sm text-gray-600"
                                >
                                    Ingat saya
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-[#0A192F] hover:bg-[#1E2F4A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C5A059] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? "Memproses..." : "MASUK"}
                        </button>
                    </form>

                    {/* Back to Home Link */}
                    <div className="px-8 pb-8 text-center border-t border-gray-100 pt-6">
                        <Link
                            href="/"
                            className="text-sm text-gray-400 hover:text-[#C5A059] transition-colors"
                        >
                            ← Kembali ke Beranda
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    © {new Date().getFullYear()} Boesa Fashion. All rights
                    reserved.
                </p>
            </div>
        </div>
    );
}
