// Ambient module declarations for optional Sanity plugins that may not have types installed
declare module '@sanity/vision';
declare module 'sanity-plugin-media';

// Sanity core modules (treat as any for typecheck without installing actual packages)
declare module 'sanity';
declare module 'sanity/structure';