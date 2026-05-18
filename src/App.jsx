import React, { useState, useEffect, useRef } from 'react';
import { Search, User, ShoppingBag, ChevronDown, Menu, X, ArrowRight, Check, Facebook, Mail, MapPin, Phone, LogOut, Settings, CreditCard, Star, MessageCircle, Instagram, Twitter, Youtube, ShieldCheck, ChevronRight, Code, PenTool, Cpu, Quote, TrendingUp, Award, Users, Globe, Smartphone, Monitor, AlertTriangle, Lock, Zap, Layers, CheckCircle, Database, Cloud, Rocket, Send, Clock, CalendarDays, Share2, MessageSquare, Terminal, Binary, Briefcase, HeartHandshake, Headphones, Layout } from 'lucide-react';

const LOGO_SRC = '/images/Subject.png';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// --- Firebase Initialization ---
let app, auth, db;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'thtceo-app';
try {
  if (typeof __firebase_config !== 'undefined') {
    const firebaseConfig = JSON.parse(__firebase_config);
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.warn("Firebase config not found or invalid. Using mock auth for preview.");
}

// --- Custom Hooks for Animations ---
const useElementOnScreen = (options) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(containerRef.current);
      }
    }, options);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [containerRef, options]);

  return [containerRef, isVisible];
};

