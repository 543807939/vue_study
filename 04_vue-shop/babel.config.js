// 项目发布阶段用到的配置
const prodPlugins = []
// 如果是发布阶段 则删除console
if (process.env.NODE_ENV == 'production') {
  prodPlugins.push("transform-remove-console")
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    // "transform-remove-console"
    "@babel/plugin-syntax-dynamic-import",
    ...prodPlugins
  ]

}
