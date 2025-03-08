export function ThemeSwitchScript() {
  return (
    <script>
      {`(function () {
          let theme = localStorage.getItem('theme');
          const supp = ['dark','light'];
          theme = supp.includes(theme) ? theme : null;
          document.documentElement.setAttribute('data-theme', theme || 'system');
      })();`}
    </script>
  )
}