// --- Reusable Animated Components ---
const FadeInUp = ({ children, delay = 0, className = "", onClick }) => {
  const [ref, isVisible] = useElementOnScreen({ threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- Product Data ---
const DIGITAL_PRODUCTS = [
  { id: 'dp1', name: '100+ Web Dev Templates', desc: 'Premium 100+ Web development products templates which includes various fields like Education website templates, Law websites templates, Beautician website templates and more.', price: 11.00, origPrice: 99.00, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80', purchases: 1240 },
  { id: 'dp2', name: 'Shopify Theme Templates', desc: 'These are premium themes built for modern e-commerce brands looking to scale their stores and increase conversion rates.', price: 14.00, origPrice: 149.00, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', purchases: 892 },
  { id: 'dp3', name: 'Web App All Assets', desc: 'These are premium complete UI kits and functional assets for modern web application design, dashboards, and SaaS platforms.', price: 15.00, origPrice: 199.00, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', purchases: 543 },
  { id: 'dp4', name: '500+ Resume Templates', desc: 'These are ATS friendly, professionally designed resume templates proven to land your dream job interviews in top companies.', price: 18.00, origPrice: 49.00, image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80', purchases: 2100 },
];

const COURSES = [
  { id: 'c1', name: 'Iman Ghadzhi Masterclass', desc: 'The ultimate blueprint to scaling your agency to 6-figures and beyond. Transform your mindset, business, and daily habits.', price: 14.99, origPrice: 500.00, image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80', purchases: 3420 },
  { id: 'c2', name: 'Andrew Tate The Real World', desc: 'Advanced wealth creation strategies, networking, and escaping the matrix. Unmatched value for modern entrepreneurs.', price: 19.99, origPrice: 699.00, image: 'https://images.unsplash.com/photo-1612550761236-e813928f7271?w=800&q=80', purchases: 5120 },
  { id: 'c3', name: 'Luke Belmar Capital Club', desc: 'Exclusive insights into macroeconomics, crypto, dropshipping, and high-level business scaling from the masters.', price: 12.99, origPrice: 299.00, image: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&q=80', purchases: 1890 },
];

const DESIGN_ASSETS = [
  { id: 'da1', name: 'Adobe Assets Bundle', desc: 'Thousands of premium brushes, actions, and templates for advanced Photoshop & Illustrator workflows.', price: 9.99, origPrice: 899.00, image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80', purchases: 4500 },
  { id: 'da2', name: 'Corel Draw Assets', desc: 'Premium vector assets, macros, and templates specifically curated for Corel Draw masters and print designers.', price: 7.99, origPrice: 449.00, image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80', purchases: 1200 },
  { id: 'da3', name: 'Lightroom Presets', desc: 'Cinematic, moody, and vibrant presets for one-click professional photo editing across all desktop and mobile devices.', price: 12.99, origPrice: 299.00, image: 'https://images.unsplash.com/photo-1554050857-c84a8abdb5e5?w=800&q=80', purchases: 6700 },
  { id: 'da4', name: 'Canva Templates Pro', desc: 'Ready-to-use, highly engaging social media, ad, and presentation templates. Drag and drop magic for non-designers.', price: 8.99, origPrice: 199.00, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80', purchases: 8900 },
];

const PREMIUM_SOFTWARES = [
  {
    id: 'ps1',
    name: 'Windows Premium Bundle',
    desc: '30+ Premium Softwares fully activated for lifetime. Boost your productivity and creativity on Windows.',
    list: ["Adobe Master Collection", "Autodesk Suite", "CorelDRAW Graphics", "FL Studio Producer", "Cinema 4D Studio", "Ableton Live Suite", "Premiere Pro CC", "After Effects CC", "DaVinci Resolve Studio", "Sony Vegas Pro"],
    price: 14.99, origPrice: 100.00,
    image: 'https://images.unsplash.com/photo-1618477247222-ac60c6470d04?w=800&q=80', purchases: 5200, icon: <Monitor className="w-6 h-6" />
  },
  {
    id: 'ps2',
    name: 'Mac Premium Bundle',
    desc: '20+ Premium Softwares natively optimized for macOS & Apple Silicon. The ultimate creator suite.',
    list: ["Final Cut Pro X", "Logic Pro X", "CleanMyMac X", "Parallels Desktop", "Affinity Designer", "Affinity Photo", "Camtasia Studio", "Sketch Pro", "Capture One Pro", "Pixelmator Pro"],
    price: 22.99, origPrice: 349.00,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', purchases: 3800, icon: <Monitor className="w-6 h-6" />
  },
  {
    id: 'ps3',
    name: 'Android Premium Bundle',
    desc: '50+ Premium Softwares unlocked. All pro features, no ads, lifetime access for your mobile device.',
    list: ["Spotify Premium", "Netflix Premium", "Kinemaster Pro", "Lightroom Premium", "Canva Pro", "Picsart Gold", "VSCO X", "CapCut Pro", "Truecaller Gold", "PowerDirector Pro"],
    price: 9.99, origPrice: 249.00,
    image: 'https://images.unsplash.com/photo-1607252654015-69a445d8f6b8?w=800&q=80', purchases: 9100, icon: <Smartphone className="w-6 h-6" />
  }
];

const SUCCESS_STORIES = [
  { name: "Alex Carter", title: "19 y/o Agency Owner", quote: "I went from struggling to pay tuition to running a $10k/month agency using the Cartel Codes templates and masterclass strategies. The ROI is beyond measure.", initial: "A" },
  { name: "Sarah Jenkins", title: "E-com Founder", quote: "The Shopify themes increased my conversion rate by 3.5% overnight. The clean code and premium design immediately built trust with my customers.", initial: "S" },
  { name: "David Chen", title: "Freelance Developer", quote: "The web dev templates saved me hundreds of hours. I now take on twice as many clients without burning out. Worth every penny.", initial: "D" },
  { name: "Priya Sharma", title: "Content Creator", quote: "Canva and Adobe assets from this bundle made my social media pop. My engagement has skyrocketed since I started using these premium templates.", initial: "P" },
  { name: "Marcus Thorne", title: "SaaS Entrepreneur", quote: "The Web App UI kits gave my MVP a polished, million-dollar look. We secured our first round of funding purely based on the prototype's aesthetics.", initial: "M" },
  { name: "Elena Rodriguez", title: "Marketing Director", quote: "The masterclasses taught me more than my 4-year degree. The actionable insights on scaling and automation are absolute gold.", initial: "E" }
];

// Barcode static array for consistent rendering
const barcodeWidths = [2, 4, 1, 3, 2, 1, 4, 2, 2, 1, 3, 4, 1, 2, 2, 4, 1, 1, 3, 2, 4, 1, 2, 3];

// --- Sub-Components ---

const HomeHeroSlider = ({ onNavigate }) => {
  const images = [
    "/images/background%201.jpeg",
    "/images/background%202.jpeg",
    "/images/background%203.jpeg"
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden bg-black">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
        >
          <img src={img} alt="Luxury Lifestyle" className="w-full h-full object-cover object-center scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80"></div>
        </div>
      ))}

      <div className="relative z-10 text-center text-white mt-12 flex flex-col items-center px-4">
        <FadeInUp delay={100}>
          <p className="text-xs md:text-sm tracking-[0.2em] uppercase font-medium mb-6">I'm an Entrepreneur</p>
        </FadeInUp>

        <FadeInUp delay={300}>
          <h2 className="text-5xl md:text-7xl lg:text-8xl mb-8 flex items-center justify-center flex-wrap gap-x-4 max-w-6xl mx-auto drop-shadow-2xl">
            <span className="font-light tracking-tight">Helping you</span>
            <span className="font-elegant italic text-6xl md:text-8xl lg:text-[120px] leading-none mt-2 md:mt-0">escape average</span>
          </h2>
        </FadeInUp>

        <FadeInUp delay={400}>
          <p className="text-lg md:text-2xl font-light tracking-widest mb-12 text-white/90 uppercase drop-shadow-md">
            1% habits <span className="text-white/50 mx-2">=</span> 100% results.
          </p>
        </FadeInUp>

        <FadeInUp delay={500}>
          <button onClick={() => onNavigate('visit-us')} className="group relative px-10 py-4 rounded-full border border-white/50 text-sm tracking-widest uppercase font-medium overflow-hidden transition-colors hover:border-white">
            <span className="relative z-10 transition-colors group-hover:text-black">Visit Us</span>
            <div className="absolute inset-0 bg-white transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100"></div>
          </button>
        </FadeInUp>
      </div>
    </section>
  );
};

const ProductCard = ({ product, onAddToCart, onBuyNow }) => (
  <FadeInUp className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col h-full">
    <div className="aspect-[4/3] overflow-hidden relative">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-full">
        Sale
      </div>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-medium leading-tight">{product.name}</h3>
        {product.icon && <div className="text-gray-400">{product.icon}</div>}
      </div>

      <p className="text-gray-500 text-sm mb-4 flex-1 leading-relaxed">{product.desc}</p>

      {product.list && (
        <ul className="mb-6 space-y-1">
          {product.list.map((item, i) => (
            <li key={i} className="text-xs text-gray-500 flex items-center"><Check className="w-3 h-3 mr-2 text-green-500" /> {item}</li>
          ))}
        </ul>
      )}

      <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="flex justify-between text-xs font-medium uppercase tracking-widest text-gray-400 mb-2">
          <span>Demand</span>
          <span className="text-black">{product.purchases} Purchased</span>
        </div>
        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-black h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(95, (product.purchases % 100) + 40)}%` }}></div>
        </div>
      </div>

      <div className="flex flex-col space-y-4 mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-400 line-through mr-2">${product.origPrice.toFixed(2)}</span>
            <span className="text-2xl font-medium">${product.price.toFixed(2)}</span>
          </div>
          <button onClick={() => onAddToCart(product)} className="text-xs font-medium uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
            Add to Cart
          </button>
        </div>
        <button onClick={() => onBuyNow(product)} className="w-full bg-black text-white py-3 rounded-lg text-sm tracking-widest uppercase font-medium hover:bg-neutral-800 transition-colors shadow-lg shadow-black/20">
          Buy Now
        </button>
      </div>
    </div>
  </FadeInUp>
);

const TestimonialSlider = () => {
  return (
    <div className="w-full overflow-hidden py-24 bg-[#fafafa]">
      <FadeInUp className="text-center mb-16 px-6">
        <h2 className="text-4xl md:text-6xl font-light tracking-tight">Youth <span className="font-elegant italic">Success</span></h2>
        <p className="text-gray-500 mt-4 text-lg">Real impact from our premium ecosystem.</p>
      </FadeInUp>

      <div className="relative flex w-full group overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-16 md:w-48 bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-16 md:w-48 bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none"></div>

        <div className="animate-marquee-slow flex w-max space-x-6 px-3 group-hover:[animation-play-state:paused]">
          {[...SUCCESS_STORIES, ...SUCCESS_STORIES].map((story, idx) => (
            <div key={idx} className="w-[280px] md:w-[340px] flex-shrink-0 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-default">
              <div>
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <Quote className="w-6 h-6 text-gray-200 mb-3" />
                <p className="text-gray-600 leading-relaxed mb-6 italic text-sm">"{story.quote}"</p>
              </div>
              <div className="flex items-center space-x-3 border-t border-gray-50 pt-4">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full font-serif text-lg">{story.initial}</div>
                <div>
                  <h4 className="font-medium text-black text-sm">{story.name}</h4>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest">{story.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DatabaseInventory = () => {
  const companyLogos = [
    { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
    { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" },
    { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { name: "Airbnb", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" },
    { name: "Slack", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg" },
    { name: "Vercel", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Vercel_logo_black.svg" }
  ];

  return (
    <>
      <div className="bg-[#0a0a0a] text-white py-32 my-32 relative overflow-hidden rounded-[3rem] shadow-2xl mx-4 md:mx-12 max-w-[1400px] xl:mx-auto border border-white/10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1000px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center px-6">
          <FadeInUp>
            <div className="inline-flex items-center justify-center space-x-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/20 mb-6 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <Database className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-white">Large Scale Data Inventory</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6 leading-tight">
              Database We Have: <span className="font-elegant italic block mt-2 text-5xl md:text-7xl">5 Crore People</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              We have DataBase of <strong>Pan India & International</strong>, which we have large number of inventories of data and assests, <strong>5 crore</strong> peoples database with us with updated list of <strong>2026</strong>. Leverage this for ultimate B2B & B2C outreach.
            </p>
            <a href="mailto:Cartelcodes@gmail.com" className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
              <Mail className="w-4 h-4 mr-2" /> Request Database Access
            </a>
          </FadeInUp>

          <FadeInUp delay={200} className="relative">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-purple-600/10 opacity-50 transition-opacity duration-1000"></div>
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4 relative z-10">
                <div>
                  <h3 className="text-xl font-medium tracking-wide">Data Acquisition Growth</h3>
                  <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-1">Live Database Index (Upto 5 Cr)</p>
                </div>
                <TrendingUp className="w-6 h-6 text-blue-400 animate-pulse" />
              </div>

              {/* Animated SVG Line Chart - Transition Up */}
              <div className="relative w-full h-56 mt-8 pb-6 border-b border-l border-white/20 pl-2">
                <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <linearGradient id="fillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(16, 185, 129, 0.4)" />
                      <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Area Fill that fades/transitions UP */}
                  <path
                    d="M0,140 C 100,140 150,80 250,60 C 320,40 380,20 400,0 L 400,150 L 0,150 Z"
                    fill="url(#fillGradient)"
                    className="origin-bottom transform scale-y-0 opacity-0"
                    style={{ transformBox: 'fill-box', animation: 'scaleUp 1.5s ease-out 0.5s forwards' }}
                  />

                  {/* Line drawing animation */}
                  <path
                    d="M0,140 C 100,140 150,80 250,60 C 320,40 380,20 400,0"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="4"
                    filter="url(#glow)"
                    className="animate-draw-line"
                  />

                  {/* Data Points */}
                  <circle cx="0" cy="140" r="4" fill="#fff" className="animate-pulse shadow-xl opacity-0" style={{ animation: 'fadeIn 0.5s ease-in forwards 0.2s' }} />
                  <circle cx="150" cy="80" r="4" fill="#fff" className="animate-pulse shadow-xl opacity-0" style={{ animation: 'fadeIn 0.5s ease-in forwards 1s' }} />
                  <circle cx="250" cy="60" r="4" fill="#fff" className="animate-pulse shadow-xl opacity-0" style={{ animation: 'fadeIn 0.5s ease-in forwards 1.5s' }} />

                  {/* Final Target Node */}
                  <circle cx="400" cy="0" r="8" fill="#10b981" className="opacity-0 drop-shadow-[0_0_15px_rgba(16,185,129,1)]" style={{ animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 2.5s' }} />
                </svg>

                {/* Y Axis Labels */}
                <div className="absolute left-[-2rem] top-0 bottom-6 flex flex-col justify-between text-[10px] text-gray-500 font-mono">
                  <span>5Cr</span>
                  <span>3Cr</span>
                  <span>1Cr</span>
                  <span>0</span>
                </div>
              </div>

              <div className="flex justify-between mt-4 text-[10px] text-gray-500 font-mono tracking-widest relative z-10 pl-2">
                <span>2022</span>
                <span>2024</span>
                <span className="text-emerald-400 font-bold text-xs bg-emerald-400/10 px-2 py-1 rounded">2026 (UPDATED)</span>
              </div>
            </div>
          </FadeInUp>
        </div>
      </div>

      {/* Global Slider Completely Separated (Now Outside the Black Box) */}
      <div className="mb-32 pt-12 relative z-10 max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-gray-500 font-bold">Trusted Globally By Innovative Companies</p>
        </div>
        <div className="relative overflow-hidden w-full">
          {/* Gradients match the light #fafafa background outside the box */}
          <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#fafafa] to-transparent z-20 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#fafafa] to-transparent z-20 pointer-events-none"></div>

          <div className="animate-marquee flex w-max space-x-24 md:space-x-32 items-center px-8 pb-8 pt-4">
            {[...companyLogos, ...companyLogos, ...companyLogos].map((company, idx) => (
              <div key={idx} className="flex items-center justify-center cursor-default select-none group transition-transform duration-500 hover:-translate-y-2">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-8 md:h-12 w-auto max-w-[160px] object-contain filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const LivePurchaseTicker = () => {
  const [purchase, setPurchase] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const names = ["James W.", "Sarah L.", "Michael B.", "Emma D.", "David C.", "Sophia K.", "Oliver T.", "Isabella R."];
  const products = [...DIGITAL_PRODUCTS, ...COURSES, ...DESIGN_ASSETS, ...PREMIUM_SOFTWARES].map(p => p.name);

  useEffect(() => {
    const triggerNotification = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      setPurchase({ name: randomName, product: randomProduct, time: 'Just now' });
      setIsVisible(true);

      setTimeout(() => setIsVisible(false), 4000);
    };

    const interval = setInterval(triggerNotification, 12000);
    setTimeout(triggerNotification, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed bottom-6 left-6 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
      <div className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl p-4 pr-12 flex items-center space-x-4 max-w-sm">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-inner">
          <Check className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500 leading-tight">
            <span className="font-medium text-black">{purchase?.name}</span> purchased
          </p>
          <p className="text-sm font-medium leading-tight truncate">{purchase?.product}</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{purchase?.time}</p>
        </div>
      </div>
    </div>
  );
};

// --- Main Application ---
export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // User & Data State
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;
      const scrolled = scrollTop / (scrollHeight - clientHeight);
      setScrollProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Updated Firebase Initialization Flow for Preview environment compliance
  useEffect(() => {
    if (auth) {
      const initAuth = async () => {
        try {
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
          } else {
            await signInAnonymously(auth);
          }
        } catch (e) {
          console.warn("Auth initialization fallback:", e);
        }
      };
      initAuth();

      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser && !currentUser.isAnonymous) {
          setUser(currentUser);
          try {
            const userRef = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'profile', 'data');
            await setDoc(userRef, {
              email: currentUser.email,
              name: currentUser.displayName,
              lastLogin: new Date().toISOString()
            }, { merge: true });
          } catch (e) {
            console.error("Firestore error", e);
          }
        } else {
          setUser(null);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleGoogleLogin = async () => {
    if (!auth) return handleMockLogin();
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setIsAuthModalOpen(false);
      showToast("Successfully signed in with Google.");
    } catch (error) {
      showToast("Authentication failed.");
    }
  };

  const handleFacebookLogin = async () => {
    if (!auth) return handleMockLogin();
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      setIsAuthModalOpen(false);
      showToast("Successfully signed in with Facebook.");
    } catch (error) {
      showToast("Authentication failed.");
    }
  };

  const handleMockLogin = () => {
    setUser({ displayName: "Luxury Guest", email: "cartelcodes@gmail.com" });
    setIsAuthModalOpen(false);
    showToast("Mock Sign-In Successful (Firebase Config Missing)");
  };

  const handleLogout = async () => {
    if (auth) await signOut(auth);
    setUser(null);
    setIsProfileMenuOpen(false);
    showToast("You have been logged out.");
  };

  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product]);
    showToast(`${product.name} added to cart!`);
    setIsCartOpen(true);
  };

  const handleBuyNow = (product) => {
    setCartItems([product]);
    setIsCartOpen(true);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (!user) {
      setIsCartOpen(false);
      setIsAuthModalOpen(true);
      showToast("Please sign in to checkout.");
      return;
    }

    const res = await loadRazorpay();
    if (!res) {
      showToast("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    const options = {
      key: 'rzp_test_mockkey_123',
      amount: Math.round(total * 100),
      currency: 'USD',
      name: 'Cartel Codes',
      description: 'Digital Product Purchase',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
      handler: function (response) {
        showToast(`Payment Successful! ID: ${response.razorpay_payment_id || 'MOCK_ID'}`);
        setCartItems([]);
        setIsCartOpen(false);
      },
      prefill: {
        name: user.displayName || 'Customer',
        email: user.email || 'customer@example.com',
      },
      theme: { color: '#111111' }
    };

    try {
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (e) {
      showToast("Simulated Payment Success! (Razorpay modal bypassed in mock mode)");
      setCartItems([]);
      setIsCartOpen(false);
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const navigate = (view) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    scrollToTop();
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 20s linear infinite; }
        
        @keyframes marquee-slow { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee-slow { animation: marquee-slow 40s linear infinite; }

        @keyframes scroll-glow {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .animate-scroll-glow { animation: scroll-glow 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .glass-nav { background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.5); }
        .glass-dark { background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(16px); }
        .font-elegant { font-family: 'Playfair Display', 'Didot', 'Bodoni MT', serif; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* 3D Card Animation Classes */
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .group:hover .group-hover\\:rotate-y-180 { transform: rotateY(180deg); }
        
        /* SVG Line Drawing Animations */
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
        .animate-draw-line {
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          animation: drawLine 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes scaleUp {
          0% { transform: scaleY(0); opacity: 0; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        /* B&W Pencil Sketch Badges Animation */
        @keyframes pencilGlow {
           0%, 100% { filter: drop-shadow(0 0 10px rgba(0,0,0,0.05)); transform: translateY(0); }
           50% { filter: drop-shadow(0 0 20px rgba(0,0,0,0.2)); transform: translateY(-5px); }
        }
        .animate-pencil-glow { animation: pencilGlow 4s ease-in-out infinite; }

        /* Premium Golden Scrolled Nav Animations */
        @keyframes shimmer-sweep {
          0% { left: -100%; }
          50% { left: 200%; }
          100% { left: 200%; }
        }
        @keyframes star-pulse {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.5); opacity: 1; box-shadow: 0 0 10px 2px rgba(251, 191, 36, 0.8); }
          100% { transform: scale(0); opacity: 0; }
        }

        /* Contact Page Specific Animations */
        @keyframes pulse-node {
          0% { box-shadow: 0 0 0 0px rgba(168, 85, 247, 0.4); }
          100% { box-shadow: 0 0 0 20px rgba(168, 85, 247, 0); }
        }
        .animate-pulse-node { animation: pulse-node 2s infinite; }
        
        @keyframes floating {
          0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
          50% { transform: translateY(-15px) rotateX(5deg) rotateY(5deg); }
        }
        .animate-float-3d { animation: floating 6s ease-in-out infinite; }

        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}} />

      {/* --- Toast Notification --- */}
      <div className={`fixed top-12 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${toast ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}>
        <div className="bg-neutral-900 text-white px-6 py-3 rounded-full text-sm font-medium tracking-wide shadow-2xl flex items-center space-x-2">
          <Check className="w-4 h-4 text-green-400" />
          <span>{toast}</span>
        </div>
      </div>

      {/* --- Announcement Bar --- */}
      <div className="bg-[#111] text-white text-[10px] tracking-widest uppercase overflow-hidden whitespace-nowrap py-2 flex relative z-50">
        <div className="animate-marquee flex w-max">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="mx-8 flex items-center">
             ELITE WEB DEV ASSETS   //   ALGORITHMIC TRADING INSIGHTS   //   BUSINESS <span className="mx-8 opacity-40">/</span> SCALING BLUEPRINTS   //   100% FREE ACCESS
            </span>
          ))}
        </div>
      </div>

      {/* --- Header / Navigation --- */}
      <header className={`fixed w-full z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex justify-center ${isScrolled ? 'top-4 px-4' : 'top-[32px] px-0'}`}>
        <div className={`relative transition-all duration-700 flex justify-between items-center w-full ${isScrolled
            ? 'max-w-[900px] rounded-full text-white py-3 px-6 md:px-8 shadow-[0_20px_40px_-10px_rgba(251,191,36,0.2)]'
            : isMobileMenuOpen
              ? 'max-w-[1400px] glass-nav text-neutral-900 py-4 px-4 md:px-12'
              : 'max-w-[1400px] bg-transparent text-white py-4 md:py-6 px-4 md:px-12'
          }`}>

          {isScrolled && !isMobileMenuOpen && (
            <div className="absolute inset-0 rounded-full pointer-events-none z-[-1]">
              {/* 1. Animated Thin Glowing Golden Border */}
              <div className="absolute inset-0 rounded-full overflow-hidden p-[1px]">
                <div className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0_250deg,rgba(251,191,36,0.2)_280deg,#fbbf24_320deg,#fff_360deg)] animate-[spin_3s_linear_infinite]"></div>
                {/* The Dark Premium Glass Center */}
                <div className="absolute inset-[1px] rounded-full bg-black/50 backdrop-blur-2xl border border-white/5"></div>
              </div>

              {/* 2. Scrolling Loader Progress Bar */}
              <div className="absolute bottom-[2px] left-6 right-6 h-[2px] bg-white/5 rounded-full overflow-hidden z-10">
                <div
                  className="h-full bg-gradient-to-r from-yellow-600/30 via-yellow-400 to-yellow-200 rounded-full transition-all duration-150 ease-out shadow-[0_0_10px_rgba(251,191,36,1)]"
                  style={{ width: `${scrollProgress * 100}%` }}
                ></div>
              </div>

              {/* 3. Shimmer Sweep & Fade Glittery Particles */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] animate-[shimmer-sweep_6s_infinite_ease-in-out]"></div>

                <div className="absolute top-[20%] left-[15%] w-[2px] h-[2px] bg-yellow-300 rounded-full animate-[star-pulse_2s_infinite_0s]"></div>
                <div className="absolute bottom-[25%] right-[20%] w-[1px] h-[1px] bg-white rounded-full animate-[star-pulse_3s_infinite_1s]"></div>
                <div className="absolute top-[40%] right-[10%] w-[2px] h-[2px] bg-yellow-200 rounded-full animate-[star-pulse_1.5s_infinite_0.5s]"></div>
                <div className="absolute bottom-[20%] left-[30%] w-[1.5px] h-[1.5px] bg-yellow-400 rounded-full animate-[star-pulse_2.5s_infinite_1.5s]"></div>
                <div className="absolute top-[60%] left-[60%] w-[2px] h-[2px] bg-white rounded-full animate-[star-pulse_2.2s_infinite_0.8s]"></div>
                <div className="absolute top-[30%] left-[45%] w-[1px] h-[1px] bg-yellow-100 rounded-full animate-[star-pulse_3.5s_infinite_0.2s]"></div>
                <div className="absolute bottom-[45%] right-[35%] w-[2.5px] h-[2.5px] bg-yellow-300 rounded-full animate-[star-pulse_2.8s_infinite_1.1s]"></div>
              </div>
            </div>
          )}

          <nav className="relative z-10 flex space-x-2 md:space-x-8 items-center text-[10px] md:text-xs tracking-widest font-medium uppercase">
            <div className="group relative block">
              <button className={`flex items-center transition-colors ${isScrolled && !isMobileMenuOpen
                  ? 'bg-white/10 text-white border border-white/20 px-3 py-1.5 md:px-5 md:py-2 rounded-full hover:bg-white/20'
                  : isMobileMenuOpen
                    ? 'text-neutral-900 hover:text-gray-500'
                    : 'bg-neutral-900 text-white px-3 py-1.5 md:px-5 md:py-2 rounded-full hover:bg-neutral-800'
                }`}>
                SHOP <ChevronDown className="w-4 h-4 ml-1 opacity-70 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full left-0 pt-6 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out">
                <div className="bg-white text-black p-6 w-56 rounded-sm shadow-2xl flex flex-col space-y-4 border border-gray-100">
                  <button onClick={() => navigate('digital-products')} className="text-left hover:text-gray-500 transition-colors">Digital Products</button>
                  <button onClick={() => navigate('courses')} className="text-left hover:text-gray-500 transition-colors">Courses</button>
                  <button onClick={() => navigate('designing-assets')} className="text-left hover:text-gray-500 transition-colors">Designing Assets</button>
                  <button onClick={() => navigate('premium-softwares')} className="text-left hover:text-gray-500 transition-colors">Premium Softwares</button>
                </div>
              </div>
            </div>

            <div className="hidden md:block group relative">
              <button className="flex items-center hover:opacity-70 transition-opacity py-2">
                PAGES <ChevronDown className="w-4 h-4 ml-1 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full left-0 pt-6 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out">
                <div className="bg-white text-black p-6 w-64 rounded-sm shadow-2xl flex flex-col space-y-4 border border-gray-100">
                  <button onClick={() => navigate('visit-us')} className="text-left hover:text-gray-500 transition-colors">Visit Us</button>
                  <button onClick={() => navigate('faq')} className="text-left hover:text-gray-500 transition-colors">FAQ's & Help</button>
                  <button onClick={() => navigate('our-lifestyle')} className="text-left hover:text-gray-500 transition-colors">Our Lifestyle</button>
                  <button onClick={() => navigate('your-trust-worth')} className="text-left hover:text-gray-500 transition-colors">Your Trust & Worth</button>
                  <button onClick={() => navigate('terms-conditions')} className="text-left hover:text-gray-500 transition-colors">Terms & Conditions</button>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('about')} className="hidden md:block hover:opacity-70 transition-opacity">ABOUT</button>
          </nav>

          <div className="absolute left-[48%] transform -translate-x-1/2 cursor-pointer flex items-center space-x-3 z-10" onClick={() => navigate('home')}>
            <img src={LOGO_SRC} alt="Cartel Codes Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
            <h1 className="text-2sm md:text-xl font-medium tracking-tight flex items-baseline">
              <span className="font-serif italic mr-1 text-2sm">Cartel</span>
              <span>Codes</span>
            </h1>
          </div>

          <div className="relative z-10 flex items-center space-x-4 md:space-x-6">
            <button onClick={() => navigate('contact')} className="hidden md:block text-xs tracking-widest font-medium uppercase hover:opacity-70 transition-opacity">CONTACT</button>
            <div className="flex items-center space-x-3 md:space-x-5">
              <button onClick={() => setIsSearchOpen(true)} className="hover:opacity-70 transition-opacity"><Search className="w-5 h-5 stroke-[1.5]" /></button>

              <div className="relative hidden sm:block">
                <button
                  onClick={() => user ? setIsProfileMenuOpen(!isProfileMenuOpen) : setIsAuthModalOpen(true)}
                  className="hover:opacity-70 transition-opacity flex items-center"
                >
                  <User className="w-5 h-5 stroke-[1.5]" />
                </button>

                {user && isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-4 w-48 bg-white text-black rounded-sm shadow-2xl border border-gray-100 p-2 py-4 z-50 transition-all">
                    <div className="px-4 pb-3 border-b border-gray-100 mb-2">
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-medium truncate">{user.displayName || user.email}</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center transition-colors">
                      <Settings className="w-4 h-4 mr-2 text-gray-500" /> Account Settings
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>

              <button onClick={() => setIsCartOpen(true)} className="relative hover:opacity-70 transition-opacity">
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-black text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
              <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- Mobile Menu Overlay --- */}
      <div className={`fixed inset-0 bg-white z-30 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} pt-32 px-8 flex flex-col md:hidden overflow-y-auto`}>
        <div className="flex flex-col space-y-6 text-2xl font-light text-black pb-12">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-sm tracking-widest uppercase text-gray-400 block mb-4">Shop</span>
            <div className="flex flex-col space-y-3 pl-4 text-xl">
              <button onClick={() => navigate('digital-products')} className="text-left hover:text-gray-500">Digital Products</button>
              <button onClick={() => navigate('courses')} className="text-left hover:text-gray-500">Courses</button>
              <button onClick={() => navigate('designing-assets')} className="text-left hover:text-gray-500">Designing Assets</button>
              <button onClick={() => navigate('premium-softwares')} className="text-left hover:text-gray-500">Premium Softwares</button>
            </div>
          </div>
          <div className="border-b border-gray-100 pb-4">
            <span className="text-sm tracking-widest uppercase text-gray-400 block mb-4">Pages</span>
            <div className="flex flex-col space-y-3 pl-4 text-xl">
              <button onClick={() => navigate('visit-us')} className="text-left hover:text-gray-500">Visit Us</button>
              <button onClick={() => navigate('faq')} className="text-left hover:text-gray-500">FAQ's & Help</button>
              <button onClick={() => navigate('our-lifestyle')} className="text-left hover:text-gray-500">Our Lifestyle</button>
              <button onClick={() => navigate('your-trust-worth')} className="text-left hover:text-gray-500">Your Trust & Worth</button>
              <button onClick={() => navigate('terms-conditions')} className="text-left hover:text-gray-500">Terms & Conditions</button>
            </div>
          </div>
          <button onClick={() => navigate('about')} className="text-left border-b border-gray-100 pb-4 hover:text-gray-500">About</button>
          <button onClick={() => navigate('contact')} className="text-left border-b border-gray-100 pb-4 hover:text-gray-500">Contact</button>
          <button
            onClick={() => { setIsMobileMenuOpen(false); user ? handleLogout() : setIsAuthModalOpen(true); }}
            className="text-left border-b border-gray-100 pb-4 hover:text-gray-500"
          >
            {user ? 'Logout' : 'Sign In'}
          </button>
        </div>
      </div>

      {/* --- Search Modal --- */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 glass-dark" onClick={() => setIsSearchOpen(false)}></div>
        <div className={`relative w-full max-w-4xl px-6 transition-transform duration-700 delay-100 ${isSearchOpen ? 'translate-y-0 scale-100' : 'translate-y-12 scale-95'}`}>
          <button onClick={() => setIsSearchOpen(false)} className="absolute -top-16 right-6 text-white hover:opacity-70"><X className="w-8 h-8" /></button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for courses, assets..."
              autoFocus={isSearchOpen}
              className="w-full bg-transparent border-b-2 border-white/20 pb-4 text-4xl md:text-6xl text-white font-light focus:outline-none focus:border-white transition-colors placeholder-white/30"
            />
            <Search className="absolute right-0 top-2 w-8 h-8 md:w-12 md:h-12 text-white/50" />
          </div>
          <p className="mt-6 text-white/50 text-sm tracking-widest uppercase">Press enter to search</p>
        </div>
      </div>

      {/* --- Cart Slide-Out --- */}
      <div className={`fixed inset-0 z-50 transition-all duration-500 ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsCartOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-lg font-medium tracking-wide uppercase">Your Cart ({cartItems.length})</h2>
            <button onClick={() => setIsCartOpen(false)} className="hover:opacity-70"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center mt-12">Your cart is empty.</p>
            ) : (
              cartItems.map((item, idx) => (
                <div key={idx} className="flex space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Digital License</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                      <button onClick={() => {
                        const newCart = [...cartItems];
                        newCart.splice(idx, 1);
                        setCartItems(newCart);
                      }} className="text-xs text-gray-400 hover:text-red-500 underline">Remove</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-6 text-lg font-medium">
              <span>Subtotal</span>
              <span>${cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className="w-full bg-black text-white py-4 rounded-sm text-sm tracking-widest uppercase font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Checkout Securely
            </button>
          </div>
        </div>
      </div>

      {/* --- Profile / Auth Modal --- */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${isAuthModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAuthModalOpen(false)}></div>
        <div className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transition-transform duration-500 delay-100 ${isAuthModalOpen ? 'translate-y-0 scale-100' : 'translate-y-12 scale-95'}`}>
          <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black z-10"><X className="w-5 h-5" /></button>

          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-medium tracking-tight flex items-baseline justify-center mb-2">
                <span className="font-serif italic mr-1 text-3xl">Tht</span>
                <span>Ceo</span>
              </h1>
              <p className="text-sm text-gray-500">Access your premium courses & assets.</p>
            </div>

            <div className="flex space-x-4 mb-8 border-b border-gray-100">
              <button
                className={`pb-2 flex-1 text-sm font-medium uppercase tracking-wider transition-colors ${authTab === 'login' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'}`}
                onClick={() => setAuthTab('login')}
              >
                Sign In
              </button>
              <button
                className={`pb-2 flex-1 text-sm font-medium uppercase tracking-wider transition-colors ${authTab === 'signup' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'}`}
                onClick={() => setAuthTab('signup')}
              >
                Sign Up
              </button>
            </div>

            <div className="space-y-4">
              <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center space-x-2 border border-gray-200 py-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-black">Continue with Google</span>
              </button>

              <button onClick={handleFacebookLogin} className="w-full flex items-center justify-center space-x-2 border border-gray-200 py-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <Facebook className="w-5 h-5 text-[#1877F2]" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-black">Continue with Facebook</span>
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-xs text-gray-400 uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <input type="email" placeholder="Email Address" className="w-full border border-gray-200 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-black transition-colors" />
              <input type="password" placeholder="Password" className="w-full border border-gray-200 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-black transition-colors" />

              <button className="w-full bg-black text-white py-3 rounded-lg text-sm tracking-widest uppercase font-medium hover:bg-neutral-800 transition-colors">
                {authTab === 'login' ? 'Log In' : 'Create Account'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =======================
          MAIN VIEWS
      ======================= */}
      {currentView === 'home' && (
        <main>
          {/* --- Hero Section Slideshow --- */}
          <HomeHeroSlider onNavigate={navigate} />

          {/* --- Animated Glowing Scroll Line --- */}
          <div className="w-[2px] h-48 mx-auto relative overflow-hidden my-20 bg-gradient-to-b from-transparent via-gray-300 to-transparent">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-black to-transparent animate-scroll-glow shadow-[0_0_20px_5px_rgba(0,0,0,0.8)]"></div>
          </div>

          {/* --- Intro & Meaning Section --- */}
          <div className="max-w-4xl mx-auto text-center px-6 mt-16 mb-20">
            <FadeInUp>
              <h2 className="text-xs tracking-[0.2em] uppercase font-bold text-gray-400 mb-6">THE CORE MISSION</h2>
              <h3 className="text-4xl md:text-6xl font-light tracking-tight mb-10">
               The Ultimate Ecosystem <span className="font-elegant italic">for Builders & Traders</span>
              </h3>
              <div className="text-lg md:text-xl text-gray-600 leading-relaxed text-justify md:text-center space-y-6">
                <p>
                 Motivation gets you started, but having the right resources is what builds an empire. Cartel Codes is a premier, open-access community forged specifically for web developers, business founders, and financial traders. We live in an era where high-level knowledge is often gatekept, but we are here to ensure that average is never your default.
                </p>
                <p>
                Consistency and access to the right tools are the only metrics that matter. We believe everyone deserves the absolute right to learn, build, and gain without financial barriers. That is why every premium asset, coding resource, and market insight provided here is 100% free. <strong> Whether</strong> you are engineering responsive, high-tech platforms, scaling a new enterprise, or analyzing algorithmic market structures, Cartel Codes is your manifesto to refuse the ordinary. We operate on relentless execution, turning raw ambition into undeniable reality.
                </p>
              </div>
            </FadeInUp>
          </div>

          {/* Pencil Theme B&W Badges Section */}
          <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-12 md:gap-24 mb-32 px-6">
            <FadeInUp delay={100} className="flex flex-col items-center group animate-pencil-glow" style={{ animationDelay: '0s' }}>
              <div className="w-24 h-24 bg-white border border-gray-300 rounded-full flex items-center justify-center text-black mb-4 shadow-[5px_5px_15px_rgba(0,0,0,0.05),-5px_-5px_15px_rgba(255,255,255,1)] group-hover:scale-110 transition-transform relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,black_1px,transparent_1px)] bg-[size:4px_4px]"></div>
                <Award className="w-10 h-10 stroke-[1]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-800">Elite Standards</span>
            </FadeInUp>
            <FadeInUp delay={200} className="flex flex-col items-center group animate-pencil-glow" style={{ animationDelay: '1s' }}>
              <div className="w-24 h-24 bg-white border border-gray-300 rounded-full flex items-center justify-center text-black mb-4 shadow-[5px_5px_15px_rgba(0,0,0,0.05),-5px_-5px_15px_rgba(255,255,255,1)] group-hover:scale-110 transition-transform relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,black_1px,transparent_1px)] bg-[size:4px_4px]"></div>
                <Star className="w-10 h-10 stroke-[1]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-800">Global Mastery</span>
            </FadeInUp>
            <FadeInUp delay={300} className="flex flex-col items-center group animate-pencil-glow" style={{ animationDelay: '2s' }}>
              <div className="w-24 h-24 bg-white border border-gray-300 rounded-full flex items-center justify-center text-black mb-4 shadow-[5px_5px_15px_rgba(0,0,0,0.05),-5px_-5px_15px_rgba(255,255,255,1)] group-hover:scale-110 transition-transform relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,black_1px,transparent_1px)] bg-[size:4px_4px]"></div>
                <ShieldCheck className="w-10 h-10 stroke-[1]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-800">100% Trust</span>
            </FadeInUp>
          </div>

          {/* --- Featured Shop Products --- */}
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 my-32">
            <FadeInUp className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-light tracking-tight">Featured <span className="font-elegant italic">Collections</span></h2>
              <p className="text-gray-500 mt-4 text-lg">Curated ecosystems for your digital growth.</p>
            </FadeInUp>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Category 1 */}
              <FadeInUp delay={100} onClick={() => navigate('digital-products')} className="group cursor-pointer relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop" alt="Digital Products" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform transition-transform duration-500">
                  <span className="bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 inline-block shadow-[0_0_15px_rgba(220,38,38,0.5)]">Get 89% Off</span>
                  <h3 className="text-2xl font-medium mb-2">Digital Products</h3>
                  <p className="text-gray-300 text-sm flex items-center">Web templates & kits <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" /></p>
                </div>
              </FadeInUp>

              {/* Category 2 */}
              <FadeInUp delay={200} onClick={() => navigate('courses')} className="group cursor-pointer relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop" alt="Elite Courses" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform transition-transform duration-500">
                  <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 inline-block shadow-[0_0_15px_rgba(234,179,8,0.5)]">Flash Sale 97% Off</span>
                  <h3 className="text-2xl font-medium mb-2">Elite Courses</h3>
                  <p className="text-gray-300 text-sm flex items-center">Masterclass Blueprints <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" /></p>
                </div>
              </FadeInUp>

              {/* Category 3 */}
              <FadeInUp delay={300} onClick={() => navigate('designing-assets')} className="group cursor-pointer relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop" alt="Designing Assets" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform transition-transform duration-500">
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 inline-block shadow-[0_0_15px_rgba(147,51,234,0.5)]">Huge Discount</span>
                  <h3 className="text-2xl font-medium mb-2">Designing Assets</h3>
                  <p className="text-gray-300 text-sm flex items-center">Adobe & Corel Resources <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" /></p>
                </div>
              </FadeInUp>

              {/* Category 4 - Premium Softwares */}
              <FadeInUp delay={400} onClick={() => navigate('premium-softwares')} className="group cursor-pointer relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <img src="https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=800&auto=format&fit=crop" alt="Premium Softwares" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform transition-transform duration-500">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 inline-block shadow-[0_0_15px_rgba(6,182,212,0.5)]">Lifetime Access</span>
                  <h3 className="text-2xl font-medium mb-2">Premium Softwares</h3>
                  <p className="text-gray-300 text-sm flex items-center">Win, Mac & Android <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" /></p>
                </div>
              </FadeInUp>
            </div>
          </div>

          {/* --- Impact / Stats Section --- */}
          <div className="bg-black text-white py-32 my-32 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neutral-900 rounded-full mix-blend-overlay filter blur-[100px] opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neutral-800 rounded-full mix-blend-overlay filter blur-[100px] opacity-50"></div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
              <FadeInUp className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-light tracking-tight">Impacting the <span className="font-elegant italic">Youth</span></h2>
                <p className="text-gray-400 mt-6 text-lg md:text-xl max-w-2xl mx-auto">We have supported thousands of ambitious individuals globally to break free and build their digital empires.</p>
              </FadeInUp>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center border-t border-white/10 pt-20">
                <FadeInUp delay={100} className="flex flex-col items-center">
                  <Users className="w-8 h-8 text-gray-500 mb-4" />
                  <h4 className="text-5xl font-medium mb-3">10k+</h4>
                  <p className="text-xs uppercase tracking-widest text-gray-500">Students Taught</p>
                </FadeInUp>
                <FadeInUp delay={200} className="flex flex-col items-center">
                  <Award className="w-8 h-8 text-gray-500 mb-4" />
                  <h4 className="text-5xl font-medium mb-3">500+</h4>
                  <p className="text-xs uppercase tracking-widest text-gray-500">Premium Assets</p>
                </FadeInUp>
                <FadeInUp delay={300} className="flex flex-col items-center">
                  <Globe className="w-8 h-8 text-gray-500 mb-4" />
                  <h4 className="text-5xl font-medium mb-3">50+</h4>
                  <p className="text-xs uppercase tracking-widest text-gray-500">Countries Reached</p>
                </FadeInUp>
                <FadeInUp delay={400} className="flex flex-col items-center">
                  <ShieldCheck className="w-8 h-8 text-gray-500 mb-4" />
                  <h4 className="text-5xl font-medium mb-3">100%</h4>
                  <p className="text-xs uppercase tracking-widest text-gray-500">Verified Growth</p>
                </FadeInUp>
              </div>
            </div>
          </div>

          {/* --- ID Card Identity Section (3D Flipping Variant) --- */}
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 my-32 grid md:grid-cols-2 gap-16 items-center">

            <FadeInUp className="order-2 md:order-1 relative perspective-1000 w-[320px] h-[500px] mx-auto group z-10 cursor-pointer">
              {/* ID Card 3D Container */}
              <div className="w-full h-full relative preserve-3d transition-transform duration-1000 group-hover:rotate-y-180 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2.5rem]">

                {/* ---- FRONT SIDE --- */}
                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-900 via-black to-neutral-900 rounded-[2.5rem] border border-white/20 p-6 flex flex-col overflow-hidden">
                  {/* Ambient light glow */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500 rounded-full mix-blend-screen filter blur-[60px] opacity-20"></div>

                  <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6 relative z-10">
                    <div className="flex items-center gap-2">
                      <img src={LOGO_SRC} alt="Cartel Codes Logo" className="w-5 h-5 object-contain" />
                      <span className="text-white text-xs font-bold tracking-widest uppercase">Cartel Codes</span>
                    </div>
                    <span className="text-[10px] text-gray-400 tracking-widest font-mono bg-white/10 px-2 py-1 rounded">ID: {Math.floor(1000 + Math.random() * 9000)}-{String.fromCharCode(65 + Math.floor(Math.random() * 26))}</span>
                  </div>

                  <div className="flex flex-col items-center flex-1 relative z-10">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-[3px] border-white/20 mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                      <img src="public/images/ceo.png" className="w-full h-full object-cover grayscale" alt="CEO" />
                    </div>
                    <h3 className="text-white text-2xl font-medium tracking-wider mb-1">Awais khan</h3>
                    <p className="text-blue-400 text-xs uppercase tracking-widest mb-6">FOUNDER & DIRECTOR</p>

                    <div className="w-full space-y-3 text-[10px] text-gray-400 font-mono tracking-wider px-2">
                      <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-gray-500">LOC</span> <span className="text-white">Hyderabad, IN // Global Grid</span></div>
                      <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-gray-500">AUTHORITY</span> <span className="text-white">Cartel Codes Org</span></div>
                       <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-gray-500">CONTACT</span> <span className="text-white">cartelcodes@gmail.com</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">CERT ID</span> <span className="text-white text-blue-300">CC-2026-DEV</span></div>
                    </div>

                    {/* Barcode at the bottom of front card */}
                    <div className="mt-auto pt-6 flex justify-center items-end h-10 w-full opacity-60">
                      {barcodeWidths.map((w, i) => (
                        <div key={i} className="bg-white h-full mx-[1px]" style={{ width: `${w}px` }}></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ---- BACK SIDE --- */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-black rounded-[2.5rem] border border-white/20 flex flex-col items-center justify-center overflow-hidden shadow-[inset_0_0_50px_rgba(255,255,255,0.15)]">
                  {/* Back glowing pattern deeply professional */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0,transparent_60%)] animate-pulse"></div>
                  <div className="relative z-10 flex flex-col items-center text-center p-8">
                    <img src={LOGO_SRC} alt="ThtCeo Backside Logo" className="w-20 h-20 mb-6 object-contain" />
                    <span className="text-white tracking-[0.3em] text-xl font-light uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">Cartel Codes</span>
                    <span className="text-white tracking-[0.2em] text-sm font-light uppercase mt-2">Organization</span>
                    <div className="w-12 h-px bg-white/30 my-6"></div>
                    <span className="text-gray-400 tracking-widest text-[10px] uppercase">STATUS: 100% VERIFIED</span>
                    <span className="text-gray-500 tracking-widest text-[8px] uppercase mt-2">LIFETIME AUTHORIZATION</span>
                  </div>
                </div>

              </div>
            </FadeInUp>

            <FadeInUp className="order-1 md:order-2 md:pl-12">
              <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-8">The Elite <span className="font-elegant italic">Identity</span></h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-6">Becoming a part of the Inner Circle isn't just about accessing files; it's about holding the identity of an executor. We provide the certification of authority.</p>
              <p className="text-lg text-gray-500 leading-relaxed mb-10">When you carry the Cartel Codes badge, you signal to the market that your standards are uncompromising. You are part of an organization forged in excellence. <span className="text-black italic ml-1">Hover the card to reveal authorization.</span></p>
              <button onClick={() => navigate('about')} className="text-sm font-medium uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors inline-flex items-center">
                Read The Origin Story <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </FadeInUp>
          </div>

          {/* --- Success Story Slider Section --- */}
          <TestimonialSlider />

          {/* --- Database Inventory & Companies Slider --- */}
          <DatabaseInventory />

        </main>
      )}

      {/* --- Digital Products --- */}
      {currentView === 'digital-products' && (
        <main className="min-h-screen pb-24">
          <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden mb-24">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" alt="Digital Products" className="w-full h-full object-cover object-center scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-black/50 to-black/80"></div>
            </div>
            <div className="relative z-10 text-center text-white mt-12 flex flex-col items-center px-4">
              <FadeInUp delay={100}><p className="text-xs tracking-[0.2em] uppercase font-medium mb-6">Elevate Your Workflow</p></FadeInUp>
              <FadeInUp delay={300}>
                <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6 drop-shadow-2xl">Premium <span className="font-elegant italic">Digital Products</span></h1>
              </FadeInUp>
            </div>
          </section>
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {DIGITAL_PRODUCTS.map(product => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />)}
            </div>
          </div>
        </main>
      )}

      {/* --- Courses --- */}
      {currentView === 'courses' && (
        <main className="min-h-screen pb-24">
          <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden mb-24">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2564&auto=format&fit=crop" alt="Elite Education" className="w-full h-full object-cover object-center scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-black/40 to-black/60"></div>
            </div>
            <div className="relative z-10 text-center text-white mt-12 flex flex-col items-center px-4">
              <FadeInUp delay={100}><p className="text-xs tracking-[0.2em] uppercase font-medium mb-6">Master Your Craft</p></FadeInUp>
              <FadeInUp delay={300}>
                <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6 drop-shadow-2xl">Elite <span className="font-elegant italic">Education</span></h1>
              </FadeInUp>
            </div>
          </section>
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {COURSES.map(product => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />)}
            </div>
          </div>
        </main>
      )}

      {/* --- Designing Assets --- */}
      {currentView === 'designing-assets' && (
        <main className="min-h-screen pb-24">
          <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden mb-24">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop" alt="Designing Assets" className="w-full h-full object-cover object-center scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-black/50 to-black/70"></div>
            </div>
            <div className="relative z-10 text-center text-white mt-12 flex flex-col items-center px-4">
              <FadeInUp delay={100}><p className="text-xs tracking-[0.2em] uppercase font-medium mb-6">Unlock Creative Potential</p></FadeInUp>
              <FadeInUp delay={300}>
                <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6 drop-shadow-2xl">Designing <span className="font-elegant italic">Assets</span></h1>
              </FadeInUp>
            </div>
          </section>
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {DESIGN_ASSETS.map(product => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />)}
            </div>
          </div>
        </main>
      )}

      {/* --- Premium Softwares --- */}
      {currentView === 'premium-softwares' && (
        <main className="min-h-screen pb-24">
          <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden mb-24">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=2564&auto=format&fit=crop" alt="Premium Softwares" className="w-full h-full object-cover object-center scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-black/50 to-black/80"></div>
            </div>
            <div className="relative z-10 text-center text-white mt-12 flex flex-col items-center px-4">
              <FadeInUp delay={100}><p className="text-xs tracking-[0.2em] uppercase font-medium mb-6">Ultimate Digital Arsenal</p></FadeInUp>
              <FadeInUp delay={300}>
                <h1 className="text-5xl md:text-8xl font-light tracking-tight mb-6 drop-shadow-2xl">Premium <span className="font-elegant italic">Softwares</span></h1>
              </FadeInUp>
            </div>
          </section>

          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <FadeInUp>
                <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">Cross-Platform <span className="font-elegant italic">Dominance</span></h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                  Stop paying exorbitant subscription fees. Get lifetime access to the most powerful tools in the industry across Windows, Mac, and Android.
                  Fully activated. 100% Secure.
                </p>
              </FadeInUp>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {PREMIUM_SOFTWARES.map((product, idx) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
              ))}
            </div>
          </div>
        </main>
      )}

      {/* --- Our Lifestyle Page --- */}
      {currentView === 'our-lifestyle' && (
        <main className="min-h-screen pb-24 bg-white">
          <section className="relative h-[70vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=2564&auto=format&fit=crop" alt="Travel Landscape" className="w-full h-full object-cover object-center scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-black/30 to-black/60"></div>
            </div>
            <div className="relative z-10 text-center text-white mt-12 flex flex-col items-center px-4">
              <FadeInUp delay={100}>
                <p className="text-xs tracking-[0.2em] uppercase font-medium mb-6">The Journey Begins</p>
              </FadeInUp>
              <FadeInUp delay={300}>
                <h1 className="text-5xl md:text-8xl font-light tracking-tight mb-6 drop-shadow-2xl">
                  Our <span className="font-elegant italic">Lifestyle</span>
                </h1>
              </FadeInUp>
            </div>
          </section>

          <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-24 space-y-32">

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <FadeInUp>
                <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-8">Introduction: Why we should <span className="font-elegant italic">travel</span></h2>
                <p className="text-lg text-gray-500 leading-relaxed mb-6">Traveling is the ultimate rebellion against the matrix. It shatters the illusions of a stationary life, exposing you to diverse cultures, untapped opportunities, and a profound understanding of the global economy.</p>
                <p className="text-lg text-gray-500 leading-relaxed">It’s not just a vacation; it’s an education that forces you to adapt, network, and see the world through the lens of a true visionary.</p>
              </FadeInUp>
              <FadeInUp delay={200}>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2574&auto=format&fit=crop" alt="Airplane Wing" className="w-full h-full object-cover" />
                </div>
              </FadeInUp>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <FadeInUp delay={200} className="order-2 md:order-1">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2560&auto=format&fit=crop" alt="Peaceful Mindset" className="w-full h-full object-cover" />
                </div>
              </FadeInUp>
              <FadeInUp className="order-1 md:order-2 md:pl-12">
                <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-8">Peace <span className="font-elegant italic">Mindset</span></h2>
                <p className="text-lg text-gray-500 leading-relaxed mb-6">True wealth is peace of mind. As you traverse the globe, the noise of average existence fades away. You learn the power of silence, the strength in solitude, and the absolute clarity required to build empires.</p>
                <p className="text-lg text-gray-500 leading-relaxed">A peaceful mind is a dangerous weapon in the business world. It allows you to strike with precision while the rest are reacting to chaos.</p>
              </FadeInUp>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-12 rounded-3xl mb-16">
              <FadeInUp>
                <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-12 text-center">Places I've <span className="font-elegant italic">Traveled</span></h2>
                <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">Real experiences from my global adventures. Here are the actual costs and insights from my travels.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-6">
                      <span className="text-4xl mr-4">🇫🇷</span>
                      <div>
                        <h3 className="text-2xl font-semibold">Paris, France</h3>
                        <p className="text-gray-500">2023 • 8 Days</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="font-medium">Flight (Delhi-Paris):</span><span className="text-green-600 font-semibold">$650</span></div>
                      <div className="flex justify-between"><span className="font-medium">Hotel (7 nights, 4-star):</span><span className="text-green-600 font-semibold">$850</span></div>
                      <div className="flex justify-between"><span className="font-medium">Food & Local Transport:</span><span className="text-green-600 font-semibold">$420</span></div>
                      <div className="flex justify-between"><span className="font-medium">Activities & Shopping:</span><span className="text-green-600 font-semibold">$380</span></div>
                      <div className="flex justify-between font-bold text-lg border-t pt-3 mt-4"><span>Total Spent:</span><span className="text-blue-600">$2300</span></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 italic">Louvre, Eiffel Tower, Seine River cruise, authentic French cuisine</p>
                  </div>

                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-6">
                      <span className="text-4xl mr-4">🇦🇪</span>
                      <div>
                        <h3 className="text-2xl font-semibold">Dubai, UAE</h3>
                        <p className="text-gray-500">2023 • 6 Days</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="font-medium">Flight (Delhi-Dubai):</span><span className="text-green-600 font-semibold">$280</span></div>
                      <div className="flex justify-between"><span className="font-medium">Hotel (5 nights, 5-star):</span><span className="text-green-600 font-semibold">$720</span></div>
                      <div className="flex justify-between"><span className="font-medium">Food & Transport:</span><span className="text-green-600 font-semibold">$350</span></div>
                      <div className="flex justify-between"><span className="font-medium">Activities & Desert Safari:</span><span className="text-green-600 font-semibold">$450</span></div>
                      <div className="flex justify-between font-bold text-lg border-t pt-3 mt-4"><span>Total Spent:</span><span className="text-blue-600">$1800</span></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 italic">Burj Khalifa, Palm Jumeirah, desert safari, luxury shopping</p>
                  </div>

                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-6">
                      <span className="text-4xl mr-4">🇮🇹</span>
                      <div>
                        <h3 className="text-2xl font-semibold">Rome & Milan, Italy</h3>
                        <p className="text-gray-500">2024 • 10 Days</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="font-medium">Flight (Delhi-Rome):</span><span className="text-green-600 font-semibold">$580</span></div>
                      <div className="flex justify-between"><span className="font-medium">Hotel (9 nights, boutique):</span><span className="text-green-600 font-semibold">$950</span></div>
                      <div className="flex justify-between"><span className="font-medium">Food & Train Travel:</span><span className="text-green-600 font-semibold">$480</span></div>
                      <div className="flex justify-between"><span className="font-medium">Colosseum & Art Tours:</span><span className="text-green-600 font-semibold">$320</span></div>
                      <div className="flex justify-between font-bold text-lg border-t pt-3 mt-4"><span>Total Spent:</span><span className="text-blue-600">$2330</span></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 italic">Colosseum, Vatican City, Milan fashion district, authentic Italian pasta</p>
                  </div>

                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-6">
                      <span className="text-4xl mr-4">🇯🇵</span>
                      <div>
                        <h3 className="text-2xl font-semibold">Tokyo, Japan</h3>
                        <p className="text-gray-500">2024 • 7 Days</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="font-medium">Flight (Delhi-Tokyo):</span><span className="text-green-600 font-semibold">$520</span></div>
                      <div className="flex justify-between"><span className="font-medium">Hotel (6 nights, traditional):</span><span className="text-green-600 font-semibold">$680</span></div>
                      <div className="flex justify-between"><span className="font-medium">Food & JR Pass:</span><span className="text-green-600 font-semibold">$390</span></div>
                      <div className="flex justify-between"><span className="font-medium">Temples & Technology:</span><span className="text-green-600 font-semibold">$290</span></div>
                      <div className="flex justify-between font-bold text-lg border-t pt-3 mt-4"><span>Total Spent:</span><span className="text-blue-600">$1880</span></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 italic">Shibuya Crossing, Mount Fuji, sushi experiences, bullet train</p>
                  </div>

                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-6">
                      <span className="text-4xl mr-4">🇪🇸</span>
                      <div>
                        <h3 className="text-2xl font-semibold">Barcelona, Spain</h3>
                        <p className="text-gray-500">2024 • 5 Days</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="font-medium">Flight (Delhi-Barcelona):</span><span className="text-green-600 font-semibold">$550</span></div>
                      <div className="flex justify-between"><span className="font-medium">Hotel (4 nights, beachfront):</span><span className="text-green-600 font-semibold">$480</span></div>
                      <div className="flex justify-between"><span className="font-medium">Food & Local Transport:</span><span className="text-green-600 font-semibold">$280</span></div>
                      <div className="flex justify-between"><span className="font-medium">Gaudi Architecture Tour:</span><span className="text-green-600 font-semibold">$180</span></div>
                      <div className="flex justify-between font-bold text-lg border-t pt-3 mt-4"><span>Total Spent:</span><span className="text-blue-600">$1490</span></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 italic">Sagrada Familia, Park Güell, tapas tours, Mediterranean beaches</p>
                  </div>

                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-6">
                      <span className="text-4xl mr-4">🇬🇷</span>
                      <div>
                        <h3 className="text-2xl font-semibold">Athens & Islands, Greece</h3>
                        <p className="text-gray-500">2024 • 9 Days</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="font-medium">Flight (Delhi-Athens):</span><span className="text-green-600 font-semibold">$490</span></div>
                      <div className="flex justify-between"><span className="font-medium">Hotel & Island Hopping:</span><span className="text-green-600 font-semibold">$780</span></div>
                      <div className="flex justify-between"><span className="font-medium">Food & Ferry Tickets:</span><span className="text-green-600 font-semibold">$420</span></div>
                      <div className="flex justify-between"><span className="font-medium">Acropolis & Ancient Sites:</span><span className="text-green-600 font-semibold">$250</span></div>
                      <div className="flex justify-between font-bold text-lg border-t pt-3 mt-4"><span>Total Spent:</span><span className="text-blue-600">$1940</span></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 italic">Acropolis, Santorini, Mykonos, Greek mythology tours</p>
                  </div>
                </div>

                <div className="mt-12 text-center bg-white/50 p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold mb-4">Travel Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <p className="font-medium text-gray-800">Average Trip Cost</p>
                      <p className="text-2xl font-bold text-blue-600">$1,957</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Countries Visited</p>
                      <p className="text-2xl font-bold text-blue-600">6</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Total Days Traveled</p>
                      <p className="text-2xl font-bold text-blue-600">45</p>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            </div>

            <div className="text-center">
              <FadeInUp>
                <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-12">My Global <span className="font-elegant italic">Journey</span></h2>
              </FadeInUp>

              <FadeInUp delay={200}>
                <div className="relative max-w-6xl mx-auto">
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=800&fit=crop" alt="World Map Pencil Drawing" className="w-full h-auto rounded-3xl shadow-2xl" />
                  {/* Glowing pins for traveled countries */}
                  <div className="absolute top-[25%] left-[35%] w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-pulse"></div>
                  <div className="absolute top-[30%] left-[45%] w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-pulse"></div>
                  <div className="absolute top-[40%] left-[50%] w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-pulse"></div>
                  <div className="absolute top-[35%] left-[60%] w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-pulse"></div>
                  <div className="absolute top-[50%] left-[40%] w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-pulse"></div>
                  <div className="absolute top-[45%] left-[70%] w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-pulse"></div>
                  {/* Country flags and labels */}
                  <div className="absolute top-[20%] left-[30%] text-xs font-bold text-black bg-white/80 px-2 py-1 rounded shadow">🇫🇷 France</div>
                  <div className="absolute top-[25%] left-[40%] text-xs font-bold text-black bg-white/80 px-2 py-1 rounded shadow">🇦🇪 UAE</div>
                  <div className="absolute top-[35%] left-[45%] text-xs font-bold text-black bg-white/80 px-2 py-1 rounded shadow">🇮🇹 Italy</div>
                  <div className="absolute top-[30%] left-[55%] text-xs font-bold text-black bg-white/80 px-2 py-1 rounded shadow">🇬🇷 Greece</div>
                  <div className="absolute top-[45%] left-[35%] text-xs font-bold text-black bg-white/80 px-2 py-1 rounded shadow">🇪🇸 Spain</div>
                  <div className="absolute top-[40%] left-[65%] text-xs font-bold text-black bg-white/80 px-2 py-1 rounded shadow">🇯🇵 Japan</div>
                </div>
              </FadeInUp>
            </div>

            <div className="bg-gray-50 p-12 rounded-3xl">
              <FadeInUp>
                <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-12 text-center">Travel <span className="font-elegant italic">Pricing Guide</span></h2>
                <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">Detailed cost breakdown for traveling to countries around the world. All prices are estimates per person for a 7-10 day trip including flights, accommodation, food, and activities.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">🇺🇸</span>
                      <h3 className="text-xl font-semibold">United States</h3>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between"><span>Flight from India:</span><span>$800-1200</span></div>
                      <div className="flex justify-between"><span>Hotel (7 nights):</span><span>$700-1500</span></div>
                      <div className="flex justify-between"><span>Food & Transport:</span><span>$400-600</span></div>
                      <div className="flex justify-between"><span>Activities:</span><span>$300-500</span></div>
                      <div className="flex justify-between font-semibold text-black border-t pt-2"><span>Total:</span><span>$2200-3800</span></div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">🇬🇧</span>
                      <h3 className="text-xl font-semibold">United Kingdom</h3>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between"><span>Flight from India:</span><span>$600-900</span></div>
                      <div className="flex justify-between"><span>Hotel (7 nights):</span><span>$600-1200</span></div>
                      <div className="flex justify-between"><span>Food & Transport:</span><span>$350-550</span></div>
                      <div className="flex justify-between"><span>Activities:</span><span>$250-400</span></div>
                      <div className="flex justify-between font-semibold text-black border-t pt-2"><span>Total:</span><span>$1800-3050</span></div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">🇫🇷</span>
                      <h3 className="text-xl font-semibold">France</h3>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between"><span>Flight from India:</span><span>$500-800</span></div>
                      <div className="flex justify-between"><span>Hotel (7 nights):</span><span>$500-1000</span></div>
                      <div className="flex justify-between"><span>Food & Transport:</span><span>$300-500</span></div>
                      <div className="flex justify-between"><span>Activities:</span><span>$200-350</span></div>
                      <div className="flex justify-between font-semibold text-black border-t pt-2"><span>Total:</span><span>$1500-2650</span></div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">🇯🇵</span>
                      <h3 className="text-xl font-semibold">Japan</h3>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between"><span>Flight from India:</span><span>$400-700</span></div>
                      <div className="flex justify-between"><span>Hotel (7 nights):</span><span>$400-800</span></div>
                      <div className="flex justify-between"><span>Food & Transport:</span><span>$250-400</span></div>
                      <div className="flex justify-between"><span>Activities:</span><span>$200-350</span></div>
                      <div className="flex justify-between font-semibold text-black border-t pt-2"><span>Total:</span><span>$1250-2250</span></div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">🇦🇺</span>
                      <h3 className="text-xl font-semibold">Australia</h3>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between"><span>Flight from India:</span><span>$900-1400</span></div>
                      <div className="flex justify-between"><span>Hotel (7 nights):</span><span>$600-1200</span></div>
                      <div className="flex justify-between"><span>Food & Transport:</span><span>$400-600</span></div>
                      <div className="flex justify-between"><span>Activities:</span><span>$300-500</span></div>
                      <div className="flex justify-between font-semibold text-black border-t pt-2"><span>Total:</span><span>$2200-3700</span></div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">🇨🇦</span>
                      <h3 className="text-xl font-semibold">Canada</h3>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between"><span>Flight from India:</span><span>$700-1100</span></div>
                      <div className="flex justify-between"><span>Hotel (7 nights):</span><span>$500-1000</span></div>
                      <div className="flex justify-between"><span>Food & Transport:</span><span>$350-550</span></div>
                      <div className="flex justify-between"><span>Activities:</span><span>$250-400</span></div>
                      <div className="flex justify-between font-semibold text-black border-t pt-2"><span>Total:</span><span>$1800-3050</span></div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">🇩🇪</span>
                      <h3 className="text-xl font-semibold">Germany</h3>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between"><span>Flight from India:</span><span>$500-800</span></div>
                      <div className="flex justify-between"><span>Hotel (7 nights):</span><span>$400-800</span></div>
                      <div className="flex justify-between"><span>Food & Transport:</span><span>$250-400</span></div>
                      <div className="flex justify-between"><span>Activities:</span><span>$200-350</span></div>
                      <div className="flex justify-between font-semibold text-black border-t pt-2"><span>Total:</span><span>$1350-2350</span></div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">🇮🇹</span>
                      <h3 className="text-xl font-semibold">Italy</h3>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between"><span>Flight from India:</span><span>$450-700</span></div>
                      <div className="flex justify-between"><span>Hotel (7 nights):</span><span>$350-700</span></div>
                      <div className="flex justify-between"><span>Food & Transport:</span><span>$250-400</span></div>
                      <div className="flex justify-between"><span>Activities:</span><span>$200-350</span></div>
                      <div className="flex justify-between font-semibold text-black border-t pt-2"><span>Total:</span><span>$1250-2150</span></div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">🇹🇭</span>
                      <h3 className="text-xl font-semibold">Thailand</h3>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between"><span>Flight from India:</span><span>$300-500</span></div>
                      <div className="flex justify-between"><span>Hotel (7 nights):</span><span>$200-400</span></div>
                      <div className="flex justify-between"><span>Food & Transport:</span><span>$150-250</span></div>
                      <div className="flex justify-between"><span>Activities:</span><span>$100-200</span></div>
                      <div className="flex justify-between font-semibold text-black border-t pt-2"><span>Total:</span><span>$750-1350</span></div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">🇦🇪</span>
                      <h3 className="text-xl font-semibold">UAE</h3>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between"><span>Flight from India:</span><span>$250-400</span></div>
                      <div className="flex justify-between"><span>Hotel (7 nights):</span><span>$400-800</span></div>
                      <div className="flex justify-between"><span>Food & Transport:</span><span>$200-350</span></div>
                      <div className="flex justify-between"><span>Activities:</span><span>$150-300</span></div>
                      <div className="flex justify-between font-semibold text-black border-t pt-2"><span>Total:</span><span>$1000-1850</span></div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">🇸🇬</span>
                      <h3 className="text-xl font-semibold">Singapore</h3>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between"><span>Flight from India:</span><span>$350-550</span></div>
                      <div className="flex justify-between"><span>Hotel (7 nights):</span><span>$500-1000</span></div>
                      <div className="flex justify-between"><span>Food & Transport:</span><span>$250-400</span></div>
                      <div className="flex justify-between"><span>Activities:</span><span>$200-350</span></div>
                      <div className="flex justify-between font-semibold text-black border-t pt-2"><span>Total:</span><span>$1300-2300</span></div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">🇳🇱</span>
                      <h3 className="text-xl font-semibold">Netherlands</h3>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between"><span>Flight from India:</span><span>$500-800</span></div>
                      <div className="flex justify-between"><span>Hotel (7 nights):</span><span>$400-800</span></div>
                      <div className="flex justify-between"><span>Food & Transport:</span><span>$250-400</span></div>
                      <div className="flex justify-between"><span>Activities:</span><span>$200-350</span></div>
                      <div className="flex justify-between font-semibold text-black border-t pt-2"><span>Total:</span><span>$1350-2350</span></div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <p className="text-sm text-gray-500 italic">*Prices are estimates and may vary based on season, exchange rates, and personal preferences. All costs are in USD.</p>
                </div>
              </FadeInUp>
            </div>

            <FadeInUp className="bg-black text-white p-10 md:p-16 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <TrendingUp className="w-64 h-64" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-4">Our Way of Learning & <span className="font-elegant italic">Consistency Growth</span></h2>
                <p className="text-gray-400 mb-12 max-w-2xl text-lg">The trajectory of wealth is built on specific phases of intense focus. Follow the blueprint.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                    <h3 className="text-3xl font-elegant italic mb-2">Age 18 - 22</h3>
                    <h4 className="text-lg font-medium mb-4 tracking-wide uppercase">The Build Phase</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">Focus entirely on high-income skills. Learn coding, marketing, sales. Sacrifice short-term fun for long-term leverage. Build the foundation of your empire.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                    <h3 className="text-3xl font-elegant italic mb-2">Age 23 - 26</h3>
                    <h4 className="text-lg font-medium mb-4 tracking-wide uppercase">The Scale Phase</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">Multiply your income. Launch businesses, productize your services, and start building out your network. The goal is to cross the 6-figure and 7-figure marks consistently.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                    <h3 className="text-3xl font-elegant italic mb-2">Age 27+</h3>
                    <h4 className="text-lg font-medium mb-4 tracking-wide uppercase">The Wealth Phase</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">Invest, multiply, and preserve. Real estate, stocks, acquisitions. Shift from active grinding to asset management and living the ultimate freedom lifestyle.</p>
                  </div>
                </div>
              </div>
            </FadeInUp>

            <FadeInUp delay={200} className="max-w-4xl mx-auto py-12 text-center">
              <Quote className="w-12 h-12 mx-auto text-gray-300 mb-6" />
              <p className="text-2xl md:text-4xl font-light text-gray-800 leading-relaxed">
                "You must choose to become rich. Do not just think about it. Action separates the dreamers from the owners. My lifestyle is a product of relentless execution."
              </p>
            </FadeInUp>

          </div>
        </main>
      )}

      {/* --- FAQ Page --- */}
      {currentView === 'faq' && (
        <main className="min-h-screen pb-24 bg-[#fafafa]">
          <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2564&auto=format&fit=crop" alt="FAQ" className="w-full h-full object-cover object-center scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-black/40 to-black/80"></div>
            </div>
            <div className="relative z-10 text-center text-white mt-12 flex flex-col items-center px-4">
              <FadeInUp delay={100}>
                <p className="text-xs tracking-[0.2em] uppercase font-medium mb-6">Knowledge Base</p>
              </FadeInUp>
              <FadeInUp delay={300}>
                <h1 className="text-5xl md:text-8xl font-light tracking-tight mb-6 drop-shadow-2xl">
                  Questions <span className="font-elegant italic">Answered</span>
                </h1>
              </FadeInUp>
            </div>
          </section>

          <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-20 space-y-24">

            <div className="space-y-12">
              <FadeInUp className="text-center">
                <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">Unmatched <span className="font-elegant italic">Growth</span></h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">Trusted by 10,000+ Entrepreneurs transforming their digital businesses globally.</p>
              </FadeInUp>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { name: "Michael R.", review: "These assets scaled my agency overnight. The quality is simply unmatched." },
                  { name: "Sarah L.", review: "The courses provided the exact blueprint I needed to cross the 6-figure mark." },
                  { name: "David T.", review: "Worth every penny. The community and the resources completely changed my trajectory." }
                ].map((item, idx) => (
                  <FadeInUp key={idx} delay={idx * 100} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col">
                    <div className="flex space-x-1 mb-6">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-8 flex-1 italic">"{item.review}"</p>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-medium">{item.name[0]}</div>
                      <p className="font-medium text-sm">{item.name}</p>
                    </div>
                  </FadeInUp>
                ))}
              </div>
            </div>

            <div className="space-y-6 max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-light tracking-tight mb-8 text-center">Real <span className="font-elegant italic">Conversations</span></h2>
              <FadeInUp delay={100} className="flex justify-start">
                <div className="bg-gray-100 text-black px-6 py-4 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm">
                  <p className="font-medium mb-1 flex items-center text-xs text-gray-500 uppercase tracking-widest"><User className="w-3 h-3 mr-1" /> Future CEO</p>
                  <p className="text-sm md:text-base">Hey, are these courses and assets actually going to help me scale from zero?</p>
                </div>
              </FadeInUp>
              <FadeInUp delay={300} className="flex justify-end">
                <div className="bg-black text-white px-6 py-4 rounded-2xl rounded-tr-none max-w-[85%] shadow-xl">
                  <p className="font-medium mb-1 flex items-center text-xs text-gray-400 uppercase tracking-widest"><ShieldCheck className="w-3 h-3 mr-1" /> Cartel Codes Support</p>
                  <p className="text-sm md:text-base text-gray-100">Absolutely. They provide the exact blueprints, high-converting templates, and mindset shifts required to bypass the trial-and-error phase.</p>
                </div>
              </FadeInUp>
              <FadeInUp delay={500} className="flex justify-start">
                <div className="bg-gray-100 text-black px-6 py-4 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm">
                  <p className="font-medium mb-1 flex items-center text-xs text-gray-500 uppercase tracking-widest"><User className="w-3 h-3 mr-1" /> Future CEO</p>
                  <p className="text-sm md:text-base">Do I get lifetime access to the materials after purchasing?</p>
                </div>
              </FadeInUp>
              <FadeInUp delay={700} className="flex justify-end">
                <div className="bg-black text-white px-6 py-4 rounded-2xl rounded-tr-none max-w-[85%] shadow-xl">
                  <p className="font-medium mb-1 flex items-center text-xs text-gray-400 uppercase tracking-widest"><ShieldCheck className="w-3 h-3 mr-1" /> Cartel Codes Support</p>
                  <p className="text-sm md:text-base text-gray-100">Yes. Pay once, own it forever. You also receive all future updates to your purchased tier at no extra cost.</p>
                </div>
              </FadeInUp>
            </div>

            <div className="pt-12 max-w-3xl mx-auto">
              <h2 className="text-3xl font-light tracking-tight mb-10 text-center border-b border-gray-200 pb-8">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: "What payment methods do you accept?", a: "We accept all major credit cards, debit cards, and UPI securely through Razorpay." },
                  { q: "Are the digital products refundable?", a: "Due to the non-returnable nature of digital assets, all sales are final once the download link is accessed." },
                  { q: "Do I need prior experience for the courses?", a: "No. Our courses range from beginner to advanced. We build your foundation and then scale you up." },
                  { q: "How do I access my purchases?", a: "Instantly via the 'Profile' section after checkout. You will also receive an email with secure download links." }
                ].map((faq, i) => (
                  <FadeInUp key={i} delay={i * 100} className="bg-white border border-gray-100 p-6 rounded-2xl hover:shadow-lg transition-shadow cursor-default group">
                    <h4 className="text-lg font-medium mb-2 group-hover:text-gray-600 transition-colors">{faq.q}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                  </FadeInUp>
                ))}
              </div>
            </div>

          </div>
        </main>
      )}

      {/* --- Your Trust & Worth Page --- */}
      {currentView === 'your-trust-worth' && (
        <main className="min-h-screen pb-24 bg-white">
          <section className="relative h-[70vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img src="/images/trust.jpg" alt="Trust" className="w-full h-full object-cover object-center scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-black/40 to-black/70"></div>
            </div>
            <div className="relative z-10 text-center text-white mt-12 flex flex-col items-center px-4">
              <FadeInUp delay={100}>
                <p className="text-xs tracking-[0.2em] uppercase font-medium mb-6">Built on Integrity</p>
              </FadeInUp>
              <FadeInUp delay={300}>
                <h1 className="text-5xl md:text-8xl font-light tracking-tight mb-6 drop-shadow-2xl">
                  Your Trust <span className="font-elegant italic">& Worth</span>
                </h1>
              </FadeInUp>
            </div>
          </section>

          <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-20 space-y-32">

            <div className="text-center max-w-4xl mx-auto">
              <FadeInUp>
                <ShieldCheck className="w-16 h-16 mx-auto mb-6 text-black" />
                <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">Delivery to you is <span className="font-elegant italic">worth it</span></h2>
                <p className="text-xl text-gray-500 leading-relaxed">We don't just sell products; we deliver ecosystems of success. Every template, every course, every asset is rigorously tested to ensure it brings you 10x the value of your investment.</p>
              </FadeInUp>
            </div>

            <div className="space-y-32">

              <div className="flex flex-col md:flex-row items-center gap-12 group">
                <FadeInUp className="w-full md:w-1/2">
                  <div className="overflow-hidden rounded-3xl shadow-xl aspect-[4/3] relative">
                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&fit=crop" className="w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-105" alt="Past Struggle" />
                  </div>
                </FadeInUp>
                <FadeInUp delay={200} className="w-full md:w-1/2 md:pl-12">
                  <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4">01.</h3>
                  <h2 className="text-4xl md:text-5xl font-light mb-6">Who I <span className="font-elegant italic">Was</span></h2>
                  <p className="text-lg text-gray-500 leading-relaxed">Started from zero. Grinding in average systems, facing constant burnout. The vision was there, but the blueprint was missing. It was a cycle of trial and error in the dark.</p>
                </FadeInUp>
              </div>

              <div className="flex flex-col md:flex-row-reverse items-center gap-12 group">
                <FadeInUp className="w-full md:w-1/2">
                  <div className="overflow-hidden rounded-3xl shadow-xl aspect-[4/3] relative">
                    <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&fit=crop" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Transition" />
                  </div>
                </FadeInUp>
                <FadeInUp delay={200} className="w-full md:w-1/2 md:pr-12 text-left md:text-right">
                  <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4">02.</h3>
                  <h2 className="text-4xl md:text-5xl font-light mb-6">The <span className="font-elegant italic">Shift</span></h2>
                  <p className="text-lg text-gray-500 leading-relaxed">Decided to escape. Invested entirely in high-income skills, premium assets, and unparalleled networking. Building an automated system changed everything and the growth was exponential.</p>
                </FadeInUp>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-12 group">
                <FadeInUp className="w-full md:w-1/2">
                  <div className="overflow-hidden rounded-3xl shadow-2xl aspect-[4/3] relative">
                    <img src="https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&fit=crop" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Success" />
                  </div>
                </FadeInUp>
                <FadeInUp delay={200} className="w-full md:w-1/2 md:pl-12">
                  <h3 className="text-sm font-bold tracking-widest text-black uppercase mb-4">03.</h3>
                  <h2 className="text-4xl md:text-5xl font-light mb-6">My Life <span className="font-elegant italic">Now</span></h2>
                  <p className="text-lg text-gray-500 leading-relaxed">Running a multi-figure digital empire. Traveling the world, driving hypercars, and helping thousands of others replicate the exact process with uncompromised resources.</p>
                </FadeInUp>
              </div>

            </div>

            <div className="py-20 border-t border-gray-100">
              <FadeInUp className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">The Worth of <span className="font-elegant italic">Your Investment</span></h2>
                <p className="text-lg text-gray-500">Every digital asset is engineered to provide immediate ROI. You aren't buying files; you are buying time, expertise, and proven conversion frameworks.</p>
              </FadeInUp>
              <div className="grid md:grid-cols-3 gap-8">
                <FadeInUp delay={100} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow">
                  <TrendingUp className="w-10 h-10 text-black mb-6" />
                  <h3 className="text-xl font-medium mb-3">Instant Scaling</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Bypass months of development and design. Deploy our premium templates immediately to start capturing leads and sales today.</p>
                </FadeInUp>
                <FadeInUp delay={200} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow">
                  <Layers className="w-10 h-10 text-black mb-6" />
                  <h3 className="text-xl font-medium mb-3">Lifetime Value</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">One single secure payment unlocks lifetime access and free future updates. No recurring subscription models. You own your growth.</p>
                </FadeInUp>
                <FadeInUp delay={300} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow">
                  <Zap className="w-10 h-10 text-black mb-6" />
                  <h3 className="text-xl font-medium mb-3">Authority Status</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Utilizing high-end aesthetics and proven copy automatically positions you as an elite authority in your specific niche.</p>
                </FadeInUp>
              </div>
            </div>

            <div className="py-20 bg-[#fafafa] border border-gray-100 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

              <FadeInUp className="relative z-10 max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">Reliable & Smooth <span className="font-elegant italic">Professional Work</span></h2>
                <p className="text-lg text-gray-500">Our products integrate seamlessly into your workflow. Experience frictionless execution backed by verified standards.</p>
              </FadeInUp>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                {[
                  { title: "Bug-Free Code", icon: <Code className="w-6 h-6" /> },
                  { title: "Pixel Perfect UI", icon: <Monitor className="w-6 h-6" /> },
                  { title: "Seamless Integration", icon: <Cpu className="w-6 h-6" /> },
                  { title: "Verified Assets", icon: <CheckCircle className="w-6 h-6" /> }
                ].map((item, idx) => (
                  <FadeInUp key={idx} delay={idx * 100} className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group">
                    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                      {item.icon}
                    </div>
                    <h4 className="font-medium text-black text-sm uppercase tracking-wider">{item.title}</h4>
                  </FadeInUp>
                ))}
              </div>
            </div>

            <div className="relative py-32 rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2564&auto=format&fit=crop" alt="Corporate Luxury" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
              </div>

              <div className="relative z-10 flex justify-center px-6">
                <FadeInUp delay={200} className="bg-white/10 border border-white/20 backdrop-blur-xl p-12 rounded-3xl text-center max-w-2xl w-full">
                  <div className="inline-flex items-center justify-center space-x-2 bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full border border-blue-500/30 mb-8">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">100% Verified Business</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight mb-6">Our Trust <br /><span className="font-elegant italic text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">Your Growth</span></h2>
                  <p className="text-gray-300 text-lg">When you invest with Cartel Codes, you're securing a partnership dedicated to elevating your digital presence and scaling your income.</p>
                </FadeInUp>
              </div>
            </div>

          </div>
        </main>
      )}

      {/* --- Visit Us Page --- */}
      {currentView === 'visit-us' && (
        <main className="min-h-screen pb-24 bg-[#fafafa]">
          <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2564&auto=format&fit=crop" alt="Office Studio" className="w-full h-full object-cover object-center scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-black/50 to-black/80"></div>
            </div>
            <div className="relative z-10 text-center text-white mt-12 flex flex-col items-center px-4">
              <FadeInUp delay={100}>
                <p className="text-xs tracking-[0.2em] uppercase font-medium mb-6">Join The Inner Circle</p>
              </FadeInUp>
              <FadeInUp delay={300}>
                <h1 className="text-5xl md:text-8xl font-light tracking-tight mb-6 drop-shadow-2xl">
                  Visit <span className="font-elegant italic">Us</span>
                </h1>
              </FadeInUp>
            </div>
          </section>

          <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-20 space-y-32">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FadeInUp delay={100}>
                <a href="#" className="group block bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                    <Instagram className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Instagram</h3>
                  <p className="text-gray-500 text-sm">@CartelCodes</p>
                </a>
              </FadeInUp>
              <FadeInUp delay={200}>
                <a href="#" className="group block bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center">
                  <div className="w-16 h-16 mx-auto bg-black rounded-full flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.15H5.078z" /></svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">X (Twitter)</h3>
                  <p className="text-gray-500 text-sm">@CartelCodes</p>
                </a>
              </FadeInUp>
              <FadeInUp delay={300}>
                <a href="#" className="group block bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center">
                  <div className="w-16 h-16 mx-auto bg-red-600 rounded-full flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                    <Youtube className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">YouTube</h3>
                  <p className="text-gray-500 text-sm">Cartel Codes</p>
                </a>
              </FadeInUp>
              <FadeInUp delay={400}>
                <a href="#" className="group block bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center">
                  <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                    <Facebook className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Facebook</h3>
                  <p className="text-gray-500 text-sm">Cartel Codes </p>
                </a>
              </FadeInUp>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="md:pr-12 flex flex-col justify-center">
                <FadeInUp delay={100}>
                  <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6 leading-tight">
                    Mastery & <span className="font-elegant italic">Helping Youth</span>
                  </h2>
                </FadeInUp>
                <FadeInUp delay={200}>
                  <p className="text-lg text-gray-500 leading-relaxed mb-8">
                    We don't just build businesses; we build the next generation of leaders. Our mastery spans across coding, design, AI, and marketing. Our core mission is to pass this multifaceted expertise down to the youth, empowering ambitious individuals to break free from traditional constraints and achieve financial independence early.
                  </p>
                </FadeInUp>
              </div>
              <FadeInUp className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
                  <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2500&auto=format&fit=crop" alt="Helping Youth" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                </div>
              </FadeInUp>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <FadeInUp className="order-2 md:order-1">
                <div className="aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative group">
                  <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2532&auto=format&fit=crop" alt="Consulting" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
              </FadeInUp>
              <div className="order-1 md:order-2 md:pl-12 flex flex-col justify-center">
                <FadeInUp delay={100}>
                  <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6 leading-tight">
                    Why to visit & <span className="font-elegant italic">consult us</span>
                  </h2>
                </FadeInUp>
                <FadeInUp delay={200}>
                  <p className="text-lg text-gray-500 leading-relaxed mb-6">
                    A private consultation is the fastest way to bridge the gap between where you are and where you want to be. Cut through the noise and get a bespoke strategy tailored to your exact digital business model.
                  </p>
                  <ul className="space-y-4 mb-8">
                    {['Direct access to the 6-figure blueprint', 'Personalized asset and course curation', '1-on-1 networking opportunities'].map((item, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <Check className="w-5 h-5 mr-3 text-black" /> {item}
                      </li>
                    ))}
                  </ul>
                </FadeInUp>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="md:pr-12 flex flex-col justify-center">
                <FadeInUp delay={100}>
                  <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6 leading-tight">
                    Growing <span className="font-elegant italic">with us</span>
                  </h2>
                </FadeInUp>
                <FadeInUp delay={200}>
                  <p className="text-lg text-gray-500 leading-relaxed mb-8">
                    When you step into our ecosystem, you aren't just a customer; you are a partner. We provide the infrastructure, the updates, and the community. As we scale and expand our offerings, your resources automatically upgrade. Together, we monopolize the market.
                  </p>
                </FadeInUp>
              </div>
              <FadeInUp className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
                  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2500&auto=format&fit=crop" alt="Growing Together" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                </div>
              </FadeInUp>
            </div>

            <div className="text-center bg-black text-white py-24 px-6 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
              </div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <FadeInUp>
                  <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6">Ready to <span className="font-elegant italic">connect?</span></h2>
                  <p className="text-gray-400 text-lg mb-10">Our studio is open. Our inboxes are ready. Take the first step towards massive action.</p>
                  <button onClick={() => navigate('contact')} className="bg-white text-black px-10 py-4 rounded-full text-sm tracking-widest uppercase font-medium hover:bg-gray-200 transition-colors flex items-center justify-center mx-auto group">
                    Book a Consultation <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </FadeInUp>
              </div>
            </div>

          </div>
        </main>
      )}

      {/* --- Terms & Conditions --- */}
      {currentView === 'terms-conditions' && (
        <main className="min-h-screen pb-24 bg-white">
          <section className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden mb-16">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2564&auto=format&fit=crop" alt="Legal Documents and Contracts" className="w-full h-full object-cover object-center scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-black/40 to-black/80"></div>
            </div>
            <div className="relative z-10 text-center text-white mt-12 flex flex-col items-center px-4">
              <FadeInUp delay={100}><p className="text-xs tracking-[0.2em] uppercase font-medium mb-6">Legal & Policy</p></FadeInUp>
              <FadeInUp delay={300}>
                <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6 drop-shadow-2xl">Terms & <span className="font-elegant italic">Conditions</span></h1>
              </FadeInUp>
            </div>
          </section>

          <div className="max-w-[1000px] mx-auto px-6 md:px-12">
            <FadeInUp className="space-y-12 text-gray-600 leading-relaxed text-lg">

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0 text-black shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-black mb-3">100% Trustworthy Guarantee</h3>
                  <p>At Cartel Codes, we pride ourselves on delivering premium, uncompromised digital assets, courses, and softwares. Every product curated on our platform is tested and verified for quality. Your growth and satisfaction are our primary operational metrics.</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 text-red-600 shadow-sm">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-black mb-3">No Refund Policy</h3>
                  <p>Due to the non-returnable nature of digital products, softwares, and downloadable courses, all sales are final. Once the product download link is provided or the course access is granted, we strictly cannot issue any refunds under any circumstances.</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 shadow-sm">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-black mb-3">Secure Payments & Access</h3>
                  <p>Your payment data is securely processed via Razorpay gateway. We do not store your credit card details. Upon successful payment, your digital licenses and assets are instantly tied to your verified Cartel Codes account.</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0 text-black shadow-sm">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-black mb-3">Support & Non-Delivery</h3>
                  <p>In the rare event that a payment is marked as successful by your bank but you have not received access to your product, please do not panic. Immediately get in touch with our executive support team.</p>
                  <p className="mt-4 font-medium text-black">Email us at: <a href="mailto:cartelcodes@gmail.com" className="underline hover:text-gray-500">Cartelcodes@gmail.com</a></p>
                  <p className="mt-2 text-sm">Please attach your transaction ID and account email. We guarantee resolution within 24 hours.</p>
                </div>
              </div>

            </FadeInUp>
          </div>
        </main>
      )}

      {/* --- About Page --- */}
      {currentView === 'about' && (
        <main className="min-h-screen pb-24 bg-white">
          <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2564&auto=format&fit=crop" alt="The Visionary" className="w-full h-full object-cover object-center scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-black/40 to-black/80"></div>
            </div>
            <div className="relative z-10 text-center text-white mt-12 flex flex-col items-center px-4">
              <FadeInUp delay={100}>
                <p className="text-xs tracking-[0.2em] uppercase font-medium mb-6">The Architect</p>
              </FadeInUp>
              <FadeInUp delay={300}>
                <h1 className="text-5xl md:text-8xl font-light tracking-tight mb-6 drop-shadow-2xl">
                  About the <span className="font-elegant italic">Visionary</span>
                </h1>
              </FadeInUp>
            </div>
          </section>

          <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-20 space-y-32">

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <FadeInUp className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative group">
                <img src="/images/ceo.png" alt="CEO Profile" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-3xl font-medium mb-2">Company CEO</h3>
                  <p className="text-gray-300 tracking-widest uppercase text-sm">Founder, Cartel Codes</p>
                </div>
              </FadeInUp>

              <div className="flex flex-col justify-center space-y-10">
                <FadeInUp delay={100}>
                  <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">Master of <span className="font-elegant italic">Disciplines</span></h2>
                  <p className="text-lg text-gray-500 leading-relaxed">
                    Success in the modern digital landscape requires a hybrid of skills. I am not just an entrepreneur; I am a builder at the intersection of logic, aesthetics, and the future.
                  </p>
                </FadeInUp>

                <div className="space-y-6">
                  <FadeInUp delay={200} className="flex items-start space-x-6 p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
                    <div className="bg-black text-white p-4 rounded-xl flex-shrink-0"><Code className="w-6 h-6" /></div>
                    <div>
                      <h4 className="text-xl font-medium mb-2">Computer Science Engineer</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">The foundational logic. Understanding algorithms, scalable architectures, and the pure mechanics of the digital world.</p>
                    </div>
                  </FadeInUp>

                  <FadeInUp delay={300} className="flex items-start space-x-6 p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
                    <div className="bg-black text-white p-4 rounded-xl flex-shrink-0"><PenTool className="w-6 h-6" /></div>
                    <div>
                      <h4 className="text-xl font-medium mb-2">Premium Designer</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">The visual psychology. Crafting pixel-perfect UI/UX that dictates user behavior, builds immense trust, and drives conversions.</p>
                    </div>
                  </FadeInUp>

                  <FadeInUp delay={400} className="flex items-start space-x-6 p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
                    <div className="bg-black text-white p-4 rounded-xl flex-shrink-0"><Cpu className="w-6 h-6" /></div>
                    <div>
                      <h4 className="text-xl font-medium mb-2">AI Specialist</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">The future edge. Leveraging machine learning and artificial intelligence to automate workflows, analyze data, and outpace the competition.</p>
                    </div>
                  </FadeInUp>
                </div>
              </div>
            </div>

            <div className="pt-12">
              <div className="text-center mb-16">
                <FadeInUp>
                  <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6">Learn Like <span className="font-elegant italic">Me</span></h2>
                  <p className="text-xl text-gray-500 leading-relaxed max-w-3xl mx-auto">
                    Your growth with me is exponential. You will bypass the years of trial and error by absorbing the exact professional concepts, assets, and mindset I used to build this empire. Follow the blueprint.
                  </p>
                </FadeInUp>
              </div>

              <div className="relative max-w-6xl mx-auto space-y-24 before:absolute before:inset-0 before:ml-[2.4rem] md:before:mx-auto before:-translate-x-px md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent pt-10">

                <div className="relative flex flex-col md:flex-row items-center justify-between group">
                  <div className="absolute left-5 md:left-1/2 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-black text-white shadow-xl shrink-0 transform -translate-x-1/2 z-10 font-serif text-lg">
                    1
                  </div>

                  <FadeInUp className="w-full md:w-[calc(50%-4rem)] pl-20 md:pl-0 md:pr-0">
                    <div className="overflow-hidden rounded-2xl shadow-2xl aspect-[4/3] relative group-hover:-translate-y-2 transition-transform duration-700">
                      <img src="/images/learn-like-me.jpg" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" alt="Phase 1 Assets" />
                    </div>
                  </FadeInUp>

                  <FadeInUp delay={200} className="w-full md:w-[calc(50%-4rem)] pl-20 md:pl-0 mt-8 md:mt-0 text-left md:ml-auto">
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="px-4 py-1.5 bg-gray-100 text-[10px] font-bold uppercase tracking-widest rounded-full text-gray-600">Assets</span>
                      <span className="px-4 py-1.5 bg-gray-100 text-[10px] font-bold uppercase tracking-widest rounded-full text-gray-600">Templates</span>
                    </div>
                    <h4 className="font-light text-3xl md:text-4xl mb-4">Phase 1: <span className="font-medium">Adopt</span></h4>
                    <p className="text-gray-500 leading-relaxed text-lg">Download the premium assets and templates. Instantly upgrade your presentation with professional-grade tools. Stop building from scratch when the foundation is already built.</p>
                  </FadeInUp>
                </div>

                <div className="relative flex flex-col md:flex-row-reverse items-center justify-between group">
                  <div className="absolute left-5 md:left-1/2 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-black text-white shadow-xl shrink-0 transform -translate-x-1/2 z-10 font-serif text-lg">
                    2
                  </div>

                  <FadeInUp className="w-full md:w-[calc(50%-4rem)] pl-20 md:pl-0 md:pr-0">
                    <div className="overflow-hidden rounded-2xl shadow-2xl aspect-[4/3] relative group-hover:-translate-y-2 transition-transform duration-700">
                      <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" alt="Phase 2 Absorb" />
                    </div>
                  </FadeInUp>

                  <FadeInUp delay={200} className="w-full md:w-[calc(50%-4rem)] pl-20 md:pl-0 mt-8 md:mt-0 text-left md:text-right flex flex-col md:items-end md:mr-auto">
                    <div className="flex flex-wrap gap-3 mb-6 justify-start md:justify-end">
                      <span className="px-4 py-1.5 bg-gray-100 text-[10px] font-bold uppercase tracking-widest rounded-full text-gray-600">Mindset</span>
                      <span className="px-4 py-1.5 bg-gray-100 text-[10px] font-bold uppercase tracking-widest rounded-full text-gray-600">Masterclass</span>
                    </div>
                    <h4 className="font-light text-3xl md:text-4xl mb-4">Phase 2: <span className="font-medium">Absorb</span></h4>
                    <p className="text-gray-500 leading-relaxed text-lg text-left md:text-right">Take the courses. Reprogram your mindset from consumer to high-level producer. Learn the logic, the design psychology, and the AI implementations that set the top 1% apart.</p>
                  </FadeInUp>
                </div>

                <div className="relative flex flex-col md:flex-row items-center justify-between group">
                  <div className="absolute left-5 md:left-1/2 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-black text-white shadow-xl shrink-0 transform -translate-x-1/2 z-10 font-serif text-lg">
                    3
                  </div>

                  <FadeInUp className="w-full md:w-[calc(50%-4rem)] pl-20 md:pl-0 md:pr-0">
                    <div className="overflow-hidden rounded-2xl shadow-2xl aspect-[4/3] relative group-hover:-translate-y-2 transition-transform duration-700">
                      <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" alt="Phase 3 Apply" />
                    </div>
                  </FadeInUp>

                  <FadeInUp delay={200} className="w-full md:w-[calc(50%-4rem)] pl-20 md:pl-0 mt-8 md:mt-0 text-left md:ml-auto">
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="px-4 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Execution</span>
                      <span className="px-4 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Domination</span>
                    </div>
                    <h4 className="font-light text-3xl md:text-4xl mb-4">Phase 3: <span className="font-medium">Apply</span></h4>
                    <p className="text-gray-500 leading-relaxed text-lg">Deploy the skills. Scale your income, automate your tasks with AI, and dominate your niche. You transition from learning the system to owning it.</p>
                  </FadeInUp>
                </div>

              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <FadeInUp>
                <div className="flex items-center space-x-4 mb-8">
                  <div className="h-px bg-gray-300 flex-1"></div>
                  <h2 className="text-3xl font-elegant italic px-4">The Architecture of Ambition</h2>
                  <div className="h-px bg-gray-300 flex-1"></div>
                </div>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed text-justify md:text-left">
                  <p>Before the multiple ventures, the advanced tech stacks, and the algorithmic market analysis, there was nothing but a laptop and an obsession to build. The struggle wasn’t just about launching companies; it was the psychological burden of knowing I was meant to engineer an empire, but feeling constrained by a standard system. I started with a vision, balancing academic pursuits with a relentless drive to create platforms that actually mattered.</p>
                  <p>I spent countless nights mastering React, Three.js, and GSAP—designing, coding, and often failing. I engineered platforms, built brands, and launched ventures ranging from retail to humanitarian foundations. Systems broke, and early strategies didn't always scale. But every setback was simply a data point. I learned how to bounce back, code cleaner, and design smarter. The true cheat code wasn't a shortcut; it was resilience—learning how to start, how to fail, and exactly how to rebuild with undeniable precision.</p>
                  <p className="font-medium text-black">I didn't rely on luck. I relied on relentless execution. By applying consistent, 1% improvements every single day across web development, business scaling, and trading, the compounding results built an ecosystem. Now, my mission is to hand you the exact blueprints and free resources so you can bypass the dark years and engineer your own reality.</p>
                </div>
              </FadeInUp>
            </div>

            <div className="pt-12 pb-24 overflow-hidden border-t border-gray-100 mt-20 relative">
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

              <div className="animate-marquee flex w-max space-x-16 text-4xl md:text-6xl font-light uppercase tracking-widest text-black/50 items-center mt-12">
                <span>Escape Average</span>
                <span className="w-3 h-3 bg-black/50 rounded-full"></span>
                <span>Build Your Empire</span>
                <span className="w-3 h-3 bg-black/50 rounded-full"></span>
                <span>1% Habits = 100% Results</span>
                <span className="w-3 h-3 bg-black/50 rounded-full"></span>
                <span>Master Your Craft</span>
                <span className="w-3 h-3 bg-black/50 rounded-full"></span>
                <span>Escape Average</span>
                <span className="w-3 h-3 bg-black/50 rounded-full"></span>
                <span>Build Your Empire</span>
                <span className="w-3 h-3 bg-black/50 rounded-full"></span>
                <span>1% Habits = 100% Results</span>
                <span className="w-3 h-3 bg-black/50 rounded-full"></span>
                <span>Master Your Craft</span>
              </div>
            </div>

          </div>
        </main>
      )}

      {/* --- Contact Page --- */}
      {currentView === 'contact' && (
        <main className="w-full bg-white pb-24">
          {/* --- 1. Hero Intro Section --- */}
          <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden z-10">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069" alt="Contact Intro" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent opacity-95"></div>
            </div>
            <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full text-white">
              <FadeInUp className="max-w-3xl">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                    <img src={LOGO_SRC} alt="Cartel Codes Logo" className="w-8 h-8 object-contain" />
                  </div>
                  <span className="inline-block px-4 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-bold uppercase tracking-widest">Cartel Codes Global HQ</span>
                </div>
                <h1 className="text-6xl md:text-9xl font-light tracking-tight mb-8 leading-none">
                  Elite <br />
                  <span className="font-elegant italic text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">Care.</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-xl mb-12">
                  Operating from our premium India-based studio with a relentless global mindset. We bridge the gap between technical complexity and business growth.
                </p>
              </FadeInUp>
            </div>
          </section>

          {/* --- 2. Polite Support Conversation Example (Long Mobile Mockup) --- */}
          <section className="py-40 bg-gray-50/50 backdrop-blur-sm relative overflow-hidden border-y border-gray-100 z-10">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <div className="grid lg:grid-cols-2 gap-24 items-center">
                <FadeInUp>
                  <div className="inline-flex items-center space-x-2 text-emerald-600 mb-6 bg-emerald-50 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest">
                    <HeartHandshake className="w-4 h-4" />
                    <span>Indian Hospitality & Tech</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-8">Support that <br /><span className="font-elegant italic">actually cares.</span></h2>
                  <p className="text-xl text-gray-500 leading-relaxed mb-10">
                    Our India-led technical unit is world-renowned for its polite, humble, yet incredibly aggressive approach to problem-solving. We treat every client like a partner.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500">
                      <ShieldCheck className="w-8 h-8 text-black mb-4" />
                      <h4 className="font-bold text-sm uppercase tracking-widest mb-2">Respect First</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">Humble communication with senior engineering expertise.</p>
                    </div>
                    <div className="p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500">
                      <Zap className="w-8 h-8 text-black mb-4" />
                      <h4 className="font-bold text-sm uppercase tracking-widest mb-2">Instant Action</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">No chatbots. You get a senior human architect within 15 minutes.</p>
                    </div>
                  </div>
                </FadeInUp>

                <FadeInUp delay={200} className="relative">
                  {/* Premium Mobile Phone Mockup */}
                  <div className="bg-[#0a0a0a] rounded-[4.5rem] p-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border-[14px] border-[#1a1a1a] relative z-10 mx-auto max-w-[440px]">
                    <div className="bg-white rounded-[3rem] h-[720px] overflow-hidden flex flex-col relative">
                      {/* Chat Header */}
                      <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
                            <img src={LOGO_SRC} alt="Cartel Codes Logo" className="w-6 h-6 object-contain" />
                          </div>
                          <div>
                            <p className="font-bold text-base">Cartel Codes Elite Support</p>
                            <p className="text-[10px] text-emerald-500 flex items-center uppercase font-bold tracking-widest"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>Active Engineer</p>
                          </div>
                        </div>
                      </div>

                      {/* Long Professional Chat Content */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar pb-10">
                        <div className="flex flex-col items-start animate-[fadeInScale_0.5s_ease-out]">
                          <div className="bg-gray-100 rounded-[1.5rem] rounded-tl-none p-5 max-w-[90%] text-[12px] text-gray-800 leading-relaxed shadow-sm">
                            Hi Team, I'm having a critical issue. My database connection keeps dropping on the new masterclass landing page. I have a launch in 30 minutes. 🆘
                          </div>
                          <p className="text-[9px] text-gray-400 mt-2 uppercase tracking-widest font-bold">Client • 11:45 AM</p>
                        </div>

                        <div className="flex flex-col items-end opacity-0 animate-[fadeInScale_0.5s_ease-out_0.5s_forwards]">
                          <div className="bg-black text-white rounded-[1.5rem] rounded-tr-none p-5 max-w-[90%] text-[12px] leading-relaxed shadow-xl">
                            Hello! I am your lead architect. Please take a deep breath—I am here now and I will personally ensure your launch is a massive success.
                          </div>
                        </div>

                        <div className="flex flex-col items-end opacity-0 animate-[fadeInScale_0.5s_ease-out_1s_forwards]">
                          <div className="bg-black text-white rounded-[1.5rem] rounded-tr-none p-5 max-w-[90%] text-[12px] leading-relaxed shadow-xl border border-white/10">
                            I have already initiated a real-time audit of your server logs. It appears to be a minor configuration mismatch in the SSL handshake. Fixing this for you immediately...
                          </div>
                        </div>

                        <div className="flex flex-col items-start opacity-0 animate-[fadeInScale_0.5s_ease-out_1.8s_forwards]">
                          <div className="bg-gray-100 rounded-[1.5rem] rounded-tl-none p-5 max-w-[90%] text-[12px] text-gray-800 leading-relaxed">
                            Thank you. I was really panicking. You're a lifesaver.
                          </div>
                        </div>

                        <div className="flex flex-col items-end opacity-0 animate-[fadeInScale_0.5s_ease-out_2.5s_forwards]">
                          <div className="bg-emerald-600 text-white rounded-[1.5rem] rounded-tr-none p-5 max-w-[90%] text-[12px] leading-relaxed shadow-xl font-medium">
                            The fix is deployed! 🚀 Your database is now perfectly synced with a 0.2ms latency. I have also optimized your cache headers to handle the traffic spike.
                          </div>
                        </div>

                        <div className="flex flex-col items-end opacity-0 animate-[fadeInScale_0.5s_ease-out_3.2s_forwards]">
                          <div className="bg-black text-white rounded-[1.5rem] rounded-tr-none p-5 max-w-[90%] text-[12px] leading-relaxed shadow-xl">
                            I will stay online and monitor your traffic for the first 15 minutes of your launch. You are not alone! Is there anything else I can assist you with?
                          </div>
                          <p className="text-[9px] text-gray-400 mt-2 uppercase tracking-widest font-bold text-right">Support • 11:48 AM</p>
                        </div>

                        <div className="flex flex-col items-start opacity-0 animate-[fadeInScale_0.5s_ease-out_4s_forwards] pb-6">
                          <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-[1.5rem] rounded-tl-none p-5 max-w-[90%] text-[12px] font-bold leading-relaxed italic">
                            This is truly elite service. Best in the game. Let's go! 📈
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                </FadeInUp>
              </div>
            </div>
          </section>

          {/* --- 3. Our Indian Office HQ --- */}
          <section className="py-40 bg-white relative overflow-hidden z-10">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                <FadeInUp className="order-2 lg:order-1">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/3]">
                      <img src="https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?q=80&w=2070" alt="Indian Office HQ" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-10 left-10 text-white">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                          <p className="text-[10px] uppercase tracking-widest font-bold">Cyber Hub HQ • Gurugram, India</p>
                        </div>
                        <h3 className="text-3xl font-medium">Heart of the Operations</h3>
                      </div>
                    </div>
                  </div>
                </FadeInUp>
                <FadeInUp className="order-1 lg:order-2">
                  <div className="inline-flex items-center space-x-2 text-blue-600 mb-6 bg-blue-50 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest">
                    <MapPin className="w-4 h-4" />
                    <span>Indian Headquarters</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-8">Based in <br /><span className="font-elegant italic">India.</span> Serving Globally.</h2>
                  <p className="text-xl text-gray-500 leading-relaxed mb-10">
                    Our state-of-the-art technical studio in Gurugram houses our elite engineering unit. We combine traditional Indian hospitality with high-speed digital architecture to deliver an uncompromised experience.
                  </p>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-xl">
                      <Headphones className="w-8 h-8 text-black" />
                      <div>
                        <h4 className="font-bold text-sm uppercase tracking-widest">Live Response Hub</h4>
                        <p className="text-xs text-gray-400">Our team stays online through global timezones.</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-xl">
                      <Code className="w-8 h-8 text-black" />
                      <div>
                        <h4 className="font-bold text-sm uppercase tracking-widest">Zero-Latency Lab</h4>
                        <p className="text-xs text-gray-400">Testing environments built for maximum speed.</p>
                      </div>
                    </div>
                  </div>
                </FadeInUp>
              </div>
            </div>
          </section>

          {/* --- 4. Fast Track Channels (WhatsApp, Telegram, Email) --- */}
          <section className="py-40 bg-gray-50 relative overflow-hidden border-y border-gray-100 z-10">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <FadeInUp className="text-center mb-24">
                <div className="inline-flex items-center space-x-2 text-blue-600 mb-6 bg-blue-50 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest">
                  <Share2 className="w-4 h-4" />
                  <span>3D Contact Matrix</span>
                </div>
                <h2 className="text-4xl md:text-7xl font-light tracking-tight mb-8">Direct <span className="font-elegant italic">Connections.</span></h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">Skip the email thread. Choose your platform and connect with our Indian HQ immediately.</p>
              </FadeInUp>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 perspective-1000">
                {/* WhatsApp */}
                <FadeInUp delay={100} className="preserve-3d animate-float-3d">
                  <a href="#" className="group block relative bg-white rounded-[3rem] p-12 shadow-2xl border border-gray-100 transition-all duration-700 hover:shadow-green-500/20 hover:-translate-y-6 hover:rotate-x-6">
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-24 h-24 bg-[#25D366] text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-xl transform group-hover:rotate-[360deg] transition-transform duration-1000">
                        <MessageSquare className="w-12 h-12" />
                      </div>
                      <h3 className="text-3xl font-medium mb-4">WhatsApp</h3>
                      <p className="text-gray-500 text-sm mb-8 leading-relaxed">Instant technical updates and launch-day priority chat.</p>
                      <span className="bg-gray-900 text-white font-bold text-[10px] uppercase tracking-widest px-8 py-4 rounded-full group-hover:bg-green-500 transition-colors">Start Chat</span>
                    </div>
                  </a>
                </FadeInUp>

                {/* Telegram */}
                <FadeInUp delay={200} className="preserve-3d animate-float-3d" style={{ animationDelay: '-2s' }}>
                  <a href="#" className="group block relative bg-white rounded-[3rem] p-12 shadow-2xl border border-gray-100 transition-all duration-700 hover:shadow-blue-500/20 hover:-translate-y-6 hover:rotate-x-6">
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-24 h-24 bg-[#0088cc] text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-xl transform group-hover:rotate-[360deg] transition-transform duration-1000">
                        <Send className="w-12 h-12 ml-[-6px]" />
                      </div>
                      <h3 className="text-3xl font-medium mb-4">Telegram</h3>
                      <p className="text-gray-500 text-sm mb-8 leading-relaxed">Secure data transmission and uncompressed asset delivery.</p>
                      <span className="bg-gray-900 text-white font-bold text-[10px] uppercase tracking-widest px-8 py-4 rounded-full group-hover:bg-blue-500 transition-colors">Join Channel</span>
                    </div>
                  </a>
                </FadeInUp>

                {/* Email */}
                <FadeInUp delay={300} className="preserve-3d animate-float-3d" style={{ animationDelay: '-4s' }}>
                  <a href="mailto:cartelcodes@gmail.com" className="group block relative bg-white rounded-[3rem] p-12 shadow-2xl border border-gray-100 transition-all duration-700 hover:shadow-black/20 hover:-translate-y-6 hover:rotate-x-6">
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-24 h-24 bg-black text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-xl transform group-hover:rotate-[360deg] transition-transform duration-1000">
                        <Mail className="w-12 h-12" />
                      </div>
                      <h3 className="text-3xl font-medium mb-4">Priority Mail</h3>
                      <p className="text-gray-500 text-sm mb-8 leading-relaxed">Official inquiries and strategic partnership documents.</p>
                      <span className="bg-gray-900 text-white font-bold text-[10px] uppercase tracking-widest px-8 py-4 rounded-full group-hover:bg-black transition-colors">Write Email</span>
                    </div>
                  </a>
                </FadeInUp>
              </div>
            </div>
          </section>

          {/* --- 5. Support Tree / Problem Solving Process --- */}
          <section className="py-40 bg-[#050505] text-white relative overflow-hidden z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1000px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15),transparent_70%)] pointer-events-none"></div>

            <div className="max-w-[1200px] mx-auto px-6 md:px-12 text-center relative z-10 mb-40">
              <FadeInUp>
                <h2 className="text-5xl md:text-8xl font-light tracking-tight mb-8">Solving <span className="font-elegant italic text-purple-400">Pipeline</span></h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">Watch our mechanism of precision engineering. We take your hurdle and transform it into a success story.</p>
              </FadeInUp>
            </div>

            <div className="relative max-w-5xl mx-auto px-6 pb-20">
              {/* Glowing Vertical Tree Line */}
              <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 z-0">
                <div className="h-full w-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent"></div>
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-white to-transparent animate-[scroll-glow_3s_linear_infinite] shadow-[0_0_20px_2px_rgba(255,255,255,0.8)]"></div>
              </div>

              <div className="space-y-48">
                {/* Step 1 */}
                <div className="relative flex flex-col md:flex-row items-center justify-between group">
                  <div className="absolute left-[30px] md:left-1/2 w-14 h-14 rounded-full bg-purple-600 border-[8px] border-[#050505] -translate-x-1/2 z-10 shadow-[0_0_25px_rgba(168,85,247,0.8)] animate-pulse-node flex items-center justify-center text-white font-bold text-sm">01</div>
                  <FadeInUp className="w-full md:w-[calc(50%-5rem)] pl-24 md:pl-0 mt-0 text-left md:text-right flex flex-col md:items-end">
                    <div className="perspective-1000">
                      <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 transition-all duration-700 group-hover:rotate-y-12 group-hover:bg-white/10 group-hover:border-purple-500/50">
                        <Terminal className="w-12 h-12 text-purple-400 mb-6 md:ml-auto" />
                        <h3 className="text-3xl font-medium mb-4">Neural Intake</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">Your request is logged via our encrypted HQ portal. Immediate triage begins to assess architectural requirements.</p>
                      </div>
                    </div>
                  </FadeInUp>
                  <div className="hidden md:block w-[calc(50%-5rem)]"></div>
                </div>

                {/* Step 2 */}
                <div className="relative flex flex-col md:flex-row-reverse items-center justify-between group">
                  <div className="absolute left-[30px] md:left-1/2 w-14 h-14 rounded-full bg-purple-600 border-[8px] border-[#050505] -translate-x-1/2 z-10 shadow-[0_0_25px_rgba(168,85,247,0.8)] animate-pulse-node flex items-center justify-center text-white font-bold text-sm">02</div>
                  <FadeInUp className="w-full md:w-[calc(50%-5rem)] pl-24 md:pl-0 mt-0 text-left">
                    <div className="perspective-1000">
                      <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 transition-all duration-700 group-hover:rotate-y-[-12deg] group-hover:bg-white/10 group-hover:border-purple-500/50">
                        <Binary className="w-12 h-12 text-purple-400 mb-6" />
                        <h3 className="text-3xl font-medium mb-4">Audit & Debug</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">Our specialists perform a deep diagnostic scan of your environment. We don't just solve symptoms—we eliminate bottlenecks.</p>
                      </div>
                    </div>
                  </FadeInUp>
                  <div className="hidden md:block w-[calc(50%-5rem)]"></div>
                </div>

                {/* Step 3 */}
                <div className="relative flex flex-col md:flex-row items-center justify-between group">
                  <div className="absolute left-[30px] md:left-1/2 w-14 h-14 rounded-full bg-purple-600 border-[8px] border-[#050505] -translate-x-1/2 z-10 shadow-[0_0_25px_rgba(168,85,247,0.8)] animate-pulse-node flex items-center justify-center text-white font-bold text-sm">03</div>
                  <FadeInUp className="w-full md:w-[calc(50%-5rem)] pl-24 md:pl-0 mt-0 text-left md:text-right flex flex-col md:items-end">
                    <div className="perspective-1000">
                      <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 transition-all duration-700 group-hover:rotate-y-12 group-hover:bg-white/10 group-hover:border-purple-500/50">
                        <Layout className="w-12 h-12 text-purple-400 mb-6 md:ml-auto" />
                        <h3 className="text-3xl font-medium mb-4">Solution Mapping</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">Assigned to a dedicated domain expert in our Indian Headquarters. You get the engineer who speaks your language.</p>
                      </div>
                    </div>
                  </FadeInUp>
                  <div className="hidden md:block w-[calc(50%-5rem)]"></div>
                </div>

                {/* Step 4 */}
                <div className="relative flex flex-col md:flex-row-reverse items-center justify-between group">
                  <div className="absolute left-[30px] md:left-1/2 w-14 h-14 rounded-full bg-purple-600 border-[8px] border-[#050505] -translate-x-1/2 z-10 shadow-[0_0_25px_rgba(168,85,247,0.8)] animate-pulse-node flex items-center justify-center text-white font-bold text-sm">04</div>
                  <FadeInUp className="w-full md:w-[calc(50%-5rem)] pl-24 md:pl-0 mt-0 text-left">
                    <div className="perspective-1000">
                      <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 transition-all duration-700 group-hover:rotate-y-[-12deg] group-hover:bg-white/10 group-hover:border-purple-500/50">
                        <Code className="w-12 h-12 text-purple-400 mb-6" />
                        <h3 className="text-3xl font-medium mb-4">Deployment</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">The solution is engineered and deployed with zero downtime protocols. We ensure every pixel is perfect before launch.</p>
                      </div>
                    </div>
                  </FadeInUp>
                  <div className="hidden md:block w-[calc(50%-5rem)]"></div>
                </div>
              </div>
            </div>
          </section>

          {/* --- 6. Final Contact Form & Schedule --- */}
          <section className="py-40 relative overflow-hidden z-10">
            {/* Background PNG Logo Addition */}
            <div className="absolute top-1/2 left-0 md:left-[10%] -translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] opacity-[0.04] pointer-events-none z-0 select-none">
              <img src={LOGO_SRC} alt="Background Logo Watermark" className="w-full h-full object-contain grayscale" />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-24 relative z-10">
              <div className="flex flex-col justify-center">
                <FadeInUp>
                  <div className="mb-10 w-24 h-24 bg-black rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
                    <img src={LOGO_SRC} alt="Cartel Codes Logo" className="w-12 h-12 object-contain" />
                  </div>
                  <h2 className="text-5xl md:text-7xl font-light tracking-tight mb-8 leading-tight">Ready to <br /><span className="font-elegant italic">Escalate?</span></h2>
                  <p className="text-xl text-gray-500 mb-16 max-w-lg">Submit your business challenge. Our senior Indian engineers will provide a high-level response within 15 minutes.</p>
                </FadeInUp>

                <div className="space-y-12">
                  {/* Working Schedule */}
                  <FadeInUp delay={150} className="flex items-start space-x-8">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-black shadow-sm shrink-0 border border-gray-100"><CalendarDays className="w-6 h-6" /></div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">HQ Operating Hours</p>
                      <div className="flex flex-col">
                        <span className="text-lg font-medium text-black">Monday — Saturday: 09:00 AM – 06:00 PM IST</span>
                        <div className="mt-4 flex items-center bg-red-50 border border-red-100 rounded-xl px-4 py-3 w-fit">
                          <span className="text-red-600 font-bold uppercase text-[10px] tracking-[0.2em] flex items-center">
                            <Clock className="w-4 h-4 mr-2" /> Sunday: Closed (No Working Day)
                          </span>
                        </div>
                      </div>
                    </div>
                  </FadeInUp>

                  <FadeInUp delay={100} className="flex items-start space-x-8">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-black shadow-sm shrink-0 border border-gray-100"><Briefcase className="w-6 h-6" /></div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">Corporate Access</p>
                      <p className="text-lg font-medium">Cartelcodes@gmail.com</p>
                    </div>
                  </FadeInUp>

                  <FadeInUp delay={200} className="flex items-start space-x-8">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-black shadow-sm shrink-0 border border-gray-100"><MapPin className="w-6 h-6" /></div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">Indian Headquarters</p>
                      <p className="text-lg font-medium">123 Digital Square, Gurugram, India</p>
                    </div>
                  </FadeInUp>
                </div>
              </div>

              <FadeInUp delay={300} className="bg-white p-12 md:p-20 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] group-hover:bg-blue-500/10 transition-colors"></div>

                <form className="space-y-10 relative z-10" onSubmit={(e) => { e.preventDefault(); showToast("Inquiry Transmitted to HQ."); }}>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">First Name</label>
                      <input required className="w-full border-b border-gray-200 py-4 focus:outline-none focus:border-black transition-colors bg-transparent" placeholder="Arjun" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Last Name</label>
                      <input required className="w-full border-b border-gray-200 py-4 focus:outline-none focus:border-black transition-colors bg-transparent" placeholder="Malhotra" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Corporate Email</label>
                    <input type="email" required className="w-full border-b border-gray-200 py-4 focus:outline-none focus:border-black transition-colors bg-transparent" placeholder="founder@venture.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Detailed Challenge</label>
                    <textarea rows="4" required className="w-full border-b border-gray-200 py-4 focus:outline-none focus:border-black transition-colors resize-none bg-transparent" placeholder="Explain the technical hurdle..."></textarea>
                  </div>
                  <button className="w-full bg-black text-white py-7 rounded-3xl text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-neutral-800 transition-all shadow-2xl hover:shadow-black/20 transform hover:-translate-y-2 flex items-center justify-center space-x-3">
                    <Send className="w-4 h-4" />
                    <span>Transmit to Headquarters</span>
                  </button>
                </form>
              </FadeInUp>
            </div>
          </section>
        </main>
      )}

      <LivePurchaseTicker />

      {/* --- Footer --- */}
      <footer className="bg-[#050505] text-white pt-24 pb-8 relative z-10 overflow-hidden">
        {/* Subtle Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-serif italic text-white/[0.02] pointer-events-none whitespace-nowrap select-none">
          Cartel Codes
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-12 mb-20">
            {/* Brand Col */}
            <div className="sm:col-span-2 lg:col-span-4 flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-medium tracking-tight flex items-center mb-6 cursor-pointer hover:opacity-80 transition-opacity w-max" onClick={() => navigate('home')}>
                  <img src={LOGO_SRC} alt="Cartel Codes Logo" className="w-8 h-8 mr-2 object-contain" />
                  <span className="font-serif italic mr-1 text-5xl">Cartel</span>
                  <span>Codes</span>
                </h2>
                <p className="text-gray-400 text-sm leading-loose max-w-sm">
                  A premium digital storefront designed for the modern creator. Sell courses, digital products, design assets, and premium softwares with unmatched elegance.
                </p>
              </div>

              <div className="flex space-x-6 mt-10">
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Instagram className="w-4 h-4" /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Twitter className="w-4 h-4" /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Youtube className="w-4 h-4" /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Facebook className="w-4 h-4" /></a>
              </div>
            </div>

            {/* Shop Links */}
            <div className="lg:col-span-2 lg:ml-auto">
              <h4 className="uppercase tracking-widest text-[10px] font-bold text-white mb-8 border-b border-white/10 pb-4 w-full">Shop</h4>
              <ul className="space-y-5 text-sm text-gray-400">
                <li><button onClick={() => navigate('digital-products')} className="hover:text-white transition-colors flex items-center group"><span className="w-3 h-px bg-white mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>Digital Products</button></li>
                <li><button onClick={() => navigate('courses')} className="hover:text-white transition-colors flex items-center group"><span className="w-3 h-px bg-white mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>Courses</button></li>
                <li><button onClick={() => navigate('designing-assets')} className="hover:text-white transition-colors flex items-center group"><span className="w-3 h-px bg-white mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>Designing Assets</button></li>
                <li><button onClick={() => navigate('premium-softwares')} className="hover:text-white transition-colors flex items-center group"><span className="w-3 h-px bg-white mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>Premium Softwares</button></li>
              </ul>
            </div>

            {/* Pages Links */}
            <div className="lg:col-span-2 lg:ml-auto">
              <h4 className="uppercase tracking-widest text-[10px] font-bold text-white mb-8 border-b border-white/10 pb-4 w-full">Pages</h4>
              <ul className="space-y-5 text-sm text-gray-400">
                <li><button onClick={() => navigate('visit-us')} className="hover:text-white transition-colors flex items-center group"><span className="w-3 h-px bg-white mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>Visit Us</button></li>
                <li><button onClick={() => navigate('faq')} className="hover:text-white transition-colors flex items-center group"><span className="w-3 h-px bg-white mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>FAQ's & Help</button></li>
                <li><button onClick={() => navigate('our-lifestyle')} className="hover:text-white transition-colors flex items-center group"><span className="w-3 h-px bg-white mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>Our Lifestyle</button></li>
                <li><button onClick={() => navigate('your-trust-worth')} className="hover:text-white transition-colors flex items-center group"><span className="w-3 h-px bg-white mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>Your Trust & Worth</button></li>
                <li><button onClick={() => navigate('terms-conditions')} className="hover:text-white transition-colors flex items-center group"><span className="w-3 h-px bg-white mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>Terms & Conditions</button></li>
              </ul>
            </div>

            {/* Newsletter Col */}
            <div className="sm:col-span-2 lg:col-span-4 lg:pl-12">
              <h4 className="uppercase tracking-widest text-[10px] font-bold text-white mb-8 border-b border-white/10 pb-4 w-full">Stay Connected</h4>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">Subscribe to receive updates, access to exclusive courses, and the latest premium assets straight to your inbox.</p>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all text-white placeholder-gray-500"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-white text-black px-6 rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest">
            <p>&copy; {new Date().getFullYear()} Cartel Codes 2026. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-6 mt-6 md:mt-0">
              <button onClick={() => navigate('terms-conditions')} className="hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => navigate('terms-conditions')} className="hover:text-white transition-colors">Terms of Service</button>
              <button onClick={() => navigate('terms-conditions')} className="hover:text-white transition-colors">Refund Policy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}