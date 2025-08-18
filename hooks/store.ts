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

export const useScoutData = create((set) => ({
  scoutData: {},
  setScoutData: (scoutData: Record<string, any>) => set({ scoutData })
}));

//NumberOfDataSets, TeamNumber
export type DataSetsType = {
  NumberOfDataSets: number,
  TeamNumber: number,
  One: Array<String | number | boolean>;
  Two?: Array<String | number | boolean>;
  Three?: Array<String | number | boolean>;
  Four?: Array<String | number | boolean>;
  Five?: Array<String | number | boolean>;
  Six?: Array<String | number | boolean>;
  Seven?: Array<String | number | boolean>;
  Eight?: Array<String | number | boolean>;
  Nine?: Array<String | number | boolean>;
  Ten?: Array<String | number | boolean>;
};

export const useDataSetStore = create<{ DataSets: DataSetsType }>((set) => ({
  DataSets: {
    NumberOfDataSets: 1,
    TeamNumber: 0,
    One: ["", ""]
  },
  setDataSets: (DataSets: DataSetsType) => set({ DataSets })
}))