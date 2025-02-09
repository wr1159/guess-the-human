import { defineConfig } from "@wagmi/cli";
import { foundry } from "@wagmi/cli/plugins";

export default defineConfig({
    out: "src/generated.ts",
    contracts: [],
    plugins: [
        foundry({
            project: "../contracts",
            deployments: {
                GuessTheHuman: {
                    31337: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
                    97: "0x6d601b3a60ec0a08e61dc7084c7edaa457e77476",
                    22040: "0xFA789846c14e8c0e1182879c20a3d640E90c732C",
                },
            },
        }),
    ],
});
