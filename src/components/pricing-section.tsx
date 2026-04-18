"use client"

import { motion } from "framer-motion";
import { Check, Mail, Sparkles, Zap, Shield, Globe } from "lucide-react";

const TEACHER_TIERS = [
  {
    name: "Basic",
    price: "₹0",
    period: "/year",
    description: "Ideal for individual educators starting their online journey.",
    fee: "10% transaction fee",
    highlight: "bg-white border-editorial-black/10",
    features: [
      "Unlimited Course Hosting",
      "Standard Video Player",
      "Student Management Hub",
      "Basic Analytics",
      "Community Support"
    ],
    cta: "Start for free",
    icon: Globe
  },
  {
    name: "Plus",
    price: "₹20,000",
    period: "/year",
    description: "Leverage AI to streamline your curriculum and engagement.",
    fee: "+ Monthly AI Usage Costs",
    highlight: "bg-[#CD7F32]/5 border-[#CD7F32]/20",
    features: [
      "AI Lesson Schematics",
      "Automated Quiz Generation",
      "Student Insight AI",
      "Premium Video Dashboard",
      "Priority Email Support"
    ],
    cta: "Go Plus",
    icon: Sparkles,
    accent: "text-[#CD7F32]"
  },
  {
    name: "Pro",
    price: "₹30,000",
    period: "/year",
    description: "Scale your reach with advanced marketing automation.",
    fee: "+ Monthly Marketing Costs",
    highlight: "bg-[#94a3b8]/5 border-[#94a3b8]/20",
    features: [
      "SEO Funnel Builder",
      "Social Media Auto-Pilot",
      "Newsletter Campaign Suite",
      "Custom Branding Tools",
      "Growth Analytics Pro"
    ],
    cta: "Go Pro",
    icon: Zap,
    accent: "text-[#64748b]"
  },
  {
    name: "Pro Plus",
    price: "₹50,000",
    period: "/year",
    description: "The ultimate engine for elite mentors and academies.",
    fee: "+ AI & Marketing Usage",
    highlight: "bg-[#F59E0B]/5 border-[#F59E0B]/30",
    features: [
      "Everything in Plus & Pro",
      "High-Conversion Landing Pages",
      "Dedicated Account Support",
      "Custom API Access",
      "White-Glove Migration"
    ],
    cta: "Maximum Growth",
    icon: Shield,
    accent: "text-[#D97706]",
    popular: true
  }
];

const STUDENT_TIERS = [
  {
    name: "Free Tier",
    price: "₹0",
    description: "Standard access for all enrolled students.",
    features: ["Access to Paid Content", "Standard Video Quality", "Discussion Forums"]
  },
  {
    name: "AI Companion",
    price: "₹3,000",
    period: "one-time",
    description: "Supercharge your learning with personal AI mentorship.",
    usage: "+ Monthly AI Costs",
    features: ["Smart Study Notes", "AI Practice Sessions", "Real-time Query Resolution", "Automated Flashcards"]
  }
];

export function PricingSection() {
  return (
    <section id="pricing" className="pt-12 pb-32 px-8 sm:px-12 lg:px-24 bg-editorial-cream">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-editorial-black/40">Investment Options</p>
          <h2 className="text-5xl md:text-7xl font-serif text-editorial-black leading-tight italic">
            Empowering Mentors, <br />
            <span className="text-[#C5A059]">Elevating Students.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEACHER_TIERS.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative p-8 rounded-[2.5rem] border ${tier.highlight} flex flex-col h-full shadow-sm hover:shadow-xl transition-all duration-500`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-editorial-black text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
                  Most Advanced
                </div>
              )}

              <div className="mb-8">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-6 ${tier.accent || "text-editorial-black"} bg-white shadow-sm border border-editorial-black/5`}>
                  <tier.icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-serif text-editorial-black mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-editorial-black">{tier.price}</span>
                  <span className="text-sm text-editorial-black/40 font-medium">{tier.period}</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-4">{tier.fee}</p>
                <p className="text-sm text-editorial-black/60 leading-relaxed italic line-clamp-2">"{tier.description}"</p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start space-x-3">
                    <div className="h-5 w-5 rounded-full bg-editorial-black/5 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-editorial-black/60" />
                    </div>
                    <span className="text-xs text-editorial-black/70 font-medium leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 ${
                tier.popular 
                ? "bg-editorial-black text-white shadow-2xl" 
                : "bg-editorial-black/5 text-editorial-black hover:bg-editorial-black/10"
              }`}>
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Student Pricing & Business Tier */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 p-12 rounded-[3.5rem] bg-editorial-black text-white relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="inline-flex items-center space-x-3 mb-8">
                <div className="h-px w-12 bg-[#C5A059]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">For Students</span>
              </div>
              <h3 className="text-4xl font-serif italic mb-12">Learn your way, <br />without platform fees.</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {STUDENT_TIERS.map(st => (
                  <div key={st.name} className="space-y-6">
                    <div>
                      <h4 className="text-xl font-serif mb-2">{st.name}</h4>
                      <p className="text-3xl font-black">{st.price}{st.period && <span className="text-sm font-medium text-white/40 ml-1">/{st.period}</span>}</p>
                      {st.usage && <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mt-1">{st.usage}</p>}
                    </div>
                    <ul className="space-y-3">
                      {st.features.map(f => (
                        <li key={f} className="flex items-center text-xs text-white/60">
                          <Check className="h-3 w-3 mr-3 text-[#C5A059]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 h-64 w-64 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-[3.5rem] border border-editorial-black/10 flex flex-col justify-center items-center text-center space-y-8"
          >
            <div className="h-20 w-20 rounded-full bg-editorial-black/5 flex items-center justify-center">
              <Mail className="h-8 w-8 text-editorial-black/40" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-serif italic text-editorial-black">Business Tier</h3>
              <p className="text-sm text-editorial-black/60 italic leading-relaxed">
                Custom enterprise solutions for institutions, coaching centers, and schools.
              </p>
            </div>
            <a 
              href="mailto:ayishik2003@gmail.com"
              className="group flex flex-col items-center"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-editorial-black/30 mb-1 group-hover:text-[#C5A059] transition-colors">Contact Founder</span>
              <span className="text-lg font-serif italic text-editorial-black border-b border-editorial-black/20 group-hover:border-[#C5A059] transition-all">ayishik2003@gmail.com</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
