import { defaultLocale, Locale } from "./config";

function defineDictionary<T>(dictionary: T) {
  return dictionary;
}

const en = defineDictionary({
  metadata: {
    title: "Playzen — YouTube Playlist Manager",
    description:
      "Save, organize, and track your YouTube playlist watch progress with Playzen.",
  },
  common: {
    brand: "Playzen",
    cancel: "Cancel",
    loading: "Loading...",
    user: "User",
    learner: "Learner",
    recentlyJoined: "Recently joined",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "••••••••",
    otpPlaceholder: "123456",
    example: "Example",
    videos: "videos",
    done: "Done",
  },
  nav: {
    features: "Features",
    howItWorks: "How It Works",
    interactiveSimulator: "Interactive Simulator",
    dashboard: "Dashboard",
    profile: "Profile",
    login: "Login",
    signUp: "Sign Up",
    goToDashboard: "Go to Dashboard",
    language: "Language",
    english: "EN",
    arabic: "العربية",
  },
  home: {
    heroBadge: "Focus-Driven Learning Workspace",
    heroTitle: "Elevate Your Study.",
    heroTitleAccent: "Master Your Playlists.",
    heroDescription:
      "Connect any YouTube playlist, strip away distractions, check off your chapters, and track your watch progress in a premium dashboard.",
    goToWorkspace: "Go to Workspace",
    exploreFeatures: "Explore Features",
    startLearningFree: "Start Learning Free",
    signIn: "Sign In",
    discoverMore: "Discover More",
    why: "Why Playzen?",
    featuresTitle: "Distraction-Free Environment Built for Online Study",
    featureCards: [
      {
        title: "Quiet Workspace",
        description:
          "No video suggestions, comments, or banner advertisements. Zero distractions between you and your syllabus.",
      },
      {
        title: "Smart Playback",
        description:
          "Smooth auto-advancing players that queue up the next chapter in your course instantly once the previous one is finished.",
      },
      {
        title: "Step Progress",
        description:
          "Track completed segments, in-progress lectures, and overall syllabus percentages directly on your personal dashboard.",
      },
      {
        title: "Visual Statistics",
        description:
          "Stay motivated with clear metric graphs outlining total videos, completed tasks, and average course progress.",
      },
    ],
    workflowOne: {
      eyebrow: "Workflow Phase 1",
      title: "Seamless Playlist Syncing",
      description:
        "Playzen makes it incredibly simple to organize your resources. By copying and pasting a standard YouTube playlist URL into the workspace, our application immediately connects and pulls in the material.",
      steps: [
        {
          title: "Paste Public URL",
          description:
            "Grab the share link of any instructional playlist from YouTube.",
        },
        {
          title: "Instant Parsing",
          description:
            "We compile video count, runtimes, channel credits, and thumbnails in seconds.",
        },
        {
          title: "Course Generated",
          description:
            "The playlist appears as a beautiful modular course card in your dashboard lobby.",
        },
      ],
      dashboardAlt: "Playzen Dashboard Workspace",
    },
    workflowTwo: {
      eyebrow: "Workflow Phase 2",
      title: "The Focused Study Room",
      description:
        "Step inside your customized playback theater. Here, we present the video and playlist sidebar side-by-side. Our integrated tracker communicates directly with the embed to save progress in real-time.",
      bullets: [
        "Time-stamp Auto-Recall",
        "Smart Autoplay Next Lesson",
        "Description & Notebook Side Panels",
        "Clean Widescreen Layout",
      ],
      playlistAlt: "Playzen Playlist Playback",
    },
    demo: {
      eyebrow: "Playground Demo",
      title: "Experience Playzen in Action",
      description:
        "Interact with the mock simulator below to preview playlist syncing and automated watch state updates.",
    },
    quote:
      "Online courses on YouTube are gold mines, but the platform is built to distract. Playzen turns noise into a structured, silent university study hall. It has completely transformed my learning efficiency.",
    quoteBy: "Playzen User Community",
    quoteSpace: "YouTube Self-Education Space",
    finalTitle: "Ready to Structure Your Learning?",
    finalDescription:
      "Join thousands of students and developers who use Playzen to organize tutorials, course bundles, and learning logs.",
    enterDashboard: "Enter Dashboard Workspace",
    createFreeAccount: "Create Free Account",
    footerDescription:
      "Structured workspace for YouTube courses and tracking progress.",
    footerSignIn: "Sign In",
    footerRegister: "Register",
    footerGithub: "Github",
    copyrightSuffix:
      "Playzen. All rights reserved. Created in partnership with Advanced Agentic Coding.",
  },
  miniDemo: {
    videos: [
      {
        title: "01. Minimalism in Visual Interface Design",
        duration: "12:45",
        channel: "DesignCourse",
      },
      {
        title: "02. Advanced Typography and Hierarchy Rules",
        duration: "18:20",
        channel: "DesignCourse",
      },
      {
        title: "03. Mastering Layout Grids & Whitespace",
        duration: "14:10",
        channel: "DesignCourse",
      },
      {
        title: "04. Micro-interactions and Animation Polish",
        duration: "11:05",
        channel: "DesignCourse",
      },
    ],
    headerLabel: "Interactive Simulator",
    resetDemo: "Reset Demo",
    connectTitle: "Connect Your Playlists",
    connectDescription:
      "Paste any public YouTube playlist URL. Playzen compiles it into a focused list, free from distractions.",
    playlistPlaceholder: "https://www.youtube.com/playlist?list=...",
    syncPlaylist: "Sync Playlist",
    syncingTitle: "Syncing Workspace...",
    syncingDescription: "Parsing Youtube metadata & setting up tracking...",
    simulatingWatch: "Simulating Watch",
    rewatchVideo: "Rewatch Video",
    clickPlayToTest: "Click Play to Test",
    workspaceMode: "Workspace mode",
    overallProgress: "Overall Progress",
    completed: "Completed",
    insightTitle: "Interactive Insight",
    insightDescription:
      "Watch how Playzen auto-saves watch progress in the background. If you stop playing midway, it remembers the exact timestamp.",
  },
  auth: {
    iconAlt: "Playzen Icon",
    login: {
      title: "Welcome back to Playzen",
      subtitle: "Sign in to continue tracking your learning progress",
      noAccount: "Don't have an account?",
      signUpLink: "Sign up",
    },
    loginForm: {
      emailAddress: "Email Address",
      password: "Password",
      forgotPassword: "Forgot Password?",
      signIn: "Sign In",
      signingIn: "Signing in...",
      or: "Or",
      guestLogin: "Guest Login",
      guestLoggingIn: "Logging in as guest...",
      fallbackError: "Login failed",
      guestFallbackError: "Guest login failed",
    },
    register: {
      createTitle: "Create your account",
      verifyTitle: "Verify your email",
      createSubtitle: "Start managing your learning playlists today",
      verifySubtitle: "Enter the verification code below",
      alreadyAccount: "Already have an account?",
      loginLink: "Log in",
    },
    registerForm: {
      fullName: "Full Name",
      emailAddress: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      fullNamePlaceholder: "John Doe",
      creatingAccount: "Creating Account...",
      signUp: "Sign Up",
      fallbackError: "Registration failed",
    },
    otp: {
      title: "Verify your email",
      sentCodeTo: "We sent a verification code to",
      enterSixDigit: "Please enter the 6-digit OTP",
      resent: "OTP resent successfully!",
      resendFallbackError: "Failed to resend OTP",
      verifyFallbackError: "Verification failed",
      verifying: "Verifying...",
      verifyCode: "Verify Code",
      resendOtp: "Resend OTP",
    },
    forgot: {
      title: "Forgot Password",
      subtitle:
        "Enter your email to receive a password reset verification code",
      emailAddress: "Email Address",
      success: "OTP code sent to your email address!",
      fallbackError: "Failed to send reset code",
      sending: "Sending Code...",
      sendCode: "Send Reset Code",
      remember: "Remember your password?",
      loginLink: "Log in",
    },
    reset: {
      title: "Reset Password",
      subtitle:
        "Enter the verification code sent to your email to set a new password",
      emailAddress: "Email Address",
      otpCode: "Verification OTP Code",
      newPassword: "New Password",
      confirmNewPassword: "Confirm New Password",
      passwordsDoNotMatch: "Passwords do not match",
      passwordTooShort: "Password must be at least 6 characters",
      success: "Password reset successfully!",
      fallbackError: "Failed to reset password",
      resetting: "Resetting Password...",
      resetPassword: "Reset Password",
      backTo: "Back to",
      loginLink: "Log in",
    },
  },
  email: {
    verifySubject: "Verify your Playzen Account",
    verifyIntro:
      "This email is safe for account registration. Your Playzen OTP code is:",
    verifyText:
      "This email is safe for account registration. Your Playzen verification code is: {otp}. It is valid for 10 minutes.",
    resendIntro:
      "This email is safe for account registration verification. Your Playzen OTP code is:",
    resendText:
      "This email is safe for account registration verification. Your Playzen verification code is: {otp}. It is valid for 10 minutes.",
    resetSubject: "Playzen Password Reset OTP",
    resetIntro:
      "This email is safe for resetting the password. Your Playzen password reset OTP code is:",
    resetText:
      "This email is safe for resetting the password. Your Playzen password reset verification code is: {otp}. It is valid for 10 minutes.",
    validFor: "This code is valid for 10 minutes.",
  },
  dashboard: {
    title: "Workspace",
    badge: "Dashboard",
    description:
      "Track and manage your online learning paths and video playlists.",
    addPlaylist: "Add Playlist",
    stats: {
      playlists: "Playlists",
      totalVideos: "Total Videos",
      completed: "Completed",
      progressAvg: "Progress Avg",
    },
    allChannels: "All Channels",
    emptyTitle: "No playlists added yet",
    emptyDescription:
      "Connect and save your first YouTube playlist URL to begin tracking your watch progress and learning steps.",
    addFirst: "Add Your First Playlist",
    noMatches:
      "No playlists match your search query or selected channel filters.",
  },
  addPlaylist: {
    title: "Add New Playlist",
    description:
      "Connect a public YouTube playlist to watch and save your progress.",
    instructionsTitle: "How to get a playlist URL",
    step1: "1. Go to YouTube and open the playlist you want to add.",
    step2:
      "2. Copy the URL from your browser's address bar.",
    label: "YouTube Playlist Link",
    placeholder: "https://www.youtube.com/playlist?list=...",
    adding: "Adding...",
    add: "Add Playlist",
    fallbackError: "Failed to add playlist",
    singleVideoError: "Single video links are not allowed. Please provide a playlist URL instead.",
    singleVideoNotice: "Note: This video will be imported as a single-video course.",
  },
  playlistCard: {
    confirmDelete: "Are you sure you want to delete this playlist?",
    watchProgress: "Watch Progress",
    added: "Added",
    delete: "Delete",
  },
  profile: {
    backToDashboard: "Back to Dashboard",
    emailAddress: "Email Address",
    joinedDate: "Joined Date",
    loading: "Loading...",
    signOut: "Sign Out",
    confirmTitle: "Confirm Sign Out",
    confirmDescription:
      "Are you sure you want to sign out? You will need to log in again to access your saved playlists and tracking progress.",
    signingOut: "Signing Out...",
    logoutError: "Logout failed:",
  },
  playlistPage: {
    loading: "Loading playlist workspace...",
    failedToLoad: "Failed to load playlist",
    selectVideo: "Select a video to play",
    prev: "Prev",
    next: "Next",
    completed: "Completed",
    markComplete: "Mark Complete",
    markCompleteError: "Could not mark this video complete. Try again.",
    autoplayNext: "Autoplay Next",
    videoDescription: "Video Description",
    playlistInformation: "Playlist Information",
    noVideoDescription: "No description available for this video.",
    noPlaylistDescription: "No description available for this playlist.",
  },
  playlistSidebar: {
    overallProgress: "Overall Progress",
    searchPlaceholder: "Search videos in playlist...",
    noMatches: "No videos match your search.",
  },
  validation: {
    emailRequired: "Email is required",
    invalidEmail: "Invalid email format",
    passwordRequired: "Password is required",
    nameRequired: "Name is required",
    nameTooShort: "Name must be at least 2 characters",
    passwordTooShortEight: "Password must be at least 8 characters",
    passwordUppercase: "Password must contain at least one uppercase letter",
    passwordLowercase: "Password must contain at least one lowercase letter",
    passwordDigit: "Password must contain at least one digit",
    confirmPasswordRequired: "Please confirm your password",
    passwordsDoNotMatch: "Passwords do not match",
  },
  api: {
    guestUserNotFound: "Guest user not found",
    guestUserUnverified: "Guest user email is not verified.",
    guestLoginSuccess: "Logged in as guest successfully.",
    userNotFound: "User not found",
    verifyEmailBeforeLogin: "Please verify your email before logging in.",
    invalidEmailOrPassword: "Invalid email or password",
    loginSuccess: "Logged in successfully.",
    unexpectedTryAgain: "An unexpected error occurred. Please try again.",
    loggedOut: "Logged out.",
    notAuthenticated: "Not authenticated",
    unexpected: "An unexpected error occurred.",
    emailAlreadyRegistered: "Email already registered",
    otpSent: "OTP sent to your email address. Please check your inbox.",
    emailRequired: "Email is required",
    accountNotFound: "No account found with this email address.",
    passwordResetOtpSent: "Password reset OTP sent to your email address.",
    emailAlreadyVerified: "Email already verified",
    verificationCodeResent: "Verification code resent successfully.",
    allFieldsRequired: "All fields are required",
    passwordsDoNotMatch: "Passwords do not match",
    passwordTooShortSix: "Password must be at least 6 characters",
    invalidOrExpiredOtp: "Invalid or expired OTP",
    passwordResetSuccess: "Password reset successfully. You can now log in.",
    emailAndOtpRequired: "Email and OTP required",
    emailVerified: "Email verified successfully.",
    playlistUrlRequired: "playlistUrl is required.",
    invalidUrl: "Invalid URL format",
    missingListParam: "No list parameter found in URL",
    invalidPlaylistId: "Invalid playlist ID format detected in URL.",
    playlistAlreadyAdded: "Playlist already added.",
    playlistNotFoundPrivate: "Playlist not found or is private.",
    youtubeApiMissingKey: "YouTube API Error: Server missing YOUTUBE_API_KEY",
    youtubeApiFetchItems:
      "YouTube API Error: Error fetching playlist items from YouTube API.",
    youtubeApiPrefix: "YouTube API Error: ",
    invalidPlaylistIdFormat: "Invalid playlist ID format",
    playlistNotFound: "Playlist not found",
    playlistBelongsToAnotherUser: "Playlist belongs to another user",
    playlistDeleted: "Playlist deleted.",
    progressRequired:
      "playlistId, youtubeVideoId, watchedSeconds, and durationSeconds are required.",
    progressNumbersRequired:
      "watchedSeconds and durationSeconds must be valid numbers",
    durationPositive: "durationSeconds must be > 0",
    invalidPlaylistIdQuery: "Invalid playlistId format",
    progressSaved: "Progress saved.",
    validPlaylistIdQueryRequired: "Valid playlistId query string is required.",
    unknownError: "Unknown error",
  },
});

