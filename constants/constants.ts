export const Year : number = 2025;
export const AT: string = "Cs7SlKYcjtXTJeGskesduTVc44ensMcSSKBMUNsaydPa6GATv1EGH8tiAzUlaV6x";
export const Schema : object = 
{
  auto: {
    input: {
      name: "Team Number",
      type: "number",
      binding: {
        with: 0,
        type: "number",
        uuid: "TEAM_NUMBER"
      }
    },
    $input: {
      name: "How many reef markers placed?",
      type: "text",
      binding: {
        with: 4,
        type: "text",
        uuid: "val4"
      }
    },
    check: {
      name: "Where were they placed?",
      options: {
        "Low Reef": "Low Reef",
        "Mid Reef": "Mid Reef",
        "High Reef": "High Reef"
      }
    },
    dropdown: {
      name: "Which reef zones did they use?",
      type: "multi",
      options: ["Zone A", "Zone B", "Zone C"],
    }
  },

  tele: {
    check: {
      name: "What levels are they scoring on most frequently?",
      options: ["Low Reef", "Mid Reef", "High Reef"]
    },
    increment: "High Reef Points",
    dropdown: {
      name: "Team Strategy Role",
      type: "one",
      options: ["Offense", "Defense", "Support"],
      binding: {
        with: 2,
        uuid: "val3",
        type: "text"
      }
    },
    $dropdown: {
      name: "Which reef zones did they use?",
      type: "multi",
      options: ["Zone A", "Zone B", "Zone C"]
    }
  },

  end: {
    radio: {
      name: "Where did they park?",
      options: {
        "Shoreline": "Shoreline",
        "Coral Cave": "Coral Cave",
        "Did Not Park": "Did Not Park"
      },
      binding: {
        with: 3,
        type: "text",
        uuid: "val1"
      }
    },
    input: {
      name: "Final Notes",
      type: "text",
      binding: {
        with: 1,
        type: "text",
        uuid: "val2"
      }
    },
    dropdown: {
      name: "Team Strategy Role",
      type: "one",
      options: ["Offense", "Defense", "Support"]
    }
  }
};
