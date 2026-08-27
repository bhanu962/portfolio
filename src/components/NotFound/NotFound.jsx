import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, RefreshCw, Copy, Check, Terminal, WifiOff, FileQuestion, AlertTriangle, ArrowLeft } from 'lucide-react';
import TextScramble from '../UI/TextScramble';
import Magnetic from '../UI/Magnetic';
import SvgButton from '../UI/SvgButton';
import CustomCursor from '../CustomCursor/CustomCursor';
import AnimatedBackground from '../Background/AnimatedBackground';

export default function NotFound({ onNavigateHome, customError, errorType = '404' }) {
  const [countdown, setCountdown] = useState(5);
  const [copied, setCopied] = useState(false);
  const [isOnline, setIsOnline] = useState(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/unknown';

  // Detect internet connection status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Determine error classification
  const isNetworkError = !isOnline || errorType === 'network';
  const isServerError = errorType === '500' || !!customError;
  const activeErrorType = isNetworkError ? 'NETWORK_OFFLINE' : isServerError ? 'RUNTIME_EXCEPTION' : '404_FILE_NOT_FOUND';

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRedirect = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  const handleCopyDiagnostic = () => {
    const diagnosticLog = JSON.stringify(
      {
        errorType: activeErrorType,
        path: currentPath,
        timestamp: new Date().toISOString(),
        onlineStatus: isOnline ? 'CONNECTED' : 'DISCONNECTED',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        details: customError ? customError.toString() : 'Requested resource was not resolved on host server.',
      },
      null,
      2
    );

    navigator.clipboard.writeText(diagnosticLog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-[#B94B3E] selection:text-white flex flex-col items-center justify-center px-6 py-12 overflow-hidden font-sans">
      {/* Precision Custom Cursor */}
      <CustomCursor />

      {/* Multi-Layer Animated Grid & Background Glow */}
      <AnimatedBackground />

      {/* Main Diagnostic Terminal Card */}
      <div className="relative z-10 max-w-2xl w-full mx-auto flex flex-col items-center text-center">
        {/* 1. Top Cyber Telemetry Status Badge */}
        <motion.div
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm mb-6 select-none"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B94B3E] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B94B3E]" />
          </span>
          <span className="text-xs font-mono font-bold tracking-widest text-[#B94B3E] uppercase">
            <TextScramble text="SYSTEM NOTICE • DIAGNOSTIC ACTIVE" triggerOnHover={true} />
          </span>
        </motion.div>

        {/* 2. Central Radar Holographic Glyph Container */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-5">
          {/* Dual Counter-Rotating Orbit Rings */}
          <motion.div
            className="absolute inset-0 rounded-full border border-dashed border-[#B94B3E]/35 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute -inset-3 rounded-full border border-dotted border-slate-300 pointer-events-none"
            animate={{ rotate: -360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          />

          {/* Ambient Glow */}
          <div className="absolute w-36 h-36 bg-[#B94B3E]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Icon Box */}
          <motion.div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/90 border-1.5 border-[#B94B3E]/40 shadow-md flex items-center justify-center backdrop-blur-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {isNetworkError ? (
              <WifiOff className="w-8 h-8 text-[#B94B3E]" />
            ) : isServerError ? (
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            ) : (
              <FileQuestion className="w-8 h-8 text-[#B94B3E]" />
            )}
          </motion.div>
        </div>

        {/* 3. Title & Subtitle */}
        <motion.h1
          className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-950 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {isNetworkError
            ? 'Network Connection Interrupted'
            : isServerError
            ? 'System Diagnostic Exception'
            : 'Sector Not Found (404)'}
        </motion.h1>

        <motion.p
          className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg mb-6 font-normal"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {isNetworkError
            ? 'Unable to establish connection to the host server. Please check your internet connectivity.'
            : isServerError
            ? 'A runtime exception was intercepted by the diagnostic boundary.'
            : 'The requested route or coordinate does not exist or has been relocated within the portfolio.'}
        </motion.p>

        {/* 4. High-Tech Monospace Diagnostic Code Panel */}
        <motion.div
          className="w-full max-w-lg bg-slate-950 text-slate-200 rounded-2xl p-4 sm:p-5 text-left font-mono text-xs shadow-xl border border-slate-800 relative mb-6 overflow-hidden group"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Subtle Cyber Scanline Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.03] to-transparent h-12 w-full animate-scanline pointer-events-none" />

          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-semibold text-slate-300">DIAGNOSTIC_TELEMETRY</span>
            </div>

            <button
              onClick={handleCopyDiagnostic}
              className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer bg-slate-900 px-2 py-1 rounded border border-slate-700/60"
              title="Copy error log"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>COPY LOG</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-1.5 leading-relaxed overflow-x-auto text-[11px] sm:text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#E06051] font-bold">&gt; ERROR_CODE:</span>
              <span className="text-emerald-400 font-bold">{activeErrorType}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#E06051] font-bold">&gt; TARGET_PATH:</span>
              <span className="text-amber-300 font-semibold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                {currentPath}
              </span>
            </div>

            <div className="flex items-start gap-2 pt-0.5">
              <span className="text-[#E06051] font-bold shrink-0">&gt; DIAGNOSIS:</span>
              <span className="text-slate-300">
                {customError
                  ? customError.toString()
                  : isNetworkError
                  ? 'ERR_CONNECTION_FAILED: Client disconnected from remote gateway'
                  : 'HTTP 404: Resource endpoint was not resolved on host cluster'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* 5. Live Countdown Progress Indicator */}
        <motion.div
          className="w-full max-w-xs mb-8 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden border border-slate-200">
            <motion.div
              className="h-full bg-gradient-to-r from-[#B94B3E] to-[#E06051] rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </div>
          <span className="text-[11px] font-mono text-slate-400 font-semibold tracking-wider">
            AUTO-REDIRECTING TO PORTFOLIO IN {countdown}s...
          </span>
        </motion.div>

        {/* 6. Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3.5 w-full justify-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <Magnetic strength={0.25} radius={80}>
            <SvgButton
              onClick={handleRedirect}
              variant="primary"
              icon={Home}
              className="!py-3 !px-7 !text-xs font-mono tracking-wider cursor-pointer"
            >
              Return to Portfolio
            </SvgButton>
          </Magnetic>

          <Magnetic strength={0.25} radius={80}>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-mono text-xs font-semibold tracking-wider shadow-xs hover:border-[#B94B3E]/40 hover:text-[#B94B3E] transition-all cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry / Reload</span>
            </button>
          </Magnetic>
        </motion.div>
      </div>
    </div>
  );
}
