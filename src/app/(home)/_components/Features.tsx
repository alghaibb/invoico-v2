import { features, FeatureType } from "@/lib/constants";

export default function Features() {
  return (
    <section className="relative w-full py-20 px-6 md:px-12 lg:px-20 text-center">
      <div className="relative z-10 max-w-5xl mx-auto">
        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter">
          Designed to Simplify Your Invoicing
        </h2>
        <p className="mt-4 sm:text-xl text-muted-foreground">
          Everything you need to create, send, and track invoices—all in one
          place.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureType) => (
  <div className="p-6 bg-background shadow-lg hover:shadow-2xl transition-all duration-300 rounded-md">
    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-gradient-to-r from-orange-500 to-primary rounded-full text-background">
      <Icon className="size-6" />
    </div>
    <h3 className="mt-4 text-xl font-semibold">{title}</h3>
    <p className="mt-2 text-muted-foreground text-sm">{description}</p>
  </div>
);
