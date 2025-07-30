import { create } from "zustand";

export const useShowStore = create((set) => {
    return {
        show: false,
        setShow: (show: boolean) => set({ show }),
    };
});

type TickedTeamStore = {
  teamsSelected: number[];
  updateTeamsSelected: (teamId: number) => void;
};

export const useTickedTeam = create<TickedTeamStore>((set) => ({
  teamsSelected: [],
  updateTeamsSelected: (teamId) =>
    set((state) => {
      const isSelected = state.teamsSelected.includes(teamId);
      return {
        teamsSelected: isSelected
          ? state.teamsSelected.filter((id) => id !== teamId)
          : [teamId, ...state.teamsSelected],
      };
    }),
}));

export const useEvent = create<{
  event: string;
  setEvent: (event: string) => void;
}>((set) => ({
  event: "",
  setEvent: (event: string) => set({ event }),
}));
