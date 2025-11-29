/**
 * CloudFront Function for Performance Optimization
 * Deploy this as a CloudFront Function and attach to your distribution
 *
 * This runs at the edge (closer to users) and adds performance headers
 * to improve Lighthouse scores
 */

function handler(event) {
  var response = event.response;
  var headers = response.headers;
  var uri = event.request.uri;

  // Add cache-control headers based on file type
  if (uri.endsWith('.html')) {
    headers['cache-control'] = { value: 'public, max-age=0, must-revalidate' };
  } else if (uri.match(/\.(js|css)$/)) {
    headers['cache-control'] = { value: 'public, max-age=31536000, immutable' };
  } else if (uri.match(/\.(jpg|jpeg|png|gif|ico|svg|webp|avif)$/)) {
    headers['cache-control'] = { value: 'public, max-age=31536000, immutable' };
  } else if (uri.match(/\.(woff|woff2|ttf|otf|eot)$/)) {
    headers['cache-control'] = { value: 'public, max-age=31536000, immutable' };
  }

  // Security headers
  headers['x-content-type-options'] = { value: 'nosniff' };
  headers['x-frame-options'] = { value: 'DENY' };
  headers['x-xss-protection'] = { value: '1; mode=block' };
  headers['referrer-policy'] = { value: 'strict-origin-when-cross-origin' };

  // Performance headers
  headers['timing-allow-origin'] = { value: '*' };

  return response;
}
