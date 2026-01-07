export const PRODUCT_CATEGORIES = [
  "Brød",
  "Morgenbrød",
  "Wienerbrød",
  "Konditor",
  "Mejeri",
  "Cafe",
  "Sæsonkager og andet",
  "Specialiteter",
  "Glutenfri fryser",
  "Festkager",
  "Kørsel",
];

export function isValidProductCategory(category) {
  return PRODUCT_CATEGORIES.includes(category);
}


export const PRODUCTION_CATEGORIES = [
  "Bager",
  "Konditor",
  "Andet",
];

export function isValidProductionCategory(category) {
  return PRODUCTION_CATEGORIES.includes(category);
}