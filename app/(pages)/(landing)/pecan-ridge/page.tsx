import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Award,
  Bell,
  Calendar,
  CalendarCheck,
  Car,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Droplets,
  FileText,
  Home,
  Mail,
  MapPin,
  PawPrint,
  Phone,
  Quote,
  Shield,
  Sparkles,
  Star,
  Sun,
  TreePine,
  Users,
  UtensilsCrossed,
  Wifi,
  Wrench,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PecanRidgePage() {
  const features = [
    {
      icon: Wifi,
      title: "High-Speed WiFi",
      description:
        "Stay connected with complimentary fiber-optic internet throughout the park",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Full Hookups",
      description:
        "50 AMP electric, water, and sewer connections at every site",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Droplets,
      title: "Modern Facilities",
      description:
        "Clean restrooms, hot showers, and laundry facilities available 24/7",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: TreePine,
      title: "Natural Setting",
      description:
        "Beautiful landscaping with mature pecan trees providing shade",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Car,
      title: "Easy Access",
      description: "Pull-through sites with paved roads and ample parking",
      color: "from-slate-500 to-gray-500",
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description:
        "Gated community with 24/7 security monitoring for peace of mind",
      color: "from-violet-500 to-purple-500",
    },
  ];

  const portalFeatures = [
    {
      icon: CreditCard,
      title: "Online Rent Payments",
      description:
        "Pay your rent securely online anytime with our integrated Stripe payment system. View payment history and upcoming due dates.",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    },
    {
      icon: Wrench,
      title: "Service Requests",
      description:
        "Submit maintenance and service requests instantly through your portal. Track progress and communicate with management.",
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    },
    {
      icon: Bell,
      title: "Real-Time Notifications",
      description:
        "Stay informed with instant announcements about park updates, events, and important notices from management.",
      gradient: "from-amber-500 via-orange-500 to-red-500",
    },
    {
      icon: FileText,
      title: "Digital Documents",
      description:
        "Access your lease agreements, receipts, and important documents anytime from your secure resident portal.",
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Apply Online",
      description:
        "Fill out our simple online application. We'll review it within 24 hours and get back to you.",
      icon: FileText,
    },
    {
      step: "02",
      title: "Get Approved",
      description:
        "Once approved, receive your welcome package and portal login credentials via email.",
      icon: CheckCircle2,
    },
    {
      step: "03",
      title: "Move In",
      description:
        "Schedule your move-in date, sign your lease digitally, and we'll prepare your spot.",
      icon: Home,
    },
    {
      step: "04",
      title: "Enjoy Living",
      description:
        "Access your resident portal to pay rent, submit requests, and enjoy park life hassle-free.",
      icon: Sparkles,
    },
  ];

  const pricingPlans = [
    {
      id: "shortTerm",
      name: "Short-Term",
      price: "$55",
      period: "per night",
      description: "Perfect for travelers and weekend getaways",
      features: [
        "Full hookups (50/30 AMP)",
        "WiFi included",
        "All amenities access",
        "Flexible stay duration",
        "No long-term commitment",
      ],
      highlight: false,
    },
    {
      id: "longTerm",
      name: "Long-Term",
      price: "$650",
      period: "per month",
      description: "Best value for seasonal residents",
      features: [
        "Everything in Short-Term",
        "Priority site selection",
        "Dedicated parking",
        "Package receiving",
        "24/7 support priority",
        "Discounted rates",
      ],
      highlight: true,
    },
    {
      id: "annual",
      name: "Annual",
      price: "$7,200",
      period: "per year",
      description: "Ultimate savings for year-round residents",
      features: [
        "Everything in Long-Term",
        "2 months free",
        "Premium site guarantee",
        "Storage included",
        "VIP community events",
        "Concierge services",
      ],
      highlight: false,
    },
  ];

  const amenities = [
    { icon: Zap, text: "Full RV Hookups (50/30 AMP)" },
    { icon: Wifi, text: "Free WiFi & Cable TV" },
    { icon: Sparkles, text: "Laundry Facilities" },
    { icon: PawPrint, text: "Pet-Friendly Park" },
    { icon: TreePine, text: "Shaded Picnic Areas" },
    { icon: UtensilsCrossed, text: "BBQ Grills" },
    { icon: Sun, text: "Playground Area" },
    { icon: Droplets, text: "Propane Filling Station" },
    { icon: Award, text: "Dump Station" },
    { icon: Mail, text: "Mail Service" },
    { icon: Home, text: "Package Receiving" },
    { icon: Clock, text: "On-Site Management" },
  ];

  const stats = [
    { icon: Home, value: "100+", label: "RV Sites", color: "emerald" },
    { icon: Users, value: "500+", label: "Happy Residents", color: "blue" },
    { icon: Star, value: "4.9/5", label: "Average Rating", color: "amber" },
    { icon: CalendarCheck, value: "365", label: "Days Open", color: "teal" },
  ];

  const testimonials = [
    {
      name: "Sarah & Mike Thompson",
      location: "Full-time RVers",
      image: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      text: "Pecan Ridge has been our home for 2 years now. The management is fantastic, facilities are always clean, and the community is welcoming. It's truly paradise!",
    },
    {
      name: "Robert Martinez",
      location: "Snowbird from Minnesota",
      image: "https://i.pravatar.cc/150?img=33",
      rating: 5,
      text: "Best RV park in Alabama! The amenities are top-notch, and the location is perfect. We return every winter and wouldn't stay anywhere else.",
    },
    {
      name: "Linda & Tom Baker",
      location: "Retired Travelers",
      image: "https://i.pravatar.cc/150?img=26",
      rating: 5,
      text: "We've stayed at over 100 RV parks across the country, and Pecan Ridge is hands down our favorite. The attention to detail and customer service is exceptional.",
    },
  ];

  const gallery = [
    {
      url: "https://images.unsplash.com/photo-1525811902-f2342640856e?q=80&w=2400&auto=format&fit=crop",
      alt: "Luxury RV campsite with mountain views",
      title: "Premium Sites",
      description: "Spacious lots with stunning natural surroundings",
    },
    {
      url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2400&auto=format&fit=crop",
      alt: "Family camping under majestic trees",
      title: "Nature Living",
      description: "Peaceful environment for your perfect retreat",
    },
    {
      url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2400&auto=format&fit=crop",
      alt: "Modern RV park with full amenities",
      title: "Full Service",
      description: "Everything you need at your fingertips",
    },
    {
      url: "https://images.unsplash.com/photo-1714761127637-cc51b5cbf7b6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1469",
      alt: "Sunset camping with friends",
      title: "Community",
      description: "Make lasting memories with neighbors",
    },
    {
      url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2400&auto=format&fit=crop",
      alt: "Lakeside RV camping at golden hour",
      title: "Scenic Views",
      description: "Wake up to breathtaking landscapes",
    },
    {
      url: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?q=80&w=2400&auto=format&fit=crop",
      alt: "Modern RV interior with family",
      title: "Comfort",
      description: "Your home away from home",
    },
  ];

  const communityFeatures = [
    {
      title: "Weekly Events",
      description:
        "Join our vibrant community for BBQs, movie nights, and seasonal celebrations",
      icon: Users,
    },
    {
      title: "Pet Paradise",
      description:
        "Dedicated dog park and walking trails for your furry family members",
      icon: PawPrint,
    },
    {
      title: "Family Friendly",
      description:
        "Safe playground, game room, and activities designed for all ages",
      icon: Home,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/pecan-ridge" className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TreePine className="text-white size-7" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    Pecan Ridge
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    RV PARK
                  </div>
                </div>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-slate-700 hover:text-emerald-600 font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#gallery"
                className="text-slate-700 hover:text-emerald-600 font-medium transition-colors"
              >
                Gallery
              </a>
              <a
                href="#testimonials"
                className="text-slate-700 hover:text-emerald-600 font-medium transition-colors"
              >
                Reviews
              </a>
              <a
                href="#contact"
                className="text-slate-700 hover:text-emerald-600 font-medium transition-colors"
              >
                Contact
              </a>
            </div>
            <div className="flex gap-3">
              <Link href="/auth/signin">
                <Button
                  variant="outline"
                  className="border-slate-300 hover:bg-slate-50 hidden sm:inline-flex"
                >
                  Resident Login
                </Button>
              </Link>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all">
                Book Your Stay
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2400&auto=format&fit=crop"
            alt="Stunning RV Park nestled in nature"
            fill
            className="object-cover scale-105 animate-[scale_20s_ease-in-out_infinite]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-emerald-900/50 to-slate-900/70"></div>

          {/* Floating gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-10 pt-20 pb-32">
          <div className="max-w-6xl mx-auto text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl text-white rounded-full text-sm font-bold border border-white/20 shadow-2xl hover:bg-white/15 transition-all">
              <Sparkles className="size-5 text-emerald-300" />
              <span>Alabama&apos;s Premier RV Resort</span>
              <Star className="size-4 fill-amber-300 text-amber-300" />
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white leading-none tracking-tight">
              Your Sanctuary
              <span className="block bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent mt-3 animate-gradient">
                in Dothan, Alabama
              </span>
            </h1>

            <p className="text-xl md:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed font-light">
              Discover the perfect blend of{" "}
              <span className="font-semibold text-emerald-300">
                Southern hospitality
              </span>{" "}
              and{" "}
              <span className="font-semibold text-teal-300">modern luxury</span>
              .
              <span className="block mt-4 text-lg md:text-2xl">
                Your adventure begins on Cottonwood Road, where comfort meets
                community.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-10">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-2xl text-xl px-12 py-8 h-auto font-bold group hover:scale-105 transition-all"
              >
                Claim Your Spot Today
                <ArrowRight className="ml-3 size-6 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 text-xl px-12 py-8 h-auto font-bold hover:scale-105 transition-all"
              >
                <Phone className="mr-3 size-6" />
                (555) 123-4567
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-white/80 pt-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-full border border-white/20">
                <CheckCircle2 className="text-emerald-300 size-5" />
                <span className="font-medium">Move In This Week</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-full border border-white/20">
                <CheckCircle2 className="text-emerald-300 size-5" />
                <span className="font-medium">100+ 5-Star Reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-3 animate-bounce">
            <span className="text-white/60 text-sm font-medium">
              Scroll to explore
            </span>
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-4 group hover:scale-105 transition-transform duration-300"
              >
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 rounded-3xl shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  <stat.icon className={`text-${stat.color}-600 size-10`} />
                </div>
                <div className="text-5xl font-black text-slate-900">
                  {stat.value}
                </div>
                <div className="text-slate-600 font-semibold uppercase text-sm tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <div className="inline-block">
              <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold uppercase tracking-wide">
                World-Class Amenities
              </span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-slate-900">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Premium features designed for your ultimate comfort and
              convenience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white overflow-hidden group"
              >
                <CardHeader className="space-y-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                  >
                    <feature.icon className="text-white size-8" />
                  </div>
                  <CardTitle className="text-2xl text-slate-900 font-bold">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section - Modern Bento Grid */}
      <section
        id="gallery"
        className="py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50"
      >
        <div className="container mx-auto px-6">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-block">
              <span className="px-4 py-2 bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-700 rounded-full text-sm font-bold uppercase tracking-wide border border-teal-200">
                Visual Experience
              </span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-slate-900">
              Life at Pecan Ridge
            </h2>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto font-light">
              Where every day feels like a{" "}
              <span className="text-emerald-600 font-semibold">vacation</span>{" "}
              and every view takes your breath away
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-12 gap-4 lg:gap-6 max-w-7xl mx-auto">
            {/* Large featured image */}
            <div className="col-span-12 lg:col-span-8 row-span-2">
              <div className="group relative overflow-hidden rounded-3xl shadow-2xl h-full min-h-[400px] lg:min-h-[600px]">
                <Image
                  src={gallery[0].url}
                  alt={gallery[0].alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-10">
                  <div className="space-y-3">
                    <h3 className="text-4xl font-black text-white">
                      {gallery[0].title}
                    </h3>
                    <p className="text-xl text-white/80 max-w-2xl">
                      {gallery[0].description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Two medium images */}
            {gallery.slice(1, 3).map((image, index) => (
              <div key={index} className="col-span-12 lg:col-span-4">
                <div className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 h-full min-h-[280px]">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {image.title}
                    </h3>
                    <p className="text-sm text-white/80">{image.description}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Three small images */}
            {gallery.slice(3, 6).map((image, index) => (
              <div
                key={index}
                className="col-span-12 sm:col-span-6 lg:col-span-4"
              >
                <div className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 h-full min-h-[250px]">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {image.title}
                    </h3>
                    <p className="text-sm text-white/80">{image.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              size="lg"
              className="bg-slate-900 hover:bg-slate-800 text-white text-lg px-10 py-7 h-auto font-bold group"
            >
              View Full Gallery
              <ArrowRight className="ml-2 size-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-block">
              <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold uppercase tracking-wide">
                Testimonials
              </span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-slate-900">
              What Our Residents Say
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Don&apos;t just take our word for it - hear from our happy
              community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white"
              >
                <CardContent className="p-8 space-y-6">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="size-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  <Quote className="size-10 text-emerald-200" />

                  <p className="text-slate-700 text-lg leading-relaxed italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={56}
                      height={56}
                      className="rounded-full ring-4 ring-emerald-100"
                    />
                    <div>
                      <div className="font-bold text-slate-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-slate-600">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resident Portal Features Section - SPLIT LAYOUT */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-block">
              <span className="px-4 py-2 bg-emerald-500/20 backdrop-blur-md text-emerald-300 rounded-full text-sm font-bold uppercase tracking-wide border border-emerald-500/30">
                Resident Portal
              </span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black">
              Your Digital Home
              <span className="block bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent mt-2">
                Management At Your Fingertips
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Everything you need to manage your rental, make payments, and
              communicate with management—all in one seamless platform.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {portalFeatures.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10 space-y-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                  >
                    <feature.icon className="text-white size-8" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-emerald-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-400 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    Learn More <ArrowRight className="size-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/auth/signin">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-2xl text-lg px-12 py-8 h-auto font-bold group"
              >
                Access Resident Portal
                <ChevronRight className="ml-2 size-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.05),transparent_50%)]"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-block">
              <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-bold uppercase tracking-wide">
                Simple Process
              </span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-slate-900">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From application to move-in, we make it easy
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, index) => (
                <div key={index} className="relative group">
                  {/* Connector Line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-24 left-[60%] w-full h-0.5 bg-gradient-to-r from-emerald-300 to-teal-300 z-0">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-teal-400 rounded-full animate-pulse"></div>
                    </div>
                  )}

                  <div className="relative z-10 text-center space-y-6">
                    {/* Step Number */}
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <span className="text-white text-3xl font-black">
                        {step.step}
                      </span>
                    </div>

                    {/* Icon Badge */}
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-white border-4 border-emerald-100 rounded-2xl shadow-lg -mt-7">
                      <step.icon className="text-emerald-600 size-7" />
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-slate-900">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-block">
              <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold uppercase tracking-wide">
                Flexible Plans
              </span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-slate-900">
              Choose Your Stay
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From overnight to year-round living, we have a plan for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.highlight
                    ? "border-4 border-emerald-500 shadow-2xl scale-105 bg-gradient-to-b from-white to-emerald-50"
                    : "border-slate-200 hover:border-emerald-300"
                } transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center py-2 text-sm font-bold uppercase tracking-wide">
                    <Sparkles className="inline size-4 mr-2" />
                    Most Popular
                  </div>
                )}

                <CardContent
                  className={`p-8 ${
                    plan.highlight ? "pt-16" : "pt-8"
                  } space-y-8`}
                >
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {plan.name}
                    </h3>
                    <p className="text-slate-600">{plan.description}</p>
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-black text-slate-900">
                        {plan.price}
                      </span>
                      <span className="text-slate-600 mb-2">{plan.period}</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className={`w-full ${
                      plan.highlight
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xl"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    Select Plan
                    <ChevronRight className="ml-2 size-5" />
                  </Button>

                  <div className="space-y-4 pt-6 border-t border-slate-200">
                    {plan.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 text-slate-700"
                      >
                        <Check className="size-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-block">
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold uppercase tracking-wide">
                  FAQ
                </span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-slate-900">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-slate-600">
                Everything you need to know about Pecan Ridge
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Lifestyle Section - Split Screen */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* Left - Content */}
            <div className="space-y-8">
              <div className="inline-block">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-bold uppercase tracking-wide border border-purple-200">
                  Community Life
                </span>
              </div>

              <h2 className="text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
                More Than a Park.
                <span className="block text-emerald-600 mt-2">
                  It&apos;s a Lifestyle.
                </span>
              </h2>

              <p className="text-2xl text-slate-600 leading-relaxed font-light">
                Join a vibrant community where neighbors become lifelong friends
                and every season brings new adventures.
              </p>

              <div className="space-y-6 pt-4">
                {communityFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex gap-5 p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                      <feature.icon className="text-white size-7" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl text-lg px-10 py-7 h-auto font-bold group mt-6"
              >
                Join Our Community
                <ArrowRight className="ml-2 size-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>

            {/* Right - Image Collage */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="relative h-64 rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                      src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=800&auto=format&fit=crop"
                      alt="Community BBQ event"
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="relative h-80 rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                      src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=60&w=400&auto=format&fit=crop"
                      alt="Families enjoying the park"
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div className="space-y-6 mt-12">
                  <div className="relative h-80 rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                      src="https://images.unsplash.com/photo-1668452593870-aa82ee3ee689?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEV2ZW5pbmclMjBnYXRoZXJpbmdzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=400"
                      alt="Evening gatherings"
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="relative h-64 rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                      src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=60&w=400&auto=format&fit=crop"
                      alt="Pet-friendly spaces"
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-3xl shadow-2xl p-6 border-4 border-emerald-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <Users className="text-white size-8" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-900">
                      500+
                    </div>
                    <div className="text-sm text-slate-600 font-medium">
                      Happy Families
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Tour / Video Section */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-block">
                <span className="px-4 py-2 bg-white/10 backdrop-blur-xl text-emerald-300 rounded-full text-sm font-bold uppercase tracking-wide border border-white/20">
                  Virtual Experience
                </span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black">
                Take a Virtual Tour
              </h2>
              <p className="text-2xl text-slate-300 max-w-3xl mx-auto font-light">
                Experience Pecan Ridge from anywhere. See what makes our
                community special.
              </p>
            </div>

            {/* Video Placeholder / Image */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
              <Image
                src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2400&auto=format&fit=crop"
                alt="Virtual tour of Pecan Ridge RV Park"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors"></div>

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-l-[20px] border-l-emerald-600 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-2"></div>
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full text-white font-semibold">
                3:45 min tour
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12">
              <p className="text-slate-300 mb-6 text-lg">
                Can&apos;t visit in person? Schedule a live video walkthrough
                with our team.
              </p>
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 shadow-2xl text-lg px-10 py-7 h-auto font-bold group"
              >
                Schedule Live Tour
                <Calendar className="ml-2 size-6 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Nearby Attractions */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-6 mb-20">
              <div className="inline-block">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold uppercase tracking-wide">
                  Prime Location
                </span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-slate-900">
                Where Convenience
                <span className="block text-emerald-600 mt-2">
                  Meets Adventure
                </span>
              </h2>
              <p className="text-2xl text-slate-600 max-w-3xl mx-auto font-light">
                Perfectly positioned in the Wiregrass Region with easy access to
                everything Southeast Alabama has to offer
              </p>
            </div>

            {/* Nearby Attractions Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[
                {
                  name: "Downtown Dothan",
                  distance: "10 min",
                  type: "Entertainment",
                },
                {
                  name: "Adventureland Theme Park",
                  distance: "15 min",
                  type: "Recreation",
                },
                {
                  name: "Wiregrass Commons Mall",
                  distance: "12 min",
                  type: "Shopping",
                },
                {
                  name: "Ross Clark Circle",
                  distance: "10 min",
                  type: "Retail",
                },
                {
                  name: "Southeast Health Medical Center",
                  distance: "12 min",
                  type: "Healthcare",
                },
                { name: "Landmark Park", distance: "8 min", type: "Nature" },
              ].map((location, index) => (
                <div
                  key={index}
                  className="group p-8 bg-gradient-to-br from-slate-50 to-white rounded-3xl border-2 border-slate-200 hover:border-emerald-400 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {location.name}
                      </h3>
                      <p className="text-emerald-600 font-semibold text-lg">
                        {location.distance} drive
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase">
                      {location.type}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 group-hover:text-emerald-600 transition-colors">
                    <MapPin className="size-5" />
                    <span className="font-medium">Get Directions</span>
                    <ArrowRight className="size-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2400&auto=format&fit=crop"
                alt="Map showing Pecan Ridge location"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-3xl font-black text-white mb-2">
                      8676 Cottonwood Road, Dothan, AL 36301
                    </h3>
                    <p className="text-white/80 text-lg">
                      Easy access from US-431 and Ross Clark Circle
                    </p>
                  </div>
                  <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold">
                    Open in Maps
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Grid Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <div className="inline-block">
                <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold uppercase tracking-wide">
                  Full Service
                </span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-slate-900">
                Complete Amenities
              </h2>
              <p className="text-xl text-slate-600">
                Everything included for your perfect stay
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-6 bg-white rounded-2xl border-2 border-slate-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <amenity.icon className="text-emerald-600 size-6" />
                  </div>
                  <span className="text-slate-800 font-semibold">
                    {amenity.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Ultra Modern */}
      <section id="contact" className="relative py-40 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2400&auto=format&fit=crop"
            alt="Stunning sunset at Pecan Ridge RV Park"
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/95 via-teal-900/90 to-slate-900/95"></div>

          {/* Animated gradient orbs */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl text-white rounded-full text-sm font-bold border border-white/20 shadow-2xl">
                <Sparkles className="size-5 text-emerald-300 animate-pulse" />
                <span className="uppercase tracking-wide">
                  Only 3 Premium Spots Left
                </span>
              </div>

              <h2 className="text-5xl md:text-6xl lg:text-8xl font-black text-white leading-none">
                Your New Home
                <span className="block bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent mt-4">
                  Starts Here
                </span>
              </h2>

              <p className="text-2xl md:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed font-light">
                Don&apos;t just visit paradise.{" "}
                <span className="font-bold text-emerald-300">Live in it.</span>
                <span className="block mt-4 text-xl md:text-2xl">
                  Join 500+ families who&apos;ve already made Pecan Ridge their
                  forever home.
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-6">
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-emerald-50 shadow-2xl text-xl px-14 py-9 h-auto font-black group hover:scale-105 transition-all"
              >
                Secure Your Spot Now
                <ArrowRight className="ml-3 size-7 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/40 bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 text-xl px-14 py-9 h-auto font-black hover:scale-105 transition-all"
              >
                <Calendar className="mr-3 size-7" />
                Book a Visit
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-12">
              <div className="flex items-center gap-3 text-white/90">
                <CheckCircle2 className="text-emerald-300 size-7 flex-shrink-0" />
                <span className="font-semibold text-lg">
                  Move In This Month
                </span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <CheckCircle2 className="text-emerald-300 size-7 flex-shrink-0" />
                <span className="font-semibold text-lg">
                  Flexible Lease Terms
                </span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <CheckCircle2 className="text-emerald-300 size-7 flex-shrink-0" />
                <span className="font-semibold text-lg">No Hidden Fees</span>
              </div>
            </div>

            {/* Contact Cards - Modern Glass Design */}
            <div className="pt-16 grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <a href="tel:5551234567" className="block group">
                <div className="p-8 bg-white/10 backdrop-blur-2xl rounded-3xl border-2 border-white/20 hover:border-emerald-300 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                      <Phone className="text-white size-8" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-sm text-white/70 font-semibold uppercase tracking-wide mb-1">
                        Call Now
                      </div>
                      <div className="font-black text-2xl text-white group-hover:text-emerald-300 transition-colors">
                        (555) 123-4567
                      </div>
                    </div>
                    <ArrowRight className="text-white/60 group-hover:text-emerald-300 size-6 group-hover:translate-x-2 transition-all" />
                  </div>
                </div>
              </a>

              <a href="mailto:info@pecanridge.com" className="block group">
                <div className="p-8 bg-white/10 backdrop-blur-2xl rounded-3xl border-2 border-white/20 hover:border-teal-300 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                      <Mail className="text-white size-8" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-sm text-white/70 font-semibold uppercase tracking-wide mb-1">
                        Email Us
                      </div>
                      <div className="font-black text-2xl text-white group-hover:text-teal-300 transition-colors">
                        info@pecanridge.com
                      </div>
                    </div>
                    <ArrowRight className="text-white/60 group-hover:text-teal-300 size-6 group-hover:translate-x-2 transition-all" />
                  </div>
                </div>
              </a>
            </div>

            {/* Emergency Notice */}
            <div className="pt-8">
              <p className="text-white/70 text-lg">
                <span className="font-semibold text-white">🔥 Hot Deal:</span>{" "}
                Book in the next 48 hours and receive{" "}
                <span className="text-emerald-300 font-bold">
                  first month 50% off
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6 lg:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <TreePine className="text-white size-8" />
                </div>
                <div>
                  <div className="text-2xl font-bold">Pecan Ridge</div>
                  <div className="text-xs text-slate-400 font-medium">
                    RV PARK
                  </div>
                </div>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed max-w-md">
                Your premier destination for luxury RV living in the heart of
                Alabama&apos;s Wiregrass Region. Where Southern hospitality
                meets modern comfort.
              </p>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="w-12 h-12 bg-slate-800 hover:bg-emerald-600 rounded-xl flex items-center justify-center transition-colors"
                >
                  <svg
                    className="size-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="w-12 h-12 bg-slate-800 hover:bg-emerald-600 rounded-xl flex items-center justify-center transition-colors"
                >
                  <svg
                    className="size-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/auth/signin"
                    className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform"></span>
                    Resident Portal
                  </Link>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform"></span>
                    Features & Amenities
                  </a>
                </li>
                <li>
                  <a
                    href="#gallery"
                    className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform"></span>
                    Photo Gallery
                  </a>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform"></span>
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold">Contact Us</h3>
              <div className="space-y-4 text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">8676 Cottonwood Road</p>
                    <p>Dothan, AL 36301</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="size-5 text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Office Hours</p>
                    <p>Mon-Fri: 9AM - 6PM</p>
                    <p>Sat-Sun: 10AM - 4PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-sm">
                &copy; 2025 Pecan Ridge RV Park. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <Link
                  href="#"
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/privacy-policy"
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
