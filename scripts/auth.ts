// ...existing content from 混淆产物/auth.ts...// Express 权限中间件：判断用户角色权限，否则返回 403

// 假设 getUserFromToken 是你已有的鉴权函数，返回用户对象
export function requireRole(allowedRoles: string[]) {
  return async (req, res, next) => {
    const user = await getUserFromToken(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
}
