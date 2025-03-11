import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import HeroImg from "../../../../public/hero.png";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center px-6 md:px-12 lg:px-20 text-center lg:text-left">
      <div className="absolute inset-0">
        <Image
          src={HeroImg}
          alt="Hero background"
          layout="fill"
          objectFit="cover"
          className="opacity-30"
          priority
        />
      </div>

      <div className="relative z-10 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
          Empower Your Business with{" "}
          <span className="text-primary">Effortless Invoicing</span>
        </h1>

        <p className="mt-4 text-lg sm:text-xl text-muted-foreground">
          Create, manage, and send invoices with ease.{" "}
          <span className="text-primary font-medium">
            No hassle. No stress.
          </span>{" "}
          Just streamlined invoicing for freelancers and businesses.
        </p>

        <div className="mt-6 flex justify-center lg:justify-start gap-4">
          <Button asChild size="lg">
            <Link href="/sign-up">Get Started</Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href="/features">Explore Features</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
