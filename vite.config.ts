/* eslint-disable import/no-extraneous-dependencies */
import { resolve } from "path";
import { BuildOptions, ServerOptions, build, defineConfig } from "vite";
import { existsSync, readFileSync } from "fs";
import react from "@vitejs/plugin-react-swc";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { viteSingleFile } from "vite-plugin-singlefile";
import { writeFile } from "fs/promises";
import svgr from "vite-plugin-svgr";
import { loadEnv } from 'vite';

const PORT = 4000;
const clientRoot = "./src/client";
const outDir = "./dist";
const serverEntry = "src/server/index.ts";
const copyAppscriptEntry = "./appsscript.json";
const devServerWrapper = "./dev/dev-server-wrapper.html";

const clientEntrypoints = [
  {
    name: "CLIENT - Dialog",
    filename: "dialog",
    template: "dialog/index.html",
  },
  {
    name: "CLIENT - Sidebar",
    filename: "sidebar",
    template: "sidebar/index.html",
  },
];

const keyPath = resolve(__dirname, "./certs/key.pem");
const certPath = resolve(__dirname, "./certs/cert.pem");
const pfxPath = resolve(__dirname, "./certs/cert.pfx"); // if needed for Windows

const devServerOptions: ServerOptions = {
  port: PORT,
};

// use key and cert settings only if they are found
if (existsSync(keyPath) && existsSync(certPath)) {
  devServerOptions.https = {
    key: readFileSync(resolve(__dirname, "./certs/key.pem")),
    cert: readFileSync(resolve(__dirname, "./certs/cert.pem")),
  };
}

// If mkcert -install cannot be used on Windows machines (in pipeline, for example), the
// script at scripts/generate-cert.ps1 can be used to create a .pfx cert
if (existsSync(pfxPath)) {
  // use pfx file if it's found
  devServerOptions.https = {
    pfx: readFileSync(pfxPath),
    passphrase: "abc123",
  };
}

const clientServeConfig = () =>
  defineConfig({
    plugins: [react(), svgr({include: "**/*.svg?react",})],
    server: devServerOptions,
    root: clientRoot,
  });

const clientBuildConfig = ({
  clientEntrypointRoot,
  template,
}: {
  clientEntrypointRoot: string;
  template: string;
}) =>
  defineConfig({
    plugins: [react(), svgr({include: "**/*.svg?react",}), viteSingleFile({ useRecommendedBuildConfig: true })],
    root: resolve(__dirname, clientRoot, clientEntrypointRoot),
    build: {
      sourcemap: false,
      write: false, // don't write to disk
      outDir,
      emptyOutDir: true,
      minify: true,
      rollupOptions: {
        external: [
          "react",
          "react-dom",
          "react-transition-group",
          "react-bootstrap",
          "@mui/material",
          "@emotion/react",
          "@emotion/styled",
          "gas-client",
          "@types/react",
          "react-bootstrap-icons"
        ],
        output: {
          format: "iife", // needed to use globals from UMD builds
          dir: outDir,
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            "react-transition-group": "ReactTransitionGroup",
            "react-bootstrap": "ReactBootstrap",
            "@mui/material": "MaterialUI",
            "@emotion/react": "emotionReact",
            "@emotion/styled": "emotionStyled",
            "gas-client": "GASClient",
            "@types/react": "@types/react",
            "react-bootstrap-icons": "react-bootstrap-icons",
          },
        },
        input: resolve(__dirname, clientRoot, template),
      },
    },
  });

const serverBuildConfig: BuildOptions = {
  emptyOutDir: true,
  minify: false, // needed to work with footer
  lib: {
    entry: resolve(__dirname, serverEntry),
    fileName: "code",
    name: "globalThis",
    formats: ["iife"],
  },
  rollupOptions: {
    output: {
      entryFileNames: "code.js",
      extend: true,
      footer: (chunk) =>
        chunk.exports
          .map((exportedFunction) => `function ${exportedFunction}() {};`)
          .join("\n"),
    },
  },
};

const buildConfig = ({ mode }: { mode: string }) => {
  const targets = [{ src: copyAppscriptEntry, dest: "./" }];
  if (mode === "development") {
    targets.push(
      ...clientEntrypoints.map((entrypoint) => ({
        src: devServerWrapper,
        dest: "./",
        rename: `${entrypoint.filename}.html`,
        transform: (contents: string) =>
          contents
            .toString()
            .replace(/__PORT__/g, String(PORT))
            .replace(/__FILE_NAME__/g, entrypoint.template),
      })),
    );
  }
  return defineConfig({
    plugins: [
      svgr({include: "**/*.svg?react",}),
      viteStaticCopy({
        targets,
      }),
      /**
       * This builds the client react app bundles for production, and writes them to disk.
       * Because multiple client entrypoints (dialogs) are built, we need to loop through
       * each entrypoint and build the client bundle for each. Vite doesn't have great tooling for
       * building multiple single-page apps in one project, so we have to do this manually with a
       * post-build closeBundle hook (https://rollupjs.org/guide/en/#closebundle).
       */
      mode === "production" && {
        name: "build-client-production-bundles",
        closeBundle: async () => {
          console.log("Building client production bundles...");
          // eslint-disable-next-line no-restricted-syntax
          for (const clientEntrypoint of clientEntrypoints) {
            console.log("Building client bundle for", clientEntrypoint.name);
            // eslint-disable-next-line no-await-in-loop
            const buildOutput = await build(
              clientBuildConfig({
                clientEntrypointRoot: clientEntrypoint.filename,
                template: clientEntrypoint.template,
              }),
            );
            // eslint-disable-next-line no-await-in-loop
            await writeFile(
              resolve(__dirname, outDir, `${clientEntrypoint.filename}.html`),
              // @ts-expect-error - output is an array of RollupOutput
              buildOutput.output[0].source,
            );
          }
          console.log("Finished building client bundles!");
        },
      },
    ].filter(Boolean),
    build: serverBuildConfig,
  });
};

// https://vitejs.dev/config/
export default async ({ command, mode }: { command: string; mode: string }) => {
  // Load env file based on mode
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  if (command === "serve") {
    return clientServeConfig();
  }
  if (command === "build") {
    return buildConfig({ mode });
  }
  return {};
};