export type Dictionary = typeof en;

const ar: Dictionary = {
  metadata: {
    title: "Playzen — مدير قوائم تشغيل يوتيوب",
    description:
      "احفظ قوائم تشغيل يوتيوب ونظمها وتابع تقدم المشاهدة داخل Playzen.",
  },
  common: {
    brand: "Playzen",
    cancel: "إلغاء",
    loading: "جار التحميل...",
    user: "المستخدم",
    learner: "متعلم",
    recentlyJoined: "انضم حديثًا",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "••••••••",
    otpPlaceholder: "123456",
    example: "مثال",
    videos: "فيديو",
    done: "تم",
  },
  nav: {
    features: "المزايا",
    howItWorks: "طريقة العمل",
    interactiveSimulator: "المحاكي التفاعلي",
    dashboard: "لوحة التحكم",
    profile: "الملف الشخصي",
    login: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    goToDashboard: "الذهاب إلى لوحة التحكم",
    language: "اللغة",
    english: "EN",
    arabic: "العربية",
  },
  home: {
    heroBadge: "مساحة تعلم مصممة للتركيز",
    heroTitle: "ارتق بدراستك.",
    heroTitleAccent: "أتقن قوائمك التعليمية.",
    heroDescription:
      "اربط أي قائمة تشغيل من يوتيوب، أبعد المشتتات، علّم الفصول المنجزة، وتابع تقدم المشاهدة داخل لوحة أنيقة.",
    goToWorkspace: "اذهب إلى مساحة العمل",
    exploreFeatures: "استكشف المزايا",
    startLearningFree: "ابدأ التعلم مجانًا",
    signIn: "تسجيل الدخول",
    discoverMore: "اكتشف المزيد",
    why: "لماذا Playzen؟",
    featuresTitle: "بيئة خالية من المشتتات مصممة للتعلم عبر الإنترنت",
    featureCards: [
      {
        title: "مساحة هادئة",
        description:
          "لا اقتراحات فيديو ولا تعليقات ولا إعلانات. فقط أنت والمنهج من دون تشتيت.",
      },
      {
        title: "تشغيل ذكي",
        description:
          "مشغل سلس ينتقل تلقائيًا إلى الفصل التالي في الدورة فور انتهاء الفصل السابق.",
      },
      {
        title: "تقدم خطوة بخطوة",
        description:
          "تابع المقاطع المكتملة والمحاضرات الجارية ونسبة إنجاز المنهج مباشرة من لوحتك الشخصية.",
      },
      {
        title: "إحصاءات مرئية",
        description:
          "حافظ على حماسك من خلال مؤشرات واضحة لعدد الفيديوهات والمهام المكتملة ومتوسط تقدم الدورات.",
      },
    ],
    workflowOne: {
      eyebrow: "المرحلة الأولى",
      title: "مزامنة سلسة لقوائم التشغيل",
      description:
        "يجعل Playzen تنظيم مصادر التعلم بسيطًا جدًا. انسخ رابط قائمة تشغيل يوتيوب والصقه في مساحة العمل، وسيتصل التطبيق فورًا لجلب المحتوى.",
      steps: [
        {
          title: "الصق الرابط العام",
          description: "انسخ رابط المشاركة لأي قائمة تعليمية من يوتيوب.",
        },
        {
          title: "تحليل فوري",
          description:
            "نجمع عدد الفيديوهات والمدد وبيانات القناة والصور المصغرة خلال ثوان.",
        },
        {
          title: "إنشاء الدورة",
          description:
            "تظهر القائمة كبطاقة دورة جميلة ومنظمة داخل لوحة التحكم.",
        },
      ],
      dashboardAlt: "مساحة لوحة تحكم Playzen",
    },
    workflowTwo: {
      eyebrow: "المرحلة الثانية",
      title: "غرفة دراسة مركزة",
      description:
        "ادخل إلى مساحة تشغيل مخصصة. نعرض الفيديو وقائمة التشغيل جنبًا إلى جنب، ويتواصل متتبع التقدم مع المشغل لحفظ التقدم لحظيًا.",
      bullets: [
        "استرجاع تلقائي للوقت",
        "تشغيل الدرس التالي بذكاء",
        "لوحات للوصف والملاحظات",
        "تخطيط عريض ونظيف",
      ],
      playlistAlt: "تشغيل قائمة Playzen",
    },
    demo: {
      eyebrow: "عرض تجريبي",
      title: "جرّب Playzen أثناء العمل",
      description:
        "تفاعل مع المحاكي أدناه لمعاينة مزامنة القوائم وتحديث حالة المشاهدة تلقائيًا.",
    },
    quote:
      "الدورات التعليمية على يوتيوب كنوز حقيقية، لكن المنصة مليئة بالمشتتات. يحوّل Playzen هذا الضجيج إلى قاعة دراسة منظمة وهادئة، وقد غيّر كفاءة تعلمي بالكامل.",
    quoteBy: "مجتمع مستخدمي Playzen",
    quoteSpace: "مساحة التعلم الذاتي عبر يوتيوب",
    finalTitle: "هل أنت جاهز لتنظيم تعلمك؟",
    finalDescription:
      "انضم إلى طلاب ومطورين يستخدمون Playzen لتنظيم الشروحات والدورات وسجلات التعلم.",
    enterDashboard: "ادخل إلى لوحة التحكم",
    createFreeAccount: "أنشئ حسابًا مجانيًا",
    footerDescription: "مساحة منظمة لدورات يوتيوب وتتبع تقدم المشاهدة.",
    footerSignIn: "تسجيل الدخول",
    footerRegister: "إنشاء حساب",
    footerGithub: "Github",
    copyrightSuffix:
      "Playzen. جميع الحقوق محفوظة. تم إنشاؤه بالشراكة مع Advanced Agentic Coding.",
  },
  miniDemo: {
    videos: [
      {
        title: "01. البساطة في تصميم الواجهات المرئية",
        duration: "12:45",
        channel: "دورة التصميم",
      },
      {
        title: "02. قواعد الطباعة المتقدمة والتسلسل البصري",
        duration: "18:20",
        channel: "دورة التصميم",
      },
      {
        title: "03. إتقان شبكات التخطيط والمساحات البيضاء",
        duration: "14:10",
        channel: "دورة التصميم",
      },
      {
        title: "04. صقل التفاعلات الدقيقة والحركة",
        duration: "11:05",
        channel: "دورة التصميم",
      },
    ],
    headerLabel: "المحاكي التفاعلي",
    resetDemo: "إعادة العرض",
    connectTitle: "اربط قوائم التشغيل",
    connectDescription:
      "الصق رابط أي قائمة تشغيل عامة من يوتيوب، وسيحولها Playzen إلى قائمة مركزة وخالية من المشتتات.",
    playlistPlaceholder: "https://www.youtube.com/playlist?list=...",
    syncPlaylist: "مزامنة القائمة",
    syncingTitle: "جار مزامنة مساحة العمل...",
    syncingDescription: "جار تحليل بيانات يوتيوب وتجهيز التتبع...",
    simulatingWatch: "محاكاة المشاهدة",
    rewatchVideo: "إعادة المشاهدة",
    clickPlayToTest: "اضغط التشغيل للتجربة",
    workspaceMode: "وضع مساحة العمل",
    overallProgress: "التقدم العام",
    completed: "المكتمل",
    insightTitle: "لمحة تفاعلية",
    insightDescription:
      "لاحظ كيف يحفظ Playzen تقدم المشاهدة في الخلفية. إذا توقفت في منتصف الفيديو، فسيتذكر الوقت المحدد.",
  },
  auth: {
    iconAlt: "أيقونة Playzen",
    login: {
      title: "مرحبًا بعودتك إلى Playzen",
      subtitle: "سجّل الدخول لمواصلة تتبع تقدم تعلمك",
      noAccount: "ليس لديك حساب؟",
      signUpLink: "أنشئ حسابًا",
    },
    loginForm: {
      emailAddress: "البريد الإلكتروني",
      password: "كلمة المرور",
      forgotPassword: "هل نسيت كلمة المرور؟",
      signIn: "تسجيل الدخول",
      signingIn: "جار تسجيل الدخول...",
      or: "أو",
      guestLogin: "دخول كضيف",
      guestLoggingIn: "جار الدخول كضيف...",
      fallbackError: "فشل تسجيل الدخول",
      guestFallbackError: "فشل الدخول كضيف",
    },
    register: {
      createTitle: "أنشئ حسابك",
      verifyTitle: "تحقق من بريدك الإلكتروني",
      createSubtitle: "ابدأ إدارة قوائم تعلمك اليوم",
      verifySubtitle: "أدخل رمز التحقق أدناه",
      alreadyAccount: "لديك حساب بالفعل؟",
      loginLink: "تسجيل الدخول",
    },
    registerForm: {
      fullName: "الاسم الكامل",
      emailAddress: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      fullNamePlaceholder: "محمد أحمد",
      creatingAccount: "جار إنشاء الحساب...",
      signUp: "إنشاء حساب",
      fallbackError: "فشل إنشاء الحساب",
    },
    otp: {
      title: "تحقق من بريدك الإلكتروني",
      sentCodeTo: "أرسلنا رمز التحقق إلى",
      enterSixDigit: "يرجى إدخال رمز التحقق المكوّن من 6 أرقام",
      resent: "تمت إعادة إرسال الرمز بنجاح!",
      resendFallbackError: "فشل إرسال الرمز مرة أخرى",
      verifyFallbackError: "فشل التحقق",
      verifying: "جار التحقق...",
      verifyCode: "تحقق من الرمز",
      resendOtp: "إعادة إرسال الرمز",
    },
    forgot: {
      title: "نسيت كلمة المرور",
      subtitle:
        "أدخل بريدك الإلكتروني لاستلام رمز التحقق الخاص بإعادة تعيين كلمة المرور",
      emailAddress: "البريد الإلكتروني",
      success: "تم إرسال رمز التحقق إلى بريدك الإلكتروني!",
      fallbackError: "فشل إرسال رمز إعادة التعيين",
      sending: "جار إرسال الرمز...",
      sendCode: "إرسال رمز التعيين",
      remember: "تذكرت كلمة المرور؟",
      loginLink: "تسجيل الدخول",
    },
    reset: {
      title: "إعادة تعيين كلمة المرور",
      subtitle:
        "أدخل رمز التحقق المرسل إلى بريدك الإلكتروني لتعيين كلمة مرور جديدة",
      emailAddress: "البريد الإلكتروني",
      otpCode: "رمز التحقق",
      newPassword: "كلمة المرور الجديدة",
      confirmNewPassword: "تأكيد كلمة المرور الجديدة",
      passwordsDoNotMatch: "كلمتا المرور غير متطابقتين",
      passwordTooShort: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
      success: "تمت إعادة تعيين كلمة المرور بنجاح!",
      fallbackError: "فشل إعادة تعيين كلمة المرور",
      resetting: "جار إعادة التعيين...",
      resetPassword: "إعادة تعيين كلمة المرور",
      backTo: "العودة إلى",
      loginLink: "تسجيل الدخول",
    },
  },
  email: {
    verifySubject: "تحقق من حسابك في Playzen",
    verifyIntro:
      "هذا البريد آمن لتسجيل الحساب. رمز التحقق الخاص بك في Playzen هو:",
    verifyText:
      "هذا البريد آمن لتسجيل الحساب. رمز التحقق الخاص بك في Playzen هو: {otp}. الرمز صالح لمدة 10 دقائق.",
    resendIntro:
      "هذا البريد آمن للتحقق من تسجيل الحساب. رمز التحقق الخاص بك في Playzen هو:",
    resendText:
      "هذا البريد آمن للتحقق من تسجيل الحساب. رمز التحقق الخاص بك في Playzen هو: {otp}. الرمز صالح لمدة 10 دقائق.",
    resetSubject: "رمز إعادة تعيين كلمة مرور Playzen",
    resetIntro:
      "هذا البريد آمن لإعادة تعيين كلمة المرور. رمز إعادة تعيين كلمة المرور في Playzen هو:",
    resetText:
      "هذا البريد آمن لإعادة تعيين كلمة المرور. رمز التحقق لإعادة تعيين كلمة مرور Playzen هو: {otp}. الرمز صالح لمدة 10 دقائق.",
    validFor: "هذا الرمز صالح لمدة 10 دقائق.",
  },
  dashboard: {
    title: "مساحة العمل",
    badge: "لوحة التحكم",
    description: "تابع مسارات التعلم وقوائم الفيديو التعليمية وأدرها بسهولة.",
    addPlaylist: "إضافة قائمة",
    stats: {
      playlists: "القوائم",
      totalVideos: "إجمالي الفيديوهات",
      completed: "المكتمل",
      progressAvg: "متوسط التقدم",
    },
    allChannels: "كل القنوات",
    emptyTitle: "لم تتم إضافة أي قائمة بعد",
    emptyDescription:
      "اربط واحفظ أول رابط لقائمة تشغيل يوتيوب لتبدأ تتبع تقدم المشاهدة وخطوات التعلم.",
    addFirst: "أضف أول قائمة",
    noMatches: "لا توجد قوائم تطابق البحث أو فلتر القناة المحدد.",
  },
  addPlaylist: {
    title: "إضافة قائمة جديدة",
    description: "اربط قائمة تشغيل يوتيوب عامة للمشاهدة وحفظ تقدمك.",
    instructionsTitle: "كيفية الحصول على رابط القائمة",
    step1: "١. اذهب إلى يوتيوب وافتح القائمة التي تريد إضافتها.",
    step2: "٢. انسخ الرابط من شريط عنوان المتصفح أو زر المشاركة.",
    label: "رابط قائمة يوتيوب",
    placeholder: "https://www.youtube.com/playlist?list=...",
    adding: "جار الإضافة...",
    add: "إضافة القائمة",
    fallbackError: "فشل إضافة القائمة",
    singleVideoError: "روابط الفيديوهات الفردية غير مسموح بها. يرجى توفير رابط قائمة تشغيل يوتيوب بدلاً من ذلك.",
    singleVideoNotice: "ملاحظة: سيتم إضافة هذا الفيديو كقائمة تشغيل من فيديو واحد.",
  },
  playlistCard: {
    confirmDelete: "هل أنت متأكد من حذف هذه القائمة؟",
    watchProgress: "تقدم المشاهدة",
    added: "أضيف في",
    delete: "حذف",
  },
  profile: {
    backToDashboard: "العودة إلى لوحة التحكم",
    emailAddress: "البريد الإلكتروني",
    joinedDate: "تاريخ الانضمام",
    loading: "جار التحميل...",
    signOut: "تسجيل الخروج",
    confirmTitle: "تأكيد تسجيل الخروج",
    confirmDescription:
      "هل أنت متأكد من تسجيل الخروج؟ ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى القوائم المحفوظة وتتبع التقدم.",
    signingOut: "جار تسجيل الخروج...",
    logoutError: "فشل تسجيل الخروج:",
  },
  playlistPage: {
    loading: "جار تحميل مساحة القائمة...",
    failedToLoad: "فشل تحميل القائمة",
    selectVideo: "اختر فيديو للتشغيل",
    prev: "السابق",
    next: "التالي",
    completed: "مكتمل",
    markComplete: "تحديد كمكتمل",
    markCompleteError: "تعذر تحديد الفيديو كمكتمل. حاول مرة أخرى.",
    autoplayNext: "تشغيل التالي تلقائيًا",
    videoDescription: "وصف الفيديو",
    playlistInformation: "معلومات القائمة",
    noVideoDescription: "لا يوجد وصف متاح لهذا الفيديو.",
    noPlaylistDescription: "لا يوجد وصف متاح لهذه القائمة.",
  },
  playlistSidebar: {
    overallProgress: "التقدم العام",
    searchPlaceholder: "ابحث في فيديوهات القائمة...",
    noMatches: "لا توجد فيديوهات تطابق بحثك.",
  },
  validation: {
    emailRequired: "البريد الإلكتروني مطلوب",
    invalidEmail: "صيغة البريد الإلكتروني غير صحيحة",
    passwordRequired: "كلمة المرور مطلوبة",
    nameRequired: "الاسم مطلوب",
    nameTooShort: "يجب أن يتكون الاسم من حرفين على الأقل",
    passwordTooShortEight: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
    passwordUppercase: "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل",
    passwordLowercase: "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل",
    passwordDigit: "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل",
    confirmPasswordRequired: "يرجى تأكيد كلمة المرور",
    passwordsDoNotMatch: "كلمتا المرور غير متطابقتين",
  },
  api: {
    guestUserNotFound: "لم يتم العثور على مستخدم الضيف",
    guestUserUnverified: "بريد مستخدم الضيف غير موثق.",
    guestLoginSuccess: "تم الدخول كضيف بنجاح.",
    userNotFound: "لم يتم العثور على المستخدم",
    verifyEmailBeforeLogin: "يرجى توثيق بريدك الإلكتروني قبل تسجيل الدخول.",
    invalidEmailOrPassword: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    loginSuccess: "تم تسجيل الدخول بنجاح.",
    unexpectedTryAgain: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
    loggedOut: "تم تسجيل الخروج.",
    notAuthenticated: "غير مسجل الدخول",
    unexpected: "حدث خطأ غير متوقع.",
    emailAlreadyRegistered: "البريد الإلكتروني مسجل بالفعل",
    otpSent:
      "تم إرسال رمز التحقق إلى بريدك الإلكتروني. يرجى مراجعة صندوق الوارد.",
    emailRequired: "البريد الإلكتروني مطلوب",
    accountNotFound: "لا يوجد حساب بهذا البريد الإلكتروني.",
    passwordResetOtpSent:
      "تم إرسال رمز إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.",
    emailAlreadyVerified: "البريد الإلكتروني موثق بالفعل",
    verificationCodeResent: "تمت إعادة إرسال رمز التحقق بنجاح.",
    allFieldsRequired: "جميع الحقول مطلوبة",
    passwordsDoNotMatch: "كلمتا المرور غير متطابقتين",
    passwordTooShortSix: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
    invalidOrExpiredOtp: "رمز التحقق غير صحيح أو منتهي الصلاحية",
    passwordResetSuccess:
      "تمت إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.",
    emailAndOtpRequired: "البريد الإلكتروني ورمز التحقق مطلوبان",
    emailVerified: "تم توثيق البريد الإلكتروني بنجاح.",
    playlistUrlRequired: "رابط القائمة مطلوب.",
    invalidUrl: "صيغة الرابط غير صحيحة",
    missingListParam: "لم يتم العثور على معرف القائمة في الرابط",
    invalidPlaylistId: "تم اكتشاف صيغة غير صحيحة لمعرف القائمة في الرابط.",
    playlistAlreadyAdded: "تمت إضافة هذه القائمة بالفعل.",
    playlistNotFoundPrivate: "لم يتم العثور على القائمة أو أنها خاصة.",
    youtubeApiMissingKey: "خطأ في إعدادات خادم يوتيوب.",
    youtubeApiFetchItems: "تعذر جلب عناصر القائمة من واجهة يوتيوب.",
    youtubeApiPrefix: "خطأ من واجهة يوتيوب: ",
    invalidPlaylistIdFormat: "صيغة معرف القائمة غير صحيحة",
    playlistNotFound: "لم يتم العثور على القائمة",
    playlistBelongsToAnotherUser: "هذه القائمة تخص مستخدمًا آخر",
    playlistDeleted: "تم حذف القائمة.",
    progressRequired:
      "معرف القائمة ومعرف فيديو يوتيوب ووقت المشاهدة والمدة مطلوبة.",
    progressNumbersRequired: "وقت المشاهدة والمدة يجب أن يكونا أرقامًا صحيحة",
    durationPositive: "يجب أن تكون مدة الفيديو أكبر من صفر",
    invalidPlaylistIdQuery: "صيغة معرف القائمة غير صحيحة",
    progressSaved: "تم حفظ التقدم.",
    validPlaylistIdQueryRequired:
      "يجب توفير معرف قائمة صحيح في رابط الاستعلام.",
    unknownError: "خطأ غير معروف",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, ar };

export function getDictionary(locale: Locale = defaultLocale) {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export function localizeServerMessage(message: string, locale: Locale) {
  const target = getDictionary(locale);
  const english = dictionaries.en;

  const entries = [
    ...Object.entries(english.api),
    ...Object.entries(english.validation),
  ];
  const match = entries.find(([, value]) => value === message);
  if (match) {
    const [key] = match;
    return (
      target.api[key as keyof typeof target.api] ??
      target.validation[key as keyof typeof target.validation] ??
      message
    );
  }

  if (message.startsWith(english.api.youtubeApiPrefix)) {
    return `${target.api.youtubeApiPrefix}${message.slice(
      english.api.youtubeApiPrefix.length,
    )}`;
  }

  return message;
}
