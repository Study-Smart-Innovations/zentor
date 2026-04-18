"use client"

import { motion } from "framer-motion";
import { Check, X, ShieldCheck, Zap, GraduationCap, Briefcase } from "lucide-react";

const PricingCard = ({ title, price, description, features, popular = false, delay, icon: Icon }: { title: string, price: string, description: string, features: { text: string, included: boolean }[], popular?: boolean, delay: number, icon: any }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className={`relative flex flex-col p-10 rounded-[2.5rem] border ${popular ? "border-primary-blue bg-primary-blue/[0.03] shadow-premium" : "border-foreground/10 bg-background"} transition-all hover:border-primary-blue/30`}
  >
    {popular && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-blue px-4 py-1.5 text-[10px] font-black text-white shadow-lg uppercase tracking-widest">
        Recommended
      </div>
    )}
    
    <div className="flex items-center justify-between">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${popular ? "bg-primary-blue text-white" : "bg-foreground/5 text-foreground/40"}`}>
        <Icon className="h-6 w-6" />
      </div>
      {popular && <Zap className="h-5 w-5 text-primary-blue animate-pulse" />}
    </div>

    <h3 className="mt-6 text-2xl font-black text-foreground tracking-tight">{title}</h3>
    
    <div className="mt-4 flex items-baseline space-x-1">
      <span className="text-4xl font-black text-foreground">{price === "Free" ? "" : "$"}{price}</span>
      {price !== "Free" && <span className="text-foreground/40 font-bold text-sm">/month</span>}
    </div>
    
    <p className="mt-4 text-base text-foreground/50 leading-relaxed">
      {description}
    </p>
    
    <div className="mt-8 h-px bg-foreground/5" />

    <ul className="mt-8 space-y-4 flex-1">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start space-x-3 text-sm">
          {feature.included ? (
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-mint/10 text-primary-mint">
              <Check className="h-3 w-3 stroke-[3]" />
            </div>
          ) : (
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-foreground/20">
              <X className="h-3 w-3 stroke-[3]" />
            </div>
          )}
          <span className={feature.included ? "font-bold text-foreground/70" : "font-medium text-foreground/30"}>
            {feature.text}
          </span>
        </li>
      ))}
    </ul>
    
    <button className={`mt-10 rounded-2xl py-5 text-center text-sm font-black tracking-widest uppercase transition-all duration-300 active:scale-95 ${popular ? "bg-primary-blue text-white shadow-xl shadow-primary-blue/20 hover:bg-primary-purple" : "border-2 border-foreground/10 bg-background hover:bg-foreground/5 text-foreground"}`}>
      {price === "Free" ? "Get Started" : "Start Now"}
    </button>
  </motion.div>
);

export const PricingSection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden" id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 rounded-full bg-primary-mint/10 px-4 py-1.5 text-sm font-black text-primary-mint"
          >
            <ShieldCheck className="h-4 w-4" />
            <span className="uppercase tracking-[0.1em]">Transparent Pricing</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-6 text-4xl font-black tracking-tighter text-foreground sm:text-5xl lg:text-6xl"
          >
            Plans for <span className="text-primary-blue">Every Journey</span>
          </motion.h2>
        </div>

        <div className="mt-16 mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
          <PricingCard
            title="Student Pass"
            price="Free"
            icon={GraduationCap}
            description="Access local teacher discovery and basic study materials."
            delay={0.2}
            features={[
              { text: "Find Local Teachers", included: true },
              { text: "Public Course Previews", included: true },
              { text: "Community Notes Access", included: true },
              { text: "Ad-supported experience", included: true },
              { text: "Direct Teacher Messaging", included: false },
              { text: "Premium Mock Exams", included: false },
            ]}
          />
          <PricingCard
            title="Teacher Pro"
            price="19.99"
            icon={Briefcase}
            description="Scale your tuition business with advanced leads and tools."
            popular
            delay={0.3}
            features={[
              { text: "Unlimited Course Listings", included: true },
              { text: "Verified Teacher Badge", included: true },
              { text: "Student Lead Generation", included: true },
              { text: "Performance Analytics", included: true },
              { text: "Direct Payment Integration", included: true },
              { text: "Priority Support", included: true },
            ]}
          />
        </div>
      </div>
    </section>
  );
};
