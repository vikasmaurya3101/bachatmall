import { PrismaClient, Prisma } from "@prisma/client";

type ProductSeed = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  brand: string;
  sku: string;
  hsn: string;
  gst: number;
  mrp: number;
  sellingPrice: number;
  costPrice: number;
  stock: number;
  minOrderQty: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  thumbnail: string;
  images: string[];
  tags: string[];
};

const products: ProductSeed[] = [

  {
    name: "Apple iPhone 15 128GB Blue",
    slug: "apple-iphone-15-128gb-blue",
    shortDescription: "Latest Apple iPhone 15 with Dynamic Island.",
    description:
      "Apple iPhone 15 featuring A16 Bionic chip, Super Retina XDR display, USB-C charging, excellent cameras and premium build quality.",
    category: "Mobiles",
    brand: "Apple",
    sku: "APL-IP15-BLU-128",
    hsn: "85171300",
    gst: 18,
    mrp: 79900,
    sellingPrice: 72999,
    costPrice: 68800,
    stock: 50,
    minOrderQty: 1,
    weight: 0.35,
    length: 18,
    width: 10,
    height: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569",
      "https://images.unsplash.com/photo-1695635632165-9a9d2f6f89da",
      "https://images.unsplash.com/photo-1695635632222-b9a915d4ef95"
    ],
    tags: [
      "iphone",
      "apple",
      "mobile",
      "ios",
      "smartphone"
    ]
  },

  {
    name: "Samsung Galaxy S24 256GB",
    slug: "samsung-galaxy-s24-256gb",
    shortDescription: "Premium Samsung flagship smartphone.",
    description:
      "Galaxy S24 with Snapdragon processor, Dynamic AMOLED display, AI features and premium cameras.",
    category: "Mobiles",
    brand: "Samsung",
    sku: "SAM-S24-256",
    hsn: "85171300",
    gst: 18,
    mrp: 79999,
    sellingPrice: 70999,
    costPrice: 66400,
    stock: 70,
    minOrderQty: 1,
    weight: 0.34,
    length: 18,
    width: 10,
    height: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c",
      "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00"
    ],
    tags: [
      "samsung",
      "android",
      "galaxy",
      "flagship"
    ]
  },

  {
    name: "OnePlus 13 256GB",
    slug: "oneplus-13-256gb",
    shortDescription: "Fast flagship Android phone.",
    description:
      "OnePlus flagship with Snapdragon processor, AMOLED display, Hasselblad cameras and fast charging.",
    category: "Mobiles",
    brand: "OnePlus",
    sku: "ONE-13-256",
    hsn: "85171300",
    gst: 18,
    mrp: 69999,
    sellingPrice: 64999,
    costPrice: 61200,
    stock: 60,
    minOrderQty: 1,
    weight: 0.36,
    length: 18,
    width: 10,
    height: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
      "https://images.unsplash.com/photo-1598327106026-d9521da673d1",
      "https://images.unsplash.com/photo-1598327105854-c867154fdb55"
    ],
    tags: [
      "oneplus",
      "android",
      "amoled",
      "fastcharge"
    ]
  },

  {
    name: "Xiaomi Redmi Note 14 Pro",
    slug: "xiaomi-redmi-note-14-pro",
    shortDescription: "Affordable performance smartphone.",
    description:
      "Redmi Note series with AMOLED display, high resolution camera and fast charging.",
    category: "Mobiles",
    brand: "Xiaomi",
    sku: "REDMI14PRO",
    hsn: "85171300",
    gst: 18,
    mrp: 28999,
    sellingPrice: 25999,
    costPrice: 23850,
    stock: 120,
    minOrderQty: 1,
    weight: 0.38,
    length: 18,
    width: 10,
    height: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1580910051074-3eb694886505",
    images: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505",
      "https://images.unsplash.com/photo-1580910357842-4f8c0d1c2dff",
      "https://images.unsplash.com/photo-1580910347734-86fc9a5e6c7f"
    ],
    tags: [
      "xiaomi",
      "redmi",
      "android",
      "budget"
    ]
  },

  {
    name: "HP Pavilion 15 Intel Core i5",
    slug: "hp-pavilion-15-core-i5",
    shortDescription: "Powerful everyday laptop.",
    description:
      "HP Pavilion laptop with Intel Core i5 processor, SSD storage and Full HD display.",
    category: "Laptops",
    brand: "HP",
    sku: "HPPAV15I5",
    hsn: "84713010",
    gst: 18,
    mrp: 68999,
    sellingPrice: 62999,
    costPrice: 58800,
    stock: 40,
    minOrderQty: 1,
    weight: 2.1,
    length: 45,
    width: 30,
    height: 7,
    thumbnail:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
    images: [
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
    ],
    tags: [
      "hp",
      "laptop",
      "intel",
      "ssd"
    ]
  },

  {
    name: "Sony WH-1000XM5 Headphones",
    slug: "sony-wh1000xm5",
    shortDescription: "Industry-leading noise cancellation.",
    description:
      "Sony premium wireless headphones with best-in-class ANC and exceptional battery life.",
    category: "Headphones",
    brand: "Sony",
    sku: "SONYXM5",
    hsn: "85183000",
    gst: 18,
    mrp: 34990,
    sellingPrice: 27999,
    costPrice: 24800,
    stock: 65,
    minOrderQty: 1,
    weight: 0.55,
    length: 24,
    width: 22,
    height: 12,
    thumbnail:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90"
    ],
    tags: [
      "sony",
      "headphones",
      "wireless",
      "anc"
    ]
  },
    {
    name: "Boat Airdopes 141 TWS Earbuds",
    slug: "boat-airdopes-141-tws",
    shortDescription: "Best-selling TWS earbuds with ENx technology.",
    description:
      "Boat Airdopes 141 wireless earbuds with 42 hours playback, ENx noise cancellation and fast charging.",
    category: "Headphones",
    brand: "Boat",
    sku: "BOAT-141-TWS",
    hsn: "85183000",
    gst: 18,
    mrp: 4499,
    sellingPrice: 1299,
    costPrice: 980,
    stock: 180,
    minOrderQty: 1,
    weight: 0.18,
    length: 12,
    width: 8,
    height: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46",
    images: [
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
      "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5"
    ],
    tags: [
      "boat",
      "airdopes",
      "earbuds",
      "wireless",
      "bluetooth"
    ]
  },

  {
    name: "Noise ColorFit Pulse 3 Smart Watch",
    slug: "noise-colorfit-pulse-3",
    shortDescription: "Bluetooth calling smartwatch.",
    description:
      "Noise smartwatch with 1.96-inch display, Bluetooth calling, health tracking and 7-day battery life.",
    category: "Smart Watches",
    brand: "Noise",
    sku: "NOISE-PULSE3",
    hsn: "85176290",
    gst: 18,
    mrp: 5999,
    sellingPrice: 1799,
    costPrice: 1490,
    stock: 160,
    minOrderQty: 1,
    weight: 0.24,
    length: 15,
    width: 10,
    height: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d",
      "https://images.unsplash.com/photo-1510017803434-a899398421b3"
    ],
    tags: [
      "watch",
      "noise",
      "smartwatch",
      "fitness",
      "bluetooth"
    ]
  },

  {
    name: "Titan Analog Men's Watch",
    slug: "titan-analog-mens-watch",
    shortDescription: "Premium stainless steel men's watch.",
    description:
      "Titan analog watch with elegant design suitable for office and casual wear.",
    category: "Watches",
    brand: "Titan",
    sku: "TITAN-M001",
    hsn: "91021100",
    gst: 18,
    mrp: 4995,
    sellingPrice: 3499,
    costPrice: 2920,
    stock: 90,
    minOrderQty: 1,
    weight: 0.28,
    length: 14,
    width: 10,
    height: 6,
    thumbnail:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3",
    images: [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa",
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade"
    ],
    tags: [
      "titan",
      "watch",
      "analog",
      "men"
    ]
  },

  {
    name: "Prestige Omega Deluxe Fry Pan 24cm",
    slug: "prestige-omega-deluxe-fry-pan",
    shortDescription: "Non-stick induction compatible fry pan.",
    description:
      "Prestige Omega Deluxe non-stick cookware with durable coating suitable for gas and induction.",
    category: "Kitchen",
    brand: "Prestige",
    sku: "PRESTIGE-FP24",
    hsn: "76151090",
    gst: 18,
    mrp: 1599,
    sellingPrice: 899,
    costPrice: 690,
    stock: 140,
    minOrderQty: 1,
    weight: 0.95,
    length: 42,
    width: 24,
    height: 7,
    thumbnail:
      "https://images.unsplash.com/photo-1584990347449-a5d4fb0be7a4",
    images: [
      "https://images.unsplash.com/photo-1584990347449-a5d4fb0be7a4",
      "https://images.unsplash.com/photo-1556911220-bff31c812dba",
      "https://images.unsplash.com/photo-1516594798947-e65505dbb29d"
    ],
    tags: [
      "kitchen",
      "prestige",
      "cookware",
      "pan"
    ]
  },

  {
    name: "Milton Thermosteel Water Bottle 1L",
    slug: "milton-thermosteel-water-bottle-1l",
    shortDescription: "Vacuum insulated steel bottle.",
    description:
      "Milton Thermosteel bottle keeps beverages hot and cold for long hours with leak-proof design.",
    category: "Kitchen",
    brand: "Milton",
    sku: "MILTON-1L",
    hsn: "96170090",
    gst: 18,
    mrp: 1099,
    sellingPrice: 699,
    costPrice: 530,
    stock: 200,
    minOrderQty: 1,
    weight: 0.62,
    length: 32,
    width: 9,
    height: 9,
    thumbnail:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
      "https://images.unsplash.com/photo-1523362628745-0c100150b504",
      "https://images.unsplash.com/photo-1564894809611-1742fc40ed80"
    ],
    tags: [
      "bottle",
      "steel",
      "milton",
      "kitchen"
    ]
  },
    {
    name: "Cello Plastic Storage Container Set (6 Pieces)",
    slug: "cello-storage-container-set-6pcs",
    shortDescription: "Airtight kitchen storage containers.",
    description:
      "Food-grade BPA-free airtight plastic storage containers suitable for grains, pulses, spices and snacks.",
    category: "Home & Kitchen",
    brand: "Cello",
    sku: "CELLO-STORAGE-6",
    hsn: "39241090",
    gst: 18,
    mrp: 999,
    sellingPrice: 599,
    costPrice: 430,
    stock: 220,
    minOrderQty: 1,
    weight: 1.15,
    length: 32,
    width: 24,
    height: 18,
    thumbnail:
      "https://images.unsplash.com/photo-1584269600519-112d071b75b5",
    images: [
      "https://images.unsplash.com/photo-1584269600519-112d071b75b5",
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36"
    ],
    tags: [
      "storage",
      "kitchen",
      "containers",
      "airtight",
      "cello"
    ]
  },

  {
    name: "Plastic Multipurpose Storage Basket",
    slug: "plastic-multipurpose-storage-basket",
    shortDescription: "Durable storage basket for home.",
    description:
      "Multipurpose plastic basket suitable for wardrobe, kitchen, bathroom and office organization.",
    category: "Home & Kitchen",
    brand: "Cello",
    sku: "BASKET-001",
    hsn: "39249090",
    gst: 18,
    mrp: 399,
    sellingPrice: 199,
    costPrice: 118,
    stock: 450,
    minOrderQty: 1,
    weight: 0.45,
    length: 30,
    width: 20,
    height: 15,
    thumbnail:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
      "https://images.unsplash.com/photo-1494526585095-c41746248156"
    ],
    tags: [
      "basket",
      "organizer",
      "home",
      "storage"
    ]
  },

  {
    name: "Double Bedsheet with 2 Pillow Covers",
    slug: "double-bedsheet-2-pillow-covers",
    shortDescription: "Soft microfiber double bedsheet.",
    description:
      "Premium microfiber double bedsheet with attractive floral print and matching pillow covers.",
    category: "Home Furnishing",
    brand: "Spaces",
    sku: "BED-DOUBLE-001",
    hsn: "63041930",
    gst: 12,
    mrp: 1599,
    sellingPrice: 699,
    costPrice: 480,
    stock: 190,
    minOrderQty: 1,
    weight: 1.25,
    length: 36,
    width: 28,
    height: 6,
    thumbnail:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
    ],
    tags: [
      "bedsheet",
      "double",
      "bedroom",
      "home"
    ]
  },

  {
    name: "Door Curtain 7 Feet",
    slug: "door-curtain-7-feet",
    shortDescription: "Elegant polyester door curtain.",
    description:
      "Premium quality polyester curtain suitable for living room and bedroom with eyelet rings.",
    category: "Home Furnishing",
    brand: "Spaces",
    sku: "CURTAIN-7FT",
    hsn: "63039200",
    gst: 12,
    mrp: 899,
    sellingPrice: 449,
    costPrice: 295,
    stock: 260,
    minOrderQty: 1,
    weight: 0.72,
    length: 34,
    width: 24,
    height: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
      "https://images.unsplash.com/photo-1494526585095-c41746248156"
    ],
    tags: [
      "curtain",
      "home",
      "livingroom",
      "bedroom"
    ]
  },

  {
    name: "LED Strip Light 5 Meter RGB",
    slug: "led-strip-light-5m-rgb",
    shortDescription: "Decorative RGB LED strip.",
    description:
      "5 meter RGB LED strip with remote control suitable for TV, gaming setup and room decoration.",
    category: "Lighting",
    brand: "Philips",
    sku: "LEDSTRIP-5M",
    hsn: "94054090",
    gst: 18,
    mrp: 1499,
    sellingPrice: 699,
    costPrice: 470,
    stock: 170,
    minOrderQty: 1,
    weight: 0.42,
    length: 20,
    width: 16,
    height: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
    images: [
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1494526585095-c41746248156"
    ],
    tags: [
      "led",
      "rgb",
      "lights",
      "gaming",
      "decor"
    ]
  },

  {
    name: "Emergency LED Rechargeable Bulb 12W",
    slug: "emergency-led-bulb-12w",
    shortDescription: "Rechargeable inverter LED bulb.",
    description:
      "12W emergency LED bulb with inbuilt battery providing backup during power cuts.",
    category: "Lighting",
    brand: "Philips",
    sku: "LED-EMG-12W",
    hsn: "85395000",
    gst: 18,
    mrp: 699,
    sellingPrice: 399,
    costPrice: 255,
    stock: 340,
    minOrderQty: 1,
    weight: 0.24,
    length: 14,
    width: 8,
    height: 8,
    thumbnail:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
    images: [
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1494526585095-c41746248156"
    ],
    tags: [
      "bulb",
      "emergency",
      "led",
      "backup"
    ]
  },
    {
    name: "Men's Regular Fit Cotton T-Shirt",
    slug: "mens-regular-fit-cotton-tshirt-black",
    shortDescription: "100% cotton round neck t-shirt.",
    description:
      "Premium quality breathable cotton t-shirt suitable for daily wear with soft fabric and regular fit.",
    category: "Men Fashion",
    brand: "Allen Solly",
    sku: "MEN-TS-001",
    hsn: "61091000",
    gst: 5,
    mrp: 999,
    sellingPrice: 399,
    costPrice: 245,
    stock: 350,
    minOrderQty: 1,
    weight: 0.22,
    length: 30,
    width: 24,
    height: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723"
    ],
    tags: [
      "men",
      "tshirt",
      "cotton",
      "casual",
      "fashion"
    ]
  },

  {
    name: "Men's Slim Fit Denim Jeans",
    slug: "mens-slim-fit-denim-jeans-blue",
    shortDescription: "Stretchable slim fit jeans.",
    description:
      "Comfortable stretch denim jeans with premium stitching and modern slim fit design.",
    category: "Men Fashion",
    brand: "Levis",
    sku: "MEN-JEANS-001",
    hsn: "62034200",
    gst: 12,
    mrp: 2499,
    sellingPrice: 1299,
    costPrice: 895,
    stock: 180,
    minOrderQty: 1,
    weight: 0.72,
    length: 38,
    width: 28,
    height: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1542272604-787c3835535d",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"
    ],
    tags: [
      "jeans",
      "men",
      "denim",
      "fashion"
    ]
  },

  {
    name: "Women's Printed Kurti",
    slug: "womens-printed-kurti-maroon",
    shortDescription: "Rayon ethnic printed kurti.",
    description:
      "Elegant rayon kurti suitable for office, college and daily wear with beautiful prints.",
    category: "Women Fashion",
    brand: "Biba",
    sku: "KURTI-001",
    hsn: "62064000",
    gst: 5,
    mrp: 1499,
    sellingPrice: 649,
    costPrice: 430,
    stock: 240,
    minOrderQty: 1,
    weight: 0.38,
    length: 34,
    width: 25,
    height: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    images: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b"
    ],
    tags: [
      "kurti",
      "women",
      "ethnic",
      "fashion"
    ]
  },

  {
    name: "Women's Handbag",
    slug: "womens-handbag-brown",
    shortDescription: "PU leather shoulder handbag.",
    description:
      "Premium quality handbag with multiple compartments suitable for office and casual outings.",
    category: "Women Fashion",
    brand: "Lavie",
    sku: "BAG-001",
    hsn: "42022190",
    gst: 18,
    mrp: 2499,
    sellingPrice: 1199,
    costPrice: 825,
    stock: 140,
    minOrderQty: 1,
    weight: 0.64,
    length: 36,
    width: 28,
    height: 12,
    thumbnail:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
    ],
    tags: [
      "bag",
      "handbag",
      "women",
      "fashion"
    ]
  },

  {
    name: "Men's Running Shoes",
    slug: "mens-running-shoes-grey",
    shortDescription: "Lightweight sports running shoes.",
    description:
      "Comfortable running shoes with breathable mesh upper and cushioned sole for everyday use.",
    category: "Footwear",
    brand: "Campus",
    sku: "SHOE-001",
    hsn: "64041190",
    gst: 18,
    mrp: 2999,
    sellingPrice: 1499,
    costPrice: 1030,
    stock: 200,
    minOrderQty: 1,
    weight: 0.82,
    length: 36,
    width: 24,
    height: 14,
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2",
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782"
    ],
    tags: [
      "shoes",
      "running",
      "men",
      "sports"
    ]
  },

  {
    name: "Women's Casual Sneakers",
    slug: "womens-casual-sneakers-white",
    shortDescription: "Comfortable everyday sneakers.",
    description:
      "Stylish lightweight sneakers suitable for walking, college and daily casual wear.",
    category: "Footwear",
    brand: "Puma",
    sku: "SHOE-002",
    hsn: "64041190",
    gst: 18,
    mrp: 3499,
    sellingPrice: 1799,
    costPrice: 1260,
    stock: 175,
    minOrderQty: 1,
    weight: 0.78,
    length: 35,
    width: 24,
    height: 13,
    thumbnail:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2",
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782"
    ],
    tags: [
      "women",
      "sneakers",
      "casual",
      "footwear"
    ]
  },
    {
    name: "Lakme Absolute Perfect Radiance Face Wash",
    slug: "lakme-absolute-perfect-radiance-face-wash",
    shortDescription: "Brightening face wash for daily use.",
    description:
      "Lakme Absolute Perfect Radiance Face Wash removes dirt, excess oil and impurities while leaving skin fresh and glowing.",
    category: "Beauty & Personal Care",
    brand: "Lakme",
    sku: "LAK-FW-100",
    hsn: "33049990",
    gst: 18,
    mrp: 299,
    sellingPrice: 199,
    costPrice: 138,
    stock: 320,
    minOrderQty: 1,
    weight: 0.15,
    length: 18,
    width: 6,
    height: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
    ],
    tags: [
      "lakme",
      "facewash",
      "beauty",
      "skincare"
    ]
  },

  {
    name: "Mamaearth Onion Hair Oil 250ml",
    slug: "mamaearth-onion-hair-oil-250ml",
    shortDescription: "Hair oil for stronger hair.",
    description:
      "Mamaearth Onion Hair Oil enriched with onion oil and redensyl to reduce hair fall and nourish hair.",
    category: "Beauty & Personal Care",
    brand: "Mamaearth",
    sku: "MAM-OIL-250",
    hsn: "33059019",
    gst: 18,
    mrp: 499,
    sellingPrice: 349,
    costPrice: 245,
    stock: 280,
    minOrderQty: 1,
    weight: 0.34,
    length: 19,
    width: 7,
    height: 7,
    thumbnail:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273",
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f"
    ],
    tags: [
      "hair",
      "oil",
      "mamaearth",
      "personalcare"
    ]
  },

  {
    name: "Nivea Soft Moisturizing Cream 200ml",
    slug: "nivea-soft-moisturizing-cream-200ml",
    shortDescription: "Light moisturizing cream.",
    description:
      "Nivea Soft cream with Vitamin E and Jojoba Oil provides long-lasting hydration for face, hands and body.",
    category: "Beauty & Personal Care",
    brand: "Nivea",
    sku: "NIV-CREAM-200",
    hsn: "33049990",
    gst: 18,
    mrp: 399,
    sellingPrice: 289,
    costPrice: 205,
    stock: 340,
    minOrderQty: 1,
    weight: 0.26,
    length: 11,
    width: 11,
    height: 6,
    thumbnail:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b",
    images: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b",
      "https://images.unsplash.com/photo-1556228578-dd6c79f1f63d",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
    ],
    tags: [
      "cream",
      "nivea",
      "moisturizer",
      "skincare"
    ]
  },

  {
    name: "Dove Deeply Nourishing Body Wash 500ml",
    slug: "dove-body-wash-500ml",
    shortDescription: "Moisturizing body wash.",
    description:
      "Dove body wash gently cleanses and nourishes skin with moisturizing ingredients.",
    category: "Beauty & Personal Care",
    brand: "Dove",
    sku: "DOVE-BW-500",
    hsn: "34013019",
    gst: 18,
    mrp: 499,
    sellingPrice: 359,
    costPrice: 262,
    stock: 210,
    minOrderQty: 1,
    weight: 0.58,
    length: 22,
    width: 8,
    height: 8,
    thumbnail:
      "https://images.unsplash.com/photo-1556228578-dd6c79f1f63d",
    images: [
      "https://images.unsplash.com/photo-1556228578-dd6c79f1f63d",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
    ],
    tags: [
      "dove",
      "bodywash",
      "bath",
      "skincare"
    ]
  },

  {
    name: "Himalaya Purifying Neem Face Pack",
    slug: "himalaya-purifying-neem-face-pack",
    shortDescription: "Herbal neem face pack.",
    description:
      "Himalaya Neem Face Pack helps control excess oil and purifies skin naturally.",
    category: "Beauty & Personal Care",
    brand: "Himalaya",
    sku: "HIM-FP-100",
    hsn: "33049990",
    gst: 18,
    mrp: 180,
    sellingPrice: 135,
    costPrice: 92,
    stock: 420,
    minOrderQty: 1,
    weight: 0.14,
    length: 16,
    width: 6,
    height: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
    ],
    tags: [
      "himalaya",
      "facepack",
      "neem",
      "skincare"
    ]
  },

  {
    name: "Maybelline New York Colossal Kajal",
    slug: "maybelline-colossal-kajal",
    shortDescription: "Waterproof black kajal.",
    description:
      "Long-lasting waterproof kajal with smooth application and intense black finish.",
    category: "Beauty & Personal Care",
    brand: "Maybelline",
    sku: "MAY-KAJAL-01",
    hsn: "33042000",
    gst: 18,
    mrp: 249,
    sellingPrice: 179,
    costPrice: 118,
    stock: 500,
    minOrderQty: 1,
    weight: 0.05,
    length: 14,
    width: 3,
    height: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
    ],
    tags: [
      "kajal",
      "makeup",
      "maybelline",
      "beauty"
    ]
  },
    {
    name: "Fortune Sunlite Refined Sunflower Oil 1L",
    slug: "fortune-sunlite-refined-sunflower-oil-1l",
    shortDescription: "Healthy refined sunflower cooking oil.",
    description:
      "Fortune Sunlite refined sunflower oil suitable for everyday cooking with light texture and natural taste.",
    category: "Grocery",
    brand: "Fortune",
    sku: "FORT-OIL-1L",
    hsn: "15121910",
    gst: 5,
    mrp: 195,
    sellingPrice: 178,
    costPrice: 165,
    stock: 450,
    minOrderQty: 1,
    weight: 1.05,
    length: 28,
    width: 9,
    height: 9,
    thumbnail:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5",
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5",
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc",
      "https://images.unsplash.com/photo-1514996937319-344454492b37"
    ],
    tags: [
      "grocery",
      "oil",
      "fortune",
      "cooking"
    ]
  },

  {
    name: "Tata Sampann Toor Dal 1kg",
    slug: "tata-sampann-toor-dal-1kg",
    shortDescription: "Unpolished premium toor dal.",
    description:
      "Protein-rich Tata Sampann unpolished toor dal for healthy everyday meals.",
    category: "Grocery",
    brand: "Tata Sampann",
    sku: "TATA-TDAL-1KG",
    hsn: "07136000",
    gst: 0,
    mrp: 235,
    sellingPrice: 209,
    costPrice: 192,
    stock: 380,
    minOrderQty: 1,
    weight: 1.02,
    length: 25,
    width: 16,
    height: 6,
    thumbnail:
      "https://images.unsplash.com/photo-1514996937319-344454492b37",
    images: [
      "https://images.unsplash.com/photo-1514996937319-344454492b37",
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc",
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5"
    ],
    tags: [
      "dal",
      "grocery",
      "protein",
      "tata"
    ]
  },

  {
    name: "Aashirvaad Shudh Chakki Atta 10kg",
    slug: "aashirvaad-shudh-chakki-atta-10kg",
    shortDescription: "Whole wheat flour.",
    description:
      "Premium whole wheat chakki atta suitable for soft and fluffy rotis.",
    category: "Grocery",
    brand: "Aashirvaad",
    sku: "ATTA-10KG",
    hsn: "11010000",
    gst: 0,
    mrp: 585,
    sellingPrice: 549,
    costPrice: 518,
    stock: 260,
    minOrderQty: 1,
    weight: 10.2,
    length: 48,
    width: 34,
    height: 12,
    thumbnail:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff",
    images: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff",
      "https://images.unsplash.com/photo-1514996937319-344454492b37",
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5"
    ],
    tags: [
      "atta",
      "wheat",
      "grocery",
      "aashirvaad"
    ]
  },

  {
    name: "Maggi 2-Minute Noodles Pack of 12",
    slug: "maggi-2-minute-noodles-pack-12",
    shortDescription: "Instant noodles combo pack.",
    description:
      "Classic Maggi masala noodles combo pack ideal for home, office and hostel.",
    category: "Grocery",
    brand: "Maggi",
    sku: "MAGGI-12",
    hsn: "19023010",
    gst: 12,
    mrp: 180,
    sellingPrice: 165,
    costPrice: 149,
    stock: 600,
    minOrderQty: 1,
    weight: 1.05,
    length: 28,
    width: 22,
    height: 10,
    thumbnail:
      "https://images.unsplash.com/photo-1617093727343-374698b1b08d",
    images: [
      "https://images.unsplash.com/photo-1617093727343-374698b1b08d",
      "https://images.unsplash.com/photo-1514996937319-344454492b37",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff"
    ],
    tags: [
      "maggi",
      "noodles",
      "instant",
      "grocery"
    ]
  },

  {
    name: "Cadbury Dairy Milk Silk Chocolate 150g",
    slug: "cadbury-dairy-milk-silk-150g",
    shortDescription: "Smooth milk chocolate.",
    description:
      "Cadbury Dairy Milk Silk with rich creamy milk chocolate for gifting and celebrations.",
    category: "Grocery",
    brand: "Cadbury",
    sku: "SILK-150",
    hsn: "18069010",
    gst: 18,
    mrp: 210,
    sellingPrice: 189,
    costPrice: 171,
    stock: 350,
    minOrderQty: 1,
    weight: 0.17,
    length: 19,
    width: 9,
    height: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b",
    images: [
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b",
      "https://images.unsplash.com/photo-1617093727343-374698b1b08d",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff"
    ],
    tags: [
      "cadbury",
      "chocolate",
      "silk",
      "grocery"
    ]
  },

  {
    name: "Tata Tea Gold 1kg",
    slug: "tata-tea-gold-1kg",
    shortDescription: "Premium tea blend.",
    description:
      "Rich blend of premium tea leaves delivering strong aroma and refreshing taste.",
    category: "Grocery",
    brand: "Tata Tea",
    sku: "TATA-TEA-1KG",
    hsn: "09023020",
    gst: 5,
    mrp: 695,
    sellingPrice: 649,
    costPrice: 611,
    stock: 280,
    minOrderQty: 1,
    weight: 1.03,
    length: 28,
    width: 18,
    height: 9,
    thumbnail:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff",
      "https://images.unsplash.com/photo-1514996937319-344454492b37"
    ],
    tags: [
      "tea",
      "tata",
      "beverage",
      "grocery"
    ]
  },
    {
    name: "FunBlast Building Blocks Set (500 Pieces)",
    slug: "funblast-building-blocks-500-pieces",
    shortDescription: "Creative educational building block toy set.",
    description:
      "Colorful 500-piece building block set designed to improve creativity, problem solving and motor skills for children.",
    category: "Toys",
    brand: "FunBlast",
    sku: "FUN-BLOCK-500",
    hsn: "95030090",
    gst: 12,
    mrp: 1499,
    sellingPrice: 999,
    costPrice: 760,
    stock: 180,
    minOrderQty: 1,
    weight: 1.35,
    length: 38,
    width: 28,
    height: 10,
    thumbnail:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4",
    images: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4",
      "https://images.unsplash.com/photo-1558877385-81a1c7f5d5dd",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1"
    ],
    tags: [
      "toys",
      "blocks",
      "kids",
      "educational"
    ]
  },

  {
    name: "Remote Control Racing Car",
    slug: "remote-control-racing-car-red",
    shortDescription: "Rechargeable RC racing car.",
    description:
      "High-speed rechargeable remote control racing car with LED lights and long-range controller.",
    category: "Toys",
    brand: "Toyshine",
    sku: "RC-CAR-001",
    hsn: "95030090",
    gst: 12,
    mrp: 2499,
    sellingPrice: 1699,
    costPrice: 1320,
    stock: 95,
    minOrderQty: 1,
    weight: 1.12,
    length: 36,
    width: 22,
    height: 18,
    thumbnail:
      "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60",
    images: [
      "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4",
      "https://images.unsplash.com/photo-1558877385-81a1c7f5d5dd"
    ],
    tags: [
      "rc",
      "car",
      "toy",
      "kids"
    ]
  },

  {
    name: "Barbie Fashion Doll",
    slug: "barbie-fashion-doll",
    shortDescription: "Classic Barbie doll for girls.",
    description:
      "Beautiful Barbie fashion doll with stylish outfit and accessories for imaginative play.",
    category: "Toys",
    brand: "Barbie",
    sku: "BARBIE-001",
    hsn: "95030090",
    gst: 12,
    mrp: 1299,
    sellingPrice: 899,
    costPrice: 680,
    stock: 150,
    minOrderQty: 1,
    weight: 0.42,
    length: 34,
    width: 14,
    height: 8,
    thumbnail:
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1",
    images: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4",
      "https://images.unsplash.com/photo-1558877385-81a1c7f5d5dd"
    ],
    tags: [
      "barbie",
      "doll",
      "girls",
      "toy"
    ]
  },

  {
    name: "UNO Playing Cards",
    slug: "uno-playing-cards",
    shortDescription: "Family card game.",
    description:
      "Original UNO card game suitable for family gatherings, parties and travel entertainment.",
    category: "Toys",
    brand: "Mattel",
    sku: "UNO-001",
    hsn: "95044000",
    gst: 12,
    mrp: 299,
    sellingPrice: 199,
    costPrice: 142,
    stock: 420,
    minOrderQty: 1,
    weight: 0.18,
    length: 14,
    width: 10,
    height: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09",
    images: [
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4"
    ],
    tags: [
      "uno",
      "cards",
      "game",
      "family"
    ]
  },

  {
    name: "Soft Teddy Bear 3 Feet",
    slug: "soft-teddy-bear-3-feet",
    shortDescription: "Large premium soft toy.",
    description:
      "Ultra-soft plush teddy bear made with skin-friendly fabric, perfect for gifting on birthdays and special occasions.",
    category: "Toys",
    brand: "Tickles",
    sku: "TEDDY-3FT",
    hsn: "95030090",
    gst: 12,
    mrp: 1999,
    sellingPrice: 1299,
    costPrice: 980,
    stock: 130,
    minOrderQty: 1,
    weight: 1.95,
    length: 92,
    width: 42,
    height: 24,
    thumbnail:
      "https://images.unsplash.com/photo-1563901935883-cb4c9b2b7f4b",
    images: [
      "https://images.unsplash.com/photo-1563901935883-cb4c9b2b7f4b",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1",
      "https://images.unsplash.com/photo-1558877385-81a1c7f5d5dd"
    ],
    tags: [
      "teddy",
      "softtoy",
      "gift",
      "kids"
    ]
  },

  {
    name: "Wooden Alphabet Learning Puzzle",
    slug: "wooden-alphabet-learning-puzzle",
    shortDescription: "Educational wooden puzzle board.",
    description:
      "Colorful wooden alphabet puzzle that helps children learn letters while improving hand-eye coordination.",
    category: "Toys",
    brand: "Skillmatics",
    sku: "PUZZLE-ABC-01",
    hsn: "95030090",
    gst: 12,
    mrp: 499,
    sellingPrice: 349,
    costPrice: 248,
    stock: 280,
    minOrderQty: 1,
    weight: 0.46,
    length: 32,
    width: 24,
    height: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1558877385-81a1c7f5d5dd",
    images: [
      "https://images.unsplash.com/photo-1558877385-81a1c7f5d5dd",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1"
    ],
    tags: [
      "educational",
      "alphabet",
      "puzzle",
      "kids"
    ]
  },
    {
    name: "Adjustable Mobile Phone Holder Stand",
    slug: "adjustable-mobile-phone-holder-stand",
    shortDescription: "Foldable desktop mobile stand.",
    description:
      "Adjustable ABS mobile holder suitable for online classes, video calls, office desk and watching videos.",
    category: "Accessories",
    brand: "Generic",
    sku: "ACC-MOB-001",
    hsn: "39269099",
    gst: 18,
    mrp: 299,
    sellingPrice: 149,
    costPrice: 82,
    stock: 850,
    minOrderQty: 1,
    weight: 0.14,
    length: 12,
    width: 8,
    height: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505"
    ],
    tags: [
      "mobile",
      "holder",
      "stand",
      "accessories"
    ]
  },

  {
    name: "360° Rotating Car Mobile Holder",
    slug: "360-rotating-car-mobile-holder",
    shortDescription: "Dashboard mobile holder.",
    description:
      "Universal 360-degree rotating car phone holder with strong suction and secure grip.",
    category: "Car Accessories",
    brand: "Generic",
    sku: "CAR-HOLDER-001",
    hsn: "39269099",
    gst: 18,
    mrp: 499,
    sellingPrice: 249,
    costPrice: 148,
    stock: 520,
    minOrderQty: 1,
    weight: 0.22,
    length: 15,
    width: 10,
    height: 6,
    thumbnail:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8"
    ],
    tags: [
      "car",
      "holder",
      "mobile",
      "dashboard"
    ]
  },

  {
    name: "Silicone Cable Protector (Pack of 10)",
    slug: "silicone-cable-protector-pack-10",
    shortDescription: "Protect charging cables.",
    description:
      "Flexible silicone cable protectors help prevent charging cable damage and increase durability.",
    category: "Accessories",
    brand: "Generic",
    sku: "CAB-PROT-010",
    hsn: "39269099",
    gst: 18,
    mrp: 199,
    sellingPrice: 99,
    costPrice: 42,
    stock: 1200,
    minOrderQty: 1,
    weight: 0.04,
    length: 8,
    width: 6,
    height: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8",
    images: [
      "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8"
    ],
    tags: [
      "cable",
      "protector",
      "charger",
      "mobile"
    ]
  },

  {
    name: "Self Adhesive Wall Hooks (Pack of 10)",
    slug: "self-adhesive-wall-hooks-pack-10",
    shortDescription: "Heavy-duty transparent hooks.",
    description:
      "Waterproof self-adhesive wall hooks suitable for kitchen, bathroom and bedroom organization.",
    category: "Home Utility",
    brand: "Generic",
    sku: "HOOK-010",
    hsn: "39269099",
    gst: 18,
    mrp: 299,
    sellingPrice: 149,
    costPrice: 71,
    stock: 950,
    minOrderQty: 1,
    weight: 0.11,
    length: 18,
    width: 12,
    height: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1494526585095-c41746248156"
    ],
    tags: [
      "hooks",
      "wall",
      "organizer",
      "home"
    ]
  },

  {
    name: "Sink Drain Filter Strainer (Pack of 2)",
    slug: "sink-drain-filter-strainer-pack-2",
    shortDescription: "Kitchen sink hair and waste filter.",
    description:
      "Reusable silicone drain filter prevents food particles and hair from clogging kitchen and bathroom drains.",
    category: "Kitchen",
    brand: "Generic",
    sku: "SINK-FILTER-02",
    hsn: "39249090",
    gst: 18,
    mrp: 199,
    sellingPrice: 99,
    costPrice: 44,
    stock: 780,
    minOrderQty: 1,
    weight: 0.05,
    length: 11,
    width: 11,
    height: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba",
    images: [
      "https://images.unsplash.com/photo-1556911220-bff31c812dba",
      "https://images.unsplash.com/photo-1516594798947-e65505dbb29d",
      "https://images.unsplash.com/photo-1584990347449-a5d4fb0be7a4"
    ],
    tags: [
      "sink",
      "filter",
      "kitchen",
      "cleaning"
    ]
  },

  {
    name: "Multipurpose Magic Cleaning Sponge (Pack of 20)",
    slug: "multipurpose-magic-cleaning-sponge-pack-20",
    shortDescription: "Scratch-free cleaning sponge.",
    description:
      "High-density melamine cleaning sponge removes stains from walls, tiles, shoes, kitchen and bathroom surfaces.",
    category: "Cleaning Supplies",
    brand: "Generic",
    sku: "SPONGE-020",
    hsn: "68053000",
    gst: 18,
    mrp: 249,
    sellingPrice: 129,
    costPrice: 58,
    stock: 1100,
    minOrderQty: 1,
    weight: 0.12,
    length: 20,
    width: 10,
    height: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
      "https://images.unsplash.com/photo-1556911220-bff31c812dba",
      "https://images.unsplash.com/photo-1584990347449-a5d4fb0be7a4"
    ],
    tags: [
      "cleaning",
      "sponge",
      "home",
      "utility"
    ]
  },
    {
    name: "Ganesh Vegetable Chopper 900ml",
    slug: "ganesh-vegetable-chopper-900ml",
    shortDescription: "Manual vegetable chopper with sharp stainless steel blades.",
    description:
      "Quick and efficient vegetable chopper for onions, tomatoes, garlic and other vegetables. Easy to clean and ideal for daily kitchen use.",
    category: "Kitchen",
    brand: "Ganesh",
    sku: "GAN-CHOP-900",
    hsn: "82100000",
    gst: 18,
    mrp: 699,
    sellingPrice: 349,
    costPrice: 245,
    stock: 520,
    minOrderQty: 1,
    weight: 0.62,
    length: 15,
    width: 15,
    height: 14,
    thumbnail:
      "https://images.unsplash.com/photo-1516594798947-e65505dbb29d",
    images: [
      "https://images.unsplash.com/photo-1516594798947-e65505dbb29d",
      "https://images.unsplash.com/photo-1556911220-bff31c812dba",
      "https://images.unsplash.com/photo-1584990347449-a5d4fb0be7a4"
    ],
    tags: [
      "vegetable",
      "chopper",
      "kitchen",
      "manual"
    ]
  },

  {
    name: "Mini Heat Sealing Machine",
    slug: "mini-heat-sealing-machine",
    shortDescription: "Portable plastic bag sealing machine.",
    description:
      "Compact heat sealing machine for sealing snack packets, food storage bags and plastic pouches.",
    category: "Home Utility",
    brand: "Generic",
    sku: "SEAL-001",
    hsn: "84223000",
    gst: 18,
    mrp: 399,
    sellingPrice: 199,
    costPrice: 112,
    stock: 760,
    minOrderQty: 1,
    weight: 0.18,
    length: 12,
    width: 6,
    height: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
      "https://images.unsplash.com/photo-1516594798947-e65505dbb29d",
      "https://images.unsplash.com/photo-1556911220-bff31c812dba"
    ],
    tags: [
      "sealer",
      "kitchen",
      "storage",
      "utility"
    ]
  },

  {
    name: "Reusable Lint Remover Roller",
    slug: "reusable-lint-remover-roller",
    shortDescription: "Washable lint and pet hair remover.",
    description:
      "Reusable sticky roller removes lint, dust and pet hair from clothes, sofas and bedsheets.",
    category: "Home Utility",
    brand: "Generic",
    sku: "LINT-ROLLER-01",
    hsn: "96039000",
    gst: 18,
    mrp: 349,
    sellingPrice: 179,
    costPrice: 95,
    stock: 680,
    minOrderQty: 1,
    weight: 0.16,
    length: 18,
    width: 8,
    height: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac",
    images: [
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
    ],
    tags: [
      "lint",
      "cleaning",
      "roller",
      "home"
    ]
  },

  {
    name: "6 Layer Foldable Shoe Rack",
    slug: "6-layer-foldable-shoe-rack",
    shortDescription: "Space-saving shoe organizer.",
    description:
      "Lightweight multi-layer shoe rack for organizing footwear at home while saving floor space.",
    category: "Home Storage",
    brand: "Generic",
    sku: "SHOE-RACK-06",
    hsn: "94032090",
    gst: 18,
    mrp: 1499,
    sellingPrice: 799,
    costPrice: 560,
    stock: 240,
    minOrderQty: 1,
    weight: 2.3,
    length: 58,
    width: 30,
    height: 10,
    thumbnail:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1494526585095-c41746248156"
    ],
    tags: [
      "shoe",
      "rack",
      "organizer",
      "storage"
    ]
  },

  {
    name: "Fridge Storage Box (Set of 4)",
    slug: "fridge-storage-box-set-4",
    shortDescription: "Transparent refrigerator organizers.",
    description:
      "Durable BPA-free storage boxes for organizing fruits, vegetables, snacks and dairy products.",
    category: "Kitchen",
    brand: "Generic",
    sku: "FRIDGE-BOX-04",
    hsn: "39241090",
    gst: 18,
    mrp: 799,
    sellingPrice: 399,
    costPrice: 268,
    stock: 430,
    minOrderQty: 1,
    weight: 1.05,
    length: 30,
    width: 22,
    height: 16,
    thumbnail:
      "https://images.unsplash.com/photo-1584269600519-112d071b75b5",
    images: [
      "https://images.unsplash.com/photo-1584269600519-112d071b75b5",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71"
    ],
    tags: [
      "fridge",
      "storage",
      "kitchen",
      "organizer"
    ]
  },

  {
    name: "Wall Mounted Toothbrush Holder",
    slug: "wall-mounted-toothbrush-holder",
    shortDescription: "Self-adhesive bathroom organizer.",
    description:
      "Multipurpose wall-mounted toothbrush holder with toothpaste dispenser and storage compartment.",
    category: "Bathroom Accessories",
    brand: "Generic",
    sku: "TB-HOLDER-01",
    hsn: "39249090",
    gst: 18,
    mrp: 599,
    sellingPrice: 299,
    costPrice: 182,
    stock: 520,
    minOrderQty: 1,
    weight: 0.38,
    length: 24,
    width: 12,
    height: 8,
    thumbnail:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
      "https://images.unsplash.com/photo-1494526585095-c41746248156"
    ],
    tags: [
      "bathroom",
      "toothbrush",
      "holder",
      "organizer"
    ]
  },