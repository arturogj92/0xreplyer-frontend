'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { User, Info, Globe, Lock } from 'lucide-react';
import Image from 'next/image';
import { LandingPreview } from './LandingPreview';

export default function LandingWizard() {
  const t = useTranslations('landing');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [slug, setSlug] = useState('');
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'free' | 'taken'>('idle');
  const slugRegex = /^[a-z0-9-]{0,30}$/;

  const checkSlugAvailability = async (value: string) => {
    if (!value) {
      setSlugStatus('idle');
      return;
    }
    setSlugStatus('checking');
    try {
      // Endpoint de comprobación de disponibilidad (aún no implementado en backend)
      const res = await fetch(`/api/landings/slug-exists?slug=${value}`);
      const data = await res.json();
      setSlugStatus(data.available ? 'free' : 'taken');
    } catch (_) {
      // Si falla la llamada, asumimos que está libre para no bloquear al usuario
      setSlugStatus('free');
    }
  };

  const generateSlug = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 30);

  // Debounce para la comprobación
  useEffect(() => {
    const handler = setTimeout(() => {
      if (slugRegex.test(slug)) {
        checkSlugAvailability(slug);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [slug]);

  const handleSave = async () => {
    if (!name.trim() || !slug.trim() || slugStatus !== 'free') return;
    setSaving(true);
    try {
      const payload = { name, description: description.trim(), slug };
      await fetch('/api/landings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      // TODO: replace with router push when editor exists
      alert('Landing creada, ahora redirigiríamos al editor');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Introcentrado encima de columnas */}
      <div className="w-full max-w-3xl mx-auto mb-6 text-xs sm:text-sm text-gray-400">
        <p className="flex items-start gap-1.5 px-3 sm:px-4 whitespace-normal">
          <Info className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <span className="flex-1 text-left break-words">{t('introExplanation')}</span>
        </p>
      </div>

      {/* Pasos visuales centrados bajo la intro */}
      <div className="flex items-center justify-center gap-0.5 sm:gap-1 md:gap-2 mb-6 pb-6 w-full max-w-3xl px-3 sm:px-4">
        {[
          t('stepConfigure'),
          t('stepLinks'),
          t('stepSocial'),
          t('stepStats')
        ].map((label, idx, arr) => (
          <React.Fragment key={`step-${idx}`}>
            <div className="flex flex-col items-center w-1/5">
              <div className="bg-[#1c1033] rounded-xl w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 p-1 sm:p-1.5 md:p-2 relative">
                <Image
                  src={`/images/icons/landing-generator-icon-flow-${idx + 1}.png`}
                  alt={label}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="mt-0.5 text-[9px] sm:text-[10px] md:text-xs text-gray-200 font-medium text-center leading-tight w-full">
                {label}
              </span>
            </div>
            {idx < arr.length - 1 && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-yellow-400 animate-pulse mx-1 md:mx-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-[1fr_auto] md:gap-10 items-center w-full">
        {/* Columna izquierda */}
        <div className="flex flex-col items-center md:items-start mx-auto md:mx-0">
          <div className="max-w-lg mb-4 w-full px-4 sm:px-0">
          <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <User className="w-4 h-4 text-gray-400" /> {t('titleLabel')}
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value.slice(0, 50))}
              placeholder={t('namePlaceholder')}
              className="w-full max-w-lg bg-transparent text-white placeholder:text-muted-foreground hover:bg-[#1c1033]/80 focus:bg-[#1c1033] rounded-md px-4 py-1.5 focus:outline-none border border-slate-600/50 focus:border-indigo-500"
          />
          <p className="text-xs text-muted-foreground mt-1">{t('nameHelper')}</p>
        </div>
          <div className="max-w-lg mb-4 w-full px-4 sm:px-0">
          <label className="block text-sm font-medium mb-1 flex items-center gap-1">
            <Info className="w-4 h-4 text-gray-400" />
            {t('descriptionLabel')}
            <span className="text-xs text-muted-foreground">({description.length}/50)</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value.slice(0, 50))}
              placeholder={t('descriptionPlaceholder')}
              className="w-full max-w-lg h-9 bg-transparent text-white placeholder:text-muted-foreground hover:bg-[#1c1033]/80 focus:bg-[#1c1033] rounded-md px-4 py-1 focus:outline-none border border-slate-600/50 focus:border-indigo-500 resize-none overflow-hidden"
          />
          <p className="text-xs text-muted-foreground mt-1">{t('descriptionHelper')}</p>
        </div>
          <div className="max-w-lg mb-4 w-full px-4 sm:px-0">
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <Globe className="w-4 h-4 text-gray-400" /> {t('slugLabel')}
            </label>
            <input
              type="text"
              value={slug}
              onChange={e => {
                const raw = e.target.value.toLowerCase();
                if (slugRegex.test(raw)) setSlug(raw);
              }}
              placeholder={t('slugPlaceholder')}
              className="w-full max-w-lg bg-transparent text-white placeholder:text-muted-foreground hover:bg-[#1c1033]/80 focus:bg-[#1c1033] rounded-md px-4 py-1.5 focus:outline-none border border-slate-600/50 focus:border-indigo-500"
            />
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
              {t('slugPreview')} <span className="font-mono text-white">{slug || t('slugPlaceholder')}.creator0x.com</span>
            </p>
            {slug && (
              <p className={`text-xs mt-1 ${slugStatus === 'taken' ? 'text-red-500' : 'text-green-500'}`}>
                {slugStatus === 'checking' && '...'}
                {slugStatus === 'free' && t('slugFree')}
                {slugStatus === 'taken' && t('slugTaken')}
              </p>
            )}
          </div>
        </div>

        {/* Columna derecha: preview (solo md+) */}
        <div className="flex flex-col items-center gap-2 justify-center">
          <LandingPreview name={name} description={description} />
          <div className="inline-flex items-center gap-1 bg-slate-800/90 px-3 py-1.5 rounded-full shadow-inner w-[280px] md:w-[180px] lg:w-[230px]">
            <Lock className="h-3 w-3 text-green-400" />
            <span className="text-xs font-medium text-slate-400">https://</span>
            <span className="text-xs font-medium text-slate-50 truncate overflow-hidden">
              {(slug || t('slugPlaceholder'))}.creator0x.com
            </span>
          </div>
        </div>
      </div>
      {/* Botón Continue centrado debajo del grid */}
      <div className="flex justify-center mt-6 pb-6">
        <button
          onClick={handleSave}
          disabled={!name.trim() || !slug.trim() || slugStatus !== 'free' || saving}
          className="px-5 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? '...' : t('continue')}
        </button>
      </div>
    </div>
  );
} 