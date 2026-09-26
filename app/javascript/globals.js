// Libraries the page scripts (inline <script> blocks and app/assets/javascripts/*)
// expect to find on window. Imported first so jQuery plugins can see window.jQuery.
import jQuery from "jquery";
import * as d3 from "d3";
import Rx from "rx/dist/rx.all.js";
import moment from "moment";

window.jQuery = window.$ = jQuery;
window.d3 = d3.default || d3;
window.Rx = Rx;
window.moment = moment;

// Rx 4's ofArrayChanges relied on Array.observe, which browsers removed in 2016.
// The blackjack page only needs "an item was pushed" notifications, so emulate
// those by wrapping push() on the observed array.
if (typeof Array.observe !== "function") {
  Rx.Observable.ofArrayChanges = function (array) {
    return Rx.Observable.create((observer) => {
      const originalPush = array.push;
      array.push = function (...items) {
        const index = this.length;
        const result = originalPush.apply(this, items);
        queueMicrotask(() =>
          observer.onNext({ type: "splice", object: this, index, removed: [], addedCount: items.length })
        );
        return result;
      };
      return () => {
        array.push = originalPush;
      };
    });
  };
}
