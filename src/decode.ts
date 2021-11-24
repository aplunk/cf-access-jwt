import { DecodedJwt } from './types.js';

/**
 * Decode a JWT into header, payload, and signature components.
 */
export function decodeJwt(token: string): DecodedJwt {
  const [header, payload, signature] = token.split('.');
  return {
    header: JSON.parse(decode(header)),
    payload: JSON.parse(decode(payload)),
    signature: decode(signature),
    raw: { header, payload, signature }
  };
}

function pad(s: string): string {
  switch (s.length % 4) {
    case 0:
      return s;
    case 2:
      return s + '==';
    case 3:
      return s + '=';
    default:
      throw 'Illegal base64url string!';
  }
}

function decode(s: string): string {
  const base64 = pad(s).replace(/_/g, '/').replace(/-/g, '+');
  return decodeUnicode(atob(base64));
}

function decodeUnicode(s: string): string {
  try {
    return decodeURIComponent(
      s.replace(/(.)/g, (_, p) => {
        const code = p.charCodeAt(0).toString(16).toUpperCase();
        if (code.length < 2) {
          return '%0' + code;
        }
        return '%' + code;
      })
    );
  } catch {
    return s;
  }
}
