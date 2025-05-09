'use client';
import { createContext, useState } from "react";

interface NavigationContextType {
    isMobileNavOpen: boolean;
    setIsMobileNavOpen: (open: boolean) => void;
    closeMobileNav: () => void;
    toggleMobileNav: () => void;
}

export const NavigationContext= createContext<NavigationContextType>({
    isMobileNavOpen:false,
    setIsMobileNavOpen: () => {},
    closeMobileNav: () => {},
    toggleMobileNav: () => {},
});


export function NavigationProvider({children,}:{children: React.ReactNode}) {
    const [isMobileNavOpen,setIsMobileNavOpen] = useState(false);

    const closeMobileNav = () => setIsMobileNavOpen(false);
    const toggleMobileNav = () => setIsMobileNavOpen(!isMobileNavOpen);
    return (
    <NavigationContext value={{isMobileNavOpen,setIsMobileNavOpen,closeMobileNav,toggleMobileNav}}>
        {children}
    </NavigationContext>
)
}