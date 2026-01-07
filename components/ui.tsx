
import React, { useState, useEffect, useMemo } from 'react';

interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

// --- Advanced Typewriter Component ---
// Parses text with {bp}...{/bp} and {w}...{/w} tags and types it out preserving styles
interface TextSegment {
    text: string;
    className?: string;
}

export const AdvancedTypewriter: React.FC<{ 
    text: string; 
    speed?: number; 
    onComplete?: () => void; 
    className?: string;
}> = ({ text, speed = 45, onComplete, className }) => {
    const [charIndex, setCharIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    // 1. Parse the input string into segments (Plain vs Formatted)
    const segments: TextSegment[] = useMemo(() => {
        // Split by tags. 
        const parts = text.split(/(\{bp\}.*?\{\/bp\}|\{w\}.*?\{\/w\}|\{i\}.*?\{\/i\}|\{c\}.*?\{\/c\})/g);
        
        return parts.map(part => {
            if (part.startsWith('{bp}')) {
                return { 
                    text: part.replace(/\{bp\}|\{\/bp\}/g, ''), 
                    className: "font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-purple-400 drop-shadow-[0_0_2px_rgba(192,38,211,0.5)]" 
                };
            }
            if (part.startsWith('{w}')) {
                return { 
                    text: part.replace(/\{w\}|\{\/w\}/g, ''), 
                    className: "font-bold text-white drop-shadow-sm" 
                };
            }
            if (part.startsWith('{i}')) {
                return { 
                    text: part.replace(/\{i\}|\{\/i\}/g, ''), 
                    className: "italic text-gray-300" 
                };
            }
            if (part.startsWith('{c}')) {
                return { 
                    text: part.replace(/\{c\}|\{\/c\}/g, ''), 
                    className: "text-[#C7DE95]" 
                };
            }
            return { text: part, className: "" };
        });
    }, [text]);

    // Calculate total displayable characters (excluding tags)
    const totalLength = useMemo(() => segments.reduce((acc, seg) => acc + seg.text.length, 0), [segments]);

    useEffect(() => {
        // Reset if text changes
        setCharIndex(0);
        setIsComplete(false);
    }, [text]);

    useEffect(() => {
        if (charIndex >= totalLength) {
            if (!isComplete) {
                setIsComplete(true);
                if (onComplete) onComplete();
            }
            return;
        }

        const timer = setInterval(() => {
            setCharIndex(prev => prev + 1);
        }, speed);

        return () => clearInterval(timer);
    }, [charIndex, totalLength, speed, onComplete, isComplete]);

    // 2. Render logic: Reconstruct content based on current charIndex
    const renderContent = () => {
        let charsRemaining = charIndex;
        const output = [];

        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            
            if (charsRemaining <= 0) break; // No more chars to show

            if (charsRemaining >= segment.text.length) {
                // Show full segment
                output.push(
                    <span key={i} className={segment.className}>{segment.text}</span>
                );
                charsRemaining -= segment.text.length;
            } else {
                // Show partial segment
                output.push(
                    <span key={i} className={segment.className}>{segment.text.slice(0, charsRemaining)}</span>
                );
                charsRemaining = 0;
            }
        }
        return output;
    };

    return (
        <div className={`${className} whitespace-pre-wrap`}>
            {renderContent()}
        </div>
    );
};

