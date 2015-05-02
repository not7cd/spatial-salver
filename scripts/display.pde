/* 
    Spatial - Space Engineers world viewer
    
    Processing - used to dislay data

    by not7CD
    www.not7CD.pl 
 */


// Globals
int centerCircleRadiusMax = 600;

int centerLineX = 150;
int centerLineY = 0;

float tanAng;

//center of canvas
int originX;
int originY;

int toOriginX(int x) {  return originX + x; }

int toOriginY(int y) {  return originY - y; }


int invX = 1;
int invY =-1;

float deltaMouseY, deltaMouseX;

int helper = 0;

color lnColor = color(127);
color objColor = color(127);


void setSize() {
    size(window.innerWidth, window.innerHeight-10);
    originX = width/2;
    originY = height/2;
    draw();
}

void getColors() {
    lnColor = unhex(rgb2hex($('.label-default').css('backgroundColor')));
    for (int i = Spatial.Data.dataLayers.length - 1; i >= 0 ; i--) {
        Spatial.Display.layers[i].color = unhex(Spatial.Display.layers[i].color);        
    }
}

void setup() {
  frameRate(30);
  // Getting color from CSS
  getColors();
  // Setting brush options
  strokeWeight(1);
  ellipseMode(CENTER);
  // Drawing first frame
  updatePositions();
  setSize();
}

// Begin main draw loop
void draw() {
    // Clear screen
    background(0,0);
    // No Fill
    noFill();
    if( Spatial.Display.centerCircles )
        drawCenterCircles();
    if( Spatial.Display.centerLines )
        drawCenterLines();
    
    // One loop for all obj's
    helper = 0;
    for (int i = Spatial.Data.dataLayers.length - 1; i >= 0 ; i--) {
        objColor = (Spatial.Display.layers[i].color);
        for (int j = Spatial.Data.dataLayers[i].objects.length - 1; j >= 0 ; j--) {
            mouseOverObject(Spatial.Data.dataLayers[i].objects[j]);

            drawGameObject(i,Spatial.Data.dataLayers[i].objects[j]);
        }
        
    }
    // Fill
    fill (lnColor);
    if( Spatial.Display.centerCoords )
        drawCenterCoords();
    if( Spatial.Display.debugInfo )
        drawDebugInfo();
    if( Spatial.Display.debugInfo )
        drawDebug();
    
 
    
    if (Spatial.Display.updatePos == true) {
        Spatial.Display.updatePos = false;
        updatePositions();
    }
}

function drawGameObject(i,object){
        if(object.inCenter)
        {
          stroke(objColor, 155*(object.calculatedPosition.y+210)/410+100);

          if( Spatial.Display.layers[i].insideLines == true ) {
                ellipse(toOriginX(object.calculatedPosition.x), 
                        toOriginY(object.calculatedPosition.y/tanAng), 
                        15,   15/tanAng  );

                line(   toOriginX(object.calculatedPosition.x), 
                        toOriginY(object.calculatedPosition.y/tanAng), 
                        toOriginX(object.calculatedPosition.x), 
                        toOriginY(object.calculatedPosition.z));
          }
        }
        else
        {stroke(objColor, 255/((dist(object.calculatedPosition.x,object.calculatedPosition.y, (Spatial.Transform.position.z+object.position.z)*Spatial.Transform.scale,0,0, 0)-250))*50);}

        if( (Spatial.Display.layers[i].insidePoints == true && object.inCenter) 
         || (Spatial.Display.layers[i].outsidePoints == true && !object.inCenter) ) {
            ellipse(toOriginX(object.calculatedPosition.x), 
                    toOriginY(object.calculatedPosition.z), 
                    Spatial.Display.layers[i].size,   
                    Spatial.Display.layers[i].size  );
            ellipse(toOriginX(object.calculatedPosition.x), 
                    toOriginY(object.calculatedPosition.z), 
                    2,   
                    2  );
        }
      
    }

function mouseOverObject(object){
    if (dist(toOriginX(object.calculatedPosition.x),
             toOriginY(object.calculatedPosition.z),
             mouseX,
             mouseY)<7) {
        fill(objColor);
        text(" ["+object.position.x+","+object.position.y+","+object.position.z+"] "+object.name, mouseX, mouseY+helper*15);
        helper++;
    }
    else
        noFill();
  
}

