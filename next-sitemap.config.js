/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://lottosimm.vercel.app', // 배포된 주소
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
}