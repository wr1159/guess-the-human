import { defineChain } from "@reown/appkit/networks";

export const airDaoTestnet = defineChain({
    id: 22040,
    caipNetworkId: "eip155:22040",
    chainNamespace: "eip155",
    name: "AirDAO Testnet",
    nativeCurrency: {
        decimals: 18,
        name: "AirDao",
        symbol: "AMB",
    },
    rpcUrls: {
        default: {
            http: ["https://network.ambrosus-test.io"],
        },
    },
    blockExplorers: {
        default: {
            name: "AirDao Explorer",
            url: "https://airdao.io/explorer/",
        },
    },
    contracts: {
        // Add the contracts here
    },
});
