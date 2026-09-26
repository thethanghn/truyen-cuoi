// jquery_ujs used to add the CSRF token to every jQuery AJAX request; keep that behaviour.
export function installCsrfToken($) {
  $.ajaxPrefilter((options, _originalOptions, xhr) => {
    if (options.crossDomain) return;
    const token = document.querySelector('meta[name="csrf-token"]')?.content;
    if (token) xhr.setRequestHeader("X-CSRF-Token", token);
  });
}
