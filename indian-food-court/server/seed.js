const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const FoodItem = require('./models/FoodItem');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/indian_food_court';

const vendorData = {
  name: 'Test Vendor',
  email: 'vendor@test.com',
  password: '123456',
  phone: '+91 98765 43210',
  role: 'vendor',
};

const customerData = {
  name: 'Test Customer',
  email: 'customer@test.com',
  password: '123456',
  phone: '+91 99999 00000',
  role: 'customer',
};

const adminData = {
  name: 'Admin',
  email: 'admin@test.com',
  password: '123456',
  phone: '+91 88888 77777',
  role: 'admin',
};

const deliveryData = {
  name: 'Ravi Delivery',
  email: 'delivery@test.com',
  password: '123456',
  phone: '+91 77777 66666',
  role: 'delivery',
};

const restaurants = [
  {
    name: 'Hyderabadi Biryani House',
    description: 'Authentic Hyderabadi biryanis slow-cooked in Dum style with aromatic spices and saffron.',
    cuisine: ['Biryani', 'Mughlai', 'Hyderabadi'],
    address: { street: '12, Nampally Road', city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
    phone: '+91 98765 10001',
    openingTime: '11:00',
    closingTime: '23:00',
    averageDeliveryTime: 35,
    rating: 4.5,
    totalReviews: 342,
    items: [
      { name: 'Hyderabadi Chicken Biryani', description: 'Fragrant basmati rice layered with marinated chicken, slow-cooked with saffron and spices', price: 250, category: 'Biryani', isVeg: false, isBestseller: true, preparationTime: 25, tags: ['biryani', 'chicken', 'hyderabadi'] },
      { name: 'Mutton Biryani', description: 'Tender mutton pieces cooked with aromatic rice in dum style', price: 320, category: 'Biryani', isVeg: false, isBestseller: true, preparationTime: 30, tags: ['biryani', 'mutton'] },
      { name: 'Veg Biryani', description: 'Garden fresh vegetables cooked with fragrant basmati rice', price: 180, category: 'Biryani', isVeg: true, preparationTime: 20, tags: ['biryani', 'veg'] },
      { name: 'Double Ka Meetha', description: 'Traditional Hyderabadi bread pudding with saffron and dry fruits', price: 80, category: 'Desserts', isVeg: true, tags: ['dessert', 'hyderabadi'] },
      { name: 'Mirchi Ka Salan', description: 'Spicy chili curry served as an accompaniment to biryani', price: 60, category: 'Curry', isVeg: true, tags: ['curry', 'spicy'] },
      { name: 'Chicken 65', description: 'Deep-fried spicy chicken starter with curry leaves', price: 180, category: 'Starters', isVeg: false, preparationTime: 15, tags: ['starter', 'chicken', 'spicy'] },
      { name: 'Raita', description: 'Cool yogurt raita with onions and fresh herbs', price: 40, category: 'Starters', isVeg: true, tags: ['yogurt', 'side'] },
      { name: 'Phirni', description: 'Creamy rice pudding flavored with cardamom and rose water', price: 70, category: 'Desserts', isVeg: true, tags: ['dessert'] },
    ],
  },
  {
    name: 'Rajasthani Thali Kitchen',
    description: 'Experience the royal flavors of Rajasthan with our authentic thalis and traditional dishes.',
    cuisine: ['Rajasthani', 'North Indian', 'Thali'],
    address: { street: '45, Hawa Mahal Road', city: 'Jaipur', state: 'Rajasthan', pincode: '302002' },
    phone: '+91 98765 10002',
    openingTime: '10:00',
    closingTime: '22:30',
    averageDeliveryTime: 30,
    rating: 4.3,
    totalReviews: 218,
    items: [
      { name: 'Rajasthani Thali', description: 'Complete Rajasthani meal with Dal Bati Churma, Gatte, Ker Sangri, Papad, Churma', price: 280, category: 'Thali', isVeg: true, isBestseller: true, preparationTime: 20, tags: ['thali', 'rajasthani'] },
      { name: 'Dal Bati Churma', description: 'Baked wheat balls with lentil curry and sweet crumbled wheat', price: 180, category: 'Main Course', isVeg: true, isBestseller: true, preparationTime: 15, tags: ['rajasthani', 'dal'] },
      { name: 'Laal Maas', description: 'Fiery red meat curry with Mathania red chilies', price: 280, category: 'Curry', isVeg: false, preparationTime: 20, tags: ['curry', 'spicy', 'mutton'] },
      { name: 'Gatte Ki Sabzi', description: 'Gram flour dumplings in spiced yogurt gravy', price: 140, category: 'Curry', isVeg: true, tags: ['curry', 'rajasthani'] },
      { name: 'Pyaaz Kachori', description: 'Flaky deep-fried pastry stuffed with spiced onion filling', price: 80, category: 'Snacks', isVeg: true, preparationTime: 10, tags: ['snack', 'rajasthani'] },
      { name: 'Ker Sangri', description: 'Traditional desert beans and berries curry', price: 120, category: 'Main Course', isVeg: true, tags: ['rajasthani', 'veg'] },
      { name: 'Malpua', description: 'Sweet deep-fried pancake soaked in sugar syrup', price: 60, category: 'Desserts', isVeg: true, tags: ['dessert', 'sweet'] },
    ],
  },
  {
    name: 'Madras Café',
    description: 'South Indian specialties served fresh. From crispy dosas to fluffy idlis, taste the flavors of Chennai.',
    cuisine: ['South Indian', 'Dosa', 'Idli'],
    address: { street: '78, T. Nagar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600017' },
    phone: '+91 98765 10003',
    openingTime: '07:00',
    closingTime: '22:00',
    averageDeliveryTime: 20,
    rating: 4.6,
    totalReviews: 456,
    items: [
      { name: 'Masala Dosa', description: 'Crispy rice crepe filled with spiced potato masala, served with sambar and chutney', price: 100, category: 'South Indian', isVeg: true, isBestseller: true, preparationTime: 10, tags: ['dosa', 'south indian'] },
      { name: 'Mysore Masala Dosa', description: 'Dosa with spicy Mysore chutney and potato filling', price: 120, category: 'South Indian', isVeg: true, preparationTime: 12, tags: ['dosa'] },
      { name: 'Idli Sambar', description: 'Soft steamed rice cakes with hot sambar and coconut chutney', price: 60, category: 'South Indian', isVeg: true, isBestseller: true, tags: ['idli', 'south indian'] },
      { name: 'Rava Uttapam', description: 'Thick semolina pancake topped with onions, tomatoes, and green chilies', price: 90, category: 'South Indian', isVeg: true, preparationTime: 10, tags: ['uttapam'] },
      { name: 'Medu Vada', description: 'Crispy deep-fried lentil donuts served with sambar and chutney', price: 50, category: 'Snacks', isVeg: true, tags: ['vada', 'south indian'] },
      { name: 'Filter Coffee', description: 'Traditional South Indian filter coffee brewed with fresh ground coffee', price: 30, category: 'Beverages', isVeg: true, isBestseller: true, tags: ['coffee', 'south indian'] },
      { name: 'Onion Uttapam', description: 'Fluffy rice pancake loaded with fresh onions and tomatoes', price: 80, category: 'South Indian', isVeg: true, preparationTime: 10, tags: ['uttapam'] },
      { name: 'Chicken Chettinad', description: 'Spicy chicken curry from the Chettinad region', price: 200, category: 'Curry', isVeg: false, preparationTime: 20, tags: ['chicken', 'spicy'] },
    ],
  },
  {
    name: 'Mumbai Street Food',
    description: 'Bring home the iconic flavors of Mumbai\'s vibrant street food scene.',
    cuisine: ['Street Food', 'Snacks', 'Mumbai'],
    address: { street: '23, Mohammed Ali Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400003' },
    phone: '+91 98765 10004',
    openingTime: '10:00',
    closingTime: '00:00',
    averageDeliveryTime: 25,
    rating: 4.4,
    totalReviews: 567,
    items: [
      { name: 'Vada Pav', description: 'Mumbai\'s iconic spiced potato fritter in a soft bun with green chutney', price: 30, category: 'Street Food', isVeg: true, isBestseller: true, preparationTime: 5, tags: ['vada pav', 'mumbai', 'street food'] },
      { name: 'Pav Bhaji', description: 'Mashed spiced vegetable curry served with butter-toasted buns', price: 100, category: 'Street Food', isVeg: true, isBestseller: true, preparationTime: 10, tags: ['pav bhaji', 'mumbai'] },
      { name: 'Bhel Puri', description: 'Puffed rice snack with tangy chutneys, onions, and sev', price: 60, category: 'Snacks', isVeg: true, tags: ['bhel', 'street food'] },
      { name: 'Sev Puri', description: 'Crispy puris topped with potatoes, chutneys, and crunchy sev', price: 50, category: 'Snacks', isVeg: true, tags: ['sev puri', 'street food'] },
      { name: 'Dabeli', description: 'Spiced potato filling in a bun with sweet chutney and peanuts', price: 40, category: 'Street Food', isVeg: true, tags: ['dabeli'] },
      { name: 'Misal Pav', description: 'Spicy sprouted moth bean curry topped with farsan and onions', price: 80, category: 'Street Food', isVeg: true, preparationTime: 10, tags: ['misal', 'maharashtra'] },
      { name: 'Chicken Shawarma Roll', description: 'Grilled chicken wrapped in rumali roti with garlic sauce', price: 120, category: 'Street Food', isVeg: false, preparationTime: 10, tags: ['shawarma', 'chicken'] },
      { name: 'Sol Kadhi', description: 'Refreshing kokum and coconut milk drink from the Konkan coast', price: 40, category: 'Beverages', isVeg: true, tags: ['drink', 'konkan'] },
    ],
  },
  {
    name: 'Punjabi Dhaba',
    description: 'Rustic Punjabi flavors straight from the heartland. Rich curries, fresh breads, and hearty meals.',
    cuisine: ['North Indian', 'Punjabi', 'Curry'],
    address: { street: '56, Connaught Place', city: 'Delhi', state: 'Delhi', pincode: '110001' },
    phone: '+91 98765 10005',
    openingTime: '11:00',
    closingTime: '23:30',
    averageDeliveryTime: 30,
    rating: 4.2,
    totalReviews: 389,
    items: [
      { name: 'Butter Chicken', description: 'Tender chicken in rich, creamy tomato-butter sauce', price: 240, category: 'Curry', isVeg: false, isBestseller: true, preparationTime: 15, tags: ['butter chicken', 'punjabi'] },
      { name: 'Dal Makhani', description: 'Slow-cooked black lentils in creamy butter and cream', price: 160, category: 'Main Course', isVeg: true, isBestseller: true, preparationTime: 10, tags: ['dal', 'punjabi'] },
      { name: 'Paneer Tikka Masala', description: 'Grilled cottage cheese cubes in spiced tomato gravy', price: 180, category: 'Curry', isVeg: true, preparationTime: 15, tags: ['paneer'] },
      { name: 'Chole Bhature', description: 'Spiced chickpea curry with fluffy deep-fried bread', price: 120, category: 'Main Course', isVeg: true, preparationTime: 10, tags: ['chole', 'punjabi'] },
      { name: 'Tandoori Roti', description: 'Whole wheat bread baked in clay tandoor', price: 20, category: 'Breads', isVeg: true, tags: ['bread', 'tandoor'] },
      { name: 'Butter Naan', description: 'Soft refined flour bread brushed with butter', price: 35, category: 'Breads', isVeg: true, tags: ['naan'] },
      { name: 'Amritsari Fish', description: 'Crispy fried marinated fish fillets with tangy chutney', price: 220, category: 'Starters', isVeg: false, preparationTime: 15, tags: ['fish', 'punjabi'] },
      { name: 'Rogan Josh', description: 'Aromatic Kashmiri-style lamb curry with whole spices', price: 280, category: 'Curry', isVeg: false, preparationTime: 20, tags: ['mutton', 'kashmiri'] },
    ],
  },
  {
    name: 'Sweets & Desserts',
    description: 'India\'s finest traditional sweets and desserts made with pure ghee and love.',
    cuisine: ['Desserts', 'Sweets', 'Mithai'],
    address: { street: '89, Chandni Chowk', city: 'Delhi', state: 'Delhi', pincode: '110006' },
    phone: '+91 98765 10006',
    openingTime: '09:00',
    closingTime: '23:00',
    averageDeliveryTime: 20,
    rating: 4.7,
    totalReviews: 623,
    items: [
      { name: 'Gulab Jamun', description: 'Soft milk-solid dumplings soaked in rose-flavored sugar syrup', price: 60, category: 'Desserts', isVeg: true, isBestseller: true, tags: ['gulab jamun', 'sweet'] },
      { name: 'Jalebi', description: 'Crispy spirals of fermented batter deep-fried and dipped in saffron syrup', price: 50, category: 'Desserts', isVeg: true, isBestseller: true, tags: ['jalebi', 'sweet'] },
      { name: 'Rasgulla', description: 'Spongy cheese balls in light sugar syrup', price: 50, category: 'Desserts', isVeg: true, tags: ['rasgulla', 'bengali'] },
      { name: 'Rasmalai', description: 'Soft cheese patties in saffron-flavored thickened milk', price: 80, category: 'Desserts', isVeg: true, isBestseller: true, tags: ['rasmalai'] },
      { name: 'Kulfi Falooda', description: 'Traditional Indian ice cream with rose vermicelli and basil seeds', price: 90, category: 'Desserts', isVeg: true, tags: ['kulfi', 'falooda'] },
      { name: 'Rabri Jalebi', description: 'Crispy jalebi served with thick sweetened milk', price: 100, category: 'Desserts', isVeg: true, tags: ['jalebi', 'rabri'] },
      { name: 'Kheer', description: 'Creamy slow-cooked rice pudding with cardamom and almonds', price: 70, category: 'Desserts', isVeg: true, tags: ['kheer', 'pudding'] },
    ],
  },
  {
    name: 'Chai Point',
    description: 'Your daily dose of perfect chai. From masala chai to cutting chai, we brew it right.',
    cuisine: ['Beverages', 'Snacks', 'Chai'],
    address: { street: '12, MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
    phone: '+91 98765 10007',
    openingTime: '06:00',
    closingTime: '22:00',
    averageDeliveryTime: 15,
    rating: 4.1,
    totalReviews: 289,
    items: [
      { name: 'Masala Chai', description: 'Classic Indian tea brewed with ginger, cardamom, and fresh milk', price: 25, category: 'Beverages', isVeg: true, isBestseller: true, tags: ['chai', 'masala'] },
      { name: 'Ginger Chai', description: 'Strong tea with fresh ginger for a spicy kick', price: 25, category: 'Beverages', isVeg: true, tags: ['chai', 'ginger'] },
      { name: 'Cutting Chai', description: 'Half glass of strong, sweet Bombay-style chai', price: 15, category: 'Beverages', isVeg: true, isBestseller: true, tags: ['cutting chai', 'mumbai'] },
      { name: 'Samosa', description: 'Crispy pastry filled with spiced potatoes and peas', price: 30, category: 'Snacks', isVeg: true, isBestseller: true, tags: ['samosa', 'snack'] },
      { name: 'Bun Maska', description: 'Soft bun toasted with butter and served with chai', price: 40, category: 'Snacks', isVeg: true, tags: ['bun', 'maska'] },
      { name: 'Biscuit Chai Combo', description: 'Classic chai served with Parle-G biscuits', price: 20, category: 'Combos', isVeg: true, tags: ['combo', 'biscuit'] },
      { name: 'Kulhad Chai', description: 'Special chai served in an earthen cup for an authentic taste', price: 35, category: 'Beverages', isVeg: true, tags: ['kulhad', 'chai'] },
      { name: 'Samosa Plate (4 pcs)', description: 'Four crispy samosas with tamarind and mint chutneys', price: 100, category: 'Combos', isVeg: true, tags: ['combo', 'samosa'] },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Restaurant.deleteMany({}),
      FoodItem.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create users
    const vendor = await User.create(vendorData);
    const customer = await User.create(customerData);
    const admin = await User.create(adminData);
    const delivery = await User.create(deliveryData);
    console.log('Created users: vendor@test.com, customer@test.com, admin@test.com, delivery@test.com');

    // Create restaurants and food items
    for (const restData of restaurants) {
      const { items, ...restFields } = restData;
      const restaurant = await Restaurant.create({
        ...restFields,
        owner: vendor._id,
        isOpen: true,
        isActive: true,
      });

      const foodItems = items.map(item => ({
        ...item,
        restaurant: restaurant._id,
        isAvailable: true,
        rating: item.isBestseller ? (4 + Math.random()).toFixed(1) * 1 : (3.5 + Math.random() * 1.5).toFixed(1) * 1,
      }));

      await FoodItem.insertMany(foodItems);
      console.log(`  Created "${restaurant.name}" with ${items.length} items`);
    }

    console.log('\nSeed completed successfully!');
    console.log('Login credentials:');
    console.log('  Vendor:  vendor@test.com / 123456');
    console.log('  Customer: customer@test.com / 123456');
    console.log('  Admin:   admin@test.com / 123456');
    console.log('  Delivery: delivery@test.com / 123456');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
