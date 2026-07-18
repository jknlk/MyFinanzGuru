import Link from "next/link";
import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h2: (props) => <h2 className="font-serif text-2xl text-ink-900 mt-10 mb-4" {...props} />,
  h3: (props) => <h3 className="font-serif text-xl text-ink-900 mt-8 mb-3" {...props} />,
  p: (props) => <p className="text-ink-700 leading-relaxed mb-4" {...props} />,
  a: ({ href, ...props }) => (
    <Link
      href={href ?? "#"}
      className="text-accent-600 underline underline-offset-2 hover:text-accent-700"
      {...props}
    />
  ),
  ul: (props) => <ul className="list-disc pl-6 mb-4 space-y-1.5 text-ink-700" {...props} />,
  ol: (props) => <ol className="list-decimal pl-6 mb-4 space-y-1.5 text-ink-700" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink-900" {...props} />,
  em: (props) => <em {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-l-2 border-accent-400 pl-4 italic text-ink-600 my-6"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  thead: (props) => <thead className="text-left text-ink-500" {...props} />,
  th: (props) => <th className="border-b border-ink-200 py-2 pr-4 font-medium" {...props} />,
  td: (props) => <td className="border-b border-ink-200/60 py-2 pr-4 text-ink-700" {...props} />,
};
