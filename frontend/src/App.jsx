import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Search, 
  MapPin, 
  MessageCircle, 
  FileText, 
  CheckCircle, 
  Users, 
  Building, 
  Phone, 
  Globe, 
  Filter,
  ArrowRight,
  Heart,
  GraduationCap,
  Sprout,
  Shield,
  ChevronDown,
  Star,
  Navigation,
  Mail,
  Clock
} from 'lucide-react';

const GovernmentSchemesApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [language, setLanguage] = useState('en');
  const [userType, setUserType] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [eligibilityForm, setEligibilityForm] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const chatEndRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const recognitionRef = useRef(null);
  const [searchInput, setSearchInput] = useState('');
  const [isSearchListening, setIsSearchListening] = useState(false);
  const [isSearchTranslating, setIsSearchTranslating] = useState(false);
  const searchRecognitionRef = useRef(null);

  const translations = {
    en: {
      title: "YojanaSetu",
      subtitle: "Connecting you to government schemes",
      selectLanguage: "Select Language",
      chooseArea: "Choose Your Area",
      urban: "Urban",
      rural: "Rural",
      searchPlaceholder: "Search for schemes or type your need...",
      findCenter: "Find Nearest Center",
      voiceSearch: "Voice Search",
      schemes: "Schemes",
      eligibility: "Check Eligibility",
      centers: "Offline Centers",
      chatbot: "Ask Assistant",
      home: "Home",
      allSchemes: "All Government Schemes",
      filterBy: "Filter by Category",
      all: "All",
      health: "Health",
      education: "Education",
      agriculture: "Agriculture",
      social: "Social Welfare",
      checkEligibility: "Check Eligibility",
      viewDetails: "View Details",
      applyOnline: "Apply Online",
      findNearbyCenter: "Find Nearby Center",
      eligibilityChecker: "Eligibility Checker",
      personalInfo: "Personal Information",
      submit: "Submit",
      chatWithUs: "Chat with Assistant",
      offlineCenters: "Offline Access Centers",
      mapView: "Map View",
      listView: "List View",
      getDirections: "Get Directions",
      callCenter: "Call Center"
    },
    hi: {
      title: "योजना सेतु",
      subtitle: "सरकारी योजनाओं से जोड़ने वाला सेतु",
      selectLanguage: "भाषा चुनें",
      chooseArea: "अपना क्षेत्र चुनें",
      urban: "शहरी",
      rural: "ग्रामीण",
      searchPlaceholder: "योजनाओं की खोज करें या अपनी आवश्यकता बताएं...",
      findCenter: "निकटतम केंद्र खोजें",
      voiceSearch: "आवाज़ से खोज",
      schemes: "योजनाएं",
      eligibility: "पात्रता जांचें",
      centers: "ऑफ़लाइन केंद्र",
      chatbot: "सहायक से पूछें",
      home: "होम",
      allSchemes: "सभी सरकारी योजनाएं",
      filterBy: "श्रेणी के अनुसार फ़िल्टर करें",
      all: "सभी",
      health: "स्वास्थ्य",
      education: "शिक्षा",
      agriculture: "कृषि",
      social: "सामाजिक कल्याण",
      checkEligibility: "पात्रता जांचें",
      viewDetails: "विवरण देखें",
      applyOnline: "ऑनलाइन आवेदन करें",
      findNearbyCenter: "निकटतम केंद्र खोजें",
      eligibilityChecker: "पात्रता जांचकर्ता",
      personalInfo: "व्यक्तिगत जानकारी",
      submit: "जमा करें",
      chatWithUs: "सहायक से बात करें",
      offlineCenters: "ऑफ़लाइन पहुंच केंद्र",
      mapView: "मैप दृश्य",
      listView: "सूची दृश्य",
      getDirections: "दिशा निर्देश प्राप्त करें",
      callCenter: "केंद्र को कॉल करें"
    }
  };

  const t = translations[language];

  const mockSchemes = [
    {
      id: 1,
      name: "PM-KISAN",
      nameHi: "पीएम-किसान",
      category: "agriculture",
      description: "Income support for farmers",
      descriptionHi: "किसानों के लिए आय सहायता",
      benefit: "₹6,000 per year",
      sdg: [1, 2], // No Poverty, Zero Hunger
      eligibility: ["Farmer", "Land ownership", "Below income threshold"],
      icon: Sprout,
      color: "green"
    },
    {
      id: 2,
      name: "Ayushman Bharat",
      nameHi: "आयुष्मान भारत",
      category: "health",
      description: "Health insurance coverage",
      descriptionHi: "स्वास्थ्य बीमा कवरेज",
      benefit: "₹5 lakh coverage",
      sdg: [3], // Good Health
      eligibility: ["Income criteria", "SECC database", "No existing insurance"],
      icon: Heart,
      color: "red"
    },
    {
      id: 3,
      name: "Samagra Shiksha",
      nameHi: "समग्र शिक्षा",
      category: "education",
      description: "School education support",
      descriptionHi: "स्कूली शिक्षा सहायता",
      benefit: "Free education & materials",
      sdg: [4], // Quality Education
      eligibility: ["School age", "Government school", "Regular attendance"],
      icon: GraduationCap,
      color: "blue"
    },
    {
      id: 4,
      name: "PM Awas Yojana",
      nameHi: "पीएम आवास योजना",
      category: "social",
      description: "Housing for all",
      descriptionHi: "सभी के लिए आवास",
      benefit: "Subsidized housing",
      sdg: [11], // Sustainable Cities
      eligibility: ["Income limit", "No pucca house", "Not availed before"],
      icon: Building,
      color: "orange"
    },
    {
      id: 5,
      name: "MGNREGA",
      nameHi: "मनरेगा",
      category: "social",
      description: "Employment guarantee",
      descriptionHi: "रोजगार गारंटी",
      benefit: "100 days guaranteed work",
      sdg: [1, 8], // No Poverty, Decent Work
      eligibility: ["Adult", "Rural area", "Willing to work"],
      icon: Users,
      color: "purple"
    }
  ];

  const mockCenters = [
    {
      id: 1,
      name: "Common Service Center - Rajouri Garden",
      type: "CSC",
      address: "A-1/123, Rajouri Garden, New Delhi - 110027",
      phone: "+91-11-12345678",
      services: ["Application submission", "Document verification", "Information"],
      distance: "0.5 km",
      rating: 4.2
    },
    {
      id: 2,
      name: "India Post Office - Kirti Nagar",
      type: "Post Office",
      address: "Kirti Nagar, New Delhi - 110015",
      phone: "+91-11-87654321",
      services: ["DBT services", "Pension disbursement", "Insurance"],
      distance: "1.2 km",
      rating: 4.0
    },
    {
      id: 3,
      name: "Bank of India - Subhash Nagar",
      type: "Bank",
      address: "Shop No. 45, Subhash Nagar, New Delhi - 110027",
      phone: "+91-11-11223344",
      services: ["Account opening", "Loan applications", "Government schemes"],
      distance: "0.8 km",
      rating: 4.5
    }
  ];

  const categories = [
    { id: 'all', name: t.all, icon: FileText },
    { id: 'health', name: t.health, icon: Heart },
    { id: 'education', name: t.education, icon: GraduationCap },
    { id: 'agriculture', name: t.agriculture, icon: Sprout },
    { id: 'social', name: t.social, icon: Shield }
  ];

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessages = [...chatMessages, { type: 'user', text: chatInput }];
    
    // Simple rule-based responses
    let botResponse = "I can help you find the right government scheme. ";
    if (chatInput.toLowerCase().includes('farmer') || chatInput.toLowerCase().includes('agriculture')) {
      botResponse += "For farmers, I recommend checking PM-KISAN scheme for income support.";
    } else if (chatInput.toLowerCase().includes('health') || chatInput.toLowerCase().includes('medical')) {
      botResponse += "For health benefits, Ayushman Bharat provides excellent coverage up to ₹5 lakhs.";
    } else if (chatInput.toLowerCase().includes('education') || chatInput.toLowerCase().includes('school')) {
      botResponse += "For education support, Samagra Shiksha provides free education and materials.";
    } else if (chatInput.toLowerCase().includes('house') || chatInput.toLowerCase().includes('home')) {
      botResponse += "For housing needs, PM Awas Yojana offers subsidized housing solutions.";
    } else {
      botResponse += "Could you tell me more about your specific needs? Are you looking for health, education, agriculture, or housing support?";
    }

    newMessages.push({ type: 'bot', text: botResponse });
    setChatMessages(newMessages);
    setChatInput('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const filteredSchemes = selectedCategory === 'all' 
    ? mockSchemes 
    : mockSchemes.filter(scheme => scheme.category === selectedCategory);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsListening(true);
    recognition.start();
    recognition.onresult = async (event) => {
      let spokenText = event.results[0][0].transcript;
      setIsListening(false);
      if (language === 'hi') {
        setIsTranslating(true);
        try {
          // LibreTranslate API (no key needed for demo)
          const res = await fetch('https://libretranslate.de/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: spokenText, source: 'hi', target: 'en', format: 'text' })
          });
          const data = await res.json();
          setIsTranslating(false);
          setChatInput(data.translatedText);
          setTimeout(() => {
            document.getElementById('chat-send-btn')?.click();
          }, 100);
        } catch (err) {
          setIsTranslating(false);
          alert('Translation failed. Please try again.');
        }
      } else {
        setChatInput(spokenText);
        setTimeout(() => {
          document.getElementById('chat-send-btn')?.click();
        }, 100);
      }
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      alert('Speech recognition error: ' + event.error);
    };
    recognitionRef.current = recognition;
  };

  const startSearchListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsSearchListening(true);
    recognition.start();
    recognition.onresult = async (event) => {
      let spokenText = event.results[0][0].transcript;
      setIsSearchListening(false);
      if (language === 'hi') {
        setIsSearchTranslating(true);
        try {
          const res = await fetch('https://libretranslate.de/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: spokenText, source: 'hi', target: 'en', format: 'text' })
          });
          const data = await res.json();
          setIsSearchTranslating(false);
          setSearchInput(data.translatedText);
        } catch (err) {
          setIsSearchTranslating(false);
          alert('Translation failed. Please try again.');
        }
      } else {
        setSearchInput(spokenText);
      }
    };
    recognition.onerror = (event) => {
      setIsSearchListening(false);
      alert('Speech recognition error: ' + event.error);
    };
    searchRecognitionRef.current = recognition;
  };

  const renderHomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
                <p className="text-sm text-gray-600">{t.subtitle}</p>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* User Type Selection */}
        {!userType && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.chooseArea}</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <button
                onClick={() => setUserType('urban')}
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-500 group"
              >
                <Building className="w-16 h-16 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.urban}</h3>
                <p className="text-gray-600">Access schemes designed for city residents</p>
              </button>
              
              <button
                onClick={() => setUserType('rural')}
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-green-500 group"
              >
                <Sprout className="w-16 h-16 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.rural}</h3>
                <p className="text-gray-600">Find schemes for rural communities</p>
              </button>
            </div>
          </div>
        )}

        {/* Main Interface */}
        {userType && (
          <div className="space-y-8">
            {/* Search Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="relative flex items-center">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-12 pr-16 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                  onKeyPress={e => e.key === 'Enter' && setCurrentPage('schemes')}
                  disabled={isSearchListening || isSearchTranslating}
                  style={{ background: 'rgba(255,255,255,0.95)' }}
                />
                <button
                  type="button"
                  onClick={startSearchListening}
                  className={`absolute right-12 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center ${isSearchListening ? 'animate-pulse' : ''}`}
                  title="Speak your query"
                  disabled={isSearchListening || isSearchTranslating}
                  style={{ zIndex: 2 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v2m0 0a4 4 0 01-4-4h8a4 4 0 01-4 4zm0-2V6a4 4 0 018 0v6a4 4 0 01-8 0z" /></svg>
                  {isSearchListening && <span className="ml-2 text-blue-600 font-semibold">Listening...</span>}
                  {isSearchTranslating && <span className="ml-2 text-green-600 font-semibold">Translating...</span>}
                </button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <button 
                  onClick={() => setCurrentPage('schemes')}
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Search className="w-5 h-5" />
                  <span>{t.schemes}</span>
                </button>
                
                <button 
                  onClick={() => setCurrentPage('centers')}
                  className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  <span>{t.findCenter}</span>
                </button>
                
                <button 
                  onClick={() => setCurrentPage('chat')}
                  className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t.chatbot}</span>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  {t.eligibility}
                </h3>
                <p className="text-gray-600 mb-4">Check your eligibility for multiple schemes at once</p>
                <button 
                  onClick={() => setCurrentPage('eligibility')}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  Check now <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="w-5 h-5 text-red-600 mr-2" />
                  {t.centers}
                </h3>
                <p className="text-gray-600 mb-4">Find nearby centers for offline assistance</p>
                <button 
                  onClick={() => setCurrentPage('centers')}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  Find centers <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSchemesPage = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t.allSchemes}</h1>
          <button
            onClick={() => setCurrentPage('home')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            {t.home}
          </button>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            {t.filterBy}
          </h3>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    selectedCategory === category.id 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map(scheme => {
            const Icon = scheme.icon;
            return (
              <div key={scheme.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`h-2 bg-${scheme.color}-500`}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-${scheme.color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${scheme.color}-600`} />
                    </div>
                    <div className="flex space-x-1">
                      {scheme.sdg.map(sdg => (
                        <span key={sdg} className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-semibold">
                          {sdg}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {language === 'hi' ? scheme.nameHi : scheme.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {language === 'hi' ? scheme.descriptionHi : scheme.description}
                  </p>
                  <p className="text-lg font-semibold text-green-600 mb-4">{scheme.benefit}</p>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSelectedScheme(scheme);
                        setCurrentPage('schemeDetail');
                      }}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {t.viewDetails}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedScheme(scheme);
                        setCurrentPage('eligibility');
                      }}
                      className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      {t.checkEligibility}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSchemeDetail = () => {
    if (!selectedScheme) return null;
    const Icon = selectedScheme.icon;
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => setCurrentPage('schemes')}
            className="mb-6 text-blue-600 hover:text-blue-700 flex items-center"
          >
            <ArrowRight className="w-4 h-4 mr-1 transform rotate-180" />
            Back to schemes
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className={`h-32 bg-gradient-to-r from-${selectedScheme.color}-500 to-${selectedScheme.color}-600 flex items-center justify-center`}>
              <Icon className="w-16 h-16 text-white" />
            </div>
            
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {language === 'hi' ? selectedScheme.nameHi : selectedScheme.name}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {language === 'hi' ? selectedScheme.descriptionHi : selectedScheme.description}
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Benefits</h3>
                  <p className="text-2xl font-bold text-green-600 mb-6">{selectedScheme.benefit}</p>
                  
                  <h3 className="text-lg font-semibold mb-4">Eligibility Criteria</h3>
                  <ul className="space-y-2">
                    {selectedScheme.eligibility.map((criteria, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">How to Apply</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Online Application</h4>
                      <p className="text-blue-800 text-sm mb-3">Apply directly through the official portal</p>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        {t.applyOnline}
                      </button>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Offline Application</h4>
                      <p className="text-green-800 text-sm mb-3">Visit nearby centers for assistance</p>
                      <button 
                        onClick={() => setCurrentPage('centers')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        {t.findNearbyCenter}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEligibilityPage = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => setCurrentPage('home')}
          className="mb-6 text-blue-600 hover:text-blue-700 flex items-center"
        >
          <ArrowRight className="w-4 h-4 mr-1 transform rotate-180" />
          {t.home}
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.eligibilityChecker}</h1>
          
          <form className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.personalInfo}</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your age"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income (₹)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter annual income"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select occupation</option>
                <option value="farmer">Farmer</option>
                <option value="student">Student</option>
                <option value="unemployed">Unemployed</option>
                <option value="self-employed">Self Employed</option>
                <option value="employed">Employed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select state</option>
                <option value="delhi">Delhi</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="karnataka">Karnataka</option>
                <option value="uttar-pradesh">Uttar Pradesh</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input type="checkbox" id="terms" className="mr-2" />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to share my information for eligibility checking
              </label>
            </div>
            
            <button
              type="button"
              onClick={() => {
                // Show results
                alert('Based on your information, you are eligible for:\n\n1. PM-KISAN (if farmer)\n2. Ayushman Bharat\n3. MGNREGA\n\nClick on schemes to learn more!');
                setCurrentPage('schemes');
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              {t.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderChatPage = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => setCurrentPage('home')}
          className="mb-6 text-blue-600 hover:text-blue-700 flex items-center"
        >
          <ArrowRight className="w-4 h-4 mr-1 transform rotate-180" />
          {t.home}
        </button>

        <div className="bg-white rounded-lg shadow-lg h-96 flex flex-col">
          <div className="p-4 border-b bg-blue-600 text-white rounded-t-lg">
            <h2 className="text-xl font-semibold flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              {t.chatWithUs}
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Ask me about government schemes and I'll help you find the right one!</p>
              </div>
            )}
            
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          <form onSubmit={handleChatSubmit} className="p-4 border-t">
            <div className="flex space-x-2 items-center">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about government schemes..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isListening || isTranslating}
              />
              <button
                type="button"
                onClick={startListening}
                className={`bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center ${isListening ? 'animate-pulse' : ''}`}
                title="Speak your query"
                disabled={isListening || isTranslating}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v2m0 0a4 4 0 01-4-4h8a4 4 0 01-4 4zm0-2V6a4 4 0 018 0v6a4 4 0 01-8 0z" /></svg>
                {isListening && <span className="ml-2 text-blue-600 font-semibold">Listening...</span>}
                {isTranslating && <span className="ml-2 text-green-600 font-semibold">Translating...</span>}
              </button>
              <button
                id="chat-send-btn"
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isListening || isTranslating}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderCentersPage = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t.offlineCenters}</h1>
          <button
            onClick={() => setCurrentPage('home')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            {t.home}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Find Centers Near You</h3>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {t.mapView}
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                {t.listView}
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Enter your location..."
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Center Types</option>
              <option value="csc">Common Service Centers</option>
              <option value="post">Post Offices</option>
              <option value="bank">Banks</option>
            </select>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center">
              <Search className="w-4 h-4 mr-2" />
              Search
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCenters.map(center => (
            <div key={center.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{center.name}</h3>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {center.type}
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{center.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">{center.distance}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 text-sm mb-2 flex items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  {center.address}
                </p>
                <p className="text-gray-600 text-sm flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-2" />
                  {center.phone}
                </p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Services:</h4>
                <div className="flex flex-wrap gap-1">
                  {center.services.map((service, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center">
                  <Navigation className="w-4 h-4 mr-1" />
                  {t.getDirections}
                </button>
                <button className="flex-1 border border-green-600 text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors text-sm flex items-center justify-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Navigation Bar Component
  const NavigationBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden">
      <div className="flex justify-around py-2">
        {[
          { id: 'home', icon: Home, label: t.home },
          { id: 'schemes', icon: FileText, label: t.schemes },
          { id: 'eligibility', icon: CheckCircle, label: t.eligibility },
          { id: 'centers', icon: MapPin, label: t.centers },
          { id: 'chat', icon: MessageCircle, label: t.chatbot }
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center py-2 px-3 ${
                currentPage === item.id ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      {currentPage === 'home' && renderHomePage()}
      {currentPage === 'schemes' && renderSchemesPage()}
      {currentPage === 'schemeDetail' && renderSchemeDetail()}
      {currentPage === 'eligibility' && renderEligibilityPage()}
      {currentPage === 'chat' && renderChatPage()}
      {currentPage === 'centers' && renderCentersPage()}
      <NavigationBar />
    </div>
  );
};

export default GovernmentSchemesApp;