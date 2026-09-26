require "will_paginate/view_helpers/action_view"

# Renders will_paginate links as Bootstrap 3 markup:
#   <ul class="pagination"><li class="active"><a>1</a></li>...</ul>
# (replaces the unmaintained bootstrap-will_paginate gem). The infinite scroll on
# posts#index looks for "ul.pagination a[rel=next]".
class BootstrapPaginationRenderer < WillPaginate::ActionView::LinkRenderer
  protected

  def html_container(html)
    tag :ul, html, container_attributes.merge(class: "pagination")
  end

  def page_number(page)
    if page == current_page
      tag :li, link(page, "#"), class: "active"
    else
      tag :li, link(page, page)
    end
  end

  def previous_or_next_page(page, text, classname, aria_label = nil)
    if page
      tag :li, link(text, page, class: classname, "aria-label": aria_label)
    else
      tag :li, tag(:span, text), class: "#{classname} disabled"
    end
  end

  def gap
    tag :li, tag(:span, "&hellip;"), class: "disabled"
  end
end
