<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Kid Reporter | Romeo</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Russo+One&family=Rock+Salt&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            background-color: #0f172a;
            color: white;
            overflow-x: hidden;
        }
        
        .font-sport {
            font-family: 'Russo One', sans-serif;
        }
        
        .font-signature {
            font-family: 'Rock Salt', cursive;
        }

        .glass-panel {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .stat-card {
            background: linear-gradient(180deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0) 100%);
            border-top: 1px solid rgba(59, 130, 246, 0.5);
        }

        /* Animated Background */
        .bg-grid {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
            mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
        }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState } = React;

        const Icon = ({ path, className }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                {path}
            </svg>
        );

        const Icons = {
            Mic: <Icon path={<><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>} className="w-6 h-6" />,
            Instagram: <Icon path={<><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>} className="w-5 h-5" />,
            Star: <Icon path={<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>} className="w-5 h-5 text-yellow-400" />,
            Play: <Icon path={<><polygon points="5 3 19 12 5 21 5 3"/></>} className="w-8 h-8 text-white fill-current" />
        };

        const App = () => {
            const [activeTab, setActiveTab] = useState('interviews');

            return (
                <div className="min-h-screen bg-[#0f172a] relative">
                    
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-grid pointer-events-none"></div>

                    {/* Navigation */}
                    <nav className="w-full absolute top-0 z-50 py-6 px-4 sm:px-8">
                        <div className="max-w-7xl mx-auto flex justify-between items-center">
                            <a href="index.html" className="text-sm text-gray-400 hover:text-white transition flex items-center gap-2">
                                ← Back to Pull My Card
                            </a>
                            <div className="flex gap-4">
                                <button className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition">
                                    Book Romeo
                                </button>
                            </div>
                        </div>
                    </nav>

                    {/* Hero Section */}
                    <header className="relative pt-32 pb-20 px-4 sm:px-8 overflow-hidden">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col md:flex-row items-center gap-12">
                                
                                {/* Text Content */}
                                <div className="md:w-1/2 z-10 relative">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-500/50 text-blue-400 text-sm font-semibold mb-6">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                        LIVE ON THE ROAD
                                    </div>
                                    <h1 className="text-6xl md:text-8xl font-sport italic leading-none mb-4">
                                        THE KID <br/>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">REPORTER</span>
                                    </h1>
                                    <p className="text-xl text-gray-300 mb-8 max-w-lg leading-relaxed">
                                        The voice of the next generation of collectors. Bridging the gap between NBA legends, modern superstars, and the trading card hobby.
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-6 items-center">
                                        <div className="flex gap-4">
                                            <a href="#" className="p-3 glass-panel rounded-full hover:bg-white/10 transition text-pink-500">
                                                {Icons.Instagram}
                                            </a>
                                            <a href="#" className="p-3 glass-panel rounded-full hover:bg-white/10 transition text-white">
                                               {/* TikTok Icon Placeholder */}
                                               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 1 0 7.75 6.75V7.9A9 9 0 0 0 19.59 6.69z"/></svg>
                                            </a>
                                        </div>
                                        <div className="h-12 w-px bg-gray-700"></div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-widest">Representation</p>
                                            <p className="font-bold">Pull My Card Agency</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Hero Image Layering */}
                                <div className="md:w-1/2 relative z-10 mt-12 md:mt-0">
                                    <div className="relative w-full max-w-md mx-auto">
                                        {/* Decorative Elements */}
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                                        
                                        {/* Main Image Frame */}
                                        <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                                            {/* Placeholder for Image of Romeo with Steph Curry */}
                                            <img src="https://placehold.co/600x750/1e293b/FFF?text=Romeo+x+Steph+Curry" alt="Romeo with Steph Curry" className="w-full object-cover" />
                                            
                                            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                                <p className="font-signature text-yellow-400 text-2xl mb-1">Romeo</p>
                                                <p className="text-sm font-bold uppercase tracking-widest text-white">The Kid Reporter</p>
                                            </div>
                                        </div>

                                        {/* Floating Stat Card */}
                                        <div className="absolute -bottom-6 -left-6 bg-gray-900 p-4 rounded-xl border border-gray-700 shadow-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-600 p-2 rounded-lg">
                                                    {Icons.Mic}
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">Interviews</p>
                                                    <p className="text-xl font-bold font-sport">50+</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Stats & Credibility Bar */}
                    <div className="border-y border-white/5 bg-white/5 backdrop-blur-sm">
                        <div className="max-w-7xl mx-auto px-4 py-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                                <div>
                                    <p className="text-3xl font-sport text-white mb-1">500K+</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Content Views</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-sport text-white mb-1">50+</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">NBA Players Met</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-sport text-white mb-1">Top 1%</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Card Knowledge</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-sport text-white mb-1">2025</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Fanatics Fest Tour</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Vault */}
                    <section className="py-20 px-4 sm:px-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                                <div>
                                    <h2 className="text-4xl font-sport uppercase italic mb-2">The Vault</h2>
                                    <p className="text-gray-400">Credentialed access to the biggest names in the game.</p>
                                </div>
                                <div className="flex gap-2 mt-4 md:mt-0">
                                    <button 
                                        onClick={() => setActiveTab('interviews')}
                                        className={`px-6 py-2 rounded-full text-sm font-bold transition ${activeTab === 'interviews' ? 'bg-blue-600 text-white' : 'glass-panel text-gray-300'}`}
                                    >
                                        Interviews
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('collection')}
                                        className={`px-6 py-2 rounded-full text-sm font-bold transition ${activeTab === 'collection' ? 'bg-blue-600 text-white' : 'glass-panel text-gray-300'}`}
                                    >
                                        The Collection
                                    </button>
                                </div>
                            </div>

                            {/* Grid Content */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                
                                {/* Featured Item 1: Stephen Jackson */}
                                <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition z-10"></div>
                                    {/* Placeholder for Romeo x Stephen Jackson */}
                                    <img src="https://placehold.co/600x800/222/FFF?text=Romeo+x+Stephen+Jackson" alt="Stephen Jackson Interview" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black to-transparent">
                                        <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-bold rounded mb-2">EXCLUSIVE</span>
                                        <h3 className="text-xl font-bold leading-tight">"All The Smoke" with Stephen Jackson</h3>
                                        <p className="text-gray-300 text-sm mt-2 opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0">Discussing the future of card collecting and player investments.</p>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition duration-300 scale-75 group-hover:scale-100">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
                                            {Icons.Play}
                                        </div>
                                    </div>
                                </div>

                                {/* Featured Item 2: Card Spread */}
                                <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer lg:col-span-1">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition z-10"></div>
                                    {/* Placeholder for Card Spread Image */}
                                    <img src="https://placehold.co/600x800/333/FFF?text=The+Prizm+Collection" alt="Card Collection" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black to-transparent">
                                        <span className="inline-block px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded mb-2">SHOWCASE</span>
                                        <h3 className="text-xl font-bold leading-tight">The Prizm Holo Spread</h3>
                                        <p className="text-gray-300 text-sm mt-2 opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0">A look at Romeo's personal collection of high-value rookies.</p>
                                    </div>
                                </div>

                                {/* Featured Item 3: Community */}
                                <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition z-10"></div>
                                    {/* Placeholder for Group Shot */}
                                    <img src="https://placehold.co/600x800/444/FFF?text=Community+Giveback" alt="Community Event" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black to-transparent">
                                        <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded mb-2">COMMUNITY</span>
                                        <h3 className="text-xl font-bold leading-tight">Giving Back to the Hobby</h3>
                                        <p className="text-gray-300 text-sm mt-2 opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0">Connecting with the next wave of collectors at local card shops.</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* Romeo's Rookie Watch */}
                    <section className="py-20 bg-blue-900/20 border-y border-blue-500/10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-yellow-500 p-2 rounded text-black font-bold">
                                    {Icons.Star}
                                </div>
                                <h2 className="text-3xl font-sport italic">Romeo's Rookie Watch</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-yellow-500/50 transition group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
                                                <img src={`https://placehold.co/100x100/333/FFF?text=P${item}`} className="w-full h-full object-cover"/>
                                            </div>
                                            <span className="text-green-400 text-sm font-bold">+12.5% 📈</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1">Victor Wembanyama</h3>
                                        <p className="text-sm text-gray-400 mb-4">2023 Prizm Silver</p>
                                        <div className="bg-black/50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-300 italic">"The hype is real. His wingspan is wider than the bus. Buy now before Fanatics Fest." - <span className="text-yellow-500 font-bold not-italic">Romeo</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Footer CTA */}
                    <section className="py-24 text-center px-4">
                        <h2 className="text-4xl md:text-6xl font-sport italic mb-6">READY FOR THE SHOW</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                            Romeo is available for interviews, hosting, and brand partnerships leading up to Fanatics Fest.
                        </p>
                        <button className="px-10 py-4 bg-white text-black font-bold rounded-full text-lg hover:scale-105 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            Contact Management
                        </button>
                    </section>
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>