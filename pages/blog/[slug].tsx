import Layout from "@components/layout";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse/lib";
import { unified } from "unified";

const Post: NextPage<any> = ({ post, data }) => {
  return (
    <>
      {!post && !data ? (
        <div>Not Found</div>
      ) : (
        <Layout hasTabBar title={data.title}>
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: post }}
          />
        </Layout>
      )}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

// 개발환경에서는 계속 실행됨.
export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const { data, content } = matter.read(`./posts/${context.params?.slug}.md`);
    // md -> html
    // unified, remark-parse , remark-html
    const { value } = await unified()
      .use(remarkParse)
      .use(remarkHtml)
      .process(content);

    return {
      props: {
        data,
        post: value,
      },
    };
  } catch {
    return {
      redirect: {
        permanent: false,
        destination: "/blog",
      },
    };
  }
};

export default Post;
