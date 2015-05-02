function loadXMLDoc(filename)
    {
    if (window.XMLHttpRequest)
      {
      xhttp=new XMLHttpRequest();
      }
    else // code for IE5 and IE6
      {
      xhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
    xhttp.open("GET",filename,false);
    xhttp.send();
    return xhttp.responseXML;
    }

    


// SE data processor 
function loadData () {

	Spatial.Data.dataLayers.push(new DataLayer("Asteroids", 	"default", 	16)); 		// 0
	Spatial.Data.dataLayers.push(new DataLayer("Ships", 		"primary", 	10));		// 1
	Spatial.Data.dataLayers.push(new DataLayer("Players", 		"danger", 	7));		// 2
	Spatial.Data.dataLayers.push(new DataLayer("Floating", 		"warning", 	0));		// 3
	Spatial.Data.dataLayers.push(new DataLayer("Ore Chunks", 	"default", 	0));		// 4

	var file = loadXMLDoc("data-example/SANDBOX_0_0_0_Orion.sbs");
	var entityBase = file.getElementsByTagName("MyObjectBuilder_EntityBase");

	for (var i = entityBase.length - 1; i >= 0; i--) {
		
		var temp = new GameObject();
		var position = entityBase[i].getElementsByTagName("Position");
		temp.position.x = Math.round(position[0].getAttribute("x"));
		temp.position.y = Math.round(position[0].getAttribute("y"));
		temp.position.z = Math.round(position[0].getAttribute("z"));
		temp.name = entityBase[i].getElementsByTagName("EntityId")[0].childNodes[0].nodeValue;

		var type = entityBase[i].getAttribute("xsi:type", "http://www.w3.org/2001/XMLSchema-instance");
		//console.log(type);
		if ( type == "MyObjectBuilder_VoxelMap") {
			temp.name = entityBase[i].getElementsByTagName("StorageName")[0].childNodes[0].nodeValue;
			Spatial.Data.dataLayers[0].objects.push(temp);
		}
		else if ( type == "MyObjectBuilder_CubeGrid") {
			temp.name = entityBase[i].getElementsByTagName("DisplayName")[0].childNodes[0].nodeValue;
			Spatial.Data.dataLayers[1].objects.push(temp);
		}
		else if ( type == "MyObjectBuilder_FloatingObject") {
			var check = entityBase[i].getElementsByTagName("PhysicalContent");
			temp.name = entityBase[i].getElementsByTagName("SubtypeName")[0].childNodes[0].nodeValue;
			if (check[0].getAttribute("xsi:type", "http://www.w3.org/2001/XMLSchema-instance") == "MyObjectBuilder_Ore")
				Spatial.Data.dataLayers[4].objects.push(temp);
			else
				Spatial.Data.dataLayers[3].objects.push(temp);
		}
		else if ( type == "MyObjectBuilder_Character") {
			Spatial.Data.dataLayers[2].objects.push(temp);
		}
	};
}