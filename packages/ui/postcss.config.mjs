import { fileURLToPath } from "node:url";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
export default {
  plugins: [tailwindcss({ config: fileURLToPath(new URL("./tailwind.config.ts", import.meta.url)) }), autoprefixer()],
};
