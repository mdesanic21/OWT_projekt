document.addEventListener("DOMContentLoaded", StartFunct);

let zapis = [];

function StartFunct() {
    const rows = document.querySelectorAll('#tablica tr');
    rows.forEach(row => {
      row.addEventListener('mouseover', prikazi);
    })
  };
  
function prikazi() {
      var cel = Array.from(this.querySelectorAll('td,th'));
      if (window.innerWidth <= 480) {
        var noviZapis = cel.map(cell => cell.textContent).join(',');
        if (zapis.indexOf(noviZapis) === -1) {
          zapis.push(noviZapis);
          document.getElementById("info").innerHTML += "<br>";
          document.getElementById("info").innerHTML += noviZapis;
        }
      }
    }

document.addEventListener("DOMContentLoaded", function(){
    
    var rotirajuci = document.getElementById("ponuda_slika_grcka");
    var boje = document.getElementById("ponuda-turska");
    var kretajuci = document.getElementById("ponuda_slika_egipat");
  
    rotirajuci.addEventListener("click", function() {
      rotateElement(rotirajuci);
    });
  
    function rotateElement(element) {
      var rotation = 0;
  
      function rotate() {
        rotation += 1;
        element.style.transform = "rotate(" + rotation + "deg)";
  
        if (rotation < 360) {
          setTimeout(rotate, 10);
        }
      }
  
      rotate();
    }
  
    var colors = ["red", "blue", "green", "yellow"];
    var colorIndex = 0;
  
    function changeBackground() {
      boje.style.backgroundColor = colors[colorIndex];
      colorIndex = (colorIndex + 1) % colors.length;
  
      setTimeout(changeBackground, 1000);
    }
  
    changeBackground();
  
    kretajuci.addEventListener("click", function() {
      moveElement(kretajuci);
    });
  
    function moveElement(element) {
        var position = 0;
        var direction = 1; 
      
        function move() {
          position += 10 * direction;
          element.style.top = position + "px";
      
          if (position >= 500) {
            direction = -1; 
          } else if (position <= 0) {
            direction = 1;
          }
      
          setTimeout(move, 50);
        }
      
        move();
      }

  });
