// config/index.tsx

import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { anvil, bscTestnet } from "@reown/appkit/networks";
import { airDaoTestnet } from "./other-networks";

// Get projectId from https://cloud.reown.com
export const projectId = "fd7e0e7472fe5af36ce2dcc5b0bbc58a";

if (!projectId) {
    throw new Error("Project ID is not defined");
}

export const networks = [airDaoTestnet, anvil, bscTestnet];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage,
    }),
    ssr: true,
    projectId,
    networks,
});

export const config = wagmiAdapter.wagmiConfig;