void updatePositions(){
    // Setting every point relative to the center
    for (int i = Spatial.Data.dataLayers.length - 1; i >= 0 ; i--) {
        for (int j = Spatial.Data.dataLayers[i].objects.length - 1; j >= 0 ; j--) {
            Spatial.Data.dataLayers[i].objects[j].CalculatePosition();
        }
    };
    // Setting guide lines
    centerLineX = centerCircleRadiusMax/2*sin(Spatial.Transform.rot);
    centerLineY = centerCircleRadiusMax/2*cos(Spatial.Transform.rot);

    tanAng = tan(Spatial.Transform.ang);
    // Used to update text boxes with proper values
    Spatial.Transform.Update();
}


void drawCenterCircles(){
    stroke(lnColor);
    
    for (int i = 0; i<= 3; i++)
        ellipse(originX, 
                originY, 
                Spatial.Display.centerCirclesRad*i, 
                Spatial.Display.centerCirclesRad*i/tanAng);
}

void drawCenterLines(){
      stroke(lnColor);
      
      line(originX, originY, toOriginX(centerLineX), originY+centerLineY/tanAng);
      line(originX, originY, originX-centerLineX, toOriginY(centerLineY/tanAng));
      line(originX, originY, toOriginX(centerLineY), toOriginY(centerLineX/tanAng));
      line(originX, originY, originX-centerLineY, originY+centerLineX/tanAng);
}

void drawCenterCoords() {
    for (int i = 1; i<= 3; i++)
        text(String(round(Spatial.Display.centerCirclesRad/2*i/Spatial.Transform.scale)/1000)+"km", 
            originX-20, toOriginY(Spatial.Display.centerCirclesRad/2*i/tanAng));    
}


void drawDebugInfo() {
    text("Debug Info | Spatial prototype", 20, 20);
    text(Spatial.Transform.scale, 20, 60);
    text(Spatial.Transform.ang, 20, 80);
    text(Spatial.Transform.rot, 20, 100);
    text(floor(frameRate)+" FPS", 20,  120);

    text(deltaMouseX, 20, 140);
    text(deltaMouseY, 20, 160);
}

void drawDebug() {
    stroke(255,0,255);
    line(originX,originY,toOriginX(deltaMouseX*2),toOriginY(deltaMouseY*2));

    stroke(0,255,0);
    line(originX, originY, originX-centerLineX, toOriginY(centerLineY/tanAng));
    stroke(255,0,0);
    line(originX, originY, toOriginX(centerLineY), toOriginY(centerLineX/tanAng));
}

void drawAxis(x,y,length) {
    // x
    stroke(0,255,0);
    line(x, y, length, length);
    // y
    stroke(255,0,0);
    line(x, y, length, length);
    // z
    stroke(0,0,255);
    line(x, y, length, length);
}

// User interaction

void mouseDragged() {
     deltaMouseX = -(pmouseX - mouseX);
     deltaMouseY =  (pmouseY - mouseY);

    if(mouseButton == LEFT) {
        Spatial.Transform.rot += radians((deltaMouseX)/5); 
        Spatial.Transform.ang += radians((deltaMouseY)/5); 
        // Out of range
        if(Spatial.Transform.ang>radians(90)){ Spatial.Transform.ang=radians(90); };
        if(Spatial.Transform.ang<radians(45)){ Spatial.Transform.ang=radians(45); };
    }

    if(mouseButton == RIGHT){
        Spatial.Transform.TranslateByMouse(deltaMouseX, deltaMouseY);
    }

    if(mouseButton == CENTER){
        Spatial.Transform.scale += (deltaMouseY) * (0.01) * Spatial.Transform.scale;
        // Out of range
        if (Spatial.Transform.scale < 0.005)    Spatial.Transform.scale = 0.005;
        if (Spatial.Transform.scale > 10)       Spatial.Transform.scale = 10;
    }
  
    updatePositions();
}

void mouseMoved() {}
void mousePressed() {}
void mouseReleased() {}
void mouseOut() {
    setSize();
}
