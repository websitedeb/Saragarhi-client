import Constants from "expo-constants";

const prod = true;

export const Year : number = 2026;
const extra = Constants.expoConfig?.extra ?? {};

export const AT = extra.TBA?.toString().replace(",", "") || "Cs7SlKYcjtXTJeGskesduTVc44ensMcSSKBMUNsaydPa6GATv1EGH8tiAzUlaV6x";
export const DB_URL = prod ? extra.PROD?.toString().replace(",", "") || "https://saragarhi-api-database.sarthak22-ghoshal.workers.dev" : extra.TEST?.toString().replace(",", "") || "http://127.0.0.1:8787"; //https://saragarhi-api-database-test.sarthak22-ghoshal.workers.dev

export const FormSchema : object = 
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
    $radio: {
      name: "Pre-filled with Fuel?",
      options: {
        "Yes": "Yes",
        "No": "No"
      },
      binding: {
        with: 1,
        type: "text",
        uuid: "val1"
      }
    },
    radio: {
      name: "Moved?",
      options: {
        "Yes": "Yes",
        "No": "No"
      },
      binding: {
        with: 2,
        type: "text",
        uuid: "val2"
      }
    },
    check: {
      name: "Where does it go to collect more Fuel?",
      options: {"Outpost" : "Outpost", "Center" : "Center", "Depot" : "Depot", "None" : "None"},
      binding: {
        with: 3,
        type: "text",
        uuid: "val3"
      }
    },
    $$$radio: {
      name: "Human Player Threw Ball?",
      options: {
        "Yes": "Yes",
        "No": "No"
      },
      binding: {
        with: 4,
        type: "text",
        uuid: "val4"
      }
    },
    $$radio: {
      name: "Robot Climb T1?",
      options: {
        "Yes": "Yes",
        "No": "No"
      },
      binding: {
        with: 5,
        type: "text",
        uuid: "val5"
      }
    },
  },

  tele: {
    increment: {
      name: "Fuel Scored",
      binding: {
        with: 6,
        type: "avg",
        uuid: "val6"
      }
    },
    check: {
      name: "What did it use to go into the neutral zone?",
      options: {"Bumps" : "Bumps", "Trench" : "Trench" },
      binding: {
        with: 7,
        type: "text",
        uuid: "val7"
      }
    },
    radio: {
      name: "Can bot play defense?",
      options: {
        "Yes" : "Yes",
        "No" : "No"
      },
      binding: {
        with: 8,
        type: "text",
        uuid: "val8"
      }
    }
  },

  end: {
    dropdown: {
      name: "Which Tier does the robot climb too?",
      type: "one",
      options: ["None", "T1", "T2", "T3"],
      binding: {
        with: 9,
        type: "text",
        uuid: "val9"
      }
    },
    check: {
      name: "What ranking points did they get?",
      options: {"Energized" : "Energized", "SuperCharged" : "SuperCharged", "Traversal" : "Traversal", "None":"None"},
      binding:{
        with: 10,
        type: "text",
        uuid: "val10"
      }
    },
    input: {
      name: "Final Notes",
      type: "text",
      binding: {
        with: 1,
        type: "text",
        uuid: "FINAL_NOTES"
      }
    }
  }
};

export const DisplaySchema: Object = {
  One: {
    name: "Pre-filled with Fuel?",
    type: "Ratio",
    addons: {
      left: "Pre-filled with Fuel?",
      right: "$data"
    }
  },
  Two: {
    name: "Moved?",
    type: "line"
  },
  Three: {
    name: "Where does it go to collect more Fuel?",
    type: "line"
  },
  Four: {
    name: "Human Player Threw Ball?",
    type: "line"
  },
  Five: {
    name: "Robot Climb T1?",
    type: "line"
  },
  Six: {
    name: "Fuel Scored",
    type: "Bento"
  },
  Seven: {
    name: "Used to go into the neutral zone?",
    type: "line"
  },
  Eight: {
    name: "Defense?",
    type: "line"
  },
  Nine: {
    name: "Robot Climbed Tier",
    type: "line"
  },
  Ten: {
    name: "Ranking Points?",
    type: "line"
  },
  FinalNotes: {
    type: "$FinalNotes"
  }
};
