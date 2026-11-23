// True when the invite runs inside an iframe, such as the phone frame shown on big screens.
export const IN_FRAME = typeof window !== 'undefined' && window.self !== window.top
