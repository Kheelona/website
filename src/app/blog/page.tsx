import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { generatePageMetadata, generateBreadcrumbs } from "@/lib/metadata";

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

export default function BlogPage() {
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
          <section className="bg-gradient-to-b from-muted-orange/10 to-white py-12 px-4">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="font-heading text-3xl md:text-5xl text-stroke-tangerine mb-4">
                PARENTING INSIGHTS
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Expert tips on child development, screen-free activities, and raising happy, curious
                children in the digital age.
              </p>
            </div>
          </section>

          {/* Categories */}
          <section className="py-6 px-4 border-b">
            <div className="max-w-6xl mx-auto">
              <nav aria-label="Blog categories" className="flex flex-wrap gap-3 justify-center">
                <button className="px-4 py-2 rounded-full bg-tangerine text-white text-sm font-medium">
                  All Posts
                </button>
                <button className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors">
                  Parenting Tips
                </button>
                <button className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors">
                  Child Development
                </button>
                <button className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors">
                  Technology
                </button>
                <button className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors">
                  Buying Guides
                </button>
              </nav>
            </div>
          </section>

          {/* Blog Posts Grid */}
          <section className="py-12 px-4" aria-labelledby="posts-heading">
            <h2 id="posts-heading" className="sr-only">
              Blog Posts
            </h2>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {blogPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover-lift transition-all"
                    itemScope
                    itemType="https://schema.org/BlogPosting"
                  >
                    {/* Post Image */}
                    <div className="aspect-video relative">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                        itemProp="image"
                      />
                      <span className="absolute top-4 left-4 bg-tangerine text-white text-xs px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>

                    {/* Post Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                        <time dateTime={post.date} itemProp="datePublished">
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className="font-bold text-lg mb-2 line-clamp-2" itemProp="headline">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="hover:text-tangerine transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-gray-600 text-sm line-clamp-3 mb-4" itemProp="description">
                        {post.excerpt}
                      </p>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-tangerine font-medium text-sm hover:underline inline-flex items-center gap-1"
                      >
                        Read More
                        <span aria-hidden="true">→</span>
                      </Link>

                      <meta itemProp="author" content={post.author} />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Newsletter CTA */}
          <section className="bg-sky-blue py-12 px-4">
            <div className="max-w-2xl mx-auto text-center text-white">
              <h2 className="font-heading text-2xl md:text-3xl mb-4">
                GET PARENTING TIPS IN YOUR INBOX
              </h2>
              <p className="mb-6 opacity-90">
                Join 10,000+ parents receiving weekly tips on raising happy, curious children.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <label htmlFor="email-input" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-input"
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  required
                  aria-required="true"
                />
                <button
                  type="submit"
                  className="bg-tangerine hover:bg-tangerine/90 px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
