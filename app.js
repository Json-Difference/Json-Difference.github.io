
var app = {
  left: false,
  right: false,
  updateElement: (elementId, text) => {
    document.getElementById(elementId).textContent = text
  },
  disableCompare: () => {
    
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


document.addEventListener('DOMContentLoaded', function () {
  
    
  var textAreas = 
  [
    {
      id: "json-left",
      valid: false    
    },
    {
      id: "json-right",
      valid: false
    }
  ];

  var computeDifference = document.getElementById("compute-difference");
  var differenceList = document.getElementById("difference-list");
  
  computeDifference.addEventListener("click", function(){
    differenceList.innerHTML = "<h1>loading ...</h1>";
    
  })
  
  editors_json = textAreas.map(function(textArea, index, array){
      return CodeMirror.fromTextArea(document.getElementById(textArea.id), {
        lineNumbers: true,
        mode: "application/json",
        gutters: ["CodeMirror-lint-markers"],
        lint: {
          onUpdateLinting: function(annotationsNotSorted, annotations, cm) {
            
            textArea.valid = annotationsNotSorted.length === 0;
            
            if (array.some(function(x) {return !x.valid})){
              computeDifference.setAttribute("disabled","");
            } else {
              computeDifference.removeAttribute("disabled");        
            }
          }
        }
      });
  });
});