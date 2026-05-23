import React from 'react';
import { motion } from 'framer-motion';

// Konfigurasi animasi memantul khas Neo-Brutalism (Snappy & Bouncy)
const bounceTransition = {
    type: "spring",
    stiffness: 400,
    damping: 15
};

const textFadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#F4F4F0] text-black font-sans selection:bg-[#FFDE4D] overflow-x-hidden p-4 md:p-8">

            {/* ─── 🌐 NAVBAR SECTION ─── */}
            <motion.nav
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={bounceTransition}
                className="max-w-7xl mx-auto flex justify-between items-center bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000] rounded-xl mb-12 md:mb-20"
            >
                <span className="font-black text-xl md:text-2xl tracking-tighter">
                    💳 CATAT<span className="bg-[#FFDE4D] px-2 border-2 border-black rounded-md ml-1 shadow-[2px_2px_0px_0px_#000]">CUAN</span>
                </span>

                <motion.a
                    href={localStorage.getItem('user_session') ? "/dashboard" : "/login"}
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={bounceTransition}
                    className="bg-[#4D96FF] font-bold text-sm md:text-base px-4 py-2 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000]"
                >
                    {localStorage.getItem('user_session') ? "Masuk Dashboard 🚀" : "Login gans! 🔓"}
                </motion.a>
            </motion.nav>

            {/* ─── 🚀 HERO SECTION ─── */}
            <header className="max-w-5xl mx-auto text-center mb-20 md:mb-32">
                <motion.div variants={textFadeUp} initial="hidden" animate="visible">
                    <span className="bg-[#6BCB77] text-xs md:text-sm font-black tracking-widest uppercase px-3 py-1 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000]">
                        🔥 BY DISSZ DEV — GENERASI ANTI BONCOS
                    </span>
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase mt-6 leading-none">
                        Catat Keuangan <br className="hidden md:block" />
                        <span className="bg-[#FF6B6B] text-white px-3 border-4 border-black inline-block rounded-xl rotate-[-1deg] my-2 shadow-[6px_6px_0px_0px_#000]">Secepat Chattingan</span>
                    </h1>
                    <p className="text-base md:text-xl font-bold text-gray-700 max-w-2xl mx-auto mt-6 px-4">
                        Ketik pengeluaranmu secara kasual di Telegram layaknya nge-chat teman. Biarkan engine bot pintar kami yang melempar datanya langsung ke Bento Dashboard-mu 24/7!
                    </p>
                </motion.div>

                {/* Call To Action Buttons */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, ...bounceTransition }}
                    className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10 px-4"
                >
                    <motion.a
                        href="https://t.me/NamaBotTelegramKamu" // 🎯 Ganti pake username bot-mu gans
                        target="_blank"
                        whileHover={{ scale: 1.05, rotate: 1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={bounceTransition}
                        className="w-full sm:w-auto text-center bg-[#FFDE4D] font-black text-lg px-8 py-4 border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_#000]"
                    >
                        🤖 HUBUNGKAN KE TELEGRAM
                    </motion.a>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="text-xs font-black uppercase text-gray-500 border-2 border-dashed border-gray-400 p-2 rounded"
                    >
                        Telah merekap ⚡ 14,205+ transaksi hari ini
                    </motion.div>
                </motion.div>
            </header>

            {/* ─── 🍱 BENTO FEATURE GRID (RESPONSIF PENUH) ─── */}
            <main className="max-w-7xl mx-auto mb-24">
                <h2 className="text-2xl md:text-4xl font-black tracking-tight text-center uppercase mb-12">
                    ✨ Fitur Sakti Mandraguna
                </h2>

                {/* Responsive Grid System */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px_md:260px]">

                    {/* Box 1: AI Parsing Chat (Besar - Makan 2 Kolom di Desktop) */}
                    <motion.div
                        whileHover={{ y: -5, rotate: -0.5 }}
                        transition={bounceTransition}
                        className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] md:col-span-2 md:row-span-2 flex flex-col justify-between overflow-hidden relative group"
                    >
                        <div>
                            <span className="text-3xl">🧠</span>
                            <h3 className="text-xl md:text-3xl font-black tracking-tighter uppercase mt-2">Natural Language Parsing</h3>
                            <p className="font-bold text-gray-600 mt-2 max-w-md text-sm md:text-base">
                                Gak perlu format kaku nan ribet. Ketik sesukamu, AI langsung mengekstrak nominal rupiah dan kategorinya otomatis.
                            </p>
                        </div>

                        {/* Widget Interaktif Beranimasi Khas Gen-Z */}
                        <div className="bg-[#F4F4F0] border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_0px_#000] flex flex-col gap-2 font-mono text-xs md:text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">🧑 Fahri:</span>
                                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-red-500 font-bold">● Live Chat</motion.span>
                            </div>
                            <div className="bg-white border border-black p-2 rounded font-bold">
                                "beli kopi starbucks di sutos habis 45rebu gans"
                            </div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1, repeat: Infinity, repeatDelay: 3 }}
                                className="bg-[#6BCB77] border border-black p-2 rounded font-bold text-white shadow-[2px_2px_0px_0px_#000]"
                            >
                                🤖 Bot: 💸 Pengeluaran Berhasil Dicatat! [Item: Kopi Starbucks, Nominal: Rp 45.000]
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Box 2: Real-time Database (Sedang) */}
                    <motion.div
                        whileHover={{ y: -5, rotate: 1 }}
                        transition={bounceTransition}
                        className="bg-[#FF9F43] border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between"
                    >
                        <div className="text-3xl">⚡</div>
                        <div>
                            <h3 className="text-lg md:text-xl font-black uppercase tracking-tight">PostgreSQL Real-Time sync</h3>
                            <p className="font-bold text-sm text-black/80 mt-1">
                                Data terkirim kurang dari 0.3 detik langsung ke server lokal Asus-mu gans.
                            </p>
                        </div>
                    </motion.div>

                    {/* Box 3: Dompet Bersama / Shared Wallet (Sedang) */}
                    <motion.div
                        whileHover={{ y: -5, rotate: -1 }}
                        transition={bounceTransition}
                        className="bg-[#4D96FF] text-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between"
                    >
                        <div className="text-3xl">👥</div>
                        <div>
                            <h3 className="text-lg md:text-xl font-black uppercase tracking-tight">Shared Wallet Feature</h3>
                            <p className="font-bold text-sm text-white/90 mt-1">
                                Ajak pacar atau rekan bisnismu patungan dompet via perintah <code className="bg-black/30 px-1 py-0.5 rounded text-xs">/join @username</code>.
                            </p>
                        </div>
                    </motion.div>

                    {/* Box 4: Passwordless Magic Link (Panjang - Makan 2 Kolom di Desktop) */}
                    <motion.div
                        whileHover={{ y: -5, rotate: 0.5 }}
                        transition={bounceTransition}
                        className="bg-[#FF6B6B] text-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] md:col-span-2 flex flex-col justify-between relative overflow-hidden"
                    >
                        <div className="absolute right-4 top-4 text-7xl opacity-10 font-black uppercase select-none">SECURE</div>
                        <div>
                            <span className="text-3xl">🔒</span>
                            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mt-1">Passwordless Magic Link</h3>
                            <p className="font-bold text-sm md:text-base text-white/90 mt-1 max-w-xl">
                                Benci menghafal password rumit? Masuk ke Web Dashboard Bento UI kamu secara instan dengan mengklik link login aman yang di-generate langsung dari room chat Telegram-mu. Berlaku 15 menit!
                            </p>
                        </div>
                        <div className="mt-2 text-xs font-mono bg-black/20 p-2 border border-white/20 rounded inline-block w-fit">
                            JWT Token Autentikasi Aktif Aktif 2026 ✓
                        </div>
                    </motion.div>

                    {/* Box 5: Visualisasi Bento UI (Makan 1 Kolom Tinggi di Desktop) */}
                    <motion.div
                        whileHover={{ y: -5, rotate: -0.8 }}
                        transition={bounceTransition}
                        className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000] md:row-span-2 flex flex-col justify-between"
                    >
                        <div>
                            <div className="text-3xl">📊</div>
                            <h3 className="text-xl font-black uppercase tracking-tight mt-2">Bento Grid Analytics</h3>
                            <p className="font-bold text-sm text-gray-600 mt-1">
                                Tampilan grafik visualisasi keuangan yang estetik dan bersih, dirancang khusus anti-membosankan.
                            </p>
                        </div>
                        {/* Dummy Mini Bento Graphics */}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <div className="h-16 bg-[#6BCB77] border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-black text-xs text-white">INCOME</div>
                            <div className="h-16 bg-[#FF6B6B] border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-black text-xs text-white">EXPENSE</div>
                        </div>
                    </motion.div>

                </div>
            </main>

            {/* ─── 🏁 FOOTER SECTION ─── */}
            <footer className="max-w-7xl mx-auto border-t-4 border-dashed border-black pt-8 pb-12 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                <div className="font-bold text-sm text-gray-600">
                    © 2026 CatatCuan. All Rights Reserved. Dev by <span className="font-black text-black">DISSZ DEV</span>.
                </div>
                <div className="flex gap-4 font-black text-sm">
                    <a href="#" className="hover:underline">Universitas Dr. Soetomo</a>
                    <a href="#" className="hover:underline">Informatics Engineering</a>
                </div>
            </footer>

        </div>
    );
}