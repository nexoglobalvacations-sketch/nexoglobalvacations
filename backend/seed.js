require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Admin = require('./src/models/Admin');
const Destination = require('./src/models/Destination');
const Package = require('./src/models/Package');
const Section = require('./src/models/Section');
const FAQ = require('./src/models/FAQ');
const Testimonial = require('./src/models/Testimonial');

const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tt_company';

const seedData = async () => {
  try {
    console.log(`Seeding database at ${connStr}...`);
    await mongoose.connect(connStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await Admin.deleteMany({});
    await Destination.deleteMany({});
    await Package.deleteMany({});
    await Section.deleteMany({});
    await FAQ.deleteMany({});
    await Testimonial.deleteMany({});
    console.log('Database cleared.');

    // 1. Create Default Admin
    const admin = await Admin.create({
      name: 'TT Admin',
      email: 'nexoglobalvacations@gmail.com',
      password: 'admin123' // Will be pre-hashed by schema hooks
    });
    console.log('Default admin created: nexoglobalvacations@gmail.com / admin123');

    // 2. Create Destinations
    const destinationsData = [
      {
        name: 'Goa',
        type: 'state',
        description: 'Sun-kissed beaches, vibrant nightlife, Portuguese heritage, and spice plantations.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        isFeatured: true
      },
      {
        name: 'Himachal Pradesh',
        type: 'state',
        description: 'Majestic snowy peaks, green valleys, adventure sports, and scenic hill stations.',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
        isFeatured: true
      },
      {
        name: 'Kerala',
        type: 'state',
        description: 'Serene backwaters, tea gardens, coconut palms, spice plantations, and Ayurvedic therapies.',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
        isFeatured: true
      },
      {
        name: 'Ladakh',
        type: 'state',
        description: 'High-altitude deserts, cobalt blue lakes, ancient monasteries, and thrilling mountain passes.',
        image: 'https://images.unsplash.com/photo-1596701062351-df5f8af5576a?auto=format&fit=crop&w=800&q=80',
        isFeatured: true
      },
      {
        name: 'Andaman & Nicobar',
        type: 'state',
        description: 'Turquoise ocean water, exotic coral reefs, historic cell prisons, and white sand shores.',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
        isFeatured: true
      },
      {
        name: 'Uttar Pradesh',
        type: 'state',
        description: 'The ancient cradle of spiritual India, home of Varanasi, Ayodhya, and spectacular river aartis.',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80',
        isFeatured: true
      },
      {
        name: 'Sri Lanka',
        type: 'country',
        description: 'Tear-drop island of golden coastlines, Buddhist ruins, rich wildlife parks, and emerald hills.',
        image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
        isFeatured: true
      },
      {
        name: 'Bhutan',
        type: 'country',
        description: 'The mystical Himalayan kingdom of happiness, high fortresses, and cliffside shrines.',
        image: 'https://images.unsplash.com/photo-1585128719715-46776b56a0d1?auto=format&fit=crop&w=800&q=80',
        isFeatured: true
      },
      {
        name: 'Nepal',
        type: 'country',
        description: 'The spectacular rooftop of the world, home of Mount Everest and rich spiritual shrines.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
        isFeatured: true
      }
    ];

    const dests = await Destination.create(destinationsData);
    console.log(`${dests.length} Destinations created.`);

    // Helper map
    const destMap = {};
    dests.forEach(d => {
      destMap[d.name] = d._id;
    });

    // 3. Create Packages
    const packagesData = [
      // Beaches Category
      {
        name: 'Paradise Of Kerala Tour',
        price: 24999,
        duration: '08 D / 07 N',
        category: 'Beaches',
        destination: destMap['Kerala'],
        overview: 'Indulge in a premium escape across the God\'s Own Country. Cruising through the backwaters in houseboats, visiting beautiful spice plantations, and spending relaxing evenings on Kovalam and Varkala beaches.',
        itinerary: [
          { day: 1, title: 'Arrival in Cochin & Drive to Munnar', activities: ['Meet at Cochin Airport', 'Sightseeing of Cheeyappara waterfalls', 'Check-in to luxury resort in Munnar'], accommodation: 'Premium Hill Valley Resort', meals: 'Dinner', transport: 'Private A/C Sedan' },
          { day: 2, title: 'Munnar Sightseeing Tour', activities: ['Visit Mattupetty Dam & Kundala Lake', 'Tea Museum walkthrough', 'Eravikulam National Park to spot Nilgiri Tahr'], accommodation: 'Premium Hill Valley Resort', meals: 'Breakfast & Dinner', transport: 'Private A/C Sedan' },
          { day: 3, title: 'Scenic drive to Thekkady Wild Reserve', activities: ['Drive through cardamom hills', 'Elephant safari and spice plantation tour', 'Evening Kathakali dance show'], accommodation: 'Spice Garden Villa', meals: 'Breakfast', transport: 'Private A/C Sedan' },
          { day: 4, title: 'Houseboat Cruise in Kumarakom / Alleppey', activities: ['Board traditional Kettuvallam luxury houseboat', 'Cruise along palm-fringed lagoons', 'Traditional Kerala lunch onboard'], accommodation: 'Luxury Houseboat', meals: 'Breakfast, Lunch & Dinner', transport: 'Houseboat' }
        ],
        included: ['Accommodation in 4-Star hotels', 'Buffet breakfasts & dinners', 'Private sedan car for all transits', 'Houseboat cruise with all meals', 'All toll and parking taxes'],
        excluded: ['Airfare or train tickets', 'Entrance ticket fees for monuments', 'Adventure water sport charges', 'Personal laundry & telephone calls'],
        hotelDetails: 'Premium 4-Star Deluxe hotels (Munnar: Tea County, Thekkady: Elephant Court, Houseboat: Aqua Castle Luxury).',
        mealDetails: 'Daily breakfast and dinner included in hotels. All meals (Breakfast, traditional lunch, and dinner) are included in the Houseboat cruise.',
        transportDetails: 'Dedicated AC sedan (Dezire/Etios) for all terminal transits and day excursions.',
        thumbnail: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80',
        heroBanner: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1533826359117-eb1a4775087e?auto=format&fit=crop&w=800&q=80'
        ],
        faq: [
          { question: 'What is the best time to visit Kerala?', answer: 'The best time is from September to March, when the weather is extremely pleasant.' },
          { question: 'Is the houseboat cruise safe for family trips?', answer: 'Yes, our houseboats are fully certified, equipped with safety jackets, and manned by professional staff.' }
        ],
        seoMetaTitle: 'Premium Paradise of Kerala Luxury Tour Packages | TT Company',
        seoMetaDescription: 'Book our top-rated 8 days Kerala tour package. Includes luxurious houseboats, Munnar tea hills, spice garden walk, and private transfers.'
      },
      {
        name: 'Mesmerizing Andamans',
        price: 15499,
        duration: '04 D / 03 N',
        category: 'Beaches',
        destination: destMap['Andaman & Nicobar'],
        overview: 'Experience the absolute beauty of Andaman Islands. Enjoy walking on white sand beaches, exploring coral reefs, and visiting historic spots like Cellular Jail.',
        itinerary: [
          { day: 1, title: 'Arrival at Port Blair & Cellular Jail Visit', activities: ['Airport pickup', 'Check-in to seaside hotel', 'Cellular jail visit & Evening Sound & Light show'], accommodation: 'Sinclairs Bay View', meals: 'Dinner', transport: 'Private Sedan' },
          { day: 2, title: 'Ferry ride to Havelock & Radhanagar Beach', activities: ['Premium cruise ferry to Havelock Island', 'Relaxing at Asia\'s cleanest beach - Radhanagar Beach', 'Enjoy sunset on the beach'], accommodation: 'Barefoot Resort Havelock', meals: 'Breakfast', transport: 'Cruise Ferry + SUV' }
        ],
        included: ['Accommodation at deluxe seaside resorts', 'Daily breakfast', 'Premium cruise ferry tickets (Makruzz/Nautika)', 'Cellular jail entry & light show fees'],
        excluded: ['Water activities like Scuba or Sea Walk', 'Lunches & dinners', 'Flight tickets'],
        hotelDetails: 'Stay at Port Blair (Sinclairs) and Havelock Island (Barefoot luxury beach huts).',
        mealDetails: 'Buffet breakfasts are included in hotels.',
        transportDetails: 'Private transfers using AC SUV/Sedan and premium high-speed catamaran ferries between islands.',
        thumbnail: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80',
        heroBanner: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80'
        ],
        faq: [
          { question: 'Do I need a passport/visa to visit Andamans?', answer: 'No, Indian citizens do not require any passport or visa. Only foreigners need a RAP (Restricted Area Permit).' }
        ],
        seoMetaTitle: 'Mesmerizing Havelock Andaman Tours | TT Company',
        seoMetaDescription: 'Book an exotic 4-day trip to Havelock and Port Blair. Relax at Radhanagar Beach, cruise on Makruzz ferry, and experience the light show.'
      },
      {
        name: 'Delightful Goa Vacation',
        price: 12999,
        duration: '04 D / 03 N',
        category: 'Beaches',
        destination: destMap['Goa'],
        overview: 'Unwind in the party capital of India. Explore sandy beaches, colonial churches, and rich local spice plantations.',
        itinerary: [
          { day: 1, title: 'Arrival in North Goa & Beach Leisure', activities: ['Pickup from Mopa/Dabolim Airport', 'Check-in to pool resort', 'Walk around Baga and Calangute Beach'], accommodation: 'Seaside Pearl Resort', meals: 'Dinner', transport: 'Private Sedan' },
          { day: 2, title: 'South Goa Heritage and Spice Tour', activities: ['Visit Basilica of Bom Jesus', 'Walk in Old Portuguese houses', 'Buffet lunch at organic spice plantation'], accommodation: 'Seaside Pearl Resort', meals: 'Breakfast & Lunch', transport: 'Private Sedan' }
        ],
        included: ['Resort stay with swimming pool access', 'Airport pickup & drop', 'Spice plantation tour with lunch'],
        excluded: ['Alcoholic beverages', 'Jet-ski and parasailing charges'],
        hotelDetails: 'Stay at 4-Star boutique pool resort in Candolim.',
        mealDetails: 'Daily breakfast and one special Goan Buffet Lunch during the spice plantation tour.',
        transportDetails: 'Dedicated AC car for airport transfers and South Goa sightseeing.',
        thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        heroBanner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        gallery: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
        faq: [{ question: 'Which airport is closer to North Goa?', answer: 'Mopa (Manohar International Airport) is much closer and highly recommended for North Goa resorts.' }],
        seoMetaTitle: '4 Days Delightful Goa Beach Tour Package | TT Company',
        seoMetaDescription: 'Plan your short getaway to Goa. Book now to get special offers on premium resorts, airport transfers, and Old Goa sightseeing tours.'
      },

      // Spiritual Category
      {
        name: 'Feel Spiritual In Uttar Pradesh',
        price: 12185,
        duration: '06 D / 05 N',
        category: 'Spiritual',
        destination: destMap['Uttar Pradesh'],
        overview: 'Embark on a divine spiritual journey across the holy heartland of Northern India. Witness the timeless Ganga Aarti in Varanasi, bathe in the sacred Sangam at Prayagraj, and pray at the grand Ram Mandir in Ayodhya.',
        itinerary: [
          { day: 1, title: 'Arrival in Varanasi & Evening Ganga Aarti', activities: ['Varanasi airport pickup', 'Check-in to heritage hotel', 'Experience subah-e-banaras and majestic Ganga Aarti on boat'], accommodation: 'Heritage Inn Varanasi', meals: 'Dinner', transport: 'AC Car + Boat' },
          { day: 2, title: 'Kashi Vishwanath Temple Darshan & Sarnath', activities: ['Morning VIP Darshan at Kashi Vishwanath temple', 'Sarnath Buddhist archaeological site visit', 'Explore handloom silk saree shops'], accommodation: 'Heritage Inn Varanasi', meals: 'Breakfast', transport: 'AC Sedan' },
          { day: 3, title: 'Drive to Prayagraj (Triveni Sangam)', activities: ['Early morning drive to Prayagraj', 'Boat ride to Triveni Sangam point for holy dip', 'Visit Anand Bhavan and Sleeping Hanuman temple'], accommodation: 'Hotel Kanha Shyam', meals: 'Breakfast & Dinner', transport: 'AC Sedan' },
          { day: 4, title: 'Drive to Ayodhya (Sacred Ram Mandir)', activities: ['Drive to holy city Ayodhya', 'VIP Darshan at newly constructed Shri Ram Janmabhoomi Mandir', 'Aarti at Saryu river ghats'], accommodation: 'Ramayana Hotel Ayodhya', meals: 'Breakfast', transport: 'AC Sedan' }
        ],
        included: ['VIP Darshan tickets at Ram Mandir and Kashi Vishwanath', 'Comfortable heritage hotel stays', 'Daily breakfast & dinners', 'Private boat cruises on river Ganges'],
        excluded: ['Pooja samagri & personal donation fees', 'Sarnath entry charges', 'Train/Flight tickets'],
        hotelDetails: 'Clean heritage hotels and 3/4 Star spiritual comfort properties.',
        mealDetails: 'Sattvik vegetarian breakfasts and dinners are included at hotel restaurants.',
        transportDetails: 'Private AC Cab for all interstate travel and ghat transfers.',
        thumbnail: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=600&q=80',
        heroBanner: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
        ],
        faq: [
          { question: 'Is Ram Mandir fully open to public?', answer: 'Yes, Ram Mandir is open for daily general darshan and specialized booking slots are also available.' }
        ],
        seoMetaTitle: 'Holy Varanasi Prayagraj Ayodhya Spiritual Tour | TT Company',
        seoMetaDescription: 'Book your 6 Days spiritual trip to Varanasi, Triveni Sangam, and Ayodhya Ram Mandir. Includes VIP entry passes, luxury private boats, and professional guides.'
      },
      {
        name: 'Spiritual Varanasi, Prayagraj & Ayodhya',
        price: 10152,
        duration: '05 D / 04 N',
        category: 'Spiritual',
        destination: destMap['Bhutan'],
        overview: 'A condensed high-value pilgrimage package traversing the holy cities of Varanasi, Prayagraj, and Ayodhya in premium comfort.',
        itinerary: [
          { day: 1, title: 'Kashi Arrival & Ganga Aarti', activities: ['Arrival and transfer to hotel', 'Evening private boat view of Ganga Aarti at Dashashwamedh Ghat'], accommodation: 'Ganga Palace', meals: 'Dinner', transport: 'Private Sedan' },
          { day: 2, title: 'Drive to Prayagraj Sangam & Drive to Ayodhya', activities: ['Bathe at Triveni Sangam in Prayagraj', 'Drive to Ayodhya for overnight stay'], accommodation: 'Saket Hotel', meals: 'Breakfast', transport: 'AC Sedan' }
        ],
        included: ['4 Nights hotel accommodation', 'Daily vegetarian breakfasts', 'Private boat ride in Varanasi'],
        excluded: ['VIP Darshan fast-passes', 'Guide fees'],
        hotelDetails: 'Stay at local spiritual boutique properties.',
        mealDetails: 'Vegetarian breakfasts are included.',
        transportDetails: 'Private AC Toyota Etios/Innova.',
        thumbnail: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80',
        heroBanner: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
        gallery: ['https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'],
        faq: [{ question: 'How far is Varanasi from Ayodhya?', answer: 'It is approximately 220 km and takes around 4.5 hours via the national highway.' }],
        seoMetaTitle: 'Varanasi Prayagraj Ayodhya 5 Days Packages | TT Company',
        seoMetaDescription: 'Book your 5 days Hindu pilgrimage trip online. Clean stays, private AC vehicle, holy dip boat trip, and Ram Janmabhoomi darshan.'
      },
      {
        name: 'Spiritual Ayodhya Special',
        price: 4851,
        duration: '03 D / 02 N',
        category: 'Spiritual',
        destination: destMap['Nepal'],
        overview: 'A short weekend journey to experience the newly re-imagined holy city of Ayodhya. Seek blessings at Ram Mandir and explore historic sites.',
        itinerary: [
          { day: 1, title: 'Ayodhya Arrival & Saryu Aarti', activities: ['Transfer to hotel', 'Visit Hanuman Garhi temple', 'Evening spectacular Saryu River sound show and Aarti'], accommodation: 'Saryu Guest House', meals: 'Dinner', transport: 'Sedan' }
        ],
        included: ['Budget luxury hotel rooms', 'Daily breakfast & dinner', 'AC local transfers'],
        excluded: ['Train tickets', 'VIP Darshan costs'],
        hotelDetails: 'Ramayana Hotel / Saryu Heritage Rooms.',
        mealDetails: 'Breakfast and dinner are included.',
        transportDetails: 'Private local AC cab.',
        thumbnail: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
        heroBanner: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
        gallery: ['https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'],
        faq: [{ question: 'Is online registration mandatory for Ram Mandir?', answer: 'No, but highly recommended to avoid long queues.' }],
        seoMetaTitle: 'Ayodhya Quick Weekend Tour Packages | TT Company',
        seoMetaDescription: 'Quick 3-day spiritual escape to Ayodhya Ram Mandir. Affordable rates, private transport, and Hanuman Garhi temple darshan.'
      },

      // Group Tours Category
      {
        name: 'Jyotirlingas Darhan With Maheshwar',
        price: 9599,
        duration: '04 D / 03 N',
        category: 'Group Tours',
        destination: destMap['Himachal Pradesh'],
        overview: 'Join our popular group pilgrimage to witness two glorious Jyotirlingas in Madhya Pradesh: Mahakaleshwar in Ujjain and Omkareshwar. Wrap up your spiritual journey at the historic Maheshwar fort.',
        itinerary: [
          { day: 1, title: 'Indore Arrival & Drive to Ujjain', activities: ['Indore airport pickup', 'Drive to Ujjain', 'Attend Bhasma Aarti booking at Mahakaleshwar temple'], accommodation: 'Ujjain Heights Hotel', meals: 'Dinner', transport: 'Cozy AC Mini Coach' },
          { day: 2, title: 'Omkareshwar Island Temple Visit', activities: ['Drive to sacred Omkareshwar island on Narmada River', 'Attend evening prayers'], accommodation: 'Omkareshwar Narmada Lodge', meals: 'Breakfast & Dinner', transport: 'AC Coach' }
        ],
        included: ['Shared tour package in luxury AC traveler coaches', 'Vegetarian buffet breakfasts & dinners', 'Bhasma Aarti online booking support', 'Experienced group coordinator'],
        excluded: ['Individual Pooja tickets', 'Personal expenses'],
        hotelDetails: 'Stay at comfortable 3-Star properties customized for spiritual groups.',
        mealDetails: 'Daily pure vegetarian group meals.',
        transportDetails: 'Luxury AC Force Traveler or Mini Coach for the group.',
        thumbnail: 'https://images.unsplash.com/photo-1585128719715-46776b56a0d1?auto=format&fit=crop&w=600&q=80',
        heroBanner: 'https://images.unsplash.com/photo-1585128719715-46776b56a0d1?auto=format&fit=crop&w=1200&q=80',
        gallery: ['https://images.unsplash.com/photo-1585128719715-46776b56a0d1?auto=format&fit=crop&w=800&q=80'],
        faq: [{ question: 'What is Bhasma Aarti timing?', answer: 'It takes place early morning from 4:00 AM to 6:00 AM. Advance online registration is compulsory.' }],
        seoMetaTitle: 'Ujjain Omkareshwar Jyotirlinga Group Tour Packages | TT Company',
        seoMetaDescription: 'Join our weekly group departures to Mahakaleshwar Jyotirlinga in Ujjain and Omkareshwar temple. Includes Maheshwar fort visit, hotel stays, and pure veg meals.'
      },
      {
        name: 'Splendors Of Madhya Pradesh',
        price: 34999,
        duration: '16 D / 15 N',
        category: 'Group Tours',
        destination: destMap['Himachal Pradesh'],
        overview: 'An extensive group journey through the heart of India. Discover tigers in Bandhavgarh, temples in Khajuraho, forts in Gwalior, and waterfalls in Jabalpur.',
        itinerary: [
          { day: 1, title: 'Arrival in Gwalior Fort City', activities: ['Airport pickup', 'Check-in to Gwalior palace hotel', 'Sightseeing of Gwalior Fort & Man Singh Palace'], accommodation: 'Gwalior Palace Hotel', meals: 'Dinner', transport: 'AC Traveler' }
        ],
        included: ['15 Nights deluxe hotel stays', 'Daily buffet breakfasts & dinners', '2 Tiger safaris in Bandhavgarh', 'Jabalpur marble rocks boat ride'],
        excluded: ['Lunches', 'Camera fees during wildlife safaris'],
        hotelDetails: 'Deluxe heritage properties and national park jungle resorts.',
        mealDetails: 'All buffet breakfasts and dinners are included.',
        transportDetails: 'Dedicated AC Bus/Traveler for the group throughout the itinerary.',
        thumbnail: 'https://images.unsplash.com/photo-1596701062351-df5f8af5576a?auto=format&fit=crop&w=600&q=80',
        heroBanner: 'https://images.unsplash.com/photo-1596701062351-df5f8af5576a?auto=format&fit=crop&w=1200&q=80',
        gallery: ['https://images.unsplash.com/photo-1596701062351-df5f8af5576a?auto=format&fit=crop&w=800&q=80'],
        faq: [{ question: 'Are wildlife safaris guaranteed?', answer: 'Yes, two safari slots are pre-booked for the group, but tiger sighting is subject to pure luck!' }],
        seoMetaTitle: '16 Days Madhya Pradesh Complete Group Tour | TT Company',
        seoMetaDescription: 'Experience the ultimate Central India tour package. Explore historic Gwalior, spiritual Orchha, erotical Khajuraho temples, and Bandhavgarh tiger safaris.'
      }
    ];

    const packs = await Package.create(packagesData);
    console.log(`${packs.length} Packages created.`);

    // 4. Create Curated Homepage Sections
    const sectionBeaches = await Section.create({
      name: 'Beaches Special',
      slug: 'beaches-special',
      packages: packs.filter(p => p.category === 'Beaches').map(p => p._id),
      bannerImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      order: 1
    });

    const sectionSpiritual = await Section.create({
      name: 'Spirituality Special',
      slug: 'spirituality-special',
      packages: packs.filter(p => p.category === 'Spiritual').map(p => p._id),
      bannerImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80',
      order: 2
    });

    const sectionGroup = await Section.create({
      name: 'Recommended Group Tours',
      slug: 'recommended-group-tours',
      packages: packs.filter(p => p.category === 'Group Tours').map(p => p._id),
      bannerImage: 'https://images.unsplash.com/photo-1585128719715-46776b56a0d1?auto=format&fit=crop&w=800&q=80',
      order: 3
    });

    console.log('3 Custom Homepage Sections created successfully.');

    // 5. Create FAQs
    const faqsData = [
      {
        question: 'How do I book a customized tour package?',
        answer: 'You can submit your preferences through our dynamic Inquiry Page, or click the WhatsApp button to chat directly with a custom tour specialist. We will tailor the hotels, transport, and itineraries to fit your budget perfectly.',
        category: 'Booking',
        order: 1
      },
      {
        question: 'Are flight tickets included in the packages?',
        answer: 'Unless specifically noted in the inclusions section, our base packages cover only land package components (luxurious accommodation, private AC cabs, guided tours, breakfasts, and taxes). However, we can assist in booking flight tickets at extra cost.',
        category: 'Services',
        order: 2
      },
      {
        question: 'Can I modify the day-wise itinerary during the tour?',
        answer: 'Minor adjustments can be arranged in coordination with our private drivers, subject to route viability. Major destination changes are not possible once the hotels are booked.',
        category: 'Policies',
        order: 3
      },
      {
        question: 'What happens in case of sudden weather blockages (e.g. in Ladakh)?',
        answer: 'We prioritize customer safety. If a pass is blocked, we arrange alternative routes or overnight stays in safe zones. Any difference in hotel costs will be charged according to real-time bills.',
        category: 'Safety',
        order: 4
      }
    ];

    await FAQ.create(faqsData);
    console.log('FAQs created.');

    // 6. Create Testimonials
    const testimonialsData = [
      {
        name: 'Aishwarya Roy',
        role: 'Corporate HR',
        review: 'We booked the Paradise of Kerala Tour for our family vacation. The hotel selection was absolutely premium, and the private chauffeur was extremely polite. The luxury houseboat experience in Kumarakom was unforgettable!',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        order: 1
      },
      {
        name: 'Rahul Sharma',
        role: 'Tech Lead',
        review: 'The spiritual trip to Varanasi and Ayodhya Ram Mandir was seamless. TT Company booked VIP darshan tickets which saved us hours of standing in queues. Highly professional and recommended!',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        order: 2
      },
      {
        name: 'Megha Gupta',
        role: 'Lifestyle Blogger',
        review: 'Havelock Island is a dream! The beach resort recommendation was barefoot luxury at its finest. All cruise bookings were handled on time. Will definitely book my next Bali trip with TT Company!',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        order: 3
      }
    ];

    await Testimonial.create(testimonialsData);
    console.log('Testimonials seeded.');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

seedData();
