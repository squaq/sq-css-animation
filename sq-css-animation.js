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
//                console.log('tr after', tr)
                var matrix = tr.replace(/[^0-9\-.,]/g, '').split(',');
                var x = matrix[12] || matrix[4];//translate x
                var y = matrix[13] || matrix[5];
//                console.log('tr before', tr)
                
                var scale = {'x': 1, 'y': 1};
                if( tr ) {
                    tr = tr.replace('matrix(', '').replace(')', '').split(', ');
//                    console.log('tr before before', tr)
                    scale.x = parseFloat(tr[0]);
                    scale.y = parseFloat(tr[3]);
                }
//                return scale;
                
                
                
                return {'x':x, 'y':y, 'scaleX':scale.x, 'scaleY':scale.y};
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
            this.transform = function(obj){
//                console.log('my obj', obj)
                var  trans = '';
                    
                if('x' in obj && 'y' in obj){
                    trans = "translate("+obj.x+"px, "+obj.y+"px)";
                } else if('x' in obj){ 
                    trans = "translate("+obj.x+"px, "+this.getTransform().y+"px)";
                }else if('y' in obj){
                   trans =  "translate("+this.getTransform().x+"px, "+obj.y+"px)";
                }
                
                
                if('rotate' in obj){ trans+= " rotate("+obj.rotate+"deg)"}
                if('scale' in obj){ trans+= " scale("+obj.scale+")"}
                
                
                delete obj['x'];
                delete obj['y'];
                delete obj['rotate'];
                delete obj['scale'];
                
                if(trans.length > 0){
                    this.style.webkitTransform = trans;
                    this.style.MozTransform = trans;
                    this.style.msTransform = trans;
                    this.style.OTransform = trans;
                    this.style.transform = trans;
                }
            }
            
            this.css = function(obj){
                if(obj){
                    this.transform(obj);
                    for(var o in obj) {
                        this.style.setProperty(o, obj[o])
                    }    
                }
            }
            
            this.animation = function(obj, events){
                
                if(!('delay' in obj)) obj.delay = 0;
                if(obj === undefined) return 'empty ';
                if(!('time' in obj)) obj.time = 1;
                if(!('ease' in obj)) obj.ease = 'linear';
                
                setTimeout(function(){
                    this.style.setProperty('-webkit-transition', obj.time+'s '+obj.ease);
                    this.style.setProperty('-moz-transition', obj.time+'s '+obj.ease);
                    this.style.setProperty('-ms-transition', obj.time+'s '+obj.ease);
                    this.style.setProperty('-o-transition', obj.time+'s '+obj.ease);
                    this.style.setProperty('transition', obj.time+'s '+obj.ease);
                    
                    this.css(obj);
                    
                    if(events){
                        if('init' in events){
                            events.init()
                        }
                    }
                    
                    setTimeout(function() {
                        if(events && 'complete' in events) events.complete();
                        this.style.removeProperty('-webkit-transition', obj.time+'s '+obj.ease);
                        this.style.removeProperty('-moz-transition', obj.time+'s '+obj.ease);
                        this.style.removeProperty('-ms-transition', obj.time+'s '+obj.ease);
                        this.style.removeProperty('-o-transition', obj.time+'s '+obj.ease);
                        this.style.removeProperty('transition', obj.time+'s '+obj.ease);
                        
                    }.bind(this), obj.time * 1000);
                }.bind(this), obj.delay * 1000);
            }            
        }
    };
 
    window.sq = sq;
 
}(window));