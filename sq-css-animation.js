/*
    Author: Squaq   
    Developers: Paulo Sanches, Everton Melo
*/
(function(window) {
    'use strict';
 
    var sq = function(context) {
        return new sq.fn.init(context);
    };
 
    sq.fn = sq.prototype = {
        init: function(context) {
            var elem = 0,
                selector = context.charAt(0);
 
            switch (selector) {
                case '#':
                    elem = document.getElementById(context.split('#')[1]);
                    break;
                case '.':
                    elem = document.getElementsByClassName(context.split('.')[1])[0];
                    break;
                default:
                    elem = document.getElementsByTagName(context)[0];
                    break;
            };
 
            if (elem === null) return;
 
            sq.fn.methods.call(elem);
            return elem;
        },
        methods: function() {
            // Hide the element with delay 
            this.hide = function(delay) {
                if (delay === undefined) {
                    delay = 0;
                };
 
                setTimeout(function() {
                    this.style.display = 'none';
                }.bind(this), delay * 1000);
            };
            // Show the element with delay 
            this.show = function(delay) {
                if (delay === undefined) {
                    delay = 0;
                };
 
                setTimeout(function() {
                    this.style.display = 'block';
                }.bind(this), delay * 1000);
            };
            // Create and add dom element with id and delay
            this.addChild = function(id, style, delay) {
                if (delay === undefined) {
                    delay = 0;
                };
 
                var elem = document.createElement('div');
                this.appendChild(elem);
 
                if (id !== undefined) {
                    elem.setAttribute('id', id);
                };
 
                if (style !== undefined) {
                    sq('#' + id).css(style);
                };
            };
            // Remove dom element with delay
            this.removeChild = function(id, delay) {
                if (delay === undefined) {
                    delay = 0;
                };
 
                setTimeout(function() {
                    this.removeChild(sq(id));
                }.bind(this), delay * 1000);
            };
            // Add eventlistener on Dom Element with delay
            this.on = function(event, callback, delay) {
                if (delay === undefined) {
                    delay = 0;
                };
 
                setTimeout(function() {
                    this.addEventListener(event, callback, false);
                }.bind(this), delay * 1000);
            };
            // Remove o eventlistener of Dom Element with delay
            this.off = function(event, callback, delay) {
                if (delay === undefined) {
                    delay = 0;
                };
 
                setTimeout(function() {
                    this.removeEventListener(event, callback, false);
                }.bind(this), delay * 1000);
            }
 
            //return string style value 
            this.cssValue = function(property)
            {
                return window.getComputedStyle(this, null).getPropertyValue(property);
            };
            
            
            this.getTransform = function (){
                var tr = this.cssValue("-webkit-transform") ||
                        this.cssValue("-moz-transform") ||
                 this.cssValue("-ms-transform") ||
                 this.cssValue("-o-transform") ||
                 this.cssValue("transform") ||
                 "fail...";
                var matrix = tr.replace(/[^0-9\-.,]/g, '').split(',');
                var x = matrix[12] || matrix[4];//translate x
                var y = matrix[13] || matrix[5];
                return {'x':x, 'y':y};
            }
            
            //return div width
            this.getWidth = function(){return parseInt(this.cssValue('width'));};
            //return div height
            this.getHeight = function(){return parseInt(this.cssValue('height'));};
            //return div margin-left
            this.left = function(){return parseInt(this.cssValue('margin-left'));};
            //return div margin-right
            this.right = function(){return parseInt(this.cssValue('margin-right'));}
             
            //set div transformations with cross-browser
            //@params x, y, rotate = 0, scale = 1
            this.transform = function(x, y, rotate, scale)
            {
                if(x === undefined) {x = 0;console.log("foi Y")}
                if(y === undefined) {y = 0; console.log("foi Y")}
                
               if(!rotate) rotate = 0; if(!scale) scale = 1;
               this.style.webkitTransform = "translate("+x+"px, "+y+"px) rotate("+rotate+"deg) scale("+scale+")";
               this.style.MozTransform = "translate("+x+"px, "+y+"px) rotate("+rotate+"deg) scale("+scale+")";
               this.style.msTransform = "translate("+x+"px, "+y+"px) rotate("+rotate+"deg) scale("+scale+")";
               this.style.OTransform = "translate("+x+"px, "+y+"px) rotate("+rotate+"deg) scale("+scale+")";
               this.style.transform = "translate("+x+"px, "+y+"px) rotate("+rotate+"deg) scale("+scale+")";
            }
            
            this.animation = function(obj, events){
                
                if(!('delay' in obj)) obj.delay = 0;
                if(obj === undefined) return 'empty ';
                if(!('time' in obj)) obj.time = 1;
                if(!('ease' in obj)) obj.ease = 'linear';
                
                console.log('events',events)
                
                setTimeout(function(){
                    this.style.setProperty('-webkit-transition', obj.time+'s '+obj.ease);
                    this.style.setProperty('-moz-transition', obj.time+'s '+obj.ease);
                    this.style.setProperty('-ms-transition', obj.time+'s '+obj.ease);
                    this.style.setProperty('-o-transition', obj.time+'s '+obj.ease);
                    this.style.setProperty('transition', obj.time+'s '+obj.ease);

                    if('opacity' in obj){
                        this.style.setProperty("opacity", obj.opacity);
                    }
                    if('color' in obj){
                        this.style.setProperty("color", obj.color);
                    }
                    if('backgroundColor' in obj){
                        this.style.setProperty("background-color", obj.backgroundColor);
                    }

                    if('x' in obj && 'y' in obj)
                    {
                        if('scale' in obj) this.transform( obj.x, obj.y, 0, obj.scale);
                        else this.transform( obj.x, obj.y);
                    }
                    else if('y' in obj) this.transform(this.getTransform().x, obj.y);
                    else if('x' in obj) this.transform( obj.x, this.getTransform().y);
                    else if('scale' in obj) this.transform(this.getTransform().x, this.getTransform().y, 0, obj.scale);
                   
                    
                    if(events){
                        if('init' in events){
                            events.init()
                        }

                        if('complete' in events){
                            setTimeout(function() {
                                events.complete();
                            }.bind(this), obj.time * 1000);
                        }  
                    }
                        
                }.bind(this), obj.delay * 1000);
            }            
        }
    };
 
    window.sq = sq;
 
}(window));