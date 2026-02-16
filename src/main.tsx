import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from "react-helmet-async";
import App from './App.tsx'
import { convex } from "./lib/convexClient";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ShopProvider } from "./context/ShopContext";
import './index.css'
/* Manrope */
import "@fontsource/manrope/400.css"
import "@fontsource/manrope/700.css"

/* Comfortaa */
import "@fontsource/comfortaa/400.css"
import "@fontsource/comfortaa/700.css"

/* Buenard */
import "@fontsource/buenard/400.css"

/* Unna */
import "@fontsource/unna/400.css"
import "@fontsource/unna/700.css"


/* Inter */
import "@fontsource/inter/400.css"

/* ADLaM Display */
import "@fontsource/adlam-display/400.css"

/* Cambay */
import "@fontsource/cambay/400.css"
import "@fontsource/cambay/700.css"

/* Poppins */
import "@fontsource/poppins/400.css"
import "@fontsource/poppins/600.css"
import "@fontsource/poppins/700.css"

/* Bree Serif */
import "@fontsource/bree-serif/400.css"


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/" signInUrl="/login" signUpUrl="/signup">
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ShopProvider>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </ShopProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>,
)
