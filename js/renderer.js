window.initRDKitModule().then(function (instance) {
  RDKitModule = instance;
});

function draw_molecules() {
  $('.mol_images').each(function() {
      var mol = RDKitModule.get_mol($(this).text());
      mol.draw_to_canvas($(this)[0], -1, -1);
  });
}

var app = new Vue({
  el: '#app',
  data: {
      loadFile: true,
      molecules: [],
      filter: []
  },
    methods: {
        onChange: function(filter) {
            var filtered_molecules = initial_molecules;
            filter.forEach(function(element) {
                if (element == "like") {
                    filtered_molecules = filtered_molecules.filter(mol => mol.liked);
                } else if (element == "dislike") {
                    filtered_molecules = filtered_molecules.filter(mol => mol.disliked);
                } else {
                    filtered_molecules = filtered_molecules.filter(mol => mol.tags.includes(element));
                }
            }); 
            app.molecules = filtered_molecules;
            this.$nextTick(function() {
                draw_molecules();
            });
        }
    }
});

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function() {
    initial_molecules = JSON.parse(reader.result).molecules;
    app.molecules = initial_molecules;
    app.$nextTick(function() {
        draw_molecules();
    });
  };
  reader.readAsText(file);
  app.loadFile = false;
}

document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('file-input')
    .addEventListener('change', readSingleFile, false);
});
