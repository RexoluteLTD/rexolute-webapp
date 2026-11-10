// React 19 hoists document metadata rendered by route components into <head>.
export default function Head({ title }: { title: string }) {
  return <title>{`${title} | Rexolute`}</title>;
}
