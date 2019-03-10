
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
  
  
  computeDifference.addEventListener("click", function() {
    
    differenceList.innerHTML = "<h1>loading ...</h1>";
    
    var jsons = editors_json.map(function(editor) {
      
      var json = JSON.parse(editor.getValue());
      editor.setValue(JSON.stringify(json, null, 2))
      return json;
    });
    
    differenceList.innerHTML = "<pre>" + JSON.stringify(diff(jsons[0], jsons[1]), null, 2) + "</pre>";

  });
});