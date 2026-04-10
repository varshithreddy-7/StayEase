const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hotel-booking';

const hotelImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
  'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
];

const hotels = [
  {
    name: 'The Taj Palace',
    description: 'Experience unparalleled luxury at The Taj Palace, where timeless elegance meets modern sophistication. Nestled in the heart of Mumbai, this iconic 5-star hotel offers world-class amenities, exquisite dining, and breathtaking views of the Arabian Sea.',
    city: 'Mumbai',
    address: 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001',
    country: 'India',
    category: 'luxury',
    featuredImage: hotelImages[0],
    images: hotelImages.slice(0, 4),
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Concierge', 'Valet Parking', 'Business Center'],
    pricePerNight: 12000,
    rating: 4.8,
    reviewCount: 245,
    featured: true,
    checkInTime: '14:00',
    checkOutTime: '12:00',
    roomTypes: [
      { name: 'standard', description: 'Elegant room with city view, king-size bed, and modern amenities', price: 12000, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Safe'], quantity: 20 },
      { name: 'deluxe', description: 'Spacious deluxe room with sea view balcony and premium furnishings', price: 18000, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Safe', 'Balcony', 'Bathtub'], quantity: 15 },
      { name: 'suite', description: 'Luxurious suite with separate living area, butler service, and panoramic views', price: 35000, capacity: 4, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Safe', 'Jacuzzi', 'Butler Service', 'Living Room'], quantity: 5 }
    ],
    policies: { cancellation: 'Free cancellation up to 48 hours before check-in', pets: false, smoking: false }
  },
  {
    name: 'Leela Palace New Delhi',
    description: 'A magnificent palace-inspired hotel in Chanakyapuri, New Delhi. The Leela Palace offers a regal experience with its grand architecture, lush gardens, and impeccable service. A perfect blend of traditional Indian grandeur and contemporary luxury.',
    city: 'New Delhi',
    address: 'Diplomatic Enclave, Chanakyapuri, New Delhi 110023',
    country: 'India',
    category: 'luxury',
    featuredImage: hotelImages[1],
    images: hotelImages.slice(1, 5),
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Multiple Restaurants', 'Bar', 'Room Service', 'Valet Parking', 'Airport Transfer', 'Butler Service'],
    pricePerNight: 15000,
    rating: 4.9,
    reviewCount: 189,
    featured: true,
    roomTypes: [
      { name: 'standard', description: 'Palatial room with garden view, marble bathroom, and luxury toiletries', price: 15000, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Marble Bathroom'], quantity: 25 },
      { name: 'deluxe', description: 'Grand deluxe room with pool view and exclusive Leela amenities', price: 22000, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Pool View', 'Bathtub', 'Lounge Access'], quantity: 18 },
      { name: 'suite', description: 'Royal suite with private terrace, dining room, and dedicated butler', price: 45000, capacity: 4, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Private Terrace', 'Butler', 'Dining Room', 'Jacuzzi'], quantity: 8 }
    ],
    policies: { cancellation: 'Free cancellation up to 72 hours before check-in', pets: false, smoking: false }
  },
  {
    name: 'Zostel Backpackers Hostel',
    description: 'India\'s most popular backpacker hostel chain. Zostel offers affordable, clean, and vibrant accommodation perfect for solo travellers and budget adventurers. Meet fellow travellers from around the world in our common areas.',
    city: 'Jaipur',
    address: 'Near Hawa Mahal, Old City, Jaipur, Rajasthan 302002',
    country: 'India',
    category: 'budget',
    featuredImage: hotelImages[2],
    images: hotelImages.slice(2, 6),
    amenities: ['Free WiFi', 'Common Kitchen', 'Locker Storage', 'Travel Desk', 'Laundry', 'Rooftop Cafe', 'Board Games'],
    pricePerNight: 800,
    rating: 4.2,
    reviewCount: 432,
    featured: false,
    roomTypes: [
      { name: 'standard', description: 'Comfortable private room with attached bathroom and basic amenities', price: 800, capacity: 2, amenities: ['AC', 'WiFi', 'Locker', 'Linen'], quantity: 10 },
      { name: 'deluxe', description: 'Spacious private room with balcony and city view', price: 1200, capacity: 2, amenities: ['AC', 'WiFi', 'Balcony', 'TV', 'Linen'], quantity: 6 },
      { name: 'suite', description: '4-bed dorm with individual lockers and shared bathroom', price: 500, capacity: 4, amenities: ['AC', 'WiFi', 'Individual Lockers', 'Reading Light'], quantity: 8 }
    ],
    policies: { cancellation: 'Free cancellation up to 24 hours before check-in', pets: false, smoking: false }
  },
  {
    name: 'Marriott Resort & Spa',
    description: 'Escape to paradise at the Marriott Resort & Spa in Goa. With pristine beachfront access, multiple pools, world-class spa facilities, and spectacular sunset views, this resort redefines tropical luxury on India\'s most beloved coastline.',
    city: 'Goa',
    address: 'Miramar Beach, Panaji, Goa 403001',
    country: 'India',
    category: 'resort',
    featuredImage: hotelImages[3],
    images: hotelImages.slice(3, 7),
    amenities: ['Free WiFi', 'Private Beach', 'Multiple Pools', 'Water Sports', 'Spa', 'Gym', 'Multiple Restaurants', 'Bar', 'Kids Club', 'Tennis Court'],
    pricePerNight: 9500,
    rating: 4.7,
    reviewCount: 318,
    featured: true,
    roomTypes: [
      { name: 'standard', description: 'Garden view room with tropical decor and resort amenities', price: 9500, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Garden View'], quantity: 30 },
      { name: 'deluxe', description: 'Ocean-facing room with private balcony and premium furnishings', price: 14000, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Ocean View', 'Balcony', 'Bathtub'], quantity: 20 },
      { name: 'suite', description: 'Beachfront villa suite with private plunge pool and outdoor shower', price: 28000, capacity: 4, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Private Pool', 'Beach Access', 'Butler', 'Outdoor Shower'], quantity: 10 }
    ],
    policies: { cancellation: 'Free cancellation up to 48 hours before check-in', pets: true, smoking: false }
  },
  {
    name: 'ITC Grand Chola',
    description: 'A grand tribute to the great Chola dynasty, ITC Grand Chola in Chennai is an architectural masterpiece. This LEED Platinum certified luxury hotel combines sustainable practices with extraordinary luxury, featuring 600 rooms and the finest dining in South India.',
    city: 'Chennai',
    address: '63 Mount Road, Guindy, Chennai, Tamil Nadu 600032',
    country: 'India',
    category: 'luxury',
    featuredImage: hotelImages[4],
    images: hotelImages.slice(0, 4),
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Gym', '5 Restaurants', 'Bar', 'Room Service', 'Business Center', 'Valet Parking', 'Concierge'],
    pricePerNight: 11000,
    rating: 4.7,
    reviewCount: 276,
    featured: true,
    roomTypes: [
      { name: 'standard', description: 'Contemporary room with warm tones, king bed, and city skyline views', price: 11000, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Safe', 'Work Desk'], quantity: 40 },
      { name: 'deluxe', description: 'Expansive deluxe room with lounge access and premium bedding', price: 16000, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Safe', 'Lounge Access', 'Bathtub'], quantity: 25 },
      { name: 'suite', description: 'Grand suite with separate living and dining areas, personal butler service', price: 32000, capacity: 4, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Safe', 'Butler', 'Living Area', 'Dining Area', 'Jacuzzi'], quantity: 12 }
    ],
    policies: { cancellation: 'Free cancellation up to 48 hours before check-in', pets: false, smoking: false }
  },
  {
    name: 'Treebo Trend City Centre',
    description: 'Strategically located in the heart of Bangalore, Treebo Trend City Centre offers comfortable and affordable accommodation for business and leisure travellers. Clean rooms, reliable WiFi, and friendly staff make it the perfect mid-range choice.',
    city: 'Bangalore',
    address: 'MG Road, Shivaji Nagar, Bengaluru, Karnataka 560001',
    country: 'India',
    category: 'mid-range',
    featuredImage: hotelImages[5],
    images: hotelImages.slice(1, 5),
    amenities: ['Free WiFi', 'Restaurant', 'Room Service', 'Laundry', 'Travel Desk', 'Parking'],
    pricePerNight: 2500,
    rating: 4.0,
    reviewCount: 156,
    featured: false,
    roomTypes: [
      { name: 'standard', description: 'Comfortable standard room with all essential amenities', price: 2500, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Geyser'], quantity: 20 },
      { name: 'deluxe', description: 'Upgraded deluxe room with better furnishings and city view', price: 3500, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Geyser', 'City View', 'Work Desk'], quantity: 12 },
      { name: 'suite', description: 'Executive suite with separate sitting area and work zone', price: 5500, capacity: 3, amenities: ['AC', 'TV', 'WiFi', 'Geyser', 'Sitting Area', 'Minibar'], quantity: 4 }
    ],
    policies: { cancellation: 'Free cancellation up to 24 hours before check-in', pets: false, smoking: false }
  },
  {
    name: 'Ananda in the Himalayas',
    description: 'A destination spa retreat perched on a 100-acre Maharaja\'s Palace Estate in the Himalayan foothills above Rishikesh. Ananda is the world\'s foremost luxury wellness retreat, offering transformative Ayurvedic treatments, yoga, and meditation against a stunning mountain backdrop.',
    city: 'Rishikesh',
    address: 'The Palace Estate, Narendra Nagar, Rishikesh, Uttarakhand 249175',
    country: 'India',
    category: 'resort',
    featuredImage: hotelImages[6],
    images: hotelImages.slice(2, 6),
    amenities: ['Free WiFi', 'Spa', 'Yoga Studio', 'Meditation Center', 'Organic Restaurant', 'Pool', 'Gym', 'Trekking', 'Ayurveda Center', 'Garden'],
    pricePerNight: 22000,
    rating: 4.9,
    reviewCount: 134,
    featured: true,
    roomTypes: [
      { name: 'standard', description: 'Himalayan view room with hand-crafted furnishings and wellness amenities', price: 22000, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Yoga Mat', 'Himalayan View', 'Organic Toiletries'], quantity: 15 },
      { name: 'deluxe', description: 'Palace room with canopy bed, sitting area, and forest views', price: 30000, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Yoga Mat', 'Forest View', 'Bathtub', 'Balcony'], quantity: 10 },
      { name: 'suite', description: 'Viceregal Suite - the crown jewel with panoramic Himalayan views and personal wellness butler', price: 55000, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Private Terrace', 'Jacuzzi', 'Wellness Butler', 'Private Pool'], quantity: 3 }
    ],
    policies: { cancellation: 'Free cancellation up to 7 days before check-in', pets: false, smoking: false }
  },
  {
    name: 'Lemon Tree Premier',
    description: 'Lemon Tree Premier Hyderabad blends contemporary design with warm hospitality. Ideally located near the HITECH City business district, it is the preferred choice for corporate travellers seeking smart, stylish accommodation with excellent connectivity.',
    city: 'Hyderabad',
    address: 'Hitec City Main Road, Madhapur, Hyderabad, Telangana 500081',
    country: 'India',
    category: 'business',
    featuredImage: hotelImages[7],
    images: hotelImages.slice(3, 7),
    amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Swimming Pool', 'Gym', 'Business Center', 'Conference Rooms', 'Room Service', 'Laundry'],
    pricePerNight: 4500,
    rating: 4.3,
    reviewCount: 203,
    featured: false,
    roomTypes: [
      { name: 'standard', description: 'Smart business room with ergonomic workstation and high-speed internet', price: 4500, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Work Desk', 'Safe', 'Tea/Coffee Maker'], quantity: 35 },
      { name: 'deluxe', description: 'Premium club room with lounge access and enhanced business amenities', price: 6500, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Work Desk', 'Safe', 'Lounge Access', 'Minibar'], quantity: 20 },
      { name: 'suite', description: 'Executive suite with separate boardroom, dual vanity, and butler service', price: 11000, capacity: 3, amenities: ['AC', 'TV', 'WiFi', 'Boardroom', 'Butler', 'Minibar', 'Jacuzzi'], quantity: 8 }
    ],
    policies: { cancellation: 'Free cancellation up to 24 hours before check-in', pets: false, smoking: false }
  },
  {
    name: 'The Oberoi Udaivilas',
    description: 'Widely regarded as one of the greatest hotels in the world, The Oberoi Udaivilas sits on the banks of Lake Pichola in Udaipur. Its breathtaking architecture, opulent interiors, and legendary service create an experience that defines Indian palace hospitality.',
    city: 'Udaipur',
    address: 'Haridasji Ki Magri, Udaipur, Rajasthan 313001',
    country: 'India',
    category: 'luxury',
    featuredImage: hotelImages[0],
    images: [hotelImages[0], hotelImages[2], hotelImages[4], hotelImages[6]],
    amenities: ['Free WiFi', 'Lake View Pool', 'Spa', 'Gym', 'Boat Rides', 'Multiple Restaurants', 'Bar', 'Cooking Classes', 'Yoga', 'Elephant Experience'],
    pricePerNight: 28000,
    rating: 4.9,
    reviewCount: 98,
    featured: true,
    roomTypes: [
      { name: 'standard', description: 'Luxury room with semi-private pool and lake or garden views', price: 28000, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Semi-private Pool', 'Lake View', 'Marble Bathroom'], quantity: 20 },
      { name: 'deluxe', description: 'Premier room with private courtyard, lake view, and personalised butler', price: 40000, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Private Courtyard', 'Lake View', 'Butler', 'Bathtub'], quantity: 12 },
      { name: 'suite', description: 'Kohinoor Suite - pinnacle of opulence with private pool, dining pavilion, and 24hr butler', price: 85000, capacity: 4, amenities: ['AC', 'TV', 'WiFi', 'Private Pool', 'Dining Pavilion', 'Butler', 'Lake View', 'Jacuzzi'], quantity: 4 }
    ],
    policies: { cancellation: 'Free cancellation up to 7 days before check-in', pets: false, smoking: false }
  },
  {
    name: 'Fab Hotel Express',
    description: 'FabHotel Express is your reliable, budget-friendly stay in Kolkata. Clean rooms, courteous staff, and a central location near Park Street make it the ideal choice for travellers seeking value without compromising on comfort.',
    city: 'Kolkata',
    address: '12 Park Street, Park Street Area, Kolkata, West Bengal 700016',
    country: 'India',
    category: 'budget',
    featuredImage: hotelImages[1],
    images: hotelImages.slice(0, 3),
    amenities: ['Free WiFi', 'Room Service', 'Laundry', 'Front Desk 24/7', 'TV', 'Hot Water'],
    pricePerNight: 1200,
    rating: 3.9,
    reviewCount: 89,
    featured: false,
    roomTypes: [
      { name: 'standard', description: 'Clean and compact standard room with all basic necessities', price: 1200, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Hot Water'], quantity: 15 },
      { name: 'deluxe', description: 'Slightly larger deluxe room with improved furnishings', price: 1800, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Hot Water', 'Work Desk'], quantity: 8 },
      { name: 'suite', description: 'Family room with extra space, suitable for small families', price: 2800, capacity: 4, amenities: ['AC', 'TV', 'WiFi', 'Hot Water', 'Extra Beds'], quantity: 4 }
    ],
    policies: { cancellation: 'Free cancellation up to 12 hours before check-in', pets: false, smoking: false }
  },
  {
    name: 'Hyatt Regency',
    description: 'The Hyatt Regency Pune is a contemporary 5-star luxury hotel conveniently located in the vibrant Viman Nagar area. With sophisticated design, contemporary art installations, and world-class dining, it offers the perfect fusion of comfort and elegance.',
    city: 'Pune',
    address: 'Viman Nagar, Pune, Maharashtra 411014',
    country: 'India',
    category: 'luxury',
    featuredImage: hotelImages[3],
    images: [hotelImages[3], hotelImages[5], hotelImages[7], hotelImages[1]],
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Valet Parking', 'Business Center'],
    pricePerNight: 8000,
    rating: 4.6,
    reviewCount: 178,
    featured: false,
    roomTypes: [
      { name: 'standard', description: 'Contemporary king room with city views and Hyatt Grand Bed', price: 8000, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Safe', 'Work Desk'], quantity: 30 },
      { name: 'deluxe', description: 'Club room with regency club lounge access and premium amenities', price: 12000, capacity: 2, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Lounge Access', 'Bathtub'], quantity: 18 },
      { name: 'suite', description: 'Regency executive suite with panoramic views and personal concierge', price: 22000, capacity: 4, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Panoramic View', 'Concierge', 'Jacuzzi'], quantity: 6 }
    ],
    policies: { cancellation: 'Free cancellation up to 24 hours before check-in', pets: false, smoking: false }
  },
  {
    name: 'Wildflower Hall Shimla',
    description: 'Perched at 8,250 feet in the cedar forests above Shimla, Wildflower Hall is a legendary luxury retreat. Once the home of Lord Kitchener, this magnificent Oberoi property offers unparalleled Himalayan views, refined cuisine, and exhilarating mountain adventures.',
    city: 'Shimla',
    address: 'Chharabra, Shimla, Himachal Pradesh 171012',
    country: 'India',
    category: 'boutique',
    featuredImage: hotelImages[6],
    images: [hotelImages[6], hotelImages[4], hotelImages[2], hotelImages[0]],
    amenities: ['Free WiFi', 'Heated Pool', 'Spa', 'Gym', 'Trekking', 'Restaurant', 'Bar', 'Fireplace Lounges', 'Mountain Biking', 'Archery'],
    pricePerNight: 18000,
    rating: 4.8,
    reviewCount: 112,
    featured: true,
    roomTypes: [
      { name: 'standard', description: 'Cosy mountain room with cedar wood accents, fireplace and panoramic valley views', price: 18000, capacity: 2, amenities: ['Heating', 'TV', 'WiFi', 'Fireplace', 'Valley View', 'Bathtub'], quantity: 12 },
      { name: 'deluxe', description: 'Grand deluxe room with private sit-out, cedar tub and Himalayan vistas', price: 26000, capacity: 2, amenities: ['Heating', 'TV', 'WiFi', 'Fireplace', 'Private Sit-out', 'Cedar Tub'], quantity: 8 },
      { name: 'suite', description: 'Luxury suite with wraparound terrace, in-room dining, and mountain panorama', price: 48000, capacity: 3, amenities: ['Heating', 'TV', 'WiFi', 'Fireplace', 'Wraparound Terrace', 'Butler', 'Steam Room'], quantity: 4 }
    ],
    policies: { cancellation: 'Free cancellation up to 7 days before check-in', pets: false, smoking: false }
  }
];

const users = [
  { name: 'Admin User', email: 'admin@hotelbooking.com', password: 'admin123', role: 'admin', phone: '+91-9000000000' },
  { name: 'Rahul Sharma', email: 'rahul@example.com', password: 'password123', role: 'user', phone: '+91-9876543210' },
  { name: 'Priya Patel', email: 'priya@example.com', password: 'password123', role: 'user', phone: '+91-9876543211' },
  { name: 'Arjun Singh', email: 'arjun@example.com', password: 'password123', role: 'user', phone: '+91-9876543212' },
  { name: 'Ananya Krishnan', email: 'ananya@example.com', password: 'password123', role: 'user', phone: '+91-9876543213' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Hotel.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`👥 Created ${createdUsers.length} users`);
    console.log('   Admin: admin@hotelbooking.com / admin123');
    console.log('   User:  rahul@example.com / password123');

    // Create hotels
    const createdHotels = await Hotel.insertMany(hotels);
    console.log(`🏨 Created ${createdHotels.length} hotels`);

    // Create sample bookings
    const regularUsers = createdUsers.filter(u => u.role === 'user');
    const bookingsData = [
      {
        user: regularUsers[0]._id,
        hotel: createdHotels[0]._id,
        roomType: 'deluxe',
        checkIn: new Date('2025-06-01'),
        checkOut: new Date('2025-06-04'),
        guests: { adults: 2, children: 0 },
        rooms: 1,
        totalPrice: 54000,
        pricePerNight: 18000,
        nights: 3,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'mock',
        paymentIntentId: 'pi_mock_seed_001',
        guestInfo: { name: regularUsers[0].name, email: regularUsers[0].email, phone: regularUsers[0].phone }
      },
      {
        user: regularUsers[1]._id,
        hotel: createdHotels[3]._id,
        roomType: 'standard',
        checkIn: new Date('2025-07-10'),
        checkOut: new Date('2025-07-13'),
        guests: { adults: 2, children: 1 },
        rooms: 1,
        totalPrice: 28500,
        pricePerNight: 9500,
        nights: 3,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'mock',
        paymentIntentId: 'pi_mock_seed_002',
        guestInfo: { name: regularUsers[1].name, email: regularUsers[1].email, phone: regularUsers[1].phone }
      },
      {
        user: regularUsers[0]._id,
        hotel: createdHotels[6]._id,
        roomType: 'suite',
        checkIn: new Date('2025-08-15'),
        checkOut: new Date('2025-08-18'),
        guests: { adults: 2, children: 0 },
        rooms: 1,
        totalPrice: 165000,
        pricePerNight: 55000,
        nights: 3,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'card',
        guestInfo: { name: regularUsers[0].name, email: regularUsers[0].email, phone: regularUsers[0].phone }
      }
    ];

    for (const b of bookingsData) {
      const booking = new Booking(b);
      await booking.save();
    }
    console.log(`📅 Created ${bookingsData.length} sample bookings`);

    // Create sample reviews
    const reviewsData = [
      { user: regularUsers[0]._id, hotel: createdHotels[0]._id, rating: 5, title: 'Absolutely world class!', comment: 'The Taj Palace exceeded every expectation. The staff remembered my name from day one. The sea-view suite was breathtaking. Dining at Wasabi was a culinary masterpiece. Will definitely return.', categories: { cleanliness: 5, service: 5, location: 5, value: 4 } },
      { user: regularUsers[1]._id, hotel: createdHotels[0]._id, rating: 5, title: 'Iconic and unforgettable', comment: 'A bucket list hotel that lives up to all the hype. The architecture is stunning, the pool overlooks the Gateway of India, and the butler service is unmatched. Perfect anniversary celebration.', categories: { cleanliness: 5, service: 5, location: 5, value: 4 } },
      { user: regularUsers[2]._id, hotel: createdHotels[3]._id, rating: 5, title: 'Best beach resort in India', comment: 'The Goa Marriott is paradise. Private beach access, incredible pool, and the sunset views from the beach bar are unreal. Kids had a blast at the club. Food was exceptional too.', categories: { cleanliness: 5, service: 5, location: 5, value: 5 } },
      { user: regularUsers[0]._id, hotel: createdHotels[6]._id, rating: 5, title: 'A spiritual and luxurious escape', comment: 'Ananda is unlike any hotel I\'ve visited. The morning yoga at sunrise with the Himalayas as backdrop was transcendent. Ayurvedic treatments were authentic and healing. Truly transformative.', categories: { cleanliness: 5, service: 5, location: 5, value: 4 } },
      { user: regularUsers[1]._id, hotel: createdHotels[2]._id, rating: 4, title: 'Great budget option for backpackers', comment: 'Zostel is perfect for solo travelers. Met amazing people from all over the world in the common areas. The rooftop cafe has great views of Hawa Mahal. Clean, safe, and great value.', categories: { cleanliness: 4, service: 4, location: 5, value: 5 } },
      { user: regularUsers[3]._id, hotel: createdHotels[8]._id, rating: 5, title: 'Most romantic hotel on earth', comment: 'The Oberoi Udaivilas on the banks of Lake Pichola is pure magic. Watching the sun set over the lake from our private pool was the highlight of our trip. World class in every way.', categories: { cleanliness: 5, service: 5, location: 5, value: 4 } }
    ];

    for (const r of reviewsData) {
      const review = new Review(r);
      await review.save();
    }
    console.log(`⭐ Created ${reviewsData.length} reviews`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   👤 Admin:  admin@hotelbooking.com  | password: admin123');
    console.log('   👤 User 1: rahul@example.com       | password: password123');
    console.log('   👤 User 2: priya@example.com       | password: password123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedDB();
