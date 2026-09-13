import { Hero } from "@/components/landing/Hero";
import { Pipeline } from "@/components/landing/Pipeline";
import { Sandbox } from "@/components/landing/Sandbox";
import { Suite } from "@/components/landing/Suite";
import { CallToAction } from "@/components/landing/CallToAction";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Pipeline />
      <Sandbox />
      <Suite />
      <CallToAction />
    </>
  );
}
