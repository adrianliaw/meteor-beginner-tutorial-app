Messages = new Mongo.Collection("messages");
Rooms = new Mongo.Collection("rooms");


FlowRouter.route("/", {
  action() {
    BlazeLayout.render("layout", {body: "RoomList"});
  }
});

FlowRouter.route("/room/:roomId", {
  action({roomId}) {
    BlazeLayout.render("layout", {body: "Room"});
  }
})


if (Meteor.isClient) {

  Template.RoomList.helpers({
    rooms() {
      return Rooms.find();
    }
  });

  Template.RoomList.events({
    "submit #new-room": function(event, template) {
      event.preventDefault();
      let roomId = Rooms.insert({name: template.find("#room-name").value});
      FlowRouter.go(`/room/${roomId}`);
    }
  })

  Template.Room.helpers({
    room() {
      return Rooms.findOne(FlowRouter.current().params.roomId);
    },
    messages() {
      return Messages.find({roomId: FlowRouter.current().params.roomId});
    },
    userDisplayName(userId) {
      let user = Meteor.users.findOne(userId);
      return user ? user.profile.name : "An Anonymous Meteorite";
    }
  });

  Template.Room.events({
    "submit #new-message": function(event, template) {
      event.preventDefault();
      Messages.insert({
        text: template.find("#message-text").value,
        authorId: Meteor.userId(),
        created: new Date(),
        roomId: FlowRouter.current().params.roomId
      });
      template.find("#message-text").value = "";
    } 
  });
}

if (Meteor.isServer) {
  Meteor.startup(() => {
    if (Rooms.findOne() === undefined) {
      let roomId = Rooms.insert({name: "Meteor Chats"});
      Messages.insert({text: "Hello world", roomId: roomId, created: new Date()});
      Messages.insert({text: "Meteor rocks", roomId: roomId, created: new Date()});
    }
  });
}
