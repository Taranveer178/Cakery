import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ShoppingBag, Search, User, Heart, Star, Sparkles, ChevronRight, ChevronLeft,
  Check, X, Plus, Minus, Trash2, Upload, Calendar, Clock, MapPin, Phone, Mail,
  Camera, ShieldCheck, Truck, Award, Gift, SlidersHorizontal,
  Grid, List, Eye, ArrowRight, Package, CreditCard, FileText, Settings, LogOut,
  LayoutDashboard, Cake, Tag, Users, BarChart3, Bell, Edit3, CheckCircle2,
  AlertCircle, Info, ExternalLink, RefreshCw, Palette, Layers, Wand2, Image as ImageIcon,
  MessageSquare, ChefHat, Percent, Send, Download, Lock, HelpCircle, Menu
} from 'lucide-react';

// ============================================================================
// GOOGLE FONTS & CUSTOM THEME STYLES
// ============================================================================
const FontAndStyleInjector = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

    :root {
      --cream: #FFFBF7;
      --pastel-pink: #FCE7F3;
      --rose-blush: #FBCFE8;
      --choco-dark: #3E2723;
      --choco-mid: #4E342E;
      --rose-gold: #D4A373;
      --soft-beige: #F5EBE0;
    }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #FFFBF7;
      color: #3E2723;
      overflow-x: hidden;
    }

    .font-serif-luxury {
      font-family: 'Cormorant Garamond', Georgia, serif;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #FFFBF7;
    }
    ::-webkit-scrollbar-thumb {
      background: #D4A373;
      border-radius: 999px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #3E2723;
    }

    @keyframes floatSlow {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }
    .animate-float {
      animation: floatSlow 4s ease-in-out infinite;
    }
  `}</style>
);

// ============================================================================
// MOCK DATA & INITIAL APPLICATION STATE (INDIAN ARTISAN BAKERY - INR ₹)
// ============================================================================
const ORDER_STAGES = [
  'Order Placed',
  'Payment Confirmed',
  'Order Accepted',
  'Design Approved',
  'Baking in Progress',
  'Decoration in Progress',
  'Quality Check',
  'Ready for Dispatch',
  'Out for Delivery',
  'Delivered'
];

const CATEGORIES = [
  { id: 'Chocolate Cakes', name: 'Chocolate Cakes', count: 14, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80', desc: 'Belgian truffle & dark ganache' },
  { id: 'Vanilla Cakes', name: 'Vanilla Cakes', count: 9, image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600&q=80', desc: 'Madagascar bean Chantilly' },
  { id: 'Red Velvet Cakes', name: 'Red Velvet Cakes', count: 8, image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=600&q=80', desc: 'Crimson crumb & cream cheese' },
  { id: 'Black Forest Cakes', name: 'Black Forest Cakes', count: 6, image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=600&q=80', desc: 'Morello cherries & Kirsch cream' },
  { id: 'Fruit Cakes', name: 'Fruit Cakes', count: 11, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80', desc: 'Orchard berries & mango cream' },
  { id: 'Cheesecakes', name: 'Cheesecakes', count: 7, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80', desc: 'Baked New York & Biscoff' },
  { id: 'Photo Cakes', name: 'Photo Cakes', count: 10, image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=600&q=80', desc: 'Edible sugar-sheet memories' },
  { id: 'Designer Cakes', name: 'Designer Cakes', count: 16, image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=600&q=80', desc: 'Hand-sculpted luxury couture' },
];

const OCCASIONS = [
  { slug: 'Birthday', name: 'Birthday', tagline: 'Make a wish in style', image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=600&q=80' },
  { slug: 'Anniversary', name: 'Anniversary', tagline: 'Celebrate timeless love', image: 'https://images.unsplash.com/photo-1519340333755-56e9c1d04579?auto=format&fit=crop&w=600&q=80' },
  { slug: 'Wedding', name: 'Wedding', tagline: 'Bespoke multi-tier grandeur', image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=600&q=80' },
  { slug: 'Engagement', name: 'Engagement', tagline: 'Ring in forever together', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80' },
  { slug: 'Baby Shower', name: 'Baby Shower', tagline: 'Pastel dreams & tiny toes', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80' },
  { slug: 'Graduation', name: 'Graduation', tagline: 'Sweet milestones achieved', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80' },
  { slug: "Valentine's Day", name: "Valentine's Day", tagline: 'Velvet romance & roses', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80' },
  { slug: 'Festivals', name: 'Festivals', tagline: 'Diwali, Christmas & Eid specials', image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=600&q=80' },
];

const BIRTHDAY_COLLECTIONS = [
  { title: 'Kids Birthday Cakes', subtitle: 'Unicorns, Dinosaurs & Space', tag: 'Most Loved', image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=600&q=80', filterCat: 'Designer Cakes' },
  { title: 'First Birthday Cakes', subtitle: 'Soft Pastel Smash & Tiered', tag: 'Milestone', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80', filterCat: 'Designer Cakes' },
  { title: 'Adult Birthday Cakes', subtitle: 'Minimalist Gold Leaf & Espresso', tag: 'Trending', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80', filterCat: 'Chocolate Cakes' },
  { title: 'Number & Monogram Cakes', subtitle: 'Biscuit Tart & Cream Puff', tag: 'Customisable', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80', filterCat: 'Fruit Cakes' },
  { title: 'Theme Cakes', subtitle: 'Superheroes, Gaming & Couture', tag: '48h Custom', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=600&q=80', filterCat: 'Designer Cakes' },
  { title: 'Birthday Combo Packages', subtitle: 'Cake + Cupcakes + Sparklers', tag: 'Save 20%', image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=600&q=80', filterCat: 'Vanilla Cakes' },
];

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    slug: 'belgian-dark-chocolate-truffle-royale',
    name: 'Belgian Dark Chocolate Truffle Royale',
    category: 'Chocolate Cakes',
    occasion: ['Birthday', 'Anniversary', 'Festivals'],
    basePrice: 899,
    rating: 4.9,
    reviewsCount: 342,
    isBestSeller: true,
    isFeatured: true,
    isEgglessAvailable: true,
    inStock: true,
    badge: 'Bestseller',
    flavours: ['70% Dark Belgian Chocolate', 'Hazelnut Praline', 'Mocha Truffle'],
    weights: [0.5, 1, 1.5, 2, 3],
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Four silky layers of single-origin 70% Belgian dark chocolate sponge soaked in espresso syrup, layered with whipped couverture ganache and finished with 24k edible gold leaf.'
  },
  {
    id: 'prod-2',
    slug: 'crimson-velvet-mascarpone-bloom',
    name: 'Crimson Velvet & Mascarpone Bloom',
    category: 'Red Velvet Cakes',
    occasion: ['Anniversary', "Valentine's Day", 'Birthday', 'Engagement'],
    basePrice: 949,
    rating: 4.9,
    reviewsCount: 289,
    isBestSeller: true,
    isFeatured: true,
    isEgglessAvailable: true,
    inStock: true,
    badge: "Chef's Signature",
    flavours: ['Classic Red Velvet', 'Strawberry Velvet', 'Raspberry Rose'],
    weights: [0.5, 1, 1.5, 2],
    images: [
      'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Velvety cocoa-kissed crimson sponge paired with tangy imported mascarpone cream cheese frosting, white chocolate pearls, and organic dried rose petals.'
  },
  {
    id: 'prod-3',
    slug: 'parisian-strawberry-chantilly-gateau',
    name: 'Parisian Strawberry Chantilly Gâteau',
    category: 'Fruit Cakes',
    occasion: ['Birthday', 'Baby Shower', 'Graduation', 'Festivals'],
    basePrice: 849,
    rating: 4.8,
    reviewsCount: 198,
    isBestSeller: true,
    isFeatured: false,
    isEgglessAvailable: true,
    inStock: true,
    badge: 'Fresh Seasonal',
    flavours: ['Strawberry Vanilla', 'Mixed Berry', 'Alphonso Mango'],
    weights: [0.5, 1, 1.5, 2],
    images: [
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Cloud-soft Madagascar vanilla bean genoise layered with house-made Mahabaleshwar strawberry compote, airy Chantilly cream, and glazed fresh berries.'
  },
  {
    id: 'prod-4',
    slug: 'lotus-biscoff-salted-caramel-cheesecake',
    name: 'Lotus Biscoff & Salted Caramel Cheesecake',
    category: 'Cheesecakes',
    occasion: ['Birthday', 'Graduation', 'Festivals'],
    basePrice: 1099,
    rating: 4.9,
    reviewsCount: 256,
    isBestSeller: true,
    isFeatured: true,
    isEgglessAvailable: true,
    inStock: true,
    badge: 'Trending #1',
    flavours: ['Lotus Biscoff', 'New York Blueberry', 'Nutella Ferrero'],
    weights: [0.5, 1, 1.5],
    images: [
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Slow-baked velvety Philadelphia cream cheese over a caramelized speculoos biscuit crust, crowned with warm Biscoff spread and crunchy biscuit crumble.'
  },
  {
    id: 'prod-5',
    slug: 'blush-peony-tier-couture-cake',
    name: 'Blush Peony Tier Couture Cake',
    category: 'Designer Cakes',
    occasion: ['Wedding', 'Engagement', 'Baby Shower', 'Anniversary'],
    basePrice: 2499,
    rating: 5.0,
    reviewsCount: 112,
    isBestSeller: false,
    isFeatured: true,
    isEgglessAvailable: true,
    inStock: true,
    badge: 'Luxury Couture',
    flavours: ['Rose Pistachio', 'Belgian Chocolate', 'Lemon Elderflower'],
    weights: [1.5, 2, 3, 5],
    images: [
      'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1519340333755-56e9c1d04579?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Two-tiered artisan Swiss meringue buttercream masterpiece hand-textured in pastel blush with handcrafted sugar peonies and brushed rose-gold accents.'
  },
  {
    id: 'prod-6',
    slug: 'black-forest-morello-cherry-classic',
    name: 'Black Forest Morello Cherry Classic',
    category: 'Black Forest Cakes',
    occasion: ['Birthday', 'Festivals', 'Graduation'],
    basePrice: 799,
    rating: 4.7,
    reviewsCount: 175,
    isBestSeller: false,
    isFeatured: false,
    isEgglessAvailable: true,
    inStock: true,
    badge: 'Classic',
    flavours: ['Traditional Black Forest', 'Dark Cherry Truffle'],
    weights: [0.5, 1, 1.5, 2],
    images: [
      'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Rich Dutch-processed cocoa layers brushed with non-alcoholic cherry reduction, whipped vanilla bean cream, dark chocolate curls, and whole Maraschino cherries.'
  },
  {
    id: 'prod-7',
    slug: 'madagascar-vanilla-macaron-crown',
    name: 'Madagascar Vanilla & Macaron Crown',
    category: 'Vanilla Cakes',
    occasion: ['Birthday', 'Baby Shower', 'Engagement'],
    basePrice: 929,
    rating: 4.8,
    reviewsCount: 141,
    isBestSeller: false,
    isFeatured: true,
    isEgglessAvailable: true,
    inStock: true,
    badge: 'New Arrival',
    flavours: ['Madagascar Vanilla', 'White Chocolate Raspberry', 'Butterscotch Crunch'],
    weights: [0.5, 1, 1.5, 2],
    images: [
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Delicate speckled vanilla bean sponge frosted in silky pastel pink buttercream, topped with French almond macarons and white chocolate drip.'
  },
  {
    id: 'prod-8',
    slug: 'golden-memories-edible-photo-cake',
    name: 'Golden Memories Edible Photo Frame Cake',
    category: 'Photo Cakes',
    occasion: ['Birthday', 'Anniversary', 'Graduation'],
    basePrice: 1049,
    rating: 4.8,
    reviewsCount: 210,
    isBestSeller: false,
    isFeatured: false,
    isEgglessAvailable: true,
    inStock: true,
    badge: 'Personalised',
    flavours: ['Chocolate Truffle', 'Pineapple Cream', 'Butterscotch', 'Red Velvet'],
    weights: [1, 1.5, 2, 3],
    images: [
      'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Your cherished photograph printed in HD with FDA-approved edible inks on premium vanilla sugar sheet, framed with piped rosette borders.'
  }
];

const INITIAL_CUSTOM_OPTIONS = {
  bases: [
    { id: 'Round Cake', label: 'Round Cake', price: 0, desc: 'Classic timeless silhouette' },
    { id: 'Square Cake', label: 'Square Cake', price: 100, desc: 'Modern architectural edges' },
    { id: 'Heart Shape', label: 'Heart Shape', price: 150, desc: 'Romantic celebration centerpiece' },
    { id: 'Rectangle Cake', label: 'Rectangle Slab', price: 150, desc: 'Ideal for large gatherings' },
    { id: 'Tiered Cake', label: '2-Tier Couture', price: 650, desc: 'Grand elevated statement' },
    { id: 'Bento Cake', label: 'Mini Bento Box', price: -250, desc: 'Cute 350g Korean lunchbox style' }
  ],
  sizes: [
    { id: '0.5 KG', label: '0.5 KG (Serves 4–6)', multiplier: 1, basePrice: 850 },
    { id: '1 KG', label: '1 KG (Serves 8–12)', multiplier: 1.85, basePrice: 1550 },
    { id: '1.5 KG', label: '1.5 KG (Serves 14–18)', multiplier: 2.7, basePrice: 2250 },
    { id: '2 KG', label: '2 KG (Serves 20–25)', multiplier: 3.5, basePrice: 2900 },
    { id: '3 KG', label: '3 KG (Serves 30–40)', multiplier: 5.1, basePrice: 4200 },
    { id: '5 KG', label: '5 KG (Serves 55–70)', multiplier: 8.2, basePrice: 6800 }
  ],
  flavours: [
    { id: 'Chocolate', label: 'Belgian Chocolate', price: 0 },
    { id: 'Vanilla', label: 'Madagascar Vanilla', price: 0 },
    { id: 'Red Velvet', label: 'Crimson Red Velvet', price: 120 },
    { id: 'Butterscotch', label: 'Caramel Butterscotch', price: 50 },
    { id: 'Black Forest', label: 'Black Forest Cherry', price: 80 },
    { id: 'Strawberry', label: 'Fresh Strawberry', price: 100 },
    { id: 'Pineapple', label: 'Tropical Pineapple', price: 50 },
    { id: 'Coffee', label: 'Roasted Espresso Mocha', price: 100 },
    { id: 'Customized Flavour', label: 'Chef Custom Fusion', price: 250 }
  ],
  fillings: [
    { id: 'Chocolate Ganache', label: 'Silky Chocolate Ganache', price: 0 },
    { id: 'Whipped Cream', label: 'Light Chantilly Cream', price: 0 },
    { id: 'Strawberry Filling', label: 'Strawberry Compote', price: 90 },
    { id: 'Blueberry Filling', label: 'Wild Blueberry Reduction', price: 110 },
    { id: 'Caramel', label: 'Salted Butter Caramel', price: 100 },
    { id: 'Nutella', label: 'Roasted Hazelnut Nutella', price: 160 },
    { id: 'Fruit Filling', label: 'Exotic Orchard Fruit', price: 120 }
  ],
  toppings: [
    { id: 'Chocolate Chips', label: 'Callebaut Choco Chips', price: 70 },
    { id: 'Strawberries', label: 'Fresh Strawberries', price: 140 },
    { id: 'Blueberries', label: 'Fresh Blueberries', price: 160 },
    { id: 'Macarons', label: 'French Macarons (4 pcs)', price: 240 },
    { id: 'Ferrero Rocher', label: 'Ferrero Rocher Truffles', price: 220 },
    { id: 'Oreo', label: 'Crushed Oreo Cookies', price: 80 },
    { id: 'Cherries', label: 'Glazed Morello Cherries', price: 90 },
    { id: 'Edible Flowers', label: 'Organic Edible Flowers', price: 180 },
    { id: 'Gold Decorations', label: '24K Edible Gold Leaf', price: 280 },
    { id: 'Custom Toppings', label: 'Bespoke Sugar Toppings', price: 200 }
  ],
  designs: [
    { id: 'Minimalist', label: 'Minimalist Smooth', price: 0 },
    { id: 'Floral', label: 'Buttercream Floral', price: 250 },
    { id: 'Cartoon Theme', label: 'Kids Cartoon Theme', price: 350 },
    { id: 'Photo Cake', label: 'Edible Photo Print', price: 220 },
    { id: 'Wedding Design', label: 'Bridal Couture Lace', price: 550 },
    { id: 'Luxury Cake', label: '24K Gold & Geode Luxury', price: 480 },
    { id: 'Drip Cake', label: 'Ganache Drip & Swirls', price: 180 },
    { id: 'Designer Cake', label: '3D Fondant Sculpted', price: 500 },
    { id: 'Theme-Based Cake', label: 'Custom Concept Theme', price: 420 }
  ],
  colours: [
    { id: 'Pink', label: 'Pastel Blush Pink', hex: '#F9A8D4' },
    { id: 'White', label: 'Ivory Chantilly White', hex: '#FFFDF9' },
    { id: 'Blue', label: 'Powder Sky Blue', hex: '#93C5FD' },
    { id: 'Red', label: 'Velvet Crimson', hex: '#DC2626' },
    { id: 'Purple', label: 'Lavender Mist', hex: '#C4B5FD' },
    { id: 'Yellow', label: 'Buttercup Lemon', hex: '#FDE047' },
    { id: 'Green', label: 'Pistachio Sage', hex: '#86EFAC' },
    { id: 'Black', label: 'Midnight Noir', hex: '#27272A' }
  ]
};

const INITIAL_COUPONS = [
  { code: 'SWEET15', type: 'percent', value: 15, minOrder: 799, expiry: '2026-12-31', active: true, desc: '15% off on your first artisan cake order' },
  { code: 'CAKE200', type: 'flat', value: 200, minOrder: 1499, expiry: '2026-12-31', active: true, desc: 'Flat ₹200 off on orders above ₹1499' },
  { code: 'VELVET10', type: 'percent', value: 10, minOrder: 500, expiry: '2026-12-31', active: true, desc: '10% patisserie loyalty reward' }
];

const INITIAL_BANNERS = [
  {
    id: 'ban-1',
    title: 'Every Celebration Deserves Something Sweet',
    subtitle: 'Handcrafted daily with Belgian couverture chocolate, Madagascar vanilla beans, and farm-fresh berries. Delivered fresh across the city.',
    ctaPrimary: 'Shop Now',
    ctaSecondary: 'Customize Your Cake',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1600&q=85',
    active: true
  },
  {
    id: 'ban-2',
    title: 'Festive Couture Collection 2026',
    subtitle: 'Limited edition Rose Pistachio & 24K Gold Leaf celebration cakes crafted for unforgettable gatherings.',
    ctaPrimary: 'Explore Collection',
    ctaSecondary: 'Design Custom Cake',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1600&q=85',
    active: false
  }
];

const INITIAL_ORDERS = [
  {
    id: 'VC-2026-8841',
    customerId: 'cust-101',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    customerPhone: '+91 98765 43210',
    address: 'House 42, Sector 9, Panchkula, Haryana - 134109',
    deliveryDate: '2026-11-18',
    deliverySlot: '4:00 PM - 7:00 PM (Evening Celebration)',
    paymentMethod: 'Razorpay (UPI)',
    paymentStatus: 'Paid',
    statusIndex: 5, // Decoration in Progress
    deliveryPartner: 'Rohan Verma (Cold-Chain Van #04)',
    adminNotes: 'Extra gold leaf garnish added per VIP request.',
    createdAt: '2026-11-16 10:15 AM',
    subtotal: 1663,
    deliveryFee: 0,
    discount: 249,
    total: 1414,
    items: [
      {
        name: 'Belgian Dark Chocolate Truffle Royale',
        weight: '1 KG',
        flavour: '70% Dark Belgian Chocolate',
        eggless: true,
        qty: 1,
        price: 1663,
        message: 'Happy 25th Birthday Ananya!',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80'
      }
    ],
    timeline: [
      { stage: 'Order Placed', time: 'Nov 16, 10:15 AM', note: 'Order received by Velvet & Crumb Patisserie.' },
      { stage: 'Payment Confirmed', time: 'Nov 16, 10:16 AM', note: 'Payment verified via Razorpay.' },
      { stage: 'Order Accepted', time: 'Nov 16, 10:30 AM', note: 'Assigned to Head Pastry Chef Kabir.' },
      { stage: 'Design Approved', time: 'Nov 16, 11:00 AM', note: 'Inscription & garnish checklist verified.' },
      { stage: 'Baking in Progress', time: 'Nov 16, 01:15 PM', note: 'Fresh Belgian sponge baked to perfection.' },
      { stage: 'Decoration in Progress', time: 'Nov 16, 03:10 PM', note: 'Piping couverture ganache & 24k gold accents.' }
    ]
  },
  {
    id: 'VC-2026-8792',
    customerId: 'cust-101',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    customerPhone: '+91 98765 43210',
    address: 'House 42, Sector 9, Panchkula, Haryana - 134109',
    deliveryDate: '2026-11-10',
    deliverySlot: '12:00 PM - 3:00 PM (Afternoon)',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    statusIndex: 9, // Delivered
    deliveryPartner: 'Vikram Singh',
    adminNotes: 'Delivered on time in chilled box.',
    createdAt: '2026-11-08 05:40 PM',
    subtotal: 1099,
    deliveryFee: 0,
    discount: 0,
    total: 1099,
    items: [
      {
        name: 'Lotus Biscoff & Salted Caramel Cheesecake',
        weight: '0.5 KG',
        flavour: 'Lotus Biscoff',
        eggless: true,
        qty: 1,
        price: 1099,
        message: 'Congratulations!',
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=300&q=80'
      }
    ],
    timeline: [
      { stage: 'Order Placed', time: 'Nov 08, 05:40 PM', note: 'Order placed online.' },
      { stage: 'Delivered', time: 'Nov 10, 01:20 PM', note: 'Handed over fresh to customer.' }
    ]
  }
];

const INITIAL_CUSTOM_REQUESTS = [
  {
    id: 'REQ-9042',
    customerId: 'cust-101',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    customerPhone: '+91 98765 43210',
    createdAt: '2026-11-16 11:20 AM',
    deliveryDate: '2026-11-19',
    status: 'Quote Sent', // Pending Review | Quote Sent | Quote Accepted | In Production | Completed | Rejected
    base: 'Tiered Cake',
    size: '2 KG',
    flavour: 'Red Velvet',
    filling: 'Nutella',
    toppings: ['Macarons', 'Edible Flowers', 'Gold Decorations'],
    design: 'Floral',
    colourHex: '#F9A8D4',
    colourName: 'Pastel Blush Pink',
    cakeText: 'Happy Anniversary Mom & Dad',
    nameOnCake: 'Rajesh & Meera',
    ageNumber: '25',
    candles: 'Gold Sparkler Candle',
    toppers: 'Acrylic "25 Years of Love" Topper',
    instructions: 'Please keep sweetness balanced and use fresh pastel blush roses on the side cascade.',
    referenceImages: [
      'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=600&q=80'
    ],
    estimatedPrice: 4430,
    quotedPrice: 4250,
    adminNote: 'We have applied a complimentary acrylic topper upgrade! Ready for production once you confirm.'
  }
];

const INITIAL_SAVED_DESIGNS = [
  {
    id: 'DES-501',
    title: 'Pastel Blush Macaron Drip Cake',
    savedAt: '2026-11-14',
    base: 'Round Cake',
    size: '1 KG',
    flavour: 'Strawberry',
    filling: 'Strawberry Filling',
    toppings: ['Macarons', 'Strawberries'],
    design: 'Drip Cake',
    colourHex: '#FBCFE8',
    colourName: 'Rose Blush',
    cakeText: 'Sweet Sixteen Riya',
    estimatedPrice: 2150
  }
];

const CUSTOMER_REVIEWS = [
  {
    id: 1,
    name: 'Meera Kapoor',
    location: 'Chandigarh',
    rating: 5,
    cake: 'Blush Peony Tier Couture Cake',
    text: 'Ordered a 2-tier custom engagement cake with reference photos. Velvet & Crumb replicated every sugar peony down to the rose-gold shading. Guests couldn’t stop raving!',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 2,
    name: 'Rohan Malhotra',
    location: 'Panchkula',
    rating: 5,
    cake: 'Belgian Dark Chocolate Truffle Royale',
    text: 'Hands down the richest eggless Belgian truffle in the Tricity. Delivered in a temperature-controlled van right on schedule for midnight celebration.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 3,
    name: 'Simran Gill',
    location: 'Mohali',
    rating: 5,
    cake: 'Lotus Biscoff & Salted Caramel Cheesecake',
    text: 'The 10-step custom cake studio made designing my daughter’s 1st birthday bento + tier combo effortless. Super responsive team on WhatsApp & dashboard!',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=300&q=80'
  }
];

const INSTAGRAM_POSTS = [
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=500&q=80'
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

const calculateWeightPrice = (basePrice, weight) => {
  const multipliers = { 0.5: 1, 1: 1.85, 1.5: 2.7, 2: 3.5, 3: 5.1, 5: 8.2 };
  return Math.round(basePrice * (multipliers[weight] || 1));
};

// ============================================================================
// INTERACTIVE LIVE CAKE STUDIO SVG PREVIEW COMPONENT
// ============================================================================
const LiveCakePreviewCanvas = ({ config }) => {
  const {
    base,
    flavour,
    filling,
    toppings,
    design,
    colourHex,
    cakeText,
    ageNumber,
    candles
  } = config;

  const isTiered = base === 'Tiered Cake';
  const isHeart = base === 'Heart Shape';
  const isSquare = base === 'Square Cake' || base === 'Rectangle Cake';
  const isBento = base === 'Bento Cake';

  const spongeColor = useMemo(() => {
    if (flavour.includes('Chocolate') || flavour.includes('Black Forest') || flavour.includes('Coffee')) return '#4E342E';
    if (flavour.includes('Red Velvet')) return '#991B1B';
    if (flavour.includes('Strawberry')) return '#F472B6';
    if (flavour.includes('Butterscotch') || flavour.includes('Pineapple')) return '#FBBF24';
    return '#FDE68A';
  }, [flavour]);

  const dripColor = useMemo(() => {
    if (design === 'Drip Cake') return '#3E2723';
    if (design === 'Luxury Cake') return '#D4A373';
    return null;
  }, [design]);

  return (
    <div className="relative w-full bg-gradient-to-b from-[#FCE7F3]/60 via-[#FFFBF7] to-[#F5EBE0] rounded-3xl p-6 border border-[#D4A373]/30 shadow-inner flex flex-col items-center justify-between min-h-[390px]">
      {/* Top Studio Badge */}
      <div className="w-full flex items-center justify-between text-xs">
        <span className="px-3 py-1 rounded-full bg-white/90 text-[#3E2723] font-semibold border border-[#D4A373]/30 flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" /> Live 3D-Style Studio Render
        </span>
        <span className="px-2.5 py-1 rounded-full bg-[#3E2723] text-[#FFFBF7] font-medium">
          {base}
        </span>
      </div>

      {/* Illustrative Interactive Cake SVG */}
      <div className="relative my-2 flex items-center justify-center w-full max-w-[300px] h-[240px] animate-float">
        <svg viewBox="0 0 320 260" className="w-full h-full drop-shadow-xl">
          <defs>
            <linearGradient id="standGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4A373" />
              <stop offset="50%" stopColor="#F3E5AB" />
              <stop offset="100%" stopColor="#B08968" />
            </linearGradient>
            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#3E2723" floodOpacity="0.16" />
            </filter>
          </defs>

          {/* Pedestal Cake Stand */}
          <ellipse cx="160" cy="222" rx="115" ry="16" fill="url(#standGrad)" filter="url(#softShadow)" />
          <rect x="148" y="222" width="24" height="22" rx="4" fill="url(#standGrad)" />
          <ellipse cx="160" cy="245" rx="55" ry="8" fill="#B08968" />

          {/* Bento Box Base if selected */}
          {isBento && (
            <rect x="65" y="135" width="190" height="86" rx="22" fill="#FFFDF9" stroke="#E5E7EB" strokeWidth="3" />
          )}

          {/* Bottom / Main Cake Tier */}
          <g filter="url(#softShadow)">
            {isHeart ? (
              <path
                d="M160 212 C75 175, 65 110, 115 95 C140 88, 155 105, 160 115 C165 105, 180 88, 205 95 C255 110, 245 175, 160 212 Z"
                fill={colourHex}
                stroke="#3E2723"
                strokeOpacity="0.12"
                strokeWidth="2"
              />
            ) : (
              <>
                {/* Main Tier Body */}
                <rect
                  x={isBento ? 85 : 75}
                  y={isTiered ? 132 : 112}
                  width={isBento ? 150 : 170}
                  height={isTiered ? 84 : 102}
                  rx={isSquare ? 8 : 24}
                  fill={colourHex}
                  stroke="#3E2723"
                  strokeOpacity="0.12"
                  strokeWidth="2"
                />
                {/* Sponge Cutaway / Filling Accent Ribbon */}
                <rect
                  x={isBento ? 85 : 75}
                  y={isTiered ? 172 : 160}
                  width={isBento ? 150 : 170}
                  height="6"
                  fill={spongeColor}
                  opacity="0.35"
                />
                {/* Top Ellipse Surface */}
                {!isSquare && (
                  <ellipse
                    cx="160"
                    cy={isTiered ? 132 : 112}
                    rx={isBento ? 75 : 85}
                    ry="16"
                    fill={colourHex}
                    stroke="#FFFFFF"
                    strokeOpacity="0.5"
                    strokeWidth="1.5"
                  />
                )}
              </>
            )}

            {/* Second Upper Tier if Tiered Cake */}
            {isTiered && (
              <g>
                <rect
                  x="105"
                  y="72"
                  width="110"
                  height="60"
                  rx={isSquare ? 6 : 18}
                  fill={colourHex}
                  stroke="#3E2723"
                  strokeOpacity="0.14"
                  strokeWidth="2"
                />
                <ellipse
                  cx="160"
                  cy="72"
                  rx="55"
                  ry="11"
                  fill={colourHex}
                  stroke="#FFFFFF"
                  strokeOpacity="0.6"
                  strokeWidth="1.5"
                />
              </g>
            )}

            {/* Ganache / Gold Drip Effect */}
            {dripColor && !isHeart && (
              <path
                d={
                  isTiered
                    ? 'M105 74 Q115 98 122 82 Q132 106 140 84 Q152 102 162 82 Q175 108 185 83 Q198 98 215 74 Z'
                    : 'M75 114 Q90 148 102 126 Q116 158 130 128 Q146 152 160 126 Q176 160 192 128 Q210 150 225 125 Q236 142 245 114 Z'
                }
                fill={dripColor}
              />
            )}

            {/* Floral or Luxury Garnish Visuals */}
            {(design === 'Floral' || toppings.includes('Edible Flowers')) && (
              <g>
                <circle cx="115" cy={isTiered ? 132 : 114} r="10" fill="#F43F5E" opacity="0.85" />
                <circle cx="132" cy={isTiered ? 136 : 118} r="8" fill="#FB7185" />
                <circle cx="202" cy={isTiered ? 134 : 115} r="9" fill="#F43F5E" opacity="0.85" />
                <circle cx="122" cy={isTiered ? 127 : 109} r="4" fill="#FDE047" />
              </g>
            )}

            {(design === 'Luxury Cake' || toppings.includes('Gold Decorations')) && (
              <g fill="#D4A373">
                <polygon points="95,145 108,138 104,155" opacity="0.9" />
                <polygon points="215,152 228,144 222,165" opacity="0.9" />
                <circle cx="160" cy={isTiered ? 102 : 140} r="4" />
              </g>
            )}

            {/* Toppings Rendering */}
            {toppings.includes('Strawberries') && (
              <g>
                <path d="M135 108 C135 98, 148 98, 148 108 C148 116, 141 120, 141 120 C141 120, 135 116, 135 108 Z" fill="#E11D48" />
                <path d="M172 108 C172 98, 185 98, 185 108 C185 116, 178 120, 178 120 C178 120, 172 116, 172 108 Z" fill="#E11D48" />
              </g>
            )}
            {toppings.includes('Macarons') && (
              <g>
                <rect x="118" y={isTiered ? 62 : 100} width="22" height="10" rx="5" fill="#FBCFE8" stroke="#DB2777" strokeWidth="1" />
                <rect x="180" y={isTiered ? 62 : 100} width="22" height="10" rx="5" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1" />
              </g>
            )}
            {toppings.includes('Ferrero Rocher') && (
              <g>
                <circle cx="148" cy={isTiered ? 66 : 104} r="7" fill="#92400E" stroke="#F59E0B" strokeWidth="1.5" />
                <circle cx="172" cy={isTiered ? 66 : 104} r="7" fill="#92400E" stroke="#F59E0B" strokeWidth="1.5" />
              </g>
            )}

            {/* Candles / Age Number Topper */}
            {(candles !== 'None' || ageNumber) && (
              <g>
                <rect x="157" y={isTiered ? 42 : 80} width="6" height="24" rx="2" fill="#FFFDF9" stroke="#D4A373" strokeWidth="1.5" />
                <path d="M160 30 Q165 37 160 41 Q155 37 160 30 Z" fill="#F59E0B" />
                {ageNumber && (
                  <text x="160" y={isTiered ? 35 : 74} textAnchor="middle" fill="#D4A373" fontWeight="bold" fontSize="16" fontFamily="serif">
                    #{ageNumber}
                  </text>
                )}
              </g>
            )}

            {/* Live Cake Message Plaque */}
            {cakeText && (
              <g>
                <rect x="102" y={isTiered ? 162 : 154} width="116" height="24" rx="12" fill="#FFFBF7" opacity="0.92" stroke="#D4A373" strokeWidth="1" />
                <text
                  x="160"
                  y={isTiered ? 178 : 170}
                  textAnchor="middle"
                  fill="#3E2723"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="Cormorant Garamond, serif"
                >
                  {cakeText.length > 22 ? cakeText.slice(0, 22) + '…' : cakeText}
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* Live Layer Spec Pills */}
      <div className="w-full grid grid-cols-3 gap-2 text-center text-[11px]">
        <div className="bg-white/85 rounded-xl p-2 border border-[#D4A373]/20">
          <span className="block text-[#4E342E]/70">Sponge</span>
          <span className="font-semibold text-[#3E2723] truncate block">{flavour}</span>
        </div>
        <div className="bg-white/85 rounded-xl p-2 border border-[#D4A373]/20">
          <span className="block text-[#4E342E]/70">Filling</span>
          <span className="font-semibold text-[#3E2723] truncate block">{filling}</span>
        </div>
        <div className="bg-white/85 rounded-xl p-2 border border-[#D4A373]/20">
          <span className="block text-[#4E342E]/70">Style</span>
          <span className="font-semibold text-[#3E2723] truncate block">{design}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
function App() {
  // Navigation & Route State
  const [route, setRoute] = useState('/');
  const [selectedProductSlug, setSelectedProductSlug] = useState(null);
  const [selectedOccasionSlug, setSelectedOccasionSlug] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toast, setToast] = useState(null);

  // Core Store Data State (Connected between Storefront, Customer & Admin)
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [customOptions, setCustomOptions] = useState(INITIAL_CUSTOM_OPTIONS);
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [customRequests, setCustomRequests] = useState(INITIAL_CUSTOM_REQUESTS);
  const [savedDesigns, setSavedDesigns] = useState(INITIAL_SAVED_DESIGNS);

  // Shopping Cart & Checkout State
  const [cart, setCart] = useState([
    {
      cartId: 'item-init-1',
      productId: 'prod-1',
      name: 'Belgian Dark Chocolate Truffle Royale',
      weight: 1,
      flavour: '70% Dark Belgian Chocolate',
      eggless: true,
      qty: 1,
      unitPrice: 1663,
      message: 'Happy Birthday!',
      deliveryDate: '2026-11-18',
      deliverySlot: '4:00 PM - 7:00 PM',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
      isCustom: false
    }
  ]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  // Customer Auth & Account State
  const [currentUser, setCurrentUser] = useState({
    id: 'cust-101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    birthday: '1996-08-24',
    addresses: [
      { id: 'addr-1', label: 'Home', line: 'House 42, Sector 9, Panchkula, Haryana', pincode: '134109', landmark: 'Near Rose Garden' },
      { id: 'addr-2', label: 'Office', line: 'Tower B, IT Park, Chandigarh', pincode: '160101', landmark: 'Gate 2' }
    ],
    wishlist: ['prod-1', 'prod-5'],
    notifications: [
      { id: 1, text: 'Your order #VC-2026-8841 is now in Decoration in Progress!', time: '20 mins ago', unread: true },
      { id: 2, text: 'Admin sent a custom quote (₹4,250) for request #REQ-9042.', time: '2 hours ago', unread: true }
    ]
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Notification Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Smooth Scroll to Top on Route Change
  const navigate = (newRoute, param = null) => {
    setRoute(newRoute);
    if (newRoute === '/cakes/detail' && param) setSelectedProductSlug(param);
    if (newRoute === '/occasion' && param) setSelectedOccasionSlug(param);
    setMobileMenuOpen(false);
    setSearchModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Calculations
  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0),
    [cart]
  );
  const cartDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (cartSubtotal < appliedCoupon.minOrder) return 0;
    if (appliedCoupon.type === 'percent') {
      return Math.round((cartSubtotal * appliedCoupon.value) / 100);
    }
    return appliedCoupon.value;
  }, [cartSubtotal, appliedCoupon]);
  const deliveryCharge = cartSubtotal === 0 || cartSubtotal >= 999 ? 0 : 99;
  const finalPayable = Math.max(0, cartSubtotal - cartDiscount + deliveryCharge);
  const totalCartItems = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart]);

  // Add Item to Cart Handler
  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          !i.isCustom &&
          i.productId === item.productId &&
          i.weight === item.weight &&
          i.flavour === item.flavour &&
          i.eggless === item.eggless
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].qty += item.qty || 1;
        return updated;
      }
      return [...prev, { ...item, cartId: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }];
    });
    showToast(`Added "${item.name}" to your pastry bag!`);
  };

  // Toggle Wishlist
  const toggleWishlist = (productId) => {
    if (!currentUser) {
      showToast('Please sign in to save items to your wishlist.', 'info');
      navigate('/login');
      return;
    }
    setCurrentUser((prev) => {
      const exists = prev.wishlist.includes(productId);
      const updated = exists ? prev.wishlist.filter((id) => id !== productId) : [...prev.wishlist, productId];
      showToast(exists ? 'Removed from wishlist' : 'Saved to your wishlist');
      return { ...prev, wishlist: updated };
    });
  };

  const activeHeroBanner = banners.find((b) => b.active) || banners[0];

  // ==========================================================================
  // VIEW 1: ANNOUNCEMENT BAR & GLASSMORPHIC NAVIGATION HEADER
  // ==========================================================================
  const Header = () => (
    <header className="sticky top-0 z-40">
      {/* Top Announcement Bar */}
      <div className="bg-[#3E2723] text-[#FFFBF7] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-center">
          <span className="flex items-center gap-1.5 mx-auto sm:mx-0">
            <Truck className="w-3.5 h-3.5 text-[#D4A373]" />
            Free Chilled Delivery on Orders Above <strong>₹999</strong>
          </span>
          <span className="hidden md:inline text-[#FBCFE8] font-medium">
            ✦ Use Code <strong>SWEET15</strong> for 15% Off First Order ✦
          </span>
          <span className="flex items-center gap-1.5 mx-auto sm:mx-0 text-[#F5EBE0]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
            48-Hour Bespoke Custom Cake Delivery
          </span>
        </div>
      </div>

      {/* Main Glassmorphic Nav */}
      <nav className="bg-[#FFFBF7]/90 backdrop-blur-md border-b border-[#D4A373]/25 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#3E2723] to-[#5D4037] flex items-center justify-center text-[#FCE7F3] shadow-md group-hover:scale-105 transition-transform">
              <Cake className="w-6 h-6 text-[#D4A373]" />
            </div>
            <div>
              <span className="font-serif-luxury text-2xl font-bold tracking-tight text-[#3E2723] block leading-none">
                Velvet & Crumb
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4A373] font-semibold">
                Artisan Patisserie
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#4E342E]">
            <button onClick={() => navigate('/')} className={`hover:text-[#D4A373] transition ${route === '/' ? 'text-[#3E2723] font-bold underline decoration-[#D4A373] decoration-2 underline-offset-8' : ''}`}>
              Home
            </button>
            <button onClick={() => navigate('/cakes')} className={`hover:text-[#D4A373] transition ${route.startsWith('/cakes') ? 'text-[#3E2723] font-bold underline decoration-[#D4A373] decoration-2 underline-offset-8' : ''}`}>
              All Cakes
            </button>
            <button onClick={() => navigate('/birthday-cakes')} className={`hover:text-[#D4A373] transition ${route === '/birthday-cakes' ? 'text-[#3E2723] font-bold underline decoration-[#D4A373] decoration-2 underline-offset-8' : ''}`}>
              Birthday Cakes
            </button>
            <button
              onClick={() => navigate('/custom-cake')}
              className={`px-3.5 py-1.5 rounded-full bg-[#FCE7F3] text-[#3E2723] hover:bg-[#FBCFE8] transition flex items-center gap-1.5 font-semibold ${route === '/custom-cake' ? 'ring-2 ring-[#D4A373]' : ''}`}
            >
              <Wand2 className="w-3.5 h-3.5 text-[#3E2723]" /> Custom Studio
            </button>
            <button onClick={() => navigate('/occasion', 'Anniversary')} className={`hover:text-[#D4A373] transition ${route === '/occasion' ? 'text-[#3E2723] font-bold' : ''}`}>
              Occasions
            </button>
            <button onClick={() => navigate('/track-order')} className={`hover:text-[#D4A373] transition ${route === '/track-order' ? 'text-[#3E2723] font-bold' : ''}`}>
              Track Order
            </button>
            <button onClick={() => navigate('/about')} className={`hover:text-[#D4A373] transition ${route === '/about' ? 'text-[#3E2723] font-bold' : ''}`}>
              About
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              aria-label="Search Cakes"
              className="p-2.5 rounded-full hover:bg-[#F5EBE0] text-[#3E2723] transition"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => navigate('/cart')}
              aria-label="Shopping Bag"
              className="relative p-2.5 rounded-full hover:bg-[#F5EBE0] text-[#3E2723] transition"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#3E2723] text-[#FFFBF7] text-[11px] font-bold flex items-center justify-center shadow">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Customer Profile / Login */}
            <button
              onClick={() => navigate(currentUser ? '/my-account' : '/login')}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#F5EBE0] hover:bg-[#FCE7F3] text-[#3E2723] text-xs font-semibold transition"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">
                {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Admin Portal Quick Switcher */}
            <button
              onClick={() => navigate('/admin')}
              title="Open Bakery Admin Portal"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#3E2723]/20 hover:bg-[#3E2723] hover:text-[#FFFBF7] text-[#3E2723] text-xs font-semibold transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-[#F5EBE0] text-[#3E2723]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FFFBF7] border-t border-[#D4A373]/20 px-6 py-4 space-y-3 shadow-xl">
            {[
              { label: 'Home', path: '/' },
              { label: 'All Cakes Catalogue', path: '/cakes' },
              { label: 'Birthday Cakes', path: '/birthday-cakes' },
              { label: '10-Step Custom Cake Studio', path: '/custom-cake' },
              { label: 'Shop by Occasion', path: '/occasion', param: 'Anniversary' },
              { label: 'Track Live Order', path: '/track-order' },
              { label: 'My Account & Orders', path: currentUser ? '/my-account' : '/login' },
              { label: 'About Velvet & Crumb', path: '/about' },
              { label: 'Contact & Store Info', path: '/contact' },
              { label: 'Admin Dashboard Portal', path: '/admin' }
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path, item.param)}
                className="block w-full text-left py-2 text-sm font-medium text-[#3E2723] hover:text-[#D4A373] border-b border-[#F5EBE0]"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );

  // ==========================================================================
  // PRODUCT CARD COMPONENT (REUSABLE ACROSS HOME & CATALOGUE)
  // ==========================================================================
  const ProductCard = ({ product }) => {
    const [selectedWeight, setSelectedWeight] = useState(product.weights[0]);
    const dynamicPrice = calculateWeightPrice(product.basePrice, selectedWeight);
    const isWishlisted = currentUser?.wishlist?.includes(product.id);

    return (
      <div className="group bg-white rounded-3xl border border-[#F5EBE0] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
        <div>
          {/* Product Image & Badges */}
          <div className="relative aspect-[4/3] overflow-hidden bg-[#F5EBE0]">
            <img
              src={product.images[0]}
              alt={product.name}
              onClick={() => navigate('/cakes/detail', product.slug)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#3E2723]/90 text-[#FFFBF7] text-[11px] font-semibold tracking-wide">
                {product.badge}
              </span>
            )}
            {product.isEgglessAvailable && (
              <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-white/95 text-emerald-800 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> 100% Eggless Option
              </span>
            )}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2 rounded-full shadow-md transition ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/90 text-[#3E2723] hover:bg-[#FCE7F3]'}`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => setQuickViewProduct(product)}
                title="Quick View"
                className="p-2 rounded-full bg-white/90 text-[#3E2723] hover:bg-[#FCE7F3] shadow-md transition"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-5">
            <div className="flex items-center justify-between text-xs text-[#4E342E]/70 mb-1">
              <span>{product.category}</span>
              <span className="flex items-center gap-1 font-semibold text-[#3E2723]">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {product.rating} ({product.reviewsCount})
              </span>
            </div>

            <h3
              onClick={() => navigate('/cakes/detail', product.slug)}
              className="font-serif-luxury text-xl font-bold text-[#3E2723] hover:text-[#D4A373] transition cursor-pointer line-clamp-1"
            >
              {product.name}
            </h3>

            {/* Weight Selector Pills */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.weights.slice(0, 4).map((w) => (
                <button
                  key={w}
                  onClick={() => setSelectedWeight(w)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedWeight === w
                      ? 'bg-[#3E2723] text-[#FFFBF7]'
                      : 'bg-[#F5EBE0] text-[#4E342E] hover:bg-[#FCE7F3]'
                  }`}
                >
                  {w} kg
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Price & Instant Add CTA */}
        <div className="px-5 pb-5 pt-2 border-t border-[#F5EBE0] flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-[#4E342E]/60 block">Price ({selectedWeight} kg)</span>
            <span className="text-lg font-bold text-[#3E2723]">{formatINR(dynamicPrice)}</span>
          </div>
          <button
            disabled={!product.inStock}
            onClick={() =>
              handleAddToCart({
                productId: product.id,
                name: product.name,
                weight: selectedWeight,
                flavour: product.flavours[0],
                eggless: true,
                qty: 1,
                unitPrice: dynamicPrice,
                message: '',
                deliveryDate: '2026-11-18',
                deliverySlot: '4:00 PM - 7:00 PM',
                image: product.images[0],
                isCustom: false
              })
            }
            className="px-4 py-2.5 rounded-full bg-[#FCE7F3] hover:bg-[#3E2723] text-[#3E2723] hover:text-[#FFFBF7] text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.inStock ? 'Add to Bag' : 'Sold Out'}
          </button>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // VIEW 2: HOMEPAGE (ALL 14 SECTIONS A THROUGH N)
  // ==========================================================================
  const HomePage = () => {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const bestSellers = products.filter((p) => p.isBestSeller);
    const featuredCakes = products.filter((p) => p.isFeatured);

    return (
      <div className="space-y-20 pb-20">
        {/* C. HERO BANNER */}
        <section className="relative overflow-hidden bg-[#F5EBE0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#D4A373]/40 text-xs font-semibold text-[#3E2723] shadow-sm">
                <Sparkles className="w-4 h-4 text-[#D4A373]" />
                Handcrafted Small-Batch Luxury Patisserie
              </div>
              <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3E2723] leading-[1.1]">
                {activeHeroBanner.title}
              </h1>
              <p className="text-base sm:text-lg text-[#4E342E]/85 leading-relaxed max-w-xl">
                {activeHeroBanner.subtitle}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => navigate('/cakes')}
                  className="px-7 py-4 rounded-full bg-[#3E2723] hover:bg-[#4E342E] text-[#FFFBF7] font-semibold text-sm shadow-lg hover:shadow-xl transition flex items-center gap-2"
                >
                  {activeHeroBanner.ctaPrimary} <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/custom-cake')}
                  className="px-7 py-4 rounded-full bg-[#FCE7F3] hover:bg-[#FBCFE8] text-[#3E2723] border border-[#D4A373]/40 font-semibold text-sm shadow-sm transition flex items-center gap-2"
                >
                  <Wand2 className="w-4 h-4" /> {activeHeroBanner.ctaSecondary}
                </button>
              </div>
              {/* Trust Badges */}
              <div className="pt-4 grid grid-cols-3 gap-4 max-w-md text-xs text-[#4E342E]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#D4A373] shrink-0" />
                  <span>100% Eggless Kitchen Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#D4A373] shrink-0" />
                  <span>Chilled Doorstep Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#D4A373] shrink-0" />
                  <span>4.9★ Rated by 4,800+ Families</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
                <img
                  src={activeHeroBanner.image}
                  alt="Artisan Celebration Cake"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/40 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#D4A373] font-bold">
                      Chef’s Daily Bake
                    </span>
                    <p className="font-serif-luxury text-lg font-bold text-[#3E2723]">
                      Belgian Dark Chocolate Truffle Royale
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/cakes/detail', 'belgian-dark-chocolate-truffle-royale')}
                    className="px-4 py-2 rounded-full bg-[#3E2723] text-white text-xs font-semibold hover:bg-[#D4A373] transition"
                  >
                    Order ₹899
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* D. SHOP BY CATEGORY */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4A373] font-bold">Curated Flavours</span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#3E2723] mt-1">
                Shop by Signature Category
              </h2>
            </div>
            <button
              onClick={() => navigate('/cakes')}
              className="text-sm font-semibold text-[#3E2723] hover:text-[#D4A373] flex items-center gap-1"
            >
              Explore Full Menu <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate('/cakes')}
                className="group cursor-pointer bg-white rounded-3xl p-3 border border-[#F5EBE0] hover:border-[#D4A373] shadow-sm hover:shadow-lg transition-all"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-3">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="px-2 pb-2">
                  <h3 className="font-serif-luxury text-xl font-bold text-[#3E2723] group-hover:text-[#D4A373] transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#4E342E]/75 mt-0.5">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* E. BIRTHDAY PARTY SECTION */}
        <section className="bg-gradient-to-br from-[#FCE7F3]/70 via-[#FFFBF7] to-[#F5EBE0] py-16 border-y border-[#D4A373]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs font-bold text-[#3E2723] mb-2 shadow-sm">
                  <Gift className="w-3.5 h-3.5 text-[#D4A373]" /> Birthday Celebration Studio
                </span>
                <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#3E2723]">
                  Unforgettable Birthday Party Cakes
                </h2>
                <p className="text-sm text-[#4E342E]/80 mt-1 max-w-xl">
                  From whimsical 1st birthday smash cakes and cartoon themes to minimalist number tarts and complete party combos.
                </p>
              </div>
              <button
                onClick={() => navigate('/birthday-cakes')}
                className="px-6 py-3 rounded-full bg-[#3E2723] text-[#FFFBF7] text-sm font-semibold hover:bg-[#4E342E] transition flex items-center gap-2 self-start md:self-auto shadow"
              >
                Shop Birthday Cakes <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {BIRTHDAY_COLLECTIONS.map((item) => (
                <div
                  key={item.title}
                  onClick={() => navigate('/birthday-cakes')}
                  className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-[#FBCFE8] shadow-sm hover:shadow-xl transition flex items-center gap-4 p-3"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="pr-2">
                    <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FCE7F3] text-[#3E2723] font-bold">
                      {item.tag}
                    </span>
                    <h3 className="font-serif-luxury text-xl font-bold text-[#3E2723] mt-1.5 group-hover:text-[#D4A373] transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#4E342E]/75 mt-1">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* F. SHOP BY OCCASION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4A373] font-bold">Milestones & Moments</span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#3E2723] mt-1">
              Shop by Occasion
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {OCCASIONS.map((occ) => (
              <div
                key={occ.slug}
                onClick={() => navigate('/occasion', occ.slug)}
                className="group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer shadow-md"
              >
                <img
                  src={occ.image}
                  alt={occ.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/85 via-[#3E2723]/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-[#FFFBF7]">
                  <h3 className="font-serif-luxury text-2xl font-bold">{occ.name}</h3>
                  <p className="text-xs text-[#FBCFE8] mt-0.5">{occ.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* G. BEST SELLERS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4A373] font-bold">Patron Favourites</span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#3E2723] mt-1">
                Our Most-Loved Best Sellers
              </h2>
            </div>
            <button
              onClick={() => navigate('/cakes')}
              className="text-sm font-semibold text-[#3E2723] hover:text-[#D4A373] flex items-center gap-1"
            >
              View All Cakes <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* H. CUSTOM CAKE BUILDER BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-[#3E2723] text-[#FFFBF7] p-8 sm:p-12 lg:p-16 shadow-2xl">
            <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-5">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A373]/20 border border-[#D4A373] text-[#FBCFE8] text-xs font-semibold">
                  <Sparkles className="w-4 h-4 text-[#D4A373]" /> Interactive 10-Step Cake Design Studio
                </span>
                <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold leading-tight">
                  Your Imagination, Our Creation
                </h2>
                <p className="text-[#F5EBE0]/90 text-sm sm:text-base max-w-xl leading-relaxed">
                  Choose your shape, tier count, Belgian sponge, gourmet fillings, colours, and toppings with a live visual preview — or upload Pinterest/Instagram inspiration photos for a bespoke quote.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => navigate('/custom-cake')}
                    className="px-7 py-4 rounded-full bg-[#FCE7F3] hover:bg-white text-[#3E2723] font-bold text-sm transition flex items-center gap-2 shadow-lg"
                  >
                    <Wand2 className="w-4 h-4" /> Design Your Cake
                  </button>
                  <button
                    onClick={() => navigate('/custom-cake')}
                    className="px-7 py-4 rounded-full bg-transparent border border-[#D4A373] hover:bg-[#D4A373]/20 text-[#FFFBF7] font-semibold text-sm transition flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" /> Upload Your Dream Cake
                  </button>
                </div>
                <p className="text-xs text-[#D4A373] flex items-center gap-1.5 pt-1">
                  <Clock className="w-4 h-4" />
                  Custom cake delivery within 48 hours, subject to design confirmation and slot availability.
                </p>
              </div>
              <div className="lg:col-span-5">
                <div className="rounded-3xl overflow-hidden border-2 border-[#D4A373]/40 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80"
                    alt="Custom Designer Cake"
                    className="w-full h-72 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* I. FEATURED CHEF'S COLLECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4A373] font-bold">New Arrivals & Trending</span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#3E2723] mt-1">
              Chef’s Signature & Couture Collection
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCakes.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* J. HOW IT WORKS (4 STEPS) */}
        <section className="bg-[#F5EBE0]/70 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4A373] font-bold">Seamless Experience</span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#3E2723] mt-1">
                How Velvet & Crumb Works
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Choose Your Cake', desc: 'Browse signature gourmet cakes or open our 10-step Custom Studio.', icon: Cake },
                { step: '02', title: 'Customize Design', desc: 'Select weight, eggless preference, message plaque, or upload reference photos.', icon: Palette },
                { step: '03', title: 'Place Your Order', desc: 'Pick your preferred delivery date & time slot with secure Razorpay/UPI checkout.', icon: CreditCard },
                { step: '04', title: 'Get It Delivered Fresh', desc: 'Track all 10 live baking stages until chilled doorstep arrival.', icon: Truck }
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-3xl p-6 border border-[#D4A373]/20 shadow-sm relative">
                  <span className="font-serif-luxury text-4xl font-bold text-[#FCE7F3] absolute top-4 right-5">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#FCE7F3] text-[#3E2723] flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-luxury text-xl font-bold text-[#3E2723]">{item.title}</h3>
                  <p className="text-xs text-[#4E342E]/80 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* K. CUSTOMER REVIEWS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4A373] font-bold">Sweet Testimonials</span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#3E2723] mt-1">
              Loved Across Celebrations
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {CUSTOMER_REVIEWS.map((rev) => (
              <div key={rev.id} className="bg-white rounded-3xl p-6 border border-[#F5EBE0] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-[#4E342E] italic leading-relaxed">"{rev.text}"</p>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#F5EBE0]">
                  <img src={rev.image} alt={rev.cake} className="w-12 h-12 rounded-2xl object-cover" />
                  <div>
                    <h4 className="font-bold text-sm text-[#3E2723]">{rev.name}</h4>
                    <span className="text-xs text-[#D4A373] block">{rev.cake} • {rev.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* L. INSTAGRAM GALLERY */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4A373] font-bold">@velvetandcrumb.in</span>
              <h2 className="font-serif-luxury text-3xl font-bold text-[#3E2723]">From Our Patisserie Feed</h2>
            </div>
            <span className="text-xs font-semibold text-[#4E342E] flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#D4A373]" /> Tag #VelvetAndCrumb
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {INSTAGRAM_POSTS.map((img, i) => (
              <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden">
                <img src={img} alt="Patisserie Instagram" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-[#3E2723]/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* M. NEWSLETTER SUBSCRIPTION */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-[2.5rem] bg-gradient-to-r from-[#FCE7F3] via-[#F5EBE0] to-[#FCE7F3] p-8 sm:p-12 text-center border border-[#D4A373]/30">
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#3E2723]">
              Join the Sweet List
            </h2>
            <p className="text-sm text-[#4E342E]/85 mt-2 max-w-lg mx-auto">
              Receive seasonal menu previews, festive tasting invitations, and an instant <strong>15% welcome voucher</strong>.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newsletterEmail) return;
                showToast('Welcome to Velvet & Crumb! Use code SWEET15 at checkout.');
                setNewsletterEmail('');
              }}
              className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 px-5 py-3.5 rounded-full bg-white border border-[#D4A373]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E2723]"
              />
              <button
                type="submit"
                className="px-7 py-3.5 rounded-full bg-[#3E2723] text-[#FFFBF7] text-sm font-semibold hover:bg-[#4E342E] transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    );
  };

  // ==========================================================================
  // VIEW 3: ALL CAKES CATALOGUE, BIRTHDAY CAKES & OCCASIONS (/cakes)
  // ==========================================================================
  const CataloguePage = ({ mode = 'all' }) => {
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedOccasion, setSelectedOccasion] = useState(
      mode === 'birthday' ? 'Birthday' : mode === 'occasion' && selectedOccasionSlug ? selectedOccasionSlug : 'All'
    );
    const [maxPrice, setMaxPrice] = useState(3000);
    const [egglessOnly, setEgglessOnly] = useState(false);
    const [sortBy, setSortBy] = useState('popularity');

    useEffect(() => {
      if (mode === 'birthday') setSelectedOccasion('Birthday');
      else if (mode === 'occasion' && selectedOccasionSlug) setSelectedOccasion(selectedOccasionSlug);
      else setSelectedOccasion('All');
    }, [mode, selectedOccasionSlug]);

    const filteredProducts = useMemo(() => {
      return products
        .filter((p) => {
          const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
          const matchesOccasion = selectedOccasion === 'All' || p.occasion.includes(selectedOccasion);
          const matchesPrice = p.basePrice <= maxPrice;
          const matchesEggless = !egglessOnly || p.isEgglessAvailable;
          return matchesSearch && matchesCategory && matchesOccasion && matchesPrice && matchesEggless;
        })
        .sort((a, b) => {
          if (sortBy === 'price-low') return a.basePrice - b.basePrice;
          if (sortBy === 'price-high') return b.basePrice - a.basePrice;
          if (sortBy === 'newest') return b.id.localeCompare(a.id);
          return b.reviewsCount - a.reviewsCount;
        });
    }, [products, searchQuery, selectedCategory, selectedOccasion, maxPrice, egglessOnly, sortBy]);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Page Banner Header */}
        <div className="rounded-3xl bg-gradient-to-r from-[#FCE7F3] to-[#F5EBE0] p-8 mb-8 border border-[#D4A373]/30">
          <span className="text-xs uppercase tracking-widest text-[#D4A373] font-bold">Artisan Bakery Catalogue</span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#3E2723] mt-1">
            {mode === 'birthday'
              ? 'Birthday Celebration Cakes'
              : mode === 'occasion'
              ? `${selectedOccasion} Collection`
              : 'All Handcrafted Cakes'}
          </h1>
          <p className="text-sm text-[#4E342E]/85 mt-2 max-w-2xl">
            Freshly baked to order with customizable weights, 100% eggless options, and complimentary chocolate message plaques.
          </p>
        </div>

        {/* Occasion Quick Pills if in Occasion Mode */}
        {mode === 'occasion' && (
          <div className="flex flex-wrap gap-2 mb-6">
            {OCCASIONS.map((o) => (
              <button
                key={o.slug}
                onClick={() => navigate('/occasion', o.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                  selectedOccasion === o.slug
                    ? 'bg-[#3E2723] text-white'
                    : 'bg-white border border-[#D4A373]/30 text-[#3E2723] hover:bg-[#FCE7F3]'
                }`}
              >
                {o.name}
              </button>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Filter Sidebar */}
          <aside className="lg:col-span-3 space-y-6 bg-white p-6 rounded-3xl border border-[#F5EBE0] h-fit">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-luxury text-xl font-bold text-[#3E2723] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#D4A373]" /> Refine Cakes
              </h3>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedOccasion('All');
                  setMaxPrice(3000);
                  setEgglessOnly(false);
                }}
                className="text-xs text-[#D4A373] font-semibold hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Search Input */}
            <div>
              <label className="text-xs font-bold text-[#3E2723] block mb-2">Search Flavour or Cake</label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#4E342E]/50 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Truffle, Biscoff..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/30 text-xs focus:outline-none focus:border-[#3E2723]"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs font-bold text-[#3E2723] block mb-2">Cake Category</label>
              <div className="space-y-1.5">
                {['All', ...CATEGORIES.map((c) => c.id)].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition ${
                      selectedCategory === cat
                        ? 'bg-[#3E2723] text-white'
                        : 'text-[#4E342E] hover:bg-[#F5EBE0]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion Filter */}
            <div>
              <label className="text-xs font-bold text-[#3E2723] block mb-2">Occasion</label>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/30 text-xs font-medium text-[#3E2723]"
              >
                <option value="All">All Occasions</option>
                {OCCASIONS.map((o) => (
                  <option key={o.slug} value={o.slug}>{o.name}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between text-xs font-bold text-[#3E2723] mb-2">
                <span>Max Starting Price</span>
                <span>{formatINR(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="500"
                max="3000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#3E2723]"
              />
            </div>

            {/* Eggless Toggle */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#FFFBF7] border border-[#D4A373]/30 cursor-pointer">
              <span className="text-xs font-bold text-[#3E2723]">100% Eggless Only</span>
              <input
                type="checkbox"
                checked={egglessOnly}
                onChange={(e) => setEgglessOnly(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>
          </aside>

          {/* Right Product Grid / List */}
          <div className="lg:col-span-9 space-y-6">
            {/* Sort & View Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#F5EBE0]">
              <span className="text-xs font-semibold text-[#4E342E]">
                Showing <strong>{filteredProducts.length}</strong> freshly baked creations
              </span>
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/30 text-xs font-semibold text-[#3E2723]"
                >
                  <option value="popularity">Sort: Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <div className="flex items-center bg-[#F5EBE0] rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow text-[#3E2723]' : 'text-[#4E342E]'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-white shadow text-[#3E2723]' : 'text-[#4E342E]'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#F5EBE0]">
                <Cake className="w-12 h-12 text-[#D4A373] mx-auto mb-3" />
                <h3 className="font-serif-luxury text-2xl font-bold text-[#3E2723]">No exact matches found</h3>
                <p className="text-sm text-[#4E342E]/75 mt-1">
                  Try adjusting your filters or design your exact dream cake in our Custom Studio!
                </p>
                <button
                  onClick={() => navigate('/custom-cake')}
                  className="mt-4 px-6 py-3 rounded-full bg-[#3E2723] text-white text-xs font-semibold"
                >
                  Open Custom Cake Studio
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl p-4 border border-[#F5EBE0] flex flex-col sm:flex-row gap-5 items-center shadow-sm"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      onClick={() => navigate('/cakes/detail', product.slug)}
                      className="w-full sm:w-48 h-40 rounded-2xl object-cover cursor-pointer"
                    />
                    <div className="flex-1 space-y-2">
                      <span className="text-xs font-semibold text-[#D4A373]">{product.category}</span>
                      <h3
                        onClick={() => navigate('/cakes/detail', product.slug)}
                        className="font-serif-luxury text-2xl font-bold text-[#3E2723] cursor-pointer hover:text-[#D4A373]"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#4E342E]/80 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-lg font-bold text-[#3E2723]">
                          From {formatINR(product.basePrice)}
                        </span>
                        <button
                          onClick={() => navigate('/cakes/detail', product.slug)}
                          className="px-5 py-2.5 rounded-full bg-[#3E2723] text-white text-xs font-semibold hover:bg-[#D4A373] transition"
                        >
                          Customize & Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // VIEW 4: SINGLE CAKE PRODUCT DETAILS PAGE (/cakes/:slug)
  // ==========================================================================
  const ProductDetailPage = () => {
    const product = products.find((p) => p.slug === selectedProductSlug) || products[0];
    const [activeImgIdx, setActiveImgIdx] = useState(0);
    const [weight, setWeight] = useState(product.weights[0]);
    const [flavour, setFlavour] = useState(product.flavours[0]);
    const [eggless, setEggless] = useState(true);
    const [qty, setQty] = useState(1);
    const [cakeMessage, setCakeMessage] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('2026-11-18');
    const [deliverySlot, setDeliverySlot] = useState('4:00 PM - 7:00 PM (Evening)');

    useEffect(() => {
      setActiveImgIdx(0);
      setWeight(product.weights[0]);
      setFlavour(product.flavours[0]);
    }, [product]);

    const unitPrice = calculateWeightPrice(product.basePrice, weight);

    const buildCartPayload = () => ({
      productId: product.id,
      name: product.name,
      weight,
      flavour,
      eggless,
      qty,
      unitPrice,
      message: cakeMessage,
      deliveryDate,
      deliverySlot,
      image: product.images[0],
      isCustom: false
    });

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#4E342E]/70 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-[#3E2723]">Home</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => navigate('/cakes')} className="hover:text-[#3E2723]">Cakes</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#3E2723] font-semibold">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 bg-white p-6 sm:p-10 rounded-[2.5rem] border border-[#F5EBE0] shadow-sm">
          {/* Left Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-[#F5EBE0] border border-[#D4A373]/20">
              <img
                src={product.images[activeImgIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIdx(i)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition ${
                      activeImgIdx === i ? 'border-[#3E2723] scale-105' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Configuration & Checkout */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#FCE7F3] text-[#3E2723] text-xs font-bold">
                  {product.category}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-[#3E2723]">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {product.rating} ({product.reviewsCount} Reviews)
                </span>
              </div>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#3E2723]">
                {product.name}
              </h1>
              <p className="text-sm text-[#4E342E]/85 mt-3 leading-relaxed">{product.description}</p>
            </div>

            {/* Dynamic Price Display */}
            <div className="p-4 rounded-2xl bg-[#FFFBF7] border border-[#D4A373]/30 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#4E342E]/70 block">Total Price for {weight} KG</span>
                <span className="text-3xl font-bold text-[#3E2723]">{formatINR(unitPrice * qty)}</span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                In Stock • Freshly Baked
              </span>
            </div>

            {/* Weight Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#3E2723] block mb-2">
                1. Select Cake Weight
              </label>
              <div className="flex flex-wrap gap-2">
                {product.weights.map((w) => (
                  <button
                    key={w}
                    onClick={() => setWeight(w)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
                      weight === w
                        ? 'bg-[#3E2723] text-white border-[#3E2723]'
                        : 'bg-white text-[#3E2723] border-[#D4A373]/40 hover:bg-[#FCE7F3]'
                    }`}
                  >
                    {w} KG ({formatINR(calculateWeightPrice(product.basePrice, w))})
                  </button>
                ))}
              </div>
            </div>

            {/* Flavour & Eggless Toggle */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#3E2723] block mb-2">
                  2. Select Sponge Flavour
                </label>
                <select
                  value={flavour}
                  onChange={(e) => setFlavour(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs font-semibold text-[#3E2723]"
                >
                  {product.flavours.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#3E2723] block mb-2">
                  3. Dietary Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setEggless(true)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                      eggless ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-[#3E2723] border-[#D4A373]/40'
                    }`}
                  >
                    100% Eggless
                  </button>
                  <button
                    onClick={() => setEggless(false)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                      !eggless ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-[#3E2723] border-[#D4A373]/40'
                    }`}
                  >
                    Classic (With Egg)
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Cake Message */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#3E2723] block mb-2">
                4. Message on Chocolate Plaque (Optional)
              </label>
              <input
                type="text"
                maxLength={40}
                value={cakeMessage}
                onChange={(e) => setCakeMessage(e.target.value)}
                placeholder="e.g. Happy Birthday Aarav!"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs"
              />
            </div>

            {/* Delivery Date & Time Slot */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#3E2723] block mb-2">
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#3E2723] block mb-2">
                  Preferred Time Slot
                </label>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs font-semibold"
                >
                  <option>10:00 AM - 1:00 PM (Morning)</option>
                  <option>1:00 PM - 4:00 PM (Afternoon)</option>
                  <option>4:00 PM - 7:00 PM (Evening)</option>
                  <option>7:00 PM - 10:00 PM (Dinner)</option>
                  <option>11:30 PM - 12:15 AM (Midnight Surprise)</option>
                </select>
              </div>
            </div>

            {/* Quantity + Add to Cart + Buy Now */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center border border-[#D4A373]/50 rounded-full px-2 py-1 bg-[#FFFBF7]">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 text-[#3E2723]">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 text-sm font-bold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-2 text-[#3E2723]">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(buildCartPayload())}
                className="flex-1 py-3.5 px-6 rounded-full bg-[#FCE7F3] hover:bg-[#FBCFE8] text-[#3E2723] font-bold text-sm transition flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </button>

              <button
                onClick={() => {
                  handleAddToCart(buildCartPayload());
                  navigate('/checkout');
                }}
                className="flex-1 py-3.5 px-6 rounded-full bg-[#3E2723] hover:bg-[#4E342E] text-white font-bold text-sm transition shadow-lg"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // VIEW 5: 10-STEP INTERACTIVE CUSTOM CAKE STUDIO (/custom-cake)
  // ==========================================================================
  const CustomCakeStudioPage = () => {
    const [step, setStep] = useState(1);
    const [config, setConfig] = useState({
      base: 'Round Cake',
      size: '1 KG',
      flavour: 'Chocolate',
      filling: 'Chocolate Ganache',
      toppings: ['Strawberries', 'Macarons'],
      design: 'Drip Cake',
      colourName: 'Pastel Blush Pink',
      colourHex: '#F9A8D4',
      cakeText: 'Happy Celebration',
      nameOnCake: '',
      ageNumber: '',
      candles: 'Gold Sparkler Candle',
      toppers: 'Happy Birthday Acrylic Topper',
      instructions: '',
      referenceImages: [],
      designDescription: '',
      expectedDeliveryDate: '2026-11-19'
    });

    const stepsList = [
      '1. Cake Base',
      '2. Size & Servings',
      '3. Sponge Flavour',
      '4. Gourmet Filling',
      '5. Toppings',
      '6. Design Style',
      '7. Colour Palette',
      '8. Text & Toppers',
      '9. Reference Photos',
      '10. Review & Quote'
    ];

    // Dynamic Price Calculation Engine
    const estimatedPrice = useMemo(() => {
      const sizeObj = customOptions.sizes.find((s) => s.id === config.size) || customOptions.sizes[1];
      const baseObj = customOptions.bases.find((b) => b.id === config.base) || { price: 0 };
      const flavObj = customOptions.flavours.find((f) => f.id === config.flavour) || { price: 0 };
      const fillObj = customOptions.fillings.find((f) => f.id === config.filling) || { price: 0 };
      const designObj = customOptions.designs.find((d) => d.id === config.design) || { price: 0 };
      const toppingsTotal = config.toppings.reduce((sum, tId) => {
        const tObj = customOptions.toppings.find((t) => t.id === tId);
        return sum + (tObj ? tObj.price : 0);
      }, 0);
      const extras = (config.candles !== 'None' ? 60 : 0) + (config.toppers !== 'None' ? 120 : 0);

      return Math.max(599, sizeObj.basePrice + baseObj.price + flavObj.price + fillObj.price + designObj.price + toppingsTotal + extras);
    }, [config, customOptions]);

    const toggleTopping = (id) => {
      setConfig((prev) => ({
        ...prev,
        toppings: prev.toppings.includes(id)
          ? prev.toppings.filter((t) => t !== id)
          : [...prev.toppings, id]
      }));
    };

    const handleImageUpload = (e) => {
      const files = Array.from(e.target.files || []);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setConfig((prev) => ({
            ...prev,
            referenceImages: [...prev.referenceImages, reader.result]
          }));
        };
        reader.readAsDataURL(file);
      });
    };

    const handleSaveDesign = () => {
      const newDesign = {
        id: `DES-${Math.floor(100 + Math.random() * 900)}`,
        title: `${config.colourName} ${config.design} (${config.flavour})`,
        savedAt: new Date().toISOString().slice(0, 10),
        ...config,
        estimatedPrice
      };
      setSavedDesigns((prev) => [newDesign, ...prev]);
      showToast('Custom cake design saved to your account!');
    };

    const handleSubmitCustomQuote = () => {
      const newReq = {
        id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
        customerId: currentUser?.id || 'guest',
        customerName: currentUser?.name || 'Guest Patron',
        customerEmail: currentUser?.email || 'patron@example.com',
        customerPhone: currentUser?.phone || '+91 98765 43210',
        createdAt: new Date().toLocaleString(),
        deliveryDate: config.expectedDeliveryDate,
        status: 'Pending Review',
        ...config,
        estimatedPrice,
        quotedPrice: null,
        adminNote: ''
      };
      setCustomRequests((prev) => [newReq, ...prev]);
      showToast(`Custom Cake Quote Request #${newReq.id} submitted! Track it in your dashboard.`);
      navigate('/my-account');
    };

    const handleAddCustomCakeToCart = () => {
      handleAddToCart({
        productId: 'custom-studio-cake',
        name: `Bespoke ${config.design} (${config.base})`,
        weight: config.size,
        flavour: `${config.flavour} + ${config.filling}`,
        eggless: true,
        qty: 1,
        unitPrice: estimatedPrice,
        message: config.cakeText,
        deliveryDate: config.expectedDeliveryDate,
        deliverySlot: '4:00 PM - 7:00 PM',
        image: config.referenceImages[0] || 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=400&q=80',
        isCustom: true,
        customSpecs: config
      });
      navigate('/cart');
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Studio Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCE7F3] text-xs font-bold text-[#3E2723]">
              <Wand2 className="w-3.5 h-3.5 text-[#D4A373]" /> Velvet & Crumb Bespoke Atelier
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#3E2723] mt-1">
              10-Step Custom Cake Design Studio
            </h1>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl border border-[#D4A373]/40 shadow-sm text-right">
            <span className="text-xs text-[#4E342E]/70 block">Live Estimated Price</span>
            <span className="text-2xl font-bold text-[#3E2723]">{formatINR(estimatedPrice)}</span>
          </div>
        </div>

        {/* 10-Step Progress Bar */}
        <div className="flex overflow-x-auto gap-2 pb-3 mb-8 no-scrollbar">
          {stepsList.map((label, idx) => {
            const stepNum = idx + 1;
            const active = step === stepNum;
            const completed = step > stepNum;
            return (
              <button
                key={label}
                onClick={() => setStep(stepNum)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#3E2723] text-[#FFFBF7] shadow'
                    : completed
                    ? 'bg-[#FCE7F3] text-[#3E2723]'
                    : 'bg-white text-[#4E342E]/70 border border-[#F5EBE0]'
                }`}
              >
                {completed && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                {label}
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: STICKY LIVE CAKE PREVIEW */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
            <LiveCakePreviewCanvas config={config} />

            {/* Quick Summary Card */}
            <div className="bg-white rounded-3xl p-5 border border-[#F5EBE0] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#4E342E]/75">Shape & Size:</span>
                <span className="font-bold text-[#3E2723]">{config.base} • {config.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4E342E]/75">Frosting Hue:</span>
                <span className="font-bold text-[#3E2723] flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full inline-block border" style={{ backgroundColor: config.colourHex }} />
                  {config.colourName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4E342E]/75">Selected Toppings:</span>
                <span className="font-bold text-[#3E2723] text-right max-w-[200px] truncate">
                  {config.toppings.length ? config.toppings.join(', ') : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: INTERACTIVE STEP CONTROLS */}
          <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-6 sm:p-10 border border-[#F5EBE0] shadow-sm min-h-[480px] flex flex-col justify-between">
            <div>
              {/* STEP 1: CAKE BASE */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="font-serif-luxury text-3xl font-bold text-[#3E2723]">Step 1: Select Cake Base & Silhouette</h2>
                  <p className="text-xs text-[#4E342E]/80">Choose the structural shape of your celebration cake.</p>
                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    {customOptions.bases.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setConfig({ ...config, base: b.id })}
                        className={`p-4 rounded-2xl border-2 text-left transition ${
                          config.base === b.id ? 'border-[#3E2723] bg-[#FCE7F3]/40' : 'border-[#F5EBE0] hover:border-[#D4A373]'
                        }`}
                      >
                        <div className="flex justify-between items-center font-bold text-sm text-[#3E2723]">
                          <span>{b.label}</span>
                          <span className="text-xs text-[#D4A373]">
                            {b.price === 0 ? 'Included' : b.price > 0 ? `+${formatINR(b.price)}` : formatINR(b.price)}
                          </span>
                        </div>
                        <p className="text-xs text-[#4E342E]/75 mt-1">{b.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: SIZE */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="font-serif-luxury text-3xl font-bold text-[#3E2723]">Step 2: Select Weight & Guest Servings</h2>
                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    {customOptions.sizes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setConfig({ ...config, size: s.id })}
                        className={`p-4 rounded-2xl border-2 text-left transition ${
                          config.size === s.id ? 'border-[#3E2723] bg-[#FCE7F3]/40' : 'border-[#F5EBE0] hover:border-[#D4A373]'
                        }`}
                      >
                        <div className="font-bold text-sm text-[#3E2723]">{s.label}</div>
                        <div className="text-xs text-[#D4A373] font-semibold mt-1">Base starts at {formatINR(s.basePrice)}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: FLAVOUR */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="font-serif-luxury text-3xl font-bold text-[#3E2723]">Step 3: Choose Artisan Sponge Flavour</h2>
                  <div className="grid sm:grid-cols-3 gap-3 pt-2">
                    {customOptions.flavours.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setConfig({ ...config, flavour: f.id })}
                        className={`p-4 rounded-2xl border-2 text-left transition ${
                          config.flavour === f.id ? 'border-[#3E2723] bg-[#FCE7F3]/40' : 'border-[#F5EBE0] hover:border-[#D4A373]'
                        }`}
                      >
                        <div className="font-bold text-sm text-[#3E2723]">{f.label}</div>
                        <div className="text-xs text-[#D4A373] mt-1">{f.price === 0 ? 'Included' : `+${formatINR(f.price)}`}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: FILLING */}
              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="font-serif-luxury text-3xl font-bold text-[#3E2723]">Step 4: Select Inner Layer Filling</h2>
                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    {customOptions.fillings.map((fill) => (
                      <button
                        key={fill.id}
                        onClick={() => setConfig({ ...config, filling: fill.id })}
                        className={`p-4 rounded-2xl border-2 text-left transition ${
                          config.filling === fill.id ? 'border-[#3E2723] bg-[#FCE7F3]/40' : 'border-[#F5EBE0] hover:border-[#D4A373]'
                        }`}
                      >
                        <div className="flex justify-between font-bold text-sm text-[#3E2723]">
                          <span>{fill.label}</span>
                          <span className="text-xs text-[#D4A373]">{fill.price === 0 ? 'Included' : `+${formatINR(fill.price)}`}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: TOPPINGS (MULTI-SELECT) */}
              {step === 5 && (
                <div className="space-y-4">
                  <h2 className="font-serif-luxury text-3xl font-bold text-[#3E2723]">Step 5: Gourmet Toppings & Garnishes</h2>
                  <p className="text-xs text-[#4E342E]/80">Select multiple toppings to crown your cake.</p>
                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    {customOptions.toppings.map((top) => {
                      const selected = config.toppings.includes(top.id);
                      return (
                        <button
                          key={top.id}
                          onClick={() => toggleTopping(top.id)}
                          className={`p-3.5 rounded-2xl border-2 text-left transition flex items-center justify-between ${
                            selected ? 'border-[#3E2723] bg-[#FCE7F3]/50' : 'border-[#F5EBE0] hover:border-[#D4A373]'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-sm text-[#3E2723] block">{top.label}</span>
                            <span className="text-xs text-[#D4A373]">+{formatINR(top.price)}</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selected ? 'bg-[#3E2723] text-white' : 'border border-[#D4A373]'}`}>
                            {selected && <Check className="w-3 h-3" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 6: CAKE DESIGN */}
              {step === 6 && (
                <div className="space-y-4">
                  <h2 className="font-serif-luxury text-3xl font-bold text-[#3E2723]">Step 6: Select Aesthetic Design Style</h2>
                  <div className="grid sm:grid-cols-3 gap-3 pt-2">
                    {customOptions.designs.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setConfig({ ...config, design: d.id })}
                        className={`p-4 rounded-2xl border-2 text-left transition ${
                          config.design === d.id ? 'border-[#3E2723] bg-[#FCE7F3]/40' : 'border-[#F5EBE0] hover:border-[#D4A373]'
                        }`}
                      >
                        <div className="font-bold text-sm text-[#3E2723]">{d.label}</div>
                        <div className="text-xs text-[#D4A373] mt-1">{d.price === 0 ? 'Included' : `+${formatINR(d.price)}`}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: COLOUR PALETTE */}
              {step === 7 && (
                <div className="space-y-5">
                  <h2 className="font-serif-luxury text-3xl font-bold text-[#3E2723]">Step 7: Frosting Colour Palette</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {customOptions.colours.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setConfig({ ...config, colourName: c.label, colourHex: c.hex })}
                        className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition ${
                          config.colourHex === c.hex ? 'border-[#3E2723] bg-[#FCE7F3]/40' : 'border-[#F5EBE0]'
                        }`}
                      >
                        <span className="w-7 h-7 rounded-full border border-black/15 shrink-0" style={{ backgroundColor: c.hex }} />
                        <span className="text-xs font-bold text-[#3E2723] text-left">{c.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FFFBF7] border border-[#D4A373]/30 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#3E2723] block">Custom Hex Colour Picker</span>
                      <span className="text-[11px] text-[#4E342E]/70">Match your exact event decor theme</span>
                    </div>
                    <input
                      type="color"
                      value={config.colourHex}
                      onChange={(e) => setConfig({ ...config, colourHex: e.target.value, colourName: `Custom (${e.target.value})` })}
                      className="w-12 h-10 rounded-lg cursor-pointer border-0"
                    />
                  </div>
                </div>
              )}

              {/* STEP 8: ADDITIONAL CUSTOMIZATION */}
              {step === 8 && (
                <div className="space-y-4">
                  <h2 className="font-serif-luxury text-3xl font-bold text-[#3E2723]">Step 8: Inscription, Candles & Toppers</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#3E2723] block mb-1">Message on Cake</label>
                      <input
                        type="text"
                        value={config.cakeText}
                        onChange={(e) => setConfig({ ...config, cakeText: e.target.value })}
                        placeholder="Happy Birthday / Anniversary..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#3E2723] block mb-1">Recipient Name</label>
                      <input
                        type="text"
                        value={config.nameOnCake}
                        onChange={(e) => setConfig({ ...config, nameOnCake: e.target.value })}
                        placeholder="e.g. Ananya"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#3E2723] block mb-1">Age / Milestone Number</label>
                      <input
                        type="text"
                        value={config.ageNumber}
                        onChange={(e) => setConfig({ ...config, ageNumber: e.target.value })}
                        placeholder="e.g. 1, 18, 25, 50"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#3E2723] block mb-1">Candles (+₹60)</label>
                      <select
                        value={config.candles}
                        onChange={(e) => setConfig({ ...config, candles: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs"
                      >
                        <option value="Gold Sparkler Candle">Gold Sparkler Candle</option>
                        <option value="Tall Metallic Pastel Candles">Tall Metallic Pastel Candles</option>
                        <option value="Number Candle">Milestone Number Candle</option>
                        <option value="None">No Candles</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-[#3E2723] block mb-1">Cake Topper (+₹120)</label>
                      <select
                        value={config.toppers}
                        onChange={(e) => setConfig({ ...config, toppers: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs"
                      >
                        <option value="Happy Birthday Acrylic Topper">Gold Acrylic "Happy Birthday"</option>
                        <option value="Happy Anniversary Acrylic Topper">Rose Gold "Happy Anniversary"</option>
                        <option value="Bride To Be Topper">Script "Bride To Be"</option>
                        <option value="Oh Baby Topper">Pastel "Oh Baby"</option>
                        <option value="None">No Topper</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-[#3E2723] block mb-1">Chef Special Instructions</label>
                      <textarea
                        rows={2}
                        value={config.instructions}
                        onChange={(e) => setConfig({ ...config, instructions: e.target.value })}
                        placeholder="Allergy notes, sugar level, or piping placement details..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 9: UPLOAD REFERENCE IMAGE */}
              {step === 9 && (
                <div className="space-y-4">
                  <h2 className="font-serif-luxury text-3xl font-bold text-[#3E2723]">Step 9: Upload Cake Inspiration & Reference Photos</h2>
                  <div className="p-4 rounded-2xl bg-[#FCE7F3]/50 border border-[#D4A373]/40 text-xs text-[#3E2723] flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
                    <span>
                      <strong>"Our team will review your reference image and confirm the final design and price before production."</strong>
                    </span>
                  </div>

                  <label className="border-2 border-dashed border-[#D4A373] rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#FFFBF7] transition">
                    <Upload className="w-10 h-10 text-[#D4A373] mb-2" />
                    <span className="text-sm font-bold text-[#3E2723]">Click to Upload Cake Reference Photos</span>
                    <span className="text-xs text-[#4E342E]/70 mt-1">Supports PNG, JPG, WEBP (Multiple inspiration images allowed)</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  </label>

                  {config.referenceImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {config.referenceImages.map((src, idx) => (
                        <div key={idx} className="relative rounded-2xl overflow-hidden border border-[#D4A373]/40 aspect-square">
                          <img src={src} alt="Reference" className="w-full h-full object-cover" />
                          <button
                            onClick={() =>
                              setConfig((prev) => ({
                                ...prev,
                                referenceImages: prev.referenceImages.filter((_, i) => i !== idx)
                              }))
                            }
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white shadow"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-xs font-bold text-[#3E2723] block mb-1">Expected Delivery Date (48h+)</label>
                      <input
                        type="date"
                        value={config.expectedDeliveryDate}
                        onChange={(e) => setConfig({ ...config, expectedDeliveryDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#3E2723] block mb-1">Design Notes for Pastry Artist</label>
                      <input
                        type="text"
                        value={config.designDescription}
                        onChange={(e) => setConfig({ ...config, designDescription: e.target.value })}
                        placeholder="Describe tiers, figurines, or floral placement..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 10: FINAL PREVIEW & PRICING */}
              {step === 10 && (
                <div className="space-y-5">
                  <h2 className="font-serif-luxury text-3xl font-bold text-[#3E2723]">Step 10: Final Couture Cake Summary</h2>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs bg-[#FFFBF7] p-5 rounded-3xl border border-[#D4A373]/30">
                    <div><span className="text-[#4E342E]/70">Base Shape:</span> <strong>{config.base}</strong></div>
                    <div><span className="text-[#4E342E]/70">Weight:</span> <strong>{config.size}</strong></div>
                    <div><span className="text-[#4E342E]/70">Sponge Flavour:</span> <strong>{config.flavour}</strong></div>
                    <div><span className="text-[#4E342E]/70">Inner Filling:</span> <strong>{config.filling}</strong></div>
                    <div><span className="text-[#4E342E]/70">Design Style:</span> <strong>{config.design}</strong></div>
                    <div><span className="text-[#4E342E]/70">Frosting Hue:</span> <strong>{config.colourName}</strong></div>
                    <div className="sm:col-span-2"><span className="text-[#4E342E]/70">Toppings:</span> <strong>{config.toppings.join(', ') || 'None'}</strong></div>
                    <div className="sm:col-span-2"><span className="text-[#4E342E]/70">Cake Message:</span> <strong>"{config.cakeText || 'None'}"</strong></div>
                    <div><span className="text-[#4E342E]/70">Delivery Date:</span> <strong>{config.expectedDeliveryDate}</strong></div>
                    <div><span className="text-[#4E342E]/70">Ref Images:</span> <strong>{config.referenceImages.length} uploaded</strong></div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FCE7F3]/50 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#4E342E]">Estimated Custom Cake Price</span>
                      <p className="text-[11px] text-[#4E342E]/75">Includes complimentary chilled box & gold cake knife</p>
                    </div>
                    <span className="text-3xl font-bold text-[#3E2723]">{formatINR(estimatedPrice)}</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => setStep(1)}
                      className="py-3 px-4 rounded-full border border-[#3E2723] text-[#3E2723] text-xs font-bold hover:bg-[#F5EBE0] transition"
                    >
                      Edit Design
                    </button>
                    <button
                      onClick={handleSaveDesign}
                      className="py-3 px-4 rounded-full bg-[#F5EBE0] text-[#3E2723] text-xs font-bold hover:bg-[#FCE7F3] transition"
                    >
                      Save Design to Account
                    </button>
                    <button
                      onClick={handleAddCustomCakeToCart}
                      className="py-3.5 px-4 rounded-full bg-[#FCE7F3] text-[#3E2723] text-xs font-bold hover:bg-[#FBCFE8] transition flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add Direct to Cart
                    </button>
                    <button
                      onClick={handleSubmitCustomQuote}
                      className="py-3.5 px-4 rounded-full bg-[#3E2723] text-white text-xs font-bold hover:bg-[#4E342E] transition flex items-center justify-center gap-1.5 shadow-lg"
                    >
                      <Send className="w-4 h-4" /> Request Custom Quote
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Step Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-[#F5EBE0]">
              <button
                disabled={step === 1}
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 rounded-full border border-[#D4A373]/40 text-xs font-bold text-[#3E2723] disabled:opacity-40 flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Step
              </button>
              {step < 10 && (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2.5 rounded-full bg-[#3E2723] text-white text-xs font-bold hover:bg-[#4E342E] flex items-center gap-1.5"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // VIEW 6: SHOPPING CART (/cart) & CHECKOUT (/checkout)
  // ==========================================================================
  const CartPage = () => {
    const [couponInput, setCouponInput] = useState('');

    const handleApplyCoupon = (e) => {
      e.preventDefault();
      const found = coupons.find((c) => c.code.toUpperCase() === couponInput.trim().toUpperCase() && c.active);
      if (!found) {
        showToast('Invalid or expired promo code.', 'error');
        return;
      }
      if (cartSubtotal < found.minOrder) {
        showToast(`Minimum order of ${formatINR(found.minOrder)} required for ${found.code}.`, 'error');
        return;
      }
      setAppliedCoupon(found);
      showToast(`Coupon ${found.code} applied!`);
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-serif-luxury text-4xl font-bold text-[#3E2723] mb-8">Your Pastry Shopping Bag</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-14 text-center border border-[#F5EBE0]">
            <ShoppingBag className="w-14 h-14 text-[#D4A373] mx-auto mb-3" />
            <h2 className="font-serif-luxury text-2xl font-bold text-[#3E2723]">Your pastry bag is currently empty</h2>
            <p className="text-sm text-[#4E342E]/75 mt-1">Explore our freshly baked signature cakes or design your own.</p>
            <div className="flex justify-center gap-4 mt-6">
              <button onClick={() => navigate('/cakes')} className="px-6 py-3 rounded-full bg-[#3E2723] text-white text-xs font-bold">
                Browse Cakes
              </button>
              <button onClick={() => navigate('/custom-cake')} className="px-6 py-3 rounded-full bg-[#FCE7F3] text-[#3E2723] text-xs font-bold">
                Custom Cake Studio
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div key={item.cartId} className="bg-white rounded-3xl p-5 border border-[#F5EBE0] flex flex-col sm:flex-row gap-5 items-center">
                  <img src={item.image} alt={item.name} className="w-28 h-28 rounded-2xl object-cover shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif-luxury text-xl font-bold text-[#3E2723]">{item.name}</h3>
                      <button
                        onClick={() => setCart((prev) => prev.filter((c) => c.cartId !== item.cartId))}
                        className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#4E342E]/80">
                      Weight: <strong>{typeof item.weight === 'number' ? `${item.weight} KG` : item.weight}</strong> • Flavour: <strong>{item.flavour}</strong> • {item.eggless ? '100% Eggless' : 'With Egg'}
                    </p>
                    {item.message && (
                      <p className="text-xs text-[#D4A373] font-semibold">Plaque Message: "{item.message}"</p>
                    )}
                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center border border-[#D4A373]/40 rounded-full bg-[#FFFBF7]">
                        <button
                          onClick={() =>
                            setCart((prev) =>
                              prev.map((c) => (c.cartId === item.cartId ? { ...c, qty: Math.max(1, c.qty - 1) } : c))
                            )
                          }
                          className="p-2"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold">{item.qty}</span>
                        <button
                          onClick={() =>
                            setCart((prev) =>
                              prev.map((c) => (c.cartId === item.cartId ? { ...c, qty: c.qty + 1 } : c))
                            )
                          }
                          className="p-2"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-lg font-bold text-[#3E2723]">{formatINR(item.unitPrice * item.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Coupon */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#F5EBE0] h-fit space-y-5">
              <h2 className="font-serif-luxury text-2xl font-bold text-[#3E2723]">Order Summary</h2>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Promo code (e.g. SWEET15)"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs uppercase"
                />
                <button type="submit" className="px-4 py-2.5 rounded-xl bg-[#3E2723] text-white text-xs font-bold">
                  Apply
                </button>
              </form>
              <div className="flex flex-wrap gap-1.5">
                {coupons.filter((c) => c.active).map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCouponInput(c.code)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-[#FCE7F3] text-[#3E2723] font-semibold"
                  >
                    {c.code}
                  </button>
                ))}
              </div>

              <div className="space-y-2.5 text-sm border-t border-[#F5EBE0] pt-4">
                <div className="flex justify-between text-[#4E342E]">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatINR(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-[#4E342E]">
                  <span>Chilled Delivery</span>
                  <span className="font-semibold text-emerald-700">
                    {deliveryCharge === 0 ? 'FREE' : formatINR(deliveryCharge)}
                  </span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-{formatINR(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-[#3E2723] border-t border-[#F5EBE0] pt-3">
                  <span>Total Payable</span>
                  <span>{formatINR(finalPayable)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 rounded-full bg-[#3E2723] hover:bg-[#4E342E] text-white font-bold text-sm transition shadow-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const CheckoutPage = () => {
    const [form, setForm] = useState({
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
      address: currentUser?.addresses?.[0]?.line || '',
      landmark: currentUser?.addresses?.[0]?.landmark || '',
      pincode: currentUser?.addresses?.[0]?.pincode || '134109',
      deliveryDate: '2026-11-18',
      deliverySlot: '4:00 PM - 7:00 PM (Evening Celebration)',
      notes: '',
      paymentMethod: 'Razorpay (UPI / Cards / NetBanking)'
    });
    const [pincodeStatus, setPincodeStatus] = useState('Serviceable • Cold-Chain Delivery Available');

    const checkPincode = (pin) => {
      setForm({ ...form, pincode: pin });
      if (pin.length === 6) {
        setPincodeStatus('✓ Pincode Serviceable • Express Chilled Delivery Available');
      } else {
        setPincodeStatus('Enter 6-digit Indian Pincode');
      }
    };

    const handlePlaceOrder = (e) => {
      e.preventDefault();
      const newOrderId = `VC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder = {
        id: newOrderId,
        customerId: currentUser?.id || 'guest',
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        address: `${form.address}, ${form.landmark} - ${form.pincode}`,
        deliveryDate: form.deliveryDate,
        deliverySlot: form.deliverySlot,
        paymentMethod: form.paymentMethod,
        paymentStatus: form.paymentMethod.includes('Cash') ? 'COD Pending' : 'Paid',
        statusIndex: 1, // Payment Confirmed
        deliveryPartner: 'Pending Dispatch Assignment',
        adminNotes: form.notes,
        createdAt: new Date().toLocaleString(),
        subtotal: cartSubtotal,
        deliveryFee: deliveryCharge,
        discount: cartDiscount,
        total: finalPayable,
        items: cart.map((c) => ({
          name: c.name,
          weight: typeof c.weight === 'number' ? `${c.weight} KG` : c.weight,
          flavour: c.flavour,
          eggless: c.eggless,
          qty: c.qty,
          price: c.unitPrice * c.qty,
          message: c.message,
          image: c.image
        })),
        timeline: [
          { stage: 'Order Placed', time: 'Just now', note: 'Order received by Velvet & Crumb Patisserie.' },
          { stage: 'Payment Confirmed', time: 'Just now', note: `Confirmed via ${form.paymentMethod}.` }
        ]
      };

      setOrders((prev) => [newOrder, ...prev]);
      setLastPlacedOrder(newOrder);
      setCart([]);
      setAppliedCoupon(null);
      showToast(`Order #${newOrderId} placed successfully!`);
    };

    if (lastPlacedOrder) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-14 text-center">
          <div className="bg-white rounded-[2.5rem] p-10 border border-[#D4A373]/30 shadow-xl space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="text-xs uppercase tracking-widest text-[#D4A373] font-bold">Order Confirmed</span>
            <h1 className="font-serif-luxury text-4xl font-bold text-[#3E2723]">Thank You, {lastPlacedOrder.customerName}!</h1>
            <p className="text-sm text-[#4E342E]/80">
              Your artisan cake order <strong>#{lastPlacedOrder.id}</strong> has been sent to our pastry kitchen.
            </p>
            <div className="bg-[#FFFBF7] p-4 rounded-2xl border border-[#F5EBE0] text-xs space-y-1.5 text-left">
              <div><strong>Delivery Date:</strong> {lastPlacedOrder.deliveryDate} ({lastPlacedOrder.deliverySlot})</div>
              <div><strong>Address:</strong> {lastPlacedOrder.address}</div>
              <div><strong>Amount Paid:</strong> {formatINR(lastPlacedOrder.total)} ({lastPlacedOrder.paymentMethod})</div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-3">
              <button
                onClick={() => {
                  setLastPlacedOrder(null);
                  navigate('/track-order');
                }}
                className="px-6 py-3 rounded-full bg-[#3E2723] text-white text-xs font-bold"
              >
                Track Live Order Progress
              </button>
              <button
                onClick={() => {
                  setLastPlacedOrder(null);
                  navigate('/');
                }}
                className="px-6 py-3 rounded-full bg-[#FCE7F3] text-[#3E2723] text-xs font-bold"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-serif-luxury text-4xl font-bold text-[#3E2723] mb-8">Secure Patisserie Checkout</h1>
        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#F5EBE0] space-y-5">
            <h2 className="font-serif-luxury text-2xl font-bold text-[#3E2723]">1. Delivery & Recipient Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#3E2723] block mb-1">Full Name *</label>
                <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#3E2723] block mb-1">Mobile Number (WhatsApp Updates) *</label>
                <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#3E2723] block mb-1">Email Address *</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#3E2723] block mb-1">Street Address / House / Apartment *</label>
                <input required type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#3E2723] block mb-1">Landmark</label>
                <input type="text" value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#3E2723] block mb-1">Delivery Pincode *</label>
                <input required maxLength={6} type="text" value={form.pincode} onChange={(e) => checkPincode(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs" />
                <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">{pincodeStatus}</span>
              </div>
              <div>
                <label className="text-xs font-bold text-[#3E2723] block mb-1">Delivery Date *</label>
                <input required type="date" value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#3E2723] block mb-1">Preferred Time Slot *</label>
                <select value={form.deliverySlot} onChange={(e) => setForm({ ...form, deliverySlot: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs">
                  <option>10:00 AM - 1:00 PM (Morning)</option>
                  <option>1:00 PM - 4:00 PM (Afternoon)</option>
                  <option>4:00 PM - 7:00 PM (Evening Celebration)</option>
                  <option>7:00 PM - 10:00 PM (Dinner)</option>
                  <option>11:30 PM - 12:15 AM (Midnight Surprise)</option>
                </select>
              </div>
            </div>

            <h2 className="font-serif-luxury text-2xl font-bold text-[#3E2723] pt-4">2. Payment Gateway</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Razorpay (UPI / Cards / NetBanking)',
                'UPI Instant (GPay / PhonePe / Paytm)',
                'Credit / Debit Card',
                'Cash on Delivery (COD)'
              ].map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setForm({ ...form, paymentMethod: method })}
                  className={`p-3.5 rounded-2xl border-2 text-left text-xs font-bold transition ${
                    form.paymentMethod === method ? 'border-[#3E2723] bg-[#FCE7F3]/40' : 'border-[#F5EBE0]'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#F5EBE0] h-fit space-y-4">
            <h2 className="font-serif-luxury text-2xl font-bold text-[#3E2723]">Review Order ({cart.length} items)</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.cartId} className="flex justify-between text-xs border-b border-[#F5EBE0] pb-2">
                  <div>
                    <span className="font-bold text-[#3E2723] block">{item.name} × {item.qty}</span>
                    <span className="text-[#4E342E]/70">{item.weight} • {item.flavour}</span>
                  </div>
                  <span className="font-bold">{formatINR(item.unitPrice * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm pt-2">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(cartSubtotal)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>{deliveryCharge === 0 ? 'FREE' : formatINR(deliveryCharge)}</span></div>
              {cartDiscount > 0 && <div className="flex justify-between text-emerald-700"><span>Discount</span><span>-{formatINR(cartDiscount)}</span></div>}
              <div className="flex justify-between text-lg font-bold text-[#3E2723] border-t pt-2">
                <span>Payable Total</span><span>{formatINR(finalPayable)}</span>
              </div>
            </div>
            <button type="submit" className="w-full py-4 rounded-full bg-[#3E2723] text-white font-bold text-sm hover:bg-[#4E342E] shadow-lg transition">
              Place Order • {formatINR(finalPayable)}
            </button>
          </div>
        </form>
      </div>
    );
  };

  // ==========================================================================
  // VIEW 7: LIVE 10-STAGE ORDER TRACKING (/track-order)
  // ==========================================================================
  const TrackOrderPage = () => {
    const [trackInput, setTrackInput] = useState(orders[0]?.id || 'VC-2026-8841');
    const activeOrder = orders.find((o) => o.id.toLowerCase() === trackInput.trim().toLowerCase()) || orders[0];

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#D4A373] font-bold">Live Kitchen-to-Doorstep Telemetry</span>
          <h1 className="font-serif-luxury text-4xl font-bold text-[#3E2723]">Track Your Cake Order</h1>
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              placeholder="Enter Order ID (e.g. VC-2026-8841)"
              className="flex-1 px-4 py-3 rounded-full bg-white border border-[#D4A373]/40 text-xs font-bold"
            />
            <div className="flex gap-1">
              {orders.slice(0, 2).map((o) => (
                <button
                  key={o.id}
                  onClick={() => setTrackInput(o.id)}
                  className="px-3 py-2 rounded-full bg-[#FCE7F3] text-[#3E2723] text-[11px] font-bold"
                >
                  {o.id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeOrder && (
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-[#F5EBE0] shadow-sm space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F5EBE0] pb-6">
              <div>
                <span className="text-xs text-[#4E342E]/70">Order ID</span>
                <h2 className="font-serif-luxury text-3xl font-bold text-[#3E2723]">#{activeOrder.id}</h2>
                <p className="text-xs text-[#4E342E] mt-1">
                  Estimated Delivery: <strong>{activeOrder.deliveryDate}</strong> ({activeOrder.deliverySlot})
                </p>
              </div>
              <div className="text-right">
                <span className="px-4 py-1.5 rounded-full bg-[#FCE7F3] text-[#3E2723] text-xs font-bold">
                  Current Stage: {ORDER_STAGES[activeOrder.statusIndex]}
                </span>
                <p className="text-xs text-[#4E342E]/70 mt-2">Courier: {activeOrder.deliveryPartner}</p>
              </div>
            </div>

            {/* 10-Stage Visual Progress Timeline */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {ORDER_STAGES.map((stage, idx) => {
                const isDone = idx <= activeOrder.statusIndex;
                const isCurrent = idx === activeOrder.statusIndex;
                return (
                  <div
                    key={stage}
                    className={`p-3.5 rounded-2xl border transition ${
                      isCurrent
                        ? 'bg-[#3E2723] text-[#FFFBF7] border-[#3E2723] shadow-md'
                        : isDone
                        ? 'bg-[#FCE7F3]/50 text-[#3E2723] border-[#D4A373]/40'
                        : 'bg-[#FFFBF7] text-[#4E342E]/45 border-[#F5EBE0]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold">STEP {idx + 1}</span>
                      {isDone && <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-[#D4A373]' : 'text-emerald-600'}`} />}
                    </div>
                    <p className="text-xs font-bold leading-snug">{stage}</p>
                  </div>
                );
              })}
            </div>

            {activeOrder.adminNotes && (
              <div className="p-4 rounded-2xl bg-[#FFFBF7] border border-[#D4A373]/30 text-xs text-[#3E2723]">
                <strong>Pastry Chef / Dispatch Note:</strong> {activeOrder.adminNotes}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ==========================================================================
  // VIEW 8: CUSTOMER AUTH & ACCOUNT DASHBOARD (/login & /my-account)
  // ==========================================================================
  const AuthPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('aarav.sharma@example.com');
    const [password, setPassword] = useState('••••••••');

    const handleSubmit = (e) => {
      e.preventDefault();
      setCurrentUser({
        id: 'cust-101',
        name: isRegister && name ? name : 'Aarav Sharma',
        email,
        phone: '+91 98765 43210',
        birthday: '1996-08-24',
        addresses: [
          { id: 'addr-1', label: 'Home', line: 'House 42, Sector 9, Panchkula, Haryana', pincode: '134109', landmark: 'Near Rose Garden' }
        ],
        wishlist: ['prod-1', 'prod-5'],
        notifications: [{ id: 1, text: 'Welcome back to Velvet & Crumb Patisserie!', time: 'Just now', unread: true }]
      });
      showToast('Signed in to your Velvet & Crumb account!');
      navigate('/my-account');
    };

    return (
      <div className="max-w-md mx-auto px-4 py-14">
        <div className="bg-white rounded-[2.5rem] p-8 border border-[#F5EBE0] shadow-lg space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#3E2723] text-[#D4A373] flex items-center justify-center mx-auto mb-3">
              <Cake className="w-6 h-6" />
            </div>
            <h1 className="font-serif-luxury text-3xl font-bold text-[#3E2723]">
              {isRegister ? 'Create Patron Account' : 'Welcome Back'}
            </h1>
            <p className="text-xs text-[#4E342E]/75 mt-1">Manage custom cake quotes, saved designs & live orders.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-xs font-bold text-[#3E2723] block mb-1">Full Name</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="w-full px-4 py-3 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs" />
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-[#3E2723] block mb-1">Email Address</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#3E2723] block mb-1">Password</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs" />
            </div>
            <button type="submit" className="w-full py-3.5 rounded-full bg-[#3E2723] text-white font-bold text-sm hover:bg-[#4E342E] transition">
              {isRegister ? 'Register Account' : 'Sign In to My Account'}
            </button>
          </form>

          <div className="text-center text-xs text-[#4E342E]">
            {isRegister ? 'Already have an account?' : 'New to Velvet & Crumb?'}{' '}
            <button onClick={() => setIsRegister(!isRegister)} className="font-bold text-[#3E2723] underline">
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CustomerDashboardPage = () => {
    const [tab, setTab] = useState('overview');
    const [invoiceOrder, setInvoiceOrder] = useState(null);

    if (!currentUser) {
      return <AuthPage />;
    }

    const myOrders = orders;
    const myRequests = customRequests;

    const handleAcceptQuote = (req) => {
      const priceToPay = req.quotedPrice || req.estimatedPrice;
      setCustomRequests((prev) =>
        prev.map((r) => (r.id === req.id ? { ...r, status: 'Quote Accepted' } : r))
      );
      handleAddToCart({
        productId: req.id,
        name: `Custom Quote #${req.id} (${req.design})`,
        weight: req.size,
        flavour: `${req.flavour} + ${req.filling}`,
        eggless: true,
        qty: 1,
        unitPrice: priceToPay,
        message: req.cakeText,
        deliveryDate: req.deliveryDate,
        deliverySlot: '4:00 PM - 7:00 PM',
        image: req.referenceImages?.[0] || 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=400&q=80',
        isCustom: true
      });
      navigate('/cart');
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-3xl p-5 border border-[#F5EBE0] h-fit space-y-2">
            <div className="p-3 rounded-2xl bg-[#FCE7F3]/50 mb-4">
              <p className="font-serif-luxury text-xl font-bold text-[#3E2723]">{currentUser.name}</p>
              <span className="text-xs text-[#4E342E]/75">{currentUser.email}</span>
            </div>

            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'orders', label: 'My Orders', icon: Package },
              { id: 'requests', label: 'Custom Cake Requests', icon: Wand2 },
              { id: 'designs', label: 'Saved Cake Designs', icon: Heart },
              { id: 'addresses', label: 'My Addresses', icon: MapPin },
              { id: 'wishlist', label: 'My Wishlist', icon: Star },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'profile', label: 'Profile Settings', icon: Settings }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition ${
                  tab === item.id ? 'bg-[#3E2723] text-white' : 'text-[#4E342E] hover:bg-[#F5EBE0]'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}

            <button
              onClick={() => {
                setCurrentUser(null);
                showToast('Logged out successfully.');
                navigate('/');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 mt-4"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {tab === 'overview' && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-[#F5EBE0]">
                    <span className="text-xs text-[#4E342E]/70">Total Orders</span>
                    <p className="text-3xl font-bold text-[#3E2723] mt-1">{myOrders.length}</p>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-[#F5EBE0]">
                    <span className="text-xs text-[#4E342E]/70">Active Orders</span>
                    <p className="text-3xl font-bold text-[#D4A373] mt-1">
                      {myOrders.filter((o) => o.statusIndex < 9).length}
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-[#F5EBE0]">
                    <span className="text-xs text-[#4E342E]/70">Custom Quotes</span>
                    <p className="text-3xl font-bold text-[#3E2723] mt-1">{myRequests.length}</p>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-[#F5EBE0]">
                    <span className="text-xs text-[#4E342E]/70">Saved Designs</span>
                    <p className="text-3xl font-bold text-[#3E2723] mt-1">{savedDesigns.length}</p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#F5EBE0] space-y-4">
                  <h2 className="font-serif-luxury text-2xl font-bold text-[#3E2723]">Recent Active Orders</h2>
                  {myOrders.map((order) => (
                    <div key={order.id} className="p-4 rounded-2xl bg-[#FFFBF7] border border-[#F5EBE0] flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="font-bold text-sm text-[#3E2723]">#{order.id}</span>
                        <p className="text-xs text-[#4E342E]/75">{order.items.map((i) => i.name).join(', ')}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#FCE7F3] text-[#3E2723] text-xs font-bold">
                        {ORDER_STAGES[order.statusIndex]}
                      </span>
                      <button
                        onClick={() => navigate('/track-order')}
                        className="text-xs font-bold text-[#3E2723] underline"
                      >
                        Track Progress
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === 'orders' && (
              <div className="space-y-4">
                <h2 className="font-serif-luxury text-3xl font-bold text-[#3E2723]">My Order History</h2>
                {myOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-3xl p-6 border border-[#F5EBE0] space-y-4">
                    <div className="flex flex-wrap justify-between gap-2 border-b border-[#F5EBE0] pb-3">
                      <div>
                        <span className="font-bold text-base text-[#3E2723]">Order #{order.id}</span>
                        <span className="text-xs text-[#4E342E]/70 block">Placed on {order.createdAt} • Delivery: {order.deliveryDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full bg-[#FCE7F3] text-[#3E2723] text-xs font-bold">
                          {ORDER_STAGES[order.statusIndex]}
                        </span>
                        <span className="block font-bold text-sm mt-1">{formatINR(order.total)}</span>
                      </div>
                    </div>
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-xs">
                        <img src={it.image} alt="" className="w-14 h-14 rounded-xl object-cover" />
                        <div className="flex-1">
                          <p className="font-bold text-[#3E2723]">{it.name}</p>
                          <p className="text-[#4E342E]/70">{it.weight} • {it.flavour}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button onClick={() => navigate('/track-order')} className="px-4 py-2 rounded-full bg-[#3E2723] text-white text-xs font-bold">
                        Live 10-Stage Tracker
                      </button>
                      <button onClick={() => setInvoiceOrder(order)} className="px-4 py-2 rounded-full bg-[#F5EBE0] text-[#3E2723] text-xs font-bold">
                        View / Download Invoice
                      </button>
                      {order.statusIndex <= 2 && (
                        <button
                          onClick={() => {
                            setOrders((prev) => prev.filter((o) => o.id !== order.id));
                            showToast(`Order #${order.id} cancelled.`);
                          }}
                          className="px-4 py-2 rounded-full border border-rose-300 text-rose-600 text-xs font-bold"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'requests' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif-luxury text-3xl font-bold text-[#3E2723]">Custom Cake Quote Requests</h2>
                  <button onClick={() => navigate('/custom-cake')} className="px-4 py-2 rounded-full bg-[#3E2723] text-white text-xs font-bold">
                    + New Custom Design
                  </button>
                </div>

                {myRequests.map((req) => (
                  <div key={req.id} className="bg-white rounded-3xl p-6 border border-[#F5EBE0] space-y-4">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <span className="text-xs font-bold text-[#D4A373]">Request #{req.id}</span>
                        <h3 className="font-serif-luxury text-2xl font-bold text-[#3E2723]">
                          {req.base} • {req.design} ({req.size})
                        </h3>
                        <p className="text-xs text-[#4E342E]/80">
                          Flavour: {req.flavour} • Filling: {req.filling} • Delivery: {req.deliveryDate}
                        </p>
                      </div>
                      <span className="px-3.5 py-1.5 rounded-full bg-[#FCE7F3] text-[#3E2723] text-xs font-bold">
                        {req.status}
                      </span>
                    </div>

                    {req.referenceImages?.length > 0 && (
                      <div className="flex gap-3">
                        {req.referenceImages.map((src, i) => (
                          <img key={i} src={src} alt="Ref" className="w-20 h-20 rounded-2xl object-cover border" />
                        ))}
                      </div>
                    )}

                    <div className="p-4 rounded-2xl bg-[#FFFBF7] border border-[#D4A373]/30 flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div>
                        <span className="block text-[#4E342E]/70">Estimated Builder Price: <strong>{formatINR(req.estimatedPrice)}</strong></span>
                        {req.quotedPrice && (
                          <span className="block text-base font-bold text-emerald-800 mt-0.5">
                            Chef Final Quotation: {formatINR(req.quotedPrice)}
                          </span>
                        )}
                        {req.adminNote && <p className="text-[#3E2723] mt-1">Chef Note: "{req.adminNote}"</p>}
                      </div>

                      {req.status === 'Quote Sent' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptQuote(req)}
                            className="px-5 py-2.5 rounded-full bg-emerald-700 text-white font-bold"
                          >
                            Accept Quote & Checkout
                          </button>
                          <button
                            onClick={() =>
                              setCustomRequests((prev) =>
                                prev.map((r) => (r.id === req.id ? { ...r, status: 'Rejected' } : r))
                              )
                            }
                            className="px-4 py-2.5 rounded-full border border-rose-300 text-rose-600 font-bold"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'designs' && (
              <div className="space-y-4">
                <h2 className="font-serif-luxury text-3xl font-bold text-[#3E2723]">Saved Cake Studio Designs</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {savedDesigns.map((des) => (
                    <div key={des.id} className="bg-white rounded-3xl p-5 border border-[#F5EBE0] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#D4A373]">{des.savedAt}</span>
                        <span className="font-bold text-sm text-[#3E2723]">{formatINR(des.estimatedPrice)}</span>
                      </div>
                      <h3 className="font-serif-luxury text-xl font-bold text-[#3E2723]">{des.title}</h3>
                      <p className="text-xs text-[#4E342E]/75">{des.base} • {des.size} • {des.flavour}</p>
                      <button
                        onClick={() => {
                          handleAddToCart({
                            productId: des.id,
                            name: des.title,
                            weight: des.size,
                            flavour: des.flavour,
                            eggless: true,
                            qty: 1,
                            unitPrice: des.estimatedPrice,
                            message: des.cakeText,
                            deliveryDate: '2026-11-19',
                            deliverySlot: '4:00 PM - 7:00 PM',
                            image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=400&q=80',
                            isCustom: true
                          });
                          navigate('/cart');
                        }}
                        className="w-full py-2.5 rounded-full bg-[#3E2723] text-white text-xs font-bold"
                      >
                        Order This Design Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'addresses' && (
              <div className="bg-white rounded-3xl p-6 border border-[#F5EBE0] space-y-4">
                <h2 className="font-serif-luxury text-2xl font-bold text-[#3E2723]">Saved Delivery Addresses</h2>
                {currentUser.addresses.map((addr) => (
                  <div key={addr.id} className="p-4 rounded-2xl bg-[#FFFBF7] border border-[#D4A373]/30 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FCE7F3] font-bold text-[#3E2723]">{addr.label}</span>
                    <p className="font-bold text-sm text-[#3E2723] mt-2">{addr.line} - {addr.pincode}</p>
                    <p className="text-[#4E342E]/70">Landmark: {addr.landmark}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === 'wishlist' && (
              <div className="grid sm:grid-cols-2 gap-6">
                {products.filter((p) => currentUser.wishlist.includes(p.id)).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {tab === 'notifications' && (
              <div className="bg-white rounded-3xl p-6 border border-[#F5EBE0] space-y-3">
                <h2 className="font-serif-luxury text-2xl font-bold text-[#3E2723]">Patisserie Alerts & Updates</h2>
                {currentUser.notifications.map((n) => (
                  <div key={n.id} className="p-4 rounded-2xl bg-[#FFFBF7] border border-[#F5EBE0] flex justify-between text-xs">
                    <span className="font-medium text-[#3E2723]">{n.text}</span>
                    <span className="text-[#4E342E]/60">{n.time}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 border border-[#F5EBE0] space-y-4 max-w-xl">
                <h2 className="font-serif-luxury text-2xl font-bold text-[#3E2723]">Profile Settings</h2>
                <div>
                  <label className="text-xs font-bold block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={currentUser.name}
                    onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={currentUser.phone}
                    onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs"
                  />
                </div>
                <button
                  onClick={() => showToast('Profile updated successfully!')}
                  className="px-6 py-3 rounded-full bg-[#3E2723] text-white text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Printable Invoice Modal */}
        {invoiceOrder && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="font-serif-luxury text-2xl font-bold text-[#3E2723]">Velvet & Crumb Tax Invoice</h3>
                  <span className="text-xs text-[#4E342E]/70">Invoice #{invoiceOrder.id}</span>
                </div>
                <button onClick={() => setInvoiceOrder(null)} className="p-2 rounded-full hover:bg-[#F5EBE0]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-xs space-y-1">
                <p><strong>Billed To:</strong> {invoiceOrder.customerName} ({invoiceOrder.customerPhone})</p>
                <p><strong>Delivery Address:</strong> {invoiceOrder.address}</p>
                <p><strong>Payment Mode:</strong> {invoiceOrder.paymentMethod} ({invoiceOrder.paymentStatus})</p>
              </div>
              <div className="border-y py-3 space-y-2 text-xs">
                {invoiceOrder.items.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{it.name} ({it.weight}) × {it.qty}</span>
                    <span className="font-bold">{formatINR(it.price)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-base text-[#3E2723]">
                <span>Grand Total (Incl. GST)</span>
                <span>{formatINR(invoiceOrder.total)}</span>
              </div>
              <button
                onClick={() => {
                  showToast('Invoice PDF downloaded!');
                  setInvoiceOrder(null);
                }}
                className="w-full py-3 rounded-full bg-[#3E2723] text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download PDF Receipt
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==========================================================================
  // VIEW 9: COMPLETE ADMIN MANAGEMENT PORTAL (/admin)
  // ==========================================================================
  const AdminDashboardPage = () => {
    const [adminTab, setAdminTab] = useState('overview');
    const [adminPin, setAdminPin] = useState('ADMIN2026');
    const [orderSearch, setOrderSearch] = useState('');
    const [orderFilter, setOrderFilter] = useState('All');

    // New Product Form State
    const [newCake, setNewCake] = useState({
      name: '',
      category: 'Chocolate Cakes',
      basePrice: 999,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80',
      description: ''
    });

    // New Coupon Form State
    const [newCoupon, setNewCoupon] = useState({ code: '', type: 'percent', value: 15, minOrder: 800 });

    // Quote Input State per Request
    const [quoteInputs, setQuoteInputs] = useState({});

    if (!isAdminAuthenticated) {
      return (
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-[#3E2723] text-[#FFFBF7] rounded-[2.5rem] p-8 shadow-2xl space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#D4A373] text-[#3E2723] flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="font-serif-luxury text-3xl font-bold">Patisserie Admin Portal</h1>
              <p className="text-xs text-[#F5EBE0]/75 mt-1">Role-based bakery command center access</p>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-semibold block">Admin Access Key (Pre-filled Demo)</label>
              <input
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-[#D4A373]/40 text-white text-sm"
              />
              <button
                onClick={() => {
                  setIsAdminAuthenticated(true);
                  showToast('Authenticated as Head Pastry Admin.');
                }}
                className="w-full py-3.5 rounded-full bg-[#D4A373] text-[#3E2723] font-bold text-sm hover:bg-[#FCE7F3] transition"
              >
                Enter Admin Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    const totalRevenue = orders.reduce((s, o) => s + o.total, 0) + 48500;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Admin Top Header */}
        <div className="bg-[#3E2723] text-[#FFFBF7] rounded-3xl p-6 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D4A373] font-bold">Velvet & Crumb Command Center</span>
            <h1 className="font-serif-luxury text-3xl font-bold">Bakery & Custom Order Administration</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold"
            >
              View Live Storefront
            </button>
            <button
              onClick={() => setIsAdminAuthenticated(false)}
              className="px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-semibold"
            >
              Lock Admin
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-6">
          {[
            { id: 'overview', label: 'Overview & Analytics', icon: BarChart3 },
            { id: 'orders', label: `Orders (${orders.length})`, icon: Package },
            { id: 'custom', label: `Custom Quotes (${customRequests.length})`, icon: Wand2 },
            { id: 'products', label: `Products (${products.length})`, icon: Cake },
            { id: 'marketing', label: 'Banners & Coupons', icon: Tag },
            { id: 'studio-settings', label: 'Custom Studio Pricing', icon: Settings }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setAdminTab(t.id)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-2 transition ${
                adminTab === t.id ? 'bg-[#3E2723] text-white shadow' : 'bg-white text-[#3E2723] border border-[#F5EBE0]'
              }`}
            >
              <t.icon className="w-4 h-4 text-[#D4A373]" />
              {t.label}
            </button>
          ))}
        </div>

        {/* ADMIN TAB 1: OVERVIEW & REVENUE CHARTS */}
        {adminTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Total Revenue', value: formatINR(totalRevenue), sub: '+18.4% this week' },
                { label: 'Total Orders', value: orders.length + 142, sub: '99.2% on-time' },
                { label: "Today's Orders", value: orders.length + 6, sub: '4 evening slots' },
                { label: 'Custom Cake Quotes', value: customRequests.length, sub: '48h turnaround' },
                { label: 'Active Patrons', value: '1,284', sub: '+34 new today' }
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white p-5 rounded-3xl border border-[#F5EBE0]">
                  <span className="text-xs text-[#4E342E]/70">{kpi.label}</span>
                  <p className="text-2xl font-bold text-[#3E2723] mt-1">{kpi.value}</p>
                  <span className="text-[11px] text-emerald-700 font-semibold">{kpi.sub}</span>
                </div>
              ))}
            </div>

            {/* Visual Weekly Revenue Bar Chart */}
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#F5EBE0]">
                <h3 className="font-serif-luxury text-2xl font-bold text-[#3E2723] mb-4">Weekly Patisserie Sales Revenue</h3>
                <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
                  {[
                    { day: 'Mon', val: 62, amt: '₹12.4k' },
                    { day: 'Tue', val: 48, amt: '₹9.6k' },
                    { day: 'Wed', val: 75, amt: '₹15.1k' },
                    { day: 'Thu', val: 68, amt: '₹13.8k' },
                    { day: 'Fri', val: 90, amt: '₹18.5k' },
                    { day: 'Sat', val: 100, amt: '₹24.2k' },
                    { day: 'Sun', val: 94, amt: '₹21.9k' }
                  ].map((bar) => (
                    <div key={bar.day} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[10px] font-bold text-[#3E2723]">{bar.amt}</span>
                      <div className="w-full bg-[#F5EBE0] rounded-t-xl h-40 flex items-end overflow-hidden">
                        <div
                          style={{ height: `${bar.val}%` }}
                          className="w-full bg-gradient-to-t from-[#3E2723] to-[#D4A373] rounded-t-xl transition-all"
                        />
                      </div>
                      <span className="text-xs font-bold text-[#4E342E]">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#F5EBE0] space-y-4">
                <h3 className="font-serif-luxury text-2xl font-bold text-[#3E2723]">Top Revenue Categories</h3>
                {[
                  { name: 'Designer & Custom Cakes', pct: 44 },
                  { name: 'Belgian Chocolate Truffle', pct: 28 },
                  { name: 'Red Velvet & Cheesecakes', pct: 18 },
                  { name: 'Fruit & Bento Cakes', pct: 10 }
                ].map((c) => (
                  <div key={c.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>{c.name}</span>
                      <span>{c.pct}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#F5EBE0] overflow-hidden">
                      <div style={{ width: `${c.pct}%` }} className="h-full bg-[#3E2723] rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ADMIN TAB 2: ORDER MANAGEMENT (10-STAGE STATUS UPDATER) */}
        {adminTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 justify-between bg-white p-4 rounded-2xl border border-[#F5EBE0]">
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search by Order ID or Customer..."
                className="px-4 py-2 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs w-64"
              />
              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs font-bold"
              >
                <option value="All">All Statuses</option>
                {ORDER_STAGES.map((st, idx) => (
                  <option key={st} value={idx}>{st}</option>
                ))}
              </select>
            </div>

            {orders
              .filter(
                (o) =>
                  (orderFilter === 'All' || o.statusIndex === Number(orderFilter)) &&
                  (o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                    o.customerName.toLowerCase().includes(orderSearch.toLowerCase()))
              )
              .map((order) => (
                <div key={order.id} className="bg-white rounded-3xl p-6 border border-[#F5EBE0] space-y-4">
                  <div className="flex flex-wrap justify-between gap-4 border-b border-[#F5EBE0] pb-4">
                    <div>
                      <span className="font-bold text-base text-[#3E2723]">#{order.id} • {order.customerName}</span>
                      <p className="text-xs text-[#4E342E]/75">{order.customerPhone} • {order.address}</p>
                      <p className="text-xs text-[#D4A373] font-semibold mt-0.5">
                        Slot: {order.deliveryDate} ({order.deliverySlot})
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-[#3E2723]">{formatINR(order.total)}</span>
                      <span className="block text-xs text-emerald-700 font-bold">{order.paymentStatus}</span>
                    </div>
                  </div>

                  {/* Interactive Stage Selector */}
                  <div className="grid sm:grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="text-xs font-bold text-[#3E2723] block mb-1">
                        Update Production / Delivery Stage (Syncs Live to Customer Tracker)
                      </label>
                      <select
                        value={order.statusIndex}
                        onChange={(e) => {
                          const newIdx = Number(e.target.value);
                          setOrders((prev) =>
                            prev.map((o) =>
                              o.id === order.id
                                ? {
                                    ...o,
                                    statusIndex: newIdx,
                                    timeline: [
                                      ...o.timeline,
                                      { stage: ORDER_STAGES[newIdx], time: 'Just now', note: 'Updated by Admin Kitchen.' }
                                    ]
                                  }
                                : o
                            )
                          );
                          showToast(`Order #${order.id} updated to "${ORDER_STAGES[newIdx]}"!`);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FCE7F3]/50 border border-[#3E2723] text-xs font-bold text-[#3E2723]"
                      >
                        {ORDER_STAGES.map((st, idx) => (
                          <option key={st} value={idx}>
                            {idx + 1}. {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#3E2723] block mb-1">Assign Delivery Personnel</label>
                      <input
                        type="text"
                        value={order.deliveryPartner}
                        onChange={(e) =>
                          setOrders((prev) =>
                            prev.map((o) => (o.id === order.id ? { ...o, deliveryPartner: e.target.value } : o))
                          )
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* ADMIN TAB 3: CUSTOM CAKE REQUESTS & QUOTATION ENGINE */}
        {adminTab === 'custom' && (
          <div className="space-y-6">
            {customRequests.map((req) => {
              const qState = quoteInputs[req.id] || {
                price: req.quotedPrice || req.estimatedPrice,
                note: req.adminNote || 'Confirmed! Ready to bake upon approval.'
              };

              return (
                <div key={req.id} className="bg-white rounded-3xl p-6 border border-[#F5EBE0] space-y-4">
                  <div className="flex flex-wrap justify-between gap-2 border-b pb-3">
                    <div>
                      <span className="text-xs font-bold text-[#D4A373]">Custom Request #{req.id}</span>
                      <h3 className="font-serif-luxury text-2xl font-bold text-[#3E2723]">
                        {req.customerName} ({req.customerPhone})
                      </h3>
                      <p className="text-xs text-[#4E342E]">
                        {req.base} • {req.size} • {req.flavour} / {req.filling} • Design: {req.design}
                      </p>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-[#FCE7F3] text-[#3E2723] text-xs font-bold h-fit">
                      {req.status}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs bg-[#FFFBF7] p-4 rounded-2xl">
                    <div><strong>Toppings:</strong> {req.toppings?.join(', ') || 'None'}</div>
                    <div><strong>Cake Message:</strong> "{req.cakeText}"</div>
                    <div><strong>Requested Delivery:</strong> {req.deliveryDate}</div>
                    <div><strong>Builder Estimate:</strong> {formatINR(req.estimatedPrice)}</div>
                    {req.instructions && <div className="sm:col-span-2"><strong>Instructions:</strong> {req.instructions}</div>}
                  </div>

                  {req.referenceImages?.length > 0 && (
                    <div className="flex gap-3">
                      {req.referenceImages.map((src, i) => (
                        <img key={i} src={src} alt="Customer Ref" className="w-24 h-24 rounded-2xl object-cover border" />
                      ))}
                    </div>
                  )}

                  {/* Admin Quote Pricing Action */}
                  <div className="grid sm:grid-cols-12 gap-3 items-end pt-2">
                    <div className="sm:col-span-3">
                      <label className="text-xs font-bold block mb-1">Final Quoted Price (₹)</label>
                      <input
                        type="number"
                        value={qState.price}
                        onChange={(e) =>
                          setQuoteInputs({ ...quoteInputs, [req.id]: { ...qState, price: Number(e.target.value) } })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373] text-xs font-bold"
                      />
                    </div>
                    <div className="sm:col-span-5">
                      <label className="text-xs font-bold block mb-1">Chef Note to Customer</label>
                      <input
                        type="text"
                        value={qState.note}
                        onChange={(e) =>
                          setQuoteInputs({ ...quoteInputs, [req.id]: { ...qState, note: e.target.value } })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-4 flex gap-2">
                      <button
                        onClick={() => {
                          setCustomRequests((prev) =>
                            prev.map((r) =>
                              r.id === req.id
                                ? { ...r, status: 'Quote Sent', quotedPrice: qState.price, adminNote: qState.note }
                                : r
                            )
                          );
                          showToast(`Quotation of ${formatINR(qState.price)} sent to ${req.customerName}!`);
                        }}
                        className="flex-1 py-2.5 px-4 rounded-full bg-[#3E2723] text-white text-xs font-bold"
                      >
                        Send Quotation
                      </button>
                      <button
                        onClick={() =>
                          setCustomRequests((prev) =>
                            prev.map((r) => (r.id === req.id ? { ...r, status: 'Rejected' } : r))
                          )
                        }
                        className="py-2.5 px-3 rounded-full border border-rose-300 text-rose-600 text-xs font-bold"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ADMIN TAB 4: PRODUCT CATALOGUE MANAGEMENT */}
        {adminTab === 'products' && (
          <div className="grid lg:grid-cols-12 gap-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCake.name) return;
                const created = {
                  id: `prod-${Date.now()}`,
                  slug: newCake.name.toLowerCase().replace(/\s+/g, '-'),
                  name: newCake.name,
                  category: newCake.category,
                  occasion: ['Birthday', 'Anniversary'],
                  basePrice: Number(newCake.basePrice),
                  rating: 5.0,
                  reviewsCount: 1,
                  isBestSeller: true,
                  isFeatured: true,
                  isEgglessAvailable: true,
                  inStock: true,
                  badge: 'New Launch',
                  flavours: ['Signature Sponge', 'Belgian Chocolate'],
                  weights: [0.5, 1, 1.5, 2],
                  images: [newCake.image],
                  description: newCake.description || 'Freshly baked artisan cake from Velvet & Crumb.'
                };
                setProducts((prev) => [created, ...prev]);
                setNewCake({ ...newCake, name: '', description: '' });
                showToast(`Added "${created.name}" to storefront!`);
              }}
              className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#F5EBE0] space-y-4 h-fit"
            >
              <h3 className="font-serif-luxury text-2xl font-bold text-[#3E2723]">+ Add New Cake</h3>
              <div>
                <label className="text-xs font-bold block mb-1">Cake Title</label>
                <input required type="text" value={newCake.name} onChange={(e) => setNewCake({ ...newCake, name: e.target.value })} placeholder="e.g. Hazelnut Rocher Gateau" className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Category</label>
                <select value={newCake.category} onChange={(e) => setNewCake({ ...newCake, category: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs">
                  {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Starting 0.5kg Price (₹)</label>
                <input required type="number" value={newCake.basePrice} onChange={(e) => setNewCake({ ...newCake, basePrice: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Description</label>
                <textarea rows={2} value={newCake.description} onChange={(e) => setNewCake({ ...newCake, description: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF7] border border-[#D4A373]/40 text-xs" />
              </div>
              <button type="submit" className="w-full py-3 rounded-full bg-[#3E2723] text-white text-xs font-bold">
                Publish Cake to Storefront
              </button>
            </form>

            <div className="lg:col-span-8 space-y-3">
              {products.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-2xl border border-[#F5EBE0] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-[#3E2723]">{p.name}</h4>
                      <span className="text-xs text-[#4E342E]/70">{p.category} • Base: {formatINR(p.basePrice)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setProducts((prev) =>
                          prev.map((item) => (item.id === p.id ? { ...item, isBestSeller: !item.isBestSeller } : item))
                        )
                      }
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${p.isBestSeller ? 'bg-amber-100 text-amber-900' : 'bg-[#F5EBE0] text-[#4E342E]'}`}
                    >
                      {p.isBestSeller ? '★ Bestseller' : 'Mark Bestseller'}
                    </button>
                    <button
                      onClick={() =>
                        setProducts((prev) =>
                          prev.map((item) => (item.id === p.id ? { ...item, inStock: !item.inStock } : item))
                        )
                      }
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}
                    >
                      {p.inStock ? 'In Stock' : 'Sold Out'}
                    </button>
                    <button
                      onClick={() => setProducts((prev) => prev.filter((item) => item.id !== p.id))}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADMIN TAB 5: BANNERS & COUPONS */}
        {adminTab === 'marketing' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-[#F5EBE0] space-y-4">
              <h3 className="font-serif-luxury text-2xl font-bold text-[#3E2723]">Homepage Hero Banners</h3>
              {banners.map((b) => (
                <div key={b.id} className="p-4 rounded-2xl bg-[#FFFBF7] border border-[#D4A373]/30 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-[#3E2723]">{b.title}</span>
                    <button
                      onClick={() =>
                        setBanners((prev) =>
                          prev.map((ban) => ({ ...ban, active: ban.id === b.id }))
                        )
                      }
                      className={`px-3 py-1 rounded-full text-xs font-bold ${b.active ? 'bg-emerald-700 text-white' : 'bg-[#F5EBE0] text-[#3E2723]'}`}
                    >
                      {b.active ? 'Active Live' : 'Activate'}
                    </button>
                  </div>
                  <p className="text-xs text-[#4E342E]/75">{b.subtitle}</p>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#F5EBE0] space-y-4">
              <h3 className="font-serif-luxury text-2xl font-bold text-[#3E2723]">Promo Codes & Discounts</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCoupon.code) return;
                  setCoupons((prev) => [
                    ...prev,
                    { ...newCoupon, code: newCoupon.code.toUpperCase(), expiry: '2026-12-31', active: true, desc: 'Admin promo offer' }
                  ]);
                  setNewCoupon({ code: '', type: 'percent', value: 15, minOrder: 800 });
                  showToast('New coupon created!');
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="CODE (e.g. FESTIVE20)"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl bg-[#FFFBF7] border text-xs uppercase"
                />
                <input
                  type="number"
                  value={newCoupon.value}
                  onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                  className="w-20 px-3 py-2 rounded-xl bg-[#FFFBF7] border text-xs"
                />
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#3E2723] text-white text-xs font-bold">
                  Add
                </button>
              </form>

              <div className="space-y-2">
                {coupons.map((c) => (
                  <div key={c.code} className="p-3 rounded-xl bg-[#FFFBF7] border flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-[#3E2723]">{c.code}</strong> — {c.type === 'percent' ? `${c.value}% Off` : `₹${c.value} Off`} (Min ₹{c.minOrder})
                    </div>
                    <button
                      onClick={() =>
                        setCoupons((prev) =>
                          prev.map((cp) => (cp.code === c.code ? { ...cp, active: !cp.active } : cp))
                        )
                      }
                      className={`px-2.5 py-1 rounded-full font-bold ${c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}
                    >
                      {c.active ? 'Active' : 'Paused'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ADMIN TAB 6: CUSTOMIZATION PRICING SETTINGS */}
        {adminTab === 'studio-settings' && (
          <div className="bg-white p-6 rounded-3xl border border-[#F5EBE0] space-y-6">
            <div>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#3E2723]">Custom Cake Studio Pricing Matrix</h3>
              <p className="text-xs text-[#4E342E]/75">Adjust surcharge rates for cake shapes, fillings, and gourmet toppings.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {customOptions.toppings.map((t, idx) => (
                <div key={t.id} className="p-3.5 rounded-2xl bg-[#FFFBF7] border border-[#D4A373]/30 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#3E2723]">{t.label}</span>
                  <div className="flex items-center gap-1">
                    <span>₹</span>
                    <input
                      type="number"
                      value={t.price}
                      onChange={(e) => {
                        const updated = [...customOptions.toppings];
                        updated[idx] = { ...t, price: Number(e.target.value) };
                        setCustomOptions({ ...customOptions, toppings: updated });
                      }}
                      className="w-16 px-2 py-1 rounded-lg border bg-white font-bold text-right"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==========================================================================
  // VIEW 10: INFORMATIONAL PAGES (/about, /contact, /faq, /privacy, /terms, /refund)
  // ==========================================================================
  const InfoPages = ({ page }) => {
    const contentMap = {
      '/about': {
        title: 'Our Patisserie Story',
        subtitle: 'Crafted with French Technique & Indian Hospitality',
        body: 'Founded in 2019, Velvet & Crumb Patisserie began with a singular devotion: elevating celebration cakes into edible works of art. Every sponge is baked from scratch using single-origin Belgian couverture chocolate, pure Madagascar bourbon vanilla, and farm-fresh dairy — with a dedicated 100% eggless bakehouse.'
      },
      '/contact': {
        title: 'Visit Our Flagship Boutique',
        subtitle: 'Sector 9, Panchkula • Chandigarh Tricity',
        body: 'Boutique Address: SCO 24, Inner Market, Sector 9, Panchkula, Haryana 134109. Open Daily: 9:30 AM – 10:30 PM. Custom Cake Concierge & WhatsApp Desk: +91 98765 43210 | hello@velvetandcrumb.in.'
      },
      '/faq': {
        title: 'Frequently Asked Questions',
        subtitle: 'Everything about custom orders, eggless baking & chilled delivery',
        body: '1. How early should I order a custom cake? We deliver bespoke custom cakes within 48 hours of design confirmation. 2. Are all cakes available eggless? Yes, 100% of our menu and custom studio cakes can be crafted eggless without compromising texture. 3. How are cakes delivered? In temperature-controlled chilled vans.'
      },
      '/privacy-policy': {
        title: 'Privacy Policy',
        subtitle: 'Your data & custom design privacy',
        body: 'Velvet & Crumb Patisserie respects your personal information. Delivery addresses, phone numbers, and uploaded reference photos are used solely to fulfill and deliver your bakery orders securely.'
      },
      '/terms': {
        title: 'Terms & Conditions',
        subtitle: 'Order guidelines & bespoke customization terms',
        body: 'All custom cakes are handcrafted to order. Slight artistic variations in hand-piped florals and shades make every creation unique. Final custom quotes are valid for 48 hours.'
      },
      '/refund-policy': {
        title: 'Refund & Cancellation Policy',
        subtitle: 'Fair & transparent bakery policies',
        body: 'Standard cakes may be cancelled up to 12 hours prior to the delivery slot for a 100% refund. Custom couture cakes require 24 hours notice prior to baking commencement.'
      }
    };

    const info = contentMap[page] || contentMap['/about'];

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-[#F5EBE0] shadow-sm space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#D4A373] font-bold">{info.subtitle}</span>
          <h1 className="font-serif-luxury text-4xl font-bold text-[#3E2723]">{info.title}</h1>
          <p className="text-sm sm:text-base text-[#4E342E]/85 leading-relaxed">{info.body}</p>
          <div className="pt-4">
            <button onClick={() => navigate('/cakes')} className="px-6 py-3 rounded-full bg-[#3E2723] text-white text-xs font-bold">
              Explore Our Cakes
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // N. GLOBAL FOOTER
  // ==========================================================================
  const Footer = () => (
    <footer className="bg-[#3E2723] text-[#F5EBE0] pt-16 pb-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Cake className="w-7 h-7 text-[#D4A373]" />
            <span className="font-serif-luxury text-2xl font-bold text-white">Velvet & Crumb</span>
          </div>
          <p className="text-xs text-[#F5EBE0]/75 leading-relaxed">
            Luxury artisan patisserie crafting bespoke wedding tiers, signature Belgian truffle cakes, and 48-hour custom creations.
          </p>
          <div className="flex gap-3 pt-1">
            <span className="p-2 rounded-full bg-white/10 hover:bg-[#D4A373] transition cursor-pointer"><Camera className="w-4 h-4" /></span>
            <span className="p-2 rounded-full bg-white/10 hover:bg-[#D4A373] transition cursor-pointer"><Users className="w-4 h-4" /></span>
            <span className="p-2 rounded-full bg-white/10 hover:bg-[#D4A373] transition cursor-pointer"><Send className="w-4 h-4" /></span>
          </div>
        </div>

        <div>
          <h4 className="font-serif-luxury text-lg font-bold text-white mb-4">Quick Navigation</h4>
          <ul className="space-y-2.5 text-xs text-[#F5EBE0]/80">
            <li><button onClick={() => navigate('/cakes')} className="hover:text-[#D4A373]">All Cakes Catalogue</button></li>
            <li><button onClick={() => navigate('/birthday-cakes')} className="hover:text-[#D4A373]">Birthday Party Cakes</button></li>
            <li><button onClick={() => navigate('/custom-cake')} className="hover:text-[#D4A373]">10-Step Custom Cake Studio</button></li>
            <li><button onClick={() => navigate('/track-order')} className="hover:text-[#D4A373]">Track Live Order</button></li>
            <li><button onClick={() => navigate('/my-account')} className="hover:text-[#D4A373]">Customer Dashboard</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif-luxury text-lg font-bold text-white mb-4">Policies & Care</h4>
          <ul className="space-y-2.5 text-xs text-[#F5EBE0]/80">
            <li><button onClick={() => navigate('/about')} className="hover:text-[#D4A373]">About Us</button></li>
            <li><button onClick={() => navigate('/contact')} className="hover:text-[#D4A373]">Contact & Boutique</button></li>
            <li><button onClick={() => navigate('/faq')} className="hover:text-[#D4A373]">FAQs</button></li>
            <li><button onClick={() => navigate('/terms')} className="hover:text-[#D4A373]">Terms & Conditions</button></li>
            <li><button onClick={() => navigate('/privacy-policy')} className="hover:text-[#D4A373]">Privacy Policy</button></li>
            <li><button onClick={() => navigate('/refund-policy')} className="hover:text-[#D4A373]">Refund & Cancellation Policy</button></li>
          </ul>
        </div>

        <div className="space-y-3 text-xs text-[#F5EBE0]/80">
          <h4 className="font-serif-luxury text-lg font-bold text-white mb-4">Flagship Patisserie</h4>
          <p className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
            <span>SCO 24, Inner Market, Sector 9, Panchkula, Haryana 134109</span>
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#D4A373] shrink-0" />
            <span>+91 98765 43210 (9:30 AM – 10:30 PM)</span>
          </p>
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#D4A373] shrink-0" />
            <span>concierge@velvetandcrumb.in</span>
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex flex-wrap justify-between items-center text-xs text-[#F5EBE0]/60 gap-2">
        <span>© 2026 Velvet & Crumb Artisan Patisserie. All rights reserved.</span>
        <span>Freshly Baked Daily • 100% Eggless Options Available</span>
      </div>
    </footer>
  );

  // ==========================================================================
  // MODALS: GLOBAL SEARCH & PRODUCT QUICK VIEW
  // ==========================================================================
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF7] text-[#3E2723]">
      <FontAndStyleInjector />
      <Header />

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#3E2723] text-[#FFFBF7] px-5 py-3.5 rounded-2xl shadow-2xl border border-[#D4A373] flex items-center gap-3 text-xs font-semibold animate-bounce">
          <Sparkles className="w-4 h-4 text-[#D4A373]" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Global Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b pb-3">
              <Search className="w-5 h-5 text-[#D4A373]" />
              <input
                autoFocus
                type="text"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Search Belgian Truffle, Red Velvet, Biscoff, Birthday..."
                className="flex-1 text-sm focus:outline-none"
              />
              <button onClick={() => setSearchModalOpen(false)} className="p-1.5 rounded-full hover:bg-[#F5EBE0]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto space-y-2">
              {products
                .filter((p) => p.name.toLowerCase().includes(globalSearchQuery.toLowerCase()))
                .map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate('/cakes/detail', p.slug)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#FFFBF7] cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-sm text-[#3E2723]">{p.name}</p>
                        <span className="text-xs text-[#4E342E]/70">{p.category}</span>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-[#3E2723]">{formatINR(p.basePrice)}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl grid sm:grid-cols-2 gap-6 relative">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#F5EBE0] text-[#3E2723]"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={quickViewProduct.images[0]} alt="" className="w-full h-64 rounded-2xl object-cover" />
            <div className="space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#D4A373]">{quickViewProduct.category}</span>
                <h3 className="font-serif-luxury text-2xl font-bold text-[#3E2723] mt-1">{quickViewProduct.name}</h3>
                <p className="text-xs text-[#4E342E]/80 mt-2 leading-relaxed">{quickViewProduct.description}</p>
              </div>
              <div className="space-y-3 pt-2">
                <div className="text-xl font-bold text-[#3E2723]">Starting at {formatINR(quickViewProduct.basePrice)}</div>
                <button
                  onClick={() => {
                    const slug = quickViewProduct.slug;
                    setQuickViewProduct(null);
                    navigate('/cakes/detail', slug);
                  }}
                  className="w-full py-3 rounded-full bg-[#3E2723] text-white text-xs font-bold"
                >
                  Select Weight & Customize
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Route Switcher */}
      <main className="flex-1">
        {route === '/' && <HomePage />}
        {route === '/cakes' && <CataloguePage mode="all" />}
        {route === '/birthday-cakes' && <CataloguePage mode="birthday" />}
        {route === '/occasion' && <CataloguePage mode="occasion" />}
        {route === '/cakes/detail' && <ProductDetailPage />}
        {route === '/custom-cake' && <CustomCakeStudioPage />}
        {route === '/cart' && <CartPage />}
        {route === '/checkout' && <CheckoutPage />}
        {route === '/track-order' && <TrackOrderPage />}
        {route === '/login' && <AuthPage />}
        {route === '/my-account' && <CustomerDashboardPage />}
        {route === '/admin' && <AdminDashboardPage />}
        {['/about', '/contact', '/faq', '/privacy-policy', '/terms', '/refund-policy'].includes(route) && (
          <InfoPages page={route} />
        )}
      </main>

      <Footer />
    </div>
  );
}


export default App
