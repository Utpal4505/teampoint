import { GoogleProvider } from './providers/google.provider.js';
const providerRegistry = {
    GOOGLE: new GoogleProvider(),
};
export function getProvider(provider) {
    const adapter = providerRegistry[provider];
    if (!adapter) {
        throw new Error(`Provider "${provider}" is not registered`);
    }
    return adapter;
}
//# sourceMappingURL=integration.registry.js.map