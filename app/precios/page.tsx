'use client';

import { CheckIcon } from "@heroicons/react/24/solid";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring, useMotionValue } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ProfileSkeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';

const usePlans = () => {
  const t = useTranslations('pricing');
  return [
    {
      name: t('basicName'),
      description: t('basicDescription'),
      price: "9,99€",
      priceDescription: t('priceSuffix'),
      features: t.raw('basicFeatures') as string[],
      buttonText: t('basicButton'),
      variant: "outline",
      popular: false
    },
    {
      name: t('proName'),
      description: t('proDescription'),
      price: "24,99€",
      priceDescription: t('priceSuffix'),
      features: t.raw('proFeatures') as string[],
      buttonText: t('proButton'),
      variant: "default",
      popular: true
    },
    {
      name: t('enterpriseName'),
      description: t('enterpriseDescription'),
      price: "69,99€",
      priceDescription: t('priceSuffix'),
      features: t.raw('enterpriseFeatures') as string[],
      buttonText: t('enterpriseButton'),
      variant: "outline",
      popular: false
    }
  ];
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

// Animación al hacer hover en la tarjeta
const cardHoverVariants = {
  hover: {
    scale: 1.03,
    y: -8,
    boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.25)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15
    }
  }
};

const PricingCard = ({ plan, i, parallaxY }: { plan: ReturnType<typeof usePlans>[0], i: number, parallaxY: number }) => {
  const t = useTranslations('pricing');
  const cardRef = useRef(null);
  const y = useMotionValue(0);
  
  // Aplica el efecto parallax multiplicando por un factor diferente para cada tarjeta
  useEffect(() => {
    const factor = i === 0 ? 0.7 : i === 1 ? 0.5 : 0.9;
    y.set(parallaxY * factor);
  }, [parallaxY, i, y]);

  return (
    <div className="relative h-full">
      <motion.div
        ref={cardRef}
        style={{ y }}
        custom={i}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              delay: i * 0.1,
              duration: 0.5,
              ease: "easeOut"
            }
          },
          hover: {
            scale: 1.05,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          }
        }}
      >
        <div className="will-change-transform h-full">
          <Card className={`h-full flex flex-col border ${
            plan.popular 
              ? "border-indigo-500 bg-gradient-to-b from-indigo-950/40 to-indigo-900/10" 
              : "border-gray-700 bg-[#120724]"
          }`}>
            {plan.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                {t('mostPopular')}
              </div>
            )}
            <CardHeader className={`pb-8 ${plan.popular ? "pt-8" : "pt-6"}`}>
              <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
              <CardDescription className="text-gray-400 mt-2">{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400 ml-2">{plan.priceDescription}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features && Array.isArray(plan.features) && plan.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-indigo-400 mt-0.5">
                      <CheckIcon />
                    </div>
                    <span className="ml-3 text-base text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-6 pb-8">
              <Button 
                variant={plan.popular ? "default" : "outline"} 
                size="lg" 
                className={`w-full ${
                  plan.popular 
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                    : "border-indigo-500 text-indigo-400 hover:bg-indigo-950/50"
                }`}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default function PreciosPage() {
  const t = useTranslations('pricing');
  const plans = usePlans();
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [parallaxY, setParallaxY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Suaviza el efecto de scroll con spring physics
  const springConfig = { stiffness: 100, damping: 30, mass: 0.5 };
  const smoothScrollY = useSpring(scrollY, springConfig);

  useMotionValueEvent(smoothScrollY, "change", (latest) => {
    setScrollPosition(latest);
  });

  useEffect(() => {
    // Simulación de carga
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-10 w-64 mx-auto bg-indigo-900/20 rounded-lg mb-3"></div>
              <div className="h-5 w-full max-w-xl mx-auto bg-indigo-900/20 rounded-lg"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-96 bg-indigo-900/20 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12" ref={containerRef}>
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            {t('title')}
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>
      </div>

      <div className="grid gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:grid-cols-3">
        {plans.map((plan, i) => (
          <div key={plan.name} className="p-2">
            <PricingCard
              plan={plan}
              i={i}
              parallaxY={scrollPosition * 0.15}
            />
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            {t('customPlanPrompt')}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="outline" className="border-indigo-500 text-indigo-400 hover:bg-indigo-950/50">
            {t('customPlanButton')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
} 