import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  { name: 'Wireless Bluetooth Headphones', description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and plush memory foam ear cushions for all-day comfort.', price: 79.99, stock: 150, category: 'Electronics', image: 'https://picsum.photos/seed/prod1/400/300' },
  { name: 'Organic Cotton T-Shirt', description: 'Soft and breathable crew-neck tee made from 100% certified organic cotton. Available in multiple colors.', price: 24.99, stock: 300, category: 'Clothing', image: 'https://picsum.photos/seed/prod2/400/300' },
  { name: 'Stainless Steel Water Bottle', description: 'Double-wall vacuum insulated bottle keeps drinks cold for 24 hours or hot for 12. BPA-free, 750ml capacity.', price: 19.99, stock: 500, category: 'Sports', image: 'https://picsum.photos/seed/prod3/400/300' },
  { name: 'Mechanical Gaming Keyboard', description: 'RGB backlit mechanical keyboard with Cherry MX switches, programmable macros, and aircraft-grade aluminum frame.', price: 129.99, stock: 85, category: 'Electronics', image: 'https://picsum.photos/seed/prod4/400/300' },
  { name: 'Yoga Mat Pro', description: 'Extra-thick 6mm non-slip yoga mat with alignment lines. Eco-friendly TPE material, includes carrying strap.', price: 34.99, stock: 200, category: 'Sports', image: 'https://picsum.photos/seed/prod5/400/300' },
  { name: 'Leather Messenger Bag', description: 'Handcrafted genuine leather messenger bag with padded laptop compartment, brass hardware, and adjustable strap.', price: 89.99, stock: 60, category: 'Accessories', image: 'https://picsum.photos/seed/prod6/400/300' },
  { name: 'Smart LED Desk Lamp', description: 'Touch-controlled desk lamp with 5 brightness levels, 3 color temperatures, USB charging port, and flexible gooseneck design.', price: 42.99, stock: 175, category: 'Home', image: 'https://picsum.photos/seed/prod7/400/300' },
  { name: 'French Press Coffee Maker', description: 'Borosilicate glass French press with stainless steel plunger and double mesh filter. Makes 8 cups of rich, full-bodied coffee.', price: 27.99, stock: 220, category: 'Kitchen', image: 'https://picsum.photos/seed/prod8/400/300' },
  { name: 'Running Shoes UltraFlex', description: 'Lightweight running shoes with responsive cushioning, breathable mesh upper, and durable rubber outsole.', price: 119.99, stock: 110, category: 'Sports', image: 'https://picsum.photos/seed/prod9/400/300' },
  { name: 'Wireless Charging Pad', description: 'Slim Qi-compatible wireless charger with LED indicator, 15W fast charge, and anti-slip silicone surface.', price: 18.99, stock: 400, category: 'Electronics', image: 'https://picsum.photos/seed/prod10/400/300' },
  { name: 'Bamboo Cutting Board Set', description: 'Set of 3 premium bamboo cutting boards in different sizes. Naturally antimicrobial with juice grooves and easy-grip handles.', price: 29.99, stock: 180, category: 'Kitchen', image: 'https://picsum.photos/seed/prod11/400/300' },
  { name: 'Minimalist Analog Watch', description: 'Elegant timepiece with Japanese quartz movement, sapphire crystal glass, and genuine Italian leather strap.', price: 149.99, stock: 45, category: 'Accessories', image: 'https://picsum.photos/seed/prod12/400/300' },
  { name: 'Portable Bluetooth Speaker', description: 'Waterproof IPX7 portable speaker with 360-degree sound, 20-hour playtime, and built-in microphone for calls.', price: 49.99, stock: 250, category: 'Electronics', image: 'https://picsum.photos/seed/prod13/400/300' },
  { name: 'Scented Soy Candle Collection', description: 'Set of 4 hand-poured soy candles in calming fragrances: lavender, vanilla, sandalwood, and eucalyptus. 45-hour burn each.', price: 36.99, stock: 160, category: 'Home', image: 'https://picsum.photos/seed/prod14/400/300' },
  { name: 'Denim Jacket Classic Fit', description: 'Timeless medium-wash denim jacket with button closure, chest pockets, and comfortable stretch fabric.', price: 64.99, stock: 90, category: 'Clothing', image: 'https://picsum.photos/seed/prod15/400/300' },
  { name: 'Cast Iron Skillet 12-inch', description: 'Pre-seasoned cast iron skillet perfect for searing, baking, and frying. Oven-safe to 500°F with helper handle.', price: 39.99, stock: 130, category: 'Kitchen', image: 'https://picsum.photos/seed/prod16/400/300' },
  { name: 'Noise-Cancelling Earbuds', description: 'True wireless earbuds with hybrid ANC, transparency mode, 8-hour battery, and ergonomic fit for workouts.', price: 99.99, stock: 195, category: 'Electronics', image: 'https://picsum.photos/seed/prod17/400/300' },
  { name: 'Linen Throw Blanket', description: 'Breathable stonewashed linen throw in a neutral palette. Perfect for layering on sofas and beds. 150x200cm.', price: 54.99, stock: 75, category: 'Home', image: 'https://picsum.photos/seed/prod18/400/300' },
  { name: 'UV Protection Sunglasses', description: 'Polarized sunglasses with UV400 protection, lightweight titanium frame, and scratch-resistant lenses.', price: 44.99, stock: 210, category: 'Accessories', image: 'https://picsum.photos/seed/prod19/400/300' },
  { name: 'Resistance Bands Set', description: 'Set of 5 latex-free resistance bands with varying strengths, door anchor, ankle straps, and mesh carry bag.', price: 22.99, stock: 350, category: 'Sports', image: 'https://picsum.photos/seed/prod20/400/300' },
];

async function main() {
  const count = await prisma.product.count();
  if (count > 0) {
    console.log(`Database already has ${count} products, skipping seed.`);
    return;
  }

  console.log('Seeding 20 products...');
  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
