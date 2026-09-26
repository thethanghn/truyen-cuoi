import "./globals";

// Bootstrap 3 plugins (dropdowns, popovers, alerts) and other jQuery plugins.
import "bootstrap-sass/assets/javascripts/bootstrap.js";
// jQuery UI's files only register on the global jQuery, so load draggable's dependencies first.
import "jquery-ui/ui/version.js";
import "jquery-ui/ui/data.js";
import "jquery-ui/ui/plugin.js";
import "jquery-ui/ui/scroll-parent.js";
import "jquery-ui/ui/widget.js";
import "jquery-ui/ui/widgets/mouse.js";
import "jquery-ui/ui/widgets/draggable.js";
import "./vendor/fuelux.min.js";

import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";
import jQueryBridget from "jquery-bridget";

// Rich text editor for the admin post form (replaces bootstrap-wysihtml5).
import "trix";

import { mount } from "./components";
import { installCsrfToken } from "./csrf";
import { infinitePosts } from "./infinite_posts";

jQueryBridget("masonry", Masonry, window.jQuery);
imagesLoaded.makeJQueryPlugin(window.jQuery);
installCsrfToken(window.jQuery);

// Page scripts render React components with TruyenCuoi.mount("RoomList", element, props).
window.TruyenCuoi = { mount, infinitePosts };
