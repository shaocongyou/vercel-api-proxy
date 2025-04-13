export default async (req) => {
    try {
      const url = new URL(req.url);
      let targetUrl = url.pathname;
      let protocol;
  
      // 提取协议和路径
      if (targetUrl.startsWith('/https/')) {
        protocol = 'https://';
        targetUrl = targetUrl.slice(7); // 移除 /https/
      } else if (targetUrl.startsWith('/http/')) {
        protocol = 'http://';
        targetUrl = targetUrl.slice(6); // 移除 /http/
      } else {
        return new Response('Invalid URL: Must start with /http/ or /https/', { status: 400 });
      }
  
      // 拼接目标 URL
      targetUrl = `${protocol}${targetUrl}${url.search}`;
      // 清理多余斜杠
      targetUrl = targetUrl.replace(/\/+/g, '/').replace(':/', '://');
  
      // 发起代理请求
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: {
          ...req.headers,
          host: new URL(targetUrl).host, // 设置正确的 host
        },
        body: req.body,
        redirect: 'manual', // 避免自动重定向
      });
  
      // 返回响应
      return new Response(response.body, {
        status: response.status,
        headers: response.headers,
      });
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  };