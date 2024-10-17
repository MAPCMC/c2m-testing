import NavBar from "@/components/NavBar";
import { PageHeader } from "@/components/PageHeader";
import { PageMain } from "@/components/PageMain";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <NavBar />
      <PageHeader title="pagina niet gevonden" />
      <PageMain>
        <Button asChild>
          <Link href="/">Naar de hoofdpagina</Link>
        </Button>
      </PageMain>
    </>
  );
}
