const info=document.getElementById("info_container");
const select=document.querySelectorAll("polygon");
let last_selected=null;
select.forEach(a_=>{
    a_.addEventListener("click",()=>{
        if(last_selected)
        {
            last_selected.style.stroke="none";
        }
        a_.style.stroke="rgb(53, 53, 212)";
        a_.style.strokeWidth="2";
        last_selected=a_;
        info.innerHTML=`<h1 style="color:white">${a_.dataset.title}</h1>
        <h2 style="color:white">${a_.dataset.desc}</h2>
        `
    });
});

const Address={
"1": { x: 337, y: 435 },
  "2": { x: 582, y: 302 },
  "3": { x: 571, y: 111 },
  "4": { x: 553, y: 569 },
  "5": { x: 820, y: 440 },
  "6": { x: 1092, y: 275 },
  "7": { x: 893, y: 607 },
  "8": { x: 1251, y: 526 },
  "9": { x: 1143, y: 465 },
  "A1": { x: 457, y: 367 },
  "A2": { x: 710, y: 250 },
  "A3": { x: 515, y: 134 },
  "A4": { x: 716, y: 489 }, 
  "A5": { x: 949, y: 372 }
};

const route={
"1":["A1"],
"2":["A1","A2"],
"3":["A3"],
"4":["A4"],
"5":["A4","A5"],
"6":["A5"],
"7":["A4"],
"8":["9"],
"9":["A5","8"],
"A1":["A4","2"],
"A2":["2","A3","A5"],
"A3":["A2", "3"],
"A4":["A1","4","5","7"],
"A5":["5","6","9","A2"]
};
const navigation_button = document.getElementById("navigate");
const startId = document.getElementById("start");
const destinationId = document.getElementById("_destination");
const line = document.getElementById("navigation");

navigation_button.onclick = function() {
    const start = startId.value;
    const end = destinationId.value;

    const path = findShortestPath(start, end);

    if (path) {
        const coords = path.map(id => {
            const pt = Address[id];
            return `${pt.x},${pt.y}`;
        }).join(" ");
        
        line.setAttribute("points", coords);
        console.log("Path Found:", path);
    } else {
        console.log("No path found");
        line.setAttribute("points", "");
    }
};

function findShortestPath(startNode, endNode) {
    let queue = [[startNode]];
    let visited = new Set();

    while (queue.length > 0) {
        let path = queue.shift();
        let node = path[path.length - 1];

        if (node === endNode) return path;

        if (!visited.has(node)) {
            visited.add(node);
            let neighbors = route[node] || [];
            for (let neighbor of neighbors) {
                let newPath = [...path, neighbor];
                queue.push(newPath);
            }
        }
    }
    return null;
}
//1-A1   A1-A4,2  2-A2,A1  A4-A1,4,5,7 A2-2,A3,A5 4-A4  5-A4,A5  7-A4  A3-A2,3  A5-5,6,9,A2  3-A3  6-A5  9-8,A5  8-9