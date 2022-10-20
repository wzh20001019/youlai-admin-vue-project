import { UserConfig, ConfigEnv, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// @see: https://gitee.com/holysheng/vite2-config-description/blob/master/vite.config.ts
export default ({ mode }: ConfigEnv): UserConfig => {
  // 获取 .env 环境配置文件
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
    // 本地反向代理解决浏览器跨域限制
    server: {
      host: 'localhost',
      // port: Number(env.VITE_APP_PORT),
      port: 9000,

      // 运行自动打开浏览器
      open: true,
      proxy: {
        // .env 文件配置(测试, 开发, 生产)
        [env.VITE_APP_BASE_API]: {
          // 代理地址
          // target: 'http://192.168.100.108:9999',
          target: '192.168.100.108:8801/yx-admin/',
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(new RegExp('^' + env.VITE_APP_BASE_API), ''),
        },
      },
    },
    resolve: {
      // Vite路径别名配置
      alias: {
        '@': path.resolve('./src'), // @代替src
      },
    },
  }
}
