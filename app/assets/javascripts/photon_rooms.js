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

var RoomManager = (function (_super) {
    __extends(RoomManager, _super);
    function RoomManager(options) {
        _super.call(this, DemoWss ? Photon.ConnectionProtocol.Wss : Photon.ConnectionProtocol.Ws, DemoAppId, DemoAppVersion);
        this.options = options;
        this.logger = new Exitgames.Common.Logger("Demo: ");
        this.USERCOLORS = ["#FF0000", "#00AA00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF"];

        // uncomment to use Custom Authentication
        // this.setCustomAuthentication("username=" + "yes" + "&token=" + "yes");
        this.output(this.logger.format("Init", this.getNameServerAddress(), DemoAppId, DemoAppVersion));
        this.logger.info("Init", this.getNameServerAddress(), DemoAppId, DemoAppVersion);
        this.setLogLevel(Exitgames.Common.Logger.Level.DEBUG);

        this.myActor().setCustomProperty("color", this.USERCOLORS[0]);
    }
    RoomManager.prototype.start = function () {
        this.setupUI();

        // connect if no fb auth required
        if (ConnectOnStart) {
            this.connectToRegionMaster("asia");
        }
    };
    RoomManager.prototype.onError = function (errorCode, errorMsg) {
        this.output("Error " + errorCode + ": " + errorMsg);
    };
    RoomManager.prototype.onEvent = function (code, content, actorNr) {
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

    RoomManager.prototype.onStateChange = function (state) {
        // "namespace" import for static members shorter acceess
        var LBC = Photon.LoadBalancing.LoadBalancingClient;

        var stateText = document.getElementById("statetxt");
        stateText.textContent = LBC.StateToName(state);
        this.updateRoomButtons();
    };

    RoomManager.prototype.onRoomListUpdate = function (rooms, roomsUpdated, roomsAdded, roomsRemoved) {
        this.logger.info("Demo: onRoomListUpdate", rooms, roomsUpdated, roomsAdded, roomsRemoved);
        this.output("Demo: Rooms update: " + roomsUpdated.length + " updated, " + roomsAdded.length + " added, " + roomsRemoved.length + " removed");
        this.onRoomList(rooms);
        this.updateRoomButtons(); // join btn state can be changed
    };
    RoomManager.prototype.onRoomList = function (rooms) {
        throw "onRoomList not defined yet";
    };
    RoomManager.prototype.onJoinRoom = function () {
        this.output("Game " + this.myRoom().name + " joined");
    };
    RoomManager.prototype.onActorJoin = function (actor) {
        this.output("actor " + actor.actorNr + " joined");
    };
    RoomManager.prototype.onActorLeave = function (actor) {
        this.output("actor " + actor.actorNr + " left");
    };
    RoomManager.prototype.sendMessage = function (message) {
        try  {
            this.raiseEvent(1, { message: message, senderName: "user" + this.myActor().actorNr });
            this.output('me[' + this.myActor().actorNr + ']: ' + message, this.myActor().getCustomProperty("color"));
        } catch (err) {
            this.output("error: " + err.message);
        }
    };

    RoomManager.prototype.setupUI = function () {
        var _this = this;
        this.logger.info("Setting up UI.");

        // var input = document.getElementById("input");
        // input.value = 'hello';
        // input.focus();

        // var btnJoin = document.getElementById("joingamebtn");
        // btnJoin.onclick = function (ev) {
        //     if (_this.isInLobby()) {
        //         var menu = document.getElementById("gamelist");
        //         var gameId = menu.children[menu.selectedIndex].textContent;
        //         _this.output(gameId);
        //         _this.joinRoom(gameId);
        //     } else {
        //         _this.output("Reload page to connect to Master");
        //     }
        //     return false;
        // };
        // var btnJoin = document.getElementById("joinrandomgamebtn");
        // btnJoin.onclick = function (ev) {
        //     if (_this.isInLobby()) {
        //         _this.output("Random Game...");
        //         _this.joinRandomRoom();
        //     } else {
        //         _this.output("Reload page to connect to Master");
        //     }
        //     return false;
        // // };
        // var btnNew = document.getElementById("newgamebtn");
        // btnNew.onclick = function (ev) {
        //     if (_this.isInLobby()) {
        //         var name = $("#newgamename").val();
        //         if (!name) {
        //             _this.output("Please enter name for new game");
        //             $("#newgamename").focus();
        //             return false;
        //         } else {
        //             _this.output("New Game");
        //             _this.createRoom(name, {maxPlayers: 2, emptyRoomLiveTime: 30000, 
        //                         suspendedPlayerLiveTime: 30000, 
        //                         customGameProperties: { type: 'Co up', name: name }, 
        //                         propsListedInLobby: ['type', 'name']}); //placeholder to add more properties
        //         }
        //     } else {
        //         _this.output("Reload page to connect to Master");
        //     }
        //     return false;
        // };

        var form = document.getElementById("mainfrm");
        form.onsubmit = function () {
            console.log('is joined to room');
            console.log(_this.isJoinedToRoom());
            return false;
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

        btn = document.getElementById("colorbtn");
        btn.onclick = function (ev) {
            var ind = Math.floor(Math.random() * _this.USERCOLORS.length);
            var color = _this.USERCOLORS[ind];

            _this.myActor().setCustomProperty("color", color);

            _this.sendMessage("... changed his / her color!");
        };

        this.updateRoomButtons();
    };

    // RoomManager.prototype.joinGameHandler = function(gameId) {
    //     if (this.isInLobby()) {
    //         this.output(gameId);
    //         this.joinRoom(gameId);
    //     } else {
    //         this.output("Reload page to connect to Master");
    //     }
    //     return false;
    // }

    RoomManager.prototype.output = function (str, color) {
        var log = document.getElementById("theDialogue");
        var escaped = str.replace(/&/, "&amp;").replace(/</, "&lt;").replace(/>/, "&gt;").replace(/"/, "&quot;");
        if (color) {
            escaped = "<FONT COLOR='" + color + "'>" + escaped + "</FONT>";
        }
        log.innerHTML = log.innerHTML + escaped + "<br>";
        log.scrollTop = log.scrollHeight;
    };

    RoomManager.prototype.updateRoomButtons = function () {
        // var btn;
        // btn = document.getElementById("newgamebtn");
        // btn.disabled = !(this.isInLobby() && !this.isJoinedToRoom());

        // var canJoin = this.isInLobby() && !this.isJoinedToRoom() && this.availableRooms().length > 0;
        // btn = document.getElementById("joingamebtn");
        // btn.disabled = !canJoin;
        // btn = document.getElementById("joinrandomgamebtn");
        // btn.disabled = !canJoin;

        // btn = document.getElementById("leavebtn");
        // btn.disabled = !(this.isJoinedToRoom());
    };
    return RoomManager;
})(Photon.LoadBalancing.LoadBalancingClient);
