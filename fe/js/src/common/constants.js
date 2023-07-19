// Currency related constants
export const CURRENCIES = {
  EUR: "€",
  USD: "$",
  CHF: ".-",
  GBP: "£",
};

// ------ //

// Time related constants

export const MONTHS_FROM_MS = 30 * 24 * 60 * 60 * 1000;
export const MONTHS_TIMESPAN_NW = {
  "3M": 3,
  "6M": 6,
  "1Y": 12,
  MAX: 1000,
};
export const MONTHS_TIMESPAN = {
  "1M": 1,
  "3M": 3,
  "6M": 6,
  "1Y": 12,
  MAX: 1000,
};
export const MONTHS_CARDINALITY = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  Dicember: 11,
};
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "Dicember",
];

// ------ //

// Categories constants
export const EXPENSE_CATEGORIES = {
  "Bank & Broker": ["Commissions", "Stamps", "Other"],
  Charity: ["Donations", "Non-profit Contributions", "Other"],
  Education: ["Courses", "Books", "Supplies", "Tuition", "Workshops", "Other"],
  Entertainment: ["Concerts", "Events", "Hobbies", "Movies", "Other"],
  Food: [
    "Bars",
    "Cafeteria",
    "Delivery",
    "Dining Out",
    "Groceries",
    "Snacks",
    "Work Lunches",
    "Other",
  ],
  Gifts: ["Birthdays", "Holidays", "Random", "Special Occasions", "Other"],
  Health: [
    "Doctor Visits",
    "Health Insurance",
    "Medications",
    "Surgery",
    "Other",
  ],
  Housing: [
    "Furniture",
    "Home Repairs",
    "Insurance",
    "Mortgage",
    "Moving",
    "Rent",
    "Taxes",
    "Utilities",
    "Other",
  ],
  Insurance: ["Disability Insurance", "Life Insurance", "Other"],
  Kids: ["Childcare", "School Expenses", "Toys", "Other"],
  Pets: ["Pet Food", "Pet Supplies", "Veterinary Care", "Other"],
  Personal: ["Clothing", "Electronics", "Personal Care", "Other"],
  Sport: [
    "Football",
    "Gym equipment",
    "Gym food&supplements",
    "Gym Memberships",
    "Padel",
    "Other",
  ],
  Subscriptions: ["Magazines", "Phone", "Streaming Services", "Other"],
  Taxes: ["Income Tax", "Property Tax", "Other"],
  Technology: ["Domains", "Hosting", "Software", "Other"],
  Transportation: [
    "Car Insurance",
    "Car Payment",
    "Fuel",
    "Maintenance",
    "Parking",
    "Public Transports",
    "Taxi",
    "Tolls",
    "Taxes",
    "Other",
  ],
  Travel: [
    "Activities",
    "Car Rentals",
    "Flights",
    "Food&Drink",
    "Hotels",
    "Museums",
    "Souvenirs",
    "Trains",
    "Other",
  ],
  Work: ["Professional Dues", "Work-related Expenses", "Other"],
  Miscellaneous: ["Unexpected Expenses", "Other"],
};
export const INCOME_CATEGORIES = {
  Award: ["Fellowships", "Other"],
  Business: [
    "Consulting",
    "Freelancing",
    "Partnership Income",
    "Royalties",
    "Other",
  ],
  Gifts: ["Birthday", "Random", "Special Occasions", "Other"],
  Investment: ["Coupon", "Dividends", "Stock Options", "Other"],
  Rental: [
    "Airbnb",
    "Real Estate",
    "Other",
  ],
  Salary: ["Base Pay", "Bonus", "Relocation", "Other"],
  Savings: ["Savings Interest", "Other"],
  "Unemployment Benefits": ["State Benefits", "Federal Benefits", "Other"],
  Miscellaneous: ["Other", "Unexpected Income"],
};
export const ASSET_CATEGORIES = [
  "Bonds",
  "Business Ownership",
  "Cash",
  "Collectibles",
  "Commodities",
  "Cryptos",
  "Foreign Currencies",
  "Precious Metals",
  "Real Estate",
  "Retirement Accounts",
  "Savings Account",
  "Stocks",
  "Other",
];