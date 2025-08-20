import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export function getSiteConfig() {
  const filePath = path.join(contentDirectory, 'site-config.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function getNavigation() {
  const filePath = path.join(contentDirectory, 'navigation.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function getPageContent(page: string) {
  const filePath = path.join(contentDirectory, 'pages', `${page}.json`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function getBlogPosts() {
  const blogDirectory = path.join(contentDirectory, 'blog', 'posts');
  
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(blogDirectory);
  const posts = fileNames
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const fullPath = path.join(blogDirectory, name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      return {
        slug: name.replace(/\.md$/, ''),
        frontMatter: data,
        content,
        ...data
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getBlogPost(slug: string) {
  const fullPath = path.join(contentDirectory, 'blog', 'posts', `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    slug,
    frontMatter: data,
    content,
    ...data
  };
}