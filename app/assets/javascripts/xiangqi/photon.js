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
        console.log(this.options);
        this.logger = new Exitgames.Common.Logger("Demo: ");
        this.USERCOLORS = ["#FF0000", "#00AA00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF"];

        // uncomment to use Custom Authentication
        // this.setCustomAuthentication("username=" + "yes" + "&token=" + "yes");
        // this.output(this.logger.format("Init", this.getNameServerAddress(), DemoAppId, DemoAppVersion));
        this.logger.info("Init", this.getNameServerAddress(), DemoAppId, DemoAppVersion);
        this.setLogLevel(Exitgames.Common.Logger.Level.DEBUG);
        var myActor = this.myActor();
        myActor.setCustomProperty("color", this.USERCOLORS[0]);
        myActor.setCustomProperty("status", PlayerStatus.New);
        myActor.setName(this.options.myName);
    }
    
    MysteryXiangqiClient.prototype.start = function (gameId) {
        this.connectToRegionMaster("asia");
        this.gameController.updateProgress(20);
        this.gameController.refresh();
    };
    MysteryXiangqiClient.prototype.onEvent = function (code, content, actorNr) {
        switch (code) {
            case GameEvent.MESSAGE:
                var mess = content.message;
                var sender = content.senderName;
                this.output(sender + ": " + mess, this.myRoomActors()[actorNr].getCustomProperty("color"));
                break;
            case GameEvent.MOVE:
                if (this.gameController) {
                    this.gameController.opponentMoveHandler(content);
                }
                this.output(sender + ": " + 'moved', this.myRoomActors()[actorNr].getCustomProperty("color"));
                break;
            case GameEvent.READY:
                this.gameController.checkIfUsersReady();
                break;
            case GameEvent.RESIGN:
                this.myActor().setCustomProperty('status', 'not ready');
                this.gameController.checkIfUsersReady();
                break;
            default:
                console.log('unhandled event');
                break;
        }
        this.logger.debug("onEvent", code, "content:", content, "actor:", actorNr);
    };

    MysteryXiangqiClient.prototype.onOperationResponse = function(errorCode, errorMsg, code, content) {
        console.log('errorCode');
        console.log(errorCode);
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
        this.myActor().setCustomProperty('status', PlayerStatus.JoinedLobby);
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
        // "namespace" import for static members shorter acceess
        var LBC = Photon.LoadBalancing.LoadBalancingClient;
        console.log('Game state: ' + LBC.StateToName(state));
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
        }
    };

    MysteryXiangqiClient.prototype.onJoinRoom = function (createdByMe) {
        console.log('onJoinRoom');
        var name = this.myRoom().name;
        this.output("Game " + name + " joined");
        var joinToken = this.myActor().getJoinToken();

        var actor = this.myActor();
        actor.setCustomProperty('status', PlayerStatus.JoinedRoom);
        actor.setCustomProperty('joinToken', joinToken);
        this.gameController.refresh();

        if (createdByMe) {
            this.gameController.openRoom(joinToken);
        }
        this.gameController.renderCanvas();
        this.gameController.refresh();
    };
    MysteryXiangqiClient.prototype.onActorJoin = function (actor) {
        console.log('onActorJoin');
        console.log(this.getActors());
        this.gameController.refresh();
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

        actors = actors.map(function(x) {
            var obj = {};
            obj.actorNr = x.actorNr;
            obj.customProperties = x.customProperties;
            obj.isLocal = x.isLocal;
            obj.name = x.name;
            obj.suspended = x.suspended;
            return obj;
        });
        return actors;
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
    return MysteryXiangqiClient;
})(Photon.LoadBalancing.LoadBalancingClient);