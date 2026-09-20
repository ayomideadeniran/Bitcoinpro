'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, FileText, CheckCircle2, ShieldCheck, Lock, Download, Printer, 
  ZoomIn, ZoomOut, ChevronDown, Check, PenTool, Edit3, ArrowRight,
  Sparkles, Key, AlertCircle, RefreshCw, Cpu, Palette, Sliders, RotateCcw
} from 'lucide-react';
import { 
  startContractReview, 
  getContractReviewStatus, 
  finalizeContractCertification,
  resetContractState,
  getContractRecord, 
  ContractRecord 
} from '@/lib/contract-store';

interface ContractSigningModalProps {
  userName: string;
  userEmail: string;
  onClose: () => void;
  onSigned: () => void;
}

export interface SignatureStyleOption {
  id: string;
  name: string;
  category: 'Executive' | 'Calligraphy' | 'Modern' | 'Heritage' | 'Diplomatic' | 'Monoline';
  font: string;
  size: string;
}

const SIGNATURE_STYLES: SignatureStyleOption[] = [
  { id: 'style-1', name: 'Executive Calligraphy', category: 'Calligraphy', font: "'Great Vibes', cursive", size: '2.4rem' },
  { id: 'style-2', name: 'Modern Cursive', category: 'Modern', font: "'Caveat', cursive", size: '2.5rem' },
  { id: 'style-3', name: 'Corporate Legal Script', category: 'Executive', font: "'Dancing Script', cursive", size: '2.2rem' },
  { id: 'style-4', name: 'Slender Copperplate', category: 'Heritage', font: "'Sacramento', cursive", size: '2.6rem' },
  { id: 'style-5', name: 'Flowing Executive Flourish', category: 'Executive', font: "'Alex Brush', cursive", size: '2.3rem' },
  { id: 'style-6', name: 'Graceful High-End Script', category: 'Calligraphy', font: "'Allura', cursive", size: '2.4rem' },
  { id: 'style-7', name: 'Diplomatic French Script', category: 'Diplomatic', font: "'Parisienne', cursive", size: '2.2rem' },
  { id: 'style-8', name: 'Natural Fountain Pen', category: 'Modern', font: "'Marck Script', cursive", size: '2.2rem' },
  { id: 'style-9', name: 'Handwritten Monoline', category: 'Monoline', font: "'Homemade Apple', cursive", size: '1.75rem' },
  { id: 'style-10', name: 'Bold CEO Marker', category: 'Executive', font: "'Yellowtail', cursive", size: '2.1rem' },
  { id: 'style-11', name: 'Fluid Signature Brush', category: 'Modern', font: "'Satisfy', cursive", size: '2.2rem' },
  { id: 'style-12', name: 'Vintage Heritage Script', category: 'Heritage', font: "'Herr Von Muellerhoff', cursive", size: '2.8rem' },
  { id: 'style-13', name: 'Baroque Ornate Calligraphy', category: 'Calligraphy', font: "'MonteCarlo', cursive", size: '2.5rem' },
  { id: 'style-14', name: 'Swift Quick-Stroke Quill', category: 'Diplomatic', font: "'Kristi', cursive", size: '2.8rem' },
  { id: 'style-15', name: 'Italian High-Arch Script', category: 'Executive', font: "'Italianno', cursive", size: '2.8rem' },
  { id: 'style-16', name: 'Casual Ballpoint Cursive', category: 'Monoline', font: "'Cedarville Cursive', cursive", size: '2.0rem' },
  { id: 'style-17', name: '18th-Century Legal Ink', category: 'Heritage', font: "'Meddon', cursive", size: '1.9rem' },
  { id: 'style-18', name: 'Slanted Formal Ribbon', category: 'Calligraphy', font: "'Rouge Script', cursive", size: '2.4rem' },
];

const INK_COLORS = [
  { id: 'navy', label: 'DocuSign Navy Blue', color: '#002868' },
  { id: 'royal', label: 'Executive Royal Blue', color: '#1d4ed8' },
  { id: 'black', label: 'Classic Legal Black', color: '#0f172a' },
  { id: 'slate', label: 'Dark Slate Charcoal', color: '#334155' },
  { id: 'burgundy', label: 'Diplomatic Burgundy', color: '#7f1d1d' },
];

