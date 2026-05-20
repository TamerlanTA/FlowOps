"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Preloader.module.css";

const LOGS = [
  "INITIALIZING_CORE_ENGINE...",
  "CONNECTING_TO_WORKFLOW_MAP...",
  "VERIFYING_SYSTEM_INTEGRITY...",
  "OPTIMIZING_DIAGNOSTIC_SCANNERS...",
  "MAPPING_PRODUCTION_NODES...",
  "SYSTEM_READY_FOR_DEPLOYMENT"
];

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    // Scroll lock
    document.body.style.overflow = "hidden";
    
    const logInterval = setInterval(() => {
      setLogIndex(prev => (prev < LOGS.length - 1 ? prev + 1 : prev));
    }, 400);

    const handleLoad = () => {
      // Ensure at least 2.5s for cinematic feel
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 2500 - elapsed);
      
      setTimeout(() => {
        setLoading(false);
        document.body.style.overflow = "";
      }, delay);
    };

    const startTime = Date.now();

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    // Safety timeout
    const safety = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = "";
    }, 5000);

    return () => {
      clearInterval(logInterval);
      window.removeEventListener("load", handleLoad);
      clearTimeout(safety);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          transition={{ duration: 0.8, ease: "circIn" }}
        >
          <div className={styles.container}>
            <div className={styles.logo}>
              FLOW<span className={styles.primary}>OPS</span>
            </div>
            
            <div className={styles.progressBox}>
              <div className={styles.logText}>
                {LOGS[logIndex]}
              </div>
              <div className={styles.progressBar}>
                <motion.div 
                  className={styles.progressFill}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                />
              </div>
              <div className={styles.meta}>
                BUILD_ID: 2.4.0-STABLE // ASSET_LOAD_MODE: CRITICAL
              </div>
            </div>
          </div>
          
          <div className={styles.bgGrid} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
