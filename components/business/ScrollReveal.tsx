"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    distance?: string;
    duration?: number;
    once?: boolean;
}

export default function ScrollReveal({
    children,
    className = "",
    delay = 0,
    direction = "up",
    distance = "20px",
    duration = 700,
    once = true,
}: ScrollRevealProps) {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once && elementRef.current) {
                        observer.unobserve(elementRef.current);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px",
            }
        );

        const currentRef = elementRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [once]);

    const getTransform = () => {
        if (direction === "none") return "none";
        if (!isVisible) {
            switch (direction) {
                case "up": return `translateY(${distance})`;
                case "down": return `translateY(-${distance})`;
                case "left": return `translateX(${distance})`;
                case "right": return `translateX(-${distance})`;
                default: return `translateY(${distance})`;
            }
        }
        return "translate(0, 0)";
    };

    const styles = {
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "transform, opacity",
    };

    return (
        <div
            ref={elementRef}
            style={styles}
            className={`motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${className}`}
        >
            {children}
        </div>
    );
}
