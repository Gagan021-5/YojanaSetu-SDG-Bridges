import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import { FiMic, FiSun, FiMoon } from "react-icons/fi";
import translations from "./utils/Translation";
import mockSchemes from "./utils/Scheme";
import mockCenters from "./utils/Centers";
import {
  Home,
  Search,
  MapPin,
  MessageCircle,
  FileText,
  CheckCircle,
  Building,
  Phone,
  Globe,
  Filter,
  ArrowRight,
  Heart,
  GraduationCap,
  Sprout,
  Shield,
  Star,
  Navigation,
  Clock,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useInView } from "react-intersection-observer";

const VoiceAssistant = lazy(() => import("./components/VoiceAssistant"));

const GovernmentSchemesApp = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [language, setLanguage] = useState("en");
  const [userType, setUserType] = useState("");
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const chatEndRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [voiceContext, setVoiceContext] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "light";
    } catch {
      return "light";
    }
  });
  const containerRef = useRef(null);

  // Scroll animation effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yPos = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Handle theme toggle
  useEffect(() => {
    try {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    } catch (e) {
      console.warn("localStorage not available:", e);
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  // Handle scroll for header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const pageTransition = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
    transition: { duration: 0.25, ease: "easeInOut" },
  };

  const t = translations[language];

  // Voice Assistant Functions
  const handleVoiceCommand = (transcript) => {
    const lowerCommand = transcript.toLowerCase();

    if (voiceContext === "search") {
      setSearchInput(transcript);
      setCurrentPage("schemes");
    } else if (voiceContext === "chat") {
      setChatInput(transcript);
      setTimeout(() => {
        document.getElementById("chat-send-btn")?.click();
      }, 100);
    }

    if (lowerCommand.includes("home")) {
      setCurrentPage("home");
    } else if (
      lowerCommand.includes("scheme") ||
      lowerCommand.includes("program")
    ) {
      setCurrentPage("schemes");
    } else if (
      lowerCommand.includes("eligibility") ||
      lowerCommand.includes("check")
    ) {
      setCurrentPage("eligibility");
    } else if (
      lowerCommand.includes("center") ||
      lowerCommand.includes("office")
    ) {
      setCurrentPage("centers");
    } else if (
      lowerCommand.includes("chat") ||
      lowerCommand.includes("assistant")
    ) {
      setCurrentPage("chat");
    }

    if (lowerCommand.includes("health")) {
      setSelectedCategory("health");
    } else if (lowerCommand.includes("education")) {
      setSelectedCategory("education");
    } else if (
      lowerCommand.includes("agriculture") ||
      lowerCommand.includes("farmer")
    ) {
      setSelectedCategory("agriculture");
    } else if (lowerCommand.includes("social")) {
      setSelectedCategory("social");
    }

    if (lowerCommand.includes("kisan")) {
      const pmKisan = mockSchemes.find((s) => s.id === 1);
      if (pmKisan) {
        setSelectedScheme(pmKisan);
        setCurrentPage("schemeDetail");
      }
    }
  };

  const categories = [
    { id: "all", name: t.all, icon: FileText },
    { id: "health", name: t.health, icon: Heart },
    { id: "education", name: t.education, icon: GraduationCap },
    { id: "agriculture", name: t.agriculture, icon: Sprout },
    { id: "social", name: t.social, icon: Shield },
  ];

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessages = [...chatMessages, { type: "user", text: chatInput }];

    let botResponse = "I can help you find the right government scheme. ";
    if (
      chatInput.toLowerCase().includes("farmer") ||
      chatInput.toLowerCase().includes("agriculture")
    ) {
      botResponse +=
        "For farmers, I recommend checking PM-KISAN scheme for income support.";
    } else if (
      chatInput.toLowerCase().includes("health") ||
      chatInput.toLowerCase().includes("medical")
    ) {
      botResponse +=
        "For health benefits, Ayushman Bharat provides excellent coverage up to ₹5 lakhs.";
    } else if (
      chatInput.toLowerCase().includes("education") ||
      chatInput.toLowerCase().includes("school")
    ) {
      botResponse +=
        "For education support, Samagra Shiksha provides free education and materials.";
    } else if (
      chatInput.toLowerCase().includes("house") ||
      chatInput.toLowerCase().includes("home")
    ) {
      botResponse +=
        "For housing needs, PM Awas Yojana offers subsidized housing solutions.";
    } else {
      botResponse +=
        "Could you tell me more about your specific needs? Are you looking for health, education, agriculture, or housing support?";
    }

    newMessages.push({ type: "bot", text: botResponse });
    setChatMessages(newMessages);
    setChatInput("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const filteredSchemes =
    selectedCategory === "all"
      ? mockSchemes
      : mockSchemes.filter((scheme) => scheme.category === selectedCategory);

  // InView hook for scroll animations
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const renderHomePage = () => (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 overflow-x-hidden"
      style={{ position: "relative" }} // Ensure position for useScroll
      ref={containerRef}
    >
      {/* Voice Assistant Modal */}
      <AnimatePresence>
        {showVoiceAssistant && (
          <motion.div
            key="voice-assistant"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense
              fallback={
                <div className="text-center py-4 text-gray-600 dark:text-gray-300">
                  Loading...
                </div>
              }
            >
              <VoiceAssistant
                onClose={() => setShowVoiceAssistant(false)}
                onCommand={handleVoiceCommand}
                language={language}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        className={`fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 z-50 transition-all duration-300 ${
          isScrolled ? "py-2" : "py-4"
        } overflow-x-hidden`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              role="banner"
            >
              <motion.div
                className="w-10 h-10 bg-blue-600 dark:bg-blue-700 rounded-lg flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              >
                <Building className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t.subtitle}
                </p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-3">
              {/* Language Select */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors pl-8 pr-10 text-sm"
                  aria-label="Select language"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                </select>
                <Globe className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Theme Toggle */}
              <motion.button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={
                  theme === "light"
                    ? "Switch to dark mode"
                    : "Switch to light mode"
                }
              >
                {theme === "light" ? (
                  <FiMoon className="w-5 h-5" />
                ) : (
                  <FiSun className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pt-24 sm:pt-32">
        {!userType && (
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4"
              variants={fadeIn}
            >
              {t.chooseArea}
            </motion.h2>
            <motion.div
              className="grid md:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto"
              variants={staggerContainer}
            >
              <motion.button
                onClick={() => setUserType("urban")}
                className="p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 group relative overflow-hidden"
                variants={fadeIn}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Select urban area"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Building className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t.urban}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Access schemes designed for city residents
                </p>
              </motion.button>

              <motion.button
                onClick={() => setUserType("rural")}
                className="p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-green-500 dark:hover:border-green-400 group relative overflow-hidden"
                variants={fadeIn}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Select rural area"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent dark:from-green-900 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Sprout className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 dark:text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t.rural}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Find schemes for rural communities
                </p>
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {userType && (
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            ref={ref}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 relative overflow-hidden"
              variants={fadeIn}
              whileHover={{ scale: 1.005 }}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900 opacity-20"></div>
              <div className="relative flex items-center gap-2">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />

                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="flex-1 pl-12 py-4 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  onKeyPress={(e) =>
                    e.key === "Enter" && setCurrentPage("schemes")
                  }
                />

                <motion.button
                  type="button"
                  onClick={() => {
                    setVoiceContext("search");
                    setShowVoiceAssistant(true);
                  }}
                  className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 p-3 rounded-full hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Speak your query"
                >
                  <FiMic className="w-5 h-5" />
                </motion.button>
              </div>

              <motion.div
                className="grid md:grid-cols-3 gap-4 mt-6"
                variants={staggerContainer}
              >
                <motion.button
                  onClick={() => setCurrentPage("schemes")}
                  className="flex items-center justify-center space-x-2 bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                  variants={fadeIn}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Search className="w-5 h-5" />
                  <span>{t.schemes}</span>
                </motion.button>

                <motion.button
                  onClick={() => setCurrentPage("centers")}
                  className="flex items-center justify-center space-x-2 bg-green-600 dark:bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
                  variants={fadeIn}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <MapPin className="w-5 h-5" />
                  <span>{t.findCenter}</span>
                </motion.button>

                <motion.button
                  onClick={() => setCurrentPage("chat")}
                  className="flex items-center justify-center space-x-2 bg-purple-600 dark:bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors"
                  variants={fadeIn}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t.chatbot}</span>
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 gap-6"
              variants={staggerContainer}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                variants={fadeIn}
                whileHover={{ y: -3 }}
              >
                <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 opacity-30"></div>
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                  {t.eligibility}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Check your eligibility for multiple schemes at once
                </p>
                <motion.button
                  onClick={() => setCurrentPage("eligibility")}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center"
                  whileHover={{ x: 3 }}
                >
                  Check now <ArrowRight className="w-4 h-4 ml-1" />
                </motion.button>
              </motion.div>

              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                variants={fadeIn}
                whileHover={{ y: -3 }}
              >
                <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 opacity-30"></div>
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                  <MapPin className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                  {t.centers}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Find nearby centers for offline assistance
                </p>
                <motion.button
                  onClick={() => setCurrentPage("centers")}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center"
                  whileHover={{ x: 3 }}
                >
                  Find centers <ArrowRight className="w-4 h-4 ml-1" />
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderSchemesPage = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <AnimatePresence>
        {showVoiceAssistant && (
          <motion.div
            key="voice-assistant"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense
              fallback={
                <div className="text-center py-4 text-gray-600 dark:text-gray-300">
                  Loading...
                </div>
              }
            >
              <VoiceAssistant
                onClose={() => setShowVoiceAssistant(false)}
                onCommand={handleVoiceCommand}
                language={language}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t.allSchemes}
          </h1>
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="bg-gray-600 dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.home}
          </motion.button>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8"
          variants={fadeIn}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
            <Filter className="w-5 h-5 mr-2" />
            {t.filterBy}
          </h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    selectedCategory === category.id
                      ? "bg-blue-600 dark:bg-blue-700 text-white border-blue-600 dark:border-blue-700"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {filteredSchemes.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-600 dark:text-gray-300">
              No schemes found for this category.
            </div>
          ) : (
            filteredSchemes.map((scheme, index) => {
              const Icon = scheme.icon;
              return (
                <motion.div
                  key={scheme.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all"
                  variants={fadeIn}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -5 }}
                >
                  <div
                    className={`h-2 bg-${scheme.color}-500 dark:bg-${scheme.color}-600`}
                  ></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        className={`w-12 h-12 bg-${scheme.color}-100 dark:bg-${scheme.color}-900 rounded-lg flex items-center justify-center`}
                        whileHover={{ rotate: 15 }}
                      >
                        <Icon
                          className={`w-6 h-6 text-${scheme.color}-600 dark:text-${scheme.color}-400`}
                        />
                      </motion.div>
                      <div className="flex space-x-1">
                        {scheme.sdg.map((sdg) => (
                          <motion.span
                            key={sdg}
                            className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center justify-center text-xs font-semibold"
                            whileHover={{ scale: 1.2 }}
                          >
                            {sdg}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {language === "hi" ? scheme.nameHi : scheme.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {language === "hi"
                        ? scheme.descriptionHi
                        : scheme.description}
                    </p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4">
                      {scheme.benefit}
                    </p>

                    <div className="space-y-2">
                      <motion.button
                        onClick={() => {
                          setSelectedScheme(scheme);
                          setCurrentPage("schemeDetail");
                        }}
                        className="w-full bg-blue-600 dark:bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {t.viewDetails}
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          setSelectedScheme(scheme);
                          setCurrentPage("eligibility");
                        }}
                        className="w-full border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {t.checkEligibility}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );

  const renderSchemeDetail = () => {
    if (!selectedScheme) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-center text-gray-600 dark:text-gray-300">
            No scheme selected. Please go back to schemes.
            <motion.button
              onClick={() => setCurrentPage("schemes")}
              className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center mx-auto"
              whileHover={{ x: 3 }}
            >
              Back to schemes <ArrowRight className="w-4 h-4 ml-1" />
            </motion.button>
          </div>
        </div>
      );
    }
    const Icon = selectedScheme.icon;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        <AnimatePresence>
          {showVoiceAssistant && (
            <motion.div
              key="voice-assistant"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense
                fallback={
                  <div className="text-center py-4 text-gray-600 dark:text-gray-300">
                    Loading...
                  </div>
                }
              >
                <VoiceAssistant
                  onClose={() => setShowVoiceAssistant(false)}
                  onCommand={handleVoiceCommand}
                  language={language}
                />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <motion.button
            onClick={() => setCurrentPage("schemes")}
            className="mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
            whileHover={{ x: -3 }}
          >
            <ArrowRight className="w-4 h-4 mr-1 transform rotate-180" />
            Back to schemes
          </motion.button>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            variants={fadeIn}
          >
            <motion.div
              className={`h-32 bg-gradient-to-r from-${selectedScheme.color}-500 to-${selectedScheme.color}-600 dark:from-${selectedScheme.color}-600 dark:to-${selectedScheme.color}-700 flex items-center justify-center`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <Icon className="w-16 h-16 text-white" />
              </motion.div>
            </motion.div>

            <div className="p-6 sm:p-8">
              <motion.h1
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {language === "hi"
                  ? selectedScheme.nameHi
                  : selectedScheme.name}
              </motion.h1>
              <motion.p
                className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {language === "hi"
                  ? selectedScheme.descriptionHi
                  : selectedScheme.description}
              </motion.p>

              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Benefits
                  </h3>
                  <motion.p
                    className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 mb-6"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    {selectedScheme.benefit}
                  </motion.p>

                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Eligibility Criteria
                  </h3>
                  <ul className="space-y-2">
                    {selectedScheme.eligibility.map((criteria, index) => (
                      <motion.li
                        key={index}
                        className="flex items-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                        {criteria}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    How to Apply
                  </h3>
                  <div className="space-y-4">
                    <motion.div
                      className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                    >
                      <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                        Online Application
                      </h4>
                      <p className="text-blue-800 dark:text-blue-300 text-sm mb-3">
                        Apply directly through the official portal
                      </p>
                      <motion.a
                        href={selectedScheme.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors inline-block"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {t.applyOnline}
                      </motion.a>
                    </motion.div>

                    <motion.div
                      className="p-4 bg-green-50 dark:bg-green-900/50 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                    >
                      <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">
                        Offline Application
                      </h4>
                      <p className="text-green-800 dark:text-green-300 text-sm mb-3">
                        Visit nearby centers for assistance
                      </p>
                      <motion.button
                        onClick={() => setCurrentPage("centers")}
                        className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {t.findNearbyCenter}
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderEligibilityPage = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <AnimatePresence>
        {showVoiceAssistant && (
          <motion.div
            key="voice-assistant"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense
              fallback={
                <div className="text-center py-4 text-gray-600 dark:text-gray-300">
                  Loading...
                </div>
              }
            >
              <VoiceAssistant
                onClose={() => setShowVoiceAssistant(false)}
                onCommand={handleVoiceCommand}
                language={language}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <motion.button
          onClick={() => setCurrentPage("home")}
          className="mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
          whileHover={{ x: -3 }}
        >
          <ArrowRight className="w-4 h-4 mr-1 transform rotate-180" />
          {t.home}
        </motion.button>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.h1
            className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8"
            variants={fadeIn}
          >
            {t.eligibilityChecker}
          </motion.h1>

          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h3
              className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
              variants={fadeIn}
            >
              {t.personalInfo}
            </motion.h3>

            <motion.div
              className="grid md:grid-cols-2 gap-4 sm:gap-6"
              variants={staggerContainer}
            >
              <motion.div variants={fadeIn}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Age
                </label>
                <motion.input
                  type="number"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter your age"
                  whileFocus={{ scale: 1.02 }}
                  aria-label="Enter your age"
                />
              </motion.div>

              <motion.div variants={fadeIn}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Annual Income (₹)
                </label>
                <motion.input
                  type="number"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter annual income"
                  whileFocus={{ scale: 1.02 }}
                  aria-label="Enter annual income"
                />
              </motion.div>
            </motion.div>

            <motion.div variants={fadeIn}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Occupation
              </label>
              <motion.select
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                whileFocus={{ scale: 1.02 }}
                aria-label="Select occupation"
              >
                <option value="">Select occupation</option>
                <option value="farmer">Farmer</option>
                <option value="student">Student</option>
                <option value="unemployed">Unemployed</option>
                <option value="self-employed">Self Employed</option>
                <option value="employed">Employed</option>
              </motion.select>
            </motion.div>

            <motion.div variants={fadeIn}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                State
              </label>
              <motion.select
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                whileFocus={{ scale: 1.02 }}
                aria-label="Select state"
              >
                <option value="">Select state</option>
                <option value="delhi">Delhi</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="karnataka">Karnataka</option>
                <option value="uttar-pradesh">Uttar Pradesh</option>
              </motion.select>
            </motion.div>

            <motion.div className="flex items-center" variants={fadeIn}>
              <input
                type="checkbox"
                id="terms"
                className="mr-2 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                aria-label="Agree to terms"
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-700 dark:text-gray-200"
              >
                I agree to share my information for eligibility checking
              </label>
            </motion.div>

            <motion.button
              type="button"
              onClick={() => {
                alert(
                  "Based on your information, you are eligible for:\n\n1. PM-KISAN (if farmer)\n2. Ayushman Bharat\n3. MGNREGA\n\nClick on schemes to learn more!"
                );
                setCurrentPage("schemes");
              }}
              className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors font-semibold"
              variants={fadeIn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t.submit}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );

  const renderChatPage = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <AnimatePresence>
        {showVoiceAssistant && (
          <motion.div
            key="voice-assistant"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense
              fallback={
                <div className="text-center py-4 text-gray-600 dark:text-gray-300">
                  Loading...
                </div>
              }
            >
              <VoiceAssistant
                onClose={() => setShowVoiceAssistant(false)}
                onCommand={handleVoiceCommand}
                language={language}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.button
          onClick={() => setCurrentPage("home")}
          className="mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowRight className="w-4 h-4 mr-1 transform rotate-180" />
          {t.home}
        </motion.button>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-[32rem] sm:h-[36rem] flex flex-col overflow-hidden"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="p-4 border-b bg-blue-600 dark:bg-blue-700 text-white rounded-t-lg">
            <h2 className="text-xl font-semibold flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              {t.chatWithUs}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
            {chatMessages.length === 0 && (
              <motion.div
                className="text-center text-gray-500 dark:text-gray-300 py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                <p>
                  Ask me about government schemes and I'll help you find the
                  right one!
                </p>
              </motion.div>
            )}

            {chatMessages.map((message, index) => (
              <motion.div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div
                  className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-600 dark:bg-blue-700 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t bg-white dark:bg-gray-800">
            <div className="flex space-x-2 items-center">
              <motion.input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about government schemes..."
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                whileFocus={{ scale: 1.01 }}
                aria-label="Chat input"
              />
              <motion.button
                type="button"
                onClick={() => {
                  setVoiceContext("chat");
                  setShowVoiceAssistant(true);
                }}
                className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-600 transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Speak your query"
              >
                <FiMic className="w-5 h-5" />
              </motion.button>
              <motion.button
                id="chat-send-btn"
                type="submit"
                onClick={handleChatSubmit}
                className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderCentersPage = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <AnimatePresence>
        {showVoiceAssistant && (
          <motion.div
            key="voice-assistant"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense
              fallback={
                <div className="text-center py-4 text-gray-600 dark:text-gray-300">
                  Loading...
                </div>
              }
            >
              <VoiceAssistant
                onClose={() => setShowVoiceAssistant(false)}
                onCommand={handleVoiceCommand}
                language={language}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t.offlineCenters}
          </h1>
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="bg-gray-600 dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.home}
          </motion.button>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
          variants={fadeIn}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Find Centers Near You
            </h3>
            <div className="flex space-x-2">
              <motion.button
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.mapView}
              </motion.button>
              <motion.button
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.listView}
              </motion.button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <motion.input
              type="text"
              placeholder="Enter your location..."
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              whileFocus={{ scale: 1.02 }}
              aria-label="Enter location"
            />
            <motion.select
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              whileFocus={{ scale: 1.02 }}
              aria-label="Select center type"
            >
              <option value="">All Center Types</option>
              <option value="csc">Common Service Centers</option>
              <option value="post">Post Offices</option>
              <option value="bank">Banks</option>
            </motion.select>
            <motion.button
              className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {mockCenters.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-600 dark:text-gray-300">
              No centers found.
            </div>
          ) : (
            mockCenters.map((center, index) => (
              <motion.div
                key={center.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all overflow-hidden"
                variants={fadeIn}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {center.name}
                    </h3>
                    <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                      {center.type}
                    </span>
                  </div>
                  <motion.div
                    className="text-right"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {center.rating}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {center.distance}
                    </p>
                  </motion.div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 flex items-start">
                    <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    {center.address}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                    {center.phone}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                    {center.timing}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Services:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {center.services.map((service, index) => (
                      <motion.span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs rounded"
                        whileHover={{ scale: 1.05 }}
                      >
                        {service}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <motion.button
                    className="flex-1 bg-blue-600 dark:bg-blue-700 text-white px-3 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors text-sm flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    {t.getDirections}
                  </motion.button>
                  <motion.button
                    className="flex-1 border border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/50 transition-colors text-sm flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );

  const NavigationBar = () => (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg md:hidden overflow-x-hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-around py-2">
        {[
          { id: "home", icon: Home, label: t.home },
          { id: "schemes", icon: FileText, label: t.schemes },
          { id: "eligibility", icon: CheckCircle, label: t.eligibility },
          { id: "centers", icon: MapPin, label: t.centers },
          { id: "chat", icon: MessageCircle, label: t.chatbot },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center py-2 px-3 ${
                currentPage === item.id
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Go to ${item.label} page`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={pageTransition.initial}
          animate={pageTransition.animate}
          exit={pageTransition.exit}
          transition={pageTransition.transition}
        >
          {currentPage === "home" && renderHomePage()}
          {currentPage === "schemes" && renderSchemesPage()}
          {currentPage === "schemeDetail" && renderSchemeDetail()}
          {currentPage === "eligibility" && renderEligibilityPage()}
          {currentPage === "chat" && renderChatPage()}
          {currentPage === "centers" && renderCentersPage()}
        </motion.div>
      </AnimatePresence>
      <NavigationBar />
    </div>
  );
};

export default GovernmentSchemesApp;
