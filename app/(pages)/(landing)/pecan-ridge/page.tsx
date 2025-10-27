import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Bell,
  Car,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Droplets,
  FileText,
  Home,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  TreePine,
  Wifi,
  Wrench,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ApplicationModal from "./Components/ApplicationModal";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";

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
        "30/50 AMP electric, water, and sewer connections at every site",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Droplets,
      title: "Showers Facilities",
      description:
        "Clean, modern shower facilities available 24/7 for all residents",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: TreePine,
      title: "Natural Setting",
      description:
        "Beautiful landscaping with mature pecan trees providing natural shade",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Car,
      title: "Easy Access",
      description:
        "Convenient pull-through sites with paved roads and ample parking",
      color: "from-slate-500 to-gray-500",
    },
    {
      icon: Shield,
      title: "Security & Safety",
      description:
        "All tenants pass background checks with 24/7 security monitoring for safety",
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

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
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
          <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-10 sm:pt-20 pb-24 sm:pb-32">
          <div className="max-w-6xl mx-auto text-center space-y-6 sm:space-y-8 md:space-y-10">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-xl text-white rounded-full text-xs sm:text-sm font-bold border border-white/20 shadow-2xl hover:bg-white/15 transition-all">
              <Home className="size-4 sm:size-5 text-emerald-300" />
              <span className="whitespace-nowrap">
                Affordable RV Living in Dothan, Alabama
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-none tracking-tight px-4 sm:px-0">
              Your Home at
              <span className="block bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent mt-2 sm:mt-3 animate-gradient">
                Pecan Ridge RV Park
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed font-light px-4 sm:px-0">
              Affordable long-term RV and tiny home living in a quiet country
              setting. Safe, clean, and peaceful.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-stretch sm:items-center pt-6 sm:pt-10 px-4 sm:px-0">
              <ApplicationModal variant="default" />
              <a
                href="tel:3342007299"
                tabIndex={0}
                className="inline-block focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400 rounded-xl w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-white/30 bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 text-base sm:text-lg md:text-xl px-8 sm:px-12 py-6 sm:py-8 h-auto font-bold hover:scale-105 transition-all rounded-2xl"
                >
                  <Phone className="mr-2 sm:mr-3 size-5 sm:size-6" />
                  (334) 200-7299
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 hidden sm:block">
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

      {/* About Pecan Ridge Section */}
      <section className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
            {/* Left - Content */}
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-block">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wide border border-emerald-200">
                  About Us
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
                Welcome to
                <span className="block text-emerald-600 mt-2">
                  Pecan Ridge RV Park
                </span>
              </h2>

              <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-slate-600 leading-relaxed">
                <p>
                  Located in a quiet country setting South of Dothan, Alabama,
                  Pecan Ridge RV Park provides{" "}
                  <span className="font-bold text-slate-900">
                    affordable long-term housing
                  </span>{" "}
                  for individuals and families seeking a safe, peaceful
                  community. We&apos;re a family-owned and operated park that
                  puts cleanliness and safety first.
                </p>
                <p>
                  <span className="font-bold text-emerald-600">
                    What makes a community is the people that live there.
                  </span>{" "}
                  All tenants must pass a background check before approval. This
                  screening process provides peace of mind for everyone and
                  ensures a safe, quiet environment where you can live life
                  relaxed.
                </p>
                <p>
                  Whether you&apos;re a traveling professional, seasonal worker,
                  or looking for an affordable housing alternative in Dothan,
                  Pecan Ridge offers spacious RV lots with full hookups at an
                  honest price.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-6">
                <div className="text-center p-4 sm:p-6 bg-white rounded-2xl border-2 border-emerald-100 shadow-lg">
                  <div className="text-3xl sm:text-4xl font-black text-emerald-600 mb-2">
                    ✓
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-600 uppercase">
                    Background Checks
                  </div>
                </div>
                <div className="text-center p-4 sm:p-6 bg-white rounded-2xl border-2 border-emerald-100 shadow-lg">
                  <div className="text-3xl sm:text-4xl font-black text-emerald-600 mb-2">
                    100%
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-600 uppercase">
                    Family Owned
                  </div>
                </div>
                <div className="text-center p-4 sm:p-6 bg-white rounded-2xl border-2 border-emerald-100 shadow-lg">
                  <div className="text-3xl sm:text-4xl font-black text-emerald-600 mb-2">
                    Clean
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-600 uppercase">
                    & Well-Maintained
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Image */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=1200&auto=format&fit=crop"
                  alt="Beautiful Pecan Ridge RV Park entrance"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 sm:-bottom-8 left-4 sm:-left-8 bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 border-2 sm:border-4 border-emerald-100 max-w-[calc(100%-2rem)] sm:max-w-none">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Shield className="text-white size-6 sm:size-8" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-slate-600 font-semibold uppercase">
                      Safe &
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900">
                      Screened
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* At a Glance - Key Info Section */}
      {/* <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
                A Community Feel
              </h2>
              <p className="text-xl text-white/90">
                Long-term tenants go through a quick and easy screening process
                for everyone&apos;s peace of mind
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <PawPrint className="text-white size-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Pet Friendly
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Up to 2 pets welcome. No size restrictions. No additional pet
                  fees.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <CreditCard className="text-white size-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  What&apos;s Included
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Electric, water, sewer, WiFi, cable TV, trash service, and all
                  amenities.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="text-white size-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Background Check
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  All tenants pass a background check. This keeps everybody safe
                  and provides peace of mind.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="text-white size-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Minimum Stay
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  1 month minimum for monthly plans. Flexible move-in dates
                  available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900">
              Community Amenities
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              Everything you need for comfortable long-term living
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white overflow-hidden group"
              >
                <CardHeader className="space-y-3 sm:space-y-4">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                  >
                    <feature.icon className="text-white size-7 sm:size-8" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl text-slate-900 font-bold">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resident Portal Features Section - SPLIT LAYOUT */}
      <section className="py-16 sm:py-24 md:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-teal-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16 md:mb-20">
            <div className="inline-block">
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/20 backdrop-blur-md text-emerald-300 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wide border border-emerald-500/30">
                Resident Portal
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black px-4 sm:px-0">
              Your Digital Home
              <span className="block bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent mt-2">
                Management At Your Fingertips
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              Everything you need to manage your rental, make payments, and
              communicate with management—all in one seamless platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {portalFeatures.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10 space-y-4 sm:space-y-6">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                  >
                    <feature.icon className="text-white size-7 sm:size-8" />
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 group-hover:text-emerald-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-16 px-4 sm:px-0">
            <Link href="/auth/signin" className="inline-block w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-gradient-to-r w-full sm:w-auto sm:min-w-[300px] from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-2xl text-base sm:text-lg py-6 sm:py-8 h-auto font-bold group transition-transform duration-300 hover:scale-105 rounded-2xl"
              >
                Access Resident Portal
                <ChevronRight className="ml-2 size-5 sm:size-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Location & Nearby Attractions */}
      <section className="py-16 sm:py-24 md:py-32 bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-emerald-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-blue-200/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced Header */}
          <div className="text-center space-y-6 sm:space-y-8 mb-16 sm:mb-20 md:mb-24">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 backdrop-blur-sm rounded-full border border-emerald-200">
              <MapPin className="size-4 sm:size-5 text-emerald-600 animate-pulse" />
              <span className="text-xs sm:text-base font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent uppercase tracking-wide">
                Prime Location
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 leading-tight px-4 sm:px-0">
              Where{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Convenience
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-emerald-200 blur-2xl opacity-30 -z-10" />
              </span>
              <span className="block mt-2 sm:mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Meets Adventure
              </span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-slate-600 max-w-4xl mx-auto font-light leading-relaxed px-4 sm:px-0">
              Perfectly positioned in the{" "}
              <span className="font-semibold text-emerald-700">
                Wiregrass Region
              </span>{" "}
              with easy access to everything Southeast Alabama has to offer
            </p>
          </div>

          {/* Enhanced Nearby Attractions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 sm:mb-20">
            {[
              {
                name: "Dollar General",
                distance: "1.3 miles",
                type: "Shopping",
                icon: "🛍️",
              },
              {
                name: "Publix Super Market",
                distance: "7.4 miles",
                type: "Grocery",
                icon: "🛒",
              },
              {
                name: "Walmart Supercenter",
                distance: "9.0 miles",
                type: "Shopping",
                icon: "🏪",
              },
              {
                name: "Southeast Health Medical Center",
                distance: "9.0 miles",
                type: "Healthcare",
                icon: "🏥",
              },
              {
                name: "Downtown Dothan",
                distance: "9.5 miles",
                type: "Entertainment",
                icon: "🎭",
              },
              {
                name: "Ross Clark Circle",
                distance: "7.0 miles",
                type: "Retail",
                icon: "🏬",
              },
            ].map((location, index) => (
              <div
                key={index}
                className="group relative p-6 sm:p-8 bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-200 hover:border-emerald-400 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
              >
                {/* Background Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon Badge */}
                <div className="relative mb-4 sm:mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl sm:rounded-2xl shadow-md group-hover:shadow-lg group-hover:scale-110 group-hover:rotate-6 group-hover:from-emerald-100 group-hover:to-teal-100 transition-all duration-500">
                    <span className="text-2xl sm:text-3xl">
                      {location.icon}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="relative space-y-3 sm:space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-emerald-700 transition-colors">
                        {location.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="size-4 sm:size-5 text-emerald-600 flex-shrink-0" />
                        <p className="text-base sm:text-lg font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                          {location.distance}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="flex items-center justify-between">
                    <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-100 group-hover:bg-emerald-50 rounded-full transition-colors duration-300">
                      <span className="text-xs sm:text-sm font-bold text-slate-700 group-hover:text-emerald-700 uppercase tracking-wide transition-colors">
                        {location.type}
                      </span>
                    </div>

                    {/* Directions Arrow */}
                    <div className="flex items-center gap-2 text-slate-400 group-hover:text-emerald-600 transition-colors">
                      <ArrowRight className="size-4 sm:size-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </div>

                {/* Corner Decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>

          {/* Additional Info Banner */}
          <div className="mt-12 sm:mt-16">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-1">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-3 sm:mb-4">
                      Everything Within Reach
                    </h3>
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                      From shopping and dining to healthcare and entertainment,
                      you're never far from what you need. Experience the
                      perfect balance of peaceful living and convenient access
                      to city amenities.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl sm:rounded-2xl border-2 border-emerald-200">
                      <div className="text-center">
                        <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                          &lt;15min
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                          Average Drive
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Park Map Section */}
          <section className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(16,185,129,0.05),transparent_50%)]"></div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <div className="max-w-7xl mx-auto">
                <div className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16">
                  <div className="inline-block">
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wide border border-blue-200">
                      Park Layout
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 px-4 sm:px-0">
                    Choose Your
                    <span className="block text-emerald-600 mt-2">
                      Perfect Spot
                    </span>
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto font-light px-4 sm:px-0">
                    Explore our park layout and find the ideal location for your
                    new home
                  </p>
                </div>

                {/* Park Map Display */}
                <div className="max-w-6xl mx-auto">
                  <div className="relative">
                    {/* Map Container with Professional Aspect Ratio */}

                    {/* Aspect ratio wrapper - 4:3 for better viewing */}
                    <div
                      className="relative w-full"
                      style={{ paddingBottom: "75%" }}
                    >
                      <div className="absolute inset-0 p-3 sm:p-4 md:p-6">
                        <div className="relative w-full h-full rounded-xl overflow-hidden">
                          <Image
                            src="/PecanRidge/ParkMap.jpg"
                            alt="Pecan Ridge RV Park Map showing all lots and amenities"
                            fill
                            className="object-contain p-2 sm:p-3 md:p-4"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                            priority
                          />
                        </div>
                      </div>
                    </div>

                    {/* Call to Action */}
                    <div className="text-center mt-8 sm:mt-10 md:mt-12">
                      <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-4 sm:mb-6 px-4 max-w-2xl mx-auto">
                        Interested in a specific lot? Contact us to check
                        availability and schedule a tour of the park
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
                        <a href="tel:3342007299" className="w-full sm:w-auto">
                          <Button
                            size="lg"
                            className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xl text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-8 h-auto font-bold rounded-2xl hover:scale-105 transition-transform"
                          >
                            <Phone className="mr-2 size-4 sm:size-5" />
                            Call (334) 200-7299
                          </Button>
                        </a>
                        <ApplicationModal variant="default" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Google Maps Embed */}
          <div className="space-y-4 sm:space-y-6">
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.7866555778544!2d-85.39844612397174!3d31.508988374232747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x889067f7e5a5b7f5%3A0x5a1e9c4e3e4e4e4e!2s8676%20Cottonwood%20Rd%2C%20Dothan%2C%20AL%2036301!5e0!3m2!1sen!2sus!4v1730000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Pecan Ridge RV Park Location Map"
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Address and CTA */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="w-full md:w-auto">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <MapPin className="size-6 sm:size-8 text-white flex-shrink-0" />
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black">
                      Visit Us Today
                    </h3>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
                    8676 Cottonwood Road, Dothan, AL 36301
                  </p>
                  <p className="text-white/90 text-sm sm:text-base md:text-lg">
                    Easy access from US-431 and Ross Clark Circle
                  </p>
                </div>
                <a
                  href="https://www.google.com/maps/dir//8676+Cottonwood+Road+Dothan+AL+36301"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full md:w-auto"
                >
                  <Button
                    size="lg"
                    className="w-full md:w-auto bg-white text-emerald-600 hover:bg-slate-50 font-bold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto shadow-xl transition-transform duration-200 ease-in-out group-hover:scale-105 group-hover:-translate-y-1 rounded-2xl"
                  >
                    <MapPin className="mr-2 size-4 sm:size-5 transition-transform duration-200 group-hover:scale-110 group-hover:text-emerald-700" />
                    Get Directions
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
