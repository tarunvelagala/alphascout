export interface EnvConfig {
    account: string;
    region: string;
}

// Map of environments
export const envMap: Record<string, EnvConfig> = {
    dev: { account: '714036130996', region: 'ap-south-1' },
};
