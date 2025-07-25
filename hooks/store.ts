import { create } from "zustand";

export const useShowStore = create((set) => {
    return {
        show: false,
        setShow: (show: boolean) => set({ show }),
    };
});