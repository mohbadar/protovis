pv.SvgScene.panel = function(scenes) {
  var parent = this.parentNode(scenes);
  for (var i = 0; i < scenes.length; i++) {
    var s = scenes[i];

    /* visible */
    if (!s.visible) continue;

    /* svg */
    if (!parent) {
      if (i && s.canvas.firstChild) {
        var svg = s.canvas.firstChild;
      } else {
        while (s.canvas.firstChild) s.canvas.removeChild(s.canvas.firstChild);
        var svg = s.canvas.appendChild(this.cache(s, "svg", "svg"));
        svg.setAttribute("width", s.width + s.left + s.right);
        svg.setAttribute("height", s.height + s.top + s.bottom);
        svg.onclick
            = svg.onmousedown
            = svg.onmouseup
            = svg.onmousemove
            = svg.onmouseout
            = svg.onmouseover
            = pv.SvgScene.dispatch;
      }
    }

    /* g */
    var g = this.cache(s, "g", "g");
    g.setAttribute("transform", "translate(" + s.left + "," + s.top + ")");

    /* fill */
    var fill = pv.color(s.fillStyle);
    if (fill.opacity || s.cursor || s.title) {
      var rect = this.cache(s, "rect", "fill");
      rect.setAttribute("width", s.width);
      rect.setAttribute("height", s.height);
      rect.setAttribute("cursor", s.cursor);
      rect.setAttribute("pointer-events", "all");
      rect.setAttribute("fill", fill.color);
      rect.setAttribute("fill-opacity", fill.opacity);
      g.appendChild(s.scene.fillTitle = this.title(rect, s));

      /* events */
      this.listen(rect, scenes, i);
    }

    /* children */
    for (var j = 0; j < s.children.length; j++) {
      this.updateAll(s.children[j]);
    }

    /* stroke */
    var stroke = pv.color(s.strokeStyle);
    if (stroke.opacity) {
      var rect = this.cache(s, "rect", "stroke");
      rect.setAttribute("width", Math.max(1E-10, s.width));
      rect.setAttribute("height", Math.max(1E-10, s.height));
      rect.setAttribute("cursor", s.cursor);
      rect.setAttribute("fill", "none");
      rect.setAttribute("stroke", stroke.color);
      rect.setAttribute("stroke-opacity", stroke.opacity);
      rect.setAttribute("stroke-width", s.lineWidth);
      g.appendChild(s.scene.strokeTitle = this.title(rect, s));

      /* events */
      this.listen(rect, scenes, i);
    }

    /*
     * WebKit appears has a bug where images are not rendered if the g element
     * is appended before it contained any elements. Creating the child elements
     * first and then appending them solves the problem and is more efficient.
     */
    (parent || svg).appendChild(g);
  }
};

/**
 * Updates the display for the children of the specified panel node.
 *
 * @param s a panel scene node.
 */
pv.SvgScene.updateChildren = function(s) {
  var g = this.cache(s, "g", "g");
  if (s.scene.fillTitle) {
    g.appendChild(s.scene.fillTitle);
  }
  for (var j = 0; j < s.children.length; j++) {
    this.updateAll(s.children[j]);
  }
  if (s.scene.strokeTitle) {
    g.appendChild(s.scene.strokeTitle);
  }
};