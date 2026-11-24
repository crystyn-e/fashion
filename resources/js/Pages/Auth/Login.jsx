import { Link, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";

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
        <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-4 py-8 sm:px-6">
            <div className="w-full max-w-5xl">
                <main className="grid overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_24px_70px_-35px_rgba(10,25,47,0.3)] md:min-h-[600px] md:grid-cols-2">
                    <section className="flex flex-col justify-between bg-[#F8FAFD] px-6 py-6 sm:px-10 sm:py-8 md:px-10 lg:px-14">
                        <Link
                            href="/"
                            className="inline-flex w-fit items-center gap-3"
                        >
                            <img
                                src="/images/logo-boesafashion.jpg"
                                alt="Logo Boesa Fashion"
                                className="h-11 w-11 rounded-lg object-cover"
                            />
                            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0A192F]">
                                Boesa{" "}
                                <span className="text-[#A98039]">Fashion</span>
                            </span>
                        </Link>

                        <div className="flex flex-1 items-center justify-center py-5 md:py-8">
                            <img
                                src="/images/login.svg"
                                alt="Ilustrasi keamanan login"
                                className="max-h-[220px] w-full max-w-[390px] object-contain sm:max-h-[300px] md:max-h-[390px]"
                            />
                        </div>

                        <div className="hidden border-t border-[#0A192F]/10 pt-5 md:block">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A98039]">
                                Boesa Fashion · Medan
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                Portal pengelolaan staff dan admin.
                            </p>
                        </div>
                    </section>

                    <section className="flex items-center px-6 py-8 sm:px-10 sm:py-10 lg:px-14">
                        <div className="mx-auto w-full max-w-md">
                            <div className="mb-8">
                                <p className="text-sm font-medium text-[#A98039]">
                                    Selamat datang
                                </p>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0A192F]">
                                    Masuk ke akun
                                </h1>
                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Gunakan username dan password untuk
                                    melanjutkan.
                                </p>
                            </div>

                            {status && (
                                <div
                                    role="status"
                                    className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                                >
                                    {status}
                                </div>
                            )}

                            <form className="space-y-5" onSubmit={submit}>
                                <div>
                                    <label
                                        htmlFor="username"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Username
                                    </label>
                                    <div className="relative">
                                        <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                        <input
                                            id="username"
                                            type="text"
                                            name="username"
                                            value={data.username}
                                            aria-invalid={Boolean(
                                                errors.username,
                                            )}
                                            aria-describedby={
                                                errors.username
                                                    ? "username-error"
                                                    : undefined
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20"
                                            placeholder="Masukkan username"
                                            autoComplete="username"
                                            onChange={(e) =>
                                                setData(
                                                    "username",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    {errors.username && (
                                        <p
                                            id="username-error"
                                            className="mt-2 text-sm text-red-600"
                                        >
                                            {errors.username}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <LockClosedIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            aria-invalid={Boolean(
                                                errors.password,
                                            )}
                                            aria-describedby={
                                                errors.password
                                                    ? "password-error"
                                                    : undefined
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20"
                                            placeholder="Masukkan password"
                                            autoComplete="current-password"
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    {errors.password && (
                                        <p
                                            id="password-error"
                                            className="mt-2 text-sm text-red-600"
                                        >
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                                    <input
                                        id="remember"
                                        name="remember"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 accent-[#C5A059] focus:ring-[#C5A059]"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    Ingat saya
                                </label>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-lg bg-[#0A192F] px-4 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#172B49] focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? "Memproses..." : "MASUK"}
                                </button>
                            </form>

                            <div className="mt-7 border-t border-gray-100 pt-5 text-center">
                                <Link
                                    href="/"
                                    className="text-sm text-gray-500 transition hover:text-[#A98039]"
                                >
                                    ← Kembali ke Beranda
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                <p className="mt-5 text-center text-xs text-gray-400">
                    © {new Date().getFullYear()} Boesa Fashion. All rights
                    reserved.
                </p>
            </div>
        </div>
    );
}
