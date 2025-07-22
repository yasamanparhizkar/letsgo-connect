import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Lightbulb, TrendingUp, Rocket } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-deep-black text-elegant-white font-inter">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-gradient">Let's Go</div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-elegant-white"
                onClick={handleLogin}
              >
                Sign In
              </Button>
              <Button
                onClick={handleLogin}
                className="px-6 py-2 bg-accent-blue text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
              >
                Join Club
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen hero-gradient flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-5xl lg:text-7xl font-bold font-playfair mb-6">
                Where Builders
                <span className="text-gradient block">Connect & Grow</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Join a community of innovators and changemakers. Find your
                tribe, share ideas, and let's build the future together!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleLogin}
                  size="lg"
                  className="px-8 py-4 bg-accent-blue text-white rounded-xl hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 font-medium"
                >
                  <Rocket className="mr-2" size={20} />
                  Start Your Journey
                </Button>
              </div>
            </div>

            <div className="relative animate-fade-in">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Diverse entrepreneurs networking in modern workspace"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent-blue rounded-full opacity-20 animate-float"></div>
              <div
                className="absolute -top-6 -right-6 w-20 h-20 bg-success-green rounded-full opacity-30 animate-float"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-charcoal">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-playfair mb-6">
              About <span className="text-gradient">Let's Go</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're building a community for Canadian builders to connect,
              collaborate, and create impact together.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-dark-gray p-8 rounded-2xl hover:bg-opacity-80 transition-all duration-300 group">
              <div className="w-16 h-16 bg-accent-blue bg-opacity-20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Users className="text-2xl text-accent-blue" size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Network</h3>
              <p className="text-gray-300">
                Connect with like-minded builders, students, and professionals.
                Find your team, mentors, and investors.
              </p>
            </div>

            <div className="bg-dark-gray p-8 rounded-2xl hover:bg-opacity-80 transition-all duration-300 group">
              <div className="w-16 h-16 bg-success-green bg-opacity-20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Lightbulb className="text-2xl text-success-green" size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Innovate</h3>
              <p className="text-gray-300">
                Share breakthrough ideas, get feedback, and collaborate on
                projects that change the world.
              </p>
            </div>

            <div className="bg-dark-gray p-8 rounded-2xl hover:bg-opacity-80 transition-all duration-300 group">
              <div className="w-16 h-16 bg-purple-500 bg-opacity-20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <TrendingUp className="text-2xl text-purple-400" size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Grow</h3>
              <p className="text-gray-300">
                Access resources, mentorship, and opportunities to grow your
                career and business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-deep-black">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold font-playfair mb-6">
            Ready to <span className="text-gradient">Go?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of founders who are building the future. Your next
            breakthrough is just one connection away.
          </p>

          <Button
            onClick={handleLogin}
            size="lg"
            className="px-8 py-4 bg-accent-blue text-white rounded-xl hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 font-medium text-lg"
          >
            <Rocket className="mr-2" size={20} />
            Join the Club
          </Button>

          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mt-12">
            <div>
              <div className="text-3xl font-bold text-gradient">5,000+</div>
              <div className="text-gray-400">Active Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">$2.5B+</div>
              <div className="text-gray-400">Funds Raised</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">150+</div>
              <div className="text-gray-400">Success Stories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">50+</div>
              <div className="text-gray-400">Cities Worldwide</div>
            </div> */}
          {/* </div> */}
        </div>
      </section>
    </div>
  );
}
