/// <reference path="Photon/Photon-Javascript_SDK.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// For Photon Cloud Application access create cloud-app-info.js file in the root directory (next to default.html) and place next lines in it:
//var AppInfo = {
//    MasterAddress: "master server address:port",
//    AppId: "your app id",
//    AppVersion: "your app version",
//}
// fetching app info global variable while in global context
var DemoWss = this["AppInfo"] && this["AppInfo"]["Wss"];
var DemoAppId = this["AppInfo"] && this["AppInfo"]["AppId"] ? this["AppInfo"]["AppId"] : "<no-app-id>";
var DemoAppVersion = this["AppInfo"] && this["AppInfo"]["AppVersion"] ? this["AppInfo"]["AppVersion"] : "1.0";
var DemoFbAppId = this["AppInfo"] && this["AppInfo"]["FbAppId"];

var ConnectOnStart = false;

var GameEvent = {
    MESSAGE: 1,
    MOVE: 2,
    READY: 3,
    RESIGN: 4
};

var MysteryXiangqiClient = (function (_super) {
    __extends(MysteryXiangqiClient, _super);
    function MysteryXiangqiClient(game, options) {
        _super.call(this, DemoWss ? Photon.ConnectionProtocol.Wss : Photon.ConnectionProtocol.Ws, DemoAppId, DemoAppVersion);
        this.gameController = game;
        this.options = options;
        this.logger = new Exitgames.Common.Logger("Demo: ");
        this.USERCOLORS = ["#FF0000", "#00AA00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF"];

        // uncomment to use Custom Authentication
        // this.setCustomAuthentication("username=" + "yes" + "&token=" + "yes");
        // this.output(this.logger.format("Init", this.getNameServerAddress(), DemoAppId, DemoAppVersion));
        this.logger.info("Init", this.getNameServerAddress(), DemoAppId, DemoAppVersion);
        this.setLogLevel(Exitgames.Common.Logger.Level.INFO);
        var myActor = this.myActor();
        myActor.setCustomProperty("color", this.USERCOLORS[0]);
        myActor.setCustomProperty("status", PlayerStatus.New);
        myActor.setName(this.options.myName);
        // var self = this;
        // myActor.onPropertiesChange = function(prop, client) {
        //     self.gameController.refresh();
        // }
    }
    
    MysteryXiangqiClient.prototype.start = function (gameId) {
        this.connectToRegionMaster("asia");
        this.gameController.updateProgress(20);
        this.gameController.refresh();
    };
    MysteryXiangqiClient.prototype.onEvent = function (code, content, actorNr) {
        // switch (code) {
        //     case GameEvent.MESSAGE:
        //         var mess = content.message;
        //         var sender = content.senderName;
        //         this.output(sender + ": " + mess, this.myRoomActors()[actorNr].getCustomProperty("color"));
        //         break;
        //     case GameEvent.MOVE:
        //         if (this.gameController) {
        //             this.gameController.opponentMoveHandler(content);
        //         }
        //         this.output(sender + ": " + 'moved', this.myRoomActors()[actorNr].getCustomProperty("color"));
        //         break;
        //     case GameEvent.READY:
        //         this.gameController.checkIfUsersReady();
        //         break;
        //     case GameEvent.RESIGN:
        //         this.myActor().setCustomProperty('status', 'not ready');
        //         this.gameController.checkIfUsersReady();
        //         break;
        //     default:
        //         console.log('unhandled event');
        //         break;
        // }
        if (code == 1) {
            //sync the state
            if (this.gameController.state.gameState) {
                content.gameState.actors = $.extend(content.gameState.actors, this.gameController.state.gameState.actors);
            }
            this.gameController.state.gameState = content.gameState;
            this.gameController.refresh();
        }
        this.logger.debug("onEvent", code, "content:", content, "actor:", actorNr);
    };

    MysteryXiangqiClient.prototype.onOperationResponse = function(errorCode, errorMsg, code, content) {
        switch(code) {
            case 229: //Constants.CreateGame:
                this.afterJoinLobby(code, content);
                break;
        }

        if (errorCode != 0) {
            this.gameController.handlePhotonError(errorCode, errorMsg);
        }
    };

    MysteryXiangqiClient.prototype.afterJoinLobby = function(code, content) {
        
        if (this.isInLobby) {
            switch(this.options.ope) {
                case 'init':
                    this.output('Init Game');
                    var title = this.options.title;
                    this.createRoom(this.options.name, {
                                    //maxPlayers: 2,
                                    emptyRoomLiveTime: 10000, 
                                    suspendedPlayerLiveTime: 30000, 
                                    customGameProperties: { type: 'Co up', title: title }, 
                                    propsListedInLobby: ['type', 'title']}); //placeholder to add more properties
                    break;
                case 'join':
                case 'rejoin':
                    this.output('Joining game');
                    this.joinRoom(this.options.name, { joinToken: this.options.joinToken });
                    break;
            }
        }
    }

    MysteryXiangqiClient.prototype.onStateChange = function (state) {
        // console.log('onStateChange');
        // "namespace" import for static members shorter acceess
        var LBC = Photon.LoadBalancing.LoadBalancingClient;
        // console.log('Game state: ' + LBC.StateToName(state));
        // Error  -1  number  Critical error occurred.
        // Uninitialized 0   number  Client is created but not used yet.
        // ConnectingToNameServer  number  Connecting to NameServer.
        // ConnectedToNameServer   number  Connected to NameServer.
        // ConnectingToMasterserver    number  Connecting to Master (includes connect, authenticate and joining the lobby).
        // ConnectedToMaster   number  Connected to Master server.
        // JoinedLobby number  Connected to Master and joined lobby. Display room list and join/create rooms at will.
        // ConnectingToGameserver  number  Connecting to Game server(client will authenticate and join/create game).
        // ConnectedToGameserver   number  Connected to Game server (going to auth and join game).
        // Joined  number  The client joined room.
        // Disconnected
        if (state >= 0) {
            var progress = state * 10;
            if (state == 8) {
                progress = 100;
            }
            this.gameController.updateProgress(progress);

            //determine state
            switch(state) {
                case Photon.LoadBalancing.LoadBalancingClient.State.JoinedLobby:
                    // console.log('JoinedLobby');
                    this.myActor().setCustomProperty('status', PlayerStatus.JoinedLobby);
                    var actor = this.getMyActor(this.myActor());
                    this.gameController.state.gameState.actors[actor.name] = actor;
                    this.gameController.refresh();
                    break;
                case Photon.LoadBalancing.LoadBalancingClient.State.Joined:
                    // console.log('Joined');
                    // this.myActor().setCustomProperty('status', PlayerStatus.JoinedRoom);

                    break;

            }
            this.gameController.refresh();
        }
    };

    MysteryXiangqiClient.prototype.onJoinRoom = function (createdByMe) {
        // console.log('onJoinRoom');
        var joinToken = this.myActor().getJoinToken();

        if (createdByMe) {
            this.gameController.openRoom(joinToken);
            
        } else {
            // this.syncState(); 
        }
        this.gameController.renderCanvas();
        //updat eproperites
        var actor = this.myActor();
        actor.setCustomProperty('status', PlayerStatus.JoinedRoom);
        this.gameController.state.gameState.actors[actor.name] = this.getMyActor(actor);
        this.syncState();

        // this.gameController.refresh();
        // this.syncState();
        // var actor = this.myActor();
        // actor.setCustomProperty('status', PlayerStatus.JoinedRoom);
    };
    MysteryXiangqiClient.prototype.onActorJoin = function (actor) {
        // console.log('onActorJoin');
        
        // this.gameController.refresh();

        // this.syncState();
        // var self = this;
        // actor.onPropertiesChange = function(prop, client) {
        //     self.gameController.refresh();
        // }

        // actor.setCustomProperty('status', PlayerStatus.JoinedRoom);
    };
    MysteryXiangqiClient.prototype.onActorLeave = function (actor) {
        this.output("actor " + actor.actorNr + " left");
    };
    MysteryXiangqiClient.prototype.sendMessage = function (message) {
        console.log('sendMessage');
        var _this = this;
        if (_this.isJoinedToRoom()) {
            try  {
                this.raiseEvent(GameEvent.MESSAGE, { message: message, senderName: "user" + this.myActor().actorNr });
                this.output('me[' + this.myActor().actorNr + ']: ' + message, this.myActor().getCustomProperty("color"));
            } catch (err) {
                this.output("error: " + err.message);
            }
        } else {
            if (_this.isInLobby()) {
                _this.output("Press Join or New Game to connect to Game");
            } else {
                _this.output("Reload page to connect to Master");
            }
        }
    };

    MysteryXiangqiClient.prototype.output = function (str, color) {
        var escaped = str.replace(/&/, "&amp;").replace(/</, "&lt;").replace(/>/, "&gt;").replace(/"/, "&quot;");
        this.gameController.pushMessage(this.myActor(), escaped);
    };

    MysteryXiangqiClient.prototype.getActors = function() {
        var objects = this.myRoomActors();
        var actors = [];
        for(var key in objects) {
            actors.push(objects[key]);
        }

        var self = this;
        actors = actors.map(function(x) {
            return self.getMyActor(x);
        });
        return actors;
    }
    MysteryXiangqiClient.prototype.getMyActor = function(x) {
        var obj = {};
        obj.actorNr = x.actorNr;
        obj.customProperties = $.extend({}, x.customProperties);
        obj.isLocal = x.isLocal;
        obj.isHost = x.actorNr == this.gameController.state.gameState.hostJoinToken;
        obj.name = x.name;
        obj.set = this.gameController.settings.set;
        obj.suspended = x.suspended;
        return obj;
    }
    MysteryXiangqiClient.prototype.onError = function(errorCode, errorMsg) {
        this.gameController.goToLobby(errorMsg);
    }
    MysteryXiangqiClient.prototype.myActorReady = function() {
        this.myActor().setCustomProperty("status", 'ready');
        this.raiseEvent(GameEvent.READY);
        this.gameController.checkIfUsersReady();
    }
    MysteryXiangqiClient.prototype.myActorResign = function() {
        this.myActor().setCustomProperty("status", 'not ready');
        this.raiseEvent(GameEvent.RESIGN);
        this.gameController.checkIfUsersReady();    
    }
    MysteryXiangqiClient.prototype.syncState = function() {
        this.raiseEvent(1, { gameState: this.gameController.state.gameState }, { cache: Photon.LoadBalancing.Constants.EventCaching.ReplaceCache });
    }
    MysteryXiangqiClient.prototype.ping = function() {
        this.raiseEvent(0, {}, { cache: Photon.LoadBalancing.Constants.EventCaching.ReplaceCache });
    }
    return MysteryXiangqiClient;
})(Photon.LoadBalancing.LoadBalancingClient);