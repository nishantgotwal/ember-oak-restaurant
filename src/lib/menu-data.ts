export type Tag = "chef" | "veg" | "vegan" | "gf";
export type Dish = {
  id: string;
  name: string;
  cat: string;
  price: number;
  notes: string;
  allergens: string[];
  tags: Tag[];
  spice: 0 | 1 | 2 | 3;
  crop: number; // index 0-5 into the dishes plate photo
};

export const CATEGORIES = ["Starters", "Signature Mains", "Woodfire Grill", "Artisan Desserts", "Cocktails & Cellar"];

export const DISHES: Dish[] = [
  { id: "s1", name: "Burrata & Heirloom", cat: "Starters", price: 24, notes: "Stracciatella heart, sun-blushed tomato, aged balsamic pearls, basil oil", allergens: ["Dairy"], tags: ["veg", "gf"], spice: 0, crop: 2 },
  { id: "s2", name: "Hokkaido Scallops", cat: "Starters", price: 32, notes: "Brown-butter sear, cauliflower velouté, Oscietra caviar, sorrel", allergens: ["Shellfish", "Dairy"], tags: ["chef", "gf"], spice: 0, crop: 1 },
  { id: "s3", name: "Charred Octopus", cat: "Starters", price: 28, notes: "Smoked paprika, saffron aioli, crisp capers, lemon ash", allergens: ["Mollusc", "Egg"], tags: ["gf"], spice: 2, crop: 4 },
  { id: "m1", name: "Wagyu Tomahawk A5", cat: "Signature Mains", price: 145, notes: "Miyazaki A5, bone-marrow jus, black garlic, fleur de sel", allergens: [], tags: ["chef", "gf"], spice: 0, crop: 0 },
  { id: "m2", name: "Saffron Scallop Risotto", cat: "Signature Mains", price: 48, notes: "Carnaroli, Iranian saffron, 36-month parmigiano, micro herbs", allergens: ["Shellfish", "Dairy"], tags: ["gf"], spice: 0, crop: 1 },
  { id: "m3", name: "Garden Tomato Tarte", cat: "Signature Mains", price: 38, notes: "Cashew cream, confit heirlooms, thyme crumble, basil gel", allergens: ["Nuts"], tags: ["vegan", "veg"], spice: 1, crop: 2 },
  { id: "g1", name: "Ember-Kissed Octopus", cat: "Woodfire Grill", price: 44, notes: "Oak-fire charred, romesco, smoked almonds, chili crisp", allergens: ["Mollusc", "Nuts"], tags: ["gf"], spice: 3, crop: 4 },
  { id: "g2", name: "Dry-Aged Ribeye 45d", cat: "Woodfire Grill", price: 89, notes: "Cherry-wood smoke, chimichurri verde, ember onion", allergens: [], tags: ["gf", "chef"], spice: 1, crop: 0 },
  { id: "d1", name: "Obsidian Chocolate Dome", cat: "Artisan Desserts", price: 22, notes: "Valrhona 70%, salted caramel core, 24k gold leaf", allergens: ["Dairy", "Gluten", "Egg"], tags: ["chef", "veg"], spice: 0, crop: 3 },
  { id: "d2", name: "Smoked Honey Panna Cotta", cat: "Artisan Desserts", price: 18, notes: "Coconut, woodfire honey, bee pollen, charred peach", allergens: [], tags: ["vegan", "gf"], spice: 0, crop: 3 },
  { id: "c1", name: "Ember Old Fashioned", cat: "Cocktails & Cellar", price: 24, notes: "Smoked bourbon, demerara, orange oils, oak-smoked ice", allergens: [], tags: ["vegan", "gf", "chef"], spice: 0, crop: 5 },
  { id: "c2", name: "Barolo Riserva 2016", cat: "Cocktails & Cellar", price: 38, notes: "Glass · tar & roses, dried cherry, firm silky tannins", allergens: ["Sulphites"], tags: ["vegan", "gf"], spice: 0, crop: 5 },
];

export const cropStyle = (i: number, src: string) => ({
  backgroundImage: `url(${src})`,
  backgroundSize: "300% 200%",
  backgroundPosition: `${(i % 3) * 50}% ${Math.floor(i / 3) * 100}%`,
});
