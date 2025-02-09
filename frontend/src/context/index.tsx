// context/index.tsx
"use client";

import { wagmiAdapter, projectId } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, anvil, bscTestnet } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { airDaoTestnet } from "@/config/other-networks";

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
    throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
    name: "guess-the-human",
    description: "AppKit Example",
    url: "https://reown.com/appkit", // origin must match your domain & subdomain
    icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

// Create the modal
const modal = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    themeVariables: {
        "--w3m-accent": "#571D00",
    },
    networks: [anvil, bscTestnet, airDaoTestnet],
    defaultNetwork: mainnet,
    metadata: metadata,
    features: {
        analytics: true, // Optional - defaults to your Cloud configuration
    },
});

function ContextProvider({
    children,
    cookies,
}: {
    children: ReactNode;
    cookies: string | null;
}) {
    const initialState = cookieToInitialState(
        wagmiAdapter.wagmiConfig as Config,
        cookies
    );

    return (
        <WagmiProvider
            config={wagmiAdapter.wagmiConfig as Config}
            initialState={initialState}
        >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export default ContextProvider;
