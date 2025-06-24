# Vercel Deployment Guide

## 部署步骤

1. **确保代码已推送到GitHub**
   ```bash
   git add .
   git commit -m "Fix Suspense boundary for useSearchParams"
   git push origin main
   ```

2. **在Vercel上部署**
   - 访问 [vercel.com](https://vercel.com)
   - 登录并点击 "New Project"
   - 导入你的GitHub仓库: `Zforcematriks/malaysia-petrol-stations`
   - 选择 "Next.js" 框架
   - 点击 "Deploy"

## 部署后的公用API网址

部署成功后，您将获得类似以下的公用网址：

```
https://your-project-name.vercel.app
```

### 可用的API端点：

1. **燃油价格**
   ```
   https://your-project-name.vercel.app/api/fuel-prices
   ```

2. **所有加油站**
   ```
   https://your-project-name.vercel.app/api/stations
   https://your-project-name.vercel.app/api/stations?brand=petronas&limit=10
   ```

3. **按品牌分组**
   ```
   https://your-project-name.vercel.app/api/stations/brands
   ```

4. **按地区分组**
   ```
   https://your-project-name.vercel.app/api/stations/areas
   https://your-project-name.vercel.app/api/stations/areas?state=selangor
   ```

5. **统计信息**
   ```
   https://your-project-name.vercel.app/api/stations/stats
   ```

6. **搜索功能**
   ```
   https://your-project-name.vercel.app/api/stations/search?q=kuala%20lumpur&limit=10
   ```

## 测试API

部署完成后，您可以访问以下页面测试API：

- **API文档**: `https://your-project-name.vercel.app/api/docs`
- **API测试**: `https://your-project-name.vercel.app/api/test`

## 注意事项

- 确保 `stations.json` 文件在 `public` 目录中
- API会自动从马来西亚政府数据源获取最新的燃油价格
- 所有API端点都返回JSON格式的数据 