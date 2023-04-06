/// <reference types="vitest" />
import {defineConfig, type ConfigEnv, type UserConfigExport, loadEnv} from 'vite'
import path, {resolve} from "path";
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx"
import {createSvgIconsPlugin} from "vite-plugin-svg-icons"
import svgLoader from "vite-svg-loader"
import UnoCSS from "unocss/vite"
import DefineOptions from "unplugin-vue-define-options/vite"
import * as process from "process";

/**
 * @description-en vite document address
 * @description-cn vite官网
 * https://vitejs.cn/config/ */
export default defineConfig({
  /** 打包时根据实际情况修改 base */
  // base: import.meta.env.VITE_PUBLIC_PATH,
  // 解决[vite] Internal server error: Failed to resolve import
  resolve: {
    alias: {
      /** @ 符号指向 src 目录 */
      // "@": resolve(__dirname, "./src")
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    /** 是否开启 HTTPS */
    https: false,
    /** 设置 host: true 才可以使用 Network 的形式，以 IP 访问项目 */
    host: true, // host: "0.0.0.0"
    /** 端口号 */
    port: 3333,
    /** 是否自动打开浏览器 */
    open: false,
    /** 跨域设置允许 */
    cors: true,
    /** 端口被占用时，是否直接退出 */
    strictPort: false,
    /** 接口代理 */
    proxy: {
      "/api/v1": {
        target: "https://mock.web.com/mock/xxx/api/v1",
        ws: true,
        /** 是否允许跨域 */
        changeOrigin: true,
        rewrite: (path) => path.replace("/api/v1", "")
      }
    }
  },
  build: {
    /** 消除打包大小超过 500kb 警告 */
    chunkSizeWarningLimit: 2000,
    /** Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效 */
    minify: "terser",
    /** 在打包代码时移除 console.log、debugger 和 注释 */
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
        pure_funcs: ["console.log"]
      },
      format: {
        /** 删除注释 */
        comments: false
      }
    },
    /** 打包后静态资源目录 */
    assetsDir: "static"
  },
  // Vite插件
  plugins: [
    vue(),
    vueJsx(),
    // /** 将 SVG 静态图转化为 Vue 组件 */
    svgLoader(),
    /** SVG */
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/icons/svg")],
      symbolId: "icon-[dir]-[name]"
    }),
    /** UnoCSS */
    UnoCSS(),
    // DefineOptions 可以更简单的注册组件名称
    DefineOptions(),
  ],

  /** Vitest 单元测试配置：https://cn.vitest.dev/config */
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "jsdom"
  }
})


// export default defineConfig(({mode, command}: ConfigEnv) => {
// export default defineConfig((config: ConfigEnv) => {
//   const viteEnv = loadEnv(config.mode, process.cwd()) as ImportMetaEnv
//   const {VITE_PUBLIC_PATH} = viteEnv
//   return {
//     base: VITE_PUBLIC_PATH
//
//   }
// })