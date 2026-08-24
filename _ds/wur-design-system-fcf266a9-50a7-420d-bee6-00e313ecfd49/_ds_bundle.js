/* @ds-bundle: {"format":4,"namespace":"WURDesignSystem_fcf266","components":[{"name":"Card","sourcePath":"components/content/Card.jsx"},{"name":"SectionHeading","sourcePath":"components/content/SectionHeading.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Pill","sourcePath":"components/core/Pill.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer.jsx"},{"name":"Navbar","sourcePath":"components/navigation/Navbar.jsx"}],"sourceHashes":{"components/content/Card.jsx":"4ae064d2641f","components/content/SectionHeading.jsx":"a8e0c1078f71","components/core/Button.jsx":"0431801bb40b","components/core/Pill.jsx":"64706177d31d","components/navigation/Footer.jsx":"561de85731ae","components/navigation/Navbar.jsx":"051271bb7e61","ui_kits/personal-academic-homepage/Hero.jsx":"58b069d0df2a","ui_kits/personal-academic-homepage/PublicationList.jsx":"ce6a8f1db683"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.WURDesignSystem_fcf266 = window.WURDesignSystem_fcf266 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/content/Card.jsx
try { (() => {
const THEMES = {
  biobased: '#97C600',
  water: '#88C9E4',
  health: '#FFAAAE',
  climate: '#EECF00',
  food: '#F47C00',
  institutional: '#661118'
};
function Card({
  tag = 'News',
  theme,
  title,
  summary,
  meta,
  href
}) {
  const accent = theme ? THEMES[theme] : 'var(--sand-border)';
  return React.createElement('a', {
    href: href || '#',
    style: {
      display: 'block',
      textDecoration: 'none',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-card)',
      padding: '20px',
      color: 'var(--text-primary)',
      transition: 'transform var(--dur-hover) var(--ease-standard)'
    },
    onMouseEnter: e => e.currentTarget.style.transform = 'translateY(-2px)',
    onMouseLeave: e => e.currentTarget.style.transform = 'translateY(0)'
  }, React.createElement('div', {
    style: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      background: accent,
      marginBottom: '12px'
    }
  }), React.createElement('div', {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '13px',
      fontWeight: 500,
      color: 'var(--text-muted)',
      marginBottom: '6px'
    }
  }, meta || tag), React.createElement('div', {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.35,
      marginBottom: '6px'
    }
  }, title), summary && React.createElement('div', {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '15px',
      lineHeight: 1.5,
      color: 'var(--text-muted)'
    }
  }, summary));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Card.jsx", error: String((e && e.message) || e) }); }

// components/content/SectionHeading.jsx
try { (() => {
function SectionHeading({
  eyebrow,
  title,
  align = 'left'
}) {
  return React.createElement('div', {
    style: {
      textAlign: align,
      fontFamily: 'var(--font-serif)'
    }
  }, eyebrow && React.createElement('div', {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '13px',
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--color-primary)',
      marginBottom: '8px'
    }
  }, eyebrow), React.createElement('h2', {
    style: {
      fontSize: 'var(--fs-h2)',
      lineHeight: 'var(--lh-h2)',
      fontWeight: 'var(--fw-h2)',
      color: 'var(--text-primary)',
      margin: 0
    }
  }, title));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function Button({
  variant = 'primary',
  size = 'md',
  icon = false,
  disabled = false,
  children,
  onClick,
  href
}) {
  const isGhost = variant === 'ghost';
  const pad = size === 'sm' ? '8px 18px' : size === 'lg' ? '14px 28px' : '11px 22px';
  const fontSize = size === 'sm' ? '13px' : size === 'lg' ? '16px' : '15px';
  const style = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    fontSize,
    padding: pad,
    borderRadius: 'var(--radius-pill)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: isGhost ? '1px solid var(--forest-text)' : 'none',
    background: disabled ? 'var(--border-subtle)' : isGhost ? 'transparent' : 'var(--color-primary)',
    color: disabled ? 'var(--text-muted)' : isGhost ? 'var(--forest-text)' : 'var(--text-on-brand)',
    transition: 'background var(--dur-hover) var(--ease-standard), transform var(--dur-hover) var(--ease-standard)'
  };
  const Tag = href ? 'a' : 'button';
  return React.createElement(Tag, {
    href,
    disabled,
    onClick,
    style,
    onMouseEnter: e => {
      if (disabled) return;
      e.currentTarget.style.background = isGhost ? 'rgba(0,138,0,0.08)' : 'var(--color-primary-hover)';
    },
    onMouseLeave: e => {
      if (disabled) return;
      e.currentTarget.style.background = isGhost ? 'transparent' : 'var(--color-primary)';
    }
  }, children, icon && React.createElement('span', {
    style: {
      transition: 'transform var(--dur-hover) var(--ease-standard)'
    }
  }, '→'));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Pill.jsx
try { (() => {
const THEMES = {
  biobased: '#97C600',
  water: '#88C9E4',
  health: '#FFAAAE',
  climate: '#EECF00',
  food: '#F47C00',
  institutional: '#661118',
  neutral: '#E9E1C4'
};
const DARK_TEXT = new Set(['biobased', 'water', 'health', 'climate', 'neutral']);
function Pill({
  theme = 'neutral',
  children
}) {
  const bg = THEMES[theme] || THEMES.neutral;
  return React.createElement('span', {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '13px',
      fontWeight: 500,
      padding: '6px 14px',
      borderRadius: 'var(--radius-pill)',
      background: bg,
      color: DARK_TEXT.has(theme) ? 'var(--forest-text)' : '#fff',
      display: 'inline-block'
    }
  }, children);
}
Object.assign(__ds_scope, { Pill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Pill.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Footer.jsx
try { (() => {
function Footer({
  brand = 'Wageningen University & Research',
  columns = []
}) {
  return React.createElement('footer', {
    style: {
      background: 'var(--forest-text)',
      color: 'var(--ivory-card)',
      padding: '48px 32px 24px',
      fontFamily: 'var(--font-sans)'
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      gap: '48px',
      flexWrap: 'wrap',
      marginBottom: '32px'
    }
  }, columns.map((c, i) => React.createElement('div', {
    key: i
  }, React.createElement('div', {
    style: {
      fontSize: '13px',
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      marginBottom: '12px',
      opacity: 0.8
    }
  }, c.heading), c.links.map((l, j) => React.createElement('div', {
    key: j,
    style: {
      marginBottom: '8px'
    }
  }, React.createElement('a', {
    href: l.href || '#',
    style: {
      color: 'var(--ivory-card)',
      fontSize: '14px',
      textDecoration: 'none',
      opacity: 0.9
    }
  }, l.label)))))), React.createElement('div', {
    style: {
      fontSize: '12px',
      opacity: 0.6,
      borderTop: '1px solid rgba(255,255,255,0.15)',
      paddingTop: '16px'
    }
  }, '© ' + new Date().getFullYear() + ' ' + brand));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Navbar.jsx
try { (() => {
function Navbar({
  brand = 'Wageningen University & Research',
  links = [],
  ctaLabel = 'Apply'
}) {
  return React.createElement('nav', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 32px',
      background: 'var(--bg-page)',
      fontFamily: 'var(--font-sans)'
    }
  }, React.createElement('div', {
    style: {
      fontFamily: 'var(--font-serif)',
      fontWeight: 700,
      fontSize: '20px',
      color: 'var(--color-anchor)'
    }
  }, brand), React.createElement('div', {
    style: {
      display: 'flex',
      gap: '28px',
      alignItems: 'center'
    }
  }, links.map((l, i) => React.createElement('a', {
    key: i,
    href: l.href || '#',
    style: {
      fontSize: '15px',
      fontWeight: 500,
      color: 'var(--text-primary)',
      textDecoration: 'none'
    }
  }, l.label)), React.createElement('a', {
    href: '#',
    style: {
      background: 'var(--color-primary)',
      color: '#fff',
      borderRadius: 'var(--radius-pill)',
      padding: '9px 20px',
      fontSize: '14px',
      fontWeight: 600,
      textDecoration: 'none'
    }
  }, ctaLabel)));
}
Object.assign(__ds_scope, { Navbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Navbar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/personal-academic-homepage/Hero.jsx
try { (() => {
function Hero({
  name,
  field,
  dept
}) {
  return React.createElement('section', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '48px',
      padding: '80px 64px',
      background: 'var(--bg-page)',
      flexWrap: 'wrap'
    }
  }, React.createElement('div', {
    style: {
      maxWidth: '560px'
    }
  }, React.createElement('div', {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '13px',
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--color-primary)',
      marginBottom: '16px'
    }
  }, dept + ' · Wageningen University & Research'), React.createElement('h1', {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'var(--fs-hero)',
      lineHeight: 'var(--lh-hero)',
      fontWeight: 700,
      color: 'var(--text-primary)',
      margin: '0 0 20px'
    }
  }, name), React.createElement('p', {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '19px',
      lineHeight: 1.5,
      color: 'var(--text-muted)',
      margin: '0 0 32px'
    }
  }, 'I study ' + field.toLowerCase() + ' — how microscale interactions scale up into resilient, sustainable ecosystems.'), React.createElement('div', {
    style: {
      display: 'flex',
      gap: '12px'
    }
  }, React.createElement(window.WURDesignSystem_fcf266.Button, {
    variant: 'primary',
    icon: true
  }, 'View publications'), React.createElement(window.WURDesignSystem_fcf266.Button, {
    variant: 'ghost'
  }, 'Contact'))), React.createElement('div', {
    style: {
      width: '280px',
      height: '280px',
      flexShrink: 0,
      borderRadius: 'var(--radius-card)',
      background: '#88C9E4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      fontSize: '16px',
      color: 'var(--forest-text)',
      opacity: 0.6
    }
  }, 'Photo'));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/personal-academic-homepage/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/personal-academic-homepage/PublicationList.jsx
try { (() => {
function PublicationList({
  items
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0'
    }
  }, items.map((p, i) => React.createElement('div', {
    key: i,
    style: {
      display: 'flex',
      gap: '20px',
      padding: '20px 0',
      borderBottom: i < items.length - 1 ? '1px solid var(--border-subtle)' : 'none'
    }
  }, React.createElement('div', {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '14px',
      fontWeight: 600,
      color: 'var(--text-muted)',
      width: '56px',
      flexShrink: 0
    }
  }, p.year), React.createElement('div', null, React.createElement('div', {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: '18px',
      fontWeight: 600,
      color: 'var(--text-primary)',
      marginBottom: '4px'
    }
  }, p.title), React.createElement('div', {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '14px',
      color: 'var(--text-muted)',
      marginBottom: '8px'
    }
  }, p.venue), React.createElement(window.WURDesignSystem_fcf266.Pill, {
    theme: p.theme
  }, p.tag)))));
}
window.PublicationList = PublicationList;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/personal-academic-homepage/PublicationList.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Card = __ds_scope.Card;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Pill = __ds_scope.Pill;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.Navbar = __ds_scope.Navbar;

})();
