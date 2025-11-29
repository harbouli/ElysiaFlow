import { Context } from "elysia";

/**
 * CSRF Protection Middleware
 * 
 * For cookie-based authentication, we implement CSRF protection by checking
 * the Origin and Host headers for state-changing requests (POST, PUT, DELETE, PATCH).
 * 
 * This is recommended by OWASP for cookie-based authentication:
 * https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
 */

export const csrfProtection = ({ request, set }: Context) => {
  const method = request.method.toUpperCase();
  
  // Only check CSRF for state-changing methods
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return;
  }

  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  // If there's no origin header, check referer as fallback
  if (!origin) {
    const referer = request.headers.get('referer');
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        const refererHost = refererUrl.host;
        
        if (refererHost !== host) {
          set.status = 403;
          return {
            success: false,
            message: 'CSRF validation failed: Invalid referer',
          };
        }
      } catch (error) {
        set.status = 403;
        return {
          success: false,
          message: 'CSRF validation failed: Invalid referer format',
        };
      }
    }
    // If neither origin nor referer is present, allow (for API clients like Postman)
    return;
  }

  // Extract host from origin
  try {
    const originUrl = new URL(origin);
    const originHost = originUrl.host;

    // Check if origin matches the host
    if (originHost !== host) {
      set.status = 403;
      return {
        success: false,
        message: 'CSRF validation failed: Origin does not match host',
      };
    }
  } catch (error) {
    set.status = 403;
    return {
      success: false,
      message: 'CSRF validation failed: Invalid origin format',
    };
  }
};
