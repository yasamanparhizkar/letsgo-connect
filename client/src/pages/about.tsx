import Navigation from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Lightbulb,
  TrendingUp,
  Heart,
  Zap,
  Target,
  Globe,
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-deep-black text-elegant-white">
      <Navigation />

      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 hero-gradient">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h1 className="text-5xl lg:text-7xl font-bold font-playfair mb-6">
              About <span className="text-gradient">Let's Go</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We're building a community for Canadian builders to connect,
              collaborate, and create impact together.
            </p>
          </div>
        </section>

        {/* Core Values - Inspired by SHACK15 */}
        <section className="py-20 bg-charcoal">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold font-playfair mb-6">
                Our <span className="text-gradient">Values</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Whether you're building your first app or scaling your tenth
                startup, this club is your launchpad. We champion speed and
                impact, embracing the latest technologies to bring bold ideas to
                life, fast. Together, we help each other — and all Canadians —
                discover and connect with the talent around them, creating a
                thriving network where collaboration sparks invention and
                support fuels success.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="bg-dark-gray border-gray-600 hover:bg-opacity-80 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-accent-blue bg-opacity-20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                    <Heart className="text-accent-blue" size={32} />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-300">
                    Service
                  </h3>
                  <p className="text-gray-300">
                    We believe in creating something of service to the world.
                    Every founder in our community is driven by the desire to
                    make a meaningful impact and solve real problems.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-dark-gray border-gray-600 hover:bg-opacity-80 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-success-green bg-opacity-20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                    <Users className="text-success-green" size={32} />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-300">
                    Community
                  </h3>
                  <p className="text-gray-300">
                    We foster a diverse, inclusive community where builders from
                    all backgrounds can find support, mentorship, and meaningful
                    connections.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-dark-gray border-gray-600 hover:bg-opacity-80 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-500 bg-opacity-20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                    <Zap className="text-purple-400" size={32} />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-300">
                    Innovation
                  </h3>
                  <p className="text-gray-300">
                    We celebrate breakthrough thinking and bold ideas. Our
                    community is built for those who dare to innovate and
                    challenge the status quo.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Three Pillars - Social, Culture, Network */}
        <section className="py-20 bg-deep-black">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold font-playfair mb-6">
                <span className="text-gradient">Social. Culture. Network.</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We're a social club dedicated to serving the next generation of
                entrepreneurs, innovators and changemakers. At Let's Go, we aim
                to be the landing pad for individuals coming from around the
                world to access the Canadian startup ecosystem and all that it
                has to offer.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="relative mb-8">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                    alt="Social networking"
                    className="rounded-2xl shadow-lg w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl flex items-center justify-center">
                    <h3 className="text-4xl font-bold text-white">SOCIAL</h3>
                  </div>
                </div>
                <p className="text-gray-300">
                  Connect with fellow founders through curated events, casual
                  meetups, and meaningful conversations that spark
                  collaboration.
                </p>
              </div>

              <div className="text-center">
                <div className="relative mb-8">
                  <img
                    src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                    alt="Culture and learning"
                    className="rounded-2xl shadow-lg w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl flex items-center justify-center">
                    <h3 className="text-4xl font-bold text-white">CULTURE</h3>
                  </div>
                </div>
                <p className="text-gray-300">
                  Immerse yourself in a culture of innovation with workshops,
                  talks, and programming designed to accelerate your growth.
                </p>
              </div>

              <div className="text-center">
                <div className="relative mb-8">
                  <img
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                    alt="Global network"
                    className="rounded-2xl shadow-lg w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl flex items-center justify-center">
                    <h3 className="text-4xl font-bold text-white">NETWORK</h3>
                  </div>
                </div>
                <p className="text-gray-300">
                  Access a global network of entrepreneurs, investors, mentors,
                  and industry experts ready to support your journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/*
        <section className="py-20 bg-charcoal">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="bg-gradient-to-r from-accent-blue to-success-green p-1 rounded-2xl">
              <div className="bg-dark-gray p-12 rounded-2xl">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-4xl font-bold font-playfair mb-6">
                      Our Mission
                    </h3>
                    <p className="text-gray-300 text-lg mb-8">
                      Let's Go exists to expand entrepreneurship by creating an
                      inclusive community where builders can access the
                      resources, connections, and support they need to build
                      world-changing companies.
                    </p>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-success-green bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Target className="text-success-green" size={20} />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold mb-2">
                            Inclusive Community
                          </h4>
                          <p className="text-gray-300">
                            Building a diverse, welcoming space for
                            entrepreneurs from all backgrounds and industries.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-accent-blue bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Lightbulb className="text-accent-blue" size={20} />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold mb-2">
                            Knowledge Sharing
                          </h4>
                          <p className="text-gray-300">
                            Facilitating the exchange of ideas, experiences, and
                            best practices among founders.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Globe className="text-purple-400" size={20} />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold mb-2">
                            Global Impact
                          </h4>
                          <p className="text-gray-300">
                            Supporting startups that create positive change and
                            solve meaningful problems worldwide.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                      alt="Entrepreneurs presenting to investors"
                      className="rounded-xl shadow-lg w-full"
                    />
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent-blue rounded-full opacity-20 animate-float"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Call to Action */}
        <section className="py-20 bg-deep-black">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold font-playfair mb-6">
              Ready to <span className="text-gradient">Join Us?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Become part of a community that's shaping the future of
              entrepreneurship. Your journey starts here.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-gradient">Global</div>
                <div className="text-gray-400">Community</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient">24/7</div>
                <div className="text-gray-400">Support</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient">Expert</div>
                <div className="text-gray-400">Mentorship</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient">Proven</div>
                <div className="text-gray-400">Results</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
