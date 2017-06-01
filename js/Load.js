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

var data = [];

    // SE data processor
    function loadData () {


    	var file = loadXMLDoc("SANDBOX_0_0_0_Orion.sbs");
    	var entityBase = file.getElementsByTagName("MyObjectBuilder_EntityBase");

    	for (var i = entityBase.length - 1; i >= 0; i--) {

    		var temp = {};
    		var position = entityBase[i].getElementsByTagName("Position");
    		temp.x = Math.round(position[0].getAttribute("x"));
    		temp.y = Math.round(position[0].getAttribute("y"));
    		temp.z = Math.round(position[0].getAttribute("z"));
    		temp.name = entityBase[i].getElementsByTagName("EntityId")[0].childNodes[0].nodeValue;

        data.push(temp);

    	};
    }
