"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
          <Sparkles className="h-4 w-4" />
          <span>AI-Powered Legal Intelligence</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
          Your Intelligent
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Legal Assistant
          </span>
        </h1>

        <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Watson combines cutting-edge AI technology with legal expertise to
          provide instant, accurate answers to your legal questions. Available
          24/7 to support the success of your lawfirm.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { label: "Cases Analyzed", value: "10K+" },
            { label: "Active Users", value: "500+" },
            { label: "Response Time", value: "<2s" },
            { label: "Accuracy Rate", value: "99.8%" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stat.value}
              </div>
              <div className="text-sm text-slate-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
