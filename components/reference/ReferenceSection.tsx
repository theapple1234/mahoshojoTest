
import React from 'react';

interface ReferenceSectionProps { 
    title: string; 
    subTitle?: string; 
    children: React.ReactNode; 
}

export const ReferenceSection: React.FC<ReferenceSectionProps> = ({ title, subTitle, children }) => (
    <section className="mb-12">
        <h3 className="font-cinzel text-2xl text-cyan-200 tracking-widest border-b border-cyan-700/50 pb-2 mb-4">{title}</h3>
        {subTitle && <p className="text-gray-400 italic text-sm mb-6">{subTitle}</p>}
        {children}
    </section>
);
