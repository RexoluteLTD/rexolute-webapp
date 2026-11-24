import type { ArticleDocument } from "@rexolute/types";
import StarterKit from "@tiptap/starter-kit";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import ErrorBoundary from "./error-boundary";

const extensions = [StarterKit.configure({ heading: { levels: [2, 3, 4, 5, 6] } })];

function RichText({ content }: { content: ArticleDocument }) {
  return renderToReactElement({ extensions, content });
}

export function ArticleContent({ content }: { content: ArticleDocument }) {
  return <ErrorBoundary><RichText content={content} /></ErrorBoundary>;
}
