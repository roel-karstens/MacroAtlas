import { Container, InkLink } from "@/components/editorial";

export default function NotFound() {
  return (
    <Container className="py-20">
      <h1 className="font-display text-6xl font-semibold">Page not in this edition.</h1>
      <p className="mt-4 max-w-xl text-[#3f4651]">The link does not match a published topic, essay, or model.</p>
      <div className="mt-8">
        <InkLink href="/">Back to the edition</InkLink>
      </div>
    </Container>
  );
}
