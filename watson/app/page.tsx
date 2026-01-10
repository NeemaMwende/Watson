import Link from "next/link";
import {
  ArrowRight,
  Scale,
  BookOpen,
  Zap,
  Shield,
  Search,
  Brain,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Watson</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-white/80 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 text-white/90 text-sm mb-8">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>Powered by Advanced AI & LangGraph</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Your AI-Powered
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
            Legal Assistant
          </span>
        </h1>

        <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
          Revolutionary legal research powered by cutting-edge AI. Get instant
          answers to complex legal questions with cited sources and case
          precedents.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="group bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center gap-2"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all"
          >
            View Demo
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">10K+</div>
            <div className="text-white/60">Legal Documents</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">99%</div>
            <div className="text-white/60">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">&lt;2s</div>
            <div className="text-white/60">Response Time</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Powerful Features for Modern Legal Practice
          </h2>
          <p className="text-white/70 text-lg">
            Everything you need to streamline your legal research
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Brain className="w-8 h-8" />}
            title="AI-Powered Analysis"
            description="Advanced LangGraph agents analyze your queries and provide comprehensive legal insights with source citations."
            gradient="from-purple-500 to-pink-500"
          />
          <FeatureCard
            icon={<Search className="w-8 h-8" />}
            title="Smart Document Search"
            description="RAG technology searches through thousands of legal documents instantly to find the most relevant cases and precedents."
            gradient="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            icon={<BookOpen className="w-8 h-8" />}
            title="Case Law Database"
            description="Access comprehensive Indian case law with automatic relevance scoring and intelligent web search fallback."
            gradient="from-pink-500 to-orange-500"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Secure & Private"
            description="Your data is encrypted and secure. We prioritize confidentiality for all your legal research."
            gradient="from-green-500 to-emerald-500"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Lightning Fast"
            description="Get answers in seconds, not hours. Our optimized pipeline delivers results at incredible speed."
            gradient="from-yellow-500 to-orange-500"
          />
          <FeatureCard
            icon={<Scale className="w-8 h-8" />}
            title="Always Accurate"
            description="Multi-agent verification ensures every answer is factual, relevant, and backed by authoritative sources."
            gradient="from-indigo-500 to-purple-500"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Legal Research?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Join hundreds of legal professionals using Watson to work smarter,
            not harder.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-purple-900 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-white/20 transition-all"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-lg mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-white/60">
          <p>© 2026 Watson Legal Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all hover:shadow-xl hover:shadow-purple-500/10">
      <div
        className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-white`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-white/60 leading-relaxed">{description}</p>
    </div>
  );
}
