"""Replace one article's block in a stories data file. Usage:
   python3 tools/seo/replace-story.py <file> <slug> <block-file>
The block file holds the full `{ ... },` object text (4-space indented) for that slug.
Session tool for the 2026-09-05 SEO round; safe to delete afterwards."""
import re, sys
path, slug, block_path = sys.argv[1:4]
s = open(path).read()
start = s.index(f'  {{\n    slug: "{slug}",')
end = s.index('\n  },', start) + len('\n  },')
block = open(block_path).read().rstrip('\n')
s = s[:start] + block + s[end:]
open(path, 'w').write(s)
print(f"replaced {slug} in {path}")
