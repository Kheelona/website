import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { generatePageMetadata, generateBreadcrumbs } from "@/lib/metadata";
import { getBlogs } from "@/lib/wix/services/blogs";
import BlogsSwippable from "@/components/sections/BlogsSwippable";
import BlogsGrid from "@/components/sections/BlogsGrid";
import WhatsAppCommunity from "@/components/sections/WhatsAppCommunity";

// SEO Metadata for Blog page
export const metadata: Metadata = generatePageMetadata({
  title: "Blog - Parenting Tips & Child Development",
  description:
    "Expert parenting tips, child development guides, and educational insights from Kheelona. Learn about screen-free play, language development, and raising happy children.",
  keywords: [
    "parenting tips",
    "child development",
    "screen-free play",
    "educational toys blog",
    "toddler activities",
    "language development children",
    "emotional intelligence kids",
    "Indian parenting",
  ],
  path: "/blog",
  ogType: "website",
});

// Blog posts data
const blogPosts = [
  {
    id: 1,
    slug: "screen-time-alternatives-for-toddlers",
    title: "10 Screen-Free Activities That Keep Toddlers Engaged",
    excerpt:
      "Discover creative ways to reduce screen time while keeping your little ones entertained and learning. From sensory play to interactive storytelling.",
    image: "/images/lifestyle/lumi-blue-lifestyle.jpg",
    category: "Parenting Tips",
    date: "2024-12-15",
    readTime: "5 min read",
    author: "Kheelona Team",
  },
  {
    id: 2,
    slug: "multilingual-children-benefits",
    title: "Why Raising Multilingual Children Gives Them an Edge",
    excerpt:
      "Research shows bilingual children have better problem-solving skills and cognitive flexibility. Learn how to introduce multiple languages naturally.",
    image: "/images/lifestyle/lumi-green-lifestyle.jpg",
    category: "Child Development",
    date: "2024-12-10",
    readTime: "7 min read",
    author: "Kheelona Team",
  },
  {
    id: 3,
    slug: "ai-toys-future-of-learning",
    title: "How AI Toys Are Revolutionizing Early Childhood Education",
    excerpt:
      "Explore how artificial intelligence is creating personalized learning experiences for children, adapting to their pace and interests.",
    image: "/images/lifestyle/lumi-pink-lifestyle.jpg",
    category: "Technology",
    date: "2024-12-05",
    readTime: "6 min read",
    author: "Kheelona Team",
  },
  {
    id: 4,
    slug: "bedtime-stories-importance",
    title: "The Science Behind Bedtime Stories: Why They Matter",
    excerpt:
      "Bedtime stories do more than help children sleep. They build vocabulary, strengthen bonds, and develop imagination. Here's what research says.",
    image: "/images/lifestyle/all-colors-flowers.jpg",
    category: "Parenting Tips",
    date: "2024-11-28",
    readTime: "4 min read",
    author: "Kheelona Team",
  },
  {
    id: 5,
    slug: "emotional-intelligence-children",
    title: "Building Emotional Intelligence in Young Children",
    excerpt:
      "Help your child understand and manage emotions from an early age. Practical strategies for parents to nurture emotional development.",
    image: "/images/lifestyle/all-colors-group-2.jpg",
    category: "Child Development",
    date: "2024-11-20",
    readTime: "8 min read",
    author: "Kheelona Team",
  },
  {
    id: 6,
    slug: "choosing-educational-toys",
    title: "A Parent's Guide to Choosing Educational Toys",
    excerpt:
      "Not all toys are created equal. Learn what to look for when selecting toys that genuinely support your child's development.",
    image: "/images/lifestyle/all-colors-group-3.jpg",
    category: "Buying Guides",
    date: "2024-11-15",
    readTime: "5 min read",
    author: "Kheelona Team",
  },
];

// JSON-LD for Blog page
const blogJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    generateBreadcrumbs([
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blog" },
    ]),
    {
      "@type": "Blog",
      "@id": "https://kheelona.com/blog#blog",
      url: "https://kheelona.com/blog",
      name: "Kheelona Blog - Parenting Tips & Child Development",
      description:
        "Expert parenting tips, child development guides, and educational insights from Kheelona.",
      publisher: { "@id": "https://kheelona.com/#organization" },
      inLanguage: "en-US",
      blogPost: blogPosts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: `https://kheelona.com${post.image}`,
        url: `https://kheelona.com/blog/${post.slug}`,
        datePublished: post.date,
        author: {
          "@type": "Organization",
          name: "Kheelona Robotics",
        },
        publisher: { "@id": "https://kheelona.com/#organization" },
      })),
    },
  ],
};

export default async function BlogPage() {
  const blogs: any = await getBlogs();
  return (
    <>
      <Script
        id="blog-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <div className="min-h-screen flex flex-col">
        <Header />

        <main id="main-content" className="flex-1 pt-24 md:pt-28">
          {/* Hero Section */}

          <BlogsSwippable blogs={blogs} />
          <BlogsGrid blogs={blogs} />
          <WhatsAppCommunity />
        </main>

        <Footer />
      </div>
    </>
  );
}
