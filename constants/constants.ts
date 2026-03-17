import Constants from "expo-constants";

const prod = false;

export const Year : number = 2026;
const extra = Constants.expoConfig?.extra ?? {};

export const AT = extra.TBA?.toString().replace(",", "") || "Cs7SlKYcjtXTJeGskesduTVc44ensMcSSKBMUNsaydPa6GATv1EGH8tiAzUlaV6x";
export const DB_URL = prod ? extra.PROD?.toString().replace(",", "") || "https://saragarhi-api-database.sarthak22-ghoshal.workers.dev" : extra.TEST?.toString().replace(",", "") || "https://saragarhi-api-database-test.sarthak22-ghoshal.workers.dev";

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
    dropdown: {
      name: "Starting Position",
      type: "one",
      options: [
        "Blue 1",
        "Blue 2",
        "Blue 3",
        "Red 1",
        "Red 2",
        "Red 3"
      ],
      binding: {
        with: 2,
        type: "text",
        uuid: "val2"
      }
    },
    check: {
      name: "Where do they travel?",
      options: {
        "Neutral Zone": "Neutral Zone",
        "Depot": "Depot",
        "Outpost": "Outpost"
      },
      binding: {
        with: 3,
        type: "text",
        uuid: "val3"
      }
    },
    slider: {
      name: "How many fuel did they score? (10 fuel intervals)",
      min: 0,
      max: 360,
      step: 10,
      binding: {
        with: 10,
        type: "avg",
        uuid: "val6"
      }
    },
    $radio: {
      name: "Do they use the human player?",
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
      name: "Did they climb?",
      options: {
        "Yes": "Yes",
        "No": "No"
      },
      binding: {
        with: 5,
        type: "text",
        uuid: "val5"
      }
    }
  },
  
  tele: {
    slider: {
      name: "How many fuel did they score? (10 fuel intervals)",
      min: 0,
      max: 360,
      step: 10,
      binding: {
        with: 6,
        type: "avg",
        uuid: "val6"
      }
    },
    radio: {
      name: "Do they pass?",
      options: {
        "Passing, but not full field": "Passing, but not full field",
        "Full Field Passing": "Full Field Passing",
        "No Passing": "No Passing"
      },
      binding: { 
        with: 7,
        type: "text",
        uuid: "val7"
      }
    },
    $radio: {
      name: "Do they play defense?",
      options: {
        "Yes": "Yes",
        "No": "No"
      },
      binding: {
        with: 8,
        type: "text",
        uuid: "val8"
      }
    },
  },
  end: {
    radio: {
      name: "Do they climb?",
      options: {
        "None": "None",
        "T1": "T1",
        "T2": "T2",
        "T3": "T3"
      },
      binding: {
        with: 9,
        type: "text",
        uuid: "val9"
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
  Two: {
    name: "Starting Position",
    type: "Bento"
  },
  Three: {
    name: "Where does the robot go in auto?",
    type: "line"
  },
  Four: {
    name: "Do they use the human player?",
    type: "Ratio",
    addons: {
      left: "Do they use the human player?",
      right: "$data"
    }
  },
  Five: {
    name: "Did they climb in auto?",
    type: "line"
  },
  Ten: {
    name: "How many fuel did they score in auto?",
    type: "Bento"
  },
  Six: {
    name: "Fuel scored in teleop?",
    type: "Bento"
  },
  Seven: {
    name: "Do they pass?",
    type: "line"
  },
  Eight: {
    name: "Do they play defense?",
    type: "Bento"
  },
  Nine: {
    name: "Do they climb in teleop?",
    type: "Bento"
  },
  FinalNotes: {
    type: "$FinalNotes"
  }
};
