
var app = {
  left: false,
  right: false,
  updateElement: (elementId, text) => {
    document.getElementById(elementId).textContent = text
  },
  disableCompare: () => {
    document.getElementById("compare").setAttribute("disabled", "");
  },
  enableCompare: () => {
    app.left && app.right && document.getElementById("compare").removeAttribute("disabled");
  },
  updateLeft: (value) => {
    
    app.updateElement("errLeft","");
    
    try {
      app.left = JSON.parse(value);
    }
    catch(err){
      app.left = false;
      app.disableCompare();
      app.updateElement("errLeft", err);
    }
    
    app.enableCompare();
  },
  updateRight: (value) => {
    
    app.updateElement("errRight", "");
    
    try {
      app.right = JSON.parse(value);
    }
    catch(err){
      app.right = false;
      app.disableCompare();
      app.updateElement("errRight", err);
    }
    
    app.enableCompare();
  }  
}