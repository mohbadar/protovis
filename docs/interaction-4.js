new pv.Panel()
    .width(200)
    .height(200)
  .add(pv.Image)
    .url("http://vis.stanford.edu/protovis/ex/stanford.png")
    .cursor("pointer")
    .title("Go to stanford.edu")
    .event("mouseover", function() self.status = "Go to \"http://stanford.edu\"")
    .event("mouseout", function() self.status = "")
    .event("click", function() self.location = "http://stanford.edu")
  .root.render();    