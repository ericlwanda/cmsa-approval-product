export type Person = {
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  city: string;
  state: string;
  id: number;
};

export const dummyPeople: Person[] = [
  {
    name: {
      firstName: "Zachary",
      lastName: "Davis",
    },
    address: "261 Battle Ford",
    city: "Columbus",
    state: "Ohio",
    id: 0,
  },
  {
    name: {
      firstName: "Robert",
      lastName: "Smith",
    },
    address: "566 Brakus Inlet",
    city: "Westerville",
    state: "West Virginia",
    id: 1,
  },
  {
    name: {
      firstName: "Kevin",
      lastName: "Yan",
    },
    address: "7777 Kuhic Knoll",
    city: "South Linda",
    state: "West Virginia",
    id: 2,
  },
  {
    name: {
      firstName: "John",
      lastName: "Upton",
    },
    address: "722 Emie Stream",
    city: "Huntington",
    state: "Washington",
    id: 3,
  },
  {
    name: {
      firstName: "Nathan",
      lastName: "Harris",
    },
    address: "1 Kuhic Knoll",
    city: "Ohiowa",
    state: "Nebraska",
    id: 4,
  },
];

export type Form = {
  name:string;
  link: string;
  id: number;
};






export const Forms: Form[] = [
  {
    name:"APPLICATION BY A COMPANY FOR AN INVESTMENT ADVISER'S LICENCE (Form 3)",
    link: "https://www.cmsa.go.tz/uploads/publications/en-1575465655-FORM%20NO.%203%20-%20APPLICATION%20BY%20A%20COMPANY%20FOR%20AN%20INVESTMENT%20ADVISERS%20LICENCE.pdf",
    id: 0,
  },
  {
    name:"APPLICATION FOR A REPRESENTATIVE LICENCE (Form 5)",
    link: "https://www.cmsa.go.tz/uploads/publications/en-1575465755-FORM%20NO.%205%20-%20APPLICATION%20BY%20A%20COMPANY%20FOR%20DEALERS%20REPRESENTATIVE.pdf",
    id: 1,
  },
];