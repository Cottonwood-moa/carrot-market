import Layout from "@components/layout";
import ssrJson from "@libs/server/ssrJson";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";
import Link from "next/link";
interface BlogPost {
  title: string;
  date: string;
  category: string;
  slug: string;
}
interface BlogProps {
  blogPosts: BlogPost[];
}
export const Blog: NextPage<BlogProps> = ({ blogPosts }) => {
  return (
    <Layout title="Blog">
      {blogPosts.map((post, index) => {
        return (
          <div className="my-8" key={index}>
            <Link href={`/blog/${post.slug}`}>
              <a>
                <h1 className="text-lg font-semibold text-red-500">
                  {post.title}
                </h1>
                <div className="space-x-2">
                  <span className="text-md font-normal text-gray-700">
                    {post.category}
                  </span>
                  <span>/</span>
                  <span className="text-sm font-thin text-gray-700">
                    {post.date}
                  </span>
                </div>
              </a>
            </Link>
          </div>
        );
      })}
    </Layout>
  );
};

export async function getStaticProps() {
  const blogPosts = readdirSync("./posts").map((file) => {
    const content = readFileSync(`./posts/${file}`, "utf-8");
    const { data } = matter(content);
    return { ...data, slug: file.split(".")[0] };
  });
  return {
    props: {
      blogPosts: blogPosts.reverse(),
    },
  };
}

export default Blog;
