//FPS counter game object
var Button = function(args) { GameObject.call(this, args);

    this.press = false;                                 //Button press state
    this.hover = false;                                 //Button hover state

    this.size = new Vect(                               //Button size
        args.size?.x || 0,                              //Button width
        args.size?.y || 0);                             //Button height

    this.depth = args.depth || engine.math.zDepth / 4;  //Button depth

    this.bgColor = engine.math.colorTranslate(args.backgroundColor || "#DDD");  //Button color
    this.bgColorDark = null;                                                    //Button shaded color
    this.bgColorBright = null;                                                  //Button light color

    this.bhColor = engine.math.colorTranslate(args.hoverColor || "#DD0");       //Button hover color
    this.bhColorDark = null;                                                    //Button hover shaded color
    this.bhColorBright = null;                                                  //Button hover light color

    this.font = args.font || "bold 18pt Consolas";                              //Font and default font
    this.color = args.color || "#333";                                          //Color and default color

    this.text = args.text || "";                        //Button text
    this.isCenterUI = args.isCenterUI;                  //If this button is horizontally centered around the UI

    this.images = [];                                   //Stored button images
}           

//FPS counter prototype
Button.prototype = 
Object.create(GameObject.prototype);
Object.assign(Button.prototype, {

    //Initialize a game object after its scene is loaded.
    init : function(ctx, scenes) {

        //Center button horizontally around the UI
        if (this.isCenterUI) {                                          //If the button is UI-horizontally centered                             
            this.spos.x =                                               //Horizontally center button around UI
                ctx.canvas.width / 2 +
                engine.math.boundary.maxx * engine.math.gmultx / 2 +
                engine.math.lineWidth / 2 +
                this.depth / 2;
        }

        //Initialize colors
        ctx.fillStyle = this.bgColor;   //Color

        this.bgColorDark = engine.math.colorMult(ctx.fillStyle, 0.75);  //Calculate dark color
        this.bgColorBright = engine.math.colorAdd(ctx.fillStyle, 48);   //Calculate bright color

        ctx.fillStyle = this.bhColor;   //Color

        this.bhColorDark = engine.math.colorMult(ctx.fillStyle, 0.75);  //Calculate dark color
        this.bhColorBright = engine.math.colorAdd(ctx.fillStyle, 48);   //Calculate bright color

        //Bake buttons
        for(var i = 0; i < 4; i++) {

            this.press = i % 2 != 0;    //Flip press state
            this.hover = i >= 2;        //Flip hover state

            this.images[i] = new Image;

            this.images[i].src = engine.baker.bake(     //Set image src from baking results
                this,                                   //Bake for this button
                this.drawButton,                        //Draw button for baked image
                this.size.x + this.depth,   
                this.size.y + this.depth,               
                "BUTTON." + 
                this.text + "." + 
               (this.press ? "PRESS" : "UNPRS") + "." +
               (this.hover ? "HOVER" : "OUTSD"));
        }

        //Reset button states after baking
        this.press = false;
        this.hover = false;
    },

    //Game object update
    update : function(dt) {
        
        var pos = engine.mouse.getPos();        //Cursor position
        
        //Set hover if the cursor is inside the button area
        this.hover = engine.math.colPointRect(  //Check collision between cursor and button
            pos.x,                              //Cursor x-pos
            pos.y,                              //Cursor y-pos
            this.spos.x - this.size.x / 2,      //Button x-corner
            this.spos.y - this.size.y / 2,      //Button y-corner
            this.size.x + this.depth,           //Button width with depth compensation
            this.size.y + this.depth);          //Button height with depth compensation
        
        //If the cursor is over the button
        if (this.hover) {

            //Mouse states
            switch(engine.mouse.getMouseState()) {          //Get mouse state for different cursor-buttone events

                //Cursor is not pressed
                case engine.mouse.mouseStates.ISRELEASED :  //If cursor is not pressed

                    this.press = false;                     //NONE state
                    break;

                //Cursor is pressed
                case engine.mouse.mouseStates.WASPRESSED :  //If cursor was pressed

                    this.press = true;                      //PRESS state
                    break;

                //Cursor was released
                case engine.mouse.mouseStates.WASRELEASED : //If cursor was released

                    if (this.press) {                       //If button is in the PRESS state

                        this.doButtonAction();              //Do the button's action
                        this.press = false;                 //Return to NONE state
                    }
                    break;
            }
        }
        else {                                              //If the cursor is not over the button
            
            //Go from pressed state to none state if cursor is released outside the button
            if (this.press &&                               //If pressed but mouse is released
                engine.mouse.getMouseState() == engine.mouse.mouseStates.ISRELEASED) {  

                this.press = false;                         //NONE state
            }
        }
    },

    //Game object draw
    draw : function(ctx) {
        ctx.drawImage(this.images[this.press + this.hover * 2], 
            -this.size.x / 2, 
            -this.size.y / 2);
    },

    //Default button action
    doButtonAction : function() {

        console.log(this.text); //Log this button's text as a default action
    },

    //Button draw
    drawButton : function(ctx) {
        
        //Handle button depth
        var currentDepth = this.press ? this.depth / 2 : this.depth;        //Depth for pressed or unpressed state
        ctx.translate(this.depth - currentDepth, currentDepth);             //Translate by depth

        //Button top face color
        ctx.fillStyle = this.hover ?    //If cursor is hovering
            this.bhColorBright :        //Hover color
            this.bgColorBright;         //Background color

        //Draw button top face
        ctx.beginPath();
        ctx.moveTo(0,                          0);                          //Lower Right
        ctx.lineTo(              currentDepth, -currentDepth);              //Upper Right
        ctx.lineTo(this.size.x + currentDepth, -currentDepth);              //Upper Left
        ctx.lineTo(this.size.x,                0);                          //Lower Left
        ctx.fill();

        //Button right face color
        ctx.fillStyle = this.hover ?    //If cursor is hovering
            this.bhColorDark :          //Hover color
            this.bgColorDark;           //Background color

        //Draw button right face
        ctx.beginPath();
        ctx.moveTo(this.size.x,                0);                          //Upper Left
        ctx.lineTo(this.size.x + currentDepth,             - currentDepth); //Upper Right
        ctx.lineTo(this.size.x + currentDepth, this.size.y - currentDepth); //Lower Left
        ctx.lineTo(this.size.x,                this.size.y);                //Lower Right
        ctx.fill();

        //Button rectangle color
        ctx.fillStyle = this.hover ?    //If cursor is hovering
            this.bhColor :              //Hover color
            this.bgColor;               //Background color

        //Draw button rectangle 
        ctx.fillRect(   
            0,                          //Center vertical
            0,                          //Center horizontal
            this.size.x,                //Button width
            this.size.y);               //Button height

        //Draw button text  
        ctx.textBaseline = "middle";    //Center vertical
        ctx.textAlign = "center";       //Center horizontal
        ctx.font = this.font;           //Font
        ctx.fillStyle = this.color;     //Color
        ctx.fillText(this.text,         //Fill button text
            this.size.x / 2 + 1, 
            this.size.y / 2 + 1);
    }
});