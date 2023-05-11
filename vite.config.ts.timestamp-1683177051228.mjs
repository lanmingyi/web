// vite.config.ts
import { defineConfig } from "file:///D:/bc/web/node_modules/vite/dist/node/index.js";
import path from "path";
import vue from "file:///D:/bc/web/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/bc/web/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///D:/bc/web/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import svgLoader from "file:///D:/bc/web/node_modules/vite-svg-loader/index.js";
import UnoCSS from "file:///D:/bc/web/node_modules/unocss/dist/vite.mjs";
import DefineOptions from "file:///D:/bc/web/node_modules/unplugin-vue-define-options/dist/vite.mjs";
import * as process from "process";
var __vite_injected_original_dirname = "D:\\bc\\web";
var vite_config_default = defineConfig({
  /** 打包时根据实际情况修改 base */
  // base: import.meta.env.VITE_PUBLIC_PATH,
  // 解决[vite] Internal server error: Failed to resolve import
  resolve: {
    alias: {
      /** @ 符号指向 src 目录 */
      // "@": resolve(__dirname, "./src")
      "@": path.resolve(__vite_injected_original_dirname, "src")
    }
  },
  server: {
    /** 是否开启 HTTPS */
    https: false,
    /** 设置 host: true 才可以使用 Network 的形式，以 IP 访问项目 */
    host: true,
    // host: "0.0.0.0"
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
        rewrite: (path2) => path2.replace("/api/v1", "")
      }
    }
  },
  build: {
    /** 消除打包大小超过 500kb 警告 */
    chunkSizeWarningLimit: 2e3,
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
    DefineOptions()
  ],
  /** Vitest 单元测试配置：https://cn.vitest.dev/config */
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "jsdom"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxiY1xcXFx3ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGJjXFxcXHdlYlxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovYmMvd2ViL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxyXG5pbXBvcnQge2RlZmluZUNvbmZpZywgdHlwZSBDb25maWdFbnYsIHR5cGUgVXNlckNvbmZpZ0V4cG9ydCwgbG9hZEVudn0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHBhdGgsIHtyZXNvbHZlfSBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlLWpzeFwiXHJcbmltcG9ydCB7Y3JlYXRlU3ZnSWNvbnNQbHVnaW59IGZyb20gXCJ2aXRlLXBsdWdpbi1zdmctaWNvbnNcIlxyXG5pbXBvcnQgc3ZnTG9hZGVyIGZyb20gXCJ2aXRlLXN2Zy1sb2FkZXJcIlxyXG5pbXBvcnQgVW5vQ1NTIGZyb20gXCJ1bm9jc3Mvdml0ZVwiXHJcbmltcG9ydCBEZWZpbmVPcHRpb25zIGZyb20gXCJ1bnBsdWdpbi12dWUtZGVmaW5lLW9wdGlvbnMvdml0ZVwiXHJcbmltcG9ydCAqIGFzIHByb2Nlc3MgZnJvbSBcInByb2Nlc3NcIjtcclxuXHJcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24tZW4gdml0ZSBkb2N1bWVudCBhZGRyZXNzXHJcbiAqIEBkZXNjcmlwdGlvbi1jbiB2aXRlXHU1Qjk4XHU3RjUxXHJcbiAqIGh0dHBzOi8vdml0ZWpzLmNuL2NvbmZpZy8gKi9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAvKiogXHU2MjUzXHU1MzA1XHU2NUY2XHU2ODM5XHU2MzZFXHU1QjlFXHU5NjQ1XHU2MEM1XHU1MUI1XHU0RkVFXHU2NTM5IGJhc2UgKi9cclxuICAvLyBiYXNlOiBpbXBvcnQubWV0YS5lbnYuVklURV9QVUJMSUNfUEFUSCxcclxuICAvLyBcdTg5RTNcdTUxQjNbdml0ZV0gSW50ZXJuYWwgc2VydmVyIGVycm9yOiBGYWlsZWQgdG8gcmVzb2x2ZSBpbXBvcnRcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAvKiogQCBcdTdCMjZcdTUzRjdcdTYzMDdcdTU0MTEgc3JjIFx1NzZFRVx1NUY1NSAqL1xyXG4gICAgICAvLyBcIkBcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIilcclxuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJylcclxuICAgIH1cclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgLyoqIFx1NjYyRlx1NTQyNlx1NUYwMFx1NTQyRiBIVFRQUyAqL1xyXG4gICAgaHR0cHM6IGZhbHNlLFxyXG4gICAgLyoqIFx1OEJCRVx1N0Y2RSBob3N0OiB0cnVlIFx1NjI0RFx1NTNFRlx1NEVFNVx1NEY3Rlx1NzUyOCBOZXR3b3JrIFx1NzY4NFx1NUY2Mlx1NUYwRlx1RkYwQ1x1NEVFNSBJUCBcdThCQkZcdTk1RUVcdTk4NzlcdTc2RUUgKi9cclxuICAgIGhvc3Q6IHRydWUsIC8vIGhvc3Q6IFwiMC4wLjAuMFwiXHJcbiAgICAvKiogXHU3QUVGXHU1M0UzXHU1M0Y3ICovXHJcbiAgICBwb3J0OiAzMzMzLFxyXG4gICAgLyoqIFx1NjYyRlx1NTQyNlx1ODFFQVx1NTJBOFx1NjI1M1x1NUYwMFx1NkQ0Rlx1ODlDOFx1NTY2OCAqL1xyXG4gICAgb3BlbjogZmFsc2UsXHJcbiAgICAvKiogXHU4REU4XHU1N0RGXHU4QkJFXHU3RjZFXHU1MTQxXHU4QkI4ICovXHJcbiAgICBjb3JzOiB0cnVlLFxyXG4gICAgLyoqIFx1N0FFRlx1NTNFM1x1ODhBQlx1NTM2MFx1NzUyOFx1NjVGNlx1RkYwQ1x1NjYyRlx1NTQyNlx1NzZGNFx1NjNBNVx1OTAwMFx1NTFGQSAqL1xyXG4gICAgc3RyaWN0UG9ydDogZmFsc2UsXHJcbiAgICAvKiogXHU2M0E1XHU1M0UzXHU0RUUzXHU3NDA2ICovXHJcbiAgICBwcm94eToge1xyXG4gICAgICBcIi9hcGkvdjFcIjoge1xyXG4gICAgICAgIHRhcmdldDogXCJodHRwczovL21vY2sud2ViLmNvbS9tb2NrL3h4eC9hcGkvdjFcIixcclxuICAgICAgICB3czogdHJ1ZSxcclxuICAgICAgICAvKiogXHU2NjJGXHU1NDI2XHU1MTQxXHU4QkI4XHU4REU4XHU1N0RGICovXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoXCIvYXBpL3YxXCIsIFwiXCIpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICAvKiogXHU2RDg4XHU5NjY0XHU2MjUzXHU1MzA1XHU1OTI3XHU1QzBGXHU4RDg1XHU4RkM3IDUwMGtiIFx1OEI2Nlx1NTQ0QSAqL1xyXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyMDAwLFxyXG4gICAgLyoqIFZpdGUgMi42LnggXHU0RUU1XHU0RTBBXHU5NzAwXHU4OTgxXHU5MTREXHU3RjZFIG1pbmlmeTogXCJ0ZXJzZXJcIiwgdGVyc2VyT3B0aW9ucyBcdTYyNERcdTgwRkRcdTc1MUZcdTY1NDggKi9cclxuICAgIG1pbmlmeTogXCJ0ZXJzZXJcIixcclxuICAgIC8qKiBcdTU3MjhcdTYyNTNcdTUzMDVcdTRFRTNcdTc4MDFcdTY1RjZcdTc5RkJcdTk2NjQgY29uc29sZS5sb2dcdTMwMDFkZWJ1Z2dlciBcdTU0OEMgXHU2Q0U4XHU5MUNBICovXHJcbiAgICB0ZXJzZXJPcHRpb25zOiB7XHJcbiAgICAgIGNvbXByZXNzOiB7XHJcbiAgICAgICAgZHJvcF9jb25zb2xlOiBmYWxzZSxcclxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxyXG4gICAgICAgIHB1cmVfZnVuY3M6IFtcImNvbnNvbGUubG9nXCJdXHJcbiAgICAgIH0sXHJcbiAgICAgIGZvcm1hdDoge1xyXG4gICAgICAgIC8qKiBcdTUyMjBcdTk2NjRcdTZDRThcdTkxQ0EgKi9cclxuICAgICAgICBjb21tZW50czogZmFsc2VcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8qKiBcdTYyNTNcdTUzMDVcdTU0MEVcdTk3NTlcdTYwMDFcdThENDRcdTZFOTBcdTc2RUVcdTVGNTUgKi9cclxuICAgIGFzc2V0c0RpcjogXCJzdGF0aWNcIlxyXG4gIH0sXHJcbiAgLy8gVml0ZVx1NjNEMlx1NEVGNlxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgdnVlSnN4KCksXHJcbiAgICAvLyAvKiogXHU1QzA2IFNWRyBcdTk3NTlcdTYwMDFcdTU2RkVcdThGNkNcdTUzMTZcdTRFM0EgVnVlIFx1N0VDNFx1NEVGNiAqL1xyXG4gICAgc3ZnTG9hZGVyKCksXHJcbiAgICAvKiogU1ZHICovXHJcbiAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XHJcbiAgICAgIGljb25EaXJzOiBbcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIFwic3JjL2ljb25zL3N2Z1wiKV0sXHJcbiAgICAgIHN5bWJvbElkOiBcImljb24tW2Rpcl0tW25hbWVdXCJcclxuICAgIH0pLFxyXG4gICAgLyoqIFVub0NTUyAqL1xyXG4gICAgVW5vQ1NTKCksXHJcbiAgICAvLyBEZWZpbmVPcHRpb25zIFx1NTNFRlx1NEVFNVx1NjZGNFx1N0I4MFx1NTM1NVx1NzY4NFx1NkNFOFx1NTE4Q1x1N0VDNFx1NEVGNlx1NTQwRFx1NzlGMFxyXG4gICAgRGVmaW5lT3B0aW9ucygpLFxyXG4gIF0sXHJcblxyXG4gIC8qKiBWaXRlc3QgXHU1MzU1XHU1MTQzXHU2RDRCXHU4QkQ1XHU5MTREXHU3RjZFXHVGRjFBaHR0cHM6Ly9jbi52aXRlc3QuZGV2L2NvbmZpZyAqL1xyXG4gIHRlc3Q6IHtcclxuICAgIGluY2x1ZGU6IFtcInRlc3RzLyoqLyoudGVzdC50c1wiXSxcclxuICAgIGVudmlyb25tZW50OiBcImpzZG9tXCJcclxuICB9XHJcbn0pXHJcblxyXG5cclxuLy8gZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7bW9kZSwgY29tbWFuZH06IENvbmZpZ0VudikgPT4ge1xyXG4vLyBleHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKGNvbmZpZzogQ29uZmlnRW52KSA9PiB7XHJcbi8vICAgY29uc3Qgdml0ZUVudiA9IGxvYWRFbnYoY29uZmlnLm1vZGUsIHByb2Nlc3MuY3dkKCkpIGFzIEltcG9ydE1ldGFFbnZcclxuLy8gICBjb25zdCB7VklURV9QVUJMSUNfUEFUSH0gPSB2aXRlRW52XHJcbi8vICAgcmV0dXJuIHtcclxuLy8gICAgIGJhc2U6IFZJVEVfUFVCTElDX1BBVEhcclxuLy9cclxuLy8gICB9XHJcbi8vIH0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVEsb0JBQW1FO0FBQzNFLE9BQU8sVUFBcUI7QUFDNUIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixTQUFRLDRCQUEyQjtBQUNuQyxPQUFPLGVBQWU7QUFDdEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sbUJBQW1CO0FBQzFCLFlBQVksYUFBYTtBQVR6QixJQUFNLG1DQUFtQztBQWV6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUkxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUE7QUFBQTtBQUFBLE1BR0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQ3BDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBO0FBQUEsSUFFTixPQUFPO0FBQUE7QUFBQSxJQUVQLE1BQU07QUFBQTtBQUFBO0FBQUEsSUFFTixNQUFNO0FBQUE7QUFBQSxJQUVOLE1BQU07QUFBQTtBQUFBLElBRU4sTUFBTTtBQUFBO0FBQUEsSUFFTixZQUFZO0FBQUE7QUFBQSxJQUVaLE9BQU87QUFBQSxNQUNMLFdBQVc7QUFBQSxRQUNULFFBQVE7QUFBQSxRQUNSLElBQUk7QUFBQTtBQUFBLFFBRUosY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsV0FBVyxFQUFFO0FBQUEsTUFDL0M7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBO0FBQUEsSUFFTCx1QkFBdUI7QUFBQTtBQUFBLElBRXZCLFFBQVE7QUFBQTtBQUFBLElBRVIsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsZUFBZTtBQUFBLFFBQ2YsWUFBWSxDQUFDLGFBQWE7QUFBQSxNQUM1QjtBQUFBLE1BQ0EsUUFBUTtBQUFBO0FBQUEsUUFFTixVQUFVO0FBQUEsTUFDWjtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBRUEsV0FBVztBQUFBLEVBQ2I7QUFBQTtBQUFBLEVBRUEsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBO0FBQUEsSUFFUCxVQUFVO0FBQUE7QUFBQSxJQUVWLHFCQUFxQjtBQUFBLE1BQ25CLFVBQVUsQ0FBQyxLQUFLLFFBQWdCLFlBQUksR0FBRyxlQUFlLENBQUM7QUFBQSxNQUN2RCxVQUFVO0FBQUEsSUFDWixDQUFDO0FBQUE7QUFBQSxJQUVELE9BQU87QUFBQTtBQUFBLElBRVAsY0FBYztBQUFBLEVBQ2hCO0FBQUE7QUFBQSxFQUdBLE1BQU07QUFBQSxJQUNKLFNBQVMsQ0FBQyxvQkFBb0I7QUFBQSxJQUM5QixhQUFhO0FBQUEsRUFDZjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
