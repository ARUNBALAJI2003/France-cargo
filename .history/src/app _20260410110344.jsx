import { useState, useEffect, useRef } from "react";

/* ── SCROLL REVEAL HOOK ─────────────────────────────── */
function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ── RESPONSIVE HOOK ────────────────────────────────── */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

/* ── AUTH CONTEXT (simple state management) ──────────── */
// In production, use React Context or a state manager.
// API_BASE should point to your FastAPI server
const API_BASE = "http://localhost:8000";

async function apiCall(endpoint, options = {}) {
  const token = window.__authToken;
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

/* ── TRANSLATIONS ───────────────────────────────────── */
const t = {
  en: {
    home: "Home", about: "About", services: "Services", contact: "Contact", login: "Login",
    heroBadge: "Global Logistics Partner",
    heroTitle1: "Delivering Excellence", heroTitle2: "Across The Globe",
    heroSub: "From warehousing to ocean freight, customs clearance to last-mile delivery — France Cargo provides end-to-end logistics solutions that keep your business moving.",
    ourServices: "Our Services", learnMore: "Learn More",
    countriesServed: "Countries Served", clientsWorldwide: "Clients Worldwide", onTimeDelivery: "On-Time Delivery",
    fastTitle: "Fast & Reliable", fastDesc: "Timely deliveries with real-time tracking across all shipments. Our advanced monitoring systems ensure you always know where your cargo is, with instant alerts and live updates throughout the journey.",
    globalTitle: "Global Network", globalDesc: "Extensive partnerships spanning 50+ countries worldwide. Our integrated network of agents, carriers, and warehouses delivers seamless connectivity across every major trade route.",
    secureTitle: "Secure Handling", secureDesc: "Advanced security protocols protecting your cargo at every stage. From tamper-proof seals to 24/7 surveillance, we safeguard your goods with industry-leading protection standards.",
    priceTitle: "Competitive Pricing", priceDesc: "Transparent rates with no hidden fees — always fair and honest. We leverage our global volume to negotiate the best rates, passing savings directly to you.",
    aboutTag: "About Us", aboutTitle1: "Your Trusted Logistics", aboutTitle2: "Partner in", aboutTitle3: "France",
    aboutP1: "France Cargo is a leading logistics and freight forwarding company headquartered in Paris, France. We specialize in providing comprehensive supply chain solutions — from international ocean and air cargo to domestic transportation, warehousing, and customs clearance.",
    aboutP2: "With a presence across 50+ countries and a dedicated team of logistics professionals, we are committed to delivering your goods safely, on time, and at competitive rates. Our mission is simple: to make global trade effortless for businesses of every size.",
    aboutBullet1: "Warehousing Solutions", aboutBullet2: "Cargo Services", aboutBullet3: "Freight Forwarding", aboutBullet4: "Supply Chain Management",
    servicesTag: "Our Services", servicesTitle: "Comprehensive Logistics Solutions",
    servicesSub: "End-to-end services designed to streamline your supply chain and keep your cargo moving across the globe.",
    svc1Title: "Transportation", svc1Desc: "France Cargo offers comprehensive transportation services tailored to your needs. Our extensive fleet of modern vehicles ensures safe, timely delivery of goods across France, Europe, and international destinations. From full truckload (FTL) to less-than-truckload (LTL), we handle shipments of all sizes with real-time GPS tracking and dedicated route optimization.",
    svc2Title: "Warehousing & Distribution", svc2Desc: "Our state-of-the-art warehousing facilities across France provide secure, climate-controlled storage for your inventory. With advanced warehouse management systems (WMS), we offer real-time inventory tracking, pick-and-pack services, cross-docking, and order fulfillment. Our strategically located distribution centers ensure rapid last-mile delivery.",
    svc3Title: "Ocean & Air Cargo", svc3Desc: "Whether you need to ship containers across the Atlantic or urgent cargo by air, France Cargo has you covered. We partner with leading shipping lines and airlines to offer competitive rates for both FCL and LCL ocean freight, as well as express and standard air freight services.",
    svc4Title: "Customs Clearance", svc4Desc: "Navigating customs regulations can be complex — but not with France Cargo. Our licensed customs brokers handle all import and export documentation, tariff classifications, duty calculations, and regulatory compliance. We ensure your shipments clear customs swiftly and without delays.",
    ctaTitle: "Ready to Streamline Your Logistics?",
    ctaSub: "Partner with France Cargo and experience seamless, reliable freight solutions tailored to your business needs.",
    ctaBtn: "Contact Us Today",
    contactTag: "Get In Touch",
    contactTitle: "Contact Us",
    contactSub: "Have questions or need a quote? Reach out to our team and we'll get back to you within 24 hours.",
    contactName: "Full Name",
    contactEmail: "Email Address",
    contactPhone: "Phone Number",
    contactSubject: "Subject",
    contactMessage: "Your Message",
    contactSend: "Send Message",
    contactAddress: "Paris, France",
    contactPhoneNum: "+91 98405 82500",
    contactEmailAddr: "riorixtech@gmail.com",
    contactHours: "Mon - Sat: 9:00 AM - 6:00 PM",
    loginTitle: "Welcome Back",
    loginEmail: "Email Address",
    loginPassword: "Password",
    loginBtn: "Sign In",
    loginNoAccount: "Don't have an account?",
    loginSignup: "Sign Up",
    signupTitle: "Create Account",
    signupName: "Full Name",
    signupEmail: "Email Address",
    signupPassword: "Password",
    signupBtn: "Sign Up",
    signupHaveAccount: "Already have an account?",
    signupLogin: "Sign In",
    orContinueWith: "or continue with",
    continueGoogle: "Continue with Google",
    dashboard: "Dashboard",
    logout: "Logout",
    welcomeUser: "Welcome",
    profileTitle: "Your Profile",
    logoutConfirm: "Are you sure you want to log out?",
    logoutYes: "Yes, Log Out",
    logoutCancel: "Cancel",
    footerDesc: "Your trusted global logistics partner. Delivering excellence in freight forwarding, warehousing, and supply chain management across the world.",
    quickLinks: "Quick Links", aboutUs: "About Us",
    footerSvcTitle: "Services", svcTransportation: "Transportation", svcWarehousing: "Warehousing", svcOceanAir: "Ocean & Air Cargo", svcCustoms: "Customs Clearance",
    contactUs: "Contact Us", rights: "© 2026 France Cargo. All rights reserved.",
    menuOpen: "Menu",
    authError: "Authentication failed. Please try again.",
    authSuccess: "Successfully signed in!",
    signingIn: "Signing in...",
    creatingAccount: "Creating account...",
  },
  fr: {
    home: "Accueil", about: "À Propos", services: "Services", contact: "Contact", login: "Connexion",
    heroBadge: "Partenaire Logistique Mondial",
    heroTitle1: "L'Excellence Livrée", heroTitle2: "À Travers Le Monde",
    heroSub: "De l'entreposage au fret maritime, du dédouanement à la livraison du dernier kilomètre — France Cargo fournit des solutions logistiques de bout en bout pour maintenir votre activité en mouvement.",
    ourServices: "Nos Services", learnMore: "En Savoir Plus",
    countriesServed: "Pays Desservis", clientsWorldwide: "Clients dans le Monde", onTimeDelivery: "Livraison à Temps",
    fastTitle: "Rapide & Fiable", fastDesc: "Livraisons ponctuelles avec suivi en temps réel de tous les envois. Nos systèmes de surveillance avancés vous permettent de toujours savoir où se trouve votre cargaison, avec des alertes instantanées tout au long du trajet.",
    globalTitle: "Réseau Mondial", globalDesc: "Partenariats étendus couvrant plus de 50 pays dans le monde. Notre réseau intégré d'agents, de transporteurs et d'entrepôts offre une connectivité sans faille sur toutes les routes commerciales majeures.",
    secureTitle: "Manutention Sécurisée", secureDesc: "Protocoles de sécurité avancés protégeant votre cargaison à chaque étape. Des scellés inviolables à la surveillance 24h/24, nous protégeons vos marchandises avec les normes de protection les plus élevées.",
    priceTitle: "Tarifs Compétitifs", priceDesc: "Tarifs transparents sans frais cachés — toujours justes et honnêtes. Nous utilisons notre volume mondial pour négocier les meilleurs tarifs, vous transmettant directement les économies.",
    aboutTag: "À Propos de Nous", aboutTitle1: "Votre Partenaire Logistique", aboutTitle2: "de Confiance en", aboutTitle3: "France",
    aboutP1: "France Cargo est une entreprise leader en logistique et transit de fret, basée à Paris, France. Nous nous spécialisons dans la fourniture de solutions complètes de chaîne d'approvisionnement — du fret maritime et aérien international au transport domestique, à l'entreposage et au dédouanement.",
    aboutP2: "Avec une présence dans plus de 50 pays et une équipe dédiée de professionnels de la logistique, nous nous engageons à livrer vos marchandises en toute sécurité, à temps et à des tarifs compétitifs. Notre mission est simple : rendre le commerce mondial sans effort pour les entreprises de toutes tailles.",
    aboutBullet1: "Solutions d'Entreposage", aboutBullet2: "Services de Fret", aboutBullet3: "Transit de Fret", aboutBullet4: "Gestion de la Chaîne Logistique",
    servicesTag: "Nos Services", servicesTitle: "Solutions Logistiques Complètes",
    servicesSub: "Des services de bout en bout conçus pour optimiser votre chaîne d'approvisionnement et maintenir votre cargaison en mouvement à travers le monde.",
    svc1Title: "Transport", svc1Desc: "France Cargo offre des services de transport complets adaptés à vos besoins. Notre vaste flotte de véhicules modernes assure une livraison sûre et ponctuelle des marchandises à travers la France, l'Europe et les destinations internationales. Du chargement complet (FTL) au groupage (LTL), nous gérons des envois de toutes tailles avec suivi GPS en temps réel.",
    svc2Title: "Entreposage & Distribution", svc2Desc: "Nos installations d'entreposage ultramodernes à travers la France offrent un stockage sécurisé et climatisé pour votre inventaire. Avec des systèmes avancés de gestion d'entrepôt (WMS), nous proposons le suivi d'inventaire en temps réel, les services de préparation de commandes, le cross-docking et l'exécution des commandes.",
    svc3Title: "Fret Maritime & Aérien", svc3Desc: "Que vous ayez besoin d'expédier des conteneurs à travers l'Atlantique ou du fret urgent par avion, France Cargo est à votre service. Nous collaborons avec les principales compagnies maritimes et aériennes pour offrir des tarifs compétitifs pour le fret maritime FCL et LCL, ainsi que des services de fret aérien express et standard.",
    svc4Title: "Dédouanement", svc4Desc: "Naviguer dans les réglementations douanières peut être complexe — mais pas avec France Cargo. Nos courtiers en douane agréés gèrent toute la documentation d'importation et d'exportation, les classifications tarifaires, les calculs de droits et la conformité réglementaire.",
    ctaTitle: "Prêt à Optimiser Votre Logistique ?",
    ctaSub: "Associez-vous à France Cargo et découvrez des solutions de fret fiables et fluides, adaptées aux besoins de votre entreprise.",
    ctaBtn: "Contactez-Nous Aujourd'hui",
    contactTag: "Nous Contacter",
    contactTitle: "Contactez-Nous",
    contactSub: "Des questions ou besoin d'un devis ? Contactez notre équipe et nous vous répondrons dans les 24 heures.",
    contactName: "Nom Complet",
    contactEmail: "Adresse Email",
    contactPhone: "Numéro de Téléphone",
    contactSubject: "Sujet",
    contactMessage: "Votre Message",
    contactSend: "Envoyer le Message",
    contactAddress: "Paris, France",
    contactPhoneNum: "+91 98405 82500",
    contactEmailAddr: "riorixtech@gmail.com",
    contactHours: "Lun - Sam: 9h00 - 18h00",
    loginTitle: "Bon Retour",
    loginEmail: "Adresse Email",
    loginPassword: "Mot de Passe",
    loginBtn: "Se Connecter",
    loginNoAccount: "Pas de compte ?",
    loginSignup: "S'inscrire",
    signupTitle: "Créer un Compte",
    signupName: "Nom Complet",
    signupEmail: "Adresse Email",
    signupPassword: "Mot de Passe",
    signupBtn: "S'inscrire",
    signupHaveAccount: "Vous avez déjà un compte ?",
    signupLogin: "Se Connecter",
    orContinueWith: "ou continuer avec",
    continueGoogle: "Continuer avec Google",
    dashboard: "Tableau de bord",
    logout: "Déconnexion",
    welcomeUser: "Bienvenue",
    profileTitle: "Votre Profil",
    logoutConfirm: "Êtes-vous sûr de vouloir vous déconnecter ?",
    logoutYes: "Oui, Déconnexion",
    logoutCancel: "Annuler",
    footerDesc: "Votre partenaire logistique mondial de confiance. L'excellence en transit de fret, entreposage et gestion de la chaîne d'approvisionnement à travers le monde.",
    quickLinks: "Liens Rapides", aboutUs: "À Propos de Nous",
    footerSvcTitle: "Services", svcTransportation: "Transport", svcWarehousing: "Entreposage", svcOceanAir: "Fret Maritime & Aérien", svcCustoms: "Dédouanement",
    contactUs: "Contactez-Nous", rights: "© 2026 France Cargo. Tous droits réservés.",
    menuOpen: "Menu",
    authError: "Échec de l'authentification. Veuillez réessayer.",
    authSuccess: "Connexion réussie !",
    signingIn: "Connexion en cours...",
    creatingAccount: "Création du compte...",
  }
};

const serviceImages = [
  "/transportation.png",
  "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
  "/ocean-air-cargo.png",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80"
];

/* ── TOAST NOTIFICATION ──────────────────────────────── */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed", top: 90, right: 20, zIndex: 10001,
      padding: "14px 24px", borderRadius: 12,
      background: type === "success" ? "#059669" : type === "error" ? "#dc2626" : "#0b1d3a",
      color: "#fff", fontSize: 14, fontWeight: 600,
      fontFamily: "'Outfit',sans-serif",
      boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
      animation: "fadeUp 0.4s ease",
      display: "flex", alignItems: "center", gap: 10,
      maxWidth: 360
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        {type === "success" ? (
          <><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>
        ) : (
          <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>
        )}
      </svg>
      {message}
      <button onClick={onClose} style={{
        background: "none", border: "none", color: "#fff", cursor: "pointer",
        marginLeft: 8, padding: 2, opacity: 0.7
      }}>✕</button>
    </div>
  );
}

