"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Scale,
  MessageSquare,
  Shield,
  Zap,
  FileText,
  Users,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Intelligent Conversations",
    description:
      "Natural language processing understands complex legal queries and provides contextual responses.",
  },
  {
    icon: FileText,
    title: "Document Analysis",
    description:
      "Upload and analyze legal documents with AI-powered insights and key point extraction.",
  },
  {
    icon: Shield,
    title: "Secure & Confidential",
    description:
      "Enterprise-grade encryption ensures your sensitive legal data remains protected.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Get instant answers to legal questions without waiting for manual research.",
  },
  {
    icon: Scale,
    title: "Multi-Jurisdiction",
    description:
      "Access legal information across multiple jurisdictions and practice areas.",
  },
  {
    icon: Users,
    title: "Collaborative",
    description:
      "Share insights and collaborate with your team seamlessly within the platform.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Powerful Features for Modern Law Firms
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to streamline legal research and client
            communication
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-slate-200 hover:border-blue-300 transition-all hover:shadow-lg group"
            >
              <CardContent className="pt-6">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <feature.icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
