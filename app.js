var app = angular.module('plunker', []);
app.controller('MainCtrl', function ($scope) {
  $scope.getData = function (data) {
    var dataToPrint = []
    data.forEach(element => {
      var newOpts = [];

      element.options.forEach((opt, key) => {
        if (opt.isSelected) {
          newOpts.push(opt.optionName);
        }
      })
      // model: item.model.replace(/,/g, ''), // remove commas to avoid errors,
      dataToPrint.push({
        title: element.title,
        description: element.description,
        options: newOpts
      });
    })
    var headers = {
      title: "title",
      description: "description",
      options: "Selected Options",
    };
    var fileTitle = 'new file'; // or 'my-unique-title'
    exportCSVFile(headers, dataToPrint, fileTitle);
  }
  $scope.dataLength = 0;
  $scope.currentIndex = 0;
  $scope.nextClick = function () {
    if ($scope.currentIndex >= 0) {
      $scope.currentIndex += 1;
    }
  };

  $scope.prevClick = function () {
    if ($scope.currentIndex >= 1) {
      $scope.currentIndex -= 1;
    }
  };


  function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
      items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilenmae);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','

        line += array[i][index];
      }

      str += line + '\r\n';
    }

    return str;
  }


}); //controller end line

app.directive('fileReader', function () {
  return {
    scope: {
      fileReader: "="
    },
    link: function (scope, element) {
      $(element).on('change', function (changeEvent) {
        var files = changeEvent.target.files;

        if (files.length) {
          var r = new FileReader();
          r.onload = function (e) {
            var contents = e.target.result;
            var dataArray = JSON.parse(process(contents));

            // var dataArray = e.target.result.split("\n");
            var finalArray = [];

            dataArray.forEach(element => {
              element.options = [
                { optionName: "Blue collar", isSelected: false },
                { optionName: "Grey collar", isSelected: false },
                { optionName: "White collar", isSelected: false },
                { optionName: "IT services", isSelected: false },
                { optionName: "Software products", isSelected: false },
                { optionName: "Engineering", isSelected: false },
                { optionName: "Healthcare", isSelected: false },
                { optionName: "Manufacturing", isSelected: false },
                { optionName: "Banking / Financial services", isSelected: false },
                { optionName: "BPO", isSelected: false },
                { optionName: "Legal", isSelected: false },
                { optionName: "FMCG", isSelected: false },
                { optionName: "Telecommunication", isSelected: false },
                { optionName: "Logistics and transportation", isSelected: false },
                { optionName: "Marketing and Sales", isSelected: false },
                { optionName: "AI / Data science", isSelected: false },
                { optionName: "Other emerging fields", isSelected: false }
              ]

              // finalArray.push({
              //   title: element.title, 
              //   description: element.description, 
              //   options: [
              //     { optionName: "Blue collar", isSelected: false },
              //     { optionName: "Grey collar", isSelected: false },
              //     { optionName: "White collar", isSelected: false },
              //     { optionName: "IT services", isSelected: false },
              //     { optionName: "Software products", isSelected: false },
              //     { optionName: "Engineering", isSelected: false },
              //     { optionName: "Healthcare", isSelected: false },
              //     { optionName: "Manufacturing", isSelected: false },
              //     { optionName: "Banking / Financial services", isSelected: false },
              //     { optionName: "BPO", isSelected: false },
              //     { optionName: "Legal", isSelected: false },
              //     { optionName: "FMCG", isSelected: false },
              //     { optionName: "Telecommunication", isSelected: false },
              //     { optionName: "Logistics and transportation", isSelected: false },
              //     { optionName: "Marketing and Sales", isSelected: false },
              //     { optionName: "AI / Data science", isSelected: false },
              //     { optionName: "Other emerging fields", isSelected: false }
              //   ]
              // })

            });
            dataArray.pop();
            // finalArray.pop();

            scope.$apply(function () {
              // scope.fileReader = finalArray;
              scope.fileReader = dataArray;
            });
          };

          r.readAsText(files[0]);
        }




        function process(dataString) {
          var lines = dataString
            .split(/\r\n/)
            .map(function (lineStr) {
              return lineStr.split(",");
            });

          var keys = lines[0];

          var objects = lines
            .slice(1)
            .map(function (arr) {
              return arr.reduce(function (obj, val, i) {
                obj[keys[i]] = val;
                return obj;
              }, {});
            });

          return JSON.stringify(objects, null, 2);
        }




      });
    }
  };
});