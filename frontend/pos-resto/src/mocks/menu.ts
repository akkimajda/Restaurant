import type { Product } from '../types';

export const CATEGORIES = [
  { id: 'all',   name: 'All items' },
  { id: 'dessert', name: 'Dessert' },
  { id: 'bateau',  name: 'Bateau' },
  { id: 'salad',   name: 'Salad' },
  { id: 'bento',   name: 'Bento' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'miso',
    name: 'Soupe Miso',
    price: 45,
    categoryId: 'salad', // adapte à ta catégorie
    image: '/img/menu/miso.jpg', // ou `https://picsum.photos/seed/miso/600/400`
    description: 'Bouillon dashi, tofu, algues.'
  },
  {
    id: 'panda',
    name: 'Salade Panda',
    price: 80,
    categoryId: 'salad',
    image: '/img/menu/salade-panda.jpg',
    description: 'Saumon, avocat, concombre, sauce sésame.'
  },

    
  {
    id: 'pepperoni',
    name: 'Pizza Pepperoni',
    price: 85,
    categoryId: 'pizza',
    image: '/img/menu/pepperoni.jpg',
    description: 'Tomate, mozzarella, pepperoni.'
  },
  {
    id: 'cheeseburger',
    name: 'Cheeseburger',
    price: 65,
    categoryId: 'burger',
    image: '/img/menu/cheeseburger.jpg',
    description: 'Pain brioché, steak, fromage cheddar, salade.'
  },
  {
    id: 'double-bacon',
    name: 'Double Bacon Burger',
    price: 90,
    categoryId: 'burger',
    image: '/img/menu/double-bacon.jpg',
    description: 'Double steak, bacon grillé, fromage fondant.'
  },
  {
    id: 'carbonara',
    name: 'Pâtes Carbonara',
    price: 75,
    categoryId: 'pasta',
    image: '/img/menu/carbonara.jpg',
    description: 'Spaghetti, lardons, crème, parmesan.'
  },
  {
    id: 'bolognaise',
    name: 'Pâtes Bolognaise',
    price: 70,
    categoryId: 'pasta',
    image: '/img/menu/bolognaise.jpg',
    description: 'Spaghetti, sauce tomate, viande hachée.'
  },
  {
    id: 'cola',
    name: 'Coca-Cola',
    price: 15,
    categoryId: 'drink',
    image: '/img/menu/coca.jpg',
    description: 'Boisson gazeuse rafraîchissante 33cl.'
  },
  {
    id: 'orange-juice',
    name: 'Jus d’orange frais',
    price: 20,
    categoryId: 'drink',
    image: '/img/menu/orange.jpg',
    description: 'Jus pressé 100% pur jus.'
  },
  {
    id: 'tiramisu',
    name: 'Tiramisu maison',
    price: 35,
    categoryId: 'dessert',
    image: '/img/menu/tiramisu.jpg',
    description: 'Café, mascarpone, cacao.'
  },
  {
    id: 'fondant-chocolat',
    name: 'Fondant au chocolat',
    price: 40,
    categoryId: 'dessert',
    image: '/img/menu/fondant.jpg',
    description: 'Cœur coulant au chocolat noir.'
  },
  
];
