import { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    
    useEffect(() => {
        // Simple reveal on scroll effect
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                }
            });
        }, observerOptions);

        document.querySelectorAll('section').forEach(section => {
            section.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
            observer.observe(section);
        });

        // Smooth Scroll
        const handleSmoothScroll = function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        };

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', handleSmoothScroll);
        });
        
        return () => {
            observer.disconnect();
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.removeEventListener('click', handleSmoothScroll);
            });
        }
    }, []);

    return (
        <div className="overflow-x-hidden bg-background text-on-background font-body-md">
            <Head title="SiGAP - Sistem Pelaporan Fasilitas Gedung" />
            
            {/* TopNavBar */}
            <header className="bg-surface/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant/30 shadow-sm h-16">
                <nav className="flex justify-between items-center h-full px-margin-mobile md:px-gutter max-w-container-max mx-auto">
                    <div className="font-headline-md text-headline-md font-bold text-primary">SiGAP</div>
                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-stack-lg">
                        <a className="text-primary border-b-2 border-primary pb-1 font-label-md text-label-md transition-colors duration-200" href="#hero">Beranda</a>
                        <a className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors duration-200" href="#features">Fitur</a>
                        <a className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors duration-200" href="#how-it-works">Cara Kerja</a>
                        <a className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors duration-200" href="#download">Unduh</a>
                    </div>
                    <div className="flex items-center gap-2">
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="bg-primary text-on-primary px-5 py-2 rounded-lg font-label-md text-label-md active:scale-95 transition-transform">
                                Dashboard
                            </Link>
                        ) : (
                            <Link href={route('login')} className="bg-primary text-on-primary px-5 py-2 rounded-lg font-label-md text-label-md active:scale-95 transition-transform">
                                Admin Login
                            </Link>
                        )}
                    </div>
                </nav>
            </header>

            <main className="pt-24 overflow-hidden">
                {/* Hero Section */}
                <section className="relative px-margin-mobile md:px-gutter max-w-container-max mx-auto py-stack-lg md:py-24" id="hero">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
                        <div className="md:col-span-6 space-y-stack-md text-center md:text-left z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container/10 text-primary rounded-full font-label-sm text-label-sm border border-primary/20">
                                <span className="material-symbols-outlined text-[16px]">verified</span>
                                <span>Sistem Informasi Pelaporan Gedung dan Prasarana</span>
                            </div>
                            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background tracking-tight">
                                Lapor Kerusakan Gedung <span className="text-primary">Lebih Cepat</span> &amp; Transparan
                            </h1>
                            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                                Sistem pengaduan sarana prasarana gedung yang terintegrasi. Bantu kami menjaga kenyamanan lingkungan kerja Anda dengan satu aplikasi.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                                <a 
                                    href="/apk/sigap.apk" 
                                    download="SiGAP.apk"
                                    className="bg-primary text-on-primary px-8 py-4 rounded-xl font-headline-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95"
                                >
                                    <span className="material-symbols-outlined">download</span>
                                    Unduh Aplikasi
                                </a>
                                {auth?.user ? (
                                    <Link href={route('dashboard')} className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-xl font-headline-sm border border-outline-variant flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all active:scale-95">
                                        <span className="material-symbols-outlined">admin_panel_settings</span>
                                        Portal Admin
                                    </Link>
                                ) : (
                                    <Link href={route('login')} className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-xl font-headline-sm border border-outline-variant flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all active:scale-95">
                                        <span className="material-symbols-outlined">admin_panel_settings</span>
                                        Portal Admin
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="md:col-span-6 relative mt-12 md:mt-0">
                            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl"></div>
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/40 transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
                                <img className="w-full h-auto object-cover aspect-[4/3]" alt="App Preview" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoI2MpuZ5YajQ9x__Z0s6jMPgQKmVYuzNfcGFAdNXbQQP7Y1EVX2kP4mOHL0g6KL5HRn5vBrdyIwEV3fq5CS9EzakIivSmG31rnhwsC7liyMMRhSFruu6cF2uH30b82PfnFjIWt_JIEmJBaeA6SLvd4wwWetaBT3Q1cuFtz7cuTqRy-egmFZw2ndtuR2pL6EcuVwLeMS8Khf0iuzeVa8RywQ6m-0P4Z6HDB25uA84kRP1f-QsGR0BOpj4XkXVi0QTSUqMZh09aVPQ" />
                            </div>
                            {/* Floating Stat Card */}
                            <div className="absolute -bottom-6 -right-6 md:right-0 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce hover:pause">
                                <div className="bg-secondary-container p-3 rounded-full">
                                    <span className="material-symbols-outlined text-on-secondary-container">bolt</span>
                                </div>
                                <div>
                                    <div className="text-on-surface-variant font-label-sm">Respons Cepat</div>
                                    <div className="text-primary font-bold text-headline-sm"> &lt; 15 Menit</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it Works Section */}
                <section className="bg-white py-section-gap" id="how-it-works">
                    <div className="px-margin-mobile md:px-gutter max-w-container-max mx-auto">
                        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                            <h2 className="font-headline-md text-headline-md md:text-[36px] text-on-background">Alur Kerja SiGAP</h2>
                            <p className="font-body-md text-body-md text-on-surface-variant">Laporkan kerusakan hanya dalam hitungan detik. Tim teknisi kami akan segera menanggapi setiap laporan Anda.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                            {/* Connector Line (Desktop) */}
                            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-dashed border-t-2 border-dashed border-outline-variant/50 -translate-y-12 z-0"></div>
                            {/* Step 1 */}
                            <div className="relative z-10 flex flex-col items-center text-center space-y-stack-md group">
                                <div className="w-24 h-24 rounded-3xl bg-primary-container text-on-primary-container flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-[48px]">photo_camera</span>
                                </div>
                                <div className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center font-bold absolute top-0 right-1/4 md:right-1/3 border-4 border-white">1</div>
                                <h3 className="font-headline-sm text-headline-sm mt-4">Foto Kerusakan</h3>
                                <p className="font-body-md text-body-md text-on-surface-variant">Ambil foto bagian gedung yang bermasalah atau rusak langsung dari aplikasi.</p>
                            </div>
                            {/* Step 2 */}
                            <div className="relative z-10 flex flex-col items-center text-center space-y-stack-md group">
                                <div className="w-24 h-24 rounded-3xl bg-secondary-container text-on-secondary-container flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-[48px]">send</span>
                                </div>
                                <div className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center font-bold absolute top-0 right-1/4 md:right-1/3 border-4 border-white">2</div>
                                <h3 className="font-headline-sm text-headline-sm mt-4">Kirim Laporan</h3>
                                <p className="font-body-md text-body-md text-on-surface-variant">Lengkapi detail lokasi dan kategori masalah, lalu kirim laporan secara instan.</p>
                            </div>
                            {/* Step 3 */}
                            <div className="relative z-10 flex flex-col items-center text-center space-y-stack-md group">
                                <div className="w-24 h-24 rounded-3xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-[48px]">fact_check</span>
                                </div>
                                <div className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center font-bold absolute top-0 right-1/4 md:right-1/3 border-4 border-white">3</div>
                                <h3 className="font-headline-sm text-headline-sm mt-4">Pantau Progress</h3>
                                <p className="font-body-md text-body-md text-on-surface-variant">Dapatkan notifikasi real-time saat laporan Anda sedang diproses dan selesai.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Bento Grid */}
                <section className="py-section-gap px-margin-mobile md:px-gutter max-w-container-max mx-auto" id="features">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div className="max-w-xl">
                            <h2 className="font-headline-md text-[32px] text-on-background mb-4">Fitur Utama SiGAP</h2>
                            <p className="font-body-md text-body-md text-on-surface-variant">Kami menyediakan alat yang dibutuhkan untuk transparansi fasilitas publik.</p>
                        </div>
                        <a className="text-primary font-label-md flex items-center gap-2 hover:underline" href="#">Lihat Semua Fitur <span className="material-symbols-outlined">arrow_forward</span></a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-none md:grid-rows-2 gap-gutter">
                        {/* Large Feature */}
                        <div className="md:col-span-8 md:row-span-2 bg-primary-container text-on-primary-container rounded-[2rem] p-stack-lg relative overflow-hidden flex flex-col justify-end min-h-[400px]">
                            {/* Background Image Chart */}
                            <div className="absolute inset-0">
                                <img src="/images/chart-mockup.png" alt="Dashboard Chart Mockup" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/80 to-transparent"></div>
                            </div>
                            <div className="relative z-10">
                                <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-white">query_stats</span>
                                </div>
                                <h3 className="font-headline-md text-[28px] mb-4">Dashboard Analytics Real-time</h3>
                                <p className="font-body-md max-w-md opacity-90">Pantau seluruh status fasilitas gedung Anda dalam satu tampilan dashboard yang intuitif dan akurat.</p>
                            </div>
                        </div>
                        {/* Small Feature 1 */}
                        <div className="md:col-span-4 bg-white border border-outline-variant/30 rounded-[2rem] p-stack-lg flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-secondary-container w-12 h-12 rounded-xl flex items-center justify-center text-on-secondary-container">
                                <span className="material-symbols-outlined">notifications_active</span>
                            </div>
                            <div>
                                <h3 className="font-headline-sm mt-6 mb-2">Notifikasi Push</h3>
                                <p className="font-body-md text-on-surface-variant text-sm">Update instan di HP Anda ketika perbaikan selesai dilakukan.</p>
                            </div>
                        </div>
                        {/* Small Feature 2 */}
                        <div className="md:col-span-4 bg-surface-container-high rounded-[2rem] p-stack-lg flex flex-col justify-between hover:bg-surface-container-highest transition-colors">
                            <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center text-on-primary">
                                <span className="material-symbols-outlined">history</span>
                            </div>
                            <div>
                                <h3 className="font-headline-sm mt-6 mb-2">Riwayat Lengkap</h3>
                                <p className="font-body-md text-on-surface-variant text-sm">Arsip digital seluruh laporan untuk audit dan evaluasi berkala.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Download App Section */}
                <section className="py-section-gap" id="download">
                    <div className="px-margin-mobile md:px-gutter max-w-container-max mx-auto">
                        <div className="bg-inverse-surface text-inverse-on-surface rounded-[3rem] overflow-hidden relative">
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 -skew-x-12 translate-x-1/4"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                                <div className="p-12 md:p-20 space-y-stack-md">
                                    <h2 className="font-display-lg-mobile md:font-headline-md text-white">Tersedia di Semua Platform</h2>
                                    <p className="font-body-lg opacity-80">Laporkan masalah di mana saja, kapan saja langsung dari smartphone Anda. Dapatkan kenyamanan bekerja yang terjamin.</p>
                                    <div className="flex flex-wrap gap-4 pt-6">
                                        {/* App Store Badge */}
                                        <a className="bg-black border border-white/20 rounded-xl px-6 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors z-10" href="#">
                                            <div className="text-white text-3xl"><span className="material-symbols-outlined text-[32px]">apps</span></div>
                                            <div className="text-left">
                                                <div className="text-[10px] uppercase font-bold opacity-60">Download on</div>
                                                <div className="text-lg font-bold leading-none">App Store</div>
                                            </div>
                                        </a>
                                        {/* Google Play Badge */}
                                        <a className="bg-black border border-white/20 rounded-xl px-6 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors z-10" href="#">
                                            <div className="text-white text-3xl"><span className="material-symbols-outlined text-[32px]">play_books</span></div>
                                            <div className="text-left">
                                                <div className="text-[10px] uppercase font-bold opacity-60">Get it on</div>
                                                <div className="text-lg font-bold leading-none">Google Play</div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div className="hidden md:flex justify-center items-end h-full">
                                    <img className="w-3/4 translate-y-20 z-10" alt="Phone Display" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbRLAACvJEngi2ozk-7us7v2tyDtVGK56TUrY_BlZbdO9bzyxqqvbn96m7YjatcONTf1zYWfFsN-PD4o3zraXAcXclWjvXYq28FJrbwooGgJqk23MtbUsPDqNiGBU7GN-U74NIET8lwbJagCxXIbAYeE69ApoYIUz4pj1-pHAkI4RkAyIcl4s-nDqS5P-WCUwAiSx7OVd69gBEc1y-aRDJw4oIku7yWcLAQ468P8fVwT9COf1MY9H67VKpml-z1I_C0jF2lV2NfdU" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-surface-container-lowest border-t border-outline-variant w-full py-stack-lg">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter px-margin-mobile md:px-gutter max-w-container-max mx-auto">
                    <div className="md:col-span-12 space-y-4 text-center md:text-left">
                        <div className="font-headline-sm text-headline-sm font-bold text-primary">SiGAP</div>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            © {new Date().getFullYear()} SiGAP. Accountability, efficiency, and transparency in facility management.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
