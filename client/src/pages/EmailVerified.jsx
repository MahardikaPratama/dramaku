import React from "react";

const EmailVerified = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="flex flex-col w-full max-w-lg bg-gray-800 rounded-lg shadow-lg md:flex-row md:max-w-4xl">
                {/* Konten Verifikasi Berhasil */}
                <div className="w-full p-6 md:w-1/2 md:px-8 lg:px-12">
                    <h2 className="mb-4 text-xl font-bold text-center text-white">
                        Verifikasi Berhasil
                    </h2>
                    <p className="mb-4 text-sm text-center text-gray-300">
                        Terima kasih! Email Anda telah berhasil diverifikasi. Anda sekarang dapat menggunakan akun Anda.
                    </p>
                    <div className="mb-3">
                        <a
                            href="/login"
                            className="block w-full p-2 text-sm font-semibold text-center text-white transition bg-orange-600 rounded-lg hover:bg-orange-700"
                        >
                            Lanjutkan ke Login
                        </a>
                    </div>
                </div>

                {/* Ilustrasi Gambar */}
                <div className="hidden w-full p-6 md:block md:w-1/2">
                    <img
                        src="https://th.bing.com/th/id/OIP.h8qCr42qmI2JNiJJSh5EBQHaEK?rs=1&pid=ImgDetMain"
                        alt="Ilustrasi Verifikasi Berhasil"
                        className="object-contain w-full h-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default EmailVerified;
