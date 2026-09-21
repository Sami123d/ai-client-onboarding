import React from 'react';
import type { ServiceType } from '../types';
import { getAllServices } from '../data';
import './ServiceSelector.css';

interface ServiceSelectorProps {
    onSelectService: (serviceType: ServiceType) => void;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ onSelectService }) => {
    const services = getAllServices();
    const cardRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        const card = cardRefs.current[index];
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
    };

    const handleMouseLeave = (index: number) => {
        const card = cardRefs.current[index];
        if (card) {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)`;
        }
    };

    // Themed UI configurations for each service card
    const serviceConfigs: Record<ServiceType, { icon: string; tag: string; color: string }> = {
        website: {
            icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968267.png', // Or high-end placeholder
            tag: 'DIGITAL EXPERIENCE',
            color: 'var(--color-primary)'
        },
        branding: {
            icon: 'https://cdn-icons-png.flaticon.com/512/3596/3596091.png',
            tag: 'IDENTITY DESIGN',
            color: 'var(--color-accent)'
        },
        automation: {
            icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
            tag: 'INTELLIGENT SYSTEMS',
            color: 'hsl(170, 80%, 45%)'
        },
    };

    const serviceDescriptions: Record<ServiceType, string> = {
        website: 'Engineering high-performance digital platforms that convert attention into sustainable growth.',
        branding: 'Crafting resonant visual narratives that define market leaders and build lasting human connections.',
        automation: 'Architecting intelligent workflows that eliminate friction and scale your operations autonomously.',
    };

    return (
        <div className="service-selector fade-in">
            <div className="service-selector-header">
                <div className="ai-badge">DISCOVERY ENGINE v2.0</div>
                <h1 className="text-gradient">Welcome to Your Project Onboarding</h1>
                <p>Select the strategic track that aligns with your vision to begin our high-end discovery process.</p>
            </div>

            <div className="service-grid">
                {services.map((service, index) => (
                    <button
                        key={service.type}
                        ref={el => { cardRefs.current[index] = el; }}
                        className="service-card glass-card"
                        onClick={() => onSelectService(service.type)}
                        onMouseMove={(e) => handleMouseMove(e, index)}
                        onMouseLeave={() => handleMouseLeave(index)}
                    >
                        <div className="card-glimmer"></div>
                        <span className="card-tag">{serviceConfigs[service.type].tag}</span>
                        <div className="service-icon-container">
                            <span className="service-icon-emoji">
                                {service.type === 'website' ? '🌐' : service.type === 'branding' ? '💎' : '🤖'}
                            </span>
                        </div>
                        <h3>{service.name}</h3>
                        <p>{serviceDescriptions[service.type]}</p>
                        <div className="service-card-footer">
                            <span className="action-text">INITIALIZE TRACK</span>
                            <div className="service-arrow">→</div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="service-selector-footer">
                <p className="help-text">
                    Indecisive? Our <strong>AI Strategist</strong> will adapt the flow based on your initial responses.
                </p>
            </div>
        </div>
    );
};

export default ServiceSelector;
