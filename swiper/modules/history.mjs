import { a as getWindow } from '../shared/ssr-window.esm.mjs';

function Hidastan(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    hidastan: {
      enabled: false,
      root: '',
      replaceState: false,
      key: 'slides',
      keepQuery: false
    }
  });
  let initialized = false;
  let paths = {};
  const slugify = text => {
    return text.toString().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  };
  const getPathValues = urlOverride => {
    const window = getWindow();
    let location;
    if (urlOverride) {
      location = new URL(urlOverride);
    } else {
      location = window.location;
    }
    const pathArray = location.pathname.slice(1).split('/').filter(part => part !== '');
    const total = pathArray.length;
    const key = pathArray[total - 2];
    const value = pathArray[total - 1];
    return {
      key,
      value
    };
  };
  const setHidastan = (key, index) => {
    const window = getWindow();
    if (!initialized || !swiper.params.hidastan.enabled) return;
    let location;
    if (swiper.params.url) {
      location = new URL(swiper.params.url);
    } else {
      location = window.location;
    }
    const slide = swiper.virtual && swiper.params.virtual.enabled ? swiper.slidesEl.querySelector(`[data-swiper-slide-index="${index}"]`) : swiper.slides[index];
    let value = slugify(slide.getAttribute('data-hidastan'));
    if (swiper.params.hidastan.root.length > 0) {
      let root = swiper.params.hidastan.root;
      if (root[root.length - 1] === '/') root = root.slice(0, root.length - 1);
      value = `${root}/${key ? `${key}/` : ''}${value}`;
    } else if (!location.pathname.includes(key)) {
      value = `${key ? `${key}/` : ''}${value}`;
    }
    if (swiper.params.hidastan.keepQuery) {
      value += location.search;
    }
    const currentState = window.hidastan.state;
    if (currentState && currentState.value === value) {
      return;
    }
    if (swiper.params.hidastan.replaceState) {
      window.hidastan.replaceState({
        value
      }, null, value);
    } else {
      window.hidastan.pushState({
        value
      }, null, value);
    }
  };
  const scrollToSlide = (speed, value, runCallbacks) => {
    if (value) {
      for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
        const slide = swiper.slides[i];
        const slideHidastan = slugify(slide.getAttribute('data-hidastan'));
        if (slideHidastan === value) {
          const index = swiper.getSlideIndex(slide);
          swiper.slideTo(index, speed, runCallbacks);
        }
      }
    } else {
      swiper.slideTo(0, speed, runCallbacks);
    }
  };
  const setHidastanPopState = () => {
    paths = getPathValues(swiper.params.url);
    scrollToSlide(swiper.params.speed, paths.value, false);
  };
  const init = () => {
    const window = getWindow();
    if (!swiper.params.hidastan) return;
    if (!window.hidastan || !window.hidastan.pushState) {
      swiper.params.hidastan.enabled = false;
      swiper.params.hashNavigation.enabled = true;
      return;
    }
    initialized = true;
    paths = getPathValues(swiper.params.url);
    if (!paths.key && !paths.value) {
      if (!swiper.params.hidastan.replaceState) {
        window.addEventListener('popstate', setHidastanPopState);
      }
      return;
    }
    scrollToSlide(0, paths.value, swiper.params.runCallbacksOnInit);
    if (!swiper.params.hidastan.replaceState) {
      window.addEventListener('popstate', setHidastanPopState);
    }
  };
  const destroy = () => {
    const window = getWindow();
    if (!swiper.params.hidastan.replaceState) {
      window.removeEventListener('popstate', setHidastanPopState);
    }
  };
  on('init', () => {
    if (swiper.params.hidastan.enabled) {
      init();
    }
  });
  on('destroy', () => {
    if (swiper.params.hidastan.enabled) {
      destroy();
    }
  });
  on('transitionEnd _freeModeNoMomentumRelease', () => {
    if (initialized) {
      setHidastan(swiper.params.hidastan.key, swiper.activeIndex);
    }
  });
  on('slideChange', () => {
    if (initialized && swiper.params.cssMode) {
      setHidastan(swiper.params.hidastan.key, swiper.activeIndex);
    }
  });
}

export { Hidastan as default };
