import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type * as PageTree from "fumadocs-core/page-tree";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { getMDXComponents } from "@/components/mdx";
import { DocsWatermark } from "@/components/docs/DocsWatermark";
import { Eyebrow } from "@/components/SectionHeader";
import { source } from "@/lib/source";

// The sidebar section a page is listed under, shown as the eyebrow above its title.
function sectionOf(tree: PageTree.Root, url: string): string | undefined {
  let section: string | undefined;
  for (const node of tree.children) {
    if (node.type === "separator") section = typeof node.name === "string" ? node.name : undefined;
    else if (node.type === "page" && node.url === url) return section;
  }
  return undefined;
}

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const section = sectionOf(source.getPageTree(), page.url);

  return (
    <DocsPage toc={page.data.toc} full={page.data.full} className="relative isolate">
      <DocsWatermark />
      {section && <Eyebrow className="mt-2">{section}</Eyebrow>}
      <DocsTitle className="font-display text-4xl font-normal tracking-tight md:text-5xl">{page.data.title}</DocsTitle>
      <DocsDescription className="mb-6 max-w-2xl leading-relaxed">{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents({ a: createRelativeLink(source, page) })} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: `${page.data.title} — PolicyProbe Docs`,
    description: page.data.description,
  };
}
