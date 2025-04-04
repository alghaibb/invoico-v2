import { RainbowButton } from "@/components/magicui/rainbow-button";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import HeroImg from "../../../../public/hero.png";

export const revalidate = 7200;

export default async function Hero() {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center px-6 md:px-12 lg:px-20 text-center lg:text-left">
      <div className="absolute inset-0">
        <Image
          src={HeroImg}
          alt="Hero background"
          layout="fill"
          objectFit="cover"
          className="opacity-30"
          priority={true}
        />
      </div>

      <div className="relative z-10 max-w-3xl text-center">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter">
          Empower Your Business with{" "}
          <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-primary bg-clip-text text-transparent">
            Effortless Invoicing
          </span>
        </h1>

        <p className="mt-4 sm:text-xl text-muted-foreground">
          Create, manage, and send invoices with ease.{" "}
          <span className="text-primary font-medium">
            No hassle. No stress.
          </span>{" "}
          Just streamlined invoicing for freelancers and businesses.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4 flex-col sm:flex-row">
          <RainbowButton asChild className="rounded-md w-full sm:w-auto">
            <Link href="/dashboard/invoices/create">Get Started</Link>
          </RainbowButton>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Link href="/features">Explore Features</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
