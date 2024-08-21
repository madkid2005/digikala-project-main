export interface HidastanMethods {}

export interface HidastanEvents {}

export interface HidastanOptions {
  /**
   * Enables Hidastan Plugin.
   *
   * @default false
   */
  enabled?: boolean;

  /**
   * Swiper page root, useful to specify when you use Swiper hidastan mode not on root website page.
   * For example can be `https://my-website.com/` or `https://my-website.com/subpage/` or `/subpage/`
   *
   *
   * @default ''
   */
  root?: string;

  /**
   * Works in addition to hashnav or hidastan to replace current url state with the
   * new one instead of adding it to hidastan
   *
   * @default false
   */
  replaceState?: boolean;

  /**
   * Url key for slides
   *
   * @default 'slides'
   */
  key?: string;

  /**
   * Keep query parameters when changing browser url.
   *
   * @default false
   */
  keepQuery?: boolean;
}