/* ── USER AVATAR DROPDOWN ────────────────────────────── */
function UserMenu({ user, onLogout, lang, mobile }) {
  const L = t[lang];
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = user.name ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "U";

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "none", border: "none", cursor: "pointer", padding: 0
      }}>
        {user.picture ? (
          <img src={user.picture} alt={user.name}
            style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid #e8740c", objectFit: "cover" }}
            onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
          />
        ) : null}
        <div style={{
          width: 38, height: 38, borderRadius: "50%", background: "#e8740c",
          display: user.picture ? "none" : "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "'Outfit',sans-serif"
        }}>{initials}</div>
        {!mobile && (
          <span style={{ fontSize: 13, fontWeight: 600, color: "#0b1d3a", fontFamily: "'Outfit',sans-serif" }}>
            {user.name?.split(" ")[0]}
          </span>
        )}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0b1d3a" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 12px)", right: 0,
          background: "#fff", borderRadius: 14, minWidth: 240,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "1px solid #f0f0f0",
          overflow: "hidden", animation: "fadeUp 0.25s ease", zIndex: 200
        }}>
          {/* User info header */}
          <div style={{
            padding: "20px 20px 16px", borderBottom: "1px solid #f0f0f0",
            background: "linear-gradient(135deg, #fef8f2 0%, #fff 100%)"
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0b1d3a", fontFamily: "'Outfit',sans-serif" }}>
              {user.name}
            </div>
            <div style={{ fontSize: 13, color: "#999", fontFamily: "'Outfit',sans-serif", marginTop: 2 }}>
              {user.email}
            </div>
            {user.auth_provider === "google" && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                marginTop: 8, padding: "4px 10px", borderRadius: 20,
                background: "#f0f6ff", fontSize: 11, fontWeight: 600,
                color: "#4285F4", fontFamily: "'Outfit',sans-serif"
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google Account
              </div>
            )}
          </div>
          {/* Logout button */}
          <div style={{ padding: "8px" }}>
            <button onClick={() => { setOpen(false); onLogout(); }} style={{
              width: "100%", padding: "12px 16px",
              background: "none", border: "none", borderRadius: 10,
              fontSize: 14, fontWeight: 600, color: "#dc2626",
              fontFamily: "'Outfit',sans-serif", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              transition: "all 0.2s"
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              {L.logout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── LOGIN MODAL (with OAuth 2.0 Google) ─────────────── */
function LoginModal({ isOpen, onClose, lang, onAuthSuccess }) {
  const L = t[lang];
  const mobile = useIsMobile();
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  // Listen for OAuth callback messages from popup
  useEffect(() => {
    const handleMessage = async (event) => {
      // In production, validate event.origin against your domain
      if (event.data?.type === "google-oauth-callback") {
        const { code } = event.data;
        if (code) {
          setLoading(true);
          setError("");
          try {
            // Send the authorization code to your FastAPI backend
            const data = await apiCall("/auth/google/callback", {
              method: "POST",
              body: JSON.stringify({ code, redirect_uri: `${window.location.origin}/auth/google/callback` })
            });
            // Store the JWT token
            window.__authToken = data.access_token;
            onAuthSuccess(data.user);
            onClose();
          } catch (err) {
            setError(err.message || L.authError);
          } finally {
            setLoading(false);
          }
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onAuthSuccess, onClose, L.authError]);

  if (!isOpen) return null;

  // ── Google OAuth 2.0 redirect ──
  const handleGoogleLogin = () => {
    // Replace with your actual Google OAuth Client ID
    const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
    const REDIRECT_URI = `${window.location.origin}/auth/google/callback`;
    const SCOPE = "openid email profile";
    const STATE = crypto.randomUUID(); // CSRF protection

    // Store state for verification
    window.__oauthState = STATE;

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", SCOPE);
    authUrl.searchParams.set("state", STATE);
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");

    // Open in popup for better UX
    const w = 500, h = 600;
    const left = window.screenX + (window.innerWidth - w) / 2;
    const top = window.screenY + (window.innerHeight - h) / 2;
    window.open(authUrl.toString(), "google-oauth", `width=${w},height=${h},left=${left},top=${top}`);
  };

  // ── Email/Password login ──
  const handleEmailLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiCall("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      window.__authToken = data.access_token;
      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message || L.authError);
    } finally {
      setLoading(false);
    }
  };

  // ── Email/Password signup ──
  const handleEmailSignup = async () => {
    if (!signupName || !signupEmail || !signupPassword) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiCall("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword })
      });
      window.__authToken = data.access_token;
      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message || L.authError);
    } finally {
      setLoading(false);
    }
  };

  const inputBase = {
    width: "100%", padding: "14px 16px", border: "1.5px solid #e8e8e8",
    borderRadius: 10, fontSize: 15, fontFamily: "'Outfit',sans-serif",
    outline: "none", transition: "border-color 0.3s", background: "#fafafa",
    boxSizing: "border-box"
  };

  const GoogleBtn = () => (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0 16px" }}>
        <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
        <span style={{ fontSize: 12, color: "#aaa", whiteSpace: "nowrap", fontFamily: "'Outfit',sans-serif" }}>
          {L.orContinueWith}
        </span>
        <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
      </div>
      <button
        disabled={loading}
        onClick={handleGoogleLogin}
        style={{
          width: "100%", padding: "13px 16px", background: "#fff",
          border: "1.5px solid #e0e0e0", borderRadius: 10, fontSize: 14,
          fontWeight: 600, color: "#3c3c3c", cursor: loading ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 10, fontFamily: "'Outfit',sans-serif", transition: "all 0.3s",
          opacity: loading ? 0.6 : 1
        }}
        onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = "#4285F4"; e.currentTarget.style.background = "#f8f9ff"; } }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.background = "#fff"; }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {L.continueGoogle}
      </button>
    </>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(11,29,58,0.7)", backdropFilter: "blur(12px)",
      animation: "fadeIn 0.3s ease"
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: mobile ? "92%" : 440, background: "#fff", borderRadius: 20,
        overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.3)",
        animation: "fadeUp 0.4s ease", maxHeight: "90vh", overflowY: "auto"
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #0b1d3a 0%, #142d52 100%)",
          padding: mobile ? "32px 24px" : "40px 40px", textAlign: "center", position: "relative"
        }}>
          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%",
            width: 36, height: 36, cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", transition: "all 0.3s"
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: "rgba(232,116,12,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", border: "1px solid rgba(232,116,12,0.3)"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8740c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: mobile ? 26 : 30, fontWeight: 700, color: "#fff", marginBottom: 0
          }}>{view === "login" ? L.loginTitle : L.signupTitle}</h2>
        </div>

        {/* Form */}
        <div style={{ padding: mobile ? "28px 24px" : "36px 40px" }}>
          {/* Error message */}
          {error && (
            <div style={{
              padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: 10, marginBottom: 20, fontSize: 13, color: "#dc2626",
              fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", gap: 8
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {view === "login" ? (
            <>
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: "block", fontSize: 12, fontWeight: 600, letterSpacing: 1,
                  textTransform: "uppercase", color: "#0b1d3a", marginBottom: 8,
                  fontFamily: "'Outfit',sans-serif"
                }}>{L.loginEmail}</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={inputBase}
                  onFocus={e => { e.target.style.borderColor = "#e8740c"; e.target.style.background = "#fff"; }}
                  onBlur={e => { e.target.style.borderColor = "#e8e8e8"; e.target.style.background = "#fafafa"; }}
                  onKeyDown={e => e.key === "Enter" && handleEmailLogin()}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: "block", fontSize: 12, fontWeight: 600, letterSpacing: 1,
                  textTransform: "uppercase", color: "#0b1d3a", marginBottom: 8,
                  fontFamily: "'Outfit',sans-serif"
                }}>{L.loginPassword}</label>
                <div style={{ position: "relative" }}>
                  <input type={showPassword ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{ ...inputBase, padding: "14px 48px 14px 16px" }}
                    onFocus={e => { e.target.style.borderColor = "#e8740c"; e.target.style.background = "#fff"; }}
                    onBlur={e => { e.target.style.borderColor = "#e8e8e8"; e.target.style.background = "#fafafa"; }}
                    onKeyDown={e => e.key === "Enter" && handleEmailLogin()}
                  />
                  <button onClick={() => setShowPassword(!showPassword)} style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", padding: 4
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round">
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
              <button
                disabled={loading}
                onClick={handleEmailLogin}
                style={{
                  width: "100%", padding: "15px", background: loading ? "#c96000" : "#e8740c", color: "#fff",
                  border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700,
                  letterSpacing: 1.5, textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'Outfit',sans-serif", transition: "all 0.3s",
                  boxShadow: "0 4px 16px rgba(232,116,12,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = "#c96000"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = "#e8740c"; e.currentTarget.style.transform = "translateY(0)"; } }}>
                {loading && (
                  <svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                  </svg>
                )}
                {loading ? L.signingIn : L.loginBtn}
              </button>
              <GoogleBtn />
              <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#999", fontFamily: "'Outfit',sans-serif" }}>
                {L.loginNoAccount}{" "}
                <a href="#" onClick={e => { e.preventDefault(); setView("signup"); setError(""); }} style={{ color: "#e8740c", textDecoration: "none", fontWeight: 600 }}
                  onMouseEnter={e => e.target.style.textDecoration = "underline"}
                  onMouseLeave={e => e.target.style.textDecoration = "none"}>
                  {L.loginSignup}
                </a>
              </p>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#0b1d3a", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>{L.signupName}</label>
                <input type="text" value={signupName} onChange={e => setSignupName(e.target.value)} placeholder="John Doe"
                  style={inputBase}
                  onFocus={e => { e.target.style.borderColor = "#e8740c"; e.target.style.background = "#fff"; }}
                  onBlur={e => { e.target.style.borderColor = "#e8e8e8"; e.target.style.background = "#fafafa"; }}
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#0b1d3a", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>{L.signupEmail}</label>
                <input type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="you@example.com"
                  style={inputBase}
                  onFocus={e => { e.target.style.borderColor = "#e8740c"; e.target.style.background = "#fff"; }}
                  onBlur={e => { e.target.style.borderColor = "#e8e8e8"; e.target.style.background = "#fafafa"; }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#0b1d3a", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>{L.signupPassword}</label>
                <div style={{ position: "relative" }}>
                  <input type={showSignupPassword ? "text" : "password"} value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{ ...inputBase, padding: "14px 48px 14px 16px" }}
                    onFocus={e => { e.target.style.borderColor = "#e8740c"; e.target.style.background = "#fff"; }}
                    onBlur={e => { e.target.style.borderColor = "#e8e8e8"; e.target.style.background = "#fafafa"; }}
                    onKeyDown={e => e.key === "Enter" && handleEmailSignup()}
                  />
                  <button onClick={() => setShowSignupPassword(!showSignupPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round">
                      {showSignupPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
              <button
                disabled={loading}
                onClick={handleEmailSignup}
                style={{
                  width: "100%", padding: "15px", background: loading ? "#c96000" : "#e8740c", color: "#fff",
                  border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700,
                  letterSpacing: 1.5, textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'Outfit',sans-serif", transition: "all 0.3s",
                  boxShadow: "0 4px 16px rgba(232,116,12,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = "#c96000"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = "#e8740c"; e.currentTarget.style.transform = "translateY(0)"; } }}>
                {loading && (
                  <svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                  </svg>
                )}
                {loading ? L.creatingAccount : L.signupBtn}
              </button>
              <GoogleBtn />
              <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#999", fontFamily: "'Outfit',sans-serif" }}>
                {L.signupHaveAccount}{" "}
                <a href="#" onClick={e => { e.preventDefault(); setView("login"); setError(""); }} style={{ color: "#e8740c", textDecoration: "none", fontWeight: 600 }}
                  onMouseEnter={e => e.target.style.textDecoration = "underline"}
                  onMouseLeave={e => e.target.style.textDecoration = "none"}>
                  {L.signupLogin}
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── NAVBAR ──────────────────────────────────────────── */
function Navbar({ scrolled, lang, setLang, onLoginClick, user, onLogout }) {
  const L = t[lang];
  const mobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [["#home", L.home], ["#about", L.about], ["#services", L.services], ["#contact", L.contact]];

  useEffect(() => { if (!mobile) setMenuOpen(false); }, [mobile]);

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${scrolled ? "#e8e8e8" : "transparent"}`, boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.06)" : "none", transition: "all 0.4s" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: mobile ? "0 20px" : "0 40px", height: 74 }}>
        <a href="#home" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: mobile ? 24 : 30, fontWeight: 700, color: "#0b1d3a", textDecoration: "none", letterSpacing: 1 }}>
          FRANCE<span style={{ color: "#e8740c" }}> CARGO</span>
        </a>

        {/* Desktop nav */}
        {!mobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {links.map(([href, label]) => (
              <a key={label} href={href} style={{ textDecoration: "none", color: "#0b1d3a", fontSize: 13, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", transition: "color 0.3s", fontFamily: "'Outfit',sans-serif" }}
                onMouseEnter={e => e.target.style.color = "#e8740c"}
                onMouseLeave={e => e.target.style.color = "#0b1d3a"}>
                {label}
              </a>
            ))}
            <div style={{ display: "flex", border: "1.5px solid #0b1d3a", borderRadius: 6, overflow: "hidden" }}>
              {["EN", "FR"].map(l => (
                <button key={l} onClick={() => setLang(l.toLowerCase())} style={{ padding: "6px 14px", fontSize: 11, fontWeight: 700, letterSpacing: 1, border: "none", cursor: "pointer", background: lang === l.toLowerCase() ? "#0b1d3a" : "transparent", color: lang === l.toLowerCase() ? "#fff" : "#0b1d3a", transition: "all 0.3s", fontFamily: "'Outfit',sans-serif" }}>{l}</button>
              ))}
            </div>

            {/* Show user menu if logged in, otherwise show login button */}
            {user ? (
              <UserMenu user={user} onLogout={onLogout} lang={lang} mobile={false} />
            ) : (
              <button onClick={onLoginClick} style={{
                padding: "10px 28px", background: "#e8740c", color: "#fff",
                border: "none", fontSize: 12, fontWeight: 700, letterSpacing: 1.5,
                textTransform: "uppercase", borderRadius: 6, transition: "all 0.3s",
                fontFamily: "'Outfit',sans-serif", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#c96000"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#e8740c"; }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                {L.login}
              </button>
            )}
          </div>
        )}

        {/* Mobile hamburger + lang */}
        {mobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user && <UserMenu user={user} onLogout={onLogout} lang={lang} mobile={true} />}
            <div style={{ display: "flex", border: "1.5px solid #0b1d3a", borderRadius: 6, overflow: "hidden" }}>
              {["EN", "FR"].map(l => (
                <button key={l} onClick={() => setLang(l.toLowerCase())} style={{ padding: "5px 10px", fontSize: 10, fontWeight: 700, letterSpacing: 1, border: "none", cursor: "pointer", background: lang === l.toLowerCase() ? "#0b1d3a" : "transparent", color: lang === l.toLowerCase() ? "#fff" : "#0b1d3a", transition: "all 0.3s", fontFamily: "'Outfit',sans-serif" }}>{l}</button>
              ))}
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ display: "block", width: 24, height: 2.5, background: "#0b1d3a", borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
              <span style={{ display: "block", width: 24, height: 2.5, background: "#0b1d3a", borderRadius: 2, transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: "block", width: 24, height: 2.5, background: "#0b1d3a", borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
            </button>
          </div>
        )}
      </div>

      {/* Mobile dropdown */}
      {mobile && menuOpen && (
        <div style={{ background: "#fff", borderTop: "1px solid #eee", padding: "20px", animation: "fadeIn 0.3s ease" }}>
          {links.map(([href, label]) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "14px 0", textDecoration: "none", color: "#0b1d3a", fontSize: 15, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", borderBottom: "1px solid #f0f0f0", fontFamily: "'Outfit',sans-serif" }}>
              {label}
            </a>
          ))}
          {!user && (
            <button onClick={() => { setMenuOpen(false); onLoginClick(); }} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "100%", marginTop: 16, padding: "14px 0", background: "#e8740c",
              color: "#fff", border: "none", fontSize: 13, fontWeight: 700,
              letterSpacing: 1.5, textTransform: "uppercase", borderRadius: 6,
              fontFamily: "'Outfit',sans-serif", cursor: "pointer"
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              {L.login}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

/* ── HERO ────────────────────────────────────────────── */
function Hero({ lang }) {
  const L = t[lang];
  const mobile = useIsMobile();
  return (
    <section id="home" style={{ marginTop: 74, position: "relative", overflow: "hidden", background: "#0b1d3a", minHeight: mobile ? "auto" : "92vh", display: "flex", alignItems: "center", padding: mobile ? "60px 20px 50px" : 0 }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.2 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(11,29,58,0.95) 0%, rgba(11,29,58,0.7) 50%, rgba(232,116,12,0.15) 100%)" }} />
      {!mobile && <div style={{ position: "absolute", top: "10%", right: "5%", width: 300, height: 300, border: "1px solid rgba(232,116,12,0.15)", borderRadius: "50%", pointerEvents: "none" }} />}
      {!mobile && <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 180, height: 180, border: "1px solid rgba(232,116,12,0.1)", borderRadius: "50%", pointerEvents: "none" }} />}

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", padding: mobile ? "0" : "0 40px", width: "100%" }}>
        <div style={{ maxWidth: 720 }}>
          <div style={{ display: "inline-block", padding: "8px 20px", border: "1.5px solid #e8740c", borderRadius: 40, fontSize: mobile ? 10 : 11, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: "#e8740c", marginBottom: mobile ? 24 : 32, animation: "fadeUp 0.8s ease", fontFamily: "'Outfit',sans-serif" }}>
            {L.heroBadge}
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: mobile ? "clamp(32px, 8vw, 44px)" : "clamp(44px, 6vw, 78px)", fontWeight: 700, lineHeight: 1.06, color: "#fff", marginBottom: mobile ? 20 : 28, animation: "fadeUp 0.8s ease 0.1s both" }}>
            {L.heroTitle1}<br /><em style={{ fontStyle: "italic", color: "#e8740c" }}>{L.heroTitle2}</em>
          </h1>
          <p style={{ fontSize: mobile ? 15 : 18, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: mobile ? 32 : 44, maxWidth: 560, animation: "fadeUp 0.8s ease 0.2s both", fontFamily: "'Outfit',sans-serif" }}>
            {L.heroSub}
          </p>
          <div style={{ display: "flex", gap: 12, animation: "fadeUp 0.8s ease 0.3s both", flexWrap: "wrap" }}>
            <a href="#services" style={{ padding: mobile ? "14px 28px" : "16px 40px", background: "#e8740c", color: "#fff", textDecoration: "none", fontSize: mobile ? 12 : 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", borderRadius: 6, transition: "all 0.3s", fontFamily: "'Outfit',sans-serif" }}>
              {L.ourServices}
            </a>
            <a href="#about" style={{ padding: mobile ? "14px 28px" : "16px 40px", border: "1.5px solid rgba(255,255,255,0.3)", color: "#fff", textDecoration: "none", fontSize: mobile ? 12 : 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", borderRadius: 6, transition: "all 0.3s", fontFamily: "'Outfit',sans-serif", background: "transparent" }}>
              {L.learnMore}
            </a>
          </div>
        </div>

        <div style={{ marginTop: mobile ? 48 : 80, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 0, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: mobile ? 28 : 40, animation: "fadeUp 0.8s ease 0.5s both" }}>
          {[["50+", L.countriesServed], ["3,000+", L.clientsWorldwide]].map(([num, label]) => (
            <div key={num} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: mobile ? 28 : 42, fontWeight: 700, color: "#e8740c" }}>{num}</div>
              <div style={{ fontSize: mobile ? 9 : 12, color: "rgba(255,255,255,0.45)", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 4, fontFamily: "'Outfit',sans-serif" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── ABOUT ───────────────────────────────────────────── */
function About({ lang }) {
  const L = t[lang];
  const mobile = useIsMobile();
  const [ref, visible] = useScrollReveal();
  return (
    <section id="about" style={{ padding: mobile ? "70px 20px" : "120px 40px", background: "#fff" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 40 : 80, alignItems: "center", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
        <div style={{ position: "relative" }}>
          <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}>
            <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80" alt="France Cargo Operations"
              style={{ width: "100%", height: mobile ? 260 : 480, objectFit: "cover", display: "block" }} />
          </div>
        </div>
        <div>
          <div style={{ fontSize: mobile ? 12 : 14, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#e8740c", marginBottom: 14, fontFamily: "'Outfit',sans-serif" }}>{L.aboutTag}</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: mobile ? "clamp(28px, 6vw, 36px)" : "clamp(34px, 4vw, 52px)", fontWeight: 700, color: "#0b1d3a", marginBottom: 20, lineHeight: 1.15 }}>
            {L.aboutTitle1}<br />{L.aboutTitle2} <em style={{ fontStyle: "italic", color: "#e8740c" }}>{L.aboutTitle3}</em>
          </h2>
          <p style={{ fontSize: mobile ? 14 : 16, color: "#666", lineHeight: 1.85, marginBottom: 16, fontFamily: "'Outfit',sans-serif" }}>{L.aboutP1}</p>
          <p style={{ fontSize: mobile ? 14 : 16, color: "#666", lineHeight: 1.85, marginBottom: 28, fontFamily: "'Outfit',sans-serif" }}>{L.aboutP2}</p>
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
            {[L.aboutBullet1, L.aboutBullet2, L.aboutBullet3, L.aboutBullet4].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, color: "#0b1d3a", fontFamily: "'Outfit',sans-serif" }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#fef3e7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#e8740c", flexShrink: 0 }}>{"✓"}</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── HIGHLIGHTS ──────────────────────────────────────── */
function Highlights({ lang }) {
  const L = t[lang];
  const mobile = useIsMobile();
  const [ref, visible] = useScrollReveal();
  const items = [
    { title: L.fastTitle, desc: L.fastDesc, color: "#e8740c", bgGrad: "linear-gradient(135deg, #fff7f0 0%, #fef3e7 100%)" },
    { title: L.globalTitle, desc: L.globalDesc, color: "#1a73e8", bgGrad: "linear-gradient(135deg, #f0f6ff 0%, #e8f0fe 100%)" },
    { title: L.secureTitle, desc: L.secureDesc, color: "#0d9488", bgGrad: "linear-gradient(135deg, #f0fdfa 0%, #e6f7f5 100%)" },
    { title: L.priceTitle, desc: L.priceDesc, color: "#7c3aed", bgGrad: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)" }
  ];
  return (
    <section style={{ padding: mobile ? "50px 20px 70px" : "80px 40px 120px", background: "#f9f9f7" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: mobile ? 36 : 60, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s" }}>
          <div style={{ fontSize: mobile ? 12 : 14, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#e8740c", marginBottom: 14, fontFamily: "'Outfit',sans-serif" }}>
            {lang === "en" ? "Why Choose Us" : "Pourquoi Nous Choisir"}
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: mobile ? "clamp(28px, 6vw, 36px)" : "clamp(34px, 4vw, 52px)", fontWeight: 700, color: "#0b1d3a", lineHeight: 1.15 }}>
            {lang === "en" ? "What Sets Us Apart" : "Ce Qui Nous Distingue"}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(4, 1fr)", gap: mobile ? 20 : 24 }}>
          {items.map((item, i) => (
            <HighlightCard key={i} item={item} visible={visible} delay={i * 120} mobile={mobile} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HighlightCard({ item, visible, delay, mobile }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        padding: mobile ? "28px 22px" : "36px 28px", borderRadius: 16,
        border: `1.5px solid ${hovered ? item.color : "transparent"}`,
        background: hovered ? item.bgGrad : "#fff",
        transition: "all 0.45s cubic-bezier(0.25,0.46,0.45,0.94)",
        opacity: visible ? 1 : 0,
        transform: visible ? (hovered ? "translateY(-8px)" : "translateY(0)") : "translateY(30px)",
        transitionDelay: `${delay}ms`, cursor: "default",
        boxShadow: hovered ? `0 20px 50px ${item.color}18` : "0 2px 12px rgba(0,0,0,0.04)",
        position: "relative", overflow: "hidden"
      }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, background: hovered ? `${item.color}12` : "transparent", borderRadius: "0 16px 0 60px", transition: "all 0.4s" }} />
      <div style={{ width: 48, height: 48, borderRadius: 12, background: hovered ? `${item.color}18` : "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: mobile ? 16 : 20, transition: "all 0.4s" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.color }} />
      </div>
      <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: mobile ? 18 : 22, fontWeight: 700, color: "#0b1d3a", marginBottom: 10, lineHeight: 1.2 }}>{item.title}</h3>
      <p style={{ fontSize: mobile ? 13 : 14, color: "#777", lineHeight: 1.75, fontFamily: "'Outfit',sans-serif" }}>{item.desc}</p>
    </div>
  );
}

/* ── SERVICES ────────────────────────────────────────── */
function Services({ lang }) {
  const L = t[lang];
  const mobile = useIsMobile();
  const [ref, visible] = useScrollReveal();
  const svcData = [
    { title: L.svc1Title, desc: L.svc1Desc, img: serviceImages[0] },
    { title: L.svc2Title, desc: L.svc2Desc, img: serviceImages[1] },
    { title: L.svc3Title, desc: L.svc3Desc, img: serviceImages[2] },
    { title: L.svc4Title, desc: L.svc4Desc, img: serviceImages[3] }
  ];
  return (
    <section id="services" style={{ padding: mobile ? "70px 20px" : "120px 40px", background: "#fff" }}>
      <div ref={ref} style={{ textAlign: "center", marginBottom: mobile ? 40 : 70, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 0.7s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
        <div style={{ fontSize: mobile ? 12 : 14, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#e8740c", marginBottom: 14, fontFamily: "'Outfit',sans-serif" }}>{L.servicesTag}</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: mobile ? "clamp(28px, 6vw, 36px)" : "clamp(36px, 5vw, 58px)", fontWeight: 700, color: "#0b1d3a", marginBottom: 14 }}>{L.servicesTitle}</h2>
        <p style={{ maxWidth: 600, margin: "0 auto", fontSize: mobile ? 14 : 16, color: "#999", lineHeight: 1.7, fontFamily: "'Outfit',sans-serif" }}>{L.servicesSub}</p>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: mobile ? 28 : 48 }}>
        {svcData.map((s, i) => <ServiceCard key={i} service={s} index={i} mobile={mobile} />)}
      </div>
    </section>
  );
}

function ServiceCard({ service, index, mobile }) {
  const [ref, visible] = useScrollReveal();
  const [hovered, setHovered] = useState(false);
  const isReversed = index % 2 !== 0;
  return (
    <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 0,
        background: "#fff", borderRadius: mobile ? 14 : 18, overflow: "hidden",
        border: `1px solid ${hovered ? "#e8740c" : "#eee"}`,
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.03)",
        transition: "all 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
        transform: visible ? (hovered ? "translateY(-6px)" : "translateY(0)") : "translateY(40px)",
        opacity: visible ? 1 : 0,
        direction: (!mobile && isReversed) ? "rtl" : "ltr"
      }}>
      <div style={{ height: mobile ? 220 : 380, overflow: "hidden", direction: "ltr" }}>
        <img src={service.img} alt={service.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)", transform: hovered ? "scale(1.06)" : "scale(1)" }} />
      </div>
      <div style={{ padding: mobile ? "28px 24px" : "48px 48px", display: "flex", flexDirection: "column", justifyContent: "center", direction: "ltr" }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: mobile ? 22 : 30, fontWeight: 700, color: "#0b1d3a", marginBottom: 10, lineHeight: 1.2 }}>{service.title}</h3>
        <div style={{ width: 40, height: 3, background: "#e8740c", borderRadius: 2, marginBottom: mobile ? 14 : 20 }} />
        <p style={{ fontSize: mobile ? 13 : 15, color: "#777", lineHeight: 1.8, fontFamily: "'Outfit',sans-serif" }}>{service.desc}</p>
      </div>
    </div>
  );
}

/* ── CTA BANNER ──────────────────────────────────────── */
function CtaBanner({ lang }) {
  const L = t[lang];
  const mobile = useIsMobile();
  const [ref, visible] = useScrollReveal();
  return (
    <section style={{ padding: mobile ? "60px 20px" : "100px 40px", background: "#0b1d3a", position: "relative", overflow: "hidden" }}>
      {!mobile && <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,116,12,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />}
      <div ref={ref} style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 0.7s" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: mobile ? "clamp(26px, 6vw, 34px)" : "clamp(32px, 4vw, 50px)", fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.2 }}>{L.ctaTitle}</h2>
        <p style={{ fontSize: mobile ? 14 : 17, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: mobile ? 28 : 40, fontFamily: "'Outfit',sans-serif" }}>{L.ctaSub}</p>
        <a href="#contact" style={{ display: "inline-block", padding: mobile ? "14px 32px" : "16px 44px", background: "#e8740c", color: "#fff", textDecoration: "none", fontSize: mobile ? 12 : 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", borderRadius: 6, transition: "all 0.3s", fontFamily: "'Outfit',sans-serif" }}>
          {L.ctaBtn}
        </a>
      </div>
    </section>
  );
}

/* ── CONTACT SECTION ─────────────────────────────────── */
function ContactSection({ lang }) {
  const L = t[lang];
  const mobile = useIsMobile();
  const [ref, visible] = useScrollReveal();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [focusedField, setFocusedField] = useState(null);
  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const inputStyle = (field) => ({
    width: "100%", padding: "14px 16px",
    border: `1.5px solid ${focusedField === field ? "#e8740c" : "#e0e0e0"}`,
    borderRadius: 10, fontSize: 15, fontFamily: "'Outfit',sans-serif",
    outline: "none", transition: "all 0.3s",
    background: focusedField === field ? "#fff" : "#fafafa",
    boxSizing: "border-box"
  });
  const contactInfoItems = [
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8740c" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>, title: lang === "en" ? "Our Location" : "Notre Emplacement", detail: L.contactAddress },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8740c" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.86 19.86 0 013.09 5.18 2 2 0 015.11 3h3a2 2 0 012 1.72c.13.81.37 1.61.68 2.38a2 2 0 01-.45 2.11L8.09 11.5a16 16 0 006.41 6.41l2.29-2.25a2 2 0 012.11-.45c.77.31 1.57.55 2.38.68a2 2 0 011.72 2.03z" /></svg>, title: lang === "en" ? "Call Us" : "Appelez-Nous", detail: L.contactPhoneNum },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8740c" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>, title: lang === "en" ? "Email Us" : "Écrivez-Nous", detail: L.contactEmailAddr }
  ];

  return (
    <section id="contact" style={{ padding: mobile ? "70px 20px" : "120px 40px", background: "#f9f9f7" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
        <div style={{ textAlign: "center", marginBottom: mobile ? 40 : 64 }}>
          <div style={{ fontSize: mobile ? 12 : 14, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#e8740c", marginBottom: 14, fontFamily: "'Outfit',sans-serif" }}>{L.contactTag}</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: mobile ? "clamp(28px, 6vw, 36px)" : "clamp(36px, 5vw, 58px)", fontWeight: 700, color: "#0b1d3a", marginBottom: 14 }}>{L.contactTitle}</h2>
          <p style={{ maxWidth: 600, margin: "0 auto", fontSize: mobile ? 14 : 16, color: "#999", lineHeight: 1.7, fontFamily: "'Outfit',sans-serif" }}>{L.contactSub}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1.2fr", gap: mobile ? 36 : 60 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {contactInfoItems.map((item, i) => <ContactInfoCard key={i} item={item} mobile={mobile} />)}
          </div>
          <div style={{ background: "#fff", borderRadius: 20, padding: mobile ? "28px 24px" : "44px 40px", boxShadow: "0 8px 40px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 18, marginBottom: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#0b1d3a", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>{L.contactName}</label>
                <input type="text" value={formData.name} onChange={e => handleChange("name", e.target.value)} onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)} style={inputStyle("name")} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#0b1d3a", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>{L.contactEmail}</label>
                <input type="email" value={formData.email} onChange={e => handleChange("email", e.target.value)} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} style={inputStyle("email")} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 18, marginBottom: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#0b1d3a", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>{L.contactPhone}</label>
                <input type="tel" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)} style={inputStyle("phone")} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#0b1d3a", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>{L.contactSubject}</label>
                <input type="text" value={formData.subject} onChange={e => handleChange("subject", e.target.value)} onFocus={() => setFocusedField("subject")} onBlur={() => setFocusedField(null)} style={inputStyle("subject")} />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#0b1d3a", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>{L.contactMessage}</label>
              <textarea value={formData.message} onChange={e => handleChange("message", e.target.value)} onFocus={() => setFocusedField("message")} onBlur={() => setFocusedField(null)} rows={5}
                style={{ ...inputStyle("message"), resize: "vertical", minHeight: 120 }} />
            </div>
            <button style={{
              width: "100%", padding: "16px", background: "#e8740c", color: "#fff",
              border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700,
              letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer",
              fontFamily: "'Outfit',sans-serif", transition: "all 0.3s",
              boxShadow: "0 4px 16px rgba(232,116,12,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 0
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#c96000"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(232,116,12,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#e8740c"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(232,116,12,0.3)"; }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              {L.contactSend}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactInfoCard({ item, mobile }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 18,
        padding: mobile ? "18px 20px" : "22px 24px",
        background: "#fff", borderRadius: 14,
        border: `1.5px solid ${hovered ? "#e8740c" : "#f0f0f0"}`,
        transition: "all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
        transform: hovered ? "translateX(6px)" : "translateX(0)",
        boxShadow: hovered ? "0 8px 30px rgba(232,116,12,0.1)" : "0 2px 8px rgba(0,0,0,0.03)",
        cursor: "default"
      }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: hovered ? "rgba(232,116,12,0.1)" : "#fef8f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.35s" }}>
        {item.icon}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#999", marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>{item.title}</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#0b1d3a", fontFamily: "'Outfit',sans-serif" }}>{item.detail}</div>
      </div>
    </div>
  );
}

/* ── FOOTER ──────────────────────────────────────────── */
function Footer({ lang }) {
  const L = t[lang];
  const mobile = useIsMobile();
  const linkStyle = { display: "block", fontSize: 14, color: "rgba(255,255,255,0.65)", textDecoration: "none", marginBottom: 14, transition: "color 0.3s", fontFamily: "'Outfit',sans-serif" };
  return (
    <footer style={{ background: "#091627", color: "#fff", padding: mobile ? "50px 20px 30px" : "80px 40px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: mobile ? "1fr" : "2fr 1fr 1fr 1.5fr", gap: mobile ? 36 : 48, marginBottom: mobile ? 36 : 60 }}>
        <div>
          <a href="#home" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 28, fontWeight: 700, color: "#fff", textDecoration: "none", letterSpacing: 1 }}>
            FRANCE<span style={{ color: "#e8740c" }}> CARGO</span>
          </a>
          <p style={{ marginTop: 16, fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, maxWidth: 300, fontFamily: "'Outfit',sans-serif" }}>{L.footerDesc}</p>
        </div>
        <div>
          <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 20, fontFamily: "'Outfit',sans-serif" }}>{L.quickLinks}</h4>
          {[["#home", L.home], ["#about", L.aboutUs], ["#services", L.services], ["#contact", L.contact]].map(([href, label]) => (
            <a key={label} href={href} style={linkStyle}>{label}</a>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 20, fontFamily: "'Outfit',sans-serif" }}>{L.footerSvcTitle}</h4>
          {[L.svcTransportation, L.svcWarehousing, L.svcOceanAir, L.svcCustoms].map(s => (
            <a key={s} href="#services" style={linkStyle}>{s}</a>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 20, fontFamily: "'Outfit',sans-serif" }}>{L.contactUs}</h4>
          {[
            ["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z", "Paris, France"],
            ["M22 16.92v3a2 2 0 01-2.18 2A19.86 19.86 0 013.09 5.18 2 2 0 015.11 3h3a2 2 0 012 1.72c.13.81.37 1.61.68 2.38a2 2 0 01-.45 2.11L8.09 11.5a16 16 0 006.41 6.41l2.29-2.25a2 2 0 012.11-.45c.77.31 1.57.55 2.38.68a2 2 0 011.72 2.03z", "+91 98405 82500"],
            ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "riorixtech@gmail.com"],
          ].map(([d, text], i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16, fontSize: 14, color: "rgba(255,255,255,0.65)", fontFamily: "'Outfit',sans-serif" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 3 }}><path d={d} /></svg>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "center" : "center", gap: mobile ? 16 : 0, fontSize: 13, color: "rgba(255,255,255,0.3)", fontFamily: "'Outfit',sans-serif" }}>
        <span>{L.rights}</span>
        <div style={{ display: "flex", gap: 14 }}>
          {[
            "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
            "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
          ].map((d, i) => (
            <a key={i} href="#" style={{ width: 36, height: 36, border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}>
              <svg width="14" height="14" viewBox="0 0 24 24"><path d={d} fill="rgba(255,255,255,0.55)" /></svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ── APP ──────────────────────────────────────────────── */
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState("en");
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (loginOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [loginOpen]);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setToast({ message: t[lang].authSuccess, type: "success" });
  };

  const handleLogout = () => {
    setUser(null);
    window.__authToken = null;
    setToast({ message: lang === "en" ? "Logged out successfully" : "Déconnexion réussie", type: "success" });
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#fff", color: "#0b1d3a", lineHeight: 1.6, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f8f8f6; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #e8740c; }
      `}</style>

      <Navbar scrolled={scrolled} lang={lang} setLang={setLang} onLoginClick={() => setLoginOpen(true)} user={user} onLogout={handleLogout} />
      <Hero lang={lang} />
      <About lang={lang} />
      <Highlights lang={lang} />
      <Services lang={lang} />
      <CtaBanner lang={lang} />
      <ContactSection lang={lang} />
      <Footer lang={lang} />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} lang={lang} onAuthSuccess={handleAuthSuccess} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
