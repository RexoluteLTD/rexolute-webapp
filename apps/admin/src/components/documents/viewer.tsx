import { lazy, Suspense } from "react";
import type { FilesProps } from "./file-viewer";
import { Skeleton } from "@rexolute/ui/skeleton";
const Viewer = lazy(() => import("./file-viewer"));
export default function FileViewer(props: FilesProps) {
  return <Suspense fallback={<Skeleton className="h-[150px] w-full" />}><Viewer {...props} /></Suspense>;
}
