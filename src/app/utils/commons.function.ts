import * as moment from 'moment';
import * as uuid from 'uuid';

/**
 *
 * @param route ruta a navegar
 * @param params parametros que deben tener el mismo nombre de la ruta EJ: /:parmVar -> {parmVar: 'value'}
 */
export function pathRoute(routes: string[], params?: any): string {
  let route = '/' + routes.map((r) => r).join('/');
  if (!params) {
    return route;
  }
  for (const [key, value] of Object.entries(params) as any[]) {
    console.log(value);
    route = route.replace(`:${key}`, value);
  }
  return route;
}

export function generateOrderID(): string {
  return moment().format('HHmmssSSS');
}

export function utf8_to_b64(str: string): string {
  return window.btoa(unescape(encodeURIComponent(str)));
}

export function b64_to_utf8(str: string): string {
  return decodeURIComponent(escape(window.atob(str)));
}

export function generateID(): string {
  return uuid.v4();
}