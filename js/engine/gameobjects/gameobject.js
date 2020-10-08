//Base game object
var GameObject = function(args) {

    args.position = args.position || {x : 0, y : 0}             //Default position

    this.gpos = new Vect(args.position.x, args.position.y);     //Grid position
    this.spos = new Vect(0,0);                                  //Sub position

    this.zIndex = args.zIndex ?? 0                              //zIndex
    this.tag = args.tag || args.name;

    this.parent = args.scene;                                   //Parent scene
}

//GameObject prototype
GameObject.prototype = {

    //Initialize a game object after its scene is loaded.
    init : function(ctx, scenes) {

    },

    //Set a New Scene to load it
    loadScene : function(newSceneName) {

        engine.main.pushScene(newSceneName);
    },

    //Compare two objects, return true if they are the same
    compare : function(gameObject) {

        return gameObject.gpos.x == this.gpos.x && gameObject.gpos.y == this.gpos.y;    //Default compare uses grid positions
    },

    //Game object update
    update : function(dt) {
        
    },

    //Game object draw
    draw : function(ctx) {
        
    }
}