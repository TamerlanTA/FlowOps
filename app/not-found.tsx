"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div style={{ 
      height: '100vh', 
      background: '#000', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '0 24px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(239, 68, 68, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.5
      }} />
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '14px', 
            color: '#ef4444', 
            marginBottom: '16px',
            letterSpacing: '0.1em'
          }}>
            ERROR_404 // RESOURCE_NOT_LOCATED
          </div>
          <h1 style={{ 
            fontSize: 'clamp(32px, 5vw, 64px)', 
            fontWeight: 800, 
            color: '#fff', 
            marginBottom: '24px',
            lineHeight: 1.1
          }}>
            This page doesn&apos;t exist. <br />
            <span style={{ color: 'var(--color-text-faint)' }}>But your automation system could.</span>
          </h1>
          
          <Link 
            href="/"
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              background: 'var(--color-primary)',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 700,
              boxShadow: 'var(--shadow-blue)',
              transition: 'all 0.3s ease'
            }}
          >
            Return to Command Center →
          </Link>
        </motion.div>
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '40px',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: 'var(--color-text-faint)',
        opacity: 0.3
      }}>
        SYSTEM_DIAGNOSTIC: UNKNOWN_ROUTE_EXCEPTION
      </div>
    </div>
  );
}
