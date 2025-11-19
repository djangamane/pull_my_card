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
        /* Added 'Bangers' for that Anime/Comic feel */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Russo+One&family=Bangers&family=Rock+Salt&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            background-color: #0f172a;
            color: white;
            overflow-x: hidden;
        }
        
        .font-sport {
            font-family: 'Russo One', sans-serif;
        }
        
        .font-anime {
            font-family: 'Bangers', cursive;
            letter-spacing: 0.05em;
        }
        
        .font-signature {
            font-family: 'Rock Salt', cursive;
        }

        .glass-panel {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Anime Speed Lines Effect */
        .anime-bg {
            background: radial-gradient(circle at center, #1e3a8a 0%, #0f172a 100%);
            position: relative;
            overflow: hidden;
        }
        .anime-bg::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 200%;
            height: 200%;
            background: repeating-conic-gradient(from 0deg, rgba(255,255,255,0.03) 0deg 10deg, transparent 10deg 20deg);
            transform: translate(-50%, -50%);
            animation: spin 60s linear infinite;
        }

        @keyframes spin {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
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

                    {/* Hero Section - Anime Style */}
                    <header className="relative pt-32 pb-20 px-4 sm:px-8 overflow-hidden anime-bg">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col md:flex-row items-center gap-12">
                                
                                {/* Text Content */}
                                <div className="md:w-1/2 z-10 relative">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400 border border-yellow-600 text-black text-sm font-bold mb-6 transform -rotate-2 shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                                        LIVE ON THE ROAD
                                    </div>
                                    <h1 className="text-7xl md:text-9xl font-anime italic leading-none mb-4 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
                                        THE KID <br/>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400">REPORTER</span>
                                    </h1>
                                    <p className="text-xl text-blue-100 mb-8 max-w-lg leading-relaxed font-medium">
                                        The voice of the next generation of collectors. Bridging the gap between NBA legends, modern superstars, and the trading card hobby.
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-6 items-center">
                                        <div className="flex gap-4">
                                            <a href="#" className="p-3 glass-panel rounded-full hover:bg-white/10 transition text-pink-500 border border-white/20">
                                                {Icons.Instagram}
                                            </a>
                                        </div>
                                        <div className="h-12 w-px bg-blue-500/50"></div>
                                        <div>
                                            <p className="text-xs text-blue-300 uppercase tracking-widest">Representation</p>
                                            <p className="font-bold text-white">Pull My Card Agency</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Hero Image Layering - Ready for Anime Image */}
                                <div className="md:w-1/2 relative z-10 mt-12 md:mt-0">
                                    <div className="relative w-full max-w-lg mx-auto">
                                        
                                        {/* Main Image Frame */}
                                        <div className="relative z-20 transform hover:scale-105 transition duration-500">
                                            {/* USER INSTRUCTION: 
                                                Replace the src below with your generated anime image filename (e.g., 'romeo_anime.png')
                                            */}
                                            <img 
                                                src="https://placehold.co/600x700/1e293b/FFF?text=Insert+Anime+Romeo+Here" 
                                                alt="Romeo Anime Hero" 
                                                className="w-full object-contain drop-shadow-[0_20px_50px_rgba(59,130,246,0.5)] mask-image-gradient" 
                                            />
                                            
                                            {/* Comic Book Style Label */}
                                            <div className="absolute bottom-10 -right-4 bg-yellow-400 text-black p-4 transform rotate-3 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                                                <p className="font-anime text-3xl leading-none">ROMEO</p>
                                                <p className="text-xs font-bold uppercase tracking-widest">The Kid Reporter</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Stats & Credibility Bar */}
                    <div className="border-y border-white/5 bg-black/30 backdrop-blur-sm">
                        <div className="max-w-7xl mx-auto px-4 py-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                                <div>
                                    <p className="text-4xl font-anime text-yellow-400 mb-1">500K+</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Content Views</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-anime text-blue-400 mb-1">50+</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">NBA Players Met</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-anime text-purple-400 mb-1">Top 1%</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Card Knowledge</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-anime text-green-400 mb-1">2025</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Fanatics Fest Tour</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Vault */}
                    <section className="py-20 px-4 sm:px-8 bg-[#0f172a]">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                                <div>
                                    <h2 className="text-5xl font-anime uppercase italic mb-2 text-white">The Vault</h2>
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
                                <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-blue-500/50 transition">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition z-10"></div>
                                    {/* Placeholder for Romeo x Stephen Jackson */}
                                    <img src="https://placehold.co/600x800/222/FFF?text=Romeo+x+Stephen+Jackson" alt="Stephen Jackson Interview" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black to-transparent">
                                        <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-bold rounded mb-2">EXCLUSIVE</span>
                                        <h3 className="text-2xl font-anime leading-tight text-white">"All The Smoke" with Stephen Jackson</h3>
                                        <p className="text-gray-300 text-sm mt-2 opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0">Discussing the future of card collecting and player investments.</p>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition duration-300 scale-75 group-hover:scale-100">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
                                            {Icons.Play}
                                        </div>
                                    </div>
                                </div>

                                {/* Featured Item 2: Card Spread */}
                                <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer lg:col-span-1 border border-white/5 hover:border-yellow-500/50 transition">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition z-10"></div>
                                    {/* Placeholder for Card Spread Image */}
                                    <img src="https://placehold.co/600x800/333/FFF?text=The+Prizm+Collection" alt="Card Collection" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black to-transparent">
                                        <span className="inline-block px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded mb-2">SHOWCASE</span>
                                        <h3 className="text-2xl font-anime leading-tight text-white">The Prizm Holo Spread</h3>
                                        <p className="text-gray-300 text-sm mt-2 opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0">A look at Romeo's personal collection of high-value rookies.</p>
                                    </div>
                                </div>

                                {/* Featured Item 3: Community */}
                                <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-green-500/50 transition">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition z-10"></div>
                                    {/* Placeholder for Group Shot */}
                                    <img src="https://placehold.co/600x800/444/FFF?text=Community+Giveback" alt="Community Event" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black to-transparent">
                                        <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded mb-2">COMMUNITY</span>
                                        <h3 className="text-2xl font-anime leading-tight text-white">Giving Back to the Hobby</h3>
                                        <p className="text-gray-300 text-sm mt-2 opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0">Connecting with the next wave of collectors at local card shops.</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* Romeo's Rookie Watch */}
                    <section className="py-20 bg-blue-900/10 border-y border-blue-500/10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-yellow-500 p-2 rounded text-black font-bold transform -rotate-3">
                                    {Icons.Star}
                                </div>
                                <h2 className="text-4xl font-anime italic text-white">Romeo's Rookie Watch</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-yellow-500/50 transition group hover:-translate-y-1 duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden border-2 border-white/10">
                                                <img src={`https://placehold.co/100x100/333/FFF?text=P${item}`} className="w-full h-full object-cover"/>
                                            </div>
                                            <span className="text-green-400 text-sm font-bold bg-green-900/30 px-2 py-1 rounded">+12.5% 📈</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1">Victor Wembanyama</h3>
                                        <p className="text-sm text-gray-400 mb-4">2023 Prizm Silver</p>
                                        <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                                            <p className="text-xs text-gray-300 italic">"The hype is real. His wingspan is wider than the bus. Buy now before Fanatics Fest." - <span className="text-yellow-500 font-bold not-italic">Romeo</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Footer CTA */}
                    <section className="py-24 text-center px-4 relative overflow-hidden">
                         <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-gradient-to-b from-transparent to-blue-900/20 pointer-events-none"></div>
                        <h2 className="text-5xl md:text-7xl font-anime italic mb-6 text-white drop-shadow-lg">READY FOR THE SHOW</h2>
                        <p className="text-blue-200 max-w-2xl mx-auto mb-8 text-lg">
                            Romeo is available for interviews, hosting, and brand partnerships leading up to Fanatics Fest.
                        </p>
                        <button className="px-12 py-5 bg-white text-black font-anime text-2xl rounded-lg hover:bg-yellow-400 transition shadow-[0_0_30px_rgba(255,255,255,0.2)] transform hover:-rotate-1">
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