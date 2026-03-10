export default function useAgent() {
    const isMobile = typeof window !== 'undefined' && /iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/i.test(navigator.userAgent);
    console.log("Is Mobile:", isMobile, navigator.userAgent);
    return isMobile;
}