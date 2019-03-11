
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
      tooltips:true,
      layout: "fitColumns", //fit columns to width of table (optional)
      columns:[ //Define Table Columns
        {title:"Key Path", field:"keyPath", sorter: compareKeyPath},
        {title:"Left", field:"leftTableDisplay", formatter: "typeVal"},
        {title:"Right", field:"rightTableDisplay", formatter: "typeVal"},
        {title:"Type Different", field:"typeDifferent"},
      ],
      cellClick:function(e, row){ //trigger an alert message when the row is clicked
        var rowData = row.getData();
        Object.keys(rowDetails).forEach(function (key) {
          rowDetails[key].innerHTML = rowData[key];
        });
        
        bulma.showModal("row-details-modal");
      },
    });
    
  });
});
