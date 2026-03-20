import Constants from "expo-constants";

const prod = false;
const local = true;

export const Year : number = 2026;
const extra = Constants.expoConfig?.extra ?? {};

export const AT = extra.TBA?.toString().replace(",", "") || "Cs7SlKYcjtXTJeGskesduTVc44ensMcSSKBMUNsaydPa6GATv1EGH8tiAzUlaV6x";
export const DB_URL = prod ? extra.PROD?.toString().replace(",", "") || "https://saragarhi-api-database.sarthak22-ghoshal.workers.dev" : !local ? extra.TEST?.toString().replace(",", "") || "https://saragarhi-api-database-test.sarthak22-ghoshal.workers.dev" : "http://localhost:8787";

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
        type: "multi",
        uuid: "val2"
      }
    },
    image: {
      name: "Ref for Above",
      url: "https://raw.githubusercontent.com/websitedeb/imagehoster/main/Show.png",
      scale: {
        widthScale: 0.8,
        heightScale: 0.5
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
        type: "multi",
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
        type: "multi",
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
        type: "multi",
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
        type: "multi",
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
        type: "multi",
        uuid: "val8"
      }
    },
    $$radio: {
      name: "Do they climb?",
      options: {
        "None": "None",
        "T1": "T1",
        "T2": "T2",
        "T3": "T3"
      },
      binding: {
        with: 9,
        type: "multi",
        uuid: "val9"
      }
    }
  },
  end: {
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
    type: "MultiBento"
  },
  Three: {
    name: "Where does the robot go in auto?",
    type: "MultiBento"
  },
  Four: {
    name: "Do they use the human player?",
    type: "MultiBento"
  },
  Five: {
    name: "Did they climb in auto?",
    type: "MultiBento"
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
    type: "MultiBento"
  },
  Eight: {
    name: "Do they play defense?",
    type: "MultiBento"
  },
  Nine: {
    name: "Do they climb in teleop?",
    type: "MultiBento"
  },
  FinalNotes: {
    type: "$FinalNotes"
  }
};
