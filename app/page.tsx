"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Star, TrendingUp, Truck, Store, ShoppingCart, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    icon: <Store className="h-8 w-8 text-primary" />,
    title: "Sell with Us",
    description: "Start your business journey with our marketplace platform",
    link: "/signup?type=seller",
    buttonText: "Become a Seller"
  },
  {
    icon: <ShoppingCart className="h-8 w-8 text-primary" />,
    title: "Shop with Us",
    description: "Discover amazing products from our trusted sellers",
    link: "/dashboard",
    buttonText: "Start Shopping"
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Join Our Community",
    description: "Connect with sellers and buyers in our growing marketplace",
    link: "/signup",
    buttonText: "Join Now"
  }
];

const benefits = [
  {
    icon: <Truck className="h-6 w-6 text-primary" />,
    title: "Fast Delivery",
    description: "Free shipping on orders over ৳1000",
  },
  {
    icon: <Star className="h-6 w-6 text-primary" />,
    title: "Premium Quality",
    description: "Handpicked products from top brands",
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-primary" />,
    title: "Growing Platform",
    description: "Join our rapidly expanding marketplace",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-[60vh] sm:h-[80vh] flex items-center justify-center bg-gradient-to-r from-primary/10 to-secondary/10 py-12 sm:py-0"
      >
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Your Ultimate
              <br />
              Marketplace
            </h1>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-muted-foreground max-w-xl mx-auto md:mx-0">
              Whether you're looking to sell your products or find amazing deals,
              we've got you covered. Join our growing community today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button 
                size="lg" 
                className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto"
                onClick={() => router.push('/dashboard')}
              >
                Start Shopping <ShoppingBag className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => router.push('/signup?type=seller')}
              >
                Become a Seller <Store className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="hidden md:block"
          >
            <div className="relative h-[500px] w-full">
              <Image
                src="/hero-image.png"
                alt="Marketplace Hero"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Choose Your Path</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Whether you want to sell your products or shop for great deals,
              we have the perfect solution for you.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 inline-flex p-3 rounded-full bg-primary/10">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground mb-6">{feature.description}</p>
                    <Button
                      className="w-full"
                      onClick={() => router.push(feature.link)}
                    >
                      {feature.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-20 bg-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Why Choose Us</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Experience the best of online shopping and selling with our feature-rich platform
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-background rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="mb-4 inline-flex p-3 rounded-full bg-primary/10">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-12 sm:py-20 bg-primary text-white text-center"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90 px-4">
            Join thousands of satisfied users who are already part of our marketplace.
            Start your journey today!
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => router.push('/signup')}
          >
            Create Your Account
          </Button>
        </div>
      </motion.section>
    </div>
  );
}