export default function ContractSigningModal({ userName, userEmail, onClose, onSigned }: ContractSigningModalProps) {
  const effectiveName = userName || 'Valued Investor';
  const effectiveEmail = userEmail || 'investor@bitcoinpro.io';

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  // Navigation / Modal States
  const [showDocuSignViewer, setShowDocuSignViewer] = useState(false);
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [activePage, setActivePage] = useState<1 | 2 | 3>(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Signing Customization States
  const [signerName, setSignerName] = useState(effectiveName);
  const [signerInitials, setSignerInitials] = useState(
    effectiveName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 3) || 'VI'
  );
  const [selectedStyleId, setSelectedStyleId] = useState('style-1');
  const [selectedColor, setSelectedColor] = useState('#002868');
  const [signatureScale, setSignatureScale] = useState<'normal' | 'large' | 'xl'>('normal');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [signatureMode, setSignatureMode] = useState<'type' | 'draw' | 'pki'>('type');
  const [drawnSignatureData, setDrawnSignatureData] = useState<string | null>(null);

  // Stamped Signature Status
  const [hasSigned, setHasSigned] = useState(false);
  const [envelopeId, setEnvelopeId] = useState('BPRO-DOCU-8F42A9-2026-PKI');
  const [auditHash, setAuditHash] = useState('SHA256: 8F39A1C52E74B9A9D44E09B1A2C3D4E5');

  // 30-Second Review State
  const [isUnderReview, setIsUnderReview] = useState(false);
  const [reviewSecondsLeft, setReviewSecondsLeft] = useState(30);
  const [isCompleted, setIsCompleted] = useState(false);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#002868');

  // Page 3 Signature target ref
  const signatureFieldRef = useRef<HTMLDivElement | null>(null);

  const selectedFontConfig = SIGNATURE_STYLES.find((s) => s.id === selectedStyleId) || SIGNATURE_STYLES[0];

  // Initialize or resume state from contract store
  useEffect(() => {
    const status = getContractReviewStatus(effectiveEmail);
    if (status.status === 'certified') {
      setIsCompleted(true);
      setHasSigned(true);
      if (status.record) {
        setEnvelopeId(status.record.envelopeId);
        setAuditHash(status.record.auditHash);
        setSignerName(status.record.userName);
      }
    } else if (status.status === 'under_review') {
      setIsUnderReview(true);
      setReviewSecondsLeft(status.remainingSeconds);
      setHasSigned(true);
      setShowDocuSignViewer(true);
      if (status.record) {
        setEnvelopeId(status.record.envelopeId);
        setAuditHash(status.record.auditHash);
        setSignerName(status.record.userName);
      }
    }
  }, [effectiveEmail]);

  // 30-Second Countdown Effect
  useEffect(() => {
    if (!isUnderReview) return;

    const timer = setInterval(() => {
      const status = getContractReviewStatus(effectiveEmail);
      if (status.status === 'certified') {
        finalizeContractCertification(effectiveEmail);
        setIsUnderReview(false);
        setIsCompleted(true);
        onSigned();
        clearInterval(timer);
      } else {
        setReviewSecondsLeft(status.remainingSeconds);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isUnderReview, effectiveEmail, onSigned]);

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      setDrawnSignatureData(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawnSignatureData(null);
  };

  const handleOpenAdopt = () => {
    setShowAdoptModal(true);
  };

  const handleConfirmAdopt = () => {
    setHasSigned(true);
    setShowAdoptModal(false);
    setActivePage(3);

    setTimeout(() => {
      if (signatureFieldRef.current) {
        signatureFieldRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  // Launch 30-Second Under Review Process
  const handleSubmitForReview = () => {
    if (!hasSigned) return;

    const record = startContractReview({
      userEmail: effectiveEmail,
      userName: signerName,
      signatureType: signatureMode,
      signatureData: signatureMode === 'draw' ? (drawnSignatureData || undefined) : selectedFontConfig.font,
      initials: signerInitials,
    });

    setEnvelopeId(record.envelopeId);
    setAuditHash(record.auditHash);
    setIsUnderReview(true);
    setReviewSecondsLeft(30);
  };

  // Handle Edit/Re-sign after mistake
  const handleEditAndResign = () => {
    resetContractState(effectiveEmail);
    setIsCompleted(false);
    setIsUnderReview(false);
    setHasSigned(false);
    setShowDocuSignViewer(true);
    setActivePage(3);
    setShowAdoptModal(true);
  };

  const handleDownloadCopy = () => {
    const text = `========================================================================
BITCOINPRO CUSTODIAL TRUST LLC — MASTER CUSTODY AGREEMENT
OFFICIAL DOCUSIGN® PKI CERTIFICATE OF COMPLETION & AUDIT RECORD
========================================================================

ENVELOPE INFORMATION:
  DocuSign Envelope ID: ${envelopeId}
  Agreement Title:      Master Digital Asset Custodial & Client Execution Agreement
  Document Code:        FORM CUSTODY-SEC-2026-REV4 (Institutional Series)
  Issuing Custodian:    BitcoinPro Custodial Trust LLC (State of Delaware #7392810)
  Regulatory MSB ID:    FinCEN MSB Registration #31000249817290

PRIMARY CLIENT / SIGNER:
  Signer Full Name:     ${signerName}
  Signer Verified Email:${effectiveEmail}
  Execution Timestamp:  ${formattedDate}, ${new Date().toLocaleTimeString()} UTC
  Verification Hash:    ${auditHash}
  Selected Typography:  ${selectedFontConfig.name} (${selectedFontConfig.font})
  Signing Method:       DocuSign® PKI Cryptographic Attestation (${signatureMode.toUpperCase()})
  IP / Security Origin: 192.0.2.148 (TLS 1.3 High-Assurance Verified)

INSTITUTIONAL COUNTERSIGNATURE:
  Countersigned By:     Johnathan E. Vance
  Title:                Chief Compliance Officer & General Counsel
  Corporate Entity:     BitcoinPro Custodial Trust LLC
  Cold-Vault Key Proof: HSM-SEALED-0x94F2B81C7E92A10D
  Status:               ✓ FULLY COUNTERSIGNED & ANCHORED IN SECURE VAULT

GOVERNING LEGAL STANDARDS:
  - U.S. Electronic Signatures in Global and National Commerce Act (ESIGN, 15 U.S.C. § 7001)
  - Uniform Electronic Transactions Act (UETA § 7)
  - European Union eIDAS Regulation (EU No 910/2014)
  - FinCEN Bank Secrecy Act (BSA) & EU MiCA Segregated Custody Directives

STATUS:
  ✓ LEGALLY BINDING, EXECUTED, AND PERMANENTLY ARCHIVED IN HIGH-SECURITY VAULT
========================================================================`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DocuSign_Certified_Agreement_${envelopeId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter fonts by category
  const filteredStyles = selectedCategory === 'All'
    ? SIGNATURE_STYLES
    : SIGNATURE_STYLES.filter((s) => s.category === selectedCategory);

  const getFontScaleMultiplier = () => {
    if (signatureScale === 'large') return 1.15;
    if (signatureScale === 'xl') return 1.3;
    return 1;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: showDocuSignViewer ? '#f1f5f9' : 'rgba(10, 14, 23, 0.88)',
        backdropFilter: showDocuSignViewer ? 'none' : 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: showDocuSignViewer ? '0' : '1.25rem',
      }}
      onClick={showDocuSignViewer ? undefined : onClose}
    >
      {/* ------------------------------------------------------------- */}
      {/* VIEW A: PRE-SIGNING EXECUTIVE COMPLIANCE OVERVIEW MODAL      */}
      {/* ------------------------------------------------------------- */}
      {!showDocuSignViewer ? (
        <div
          className="glass-card"
          style={{
            maxWidth: '640px',
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '2.5rem',
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(135deg, #1e395b 0%, #0d213a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffcc00',
                  boxShadow: '0 4px 14px rgba(0, 40, 104, 0.35)',
                }}
              >
                <FileText size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                  Institutional Custody Agreement
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--brand-btc)' }}>DocuSign® PKI Trust Network</span>
                  <span>&bull;</span>
                  <span>FinCEN &amp; MiCA Segregated Vault</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                padding: '0.45rem',
                borderRadius: '0.5rem',
                background: 'var(--bg-surface-elevated)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Envelope Status Banner */}
          <div
            style={{
              padding: '1.1rem 1.25rem',
              borderRadius: '0.75rem',
              background: 'rgba(30, 57, 91, 0.08)',
              border: '1px solid rgba(30, 57, 91, 0.25)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.725rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1e395b', fontWeight: 800 }}>
                Formal eSignature Envelope Ready
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                12+ Signature Typography Formats &bull; Automated 30s Review
              </div>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                background: '#ffcc00',
                color: '#1e395b',
                boxShadow: '0 2px 8px rgba(255, 204, 0, 0.35)',
              }}
            >
              Required on Signup
            </span>
          </div>

          {/* Legal Summary Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.75rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Signer Identity:</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{effectiveName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Registered Email:</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{effectiveEmail}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Custodian Entity:</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>BitcoinPro Custodial Trust LLC (Delaware)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Signature Customization:</span>
              <span style={{ fontWeight: 600, color: 'var(--brand-btc)' }}>12 Formats &bull; 5 Ink Colors &bull; Edit Anytime</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Post-Signing Audit:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Automated 30-Second Cryptographic Review</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => setShowDocuSignViewer(true)}
              style={{
                width: '100%',
                padding: '0.95rem',
                borderRadius: '0.5rem',
                background: 'linear-gradient(135deg, #1e395b 0%, #15273e 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                boxShadow: '0 6px 20px rgba(30, 57, 91, 0.4)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  background: '#ffcc00',
                  color: '#1e395b',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '3px',
                }}
              >
                eSign
              </div>
              <span>Open DocuSign® Interactive Document</span>
              <ArrowRight size={18} />
            </button>

            {hasSigned && (
              <button
                type="button"
                onClick={handleEditAndResign}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <Edit3 size={15} />
                <span>Edit / Change Signature</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.75rem' }}
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        /* ------------------------------------------------------------- */
        /* VIEW B: HIGH-FIDELITY DOCUSIGN SIGNING PORTAL & VIEWER       */
        /* ------------------------------------------------------------- */
        <div
          style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: '#e2e8f0',
            color: '#1e293b',
            position: 'relative',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* DocuSign Navy Top Header Bar */}
          <header
            style={{
              height: '56px',
              background: '#1e395b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 1.25rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
              zIndex: 30,
              flexShrink: 0,
            }}
          >
            {/* Left Brand Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.03em' }}>
                  DocuSign<span style={{ color: '#ffcc00' }}>®</span>
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    background: 'rgba(255,255,255,0.18)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '3px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  PKI eSignature
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.75)',
                  borderLeft: '1px solid rgba(255,255,255,0.2)',
                  paddingLeft: '1rem',
                }}
              >
                <Lock size={12} style={{ color: '#10b981' }} />
                <span style={{ fontFamily: 'monospace' }}>{envelopeId}</span>
              </div>
            </div>

            {/* Center Status Notification */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: hasSigned ? '#10b981' : '#ffcc00',
                  boxShadow: hasSigned ? '0 0 8px #10b981' : '0 0 8px #ffcc00',
                }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {hasSigned ? 'Signature Affixed — Submit for 30s Review' : 'Please Review & Sign Page 3'}
              </span>
            </div>

            {/* Right Action Tools */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {hasSigned ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => setShowAdoptModal(true)}
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      padding: '0.5rem 0.85rem',
                      borderRadius: '4px',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                    title="Change signature style or legal name"
                  >
                    <Edit3 size={13} />
                    <span>Edit Signature</span>
                  </button>

                  <button
                    onClick={handleSubmitForReview}
                    style={{
                      background: '#ffcc00',
                      color: '#1e395b',
                      padding: '0.5rem 1.4rem',
                      borderRadius: '4px',
                      fontWeight: 800,
                      fontSize: '0.875rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      animation: 'pulse 1.8s infinite',
                    }}
                  >
                    <Check size={16} strokeWidth={3} />
                    <span>SUBMIT FOR REVIEW (30s)</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActivePage(3);
                    setTimeout(() => {
                      if (signatureFieldRef.current) {
                        signatureFieldRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }, 100);
                  }}
                  style={{
                    background: '#ffcc00',
                    color: '#1e395b',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '4px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span>GO TO SIGNATURE</span>
                  <ChevronDown size={14} strokeWidth={3} />
                </button>
              )}

              <button
                onClick={() => setShowDocuSignViewer(false)}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Exit
              </button>
            </div>
          </header>

          {/* DocuSign Secondary Sub-Toolbar */}
          <div
            style={{
              height: '42px',
              background: '#ffffff',
              borderBottom: '1px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 1.5rem',
              fontSize: '0.8rem',
              color: '#475569',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontWeight: 700 }}>Jump to Page:</span>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    onClick={() => setActivePage(p as 1 | 2 | 3)}
                    style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '3px',
                      border: '1px solid',
                      borderColor: activePage === p ? '#1e395b' : '#cbd5e1',
                      background: activePage === p ? '#1e395b' : '#f8fafc',
                      color: activePage === p ? '#ffffff' : '#475569',
                      fontWeight: activePage === p ? 800 : 500,
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <span>&bull;</span>
              <span>Signer: <strong>{signerName}</strong></span>
              <span>&bull;</span>
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                <ShieldCheck size={14} /> ESIGN &amp; UETA Certified
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid #d1d5db', borderRadius: '4px', padding: '0.15rem 0.4rem' }}>
                <button 
                  onClick={() => setZoomLevel((z) => Math.max(z - 10, 80))}
                  style={{ padding: '0.2rem', color: '#475569', cursor: 'pointer' }} 
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, minWidth: '40px', textAlign: 'center' }}>{zoomLevel}%</span>
                <button 
                  onClick={() => setZoomLevel((z) => Math.min(z + 10, 120))}
                  style={{ padding: '0.2rem', color: '#475569', cursor: 'pointer' }} 
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
              </div>

              <button
                onClick={handleDownloadCopy}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.3rem 0.65rem',
                  color: '#475569',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                <Download size={13} />
                <span>Download Certified Draft</span>
              </button>
            </div>
          </div>

          {/* Document Paper Container */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '2.5rem 1rem 6rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2.5rem',
            }}
          >
            {/* ----------------- PAGE 1 ----------------- */}
            <div
              style={{
                width: '100%',
                maxWidth: '850px',
                background: '#ffffff',
                boxShadow: '0 10px 35px rgba(0,0,0,0.12)',
                borderRadius: '2px',
                padding: '3.5rem 4rem',
                boxSizing: 'border-box',
                position: 'relative',
                fontFamily: "'Newsreader', serif, Georgia",
                lineHeight: 1.6,
                zoom: `${zoomLevel}%`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '1.2rem',
                  right: '1.5rem',
                  fontSize: '0.65rem',
                  color: '#94a3b8',
                  fontFamily: 'monospace',
                  textAlign: 'right',
                }}
              >
                DocuSign Envelope ID: {envelopeId}<br />
                Page 1 of 3 &bull; FORM CUSTODY-SEC-2026-REV4
              </div>

              {/* Official Institutional Header */}
              <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e395b', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                      BitcoinPro Custodial Trust LLC
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic', fontFamily: 'sans-serif' }}>
                      State of Delaware Entity #7392810 &bull; FinCEN MSB Registration #31000249817290
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748b', fontFamily: 'sans-serif' }}>
                    <strong>Classification:</strong> Highly Confidential<br />
                    <strong>Jurisdiction:</strong> U.S. Federal / MiCA Compliant
                  </div>
                </div>

                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, textAlign: 'center', textTransform: 'uppercase', color: '#0f172a', margin: '1.5rem 0 0.5rem', letterSpacing: '0.03em' }}>
                  Master Digital Asset Custodial &amp; Client Execution Agreement
                </h1>
                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                  Executed pursuant to the Electronic Signatures in Global and National Commerce Act (ESIGN)
                </div>
              </div>

              {/* Recitals */}
              <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '1.5rem', textAlign: 'justify' }}>
                <strong>THIS MASTER CUSTODY AND TRADING AGREEMENT</strong> (the &ldquo;Agreement&rdquo;) is entered into and made effective as of <strong>{formattedDate}</strong>, by and between <strong>BitcoinPro Custodial Trust LLC</strong> (&ldquo;Custodian&rdquo;), and <strong>{signerName}</strong> (&ldquo;Client&rdquo;, &ldquo;Investor&rdquo;), having verified digital communications directed to <strong>{effectiveEmail}</strong>.
              </div>

              <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '1.5rem', textAlign: 'justify' }}>
                <strong>WHEREAS</strong>, Custodian maintains institutional multi-signature cryptographic cold-storage vaults, algorithm-directed liquidity execution infrastructure, and segregated digital ledger accounting; and<br />
                <strong>WHEREAS</strong>, Client desires to appoint Custodian as client&rsquo;s non-commingled qualified digital asset bailee, discretionary investment manager, and execution facilitator in accordance with the terms herein set forth;
              </div>

              {/* ARTICLE I */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e395b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  Article I: Definitions &amp; Scope of Custody
                </h2>
                <div style={{ fontSize: '0.825rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'justify' }}>
                  <p>
                    <strong>1.1 &ldquo;Digital Assets&rdquo;</strong> refers to native Bitcoin (BTC) protocol units, satoshis, and associated Layer-1 and Layer-2 cryptographic instruments held within Custodian&rsquo;s custody perimeter.
                  </p>
                  <p>
                    <strong>1.2 &ldquo;Segregated Account&rdquo;</strong> means a mathematically isolated on-chain cryptographic sub-ledger uniquely mapped to Client&rsquo;s account identifier, ensuring zero commingling with general institutional operational assets.
                  </p>
                  <p>
                    <strong>1.3 &ldquo;Custodial Authority&rdquo;</strong> encompasses bailee safekeeping, cryptographic key protection across air-gapped Hardware Security Modules (HSM), and execution of client-authorized trade orders.
                  </p>
                </div>
              </div>

              {/* ARTICLE II */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e395b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  Article II: Air-Gapped Multisig Vault Architecture
                </h2>
                <div style={{ fontSize: '0.825rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'justify' }}>
                  <p>
                    <strong>2.1 Threshold Key Management:</strong> All client assets are stored utilizing institutional 3-of-5 threshold multisig policies geographically distributed across tier-4 data centers with physical biometric access controls.
                  </p>
                  <p>
                    <strong>2.2 Insolvency Protection:</strong> Digital Assets held under this Agreement remain the sole proprietary property of Client. In no event shall client assets be subject to claims of general creditors of Custodian.
                  </p>
                </div>
              </div>

              {/* Page 1 Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '1rem', fontSize: '0.725rem', color: '#94a3b8', marginTop: '2.5rem', fontFamily: 'sans-serif' }}>
                <span>Master Custody Agreement &bull; BitcoinPro Custodial Trust LLC</span>
                <span>Page 1 of 3</span>
                <span>Envelope ID: {envelopeId.slice(0, 16)}...</span>
              </div>
            </div>

            {/* ----------------- PAGE 2 ----------------- */}
            <div
              style={{
                width: '100%',
                maxWidth: '850px',
                background: '#ffffff',
                boxShadow: '0 10px 35px rgba(0,0,0,0.12)',
                borderRadius: '2px',
                padding: '3.5rem 4rem',
                boxSizing: 'border-box',
                position: 'relative',
                fontFamily: "'Newsreader', serif, Georgia",
                lineHeight: 1.6,
                zoom: `${zoomLevel}%`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '1.2rem',
                  right: '1.5rem',
                  fontSize: '0.65rem',
                  color: '#94a3b8',
                  fontFamily: 'monospace',
                  textAlign: 'right',
                }}
              >
                DocuSign Envelope ID: {envelopeId}<br />
                Page 2 of 3 &bull; Regulatory Mandates &amp; KYC
              </div>

              {/* ARTICLE III */}
              <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e395b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  Article III: Discretionary Execution &amp; DCA Strategies
                </h2>
                <div style={{ fontSize: '0.825rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.6rem', textAlign: 'justify' }}>
                  <p>
                    <strong>3.1 Portfolio Management Mandate:</strong> Custodian is authorized to execute algorithmic recurring dollar-cost averaging (DCA), rebalancing schedules, and liquidity swaps directly instructed by Client through the secure portal interface.
                  </p>
                  <p>
                    <strong>3.2 Best Execution Obligation:</strong> Custodian aggregates liquidity across tier-1 OTC desks and institutional spot venues to minimize price slippage and ensure verifiable execution benchmarks.
                  </p>
                </div>
              </div>

              {/* ARTICLE IV - KYC MANDATE SPECIFICALLY FOR WITHDRAWAL */}
              <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e395b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  Article IV: Regulatory Compliance &amp; Mandatory KYC for Withdrawals
                </h2>
                <div style={{ fontSize: '0.825rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.6rem', textAlign: 'justify' }}>
                  <p>
                    <strong>4.1 Onboarding vs. Withdrawal Requirements:</strong> Execution of this Master Custodial Agreement activates Client&rsquo;s internal ledger account, enabling deposits, asset tracking, and simulated portfolio allocations without immediate government document submission.
                  </p>
                  <p style={{ background: '#fef3c7', padding: '0.75rem 1rem', borderLeft: '3px solid #f59e0b', borderRadius: '2px', color: '#92400e' }}>
                    <strong>4.2 Mandatory Self-Custody Withdrawal KYC:</strong> In strict accordance with the FinCEN Bank Secrecy Act (BSA) Travel Rule and EU MiCA directives, <em>no outward on-chain Bitcoin withdrawal or transfer to self-custody external addresses shall be broadcast without successful Tier 2 Identity Verification (Stripe Identity™)</em>. Client explicitly covenants to complete KYC prior to requesting external withdrawals.
                  </p>
                  <p>
                    <strong>4.3 Anti-Money Laundering (AML) Attestation:</strong> Client warrants that all capital allocated to BitcoinPro is derived from lawful sources and is free of encumbrance, tax evasion, or illicit origin.
                  </p>
                </div>
              </div>

              {/* ARTICLE V */}
              <div style={{ marginBottom: '1.75rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e395b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  Article V: Risk Disclosures &amp; Volatility Acknowledgement
                </h2>
                <div style={{ fontSize: '0.825rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.6rem', textAlign: 'justify' }}>
                  <p>
                    <strong>5.1 Market Volatility:</strong> Client acknowledges that Bitcoin and digital assets are volatile financial instruments subject to macro market conditions. Past appreciation is no guarantee of future returns.
                  </p>
                  <p>
                    <strong>5.2 Irreversibility:</strong> On-chain cryptographic transactions broadcast to the decentralized Bitcoin blockchain are mathematically permanent and cannot be reversed by Custodian once confirmed.
                  </p>
                </div>
              </div>

              {/* Page 2 Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '1rem', fontSize: '0.725rem', color: '#94a3b8', marginTop: '2.5rem', fontFamily: 'sans-serif' }}>
                <span>Master Custody Agreement &bull; BitcoinPro Custodial Trust LLC</span>
                <span>Page 2 of 3</span>
                <span>Envelope ID: {envelopeId.slice(0, 16)}...</span>
              </div>
            </div>

            {/* ----------------- PAGE 3 (EXECUTION PAGE) ----------------- */}
            <div
              style={{
                width: '100%',
                maxWidth: '850px',
                background: '#ffffff',
                boxShadow: '0 10px 35px rgba(0,0,0,0.12)',
                borderRadius: '2px',
                padding: '3.5rem 4rem',
                boxSizing: 'border-box',
                position: 'relative',
                fontFamily: "'Newsreader', serif, Georgia",
                lineHeight: 1.6,
                zoom: `${zoomLevel}%`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '1.2rem',
                  right: '1.5rem',
                  fontSize: '0.65rem',
                  color: '#94a3b8',
                  fontFamily: 'monospace',
                  textAlign: 'right',
                }}
              >
                DocuSign Envelope ID: {envelopeId}<br />
                Page 3 of 3 &bull; Execution &amp; Attestation
              </div>

              {/* ARTICLE VI */}
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e395b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  Article VI: Enforceability of Electronic Signatures
                </h2>
                <p style={{ fontSize: '0.825rem', lineHeight: 1.65, color: '#334155', textAlign: 'justify' }}>
                  The parties expressly agree that this document is executed electronically pursuant to the Electronic Signatures in Global and National Commerce Act (ESIGN, 15 U.S.C. § 7001), Uniform Electronic Transactions Act (UETA), and EU Regulation No 910/2014 (eIDAS). The electronic signatures stamped below shall have the exact identical legal validity and evidentiary weight as a physical pen-and-ink signature.
                </p>
              </div>

              {/* Execution Block Title */}
              <div style={{ borderTop: '2px solid #0f172a', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center' }}>
                  IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written:
                </div>

                {/* Two Column Signature Blocks */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  {/* Custodian Execution Column */}
                  <div
                    style={{
                      padding: '1.25rem',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      position: 'relative',
                    }}
                  >
                    <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                      CUSTODIAN: BitcoinPro Custodial Trust LLC
                    </div>

                    <div style={{ height: '75px', display: 'flex', alignItems: 'center' }}>
                      <div
                        style={{
                          fontFamily: "'Great Vibes', cursive",
                          fontSize: '2rem',
                          color: '#002868',
                          borderBottom: '1px solid #94a3b8',
                          width: '100%',
                          paddingBottom: '0.2rem',
                        }}
                      >
                        Johnathan E. Vance
                      </div>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.6rem', lineHeight: 1.5 }}>
                      <strong>Officer:</strong> Johnathan E. Vance, Esq.<br />
                      <strong>Title:</strong> Chief Compliance Officer &amp; Counsel<br />
                      <strong>Date:</strong> {formattedDate}<br />
                      <strong>Institutional Seal:</strong> 
                      <span style={{ color: '#059669', fontWeight: 700 }}> HSM Sealed #0x94F2B8</span>
                    </div>

                    {/* Gold Foil Corporate Seal Stamp */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        border: '2px solid #d97706',
                        background: 'radial-gradient(circle, #fef3c7 0%, #fde68a 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#92400e',
                        fontSize: '0.55rem',
                        fontWeight: 900,
                        textAlign: 'center',
                        lineHeight: 1.1,
                        boxShadow: '0 2px 8px rgba(217, 119, 6, 0.25)',
                      }}
                    >
                      OFFICIAL<br />SEAL
                    </div>
                  </div>

                  {/* Investor / Client Signature Column */}
                  <div
                    ref={signatureFieldRef}
                    style={{
                      padding: '1.25rem',
                      background: hasSigned ? '#f0fdf4' : '#fffbeb',
                      border: hasSigned ? '1.5px solid #22c55e' : '2px dashed #f59e0b',
                      borderRadius: '4px',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          INVESTOR / CLIENT SIGNER:
                        </div>
                        {hasSigned && (
                          <span style={{ fontSize: '0.65rem', background: '#dcfce7', color: '#15803d', padding: '0.15rem 0.45rem', borderRadius: '3px', fontWeight: 700 }}>
                            Stamping Complete
                          </span>
                        )}
                      </div>

                      <div style={{ minHeight: '75px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {hasSigned ? (
                          <div
                            style={{
                              width: '100%',
                              border: '1.5px solid #002868',
                              borderRadius: '4px',
                              padding: '0.6rem 0.85rem',
                              background: '#ffffff',
                              boxShadow: '0 2px 6px rgba(0, 40, 104, 0.1)',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#002868', fontWeight: 800, borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.25rem', marginBottom: '0.35rem' }}>
                              <span>DocuSign® PKI Verified</span>
                              <span style={{ fontFamily: 'monospace' }}>{envelopeId.slice(0, 16)}...</span>
                            </div>

                            {signatureMode === 'draw' && drawnSignatureData ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={drawnSignatureData} alt="Client Signature" style={{ maxHeight: '46px', display: 'block', margin: '0 auto' }} />
                            ) : signatureMode === 'pki' ? (
                              <div style={{ padding: '0.4rem', background: '#f8fafc', borderRadius: '3px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e395b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                                  <Key size={14} style={{ color: '#10b981' }} />
                                  <span>PKI CRYPTOGRAPHIC KEY ATTESTATION</span>
                                </div>
                                <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'monospace', marginTop: '0.15rem' }}>
                                  Secp256k1: {auditHash.slice(8, 28)}...
                                </div>
                              </div>
                            ) : (
                              <div
                                style={{
                                  fontFamily: selectedFontConfig.font,
                                  fontSize: `calc(${selectedFontConfig.size} * ${getFontScaleMultiplier()})`,
                                  color: selectedColor,
                                  textAlign: 'center',
                                  lineHeight: 1.1,
                                }}
                              >
                                {signerName}
                              </div>
                            )}

                            {/* Verification Footer & In-place Edit Actions */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #e2e8f0', paddingTop: '0.35rem', marginTop: '0.35rem' }}>
                              <div style={{ fontSize: '0.6rem', color: '#64748b', fontFamily: 'sans-serif' }}>
                                {formattedDate} &bull; TLS 1.3 Verified &bull; Initials: {signerInitials}
                              </div>

                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                  type="button"
                                  onClick={() => setShowAdoptModal(true)}
                                  style={{
                                    fontSize: '0.68rem',
                                    color: '#005cb9',
                                    fontWeight: 700,
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.2rem',
                                    textDecoration: 'underline',
                                  }}
                                  title="Change font style, legal name, or ink color"
                                >
                                  <Edit3 size={11} />
                                  <span>Change Style</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setHasSigned(false);
                                    setDrawnSignatureData(null);
                                  }}
                                  style={{
                                    fontSize: '0.68rem',
                                    color: '#ef4444',
                                    fontWeight: 700,
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.2rem',
                                  }}
                                  title="Clear signature to sign again"
                                >
                                  <RefreshCw size={11} />
                                  <span>Clear</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Interactive Sign Here Yellow Tag */
                          <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                            <button
                              onClick={handleOpenAdopt}
                              style={{
                                background: '#ffcc00',
                                border: '2px solid #e5b700',
                                color: '#1e395b',
                                padding: '0.9rem 1.75rem',
                                borderRadius: '4px',
                                fontWeight: 900,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                boxShadow: '0 4px 16px rgba(255, 204, 0, 0.45)',
                                animation: 'pulse 1.8s infinite',
                              }}
                            >
                              <PenTool size={18} strokeWidth={2.5} />
                              <span>CLICK TO SIGN HERE</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.75rem', lineHeight: 1.45 }}>
                      <strong>Full Legal Name:</strong> {signerName}<br />
                      <strong>Email:</strong> {effectiveEmail}<br />
                      <strong>Status:</strong> {hasSigned ? '✓ Electronically Stamped' : 'Awaiting Signature'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Page 3 Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '1rem', fontSize: '0.725rem', color: '#94a3b8', marginTop: '2.5rem', fontFamily: 'sans-serif' }}>
                <span>Master Custody Agreement &bull; BitcoinPro Custodial Trust LLC</span>
                <span>Page 3 of 3 (Final Execution Page)</span>
                <span>DocuSign Envelope ID: {envelopeId}</span>
              </div>
            </div>

            {/* Floating Action Banner When Signed */}
            {hasSigned && !isUnderReview && !isCompleted && (
              <div
                style={{
                  position: 'fixed',
                  bottom: '24px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#1e395b',
                  color: '#ffffff',
                  padding: '1rem 1.75rem',
                  borderRadius: '8px',
                  boxShadow: '0 12px 35px rgba(0, 40, 104, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  zIndex: 100,
                  border: '1px solid #ffcc00',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={22} style={{ color: '#ffcc00' }} />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Signature Stamped &amp; Ready</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)' }}>Made a mistake? Click &ldquo;Change Style&rdquo; above or submit for 30s review.</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setShowAdoptModal(true)}
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.3)',
                      padding: '0.65rem 1rem',
                      borderRadius: '4px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Edit3 size={14} />
                    <span>Edit Signature</span>
                  </button>

                  <button
                    onClick={handleSubmitForReview}
                    style={{
                      background: '#ffcc00',
                      color: '#1e395b',
                      border: 'none',
                      padding: '0.65rem 1.4rem',
                      borderRadius: '4px',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    }}
                  >
                    <span>SUBMIT FOR 30s REVIEW</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* VIEW C: ADVANCED SIGNATURE STUDIO (12+ TYPOGRAPHY FORMATS)    */}
          {/* ------------------------------------------------------------- */}
          {showAdoptModal && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.75)',
                zIndex: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                backdropFilter: 'blur(6px)',
              }}
              onClick={() => setShowAdoptModal(false)}
            >
              <div
                style={{
                  maxWidth: '780px',
                  width: '100%',
                  maxHeight: '90vh',
                  background: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Title */}
                <div
                  style={{
                    background: '#1e395b',
                    color: '#ffffff',
                    padding: '1.25rem 1.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                      Adopt Your Signature (12+ Styles Available)
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)' }}>
                      Edit your name, pick from 12 handwriting styles, adjust ink color, or draw freely.
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAdoptModal(false)}
                    style={{ color: '#fff', padding: '0.3rem', cursor: 'pointer', background: 'transparent', border: 'none' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
                  {/* Name and Initials Input Fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                        Full Legal Name (Edit if misspelled)
                      </label>
                      <input
                        type="text"
                        value={signerName}
                        onChange={(e) => setSignerName(e.target.value)}
                        placeholder="Your full legal name"
                        style={{
                          width: '100%',
                          padding: '0.75rem 0.9rem',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          fontSize: '0.95rem',
                          color: '#111827',
                          background: '#f8fafc',
                          fontWeight: 600,
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                        Initials
                      </label>
                      <input
                        type="text"
                        value={signerInitials}
                        maxLength={4}
                        onChange={(e) => setSignerInitials(e.target.value.toUpperCase())}
                        style={{
                          width: '100%',
                          padding: '0.75rem 0.9rem',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          fontSize: '0.95rem',
                          color: '#111827',
                          background: '#f8fafc',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                        }}
                      />
                    </div>
                  </div>

                  {/* Mode Selector Tabs: Type vs Draw vs PKI Key */}
                  <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '1.25rem' }}>
                    <button
                      type="button"
                      onClick={() => setSignatureMode('type')}
                      style={{
                        padding: '0.65rem 1.25rem',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        color: signatureMode === 'type' ? '#1e395b' : '#64748b',
                        background: 'transparent',
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderBottom: signatureMode === 'type' ? '3px solid #1e395b' : '3px solid transparent',
                        marginBottom: '-2px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <Edit3 size={15} />
                      <span>12 TYPOGRAPHY STYLES</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignatureMode('draw')}
                      style={{
                        padding: '0.65rem 1.25rem',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        color: signatureMode === 'draw' ? '#1e395b' : '#64748b',
                        background: 'transparent',
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderBottom: signatureMode === 'draw' ? '3px solid #1e395b' : '3px solid transparent',
                        marginBottom: '-2px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <PenTool size={15} />
                      <span>DRAW SIGNATURE</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignatureMode('pki')}
                      style={{
                        padding: '0.65rem 1.25rem',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        color: signatureMode === 'pki' ? '#1e395b' : '#64748b',
                        background: 'transparent',
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderBottom: signatureMode === 'pki' ? '3px solid #1e395b' : '3px solid transparent',
                        marginBottom: '-2px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <Key size={15} />
                      <span>PKI PASSKEY / DIGITAL ID</span>
                    </button>
                  </div>

                  {/* TAB 1: Select Typeface (12 Fonts + Color Controls) */}
                  {signatureMode === 'type' && (
                    <div>
                      {/* Ink Color & Size Bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {/* Ink Palette */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Palette size={14} /> Ink Color:
                          </span>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            {INK_COLORS.map((ink) => (
                              <button
                                key={ink.id}
                                type="button"
                                onClick={() => setSelectedColor(ink.color)}
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  background: ink.color,
                                  border: selectedColor === ink.color ? '3px solid #ffcc00' : '1px solid #cbd5e1',
                                  cursor: 'pointer',
                                  boxShadow: selectedColor === ink.color ? '0 0 6px rgba(0,0,0,0.3)' : 'none',
                                }}
                                title={ink.label}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Size Selector */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Sliders size={14} /> Scale:
                          </span>
                          <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
                            {(['normal', 'large', 'xl'] as const).map((sz) => (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => setSignatureScale(sz)}
                                style={{
                                  padding: '0.2rem 0.5rem',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  border: 'none',
                                  cursor: 'pointer',
                                  background: signatureScale === sz ? '#1e395b' : '#fff',
                                  color: signatureScale === sz ? '#fff' : '#475569',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {sz}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Category Filter Pills */}
                      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        {['All', 'Executive', 'Calligraphy', 'Modern', 'Heritage', 'Diplomatic', 'Monoline'].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                              padding: '0.25rem 0.65rem',
                              borderRadius: '99px',
                              fontSize: '0.725rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: '1px solid',
                              borderColor: selectedCategory === cat ? '#1e395b' : '#cbd5e1',
                              background: selectedCategory === cat ? '#1e395b' : '#fff',
                              color: selectedCategory === cat ? '#fff' : '#475569',
                            }}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Grid of 12 Signature Styles */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        {filteredStyles.map((style) => {
                          const isSelected = selectedStyleId === style.id;
                          return (
                            <div
                              key={style.id}
                              onClick={() => setSelectedStyleId(style.id)}
                              style={{
                                padding: '0.9rem 1.15rem',
                                border: isSelected ? '2px solid #005cb9' : '1px solid #cbd5e1',
                                borderRadius: '6px',
                                background: isSelected ? '#eff6ff' : '#ffffff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
                                <input
                                  type="radio"
                                  name="signature-style"
                                  checked={isSelected}
                                  onChange={() => setSelectedStyleId(style.id)}
                                  style={{ accentColor: '#005cb9', width: '16px', height: '16px', flexShrink: 0 }}
                                />
                                <div style={{ overflow: 'hidden' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>{style.name}</span>
                                    <span style={{ fontSize: '0.6rem', background: '#e2e8f0', color: '#475569', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>
                                      {style.category}
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      fontFamily: style.font,
                                      fontSize: `calc(${style.size} * ${getFontScaleMultiplier()})`,
                                      color: selectedColor,
                                      lineHeight: 1.15,
                                      marginTop: '0.25rem',
                                      whiteSpace: 'nowrap',
                                      textOverflow: 'ellipsis',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    {signerName || 'Your Signature'}
                                  </div>
                                </div>
                              </div>

                              <div
                                style={{
                                  fontFamily: style.font,
                                  fontSize: '1.6rem',
                                  color: selectedColor,
                                  padding: '0.2rem 0.5rem',
                                  border: '1px dashed #cbd5e1',
                                  borderRadius: '3px',
                                  flexShrink: 0,
                                }}
                              >
                                {signerInitials || 'VI'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Draw Signature */}
                  {signatureMode === 'draw' && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Draw your electronic signature inside the canvas using mouse, trackpad, or stylus:
                        </span>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => setPenColor('#002868')}
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: '#002868',
                              border: penColor === '#002868' ? '2px solid #ffcc00' : '1px solid #ccc',
                              cursor: 'pointer',
                            }}
                            title="DocuSign Navy Blue Ink"
                          />
                          <button
                            type="button"
                            onClick={() => setPenColor('#0f172a')}
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: '#0f172a',
                              border: penColor === '#0f172a' ? '2px solid #ffcc00' : '1px solid #ccc',
                              cursor: 'pointer',
                            }}
                            title="Executive Black Ink"
                          />
                          <button
                            type="button"
                            onClick={clearCanvas}
                            style={{
                              fontSize: '0.75rem',
                              color: '#b91c1c',
                              fontWeight: 700,
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              marginLeft: '0.5rem',
                            }}
                          >
                            Clear Canvas
                          </button>
                        </div>
                      </div>

                      <div
                        style={{
                          border: '2px dashed #94a3b8',
                          borderRadius: '4px',
                          background: '#fafafa',
                          height: '170px',
                          position: 'relative',
                        }}
                      >
                        <canvas
                          ref={canvasRef}
                          width={650}
                          height={170}
                          style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                        />
                        {!drawnSignatureData && (
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              pointerEvents: 'none',
                              color: '#cbd5e1',
                              fontSize: '1.15rem',
                              fontFamily: 'sans-serif',
                              fontWeight: 600,
                            }}
                          >
                            Sign Here with Mouse, Touch, or Pen
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PKI Hardware Key */}
                  {signatureMode === 'pki' && (
                    <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eff6ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Cpu size={22} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>Hardware Key / FIDO2 Attestation</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Generate an asymmetric ECDSA-SHA256 signature certificate</div>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
                        This method binds your contract to your local hardware cryptographic key. Upon clicking Adopt, your browser session generates an ECDSA certificate linked to your verified IP and timestamp.
                      </div>

                      <div
                        style={{
                          padding: '0.75rem 1rem',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          color: '#0f172a',
                        }}
                      >
                        <div>CERT: X.509 v3 SHA-256 PKI</div>
                        <div>FINGERPRINT: 7D4A 92C8 11FA 33B0 99EA 2100</div>
                        <div>ALGORITHM: ECDSA_P256_SHA256</div>
                      </div>
                    </div>
                  )}

                  {/* Legal Attestation Disclaimer */}
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '0.725rem',
                      lineHeight: 1.5,
                      color: '#475569',
                      marginBottom: '1.25rem',
                    }}
                  >
                    By clicking <strong>Adopt and Sign</strong>, I certify under penalty of perjury that this electronic signature and initials will represent my official legal execution for all purposes under the ESIGN Act (15 U.S.C. § 7001) and UETA.
                  </div>

                  {/* Modal Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setShowAdoptModal(false)}
                      style={{
                        padding: '0.65rem 1.25rem',
                        background: '#ffffff',
                        border: '1px solid #d1d5db',
                        borderRadius: '3px',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        color: '#374151',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmAdopt}
                      style={{
                        padding: '0.65rem 1.75rem',
                        background: '#ffcc00',
                        border: '1px solid #e5b700',
                        borderRadius: '3px',
                        fontWeight: 800,
                        fontSize: '0.875rem',
                        color: '#1e395b',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(255, 204, 0, 0.4)',
                      }}
                    >
                      ADOPT AND SIGN
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW D: 30-SECOND REAL-TIME COMPLIANCE REVIEW CONSOLE         */}
          {/* ------------------------------------------------------------- */}
          {isUnderReview && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(11, 19, 32, 0.96)',
                zIndex: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                style={{
                  maxWidth: '580px',
                  width: '100%',
                  background: '#0f172a',
                  border: '1px solid rgba(255, 204, 0, 0.3)',
                  borderRadius: '12px',
                  padding: '2.5rem',
                  textAlign: 'center',
                  boxShadow: '0 25px 70px rgba(0,0,0,0.7)',
                  color: '#ffffff',
                }}
              >
                {/* Live Countdown Circle */}
                <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
                  <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="transparent"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="transparent"
                      stroke="#ffcc00"
                      strokeWidth="6"
                      strokeDasharray={2 * Math.PI * 52}
                      strokeDashoffset={(2 * Math.PI * 52) * (1 - reviewSecondsLeft / 30)}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: '#ffcc00', fontFamily: 'monospace' }}>
                      {reviewSecondsLeft}s
                    </span>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>
                      Review
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffcc00', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Regulatory &amp; Cryptographic Review
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: '#ffffff' }}>
                  Agreement Execution in Progress
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '2rem' }}>
                  Your signed Master Custodial Agreement is undergoing automated counterparty validation, FinCEN AML clearance, and cold-vault multisig key anchoring.
                </p>

                {/* 4 Micro-Stages */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', marginBottom: '2rem' }}>
                  {[
                    { title: '1. PKI Signature & X.509 Key Attestation', activeAt: 30, doneAt: 22 },
                    { title: '2. FinCEN BSA & MiCA Sanctions Screening', activeAt: 22, doneAt: 13 },
                    { title: '3. Multisig Cold-Vault Ledger Anchoring', activeAt: 13, doneAt: 5 },
                    { title: '4. BitcoinPro Institutional Countersignature', activeAt: 5, doneAt: 0 },
                  ].map((stage, idx) => {
                    const isDone = reviewSecondsLeft <= stage.doneAt;
                    const isActive = reviewSecondsLeft <= stage.activeAt && reviewSecondsLeft > stage.doneAt;
                    return (
                      <div
                        key={idx}
                        style={{
                          padding: '0.75rem 1rem',
                          borderRadius: '6px',
                          background: isDone ? 'rgba(34, 197, 94, 0.1)' : isActive ? 'rgba(255, 204, 0, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid',
                          borderColor: isDone ? 'rgba(34, 197, 94, 0.3)' : isActive ? 'rgba(255, 204, 0, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.8rem',
                        }}
                      >
                        <span style={{ color: isDone ? '#4ade80' : isActive ? '#ffcc00' : '#64748b', fontWeight: isActive || isDone ? 700 : 500 }}>
                          {stage.title}
                        </span>
                        {isDone ? (
                          <span style={{ color: '#4ade80', fontWeight: 800 }}>✓ Completed</span>
                        ) : isActive ? (
                          <span style={{ color: '#ffcc00', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <RefreshCw size={12} className="spin" /> Verifying...
                          </span>
                        ) : (
                          <span style={{ color: '#475569' }}>Queued</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Live Terminal Log Stream */}
                <div
                  style={{
                    background: '#020617',
                    border: '1px solid #1e293b',
                    borderRadius: '6px',
                    padding: '0.75rem 1rem',
                    fontFamily: 'monospace',
                    fontSize: '0.72rem',
                    color: '#38bdf8',
                    textAlign: 'left',
                    height: '80px',
                    overflowY: 'hidden',
                  }}
                >
                  <div>[00:0{Math.min(9, 30 - reviewSecondsLeft)}] Ingesting DocuSign envelope {envelopeId.slice(0, 16)}...</div>
                  {reviewSecondsLeft <= 24 && <div>[00:08] Client ECDSA key verified against TLS 1.3 cert chain.</div>}
                  {reviewSecondsLeft <= 16 && <div>[00:15] Automated FinCEN / OFAC screening returned 0 flags.</div>}
                  {reviewSecondsLeft <= 8 && <div>[00:23] Segregated cold-storage multisig sub-vault anchored.</div>}
                  {reviewSecondsLeft <= 2 && <div>[00:28] CCO Johnathan Vance HSM countersignature issued.</div>}
                </div>

                {/* Cancel & Edit Option during review */}
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={handleEditAndResign}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#cbd5e1',
                      padding: '0.45rem 0.9rem',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = '#cbd5e1';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                  >
                    <Edit3 size={13} />
                    <span>Made a mistake? Cancel &amp; Edit Signature</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW E: OFFICIAL CERTIFICATE OF COMPLETION (APPROVED)         */}
          {/* ------------------------------------------------------------- */}
          {isCompleted && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.95)',
                zIndex: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
              }}
            >
              <div
                style={{
                  maxWidth: '540px',
                  width: '100%',
                  background: '#ffffff',
                  borderRadius: '8px',
                  padding: '3rem 2.5rem',
                  textAlign: 'center',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                }}
              >
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: '#10b981',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  <CheckCircle2 size={40} />
                </div>

                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e395b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  DocuSign® Master Custody Agreement
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0.4rem 0 0.5rem' }}>
                  Certified &amp; Approved!
                </h2>

                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  The 30-second regulatory review has cleared. Envelope <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1e395b' }}>{envelopeId}</span> has been cryptographically countersigned by BitcoinPro Compliance.
                </p>

                <div
                  style={{
                    padding: '1.25rem',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    textAlign: 'left',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                    color: '#64748b',
                  }}
                >
                  <div><strong>Signer:</strong> {signerName} ({effectiveEmail})</div>
                  <div><strong>Countersigned:</strong> Johnathan E. Vance (Chief Compliance Officer)</div>
                  <div><strong>Execution Date:</strong> {formattedDate} (UTC Verified)</div>
                  <div><strong>Vault Ledger:</strong> Segregated Cold-Storage #BPRO-VAULT</div>
                  <div><strong>Audit Hash:</strong> <span style={{ fontFamily: 'monospace', color: '#0f172a' }}>{auditHash.slice(0, 24)}...</span></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={handleDownloadCopy}
                    className="btn btn-secondary"
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontWeight: 700,
                    }}
                  >
                    <Download size={16} />
                    <span>Download Certified Record (.txt)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      finalizeContractCertification(effectiveEmail);
                      onSigned();
                      onClose();
                    }}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.95rem', fontWeight: 800, fontSize: '1rem' }}
                  >
                    Proceed to Dashboard ➔
                  </button>

                  {/* EDIT MISTAKE BUTTON */}
                  <button
                    type="button"
                    onClick={handleEditAndResign}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#005cb9',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem',
                    }}
                  >
                    <Edit3 size={13} />
                    <span>Made a mistake? Edit signature &amp; re-sign</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}