export const renderFormattedText = (text: string): React.ReactNode => {
    if (!text) return null;
    
    // 중첩 태그 지원을 위해 정규식으로 태그 블록들을 분리합니다.
    const parts = text.split(/(\{w\}.*?\{\/w\}|\{g\}.*?\{\/g\}|\{r\}.*?\{\/r\}|\{y\}.*?\{\/y\}|\{i\}.*?\{\/i\}|\{bp\}.*?\{\/bp\}|\{fp\}.*?\{\/fp\}|\{bpx\}.*?\{\/bpx\}|\{fpx\}.*?\{\/fpx\}|\{p\}.*?\{\/p\}|\{j\}.*?\{\/j\}|\{t\}.*?\{\/t\}|\{sb\}.*?\{\/sb\}|\{c\}.*?\{\/c\}|\{b\}.*?\{\/b\}|\{kp\}.*?\{\/kp\}|\{rx\}.*?\{\/rx\}|\{wn\}.*?\{\/wn\}|1\.25x)/g);
    
    return parts.map((part, i) => {
        if (!part) return null;

        const getContent = (p: string, openTag: string, closeTag: string) => 
            p.substring(openTag.length, p.length - closeTag.length);

        // {w}태그: 흰색 볼드 (Kaarn / General Emphasis)
        if (part.startsWith('{w}')) return <span key={i} className="text-white font-bold">{renderFormattedText(getContent(part, '{w}', '{/w}'))}</span>;
        // {wn}태그: 흰색 일반 (Kaarn Normal)
        if (part.startsWith('{wn}')) return <span key={i} className="text-white">{renderFormattedText(getContent(part, '{wn}', '{/wn}'))}</span>;
        // {g}태그: 초록색 볼드 (Purth)
        if (part.startsWith('{g}')) return <span key={i} className="text-green-400 font-bold">{renderFormattedText(getContent(part, '{g}', '{/g}'))}</span>;
        // {r}태그: 빨간색 볼드 (Xuth)
        if (part.startsWith('{r}')) return <span key={i} className="text-red-400 font-bold">{renderFormattedText(getContent(part, '{r}', '{/r}'))}</span>;
        // {rx}태그: 빨간색 일반 (Xuth Normal)
        if (part.startsWith('{rx}')) return <span key={i} className="text-red-400">{renderFormattedText(getContent(part, '{rx}', '{/rx}'))}</span>;
        // {y}태그: 노란색 볼드 (Lekolu)
        if (part.startsWith('{y}')) return <span key={i} className="text-yellow-400 font-bold">{renderFormattedText(getContent(part, '{y}', '{/y}'))}</span>;
        // {fp}태그: 초록색 볼드 (g와 동일)
        if (part.startsWith('{fp}')) return <span key={i} className="text-green-400 font-bold">{renderFormattedText(getContent(part, '{fp}', '{/fp}'))}</span>;
        // {fpx}태그: 초록색 일반
        if (part.startsWith('{fpx}')) return <span key={i} className="text-green-400">{renderFormattedText(getContent(part, '{fpx}', '{/fpx}'))}</span>;
        // {i}태그: 이탈릭체
        if (part.startsWith('{i}')) return <span key={i} className="italic">{renderFormattedText(getContent(part, '{i}', '{/i}'))}</span>;
        // {bp}태그: 보라색 계열 그라데이션 (Sinthru / BP Cost)
        if (part.startsWith('{bp}')) return <span key={i} className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-purple-400 drop-shadow-[0_0_2px_rgba(192,38,211,0.5)]">{renderFormattedText(getContent(part, '{bp}', '{/bp}'))}</span>;
        // {bpx}태그: 보라색 일반
        if (part.startsWith('{bpx}')) return <span key={i} className="text-purple-400">{renderFormattedText(getContent(part, '{bpx}', '{/bpx}'))}</span>;
        // {p}태그: 연두색
        if (part.startsWith('{p}')) return <span key={i} className="text-[#C7DE95]">{renderFormattedText(getContent(part, '{p}', '{/p}'))}</span>;
        // {j}태그: Juathas 골드 그라데이션
        if (part.startsWith('{j}')) return <span key={i} className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-500 drop-shadow-[0_0_2px_rgba(245,158,11,0.5)]">{renderFormattedText(getContent(part, '{j}', '{/j}'))}</span>;
        // {t}태그: 투명도 30% (Broken Daughter 등)
        if (part.startsWith('{t}')) return <span key={i} className="opacity-30">{renderFormattedText(getContent(part, '{t}', '{/t}'))}</span>;
        // {sb}태그: 하늘색 볼드 (KP - Old / Sky)
        if (part.startsWith('{sb}')) return <span key={i} className="text-sky-400 font-bold">{renderFormattedText(getContent(part, '{sb}', '{/sb}'))}</span>;
        // {c}태그: 연두색/라임색 (Quote emphasis) - Matched to Typewriter
        if (part.startsWith('{c}')) return <span key={i} className="text-[#C7DE95]">{renderFormattedText(getContent(part, '{c}', '{/c}'))}</span>;
        // {b}태그: 파란색 볼드 (Milgrath)
        if (part.startsWith('{b}')) return <span key={i} className="text-blue-500 font-bold">{renderFormattedText(getContent(part, '{b}', '{/b}'))}</span>;
        // {kp}태그: 핑크색 볼드 (Kuri-Odan Points)
        if (part.startsWith('{kp}')) return <span key={i} className="text-pink-400 font-bold">{renderFormattedText(getContent(part, '{kp}', '{/kp}'))}</span>;
        
        // 1.25x 특수 텍스트
        if (part === '1.25x') return <span key={i} className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-purple-400 drop-shadow-[0_0_2px_rgba(192,38,211,0.5)]">{part}</span>;
        
        return part;
    });
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({ children, className = '' }) => (
  <h2 className={`text-3xl font-cinzel text-center tracking-[0.2em] my-12 text-white uppercase ${className}`}>
    {children}
  </h2>
);

interface SectionSubHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionSubHeader: React.FC<SectionSubHeaderProps> = ({ children, className }) => (
   <p className={`text-center italic max-w-3xl mx-auto text-sm my-8 ${className || 'text-gray-400'}`}>
    {children}
  </p>
);

interface BlessingIntroProps {
  title: string;
  imageSrc: string;
  description: string;
  reverse?: boolean;
}

export const BlessingIntro: React.FC<BlessingIntroProps> = ({ title, imageSrc, description, reverse = false }) => {
  const renderDescription = () => {
    // Special handling for Fidelia to add gradient fade effect
    if (title.includes("FIDELIA") || title.includes("피델리아")) {
        const targetEn = "ncxvqmeuywitpdrrinbojkgt.";
        const targetKo = "ㄹㅊㅋㅍㅌㅂ고뎌ㅛ지세으ㅜㅠㅐㅓㅏ햘ㄴㅁ";
        const target = description.includes(targetEn) ? targetEn : targetKo;
        const splitIndex = description.lastIndexOf(target);
        
        if (splitIndex !== -1) {
            const before = description.substring(0, splitIndex);
            
            return (
                <p>
                    {renderFormattedText(before)}
                    <span className="bg-gradient-to-r from-gray-400 to-transparent text-transparent bg-clip-text decoration-clone">
                        {target}
                    </span>
                </p>
            );
        }
    }
    return <p>{renderFormattedText(description)}</p>;
  };

  // Determine aspect ratio based on title content
  const isBlessing = title.toUpperCase().startsWith("THE BLESSING OF") || title.includes("축복");
  const aspectRatioClass = isBlessing ? "aspect-[3/2]" : "aspect-square";

  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center justify-center gap-12 my-8 max-w-7xl mx-auto p-6 bg-black/20 border border-gray-800 rounded-lg`}>
        <div className="flex-shrink-0 w-full md:w-1/3">
            <img src={imageSrc} alt={title} className={`rounded-lg shadow-lg w-full object-cover ${aspectRatioClass}`} />
        </div>
        <div className="w-full md:w-2/3 text-gray-300 text-sm space-y-4 whitespace-pre-wrap">
            <h3 className="font-cinzel text-3xl text-center text-white mb-4">{title}</h3>
            {renderDescription()}
        </div>
    </div>
  );
};

export const BoostedEffectBox: React.FC<{ text: string }> = ({ text }) => (
    <div className="mt-3 text-left bg-purple-900/20 border-l-2 border-purple-500 p-3 rounded-r-md border-t border-b border-r border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)]">
        <div className="flex items-center gap-2 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]"></div>
            <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest font-mono">Boosted</span>
        </div>
        <p className="text-xs text-purple-100/80 leading-relaxed pl-3.5 border-l border-purple-500/10">{text}</p>
    </div>
);

export const WeaponIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 .5a1 1 0 01.993.883L11 1.5v12.25l4.636 1.545a1 1 0 01.815 1.14l-.06.115a1 1 0 01-1.14.815l-.115-.06L11 16.25v2.25a1 1 0 01-1.993.117L9 18.5v-2.25l-4.272 1.424a1 1 0 01-1.14-.815l-.06-.115a1 1 0 01.815-1.14l.115-.06L8 13.75V1.5A1 1 0 0110 .5zM10 4.5a1 1 0 00-1 1v2a1 1 0 002 0v-2a1 1 0 00-1-1z" />
    </svg>
);

export const CompanionIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

export const VehicleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18.316 6.383c.25.344.31.787.163 1.189l-1.55 4.135a1.5 1.5 0 01-1.429 1.043H4.5a1.5 1.5 0 01-1.429-1.043L1.52 7.572a1.5 1.5 0 01.163-1.189A1.5 1.5 0 013 6h14a1.5 1.5 0 011.316.383zM4.341 14a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm11.318 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" clipRule="evenodd" />
    </svg>
);

export const HouseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 011 1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
);

export const BookIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
    </svg>
);
