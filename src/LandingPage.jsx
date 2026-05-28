import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowRight, Send, CheckCircle2, BarChart3, Shield, Zap, Code2 } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    const handleConnectTelegram = () => {
        window.open('https://t.me/catatcuan_bot', '_blank');
    };

    return (
        <div className="min-h-screen bg-[#F3F7FA] text-[#1E293B] font-sans selection:bg-[#74C7ED]">

            {/* BACKGROUND MATRIKS */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* 👑 NAVBAR UTAMA */}
            <header className="max-w-6xl mx-auto p-4 md:p-6 relative z-10">
                <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000000] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="bg-[#229ED9] text-white font-black px-2 py-0.5 border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000000] text-lg rounded">C$</span>
                        <span className="font-black text-base uppercase tracking-tight">Catat<span className="text-[#229ED9]">Cuan</span></span>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-5 py-2 bg-[#74C7ED] text-black font-black uppercase text-xs tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000000] cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000000] active:shadow-none transition-all"
                    >
                        Akses Dashboard 🔓
                    </button>
                </div>
            </header>

            {/* 🎯 HERO SECTION */}
            <section className="max-w-6xl mx-auto px-4 md:px-6 pt-12 pb-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">

                {/* KONTEN TEKS */}
                <div className="space-y-6 text-center md:text-left">
                    {/* 🌟 ATRIBUSI 1: SUB-BRANDING BADGE RESMI */}
                    <div className="inline-flex items-center gap-2 bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_#000000]">
                        <Code2 className="w-3.5 h-3.5 text-[#229ED9]" />
                        <span className="text-[10px] font-black tracking-widest uppercase text-black">
                            A PRODUCT OF <span className="text-[#229ED9]">DISSZ DEV</span>
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-black uppercase leading-tight">
                        Kelola Finansial Personal <br className="hidden md:inline" />
                        <span className="bg-[#229ED9] text-white px-2 inline-block border-2 border-black shadow-[4px_4px_0px_0px_#000000] my-1">
                            Melalui Platform Telegram
                        </span>
                    </h2>

                    <p className="text-sm font-bold text-gray-500 max-w-lg leading-relaxed uppercase">
                        Efisiensi pencatatan tanpa aplikasi tambahan. Cukup kirimkan pesan transaksi Anda melalui bot Telegram, sistem cerdas kami akan langsung memproses dan menyusun laporan secara otomatis.
                    </p>

                    <div className="pt-2">
                        <button
                            onClick={handleConnectTelegram}
                            className="inline-flex items-center gap-3 px-6 py-4 bg-[#229ED9] text-white font-black text-sm uppercase tracking-wider border-2 border-black shadow-[5px_5px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000000] active:shadow-none transition-all cursor-pointer w-full sm:w-auto justify-center"
                        >
                            <MessageSquare className="w-5 h-5 fill-white stroke-none" />
                            Mulai Hubungkan Ke Telegram
                            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                        </button>
                    </div>
                </div>

                {/* MOCKUP CHAT TELEGRAM */}
                <div className="bg-[#17212B] border-2 border-black p-4 shadow-[8px_8px_0px_0px_#000000] rounded-xl max-w-sm mx-auto w-full font-sans">
                    <div className="flex items-center gap-3 border-b border-gray-700 pb-3 mb-4">
                        <div className="w-8 h-8 bg-[#2A394A] rounded-full flex items-center justify-center font-black text-xs text-[#5288C1]">CC</div>
                        <div>
                            <h4 className="text-white text-xs font-black tracking-wide">CatatCuan Bot</h4>
                            <p className="text-[#5288C1] text-[9px] font-bold">Official Bot</p>
                        </div>
                    </div>

                    <div className="space-y-4 min-h-[220px] flex flex-col justify-end text-xs">
                        <div className="self-end bg-[#2B5278] text-white p-2.5 rounded-xl rounded-tr-none max-w-[80%] border border-black/40 shadow-sm">
                            <p className="font-medium">Pembelian perlengkapan kantor 150rb</p>
                            <span className="text-[8px] text-[#A6C4E0] block text-right mt-1">10:15 ✓✓</span>
                        </div>

                        <div className="self-start bg-[#182533] text-white p-3 rounded-xl rounded-tl-none max-w-[85%] border border-black/40 shadow-sm space-y-1.5">
                            <p className="text-[#5288C1] font-black text-[10px]">🤖 TRANSACTION RECORDED</p>
                            <p className="text-gray-300 font-medium">Transaksi berhasil diperbarui dalam sistem:</p>
                            <div className="bg-[#203040] p-1.5 border border-gray-700 font-mono text-[10px] text-emerald-400">
                                • Nominal: Rp 150.000 <br />
                                • Kategori: Operasional <br />
                                • Deskripsi: "Perlengkapan kantor"
                            </div>
                            <span className="text-[8px] text-gray-500 block text-right">10:15</span>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 bg-[#24313F] p-2 rounded-lg border border-gray-700">
                        <div className="text-gray-500 text-xs flex-1 font-bold text-[10px] pl-1">Ketik detail transaksi...</div>
                        <Send className="w-4 h-4 text-[#5288C1]" />
                    </div>
                </div>

            </section>

            {/* STRUKTUR ALUR KERJA */}
            <section className="bg-white border-y-4 border-black py-16 relative z-10">
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                    <div className="text-center space-y-2 mb-12">
                        <h3 className="text-2xl font-black uppercase text-black">// ALUR INTEGRASI SISTEM</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase">Tiga tahapan integrasi untuk memulai pemantauan finansial</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-[#F3F7FA] border-2 border-black p-6 shadow-[4px_4px_0px_0px_#000000] relative">
                            <span className="absolute -top-4 -left-4 w-8 h-8 bg-[#229ED9] border-2 border-black text-white flex items-center justify-center font-black text-sm shadow-[1.5px_1.5px_0px_0px_#000000]">1</span>
                            <h4 className="font-black text-sm uppercase mb-2 mt-2">Aktivasi Bot</h4>
                            <p className="text-xs font-bold text-gray-500 uppercase leading-relaxed">
                                Hubungkan akun Telegram Anda dengan bot resmi kami dan tekan perintah <span className="bg-white border border-black px-1 text-black font-black">/start</span> untuk inisialisasi basis data.
                            </p>
                        </div>

                        <div className="bg-[#F3F7FA] border-2 border-black p-6 shadow-[4px_4px_0px_0px_#000000] relative">
                            <span className="absolute -top-4 -left-4 w-8 h-8 bg-[#74C7ED] border-2 border-black text-black flex items-center justify-center font-black text-sm shadow-[1.5px_1.5px_0px_0px_#000000]">2</span>
                            <h4 className="font-black text-sm uppercase mb-2 mt-2">Input Transaksi</h4>
                            <p className="text-xs font-bold text-gray-500 uppercase leading-relaxed">
                                Kirimkan detail pengeluaran atau pemasukan secara natural melalui chat. Sistem pemrosesan bahasa akan mengurai data secara presisi.
                            </p>
                        </div>

                        <div className="bg-[#F3F7FA] border-2 border-black p-6 shadow-[4px_4px_0px_0px_#000000] relative">
                            <span className="absolute -top-4 -left-4 w-8 h-8 bg-[#229ED9] border-2 border-black text-white flex items-center justify-center font-black text-sm shadow-[1.5px_1.5px_0px_0px_#000000]">3</span>
                            <h4 className="font-black text-sm uppercase mb-2 mt-2">Analisis Dashboard</h4>
                            <p className="text-xs font-bold text-gray-500 uppercase leading-relaxed">
                                Akses dashboard visual kapan saja melalui otentikasi OTP terenkripsi untuk meninjau neraca dan grafik komprehensif.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* METRICS PLATFORM */}
            <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border-2 border-black p-5 flex items-center gap-4 shadow-[3px_3px_0px_0px_#000000]">
                    <div className="p-2 bg-[#E0F2FE] border border-black rounded text-[#229ED9]"><Zap className="w-5 h-5 stroke-[2.5]" /></div>
                    <div>
                        <h5 className="font-black text-xs uppercase text-black">Real-Time Processing</h5>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Sinkronisasi data instan</p>
                    </div>
                </div>
                <div className="bg-white border-2 border-black p-5 flex items-center gap-4 shadow-[3px_3px_0px_0px_#000000]">
                    <div className="p-2 bg-[#E0F2FE] border border-black rounded text-[#229ED9]"><BarChart3 className="w-5 h-5 stroke-[2.5]" /></div>
                    <div>
                        <h5 className="font-black text-xs uppercase text-black">Bento UI Analytics</h5>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Antarmuka visual terstruktur</p>
                    </div>
                </div>
                <div className="bg-white border-2 border-black p-5 flex items-center gap-4 shadow-[3px_3px_0px_0px_#000000]">
                    <div className="p-2 bg-[#E0F2FE] border border-black rounded text-[#229ED9]"><Shield className="w-5 h-5 stroke-[2.5]" /></div>
                    <div>
                        <h5 className="font-black text-xs uppercase text-black">Secure OTP Gateway</h5>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Perlindungan sesi 24 jam</p>
                    </div>
                </div>
            </section>

            {/* 👑 ATRIBUSI 2: FOOTER CORPORATE FOOTNOTE BERKELAS */}
            <footer className="max-w-6xl mx-auto px-4 md:px-6 pb-12 text-center relative z-10">
                <div className="inline-block bg-black text-white px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_#229ED9] font-mono text-[10px] tracking-wider uppercase rounded-sm">
                    © 2026 CatatCuan Technology Ecosystem • Engineered by DISSZ DEV
                </div>
            </footer>

        </div>
    );
}