
document.addEventListener('DOMContentLoaded', function () {
  function _typeof(obj) { 
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { 
        _typeof = function _typeof(obj) { 
          return typeof obj; 
        }; 
    } 
    else { 
      _typeof = function _typeof(obj) { 
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; 
      }; 
    } 
    
    return _typeof(obj); 
  }
    
  var textAreas = 
  [
    {
      id: "json-left",
      valid: false,
      error: document.getElementById("json-left-error")      
    },
    {
      id: "json-right",
      valid: false,
      error: document.getElementById("json-right-error")     
    }
  ];

  var computeDifference = document.getElementById("compute-difference");
  var rowDetails = {
    keyPath: document.getElementById("key-path"),
    leftVal: document.getElementById("left-val"),
    leftType: document.getElementById("left-type"),
    rightVal: document.getElementById("right-val"),
    rightType: document.getElementById("right-type")    
  }; 
  
  editors_json = textAreas.map(function(textArea, index, array){
      return CodeMirror.fromTextArea(document.getElementById(textArea.id), {
        lineNumbers: true,
        mode: "application/json",
        gutters: ["CodeMirror-lint-markers"],
        lint: {
          onUpdateLinting: function(annotationsNotSorted, annotations, cm) {
            
            textArea.valid = annotationsNotSorted.length === 0;
            
            textArea.error.innerText = textArea.valid ? "" : annotationsNotSorted[0].message;
            
            if (array.some(function(x) {return !x.valid})){
              computeDifference.setAttribute("disabled","");
            } else {
              computeDifference.removeAttribute("disabled");        
            }
          }
        }
      });
  });
  
  Tabulator.prototype.extendModule("format", "formatters", {
    typeVal:function(cell, formatterParams){
        var cellVal = cell.getValue();
        return "("+ cellVal.type + ") <strong>" + cellVal.val + "</strong>"; 
    }
  });
  
  computeDifference.addEventListener("click", function() {
    
    
    var jsons = editors_json.map(function(editor) {
      
      var json = editor.getValue();
      editor.setValue(JSON.stringify(JSON.parse(json), null, 2))
      return json;
    });
    
    bulma.showModal("modal-difference")
    
    var table = new Tabulator("#difference-list", {
      height: "auto", 
      data: diff(jsons[0], jsons[1]),
      tooltips:function(cell){
        var cellVal = cell.getValue();
        return  _typeof(cellVal) === "object" ? "("+ cellVal.type + ") " + cellVal.val : cellVal;
      },
      layout: "fitColumns", //fit columns to width of table (optional)
      columns:[ //Define Table Columns
        {title:"Key Path", field:"keyPath", sorter: compareKeyPath},
        {title:"Left", field:"leftTableDisplay", formatter: "typeVal"},
        {title:"Right", field:"rightTableDisplay", formatter: "typeVal"},
        {title:"Data Type Different", field:"typeDifferent"},
      ],
      cellClick:function(e, row){ //trigger an alert message when the row is clicked
        var rowData = row.getData();
        Object.keys(rowDetails).forEach(function (key) {
          rowDetails[key].innerText = rowData[key];
        });
        
        bulma.showModal("row-details-modal");
      },
    });
    
  });
});
