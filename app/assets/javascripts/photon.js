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

var MysteryXiangqiClient = (function (_super) {
    __extends(MysteryXiangqiClient, _super);
    function MysteryXiangqiClient(Game, options) {
        _super.call(this, DemoWss ? Photon.ConnectionProtocol.Wss : Photon.ConnectionProtocol.Ws, DemoAppId, DemoAppVersion);
        this.gameController = Game;
        this.options = options;
        this.logger = new Exitgames.Common.Logger("Demo: ");
        this.USERCOLORS = ["#FF0000", "#00AA00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF"];

        // uncomment to use Custom Authentication
        // this.setCustomAuthentication("username=" + "yes" + "&token=" + "yes");
        this.output(this.logger.format("Init", this.getNameServerAddress(), DemoAppId, DemoAppVersion));
        this.logger.info("Init", this.getNameServerAddress(), DemoAppId, DemoAppVersion);
        this.setLogLevel(Exitgames.Common.Logger.Level.DEBUG);

        this.myActor().setCustomProperty("color", this.USERCOLORS[0]);
        this.myActor().setName(this.options.actorName);
    }
    MysteryXiangqiClient.prototype.start = function (gameId) {
        this.setupUI();
        this.connectToRegionMaster("asia");
    };
    MysteryXiangqiClient.prototype.onError = function (errorCode, errorMsg) {
        this.output("Error " + errorCode + ": " + errorMsg);
    };
    MysteryXiangqiClient.prototype.onEvent = function (code, content, actorNr) {
        switch (code) {
            case 1:
                var mess = content.message;
                var sender = content.senderName;
                this.output(sender + ": " + mess, this.myRoomActors()[actorNr].getCustomProperty("color"));
                break;
            case 2:
                if (this.gameController) {
                    this.gameController.opponentMoveHandler(content);
                }
                this.output(sender + ": " + 'moved', this.myRoomActors()[actorNr].getCustomProperty("color"));
                break;
            default:
        }
        this.logger.debug("onEvent", code, "content:", content, "actor:", actorNr);
    };

    MysteryXiangqiClient.prototype.onOperationResponse = function(errorCode, errorMsg, code, content) {
        console.log('onOperationResponse');
        console.log(content);
        switch(code) {
            case 229: //Constants.CreateGame:
                this.afterJoinLobby(code, content);
                break;
        }
    };

    MysteryXiangqiClient.prototype.afterJoinLobby = function(code, content) {
        var title = this.options.title;
        console.log('afterJoinLobby');
        console.log(this.myActor().getJoinToken());
        switch(this.options.ope) {
            case 'init':
                this.output('Init Game');
                this.createRoom(this.options.name, {
                                //maxPlayers: 2,
                                emptyRoomLiveTime: 30000, 
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

    MysteryXiangqiClient.prototype.onStateChange = function (state) {
        // "namespace" import for static members shorter acceess
        var LBC = Photon.LoadBalancing.LoadBalancingClient;

        var stateText = document.getElementById("statetxt");
        stateText.textContent = LBC.StateToName(state);
        this.updateRoomButtons();
    };

    MysteryXiangqiClient.prototype.onRoomListUpdate = function (rooms, roomsUpdated, roomsAdded, roomsRemoved) {
        this.logger.info("Demo: onRoomListUpdate", rooms, roomsUpdated, roomsAdded, roomsRemoved);
        this.output("Demo: Rooms update: " + roomsUpdated.length + " updated, " + roomsAdded.length + " added, " + roomsRemoved.length + " removed");
        this.onRoomList(rooms);
        this.updateRoomButtons(); // join btn state can be changed
    };
    MysteryXiangqiClient.prototype.onRoomList = function (rooms) {

    };
    MysteryXiangqiClient.prototype.onJoinRoom = function (createdByMe) {
        console.log('onJoinRoom');
        var joinToken = this.myActor().getJoinToken();
        var name = this.myRoom().name;
        this.output("Game " + name + " joined");
        if (this.options.onJoinRoomHandler) {
            this.options.onJoinRoomHandler.call(this, createdByMe, name, joinToken);
        }
    };
    MysteryXiangqiClient.prototype.onActorJoin = function (actor) {
        this.output("actor " + actor.actorNr + " joined");
    };
    MysteryXiangqiClient.prototype.onActorLeave = function (actor) {
        this.output("actor " + actor.actorNr + " left");
    };
    MysteryXiangqiClient.prototype.sendMessage = function (message) {
        try  {
            this.raiseEvent(1, { message: message, senderName: "user" + this.myActor().actorNr });
            this.output('me[' + this.myActor().actorNr + ']: ' + message, this.myActor().getCustomProperty("color"));
        } catch (err) {
            this.output("error: " + err.message);
        }
    };

    MysteryXiangqiClient.prototype.setupUI = function () {
        var _this = this;
        this.logger.info("Setting up UI.");

        var form = document.getElementById("mainfrm");
        form.onsubmit = function () {
            if (_this.isJoinedToRoom()) {
                var input = document.getElementById("input");

                _this.sendMessage(input.value);
                input.value = '';
                input.focus();
            } else {
                if (_this.isInLobby()) {
                    _this.output("Press Join or New Game to connect to Game");
                } else {
                    _this.output("Reload page to connect to Master");
                }
            }
            return false;
        };

        var btn = document.getElementById("leavebtn");
        btn.onclick = function (ev) {
            _this.leaveRoom();
            return false;
        };

        this.updateRoomButtons();
    };

    MysteryXiangqiClient.prototype.output = function (str, color) {
        var log = document.getElementById("theDialogue");
        var escaped = str.replace(/&/, "&amp;").replace(/</, "&lt;").replace(/>/, "&gt;").replace(/"/, "&quot;");
        if (color) {
            escaped = "<FONT COLOR='" + color + "'>" + escaped + "</FONT>";
        }
        log.innerHTML = log.innerHTML + escaped + "<br>";
        log.scrollTop = log.scrollHeight;
    };

    MysteryXiangqiClient.prototype.updateRoomButtons = function () {
        var btn;

        btn = document.getElementById("leavebtn");
        btn.disabled = !(this.isJoinedToRoom());
    };
    return MysteryXiangqiClient;
})(Photon.LoadBalancing.LoadBalancingClient);
