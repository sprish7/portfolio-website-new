const root = document.documentElement;
const theme = document.querySelector('#theme');
const menu = document.querySelector('#menu');
const navigation = document.querySelector('#navigation');
const small = matchMedia('(max-width:720px)');
const dark = matchMedia('(prefers-color-scheme:dark)');
try {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
} catch {}
theme.hidden = false;
function syncTheme() {
  const current = root.dataset.theme || (dark.matches ? 'dark' : 'light');
  theme.setAttribute('aria-label', 'Switch to ' + (current === 'dark' ? 'light' : 'dark') + ' mode');
}
syncTheme();
dark.addEventListener('change', syncTheme);
theme.addEventListener('click', () => {
  const current = root.dataset.theme || (dark.matches ? 'dark' : 'light');
  root.dataset.theme = current === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch {}
  syncTheme();
});
function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  navigation.dataset.collapsed = String(small.matches && !open);
}
function syncMenu() {
  menu.hidden = !small.matches;
  setMenu(false);
}
syncMenu();
small.addEventListener('change', syncMenu);
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', event => {
  if (small.matches && event.target.closest('a')) {
    const section = document.querySelector(event.target.hash);
    setMenu(false);
    if (section) {
      section.tabIndex = -1;
      section.focus({preventScroll:true});
    }
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menu.focus();
  }
});
